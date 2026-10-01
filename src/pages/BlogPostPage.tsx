import React, { useState } from 'react';
import { useData } from '../context/DataContext.js';
import { SEO } from '../components/common/SEO.js';
import { ArrowLeft, ArrowRight, Share2, Check } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, navigate }) => {
  const { blog } = useData();
  const [copied, setCopied] = useState(false);

  const post = blog.find(b => b.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-36 pb-20 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
          <p className="text-slate-500 text-sm">The article you are looking for does not exist or has been moved.</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-4 py-2 text-xs font-bold bg-[#F58220] text-white rounded-lg"
          >
            Return to Blog
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedPosts = blog
    .filter(b => b.id !== post.id && (b.category === post.category || b.tags.some(t => post.tags.includes(t))))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20">
      <SEO
        title={post.seoTitle || `${post.title} | Digital Hashtag Blog`}
        description={post.seoDesc || post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          image: post.coverImage,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            '@type': 'Person',
            name: post.author.name
          },
          publisher: {
            '@type': 'Organization',
            name: 'Digital Hashtag',
            logo: {
              '@type': 'ImageObject',
              url: 'https://digitalhashtag.in/logo.svg'
            }
          },
          description: post.excerpt
        }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs & Share */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{post.category}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-4 pb-8 border-b border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            {post.category} · Published {post.publishedAt} · {post.readTime}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-full bg-orange-100 text-[#F58220] flex items-center justify-center font-bold text-xs">
              {post.author.name.charAt(0)}
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-900">{post.author.name}</div>
              <div className="text-slate-500">{post.author.role}</div>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Body Content */}
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 pt-4 pb-1">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-6 pb-2">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n- ');
              return (
                <ul key={index} className="space-y-2 list-disc pl-5 text-slate-700">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\.\s/.test(paragraph)) {
              const items = paragraph.split(/\n\d+\.\s/);
              return (
                <ol key={index} className="space-y-2 list-decimal pl-5 text-slate-700">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                  ))}
                </ol>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Topics */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Topics:</span>
          <div className="flex flex-wrap gap-2 text-xs text-slate-700">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="mt-10 p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F58220] flex items-center justify-center font-bold text-base shrink-0">
            {post.author.name.charAt(0)}
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-900 text-sm">{post.author.name}</div>
            <div className="text-slate-600">
              {post.author.role} at Digital Hashtag. Leading marketing research and client campaigns from our Durgapur and Noida hubs.
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => {
                    navigate(`/blog/${rel.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer space-y-2 group shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="text-[11px] text-slate-400">
                    {rel.category} · {rel.readTime}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#F58220] transition-colors">
                    {rel.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
