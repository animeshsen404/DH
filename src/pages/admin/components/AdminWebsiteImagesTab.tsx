import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, RotateCcw, AlertCircle, Save } from 'lucide-react';
import type { SiteSettings } from '../../../types/index.js';

interface AdminWebsiteImagesTabProps {
  settings: SiteSettings;
  token: string | null;
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
  onShowFeedback: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminWebsiteImagesTab: React.FC<AdminWebsiteImagesTabProps> = ({
  settings,
  token,
  isAdmin,
  onRefresh,
  onShowFeedback
}) => {
  const defaultImages = {
    heroBannerImage: '/src/assets/images/hero_creative_agency_1790755973218.jpg',
    aboutTeamImage: '/src/assets/images/agency_team_collaboration_1790755997686.jpg',
    officeWorkspaceImage: '/src/assets/images/office_workspace_loft_1790756025261.jpg',
    portfolioBannerImage: '/src/assets/images/portfolio_web_showcase_1790756013525.jpg'
  };

  const [images, setImages] = useState({
    heroBannerImage: settings.websiteImages?.heroBannerImage || defaultImages.heroBannerImage,
    aboutTeamImage: settings.websiteImages?.aboutTeamImage || defaultImages.aboutTeamImage,
    officeWorkspaceImage: settings.websiteImages?.officeWorkspaceImage || defaultImages.officeWorkspaceImage,
    portfolioBannerImage: settings.websiteImages?.portfolioBannerImage || defaultImages.portfolioBannerImage
  });

  const [loading, setLoading] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    if (settings.websiteImages) {
      setImages({
        heroBannerImage: settings.websiteImages.heroBannerImage || defaultImages.heroBannerImage,
        aboutTeamImage: settings.websiteImages.aboutTeamImage || defaultImages.aboutTeamImage,
        officeWorkspaceImage: settings.websiteImages.officeWorkspaceImage || defaultImages.officeWorkspaceImage,
        portfolioBannerImage: settings.websiteImages.portfolioBannerImage || defaultImages.portfolioBannerImage
      });
    }
  }, [settings]);

  const handleFileUpload = (key: keyof typeof images, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImages(prev => ({ ...prev, [key]: dataUrl }));

      try {
        setUploadingKey(key);
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            dataUrl,
            filename: `site_${key}_${Date.now()}`
          })
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setImages(prev => ({ ...prev, [key]: data.url }));
          onShowFeedback('Image uploaded! Click Save to apply to live website.');
        }
      } catch {
        onShowFeedback('File stored locally as preview. Click Save to apply.', 'success');
      } finally {
        setUploadingKey(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onShowFeedback('Admin privileges required to modify site assets', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/admin/website-images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(images)
      });

      if (res.ok) {
        onShowFeedback('Website images updated! All live pages updated immediately.');
        await onRefresh();
      } else {
        const data = await res.json();
        onShowFeedback(data.error || 'Failed to update website images', 'error');
      }
    } catch {
      onShowFeedback('Network error updating images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = (key: keyof typeof images) => {
    setImages(prev => ({ ...prev, [key]: defaultImages[key] }));
    onShowFeedback(`Reset ${key} to agency default asset.`);
  };

  const imageSlots = [
    {
      key: 'heroBannerImage' as const,
      label: 'Homepage Hero Section Photo',
      description: 'Main visual showcased right next to the value proposition on the homepage.',
      aspect: 'aspect-[4/3]'
    },
    {
      key: 'aboutTeamImage' as const,
      label: 'Agency Team & About Page Visual',
      description: 'Used in the About Digital Hashtag section and the culture footprint on /about.',
      aspect: 'aspect-[16/10]'
    },
    {
      key: 'officeWorkspaceImage' as const,
      label: 'Office Workspace Loft',
      description: 'Features our physical presence in Durgapur and Noida creative workspaces.',
      aspect: 'aspect-[4/3]'
    },
    {
      key: 'portfolioBannerImage' as const,
      label: 'Web Showcase & Engineering Lab',
      description: 'Features sub-second web applications and case study previews.',
      aspect: 'aspect-[16/9]'
    }
  ];

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
              Media Customization
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Website Images & Brand Assets
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify or replace hero banners, team collaboration photos, and workspace images shown across the live website.
          </p>
        </div>

        {isAdmin && (
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#F58220] hover:bg-[#e07316] rounded-lg shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Website Images'}</span>
          </button>
        )}
      </div>

      {/* Image Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageSlots.map((slot) => {
          const currentUrl = images[slot.key];
          const isUploading = uploadingKey === slot.key;

          return (
            <div
              key={slot.key}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{slot.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                      {slot.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetToDefault(slot.key)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                    title="Reset to default image"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Preview Box */}
                <div className={`relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 ${slot.aspect} my-3`}>
                  <img
                    src={currentUrl}
                    alt={slot.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultImages[slot.key];
                    }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-xs font-semibold">
                      Uploading image...
                    </div>
                  )}
                </div>

                {/* Image URL & File Upload Input */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Image URL or Path
                  </label>
                  <input
                    type="text"
                    value={currentUrl}
                    onChange={(e) => setImages({ ...images, [slot.key]: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#F58220] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Replacement</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(slot.key, e)}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400">Live preview active</span>
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
};
