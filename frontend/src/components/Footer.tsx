import React from 'react';
import { Compass, ShieldCheck, Sparkles, Server, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-mono font-black text-2xl text-white tracking-wider">VOYEX</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-5 leading-relaxed">
              Autonomous, bespoke day-by-day travel intelligence with deterministic TSP route optimization, padlock activity pinning, and instant multi-format dossier exports.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-conscious AI &bull; Pinned stops preserved &bull; Zero-cost stack</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/discover" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  Discover Destinations
                </Link>
              </li>
              <li>
                <Link to="/wizard" className="hover:text-white transition-colors">
                  Trip Planner Wizard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Saved Itineraries
                </Link>
              </li>
              <li>
                <a href="/health" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  API Health Status
                </a>
              </li>
            </ul>
          </div>

          {/* Engine & Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Tech Architecture</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Express & Node.js (TypeScript)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                <span>Google Gemini Flash 2.5</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>OSRM & TSP Route Optimizer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Supabase PostgreSQL + In-Memory Fallback</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Voyex Travel OS. Engineered for high-autonomy personal expeditions.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            100% Free Tier Compatible &bull; Offline Deterministic Execution
          </p>
        </div>
      </div>
    </footer>
  );
};
