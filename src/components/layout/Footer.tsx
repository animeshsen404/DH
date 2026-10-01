import React from 'react';
import { Logo } from '../brand/Logo.js';
import { Mail, Phone, MapPin, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext.js';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings, services } = useData();

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1D24] text-slate-300 text-sm border-t border-slate-800">
      {/* Top Banner Call to Action */}
      <div className="border-b border-slate-800/80 bg-[#14161C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Ready to create your brand's digital identity?
            </h3>
            <p className="text-slate-400 text-sm">
              Schedule a strategy consultation with our Durgapur and Noida agency team.
            </p>
          </div>
          <button
            onClick={() => handleNav('/contact')}
            className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-all shadow-sm inline-flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
          >
            <span>Request a Consultation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2.5 rounded-lg inline-block shadow-sm">
              <Logo size="sm" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Creatively driven advertising and digital marketing agency based in India. We research, write, design, and promote concepts for your business, helping brands establish lasting digital identities.
            </p>
            <div className="text-xs text-slate-400 pt-1 space-y-1">
              <div>Digital Hashtag LLP · Incorporated in 2020</div>
              <div>Operating from Durgapur (WB) & Noida (NCR)</div>
            </div>
          </div>

          {/* Col 2: Services Directory */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">
              Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {services.slice(0, 6).map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => handleNav(`/services/${srv.slug}`)}
                    className="hover:text-[#F58220] transition-colors text-left"
                  >
                    {srv.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-[#F58220] transition-colors">
                  About Digital Hashtag
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/portfolio')} className="hover:text-[#F58220] transition-colors">
                  Our Work & Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery')} className="hover:text-[#F58220] transition-colors">
                  Agency Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/testimonials')} className="hover:text-[#F58220] transition-colors">
                  Client Testimonials
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/blog')} className="hover:text-[#F58220] transition-colors">
                  Insights & Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/careers')} className="hover:text-[#F58220] transition-colors">
                  Careers & Hiring
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-[#F58220] transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/admin')} className="hover:text-[#F58220] transition-colors inline-flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Access</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Office Locations */}
          <div className="space-y-4 text-xs">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">
              Offices & Contact
            </h4>

            <div className="space-y-1">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
                <span>Head Office — Durgapur</span>
              </div>
              <p className="text-slate-400 pl-5 leading-normal">
                {settings?.headOfficeAddress || 'Plot No-449, Ananda Nagar, Opp ITI Institute, Muchipara, Durgapur, West Bengal 713212'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
                <span>Branch Office — Noida</span>
              </div>
              <p className="text-slate-400 pl-5 leading-normal">
                {settings?.branchOfficeAddress || 'D – 1701, Antariksh Golf View 2, Sector 78 Noida, Uttar Pradesh 201305'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F58220]" />
                <a href={`tel:${settings?.phone || '+917047702073'}`} className="hover:text-white">
                  {settings?.phone || '+91 7047702073'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F58220]" />
                <a href={`mailto:${settings?.email || 'digitalhashtagllp@gmail.com'}`} className="hover:text-white">
                  {settings?.email || 'digitalhashtagllp@gmail.com'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{settings?.hours || 'Mon–Sat: 10:00 AM – 7:00 PM IST'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Legal */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Digital Hashtag LLP. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('/privacy-policy')} className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('/terms')} className="hover:text-slate-200 transition-colors">
              Terms of Service
            </button>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
