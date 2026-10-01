import React, { useState } from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { IconRenderer } from '../components/common/IconRenderer.js';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { services } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Marketing', 'Development', 'Design', 'Strategy'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="Services & Capabilities | Digital Hashtag"
        description="Explore our full range of services: Web Design & Development, Search Engine Optimization (SEO), Social Media Marketing (SMM), SEM/PPC, Graphic Design, and App Development."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#EE7202]">
            <span>Capabilities & Solutions</span>
            <span aria-hidden="true">·</span>
            <span>Digital Hashtag</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Comprehensive creative and digital services.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From modern responsive website engineering to targeted search engine optimization and creative advertising, every service is tailored to deliver real commercial outcomes.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit mb-12 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-slate-300 p-8 rounded-xl transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F58220] group-hover:scale-105 transition-transform">
                  <IconRenderer name={service.iconName} className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1">
                    {service.category}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#F58220] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                    Key Deliverables
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F58220] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400">Starting at </span>
                  <span className="font-semibold text-slate-900">{service.startingPrice || 'Custom Quote'}</span>
                </div>
                <button
                  onClick={() => navigate(`/services/${service.slug}`)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Consultation Callout */}
        <div className="mt-20 p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Need a custom multi-channel scope?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              We frequently combine custom web development, dedicated SEO campaigns, and managed paid advertising into a unified monthly retainer.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-2 shadow-xs active:scale-[0.98]"
          >
            <span>Discuss Custom Scope</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
