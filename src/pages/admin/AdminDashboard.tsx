import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useData } from '../../context/DataContext.js';
import { SEO } from '../../components/common/SEO.js';
import { Logo } from '../../components/brand/Logo.js';
import {
  ShieldCheck,
  LogOut,
  ExternalLink,
  Users,
  Briefcase,
  FileText,
  Layers,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Download,
  AlertCircle,
  KeyRound,
  Image as ImageIcon,
  Mail,
  Eye,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import type {
  Enquiry,
  JobApplication,
  Service,
  PortfolioItem,
  BlogPost,
  Testimonial,
  FAQItem,
  JobListing,
  PageMeta,
  SiteSettings,
  GalleryItem
} from '../../types/index.js';

import { AdminCredentialsModal } from './components/AdminCredentialsModal.js';
import { AdminServicesTab } from './components/AdminServicesTab.js';
import { AdminGalleryTab } from './components/AdminGalleryTab.js';
import { AdminWebsiteImagesTab } from './components/AdminWebsiteImagesTab.js';
import { AdminPortfolioTab } from './components/AdminPortfolioTab.js';
import { AdminBlogTab } from './components/AdminBlogTab.js';
import { AdminTestimonialsTab } from './components/AdminTestimonialsTab.js';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { user, token, login, logout, isAdmin, isEditor } = useAuth();
  const { refreshData: refreshPublicData } = useData();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'services'
    | 'gallery'
    | 'website-images'
    | 'portfolio'
    | 'blog'
    | 'testimonials'
    | 'enquiries'
    | 'careers'
    | 'faqs'
    | 'settings'
  >('overview');

  // Credentials Modal State
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  // Admin Data state
  const [adminData, setAdminData] = useState<{
    stats: any;
    enquiries: Enquiry[];
    applications: JobApplication[];
    services: Service[];
    portfolio: PortfolioItem[];
    blog: BlogPost[];
    testimonials: Testimonial[];
    faqs: FAQItem[];
    careers: JobListing[];
    gallery: GalleryItem[];
    pagesMeta: PageMeta[];
    settings: SiteSettings;
    notificationsLog: any[];
  } | null>(null);

  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Enquiry status filter
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'new' | 'in-progress' | 'closed'>('all');

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage(null);
    }, 4500);
  };

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      setLoadingData(true);
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
      } else {
        showFeedback('Failed to load administrative overview', 'error');
      }
    } catch (err: any) {
      showFeedback('Server error connecting to database', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // Synchronize admin and public website data
  const handleFullRefresh = async () => {
    await fetchAdminData();
    await refreshPublicData();
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    const res = await login(loginEmail, loginPass);
    setLoginLoading(false);
    if (!res.success) {
      setLoginError(res.error || 'Authentication rejected. Verify your credentials.');
    }
  };

  // Enquiry status update
  const handleUpdateEnquiryStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'closed') => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showFeedback(`Enquiry marked as ${newStatus}`);
        fetchAdminData();
      }
    } catch {
      showFeedback('Failed to update status', 'error');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback('Enquiry deleted');
        fetchAdminData();
      }
    } catch {
      showFeedback('Failed to delete enquiry', 'error');
    }
  };

  const handleDownloadBackup = () => {
    window.open('/api/admin/backup', '_blank');
  };

  // Unauthenticated Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <SEO
          title="Admin Authentication | Digital Hashtag"
          description="Secure administrative management portal for Digital Hashtag operations."
        />

        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-block p-2 rounded-xl bg-white border border-slate-100 shadow-xs mb-2">
              <Logo size="md" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agency Admin Portal</h1>
            <p className="text-xs text-slate-500">
              Sign in to manage services, gallery photos, case studies, blog articles, and client leads.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@digitalhashtag.in"
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 bg-[#F58220] hover:bg-[#e07316] text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loginLoading ? 'Verifying Session...' : 'Authenticate & Sign In'}</span>
            </button>
          </form>

          {/* Helper Credentials Box */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-[#F58220]" />
              <span>Default Administrator Access:</span>
            </div>
            <div className="font-mono text-slate-600">
              admin@digitalhashtag.in / DigitalHashtag2026!
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">
              You can change this default email and password anytime from inside the admin panel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'services', label: 'Services', icon: Layers, badge: adminData?.services.length },
    { id: 'gallery', label: 'Gallery Photos', icon: ImageIcon, badge: adminData?.gallery?.length },
    { id: 'website-images', label: 'Website Images', icon: Eye },
    { id: 'portfolio', label: 'Case Studies', icon: Briefcase, badge: adminData?.portfolio.length },
    { id: 'blog', label: 'Blog & Articles', icon: FileText, badge: adminData?.blog.length },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, badge: adminData?.testimonials.length },
    { id: 'enquiries', label: 'Leads & Enquiries', icon: Mail, badge: adminData?.enquiries.filter(e => e.status === 'new').length },
    { id: 'careers', label: 'Careers & Hiring', icon: Users, badge: adminData?.applications.filter(a => a.status === 'new').length },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'settings', label: 'Settings & Security', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SEO
        title="Agency Operations Console | Digital Hashtag"
        description="Unified management dashboard for Digital Hashtag services, gallery photos, and leads."
      />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div onClick={() => navigate('/')} className="cursor-pointer">
                <Logo size="sm" />
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 rounded-md border border-slate-200">
                Admin Console
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="View Live Public Website"
              >
                <span>View Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsCredentialsModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-[#F58220] rounded-lg flex items-center gap-1.5 transition-colors"
                title="Change Login Email & Password"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#F58220]" />
                <span className="hidden sm:inline">Change Credentials</span>
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F58220]/10 border border-[#F58220]/20 flex items-center justify-center text-xs font-bold text-[#F58220]">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-900 truncate max-w-[120px]">{user?.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Security Warning Banner if using Default Credentials */}
        {user?.isDefaultPassword && (
          <div className="bg-amber-50 border-t border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Security Notice:</strong> You are currently using default login credentials. We strongly recommend changing them now.
              </span>
            </div>
            <button
              onClick={() => setIsCredentialsModalOpen(true)}
              className="px-3 py-1 text-xs font-bold bg-[#F58220] hover:bg-[#e07316] text-white rounded-md shadow-xs transition-colors shrink-0"
            >
              Change Login Credentials
            </button>
          </div>
        )}

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#F58220] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Action Message Feedback */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 ${
              actionMessage.type === 'success'
                ? 'bg-white text-emerald-800 border-emerald-200 shadow-emerald-500/10'
                : 'bg-white text-red-800 border-red-200 shadow-red-500/10'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div
                onClick={() => setActiveTab('enquiries')}
                className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-[#F58220] hover:shadow-xs transition-all"
              >
                <div className="text-xs text-slate-500 font-medium">New Leads</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {adminData?.stats.newEnquiries || 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {adminData?.stats.totalEnquiries || 0} Total Enquiries
                </div>
              </div>

              <div
                onClick={() => setActiveTab('services')}
                className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-[#F58220] hover:shadow-xs transition-all"
              >
                <div className="text-xs text-slate-500 font-medium">Services</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {adminData?.services.length || 0}
                </div>
                <div className="text-[11px] text-[#F58220] font-semibold mt-1">
                  + Add New Service
                </div>
              </div>

              <div
                onClick={() => setActiveTab('gallery')}
                className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-[#F58220] hover:shadow-xs transition-all"
              >
                <div className="text-xs text-slate-500 font-medium">Gallery Photos</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {adminData?.gallery?.length || 0}
                </div>
                <div className="text-[11px] text-[#F58220] font-semibold mt-1">
                  Live on /gallery
                </div>
              </div>

              <div
                onClick={() => setActiveTab('portfolio')}
                className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-[#F58220] hover:shadow-xs transition-all"
              >
                <div className="text-xs text-slate-500 font-medium">Case Studies</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {adminData?.portfolio.length || 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Portfolio items</div>
              </div>

              <div
                onClick={() => setActiveTab('blog')}
                className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-[#F58220] hover:shadow-xs transition-all"
              >
                <div className="text-xs text-slate-500 font-medium">Articles</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {adminData?.blog.length || 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Blog publications</div>
              </div>

              <div
                onClick={() => setActiveTab('careers')}
                className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-[#F58220] hover:shadow-xs transition-all"
              >
                <div className="text-xs text-slate-500 font-medium">Applications</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {adminData?.stats.newApplications || 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {adminData?.careers.filter(c => c.isOpen).length || 0} Open Roles
                </div>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Recent Commercial Enquiries</h3>
                  <p className="text-xs text-slate-500">Inbound project requests submitted via public consultation forms.</p>
                </div>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs font-semibold text-[#F58220] hover:underline"
                >
                  View All Enquiries →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {adminData?.enquiries.slice(0, 5).map((enq) => (
                  <div key={enq.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{enq.name}</span>
                        {enq.company && (
                          <span className="text-[11px] text-slate-500 font-medium">· {enq.company}</span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          enq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                          enq.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1">{enq.message}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>{enq.email}</span>
                        {enq.phone && <span>{enq.phone}</span>}
                        <span>{enq.serviceInterest}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateEnquiryStatus(enq.id, enq.status === 'new' ? 'in-progress' : 'closed')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        {enq.status === 'new' ? 'Mark In Progress' : 'Close Lead'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. SERVICES TAB */}
        {activeTab === 'services' && (
          <AdminServicesTab
            services={adminData?.services || []}
            token={token}
            isAdmin={isAdmin}
            onRefresh={handleFullRefresh}
            onShowFeedback={showFeedback}
            navigate={navigate}
          />
        )}

        {/* 3. GALLERY PHOTOS TAB */}
        {activeTab === 'gallery' && (
          <AdminGalleryTab
            gallery={adminData?.gallery || []}
            token={token}
            isAdmin={isAdmin}
            onRefresh={handleFullRefresh}
            onShowFeedback={showFeedback}
            navigate={navigate}
          />
        )}

        {/* 4. WEBSITE IMAGES TAB */}
        {activeTab === 'website-images' && adminData?.settings && (
          <AdminWebsiteImagesTab
            settings={adminData.settings}
            token={token}
            isAdmin={isAdmin}
            onRefresh={handleFullRefresh}
            onShowFeedback={showFeedback}
          />
        )}

        {/* 5. CASE STUDIES TAB */}
        {activeTab === 'portfolio' && (
          <AdminPortfolioTab
            portfolio={adminData?.portfolio || []}
            token={token}
            isAdmin={isAdmin}
            onRefresh={handleFullRefresh}
            onShowFeedback={showFeedback}
            navigate={navigate}
          />
        )}

        {/* 6. BLOG / ARTICLES TAB */}
        {activeTab === 'blog' && (
          <AdminBlogTab
            blog={adminData?.blog || []}
            token={token}
            isAdmin={isAdmin}
            onRefresh={handleFullRefresh}
            onShowFeedback={showFeedback}
            navigate={navigate}
          />
        )}

        {/* 7. TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <AdminTestimonialsTab
            testimonials={adminData?.testimonials || []}
            token={token}
            isAdmin={isAdmin}
            onRefresh={handleFullRefresh}
            onShowFeedback={showFeedback}
          />
        )}

        {/* 8. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Commercial Inquiries & Form Submissions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Filter by status, update leads, and maintain discovery notes.</p>
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'new', 'in-progress', 'closed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      enquiryFilter === st
                        ? 'bg-[#F58220] text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {adminData?.enquiries
                .filter(e => enquiryFilter === 'all' || e.status === enquiryFilter)
                .map((enq) => (
                  <div key={enq.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{enq.name}</span>
                          {enq.company && (
                            <span className="text-xs text-slate-500 font-semibold">({enq.company})</span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            enq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                            enq.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {enq.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-4">
                          <span>📧 {enq.email}</span>
                          {enq.phone && <span>📞 {enq.phone}</span>}
                          <span>🎯 {enq.serviceInterest}</span>
                          {enq.budget && <span>💰 {enq.budget}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                          className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
                      {enq.message}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 9. CAREERS TAB */}
        {activeTab === 'careers' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Careers & Applicant Resumes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Review candidate submissions and manage job openings across Durgapur and Noida.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Listings */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Active Job Postings ({adminData?.careers.length || 0})</h3>
                {adminData?.careers.map((job) => (
                  <div key={job.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{job.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        job.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {job.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{job.department} · {job.location} · {job.salaryRange}</div>
                  </div>
                ))}
              </div>

              {/* Candidate Applications */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Candidate Submissions ({adminData?.applications.length || 0})</h3>
                {adminData?.applications.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                    No job applications submitted yet.
                  </div>
                ) : (
                  adminData?.applications.map((app) => (
                    <div key={app.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{app.applicantName}</span>
                        <span className="text-[11px] text-slate-500">{app.jobTitle}</span>
                      </div>
                      <div className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {app.resumeText}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 10. FAQS TAB */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage customer FAQs displayed on the contact and service pages.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminData?.faqs.map((faq) => (
                <div key={faq.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F58220]">{faq.category}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{faq.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. SETTINGS & SECURITY TAB */}
        {activeTab === 'settings' && adminData?.settings && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Platform Settings & Security</h2>
                <p className="text-xs text-slate-500 mt-0.5">Admin credentials, office addresses, and database backups.</p>
              </div>

              <button
                onClick={() => setIsCredentialsModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Login Credentials</span>
              </button>
            </div>

            {/* Database Storage & Backup */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Database Storage & Exports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All services, gallery photos, case studies, blog posts, and enquiries are maintained persistently in <span className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">data/database.json</span>.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete JSON Backup</span>
                </button>
              </div>
            </div>

            {/* Verified Office Addresses */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Verified Office Locations</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-800">Head Office (Durgapur): </span>
                  {adminData.settings.headOfficeAddress}
                </div>
                <div>
                  <span className="font-bold text-slate-800">Branch Office (Noida): </span>
                  {adminData.settings.branchOfficeAddress}
                </div>
                <div>
                  <span className="font-bold text-slate-800">Direct Contact: </span>
                  {adminData.settings.phone} · {adminData.settings.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Credentials Modal */}
      <AdminCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onSuccess={(msg) => showFeedback(msg, 'success')}
      />
    </div>
  );
};
