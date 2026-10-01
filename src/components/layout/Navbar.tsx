import React, { useState, useEffect } from 'react';
import { Logo } from '../brand/Logo.js';
import { Menu, X, ArrowUpRight, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm py-2.5'
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Brand Logo (Exact official logo) */}
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] rounded-md transition-opacity hover:opacity-95"
              aria-label="Digital Hashtag - We Create Your Identity"
            >
              <Logo size="md" />
            </button>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
              {navLinks.map((link) => {
                const isActive =
                  currentPath === link.path ||
                  (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#F58220] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] rounded ${
                      isActive ? 'text-[#F58220] font-semibold' : 'text-slate-700'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F58220] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Primary CTA & Quick Links */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+917047702073"
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#F58220] transition-colors py-1.5 px-2.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#F58220]" />
                <span>+91 7047702073</span>
              </a>

              {user ? (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
                  title="Signed in to Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="hidden md:inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1.5 rounded transition-colors whitespace-nowrap"
                >
                  Admin
                </button>
              )}

              <button
                onClick={() => handleLinkClick('/contact')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-[0.98]"
              >
                <span>Get a Quote</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile menu hamburger toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F58220]"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = currentPath === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleLinkClick(link.path)}
                      className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-orange-50 text-[#F58220] border-l-4 border-[#F58220] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between"
                >
                  <span>Admin Management</span>
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <a
                href="tel:+917047702073"
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors font-medium"
              >
                <Phone className="w-4 h-4 text-[#F58220]" />
                <span>+91 7047702073</span>
              </a>

              <button
                onClick={() => handleLinkClick('/contact')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-all shadow-sm"
              >
                <span>Request Free Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
