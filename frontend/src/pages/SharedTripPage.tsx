import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { api } from '../api/client';
import { PublicShareView } from '../types';
import { Badge } from '../components/Badge';

export const SharedTripPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PublicShareView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  useEffect(() => {
    if (token) {
      loadSharedItinerary(token);
    }
  }, [token]);

  const loadSharedItinerary = async (shareToken: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPublicShare(shareToken);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Shared itinerary is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Sparkles className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading shared itinerary...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-slate-900">Itinerary Link Unavailable</h2>
          <p className="text-xs text-slate-500 mt-2">{error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-md shadow-brand-600/20 transition-all"
          >
            Create Your Own Itinerary
          </Link>
        </div>
      </div>
    );
  }

  const { trip, itinerary } = data;
  const days = itinerary?.days || [];
  const currentDay = days.find((d) => d.day_number === selectedDayNumber) || days[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Shared Itinerary Header Notice */}
      <div className="glass-card border border-brand-200/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold">
          <span className="p-1.5 rounded-lg bg-brand-100 text-brand-700">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>You are viewing a shared travel itinerary.</span>
        </div>
        <Link
          to={`/wizard?destination=${encodeURIComponent(trip.destination)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-sm transition-all"
        >
          Plan a Trip Like This
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Trip Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">
            {trip.travel_preferences?.travel_vibe?.toUpperCase() || 'CULTURAL'}
          </Badge>
          <Badge variant="sand">
            Pace: {trip.travel_preferences?.travel_pace || 'Moderate'}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {trip.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
          <span className="flex items-center gap-1.5 font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-brand-600" />
            {trip.destination}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            {trip.start_date} to {trip.end_date}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-slate-400" />
            {trip.traveler_count} {trip.traveler_count === 1 ? 'Traveler' : 'Travelers'}
          </span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((d) => {
          const isActive = d.day_number === selectedDayNumber;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDayNumber(d.day_number)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-[1.02]'
                  : 'glass-card text-slate-700 hover:text-brand-600 hover:bg-slate-100/50'
              }`}
            >
              <span>Day {d.day_number}</span>
              <span className={`text-[11px] font-normal ${isActive ? 'text-brand-100' : 'text-slate-400'}`}>
                {d.date.slice(5)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Schedule */}
      {currentDay && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200/80">
            <h2 className="text-lg font-extrabold text-slate-900">
              Day {currentDay.day_number} &bull; {currentDay.summary}
            </h2>
            {currentDay.notes && (
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">{currentDay.notes}</p>
            )}
          </div>

          <div className="space-y-4">
            {currentDay.activities?.map((act) => (
              <div
                key={act.id}
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl border border-slate-200/70 bg-white/60 hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="sm:w-28 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {act.start_time} - {act.end_time}
                  </span>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{act.name}</h4>
                    <Badge variant="brand" size="sm">{act.category.toUpperCase()}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                  {act.location_name && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium pt-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      {act.location_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
