import React from 'react';
import { SEO } from '../components/common/SEO.js';
import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="Terms of Service | Digital Hashtag"
        description="Terms of service and commercial standards for Digital Hashtag LLP."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="space-y-6">
          <div className="space-y-1 border-b border-slate-200 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-500">
              Effective Date: March 2026 · Digital Hashtag LLP
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Commercial Engagement Framework</h2>
              <p>
                All web design, technical SEO, social media marketing, and paid advertising engagements executed by Digital Hashtag LLP are governed by mutually agreed project proposals detailing milestones, deliverable specifications, and payment terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Intellectual Property & Code Ownership</h2>
              <p>
                Upon final settlement of contract invoices, full legal ownership of developed source code, custom graphic artwork, brand assets, and content copy transfers unconditionally to the client. Digital Hashtag retains no proprietary lock-ins on client infrastructure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Governing Law & Jurisdiction</h2>
              <p>
                These terms are governed by the laws of India. Any legal disputes arising from agreements executed with Digital Hashtag LLP shall fall under the competent courts of West Bengal, India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
