import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Express API Endpoint Integration Tests', () => {
  describe('System Health & AI Providers', () => {
    it('GET /health returns healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.app).toBeDefined();
    });

    it('GET /api/v1/health/ai returns active AI capabilities', async () => {
      const res = await request(app).get('/api/v1/health/ai');
      expect(res.status).toBe(200);
      expect(res.body.active_provider).toBeDefined();
      expect(res.body.features.budget_estimation).toBe(true);
    });
  });

  describe('Destination Recommendations', () => {
    it('POST /api/v1/recommendations/destinations returns structured recommendations', async () => {
      const res = await request(app)
        .post('/api/v1/recommendations/destinations')
        .send({
          travel_vibe: 'cultural',
          budget_amount: 2500,
          currency: 'USD',
          duration_days: 6,
          traveler_count: 2,
          interests: ['Art', 'Museums', 'History'],
        });

      expect(res.status).toBe(200);
      expect(res.body.recommendations).toBeInstanceOf(Array);
      expect(res.body.recommendations.length).toBeGreaterThan(0);
      expect(res.body.recommendations[0].destination).toBeDefined();
      expect(res.body.recommendations[0].match_score).toBeGreaterThan(0);
    });

    it('POST /api/v1/recommendations/destinations returns 422 on invalid input', async () => {
      const res = await request(app)
        .post('/api/v1/recommendations/destinations')
        .send({
          // Missing required travel_vibe
          duration_days: -5,
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation failed');
    });
  });

  describe('Trips CRUD Operations', () => {
    let createdTripId: string;

    it('GET /api/v1/trips lists saved trips', async () => {
      const res = await request(app)
        .get('/api/v1/trips')
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0); // pre-seeded trip
      createdTripId = res.body[0].id;
    });

    it('POST /api/v1/trips creates a new trip successfully', async () => {
      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', 'Bearer demo-token')
        .send({
          title: 'Barcelona Architecture Immersion',
          destination: 'Barcelona, Spain',
          start_date: '2026-11-15',
          end_date: '2026-11-20',
          traveler_count: 2,
          budget_amount: 2800,
          currency: 'EUR',
          travel_preferences: {
            travel_vibe: 'cultural',
            travel_pace: 'moderate',
            interests: ['Gaudí', 'Modernisme', 'Tapas'],
            preferred_transportation: ['Walking', 'Metro'],
            dietary_requirements: [],
            accessibility_requirements: [],
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe('Barcelona Architecture Immersion');
      createdTripId = res.body.id;
    });

    it('GET /api/v1/trips/:id fetches the trip details', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdTripId);
      expect(res.body.destination).toBe('Barcelona, Spain');
    });

    it('PATCH /api/v1/trips/:id updates trip details', async () => {
      const res = await request(app)
        .patch(`/api/v1/trips/${createdTripId}`)
        .set('Authorization', 'Bearer demo-token')
        .send({
          title: 'Barcelona & Costa Brava Tour',
          traveler_count: 3,
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Barcelona & Costa Brava Tour');
      expect(res.body.traveler_count).toBe(3);
    });

    it('DELETE /api/v1/trips/:id removes the trip', async () => {
      const res = await request(app)
        .delete(`/api/v1/trips/${createdTripId}`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(204);

      // Verify it is gone
      const getRes = await request(app)
        .get(`/api/v1/trips/${createdTripId}`)
        .set('Authorization', 'Bearer demo-token');

      expect(getRes.status).toBe(404);
    });
  });

  describe('Itinerary Generation & Export Operations', () => {
    let tripId: string;
    let itinId: string;
    let dayId: string;

    it('generates an itinerary for a trip', async () => {
      // 1. Create a trip
      const tripRes = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', 'Bearer demo-token')
        .send({
          title: 'Paris Art & Culture',
          destination: 'Paris, France',
          start_date: '2026-11-01',
          end_date: '2026-11-03',
          traveler_count: 1,
          currency: 'EUR',
          travel_preferences: {
            travel_vibe: 'cultural',
            travel_pace: 'relaxed',
            interests: ['Louvre', 'Bistros'],
            preferred_transportation: ['Walking'],
            dietary_requirements: [],
            accessibility_requirements: [],
          },
        });
      tripId = tripRes.body.id;

      // 2. Generate itinerary
      const genRes = await request(app)
        .post(`/api/v1/trips/${tripId}/generate`)
        .set('Authorization', 'Bearer demo-token')
        .send({});

      expect(genRes.status).toBe(201);
      expect(genRes.body.days.length).toBe(3);
      itinId = genRes.body.id;
      dayId = genRes.body.days[0].id;

      // Check distance & travel time enrichment
      const day1 = genRes.body.days[0];
      expect(day1.activities[0].display_order).toBe(1);
      expect(day1.activities[0].distance_from_previous_km).toBe(0);
    });

    it('POST /api/v1/itineraries/:id/days/:dayId/regenerate updates single day', async () => {
      const res = await request(app)
        .post(`/api/v1/itineraries/${itinId}/days/${dayId}/regenerate`)
        .set('Authorization', 'Bearer demo-token')
        .send({
          feedback: 'Make it a leisurely culinary exploration with local street food and bistros',
          preserve_activity_ids: [],
        });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(dayId);
      expect(res.body.activities.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/itineraries/:id/export exports Markdown format', async () => {
      const res = await request(app)
        .post(`/api/v1/itineraries/${itinId}/export?format=markdown`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/markdown');
      expect(res.text).toContain('# Paris Art & Culture');
      expect(res.text).toContain('## Day-by-Day Schedule');
    });

    it('POST /api/v1/itineraries/:id/export exports iCalendar (.ics) format', async () => {
      const res = await request(app)
        .post(`/api/v1/itineraries/${itinId}/export?format=ics`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/calendar');
      expect(res.text).toContain('BEGIN:VCALENDAR');
      expect(res.text).toContain('END:VCALENDAR');
    });

    it('POST /api/v1/itineraries/:id/export exports Printable HTML/PDF format', async () => {
      const res = await request(app)
        .post(`/api/v1/itineraries/${itinId}/export?format=pdf`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('Voyex Itinerary Dossier');
    });
  });

  describe('Authentication Endpoints', () => {
    it('POST /api/v1/auth/register creates a new user and returns JWT access token', async () => {
      const testEmail = `traveler_${Date.now()}@test.com`;
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'SecretPassword123!',
          display_name: 'Alex Wanderer',
          preferred_currency: 'EUR',
        });

      expect(res.status).toBe(201);
      expect(res.body.access_token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.display_name).toBe('Alex Wanderer');
    });

    it('POST /api/v1/auth/login authenticates registered users', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'traveler@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
      expect(res.body.user.email).toBe('traveler@example.com');
    });
  });

  describe('Collaborator Operations', () => {
    let collabId: string;
    const testTripId = '11111111-1111-1111-1111-111111111111';

    it('GET /api/v1/trips/:tripId/collaborators lists collaborators', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${testTripId}/collaborators`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('POST /api/v1/trips/:tripId/collaborators adds a collaborator', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${testTripId}/collaborators`)
        .set('Authorization', 'Bearer demo-token')
        .send({
          email: 'companion.travel@example.com',
          role: 'editor',
        });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe('companion.travel@example.com');
      expect(res.body.role).toBe('editor');
      collabId = res.body.id;
    });

    it('PATCH /api/v1/trips/:tripId/collaborators/:id updates role', async () => {
      const res = await request(app)
        .patch(`/api/v1/trips/${testTripId}/collaborators/${collabId}`)
        .set('Authorization', 'Bearer demo-token')
        .send({ role: 'viewer' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('viewer');
    });

    it('DELETE /api/v1/trips/:tripId/collaborators/:id removes collaborator', async () => {
      const res = await request(app)
        .delete(`/api/v1/trips/${testTripId}/collaborators/${collabId}`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(204);
    });
  });

  describe('Conversational Refinement & Version Snapshots', () => {
    const testTripId = '11111111-1111-1111-1111-111111111111';

    it('POST /api/v1/itineraries/:tripId/refine refines schedule and creates new version', async () => {
      const res = await request(app)
        .post(`/api/v1/itineraries/${testTripId}/refine`)
        .set('Authorization', 'Bearer demo-token')
        .send({
          message: 'Swap afternoon temple for scenic botanical garden walk',
          target_day: 1,
          preserve_activity_ids: ['act-101'],
        });

      expect(res.status).toBe(200);
      expect(res.body.version).toBeGreaterThan(1);
      expect(res.body.changes_summary).toBeDefined();
      expect(res.body.explanation).toBeDefined();
    });

    it('GET /api/v1/itineraries/:tripId/versions retrieves version history', async () => {
      const res = await request(app)
        .get(`/api/v1/itineraries/${testTripId}/versions`)
        .set('Authorization', 'Bearer demo-token');

      expect(res.status).toBe(200);
      expect(res.body.versions).toBeInstanceOf(Array);
      expect(res.body.versions.length).toBeGreaterThan(0);
    });
  });

  describe('Route Optimization & Scheduling', () => {
    it('POST /api/v1/routes/optimize returns optimized stops sequence', async () => {
      const res = await request(app)
        .post('/api/v1/routes/optimize')
        .set('Authorization', 'Bearer demo-token')
        .send({
          stops: [
            { id: 's1', name: 'Stop A', latitude: 35.0, longitude: 135.0 },
            { id: 's2', name: 'Stop B', latitude: 35.1, longitude: 135.1 },
            { id: 's3', name: 'Stop C', latitude: 35.05, longitude: 135.05 },
          ],
          transit_mode: 'driving',
        });

      expect(res.status).toBe(200);
      expect(res.body.optimized_stops.length).toBe(3);
      expect(res.body.legs.length).toBe(2);
    });

    it('POST /api/v1/routes/compare compares route efficiency', async () => {
      const res = await request(app)
        .post('/api/v1/routes/compare')
        .set('Authorization', 'Bearer demo-token')
        .send({
          original_stops: [
            { latitude: 35.0, longitude: 135.0 },
            { latitude: 35.2, longitude: 135.2 },
            { latitude: 35.05, longitude: 135.05 },
          ],
          optimized_stops: [
            { latitude: 35.0, longitude: 135.0 },
            { latitude: 35.05, longitude: 135.05 },
            { latitude: 35.2, longitude: 135.2 },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.distance_saved_km).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Readiness Probe', () => {
    it('GET /ready returns 200 ready probe', async () => {
      const res = await request(app).get('/ready');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ready');
    });
  });
});
