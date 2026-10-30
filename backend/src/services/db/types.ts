import {
  Trip,
  TripCreate,
  TripUpdate,
  Itinerary,
  ItineraryDay,
  Activity,
  ActivityUpdate,
  ShareResponse,
  PublicShareView,
} from '../../types/index.js';

export interface ITripRepository {
  readonly isDemoStore: boolean;
  getTrips(userId: string): Promise<Trip[]>;
  getTripById(tripId: string, userId?: string): Promise<Trip | null>;
  createTrip(trip: TripCreate, userId: string): Promise<Trip>;
  updateTrip(tripId: string, updates: TripUpdate, userId?: string): Promise<Trip | null>;
  deleteTrip(tripId: string, userId?: string): Promise<boolean>;

  getItinerariesByTripId(tripId: string): Promise<Itinerary[]>;
  getItineraryById(itineraryId: string): Promise<Itinerary | null>;
  saveItinerary(itinerary: Itinerary): Promise<Itinerary>;

  updateActivity(itineraryId: string, activityId: string, updates: ActivityUpdate): Promise<Activity | null>;
  deleteActivity(itineraryId: string, activityId: string): Promise<boolean>;
  saveDayActivities(itineraryId: string, dayId: string, activities: Activity[]): Promise<ItineraryDay | null>;

  createShare(tripId: string, ownerId: string, expiresInDays: number): Promise<ShareResponse>;
  getPublicShare(shareToken: string): Promise<PublicShareView | null>;
  revokeShare(shareId: string, ownerId: string): Promise<boolean>;

  // Collaborators
  getCollaborators(tripId: string): Promise<any[]>;
  addCollaborator(tripId: string, email: string, role: 'viewer' | 'editor'): Promise<any>;
  updateCollaborator(tripId: string, collaboratorId: string, role: 'viewer' | 'editor'): Promise<any | null>;
  deleteCollaborator(tripId: string, collaboratorId: string): Promise<boolean>;

  // Versioning
  saveVersionSnapshot(tripId: string, version: number, snapshot: any, changesSummary?: string): Promise<any>;
  getVersions(tripId: string): Promise<any[]>;
  getVersion(tripId: string, version: number): Promise<any | null>;

  // Local Auth Users
  registerUser(user: any): Promise<any>;
  getUserByEmail(email: string): Promise<any | null>;
  getUserById(id: string): Promise<any | null>;
}
