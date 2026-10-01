import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { DataProvider } from './context/DataContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { ServiceDetailPage } from './pages/ServiceDetailPage.js';
import { PortfolioPage } from './pages/PortfolioPage.js';
import { PortfolioDetailPage } from './pages/PortfolioDetailPage.js';
import { TestimonialsPage } from './pages/TestimonialsPage.js';
import { GalleryPage } from './pages/GalleryPage.js';
import { BlogPage } from './pages/BlogPage.js';
import { BlogPostPage } from './pages/BlogPostPage.js';
import { CareersPage } from './pages/CareersPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.js';
import { TermsPage } from './pages/TermsPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Resolver
  const renderPage = () => {
    // Exact paths
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (currentPath === '/services') {
      return <ServicesPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/portfolio') {
      return <PortfolioPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/portfolio/')) {
      const slug = currentPath.replace('/portfolio/', '');
      return <PortfolioDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/testimonials') {
      return <TestimonialsPage navigate={navigate} />;
    }
    if (currentPath === '/gallery') {
      return <GalleryPage navigate={navigate} />;
    }
    if (currentPath === '/blog') {
      return <BlogPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/careers') {
      return <CareersPage navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }
    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage navigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <TermsPage navigate={navigate} />;
    }
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return <AdminDashboard navigate={navigate} />;
    }

    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <AuthProvider>
      <DataProvider>
        <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-[#F58220] selection:text-white">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <main className="flex-grow">
            {renderPage()}
          </main>
          <Footer navigate={navigate} />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
