import { Activity, ItineraryDay } from '../../types/index.js';
import { Coordinates, IMapsRoutingProvider, RouteLeg } from './types.js';
import { HaversineProvider } from './HaversineProvider.js';
import { OSRMProvider } from './OSRMProvider.js';
import { config } from '../../config/index.js';

export class RoutingService {
  private provider: IMapsRoutingProvider;

  constructor() {
    if (config.routing.provider === 'osrm') {
      this.provider = new OSRMProvider(config.routing.osrmUrl);
    } else {
      this.provider = new HaversineProvider();
    }
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async calculateLeg(
    origin: Coordinates,
    destination: Coordinates,
    mode: 'driving' | 'walking' = 'driving'
  ): Promise<RouteLeg> {
    return this.provider.calculateRoute(origin, destination, mode);
  }

  /**
   * Annotates an array of activities for a single day:
   * 1. Re-orders activities to minimize travel distance (TSP optimization)
   * 2. Calculates distance and travel time from previous activity
   */
  public async processDayActivities(
    activities: Activity[],
    transportMode: 'driving' | 'walking' = 'driving'
  ): Promise<Activity[]> {
    if (!activities || activities.length === 0) {
      return [];
    }

    // 1. Optimize ordering
    const sorted = await this.provider.optimizeActivityOrder(activities);

    // 2. Compute inter-activity transit metrics
    const annotated: Activity[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const current = { ...sorted[i], display_order: i + 1 };

      if (i === 0) {
        current.distance_from_previous_km = 0;
        current.travel_time_from_previous_min = 0;
      } else {
        const prev = sorted[i - 1];
        if (
          prev.latitude != null &&
          prev.longitude != null &&
          current.latitude != null &&
          current.longitude != null
        ) {
          const leg = await this.provider.calculateRoute(
            { lat: prev.latitude, lng: prev.longitude },
            { lat: current.latitude, lng: current.longitude },
            transportMode
          );
          current.distance_from_previous_km = leg.distanceKm;
          current.travel_time_from_previous_min = leg.durationMinutes;
        } else {
          // Missing coordinates: label estimates conservatively
          current.distance_from_previous_km = 2.5;
          current.travel_time_from_previous_min = 15;
        }
      }
      annotated.push(current);
    }

    return annotated;
  }

  /**
   * Processes all days in an itinerary
   */
  public async enrichDaysWithRouting(days: ItineraryDay[]): Promise<ItineraryDay[]> {
    const enrichedDays: ItineraryDay[] = [];
    for (const day of days) {
      const enrichedActivities = await this.processDayActivities(day.activities);
      enrichedDays.push({
        ...day,
        activities: enrichedActivities,
      });
    }
    return enrichedDays;
  }

  public async optimizeStops(
    stops: any[],
    transitMode: 'driving' | 'walking' = 'driving'
  ): Promise<{ optimized_stops: any[]; legs: any[]; warnings: string[] }> {
    if (!stops || stops.length === 0) {
      return { optimized_stops: [], legs: [], warnings: [] };
    }

    const hasCoords = stops.every((s) => s.latitude != null && s.longitude != null);
    const warnings: string[] = [];
    if (!hasCoords) {
      warnings.push('Some stops are missing precise coordinates. Fallback distances applied.');
    }

    // Convert stops to activities format for ordering
    const activitiesFormatted = stops.map((s, idx) => ({
      id: s.id || `stop-${idx}`,
      itinerary_day_id: 'day-1',
      name: s.name || s.title || `Stop ${idx + 1}`,
      description: s.description || '',
      category: s.category || 'sightseeing',
      start_time: s.start_time || '09:00',
      end_time: s.end_time || '10:00',
      location_name: s.location_name || s.name || '',
      latitude: s.latitude,
      longitude: s.longitude,
      estimated_cost: s.estimated_cost || 0,
      currency: 'USD',
      estimated_duration_minutes: s.estimated_duration_minutes || 60,
      verification_status: 'verified' as const,
      display_order: idx + 1,
    }));

    const sortedActivities = await this.provider.optimizeActivityOrder(activitiesFormatted);
    const optimized_stops = sortedActivities.map((act, idx) => ({
      ...stops.find((orig) => (orig.id && orig.id === act.id) || orig.name === act.name) || act,
      display_order: idx + 1,
    }));

    const legs: any[] = [];
    for (let i = 0; i < optimized_stops.length - 1; i++) {
      const from = optimized_stops[i];
      const to = optimized_stops[i + 1];
      if (from.latitude != null && from.longitude != null && to.latitude != null && to.longitude != null) {
        const leg = await this.provider.calculateRoute(
          { lat: from.latitude, lng: from.longitude },
          { lat: to.latitude, lng: to.longitude },
          transitMode
        );
        legs.push({
          from_stop_id: from.id,
          to_stop_id: to.id,
          distance_km: leg.distanceKm,
          duration_minutes: leg.durationMinutes,
          transit_mode: transitMode,
        });
      } else {
        legs.push({
          from_stop_id: from.id,
          to_stop_id: to.id,
          distance_km: 2.0,
          duration_minutes: 15,
          transit_mode: transitMode,
        });
      }
    }

    return { optimized_stops, legs, warnings };
  }

  public compareRoutes(originalStops: any[], optimizedStops: any[]): any {
    const calcDist = (stops: any[]) => {
      let totalDist = 0;
      let totalTime = 0;
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i];
        const b = stops[i + 1];
        if (a.latitude != null && a.longitude != null && b.latitude != null && b.longitude != null) {
          const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
          const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
          const c = 2 * Math.atan2(Math.sqrt(Math.sin(dLat / 2) ** 2 + Math.cos((a.latitude * Math.PI) / 180) * Math.cos((b.latitude * Math.PI) / 180) * Math.sin(dLon / 2) ** 2), Math.sqrt(1 - (Math.sin(dLat / 2) ** 2 + Math.cos((a.latitude * Math.PI) / 180) * Math.cos((b.latitude * Math.PI) / 180) * Math.sin(dLon / 2) ** 2)));
          const km = Math.round(6371 * c * 1.3 * 10) / 10;
          totalDist += km;
          totalTime += Math.max(5, Math.round((km / 25) * 60));
        } else {
          totalDist += 2.5;
          totalTime += 15;
        }
      }
      return { dist: Math.round(totalDist * 10) / 10, time: totalTime };
    };

    const orig = calcDist(originalStops);
    const opt = calcDist(optimizedStops);
    const distSaved = Math.max(0, Math.round((orig.dist - opt.dist) * 10) / 10);
    const timeSaved = Math.max(0, orig.time - opt.time);

    return {
      original_total_distance_km: orig.dist,
      optimized_total_distance_km: opt.dist,
      distance_saved_km: distSaved,
      distance_saved_percentage: orig.dist > 0 ? Math.round((distSaved / orig.dist) * 100) : 0,
      original_transit_time_min: orig.time,
      optimized_transit_time_min: opt.time,
      time_saved_min: timeSaved,
      time_saved_percentage: orig.time > 0 ? Math.round((timeSaved / orig.time) * 100) : 0,
    };
  }
}

export const routingService = new RoutingService();
