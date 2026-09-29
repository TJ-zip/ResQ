export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface FamilyProfile {
  id: string;
  displayName: string;
  ageRange: string;
  bloodGroup: string;
  emergencyContacts: EmergencyContact[];
  conditions: string[];
  allergies: string[];
  medicines: string[];
  insuranceProvider: string;
  insurancePolicyRef: string;
  hospitalPreference: string;
  isSyntheticPreset?: boolean;
  notes?: string;
}

export type LocationType = 'gps' | 'manual' | 'pending' | 'denied';

export interface IncidentLocation {
  type: LocationType;
  address: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accuracyMeters?: number;
  sourceDescription: string;
  timestamp: number;
}

export type TimelineEventType =
  | 'incident_created'
  | 'location_provided'
  | 'observation_entered'
  | 'responder_acknowledged'
  | 'handover_reviewed'
  | 'dialler_opened'
  | 'drill_started'
  | 'timer_started'
  | 'video_demo_opened';

export interface TimelineEntry {
  id: string;
  timestamp: number;
  timeString: string;
  event: TimelineEventType;
  label: string;
  attribution: string;
  details?: string;
}

export type ObservationAttribution = 'Bystander' | 'Family member' | 'Self';
export type ObservationStatus = 'Ongoing' | 'Stopped' | 'Unknown / not observed';

export interface BystanderObservation {
  id: string;
  timestamp: number;
  timeReported: string; // e.g. "14:03" or timestamp format
  category: string;
  rawText: string;
  attribution: ObservationAttribution;
  status: ObservationStatus;
}

export interface IncidentEpisodeTimer {
  startedAt: number;
  label: string;
  reportedBy: string;
}

export interface ResponderAcknowledgement {
  acknowledgedAt: number;
  timeString: string;
  responderId: string;
  responderName: string;
  responderRole: string;
  deskUnit: string;
  notes?: string;
}

export interface Incident {
  id: string;
  createdAt: number;
  createdTimeString: string;
  isDrill: boolean;
  patientProfile: FamilyProfile;
  location: IncidentLocation;
  timeline: TimelineEntry[];
  observations: BystanderObservation[];
  episodeTimer: IncidentEpisodeTimer | null;
  responderAcknowledged: ResponderAcknowledgement | null;
  handoverReviewed: boolean;
  status: 'active' | 'demo_acknowledged' | 'closed';
}

export type AppView = 
  | 'home'
  | 'incident'
  | 'profiles'
  | 'profile_preview'
  | 'responder_desk'
  | 'video_room'
  | 'handover';
