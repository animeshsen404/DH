import React, { useState } from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { MapPin, Clock, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { JobListing } from '../types/index.js';

interface CareersPageProps {
  navigate: (path: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = () => {
  const { careers, submitApplication } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [applicationJob, setApplicationJob] = useState<JobListing | null>(null);
  const [appForm, setAppForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolioUrl: '',
    resumeText: '',
    coverLetter: '',
    honeypot: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appFeedback, setAppFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleApplyClick = (job: JobListing) => {
    setApplicationJob(job);
    setAppFeedback(null);
    setModalOpen(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationJob) return;

    setIsSubmitting(true);
    setAppFeedback(null);

    const res = await submitApplication({
      jobId: applicationJob.id,
      jobTitle: applicationJob.title,
      ...appForm
    });

    setIsSubmitting(false);

    if (res.success) {
      setAppFeedback({ type: 'success', message: res.message });
      setAppForm({
        applicantName: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolioUrl: '',
        resumeText: '',
        coverLetter: '',
        honeypot: ''
      });
    } else {
      setAppFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title="Careers & Openings | Digital Hashtag"
        description="Join our curious team of designers, developers, and digital marketers at Digital Hashtag in Durgapur and Noida."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200/80 rounded-full text-xs font-semibold text-[#EE7202]">
            <span>Join Our Team</span>
            <span aria-hidden="true">·</span>
            <span>Digital Hashtag</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Build your career with curious creators and engineers.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We value high initiative, technical curiosity, and direct execution. Explore open roles across our Durgapur (West Bengal) and Noida (Uttar Pradesh) offices.
          </p>
        </div>

        {/* Culture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">Direct Impact</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Work on real client campaigns and modern codebases without bureaucratic delays.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">Learning & Certifications</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Support for professional Google, Meta, and development certifications and tools.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">Dual-Hub Collaboration</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Collaborate between our Durgapur studio and Noida office in an energetic agency culture.
            </p>
          </div>
        </div>

        {/* Open Roles */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Open Positions ({careers.length})
          </h2>

          <div className="space-y-4">
            {careers.map((job) => (
              <div
                key={job.id}
                className="p-7 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-[#F58220] font-semibold">
                      {job.department}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {job.type}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Experience: {job.experience}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-900 font-semibold">{job.salaryRange}</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors whitespace-nowrap shadow-xs active:scale-[0.98]"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {job.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 mb-1.5 uppercase text-[11px] tracking-wider">
                      Requirements
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      {job.requirements.slice(0, 3).map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#F58220]">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 mb-1.5 uppercase text-[11px] tracking-wider">
                      Perks & Benefits
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      {job.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {modalOpen && applicationJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <div className="text-xs text-[#F58220] font-semibold">Application Form</div>
                <h3 className="text-lg font-bold text-slate-900">{applicationJob.title}</h3>
                <div className="text-xs text-slate-500">{applicationJob.location}</div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {appFeedback ? (
              <div
                className={`p-6 rounded-xl border text-center space-y-3 ${
                  appFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="font-bold text-base">
                  {appFeedback.type === 'success' ? 'Application Received' : 'Submission Error'}
                </div>
                <p className="text-xs leading-relaxed">{appFeedback.message}</p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-4 px-4 py-2 text-xs font-bold bg-[#F58220] text-white rounded-lg"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <input
                  type="text"
                  name="honeypot"
                  value={appForm.honeypot}
                  onChange={(e) => setAppForm({ ...appForm, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={appForm.applicantName}
                      onChange={(e) => setAppForm({ ...appForm, applicantName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@example.com"
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-[#F58220]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={appForm.phone}
                      onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      LinkedIn / Portfolio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={appForm.linkedin}
                      onChange={(e) => setAppForm({ ...appForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resume Summary & Experience <span className="text-[#F58220]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Paste a summary of your professional experience, tools, and recent projects..."
                    value={appForm.resumeText}
                    onChange={(e) => setAppForm({ ...appForm, resumeText: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#F58220] focus:bg-white rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Confidential Candidate Review</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
