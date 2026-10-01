import React from 'react';
import { SEO } from '../components/common/SEO.js';
import { Home, Compass } from 'lucide-react';

interface NotFoundProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 pt-36 pb-20 flex items-center justify-center">
      <SEO
        title="404 - Page Not Found | Digital Hashtag"
        description="The requested page could not be found on Digital Hashtag."
      />

      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <div className="text-6xl sm:text-7xl font-mono font-extrabold text-[#F58220] tabular-nums">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The link you followed may have been updated, renamed, or moved.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07010] rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => navigate('/services')}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Services</span>
          </button>
        </div>
      </div>
    </div>
  );
};
