import React, { useState } from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { Mail, Phone, MapPin, Clock, ArrowUpRight, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { settings, services, faqs, submitEnquiry } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'Search Engine Optimization (SEO)',
    budget: '₹30,000 - ₹60,000',
    timeline: 'Immediate (1-2 weeks)',
    message: '',
    honeypot: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const res = await submitEnquiry(formData);
    setSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceInterest: 'Search Engine Optimization (SEO)',
        budget: '₹30,000 - ₹60,000',
        timeline: 'Immediate (1-2 weeks)',
        message: '',
        honeypot: ''
      });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="Contact Digital Hashtag | Offices in Durgapur & Noida"
        description="Connect with Digital Hashtag for digital marketing, web development, and branding. Phone: +91 7047702073, Email: digitalhashtagllp@gmail.com."
        canonicalPath="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#EE7202]">
            <span>Get in Touch</span>
            <span aria-hidden="true">·</span>
            <span>Digital Hashtag</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Let's discuss how we can create your digital identity.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Reach out directly to our team in Durgapur or Noida. Whether you need a full website build, an ongoing SEO campaign, or creative social media branding, we're ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-8 sm:p-10 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Request a Consultation or Proposal
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Complete the details below and an agency strategist will respond within 24 business hours.
            </p>

            {feedback ? (
              <div
                className={`p-6 rounded-xl border text-center space-y-3 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="font-bold text-base">
                  {feedback.type === 'success' ? 'Request Sent Successfully' : 'Error Sending Request'}
                </div>
                <p className="text-xs leading-relaxed">{feedback.message}</p>
                {feedback.type === 'success' && (
                  <button
                    onClick={() => setFeedback(null)}
                    className="mt-3 px-4 py-2 text-xs font-bold bg-[#F58220] hover:bg-[#E07010] text-white rounded-lg transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sourav Mukherjee"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Email <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sourav@company.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bengal Logistics"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Service Needed
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    >
                      <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000</option>
                      <option value="₹30,000 - ₹60,000">₹30,000 - ₹60,000</option>
                      <option value="₹60,000 - ₹1,20,000">₹60,000 - ₹1,20,000</option>
                      <option value="₹1,20,000+">₹1,20,000+ / enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    >
                      <option value="Immediate (1-2 weeks)">Immediate (1-2 weeks)</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Next quarter">Next quarter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tell us about your project <span className="text-[#F58220]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide your website link if you have one, your main commercial goals, and any specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Honeypot Spam Protected</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shadow-xs active:scale-[0.98]"
                  >
                    {submitting ? 'Submitting Details...' : 'Submit Consultation Request'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Channels & Verified Addresses */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base">
                Direct Contact Channels
              </h3>
              <div className="space-y-3 text-xs">
                <a
                  href={`tel:${settings?.phone || '+917047702073'}`}
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-800 transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4 text-[#F58220] shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Call / WhatsApp</div>
                    <div className="text-slate-500">{settings?.phone || '+91 7047702073'}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${settings?.email || 'digitalhashtagllp@gmail.com'}`}
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-800 transition-colors shadow-xs"
                >
                  <Mail className="w-4 h-4 text-[#F58220] shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Email Address</div>
                    <div className="text-slate-500">{settings?.email || 'digitalhashtagllp@gmail.com'}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Working Hours</div>
                    <div className="text-slate-500">{settings?.hours || 'Mon–Sat: 10:00 AM – 7:00 PM IST'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Head Office Durgapur Card */}
            <div className="p-7 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <MapPin className="w-4 h-4 text-[#F58220]" />
                <span>Head Office — Durgapur, West Bengal</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {settings?.headOfficeAddress || 'Plot No-449, Ananda Nagar, Opp ITI Institute, Muchipara, Durgapur, West Bengal 713212, India'}
              </p>
            </div>

            {/* Branch Office Noida Card */}
            <div className="p-7 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <MapPin className="w-4 h-4 text-[#F58220]" />
                <span>Branch Office — Noida, Uttar Pradesh</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {settings?.branchOfficeAddress || 'D – 1701, Antariksh Golf View 2, Sector 78 Noida, Gautam Buddha Nagar, Uttar Pradesh 201305, India'}
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-20 pt-16 border-t border-slate-200 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">
              Common questions about working with Digital Hashtag.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-100/60 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#F58220] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
