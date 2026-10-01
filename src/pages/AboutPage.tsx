import React from 'react';
import { SEO } from '../components/common/SEO.js';
import { ArrowUpRight, MapPin, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext.js';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useData();
  const principles = [
    {
      title: 'Curious & Research-Driven',
      desc: 'We research your market, examine your competitors, and understand your customer psychology before designing or advertising.'
    },
    {
      title: 'Full Intellectual Property Ownership',
      desc: 'You maintain 100% unrestricted ownership of your code, creative assets, ad accounts, and analytics properties. We never lock you into proprietary black boxes.'
    },
    {
      title: 'Measurable Commercial Return',
      desc: 'Vanity follower counts do not pay bills. We judge success by qualified inquiries, user acquisition, and genuine brand identity building.'
    },
    {
      title: 'Nimble & Direct Communication',
      desc: 'No endless layers of account managers. You collaborate directly with experienced designers, developers, and marketers.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="About Digital Hashtag | Creatively Driven Advertising Agency"
        description="Learn about Digital Hashtag, founded in 2020 with offices in Durgapur and Noida. We research, write, design, and promote concepts for your business."
      />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#EE7202]">
            <span>Agency Story</span>
            <span aria-hidden="true">·</span>
            <span>Est. 2020</span>
            <span aria-hidden="true">·</span>
            <span>Digital Hashtag LLP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Creatively driven advertising and digital marketing.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We're a curious, rambunctious bunch of designers, developers, digital marketers, social media pros, and SEM, SMM, and SEO specialists. We research, write, design, and promote concepts for your business.
          </p>
        </div>
      </section>

      {/* Team Visual & Presence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <img
              src={settings?.websiteImages?.aboutTeamImage || "/src/assets/images/agency_team_collaboration_1790755997686.jpg"}
              alt="Digital Hashtag creative and strategic collaboration"
              className="w-full aspect-[16/10] object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
                Our Footprint
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Two offices. Pan-India reach.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Operating with offices in Durgapur (West Bengal) and Noida (NCR) gives our clients direct access to hands-on regional market execution alongside enterprise national capabilities.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Building className="w-4 h-4 text-[#F58220]" />
                  <span>Head Office — Durgapur, West Bengal</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Plot No-449, Ananda Nagar, Opp ITI Institute, Muchipara, Durgapur, West Bengal 713212. Core creative studio and web engineering lab.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Building className="w-4 h-4 text-[#F58220]" />
                  <span>Branch Office — Noida, Uttar Pradesh</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  D – 1701, Antariksh Golf View 2, Sector 78 Noida, Uttar Pradesh 201305. Client management and digital performance advertising hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-2">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
              Agency Principles
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              The standards that guide our work.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((p, idx) => (
              <div
                key={idx}
                className="p-7 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs"
              >
                <h3 className="text-base font-bold text-slate-900">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900">
                Interested in partnering with Digital Hashtag?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Schedule a consultation to discuss your brand and website requirements.
              </p>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-2 shadow-xs active:scale-[0.98]"
            >
              <span>Speak with Our Team</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
