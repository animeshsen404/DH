import React, { useState } from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { IconRenderer } from '../components/common/IconRenderer.js';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { services, portfolio, blog, testimonials, submitEnquiry, settings } = useData();

  // Consultation form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'Web Design & Custom Development',
    budget: '₹25,000 - ₹50,000',
    timeline: 'Within 1 month',
    message: '',
    honeypot: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormFeedback(null);

    const res = await submitEnquiry(formData);
    setFormSubmitting(false);

    if (res.success) {
      setFormFeedback({ type: 'success', message: res.message });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceInterest: 'Web Design & Custom Development',
        budget: '₹25,000 - ₹50,000',
        timeline: 'Within 1 month',
        message: '',
        honeypot: ''
      });
    } else {
      setFormFeedback({ type: 'error', message: res.message });
    }
  };

  const workflowSteps = [
    { number: '01', title: 'Discover', desc: 'We audit your market presence, competitors, and growth objectives.' },
    { number: '02', title: 'Plan', desc: 'Architecting the strategy, keyword clusters, and user journeys.' },
    { number: '03', title: 'Design', desc: 'Crafting brand identities, wireframes, and conversion interfaces.' },
    { number: '04', title: 'Build', desc: 'Developing clean, modern responsive code and ad infrastructure.' },
    { number: '05', title: 'Launch', desc: 'Rigorous QA testing, deployment, and live campaign activation.' },
    { number: '06', title: 'Grow', desc: 'Continuous measurement, conversion optimization, and scaling.' }
  ];

  const differentiators = [
    {
      title: 'End-to-End Creative & Engineering',
      desc: 'We handle every stage internally—from research and creative copywriting to full-stack code and performance advertising.'
    },
    {
      title: '100% Asset & Account Ownership',
      desc: 'You maintain full, unrestricted ownership of your code, design assets, ad accounts, and analytics properties.'
    },
    {
      title: 'Nimble & Direct Collaboration',
      desc: 'No layers of middle managers. You work directly with experienced marketers and engineers who execute the work.'
    },
    {
      title: 'Transparent Strategy & Reporting',
      desc: 'Clear communication, measurable milestones, and transparent monthly performance data without vanity metrics.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEO
        title="Digital Hashtag | Creatively Driven Advertising & Digital Marketing Agency"
        description="Digital Hashtag is a creatively driven advertising and digital agency based in Durgapur and Noida. We research, write, design, and promote concepts for your business."
      />

      {/* 1. HERO SECTION: Clean, Confident, Corporate */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#EE7202]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                <span>Creatively Driven Advertising Agency</span>
                <span aria-hidden="true" className="text-orange-300">·</span>
                <span>Est. 2020</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                We create your brand's digital identity and drive real business growth.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Digital Hashtag is a full-service creative advertising and marketing agency. We research, write, design, and promote concepts that build visibility, generate qualified leads, and establish lasting digital presence.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
                >
                  <span>Request a Consultation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-xs"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Office Trust Markers */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-slate-600 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F58220]" />
                    <span>Durgapur (HQ)</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">West Bengal, India</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F58220]" />
                    <span>Noida Hub</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Uttar Pradesh, India</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Full Spectrum
                  </div>
                  <div className="text-slate-500 mt-0.5">Design · Web · Search · Ads</div>
                </div>
              </div>
            </div>

            {/* Right Visual: Clean Studio Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
                <img
                  src={settings?.websiteImages?.heroBannerImage || "/src/assets/images/hero_creative_agency_1790755973218.jpg"}
                  alt="Digital Hashtag modern agency studio"
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Digital Hashtag Team</div>
                    <div className="text-slate-500">Designers, Developers & Marketers</div>
                  </div>
                  <button
                    onClick={() => navigate('/about')}
                    className="text-[#F58220] hover:text-[#E07010] font-semibold inline-flex items-center gap-1"
                  >
                    <span>Our Story</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION: Clear, uncrowded, structured */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
              Our Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive digital services tailored to your business needs.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We provide integrated digital marketing, design, and software engineering services designed to give your company a distinct competitive edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-slate-300 p-7 rounded-xl transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F58220] group-hover:scale-105 transition-transform">
                    <IconRenderer name={service.iconName} className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 mb-1">
                      {service.category}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#F58220] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Clean deliverable highlights */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F58220] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Starting at {service.startingPrice || 'Custom Quote'}
                  </span>
                  <button
                    onClick={() => navigate(`/services/${service.slug}`)}
                    className="text-xs font-bold text-slate-900 group-hover:text-[#F58220] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>View All Capabilities & Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. ABOUT DIGITAL HASHTAG: Real Content from Original Website */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
                About Digital Hashtag
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                A curious, dedicated team focused on research, design, and execution.
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                We're a curious, rambunctious bunch of designers, developers, digital marketers, social media pros, and SEM, SMM, and SEO specialists. We research, write, design, and promote concepts for your business.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Founded in 2020, Digital Hashtag operates from our head office in Durgapur, West Bengal and our branch office in Sector 78 Noida, Uttar Pradesh. Our team is nimble and responsive, combining technical rigor with creative advertising instinct.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="text-xl font-bold text-slate-900">2020</div>
                  <div className="text-xs text-slate-500 mt-0.5">Year Founded</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="text-xl font-bold text-slate-900">2 Offices</div>
                  <div className="text-xs text-slate-500 mt-0.5">Durgapur & Noida</div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#F58220] hover:text-[#E07010] transition-colors"
                >
                  <span>Read our full company story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <img
                  src={settings?.websiteImages?.aboutTeamImage || "/src/assets/images/agency_team_collaboration_1790755997686.jpg"}
                  alt="Digital Hashtag creative and engineering team"
                  className="w-full aspect-[16/10] object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 border-t border-slate-100 space-y-1">
                  <div className="font-bold text-sm text-slate-900">Collaborative Strategy & Execution</div>
                  <p className="text-xs text-slate-500">
                    Cross-functional collaboration between marketing strategists and full-stack developers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORK / PORTFOLIO: High-Impact Presentations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
                Featured Work
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Recent projects and client engagements.
              </h2>
              <p className="text-slate-600 text-sm">
                A selection of our website design, search engine optimization, and digital campaign work.
              </p>
            </div>
            <button
              onClick={() => navigate('/portfolio')}
              className="text-xs font-bold text-[#F58220] hover:text-[#E07010] inline-flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
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
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs font-medium text-slate-400">
                      {item.industry} · {item.client}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#F58220] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>

                    {/* Clean metric highlights */}
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
                    <span>View Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESS: Discover -> Plan -> Design -> Build -> Launch -> Grow */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-2">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
              Our Process
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A disciplined, transparent delivery framework.
            </h2>
            <p className="text-slate-600 text-sm">
              From the initial strategic discovery to ongoing growth, we follow a simple, structured approach.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="p-5 bg-white border border-slate-200 rounded-xl space-y-2"
              >
                <div className="text-xs font-mono font-bold text-[#F58220]">
                  {step.number}
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY DIGITAL HASHTAG: Clean Differentiators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-2">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
              Why Choose Us
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why clients partner with Digital Hashtag.
            </h2>
            <p className="text-slate-600 text-sm">
              We build long-term relationships through genuine accountability and commercial focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {differentiators.map((diff, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2"
              >
                <h3 className="font-bold text-slate-900 text-base">
                  {diff.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {diff.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS: Genuine Client Feedback */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-2">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
              Client Feedback
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              What business leaders say about working with us.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-7 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-6 shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">
                    {item.clientName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.clientRole}, {item.company}
                  </div>
                  <div className="text-[11px] text-[#F58220] mt-0.5">
                    {item.projectType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BLOG / INSIGHTS: Editorial Layout */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
                Insights & Knowledge
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Latest articles from our marketing & web team.
              </h2>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="text-xs font-bold text-[#F58220] hover:text-[#E07010] inline-flex items-center gap-1.5"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blog.slice(0, 3).map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="text-xs text-slate-400 font-medium">
                      {post.category} · {post.publishedAt} · {post.readTime}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#F58220] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <span className="text-xs font-bold text-[#F58220] group-hover:text-[#E07010] inline-flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA & INTAKE FORM: Clean, Professional, Trusted */}
      <section id="consultation" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <div className="text-xs uppercase font-bold tracking-wider text-[#F58220]">
              Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Let's build something that moves your business forward.
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Tell us about your project requirements. Our strategy team in Durgapur and Noida will respond within 24 business hours.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-2xl shadow-sm">
            {formFeedback ? (
              <div
                className={`p-6 rounded-xl border text-center space-y-3 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="font-bold text-base">
                  {formFeedback.type === 'success' ? 'Consultation Request Received' : 'Error Sending Request'}
                </div>
                <p className="text-xs leading-relaxed">{formFeedback.message}</p>
                {formFeedback.type === 'success' && (
                  <button
                    onClick={() => setFormFeedback(null)}
                    className="mt-3 px-4 py-2 text-xs font-bold bg-[#F58220] hover:bg-[#E07010] text-white rounded-lg transition-colors"
                  >
                    Submit Another Request
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Silent Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Name <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900 placeholder-slate-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@company.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900 placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number (WhatsApp) <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900 placeholder-slate-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Skyline Logistics"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900 placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Primary Service Focus
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="Complete Agency Growth Retainer">Full Agency Retainer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    >
                      <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000</option>
                      <option value="₹30,000 - ₹60,000">₹30,000 - ₹60,000</option>
                      <option value="₹60,000 - ₹1,20,000">₹60,000 - ₹1,20,000</option>
                      <option value="₹1,20,000+">₹1,20,000+ / enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Target Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    >
                      <option value="Immediate (1-2 weeks)">Immediate (1-2 weeks)</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Next quarter">Next quarter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Project Details & Objectives <span className="text-[#F58220]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe what your business needs, website URL if existing, and key goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by Anti-Spam & Strictly Confidential</span>
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] disabled:opacity-50 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
                  >
                    <span>{formSubmitting ? 'Sending Details...' : 'Submit Consultation Request'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
