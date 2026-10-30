import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  Filter,
  Check,
  TrendingUp,
  Globe2,
} from 'lucide-react';
import { api } from '../api/client';
import { DestinationOption, DestinationDiscoveryRequest } from '../types';
import { Badge } from '../components/Badge';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();

  const [vibe, setVibe] = useState('cultural');
  const [budget, setBudget] = useState(2500);
  const [duration, setDuration] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [origin, setOrigin] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<DestinationOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const req: DestinationDiscoveryRequest = {
        origin: origin || undefined,
        travel_vibe: vibe,
        budget_amount: budget,
        currency: 'USD',
        duration_days: duration,
        traveler_count: travelers,
        interests: ['culture', 'sightseeing', 'local food'],
      };
      const res = await api.discoverDestinations(req);
      setRecommendations(res.recommendations);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDestination = (dest: DestinationOption) => {
    navigate(`/wizard?destination=${encodeURIComponent(dest.destination)}&vibe=${encodeURIComponent(vibe)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
          AI Destination Discovery Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Discover Places That Match Your Vibe
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
          Calibrate your target budget, trip duration, and rhythm. Our AI suggests high-compatibility destinations with realistic daily budget breakdowns.
        </p>
      </div>

      {/* Discovery Control Filters Bar */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-card-subtle space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Travel Vibe
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/90 text-sm font-semibold text-slate-800 bg-white outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all shadow-2xs"
            >
              <option value="cultural">🏛️ Cultural & Historic</option>
              <option value="adventure">🧗 Outdoor Adventure</option>
              <option value="relaxed">🏖️ Relaxed & Leisure</option>
              <option value="romantic">🍷 Romantic Escape</option>
              <option value="luxury">✨ Luxury & Gastronomy</option>
              <option value="nature">🌲 Scenic Nature</option>
              <option value="family-friendly">👨‍👩‍👧 Family-Friendly</option>
              <option value="budget-friendly">🎒 Budget-Conscious</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Target Budget (USD)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-forest-600" />
              <input
                type="number"
                step="100"
                min="300"
                value={budget}
                onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200/90 text-sm font-semibold text-slate-800 bg-white outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Duration (Days)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="number"
                min="2"
                max="30"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200/90 text-sm font-semibold text-slate-800 bg-white outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Travelers
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="number"
                min="1"
                max="20"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 2)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200/90 text-sm font-semibold text-slate-800 bg-white outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold shadow-md shadow-brand-700/20 transition-all disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-brand-200" />
                Analyzing Destinations...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-brand-300" />
                Update Recommendations
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommendations Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center text-red-700 text-sm flex flex-col items-center gap-3">
          <p className="font-semibold max-w-md">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl glass-card-hover flex flex-col justify-between overflow-hidden group p-7 space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    {item.match_score}% MATCH
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {item.suggested_duration_days} Days
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                    {item.destination}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                    {item.country}
                  </span>
                </div>

                <p className="text-xs italic text-brand-950 bg-brand-50/80 p-3 rounded-2xl border border-brand-100 leading-relaxed">
                  "{item.tagline}"
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.reasoning}
                </p>

                {/* Highlights Chips */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Highlights
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Meta */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400 font-bold">Estimated Cost</span>
                    <span className="font-bold text-slate-900">{item.estimated_cost_range}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400 font-bold">Best Season</span>
                    <span className="font-bold text-slate-900">{item.best_season}</span>
                  </div>
                </div>

                {/* Estimated Budget Breakdown */}
                {item.estimated_budget_breakdown && (
                  <div className="mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                    <span className="block font-bold text-[10px] uppercase text-brand-700 tracking-wider">
                      Est. Daily Budget Breakdown
                    </span>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 font-medium">
                      <span>🏨 Stay: {item.estimated_budget_breakdown.currency} {item.estimated_budget_breakdown.daily_accommodation}/d</span>
                      <span>🍽️ Meals: {item.estimated_budget_breakdown.currency} {item.estimated_budget_breakdown.daily_food}/d</span>
                      <span>🎟️ Sights: {item.estimated_budget_breakdown.currency} {item.estimated_budget_breakdown.daily_activities}/d</span>
                      <span>🚇 Transit: {item.estimated_budget_breakdown.currency} {item.estimated_budget_breakdown.daily_transport}/d</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleSelectDestination(item)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                >
                  Plan Trip to {item.destination}
                  <ArrowRight className="w-3.5 h-3.5 text-brand-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
