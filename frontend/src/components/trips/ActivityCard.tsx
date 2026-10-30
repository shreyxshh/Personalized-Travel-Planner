import React from 'react';
import { MapPin, DollarSign, Edit2, Trash2, Lock, Unlock, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Activity } from '../../types';
import { Badge } from '../Badge';

interface ActivityCardProps {
  activity: Activity;
  isLocked: boolean;
  onToggleLock: (id: string) => void;
  onEdit: (act: Activity) => void;
  onDelete: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isLocked,
  onToggleLock,
  onEdit,
  onDelete,
}) => {
  const isVerified = activity.verification_status === 'verified';

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-3xl border transition-all duration-200 group ${
        isLocked
          ? 'border-amber-300/90 bg-amber-50/30 shadow-xs ring-1 ring-amber-200/50'
          : 'border-slate-200/90 hover:border-brand-300 bg-white shadow-2xs hover:shadow-xs'
      }`}
    >
      {/* Time column */}
      <div className="sm:w-32 shrink-0 flex sm:flex-col items-center sm:items-start gap-1.5">
        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
          {activity.start_time} - {activity.end_time}
        </span>
        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {activity.estimated_duration_minutes} min
        </span>
      </div>

      {/* Details column */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base font-extrabold text-slate-900 group-hover:text-brand-900 transition-colors">
            {activity.name}
          </h4>
          <Badge
            variant={
              activity.category === 'meal'
                ? 'amber'
                : activity.category === 'culture'
                ? 'brand'
                : activity.category === 'nature'
                ? 'forest'
                : 'slate'
            }
            size="sm"
          >
            {activity.category.toUpperCase()}
          </Badge>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {isVerified ? 'Verified Sight' : 'AI Calibrated'}
          </span>
          {isLocked && (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
              <Lock className="w-2.5 h-2.5 text-amber-700" />
              Pinned
            </span>
          )}
        </div>

        {activity.description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {activity.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
          {activity.location_name && (
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate max-w-xs">{activity.location_name}</span>
            </span>
          )}
          <span className="flex items-center gap-1 font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
            <DollarSign className="w-3.5 h-3.5 text-forest-600 shrink-0" />
            {activity.estimated_cost > 0
              ? `~${activity.estimated_cost.toFixed(2)} ${activity.currency || 'USD'}`
              : 'Free / Included'}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 pt-2 sm:pt-0 self-end sm:self-start shrink-0">
        <button
          type="button"
          onClick={() => onToggleLock(activity.id)}
          className={`p-2 rounded-xl transition-all ${
            isLocked
              ? 'text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 shadow-2xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={
            isLocked
              ? "Locked: AI refinement will not replace this activity"
              : "Lock activity to preserve it during AI refinement"
          }
        >
          {isLocked ? <Lock className="w-4 h-4 text-amber-700" /> : <Unlock className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onEdit(activity)}
          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          title="Edit activity details"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(activity.id)}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          title="Delete activity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
