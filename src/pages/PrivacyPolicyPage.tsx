import React from 'react';
import { SEO } from '../components/common/SEO.js';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  navigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="Privacy Policy | Digital Hashtag"
        description="Privacy policy and data protection standards for Digital Hashtag LLP."
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
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500">
              Last Updated: March 2026 · Digital Hashtag LLP
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Scope and Commitment</h2>
              <p>
                Digital Hashtag LLP ("Digital Hashtag", "we", "us", or "our") respects the privacy of our website visitors, prospective partners, job candidates, and clients. This document details how we collect, store, and safeguard information submitted through https://digitalhashtag.in.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
              <p>
                We only collect information voluntarily provided when you request a proposal, submit a consultation inquiry, or apply for a career role. This typically includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Name, email address, and WhatsApp/phone contact number.</li>
                <li>Company name, project scope, budget specifications, and timelines.</li>
                <li>Resume details, LinkedIn profiles, and portfolio links for job candidates.</li>
                <li>Standard server telemetry (IP address, browser type) used for security audits and spam mitigation.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Zero Third-Party Data Monetization</h2>
              <p>
                We do not sell, rent, trade, or monetize client or candidate contact information under any circumstances. Inquiries are used exclusively to evaluate project requirements and coordinate discovery discussions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Contact Regarding Your Data</h2>
              <p>
                To request permanent deletion or rectification of your submitted project inquiries or resume records, please contact our data officer directly at <a href="mailto:digitalhashtagllp@gmail.com" className="text-[#F58220] underline">digitalhashtagllp@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
