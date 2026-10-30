import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="glass-card rounded-3xl p-10 shadow-lg space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200/50 flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Page Off The Map</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
          The destination you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-md shadow-brand-600/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};
