import React from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { Star, ArrowUpRight, Quote, ShieldCheck } from 'lucide-react';

interface TestimonialsPageProps {
  navigate: (path: string) => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ navigate }) => {
  const { testimonials } = useData();

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="Client Testimonials & Feedback | Digital Hashtag"
        description="Read what business owners, managing directors, and founders say about working with Digital Hashtag."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#EE7202]">
            <span>Client Feedback</span>
            <span aria-hidden="true">·</span>
            <span>Digital Hashtag</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            What business leaders say about partnering with us.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We build partnerships grounded in open communication and consistent performance. Here is how our clients describe their experience working with our team.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 p-8 rounded-xl flex flex-col justify-between space-y-6 shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-0.5">
                <div className="font-bold text-slate-900 text-sm">
                  {item.clientName}
                </div>
                <div className="text-xs text-slate-500">
                  {item.clientRole} · {item.company}
                </div>
                <div className="text-[11px] text-[#F58220] pt-1 font-medium">
                  {item.projectType} · {item.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Genuine, Verifiable Client Relationships</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to work with a dedicated agency team?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              We invite prospective clients to speak directly with our team about how we can support your business.
            </p>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-2 shadow-xs"
          >
            <span>Schedule Discovery Call</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
