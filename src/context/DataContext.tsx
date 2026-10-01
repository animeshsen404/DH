import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Service, PortfolioItem, BlogPost, Testimonial, FAQItem, JobListing, SiteSettings, PageMeta, GalleryItem } from '../types/index.js';

interface DataContextType {
  services: Service[];
  portfolio: PortfolioItem[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  careers: JobListing[];
  gallery: GalleryItem[];
  settings: SiteSettings | null;
  pagesMeta: PageMeta[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  submitEnquiry: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    serviceInterest?: string;
    budget?: string;
    timeline?: string;
    message: string;
    honeypot?: string;
  }) => Promise<{ success: boolean; message: string }>;
  submitApplication: (data: {
    jobId: string;
    jobTitle: string;
    applicantName: string;
    email: string;
    phone?: string;
    linkedin?: string;
    portfolioUrl?: string;
    resumeText: string;
    coverLetter?: string;
    honeypot?: string;
  }) => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [careers, setCareers] = useState<JobListing[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pagesMeta, setPagesMeta] = useState<PageMeta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/public/data');
      if (!res.ok) throw new Error('Failed to load site data');
      const data = await res.json();
      setServices(data.services || []);
      setPortfolio(data.portfolio || []);
      setBlog(data.blog || []);
      setTestimonials(data.testimonials || []);
      setFaqs(data.faqs || []);
      setCareers(data.careers || []);
      setGallery(data.gallery || []);
      setSettings(data.settings || null);
      setPagesMeta(data.pagesMeta || []);
    } catch (err: any) {
      console.error('Error fetching public data:', err);
      setError(err.message || 'Unable to connect to service backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitEnquiry = async (formData: any): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to submit inquiry' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error submitting form' };
    }
  };

  const submitApplication = async (formData: any): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/public/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to submit job application' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error submitting application' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        services,
        portfolio,
        blog,
        testimonials,
        faqs,
        careers,
        gallery,
        settings,
        pagesMeta,
        isLoading,
        error,
        refreshData: fetchData,
        submitEnquiry,
        submitApplication
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
