import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { routingService } from '../services/routing/RoutingService.js';

export const optimizeRoutes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stops = [], transit_mode = 'driving' } = req.body;
    const result = await routingService.optimizeStops(stops, transit_mode);
    res.json({
      ...result,
      calculation_method: 'nearest_neighbor_with_2opt',
      distance_source: 'haversine_approximation',
    });
  } catch (error) {
    next(error);
  }
};

export const scheduleRoutes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stops = [], transit_mode = 'driving', travel_pace = 'moderate' } = req.body;
    const { optimized_stops, legs, warnings } = await routingService.optimizeStops(stops, transit_mode);
    const comparison = routingService.compareRoutes(stops, optimized_stops);

    res.json({
      scheduled_stops: optimized_stops,
      legs,
      warnings,
      travel_pace,
      comparison,
    });
  } catch (error) {
    next(error);
  }
};

export const compareRoutes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { original_stops = [], optimized_stops = [] } = req.body;
    const comparison = routingService.compareRoutes(original_stops, optimized_stops);
    res.json(comparison);
  } catch (error) {
    next(error);
  }
};
