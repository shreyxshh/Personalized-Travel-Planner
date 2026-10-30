import { Router } from 'express';
import {
  getItineraryById,
  updateActivity,
  deleteActivity,
  regenerateDay,
  exportItinerary,
  generateItinerary,
  updateItinerary,
  refineItinerary,
  getItineraryVersions,
  getItineraryVersionSnapshot,
  restoreItineraryVersion,
  optimizeTripItinerary,
} from '../controllers/itinerariesController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  activityUpdateSchema,
  regenerateDaySchema,
  refinementRequestSchema,
} from '../schemas/index.js';

export const itinerariesRoutes = Router();

// Public/authenticated export route
itinerariesRoutes.get('/api/v1/itineraries/:id/export', exportItinerary);
itinerariesRoutes.post('/api/v1/itineraries/:id/export', exportItinerary);

// Authenticated itinerary modification endpoints
itinerariesRoutes.use(authenticate);

itinerariesRoutes.post('/api/v1/itineraries/generate', generateItinerary);
itinerariesRoutes.get('/api/v1/itineraries/:id', getItineraryById);
itinerariesRoutes.put('/api/v1/itineraries/:id', updateItinerary);
itinerariesRoutes.patch(
  '/api/v1/itineraries/:id/activities/:activityId',
  validateBody(activityUpdateSchema),
  updateActivity
);
itinerariesRoutes.delete('/api/v1/itineraries/:id/activities/:activityId', deleteActivity);
itinerariesRoutes.post(
  '/api/v1/itineraries/:id/days/:dayId/regenerate',
  validateBody(regenerateDaySchema),
  regenerateDay
);

// Conversational Refinement & Version History
itinerariesRoutes.post(
  '/api/v1/itineraries/:id/refine',
  validateBody(refinementRequestSchema),
  refineItinerary
);
itinerariesRoutes.get('/api/v1/itineraries/:id/versions', getItineraryVersions);
itinerariesRoutes.get('/api/v1/itineraries/:id/versions/:version', getItineraryVersionSnapshot);
itinerariesRoutes.post('/api/v1/itineraries/:id/versions/:version/restore', restoreItineraryVersion);

// Itinerary Route Optimization
itinerariesRoutes.post('/api/v1/itineraries/:id/optimize', optimizeTripItinerary);
itinerariesRoutes.get('/api/v1/itineraries/:id/optimized', getItineraryById);
