import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Layers, AlertCircle, Sparkles, Tag, ArrowUpRight } from 'lucide-react';
import type { Service } from '../../../types/index.js';
import { IconRenderer } from '../../../components/common/IconRenderer.js';

interface AdminServicesTabProps {
  services: Service[];
  token: string | null;
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
  onShowFeedback: (msg: string, type?: 'success' | 'error') => void;
  navigate: (path: string) => void;
}

export const AdminServicesTab: React.FC<AdminServicesTabProps> = ({
  services,
  token,
  isAdmin,
  onRefresh,
  onShowFeedback,
  navigate
}) => {
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableIcons = [
    'Code', 'Search', 'Share2', 'Target', 'Smartphone', 'Palette',
    'TrendingUp', 'Zap', 'Globe', 'BarChart3', 'Layers', 'Sparkles', 'ShieldCheck'
  ];

  const handleOpenAddModal = () => {
    setIsCreating(true);
    setEditingService({
      title: '',
      slug: '',
      shortDesc: '',
      fullDesc: '',
      iconName: 'Code',
      category: 'Marketing',
      startingPrice: '₹14,999',
      deliverables: [
        'Strategic discovery and audience mapping',
        'Custom execution and continuous optimization',
        'Transparent bi-weekly reporting dashboard'
      ],
      benefits: [
        'Higher inbound lead conversion rate',
        'Direct return on marketing ad spend'
      ]
    });
  };

  const handleEdit = (srv: Service) => {
    setIsCreating(false);
    setEditingService({ ...srv });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onShowFeedback(`Service "${title}" deleted successfully.`);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to delete service', 'error');
      }
    } catch {
      onShowFeedback('Network error deleting service', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    setLoading(true);
    try {
      const isNew = isCreating || !editingService.id;
      const url = isNew ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PUT';

      // Auto-generate slug if missing
      const slug = editingService.slug?.trim() || editingService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const payload = {
        ...editingService,
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
        onShowFeedback(isNew ? 'New service added and published live!' : 'Service updated successfully!');
        setEditingService(null);
        setIsCreating(false);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to save service', 'error');
      }
    } catch (err: any) {
      onShowFeedback(err.message || 'Error saving service', 'error');
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
              Capability Modules
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {services.length} Total
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Agency Services & Commercial Offerings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new capabilities or edit deliverables, starting pricing markers, and detailed scopes. Changes reflect live on the website instantly.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Service Modal Form */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F58220]/10 text-[#F58220] rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isCreating ? 'Add New Agency Service' : `Edit ${editingService.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">Live capability module on digitalhashtag.in</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
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
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g. Local SEO Dominance"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingService.slug || ''}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="e.g. local-seo-dominance (auto-generated if empty)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingService.category || 'Marketing'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Strategy">Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={editingService.iconName || 'Code'}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Starting Price
                  </label>
                  <input
                    type="text"
                    value={editingService.startingPrice || ''}
                    onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                    placeholder="e.g. ₹19,999"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description (Card Summary) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  placeholder="Concise overview communicating commercial value..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Detailed Description (Service Detail Page)
                </label>
                <textarea
                  rows={4}
                  value={editingService.fullDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  placeholder="In-depth methodology, commercial scope, technical stack..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deliverables (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={Array.isArray(editingService.deliverables) ? editingService.deliverables.join('\n') : ''}
                    onChange={(e) => setEditingService({ ...editingService, deliverables: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Audit & benchmark&#10;On-page schema&#10;Rank tracking"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Commercial Benefits (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={Array.isArray(editingService.benefits) ? editingService.benefits.join('\n') : ''}
                    onChange={(e) => setEditingService({ ...editingService, benefits: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Higher search ranking&#10;Qualified inbound inquiries"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
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
                  {loading ? 'Saving...' : isCreating ? 'Publish New Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#F58220]/10 text-[#F58220]">
                    <IconRenderer name={srv.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{srv.title}</h3>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {srv.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(srv)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(srv.id, srv.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                {srv.shortDesc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {srv.deliverables?.length || 0} Deliverables
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">
                  {srv.startingPrice || 'Custom'}
                </span>
                <button
                  onClick={() => navigate(`/services/${srv.slug}`)}
                  className="text-[#F58220] hover:text-[#e07316] font-semibold flex items-center gap-0.5 text-[11px]"
                >
                  Live <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
