import React from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { IconRenderer } from '../components/common/IconRenderer.js';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, navigate }) => {
  const { services } = useData();
  const service = services.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-36 pb-20 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Service Not Found</h1>
          <p className="text-slate-500 text-sm">The requested service module does not exist or has been moved.</p>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 text-xs font-bold bg-[#F58220] text-white rounded-lg"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title={service.seoTitle || `${service.title} | Digital Hashtag`}
        description={service.seoDesc || service.shortDesc}
        canonicalPath={`/services/${service.slug}`}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Services</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{service.category}</span>
          </button>
        </div>

        {/* Header Block */}
        <div className="space-y-6 pb-12 border-b border-slate-200">
          <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F58220]">
            <IconRenderer name={service.iconName} className="w-7 h-7" />
          </div>

          <div className="space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
              {service.category} Capability Module
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              {service.fullDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg shadow-sm inline-flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
            >
              <span>Schedule Service Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {service.startingPrice && (
              <div className="text-xs text-slate-600 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                Investment: <span className="font-bold text-slate-900">{service.startingPrice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Deliverables & Business Outcomes */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Col 1: Included Deliverables */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Included Deliverables & Scope
            </h2>
            <p className="text-xs text-slate-500">
              Every phase is executed with clear milestones and direct access to our core specialists.
            </p>
            <ul className="space-y-3 pt-2">
              {service.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Tangible Commercial Benefits */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Business Outcomes
            </h2>
            <p className="text-xs text-slate-500">
              How this capability module drives measurable commercial return for your organization.
            </p>
            <ul className="space-y-3 pt-2">
              {service.benefits.map((benefit, idx) => (
                <li key={idx} className="p-4 rounded-lg bg-orange-50/40 border border-orange-100 space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                    <span>Commercial Advantage {idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-700 pl-3.5 leading-relaxed">
                    {benefit}
                  </p>
                </li>
              ))}
            </ul>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-[#F58220]" />
                <span>The Digital Hashtag Commitment</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full code and account ownership, transparent bi-weekly reports, and dedicated account attention without middlemen.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="py-12 border-t border-slate-200 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#F58220] shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Bar */}
        <div className="mt-8 p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Ready to discuss {service.title}?
            </h3>
            <p className="text-xs text-slate-500">
              Schedule a 30-minute discovery call with our team.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shadow-xs"
          >
            <span>Request Proposal</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
