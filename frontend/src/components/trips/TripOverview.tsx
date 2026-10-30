import React from 'react';
import { Calendar, Users, DollarSign, Compass, Tag, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Trip, Itinerary } from '../../types';

interface TripOverviewProps {
  trip: Trip;
  itinerary: Itinerary | null;
}

export const TripOverview: React.FC<TripOverviewProps> = ({ trip, itinerary }) => {
  const sDate = new Date(trip.start_date);
  const eDate = new Date(trip.end_date);
  const totalDays = Math.max(1, Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 3600 * 24)) + 1);

  const sumActivityCosts = itinerary?.days?.reduce((total, day) => {
    return total + (day.activities?.reduce((subTotal, act) => subTotal + (Number(act.estimated_cost) || 0), 0) || 0);
  }, 0) || 0;

  const estimatedTotalCost =
    (itinerary as any)?.estimated_total_cost ||
    itinerary?.structured_itinerary?.total_estimated_cost ||
    (sumActivityCosts > 0 ? sumActivityCosts : (trip.budget_amount ? trip.budget_amount * 0.75 : 0));

  const budget = trip.budget_amount || 0;
  const travelers = trip.traveler_count || 1;
  const perPersonCost = totalDays > 0 ? estimatedTotalCost / (travelers * totalDays) : 0;

  const interests = trip.travel_preferences?.interests || [];
  const tips = itinerary?.structured_itinerary?.practical_tips || [];

  return (
    <div className="space-y-6">
      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Days */}
        <div className="p-5 rounded-3xl glass-card relative overflow-hidden">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Duration</div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            <span>{totalDays}</span> <span className="text-xs font-semibold text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{trip.start_date.slice(5)} to {trip.end_date.slice(5)}</p>
        </div>

        {/* Travelers */}
        <div className="p-5 rounded-3xl glass-card relative overflow-hidden">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Travelers</div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            <span>{travelers}</span> <span className="text-xs font-semibold text-slate-500">People</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium capitalize">{trip.travel_preferences?.travel_style || 'Standard'} group</p>
        </div>

        {/* Total Estimated Cost */}
        <div className="p-5 rounded-3xl glass-card relative overflow-hidden">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Est. Total Cost</div>
          <div className="text-2xl font-black text-forest-700 mt-1">
            ${estimatedTotalCost.toFixed(0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {budget > 0 ? `Budget: $${budget.toFixed(0)}` : 'No budget cap set'}
          </p>
        </div>

        {/* Daily Per Person */}
        <div className="p-5 rounded-3xl glass-card relative overflow-hidden">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Average</div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
            ${perPersonCost.toFixed(0)} <span className="text-xs font-medium text-slate-400">/ person / day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium capitalize">{trip.travel_preferences?.travel_pace || 'Moderate'} pace</p>
        </div>
      </div>

      {/* Selected Interests & Constraints */}
      {(interests.length > 0 || (trip.travel_preferences?.dietary_requirements && trip.travel_preferences.dietary_requirements.length > 0)) && (
        <div className="p-6 rounded-3xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Targeted Interests & Vibe
            </span>
            <div className="flex flex-wrap gap-2">
              {interests.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/70 shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {trip.travel_preferences?.dietary_requirements && trip.travel_preferences.dietary_requirements.length > 0 && (
            <div className="sm:border-l sm:border-slate-200 sm:pl-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Dietary Constraints
              </span>
              <span className="text-xs font-semibold text-slate-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 inline-block">
                {trip.travel_preferences.dietary_requirements.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Practical Tips */}
      {tips.length > 0 && (
        <div className="p-6 rounded-3xl bg-brand-50/60 border border-brand-200/70 space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
            AI Grounded Tips & Local Advice
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
