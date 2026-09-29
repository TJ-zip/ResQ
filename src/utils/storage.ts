import { FamilyProfile, Incident, TimelineEntry, BystanderObservation } from '../types';
import { INITIAL_PRESET_PROFILES } from '../data/presetProfiles';

const PROFILES_STORAGE_KEY = 'resq_demo_profiles_v1';
const ACTIVE_INCIDENT_STORAGE_KEY = 'resq_demo_active_incident_v1';
const CHANNEL_NAME = 'resq_demo_sync_channel';

// BroadcastChannel for cross-tab real-time sync between Bystander & Responder
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch {
  syncChannel = null;
}

export function formatTimeIST(timestamp: number = Date.now()): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDateIST(timestamp: number = Date.now()): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getStoredProfiles(): FamilyProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(INITIAL_PRESET_PROFILES));
      return INITIAL_PRESET_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRESET_PROFILES;
  } catch {
    return INITIAL_PRESET_PROFILES;
  }
}

export function saveProfiles(profiles: FamilyProfile[]): void {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    broadcastSyncMessage({ type: 'PROFILES_UPDATED', payload: profiles });
  } catch (e) {
    console.error('Failed to save profiles to localStorage', e);
  }
}

export function getActiveIncident(): Incident | null {
  try {
    const raw = localStorage.getItem(ACTIVE_INCIDENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveIncident(incident: Incident | null): void {
  try {
    if (!incident) {
      localStorage.removeItem(ACTIVE_INCIDENT_STORAGE_KEY);
      broadcastSyncMessage({ type: 'INCIDENT_CLEARED' });
    } else {
      localStorage.setItem(ACTIVE_INCIDENT_STORAGE_KEY, JSON.stringify(incident));
      broadcastSyncMessage({ type: 'INCIDENT_UPDATED', payload: incident });
    }
  } catch (e) {
    console.error('Failed to save incident', e);
  }
}

export function createNewIncident(patientProfile: FamilyProfile, isDrill: boolean = false): Incident {
  const now = Date.now();
  const timeStr = formatTimeIST(now);

  const initialTimeline: TimelineEntry[] = [
    {
      id: `tl-${now}-1`,
      timestamp: now,
      timeString: timeStr,
      event: isDrill ? 'drill_started' : 'incident_created',
      label: isDrill ? 'Practice drill started' : 'Incident created',
      attribution: 'User initiation',
      details: isDrill
        ? 'Training run started. No emergency services connected.'
        : `Emergency coordination sheet initialized for ${patientProfile.displayName}.`,
    },
  ];

  const incident: Incident = {
    id: `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: now,
    createdTimeString: timeStr,
    isDrill,
    patientProfile,
    location: {
      type: 'pending',
      address: 'Location not yet acquired. Share GPS or enter address manually.',
      sourceDescription: 'Pending user location input',
      timestamp: now,
    },
    timeline: initialTimeline,
    observations: [],
    episodeTimer: null,
    responderAcknowledged: null,
    handoverReviewed: false,
    status: 'active',
  };

  saveActiveIncident(incident);
  return incident;
}

export function addTimelineEvent(
  incident: Incident,
  event: TimelineEntry['event'],
  label: string,
  attribution: string,
  details?: string
): Incident {
  const now = Date.now();
  const newEntry: TimelineEntry = {
    id: `tl-${now}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    timeString: formatTimeIST(now),
    event,
    label,
    attribution,
    details,
  };

  const updated: Incident = {
    ...incident,
    timeline: [...incident.timeline, newEntry],
  };
  saveActiveIncident(updated);
  return updated;
}

export function addObservation(
  incident: Incident,
  category: string,
  rawText: string,
  attribution: BystanderObservation['attribution'],
  status: BystanderObservation['status']
): Incident {
  const now = Date.now();
  const newObs: BystanderObservation = {
    id: `obs-${now}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    timeReported: formatTimeIST(now),
    category,
    rawText,
    attribution,
    status,
  };

  const updatedTimeline = [
    ...incident.timeline,
    {
      id: `tl-obs-${now}`,
      timestamp: now,
      timeString: formatTimeIST(now),
      event: 'observation_entered' as const,
      label: `Observation reported: ${category}`,
      attribution,
      details: `"${rawText}" (${status})`,
    },
  ];

  const updated: Incident = {
    ...incident,
    observations: [newObs, ...incident.observations],
    timeline: updatedTimeline,
  };
  saveActiveIncident(updated);
  return updated;
}

export function acknowledgeIncidentByDemoResponder(
  incident: Incident,
  responderName: string = 'EMT-D Vinay Kumar',
  deskUnit: string = 'Desk 4 — EMRI Demo Cell'
): Incident {
  const now = Date.now();
  const ack = {
    acknowledgedAt: now,
    timeString: formatTimeIST(now),
    responderId: 'RSP-EMRI-DEMO-04',
    responderName,
    responderRole: 'Authorized Demo Responder (Emergency Coordination Desk)',
    deskUnit,
    notes: 'Demo responder acknowledged reported incident details and patient summary.',
  };

  const updatedTimeline = [
    ...incident.timeline,
    {
      id: `tl-ack-${now}`,
      timestamp: now,
      timeString: formatTimeIST(now),
      event: 'responder_acknowledged' as const,
      label: 'Demo responder acknowledged',
      attribution: `${responderName} (${deskUnit})`,
      details: 'Simulation acknowledgement logged. No ambulance dispatch or hospital acceptance claimed.',
    },
  ];

  const updated: Incident = {
    ...incident,
    responderAcknowledged: ack,
    status: 'demo_acknowledged',
    timeline: updatedTimeline,
  };

  saveActiveIncident(updated);
  return updated;
}

// Inter-tab sync messaging
type SyncMessage =
  | { type: 'INCIDENT_UPDATED'; payload: Incident }
  | { type: 'INCIDENT_CLEARED' }
  | { type: 'PROFILES_UPDATED'; payload: FamilyProfile[] };

function broadcastSyncMessage(msg: SyncMessage): void {
  if (syncChannel) {
    try {
      syncChannel.postMessage(msg);
    } catch {
      // fallback
    }
  }
}

export function subscribeToSyncMessages(callback: (msg: SyncMessage) => void): () => void {
  const onChannelMessage = (ev: MessageEvent<SyncMessage>) => {
    if (ev.data) callback(ev.data);
  };

  const onStorageChange = (e: StorageEvent) => {
    if (e.key === ACTIVE_INCIDENT_STORAGE_KEY) {
      if (e.newValue) {
        try {
          callback({ type: 'INCIDENT_UPDATED', payload: JSON.parse(e.newValue) });
        } catch {
          // ignore
        }
      } else {
        callback({ type: 'INCIDENT_CLEARED' });
      }
    } else if (e.key === PROFILES_STORAGE_KEY && e.newValue) {
      try {
        callback({ type: 'PROFILES_UPDATED', payload: JSON.parse(e.newValue) });
      } catch {
        // ignore
      }
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', onChannelMessage);
  }
  window.addEventListener('storage', onStorageChange);

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', onChannelMessage);
    }
    window.removeEventListener('storage', onStorageChange);
  };
}
