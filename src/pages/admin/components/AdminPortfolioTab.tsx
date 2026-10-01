import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUpRight, Briefcase, X, TrendingUp } from 'lucide-react';
import type { PortfolioItem } from '../../../types/index.js';

interface AdminPortfolioTabProps {
  portfolio: PortfolioItem[];
  token: string | null;
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
  onShowFeedback: (msg: string, type?: 'success' | 'error') => void;
  navigate: (path: string) => void;
}

export const AdminPortfolioTab: React.FC<AdminPortfolioTabProps> = ({
  portfolio,
  token,
  isAdmin,
  onRefresh,
  onShowFeedback,
  navigate
}) => {
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setIsCreating(true);
    setEditingItem({
      title: '',
      slug: '',
      client: '',
      industry: 'Manufacturing',
      year: '2026',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      summary: '',
      challenge: '',
      solution: '',
      results: [
        { label: 'Organic Traffic', value: '+240%' },
        { label: 'Conversion Rate', value: '4.8%' }
      ],
      tags: ['SEO', 'Web Design', 'Analytics']
    });
  };

  const handleEdit = (item: PortfolioItem) => {
    setIsCreating(false);
    setEditingItem({ ...item });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete case study "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onShowFeedback(`Case study "${title}" deleted.`);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to delete case study', 'error');
      }
    } catch {
      onShowFeedback('Network error deleting case study', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title) return;

    try {
      setLoading(true);
      const isNew = isCreating || !editingItem.id;
      const url = isNew ? '/api/admin/portfolio' : `/api/admin/portfolio/${editingItem.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const slug = editingItem.slug?.trim() || editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const payload = {
        ...editingItem,
        slug
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onShowFeedback(isNew ? 'Case study posted successfully!' : 'Case study updated!');
        setEditingItem(null);
        setIsCreating(false);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to save case study', 'error');
      }
    } catch {
      onShowFeedback('Network error saving case study', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
              Case Studies & Portfolio
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {portfolio.length} Projects
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Client Success Stories & Deliverables
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage case study narratives, quantified performance metrics, challenge/solution breakdowns, and testimonial endorsements.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Case Study</span>
          </button>
        )}
      </div>

      {/* Modal Form */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F58220]/10 text-[#F58220] rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isCreating ? 'Post New Case Study' : `Edit ${editingItem.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">Live on /portfolio and /portfolio/:slug</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project / Case Study Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Modern Industrial Portal & Organic Lead Funnel"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="e.g. industrial-portal-lead-funnel"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.client || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    placeholder="e.g. Bengal Spun Pipes"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={editingItem.industry || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, industry: e.target.value })}
                    placeholder="e.g. Industrial / Healthcare / Retail"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={editingItem.year || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingItem.coverImage || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
                  value={editingItem.summary || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="High-level commercial takeaway..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    The Challenge
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.challenge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, challenge: e.target.value })}
                    placeholder="What commercial obstacles or technical debt existed prior..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    The Solution
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.solution || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, solution: e.target.value })}
                    placeholder="How Digital Hashtag researched, engineered, and executed..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : ''}
                  onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="SEO, Web Design, Performance Optimization"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : isCreating ? 'Publish Case Study' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 rounded shadow-xs">
                  {item.industry}
                </span>
              </div>

              <div className="p-4 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500">
                  {item.client} · {item.year}
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {item.results?.length || 0} metrics tracked
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/portfolio/${item.slug}`)}
                  className="p-1 text-slate-400 hover:text-[#F58220] transition-colors"
                  title="View Live Case Study"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                  title="Edit Case Study"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Delete Case Study"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
