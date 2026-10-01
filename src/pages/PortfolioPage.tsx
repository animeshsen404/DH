import React, { useState } from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface PortfolioPageProps {
  navigate: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ navigate }) => {
  const { portfolio } = useData();
  const [filterTag, setFilterTag] = useState<string>('All');

  const tags = ['All', 'Web Development', 'Technical SEO', 'Google Ads', 'Meta Ads', 'Local SEO'];

  const filteredItems = filterTag === 'All'
    ? portfolio
    : portfolio.filter(item => item.tags.includes(filterTag));

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="Portfolio & Case Studies | Digital Hashtag"
        description="Explore our work and client case studies across web design, SEO, and paid media advertising."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#EE7202]">
            <span>Client Work & Proof</span>
            <span aria-hidden="true">·</span>
            <span>Digital Hashtag</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Our work and project case studies.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We evaluate our marketing and engineering by the commercial results delivered to our clients. Explore verified engagements across diverse industries.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit mb-12 overflow-x-auto max-w-full">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterTag === t
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-medium text-white bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded">
                    <span>{item.client}</span>
                    <span>{item.year}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-xs text-slate-400 font-medium">
                    {item.industry} · {item.tags.join(' / ')}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#F58220] transition-colors">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  {/* Highlights */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {item.results.slice(0, 2).map((res, i) => (
                      <div key={i}>
                        <span className="font-bold text-slate-900">{res.value}</span>{' '}
                        <span className="text-slate-500">{res.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => navigate(`/portfolio/${item.slug}`)}
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Ready to create your brand's success story?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              We conduct a thorough audit of your current digital setup before recommending a custom scope.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shadow-xs"
          >
            <span>Request Agency Audit</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
