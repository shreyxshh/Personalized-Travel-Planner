import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  History,
  Share2,
  UserPlus
} from 'lucide-react';
import { Trip, Itinerary } from '../../types';
import { Badge } from '../Badge';
import { ExportTripMenu } from './ExportTripMenu';

interface TripHeaderProps {
  trip: Trip;
  itinerary: Itinerary | null;
  lockedCount: number;
  collaboratorCount: number;
  onOpenChat: () => void;
  onOpenVersions: () => void;
  onOpenShare: () => void;
  onOpenCollaborators: () => void;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  itinerary,
  lockedCount,
  collaboratorCount,
  onOpenChat,
  onOpenVersions,
  onOpenShare,
  onOpenCollaborators,
}) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card-subtle">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="brand">
              {trip.travel_preferences?.travel_vibe?.toUpperCase() || 'CULTURAL'}
            </Badge>
            <Badge variant="slate">
              Pace: {trip.travel_preferences?.travel_pace || 'Moderate'}
            </Badge>
            <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
              v{itinerary?.version || 1} &bull; <strong className="capitalize text-slate-700">{trip.status}</strong>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {trip.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 mt-3">
            <span className="flex items-center gap-1.5 font-bold text-slate-900">
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
            {trip.budget_amount && (
              <span className="flex items-center gap-1.5 font-bold text-slate-900 bg-slate-50 px-2.5 py-0.5 rounded-xl border border-slate-200">
                <DollarSign className="w-4 h-4 text-forest-600" />
                Budget: ${trip.budget_amount.toLocaleString()} {trip.currency || 'USD'}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Refine with AI */}
          <button
            type="button"
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 text-white hover:from-brand-800 hover:to-brand-900 font-bold text-xs shadow-md shadow-brand-700/20 transition-all hover:scale-[1.02]"
            title="Open conversational AI itinerary refinement panel"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-200" />
            <span>Refine AI</span>
            {lockedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-brand-950 text-[10px] font-bold text-amber-300">
                {lockedCount} locked
              </span>
            )}
          </button>

          {/* Collaborators */}
          <button
            type="button"
            onClick={onOpenCollaborators}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs hover:shadow-xs transition-all"
            title="Manage friends and travel collaborators"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Collaborate</span>
            {collaboratorCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-800">
                {collaboratorCount}
              </span>
            )}
          </button>

          {/* Versions */}
          <button
            type="button"
            onClick={onOpenVersions}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs shadow-2xs hover:shadow-xs transition-all"
            title="Review snapshots and roll back to previous versions"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Versions (v{itinerary?.version || 1})</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs hover:shadow-xs transition-all"
            title="Share public summary link"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>

          {/* Multi-Format Export Menu */}
          {itinerary && (
            <ExportTripMenu itineraryId={itinerary.id} tripTitle={trip.title} />
          )}
        </div>
      </div>
    </div>
  );
};
