import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUpRight, FileText, X, Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '../../../types/index.js';

interface AdminBlogTabProps {
  blog: BlogPost[];
  token: string | null;
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
  onShowFeedback: (msg: string, type?: 'success' | 'error') => void;
  navigate: (path: string) => void;
}

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({
  blog,
  token,
  isAdmin,
  onRefresh,
  onShowFeedback,
  navigate
}) => {
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Search Engine Optimization', 'Web Engineering', 'Performance Marketing', 'Brand Identity', 'Conversion Rate'];

  const handleOpenAdd = () => {
    setIsCreating(true);
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '## Executive Summary\n\nExplain the commercial opportunity and strategic context here...\n\n## Actionable Methodology\n\n1. First principle\n2. Technical execution\n3. Measurement and scaling\n\n## Conclusion',
      coverImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80',
      category: 'Search Engine Optimization',
      author: {
        name: 'Technical Marketing Team',
        role: 'Digital Hashtag Engineering',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      readTime: '5 min read',
      publishedAt: new Date().toISOString().split('T')[0],
      isPublished: true,
      tags: ['Strategy', 'Growth', '2026']
    });
  };

  const handleEdit = (post: BlogPost) => {
    setIsCreating(false);
    setEditingPost({ ...post });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onShowFeedback(`Article "${title}" deleted.`);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to delete article', 'error');
      }
    } catch {
      onShowFeedback('Network error deleting article', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    try {
      setLoading(true);
      const isNew = isCreating || !editingPost.id;
      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${editingPost.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const slug = editingPost.slug?.trim() || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const payload = {
        ...editingPost,
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
        onShowFeedback(isNew ? 'Article published live!' : 'Article updated successfully!');
        setEditingPost(null);
        setIsCreating(false);
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to save article', 'error');
      }
    } catch {
      onShowFeedback('Network error saving article', 'error');
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
              Editorial & Content Marketing
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {blog.length} Articles
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Articles, Guides & Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish research-backed strategies and technical guides. Live on the public <span className="font-semibold text-slate-700">/blog</span> publication.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Modal Form */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F58220]/10 text-[#F58220] rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isCreating ? 'Create New Article' : `Edit ${editingPost.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">Editorial article with SEO tags and structured data</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingPost(null);
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
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="e.g. Core Web Vitals in 2026: Sub-Second Load Speeds"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    placeholder="e.g. core-web-vitals-guide-2026"
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
                    value={editingPost.category || 'Search Engine Optimization'}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={editingPost.readTime || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    placeholder="e.g. 6 min read"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPost.isPublished ? 'published' : 'draft'}
                    onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.value === 'published' })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingPost.coverImage || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary Excerpt
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="2-3 sentences summarizing the practical takeaway..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Article Body (Markdown Supported)
                </label>
                <textarea
                  rows={8}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Write in standard Markdown format (# Heading, ## Section, bullet points)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
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
                  {loading ? 'Saving...' : isCreating ? 'Publish Article' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blog.map((post) => (
          <div
            key={post.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded shadow-xs ${
                  post.isPublished ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                }`}>
                  {post.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>

              <div className="p-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F58220]">
                  {post.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{post.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="p-1 text-slate-400 hover:text-[#F58220] transition-colors"
                  title="View Live Article"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                  title="Edit Article"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Delete Article"
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
