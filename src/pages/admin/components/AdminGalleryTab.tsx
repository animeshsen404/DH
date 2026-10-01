import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload, Image as ImageIcon, ExternalLink, X, Calendar, AlertCircle } from 'lucide-react';
import type { GalleryItem } from '../../../types/index.js';

interface AdminGalleryTabProps {
  gallery: GalleryItem[];
  token: string | null;
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
  onShowFeedback: (msg: string, type?: 'success' | 'error') => void;
  navigate: (path: string) => void;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({
  gallery,
  token,
  isAdmin,
  onRefresh,
  onShowFeedback,
  navigate
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const categories = ['Team', 'Office', 'Projects', 'Creative', 'Events', 'Studio'];

  const handleOpenAddModal = () => {
    setEditingItem({
      title: '',
      category: 'Team',
      imageUrl: '',
      caption: '',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setImagePreview(item.imageUrl);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);

      // Upload to server endpoint
      try {
        setUploading(true);
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            dataUrl,
            filename: file.name.split('.')[0]
          })
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setEditingItem(prev => ({ ...prev, imageUrl: data.url }));
          onShowFeedback('Image uploaded successfully!');
        } else {
          // If server fails upload, use dataUrl directly
          setEditingItem(prev => ({ ...prev, imageUrl: dataUrl }));
        }
      } catch {
        setEditingItem(prev => ({ ...prev, imageUrl: dataUrl }));
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete photo "${title}" from gallery?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        onShowFeedback(`Photo "${title}" removed from gallery.`);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to delete photo', 'error');
      }
    } catch {
      onShowFeedback('Network error deleting photo', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title || !editingItem.imageUrl) {
      onShowFeedback('Title and image are required', 'error');
      return;
    }

    try {
      const isNew = !editingItem.id;
      const url = isNew ? '/api/admin/gallery' : `/api/admin/gallery/${editingItem.id}`;
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
        onShowFeedback(isNew ? 'New photo added to gallery!' : 'Gallery photo updated!');
        setIsModalOpen(false);
        setEditingItem(null);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to save photo', 'error');
      }
    } catch {
      onShowFeedback('Network error saving photo', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
              Agency Media & Studio Photos
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {gallery.length} Photos
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Gallery Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload new office moments, team sprints, and project showcases. Managed photos appear live on the public <span className="font-semibold text-slate-700">/gallery</span> page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/gallery')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span>Live Gallery</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F58220]/10 text-[#F58220] rounded-lg">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingItem.id ? 'Edit Gallery Photo' : 'Upload New Gallery Photo'}
                  </h3>
                  <p className="text-xs text-slate-500">Add high-resolution agency moments</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Noida Studio Creative Sprint"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category || 'Team'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingItem.createdAt || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, createdAt: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              {/* Image Input Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image Source <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => {
                      setEditingItem({ ...editingItem, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Enter image URL or choose file below..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Processing File...' : 'Upload File from Computer'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">JPG, PNG, WebP up to 10MB</span>
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {imagePreview && (
                  <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100 max-h-48 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="Short context about the workspace, team sprint, or client session..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {editingItem.id ? 'Save Changes' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gallery.map((photo) => (
          <div
            key={photo.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31727560fa?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 rounded shadow-xs">
                  {photo.category}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{photo.title}</h3>
                {photo.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3 h-3" />
                {photo.createdAt}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(photo)}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                  title="Edit photo info"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id, photo.title)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
