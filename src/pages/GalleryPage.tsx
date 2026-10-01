import React, { useState } from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { ArrowUpRight, X, Image as ImageIcon, ZoomIn, Calendar, Tag } from 'lucide-react';
import type { GalleryItem } from '../types/index.js';

interface GalleryPageProps {
  navigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ navigate }) => {
  const { gallery } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Team', 'Office', 'Projects', 'Creative', 'Events'];

  const filteredPhotos = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="Agency Gallery & Studio Moments | Digital Hashtag"
        description="Explore photos from our creative studios, team sprints, client events, and office moments across Durgapur and Noida."
        canonicalPath="/gallery"
      />

      {/* Page Header */}
      <section className="pt-28 pb-14 border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F58220] mb-3 inline-block">
              Culture & Work Environment
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Agency Gallery & Studio Moments
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              A behind-the-scenes window into our creative workspaces, technical workshops, team culture, and collaborative problem-solving across our Durgapur and Noida offices.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-200/60">
            {categories.map((cat) => {
              const count = cat === 'All' ? gallery.length : gallery.filter(g => g.category?.toLowerCase() === cat.toLowerCase()).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#F58220] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No photos in this category yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Check back soon or select another category to view our agency moments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className="group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#F58220]/50 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback image if broken
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31727560fa?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-md">
                        <ZoomIn className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-800 rounded-md shadow-xs border border-slate-200/80">
                        {photo.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-[#F58220] transition-colors line-clamp-1 mb-1.5">
                        {photo.title}
                      </h3>
                      {photo.caption && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {photo.caption}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {photo.createdAt}
                      </span>
                      <span className="font-semibold text-[#F58220] flex items-center gap-0.5">
                        View photo <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Banner */}
          <div className="mt-20 p-8 sm:p-12 rounded-2xl bg-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F58220] mb-2 block">
                Work With Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Want to build your next breakthrough with our team?
              </h2>
              <p className="text-sm text-slate-300">
                Let's discuss how our technical engineering and ROI-focused marketing strategies can scale your business.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3.5 bg-[#F58220] hover:bg-[#e07316] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Schedule a Discovery Call</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] bg-slate-950 flex items-center justify-center">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31727560fa?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-slate-900">{activePhoto.title}</h3>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                  {activePhoto.category}
                </span>
              </div>
              {activePhoto.caption && (
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {activePhoto.caption}
                </p>
              )}
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Captured: {activePhoto.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
