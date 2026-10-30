import React, { useState } from 'react';
import { ItineraryDay, Activity } from '../../types';
import { ItineraryDaySection } from './ItineraryDaySection';
import { RouteMapVisualizer } from '../RouteMapVisualizer';
import { Calendar } from 'lucide-react';

interface ItineraryTimelineProps {
  days: ItineraryDay[];
  lockedActivityIds: string[];
  onToggleLock: (id: string) => void;
  onEditActivity: (act: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onRegenerateDay: (dayId: string) => void;
  onOptimizeDayRoute: (pace: string) => Promise<void>;
  isOptimizingRoute: boolean;
  routeComparison: any;
  routeWarnings: string[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  days,
  lockedActivityIds,
  onToggleLock,
  onEditActivity,
  onDeleteActivity,
  onRegenerateDay,
  onOptimizeDayRoute,
  isOptimizingRoute,
  routeComparison,
  routeWarnings,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  if (!days || days.length === 0) {
    return (
      <div className="p-12 text-center glass-card rounded-3xl">
        <p className="text-sm font-bold text-slate-500">No daily schedule generated yet.</p>
      </div>
    );
  }

  const currentDay = days.find((d) => d.day_number === selectedDayNumber) || days[0];

  return (
    <div className="space-y-6">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((d) => {
          const isActive = d.day_number === selectedDayNumber;
          return (
            <button
              key={d.id || d.day_number}
              type="button"
              onClick={() => setSelectedDayNumber(d.day_number)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              <span>Day {d.day_number}</span>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-brand-300' : 'text-slate-400'}`}>
                {d.date ? d.date.slice(5) : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Smart Route Optimizer & Map Visualizer for the active day */}
      {currentDay && (
        <RouteMapVisualizer
          dayNumber={currentDay.day_number}
          date={currentDay.date}
          stops={currentDay.activities.map((a) => ({
            id: a.id,
            name: a.name,
            category: a.category,
            latitude: a.latitude,
            longitude: a.longitude,
            start_time: a.start_time,
            end_time: a.end_time,
            duration_minutes: a.estimated_duration_minutes,
          }))}
          onOptimize={onOptimizeDayRoute}
          isOptimizing={isOptimizingRoute}
          comparison={routeComparison}
          warnings={routeWarnings}
        />
      )}

      {/* Selected Day Section */}
      {currentDay && (
        <ItineraryDaySection
          day={currentDay}
          lockedActivityIds={lockedActivityIds}
          onToggleLock={onToggleLock}
          onEditActivity={onEditActivity}
          onDeleteActivity={onDeleteActivity}
          onRegenerateDay={onRegenerateDay}
        />
      )}
    </div>
  );
};
