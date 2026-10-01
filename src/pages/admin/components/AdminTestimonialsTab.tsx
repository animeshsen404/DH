import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, MessageSquare, X, CheckCircle2 } from 'lucide-react';
import type { Testimonial } from '../../../types/index.js';

interface AdminTestimonialsTabProps {
  testimonials: Testimonial[];
  token: string | null;
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
  onShowFeedback: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminTestimonialsTab: React.FC<AdminTestimonialsTabProps> = ({
  testimonials,
  token,
  isAdmin,
  onRefresh,
  onShowFeedback
}) => {
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setIsCreating(true);
    setEditingItem({
      clientName: '',
      clientRole: 'Managing Director',
      company: '',
      location: 'Durgapur, WB',
      content: '',
      rating: 5,
      projectType: 'Web Development & Performance SEO',
      featured: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });
  };

  const handleEdit = (item: Testimonial) => {
    setIsCreating(false);
    setEditingItem({ ...item });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onShowFeedback(`Testimonial from "${name}" deleted.`);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to delete review', 'error');
      }
    } catch {
      onShowFeedback('Network error deleting review', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.clientName || !editingItem.content) return;

    try {
      setLoading(true);
      const isNew = isCreating || !editingItem.id;
      const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${editingItem.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingItem)
      });

      if (res.ok) {
        onShowFeedback(isNew ? 'New testimonial added!' : 'Testimonial updated!');
        setEditingItem(null);
        setIsCreating(false);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to save testimonial', 'error');
      }
    } catch {
      onShowFeedback('Network error saving review', 'error');
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
              Verified Feedback & Endorsements
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {testimonials.length} Reviews
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Client Testimonials & Trust Signals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage genuine client endorsements and reviews displayed on the homepage and <span className="font-semibold text-slate-700">/testimonials</span>.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Modal Form */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F58220]/10 text-[#F58220] rounded-lg">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isCreating ? 'Add Client Testimonial' : `Edit Review by ${editingItem.clientName}`}
                  </h3>
                  <p className="text-xs text-slate-500">Live trust signals</p>
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

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.clientName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    placeholder="e.g. Rajesh Ghosh"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Role / Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.clientRole || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientRole: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. Bengal Precision Engineering"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    placeholder="Durgapur, WB"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Type
                </label>
                <input
                  type="text"
                  value={editingItem.projectType || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, projectType: e.target.value })}
                  placeholder="e.g. Web Design & National SEO"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Quote / Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="What was the measurable outcome and agency experience..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={editingItem.featured ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="rounded text-[#F58220] focus:ring-[#F58220]"
                />
                <label htmlFor="featured-toggle" className="text-xs text-slate-700 font-medium">
                  Feature prominently on Homepage
                </label>
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
                  {loading ? 'Saving...' : isCreating ? 'Save Testimonial' : 'Update Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[#F58220]">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Edit review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item.id, item.clientName)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic mb-4 line-clamp-4">
                "{item.content}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs">
                {item.clientName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">{item.clientName}</div>
                <div className="text-[11px] text-slate-500 truncate">
                  {item.clientRole} · {item.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
