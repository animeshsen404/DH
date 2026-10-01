import React from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { ArrowLeft, ArrowUpRight, Star } from 'lucide-react';

interface PortfolioDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const PortfolioDetailPage: React.FC<PortfolioDetailPageProps> = ({ slug, navigate }) => {
  const { portfolio } = useData();
  const item = portfolio.find(p => p.slug === slug);

  if (!item) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-36 pb-20 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Case Study Not Found</h1>
          <p className="text-slate-500 text-sm">The requested case study could not be located.</p>
          <button
            onClick={() => navigate('/portfolio')}
            className="px-4 py-2 text-xs font-bold bg-[#F58220] text-white rounded-lg"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title={`${item.title} | Case Study | Digital Hashtag`}
        description={item.summary}
        canonicalPath={`/portfolio/${item.slug}`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Case Studies</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{item.client}</span>
          </button>
        </div>

        {/* Title Header */}
        <div className="space-y-4 pb-8 border-b border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            {item.client} · {item.industry} · {item.year}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {item.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {item.summary}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {item.tags.map((tag, i) => (
              <span key={i} className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Project Cover Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full aspect-[16/9] object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Key Results Banner */}
        <div className="my-10 p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs uppercase font-bold tracking-wider text-[#F58220] mb-6">
            Key Outcomes Delivered
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {item.results.map((res, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {res.value}
                </div>
                <div className="text-xs text-slate-500">{res.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The Challenge & Solution */}
        <div className="space-y-8 py-6 border-b border-slate-200">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              The Challenge
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {item.challenge}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Our Strategic & Engineering Approach
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {item.solution}
            </p>
          </div>
        </div>

        {/* Client Quote if available */}
        {item.testimonialQuote && (
          <div className="my-10 p-8 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-slate-800 italic leading-relaxed">
              "{item.testimonialQuote}"
            </p>
            {item.testimonialAuthor && (
              <div className="text-xs font-bold text-[#F58220]">
                — {item.testimonialAuthor}
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Plan your next digital milestone with Digital Hashtag
            </h3>
            <p className="text-xs text-slate-500">
              Clear timelines, transparent milestone proposals, and full account ownership.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-2 shadow-xs"
          >
            <span>Start a Conversation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
