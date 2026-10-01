export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  passwordHash?: string;
  isDefaultPassword?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  category: 'Marketing' | 'Development' | 'Design' | 'Strategy';
  deliverables: string[];
  benefits: string[];
  startingPrice?: string;
  faqs?: { q: string; a: string }[];
  seoTitle?: string;
  seoDesc?: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  year: string;
  coverImage: string;
  summary: string;
  challenge: string;
  solution: string;
  results: MetricItem[];
  tags: string[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  liveUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  seoTitle?: string;
  seoDesc?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  location: string;
  content: string;
  rating: number;
  avatar?: string;
  projectType: string;
  featured: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Pricing' | 'Process' | 'SEO' | 'Development';
  order: number;
}

export interface JobListing {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  perks: string[];
  isOpen: boolean;
  postedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolioUrl?: string;
  resumeText: string;
  coverLetter?: string;
  status: 'new' | 'reviewed' | 'interviewing' | 'rejected' | 'hired';
  submittedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterest: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  notes?: string;
  submittedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export interface PageMeta {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  headOfficeAddress: string;
  branchOfficeAddress: string;
  hours: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  notifyEmail: string;
  emailAlertsEnabled: boolean;
  websiteImages?: {
    heroBannerImage?: string;
    aboutTeamImage?: string;
    officeWorkspaceImage?: string;
    portfolioBannerImage?: string;
  };
}

export interface AppDatabase {
  users: User[];
  services: Service[];
  portfolio: PortfolioItem[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  careers: JobListing[];
  applications: JobApplication[];
  enquiries: Enquiry[];
  gallery: GalleryItem[];
  pagesMeta: PageMeta[];
  settings: SiteSettings;
  notificationsLog: {
    id: string;
    type: 'enquiry' | 'application';
    recipient: string;
    subject: string;
    body: string;
    sentAt: string;
    status: 'sent' | 'stored_locally';
  }[];
}
