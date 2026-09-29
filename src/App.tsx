import React, { useState, useEffect } from 'react';
import {
  FamilyProfile,
  Incident,
  IncidentLocation,
  AppView,
  ObservationAttribution,
  ObservationStatus,
} from './types';
import {
  getStoredProfiles,
  saveProfiles,
  getActiveIncident,
  saveActiveIncident,
  createNewIncident,
  addTimelineEvent,
  addObservation,
  acknowledgeIncidentByDemoResponder,
  subscribeToSyncMessages,
  formatTimeIST,
} from './utils/storage';
import { HeaderBanner } from './components/HeaderBanner';
import { EmergencyHomeView } from './components/EmergencyHomeView';
import { IncidentActiveView } from './components/IncidentActiveView';
import { FamilyProfilesView } from './components/FamilyProfilesView';
import { ResponderDeskView } from './components/ResponderDeskView';
import { VideoRoomView } from './components/VideoRoomView';
import { Dialler112Modal } from './components/Dialler112Modal';
import { ObservationsModal } from './components/ObservationsModal';
import { HospitalHandoverModal } from './components/HospitalHandoverModal';
import { RoadmapModal } from './components/RoadmapModal';

export default function App() {
  const [profiles, setProfiles] = useState<FamilyProfile[]>(() => getStoredProfiles());
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => {
    const list = getStoredProfiles();
    return list.length > 0 ? list[0].id : '';
  });
  const [activeIncident, setActiveIncident] = useState<Incident | null>(() => getActiveIncident());
  const [currentView, setCurrentView] = useState<AppView>(() => (getActiveIncident() ? 'incident' : 'home'));
  const [isDrillModeActive, setIsDrillModeActive] = useState(false);

  // Modals
  const [is112ModalOpen, setIs112ModalOpen] = useState(false);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);

  // Cross-tab real-time sync listener
  useEffect(() => {
    const unsubscribe = subscribeToSyncMessages((msg) => {
      if (msg.type === 'INCIDENT_UPDATED') {
        setActiveIncident(msg.payload);
      } else if (msg.type === 'INCIDENT_CLEARED') {
        setActiveIncident(null);
        setCurrentView((prev) => (prev === 'incident' || prev === 'video_room' ? 'home' : prev));
      } else if (msg.type === 'PROFILES_UPDATED') {
        setProfiles(msg.payload);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update selected profile if profiles change
  useEffect(() => {
    if (!profiles.some((p) => p.id === selectedProfileId) && profiles.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  // Handlers for profiles
  const handleSaveProfile = (profile: FamilyProfile) => {
    const exists = profiles.some((p) => p.id === profile.id);
    const updated = exists
      ? profiles.map((p) => (p.id === profile.id ? profile : p))
      : [profile, ...profiles];
    setProfiles(updated);
    saveProfiles(updated);
    setSelectedProfileId(profile.id);
  };

  const handleDeleteProfile = (id: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
  };

  // Launch Incident
  const handleStartIncident = (isDrill: boolean) => {
    const targetProfile =
      profiles.find((p) => p.id === selectedProfileId) || profiles[0];
    if (!targetProfile) return;

    const newInc = createNewIncident(targetProfile, isDrill);
    setActiveIncident(newInc);
    setCurrentView('incident');
  };

  // End Incident
  const handleEndIncident = () => {
    saveActiveIncident(null);
    setActiveIncident(null);
    setCurrentView('home');
  };

  // Update Location
  const handleUpdateLocation = (loc: IncidentLocation) => {
    if (!activeIncident) return;
    const label =
      loc.type === 'gps'
        ? 'Location acquired via device GPS'
        : loc.type === 'denied'
        ? 'Location permission denied by user'
        : 'Location entered manually by user';

    const withLoc: Incident = {
      ...activeIncident,
      location: loc,
    };

    const updated = addTimelineEvent(
      withLoc,
      'location_provided',
      label,
      loc.sourceDescription,
      loc.address
    );
    setActiveIncident(updated);
  };

  // Episode Timer
  const handleStartEpisodeTimer = (label: string, reportedBy: string) => {
    if (!activeIncident) return;
    const now = Date.now();
    const withTimer: Incident = {
      ...activeIncident,
      episodeTimer: {
        startedAt: now,
        label,
        reportedBy,
      },
    };
    const updated = addTimelineEvent(
      withTimer,
      'timer_started',
      'Episode timer started by user',
      reportedBy,
      `User-reported symptom timer started at ${formatTimeIST(now)} (Not AI-detected)`
    );
    setActiveIncident(updated);
  };

  // Add Bystander Observation
  const handleAddObservation = (
    category: string,
    rawText: string,
    attribution: ObservationAttribution,
    status: ObservationStatus
  ) => {
    if (!activeIncident) return;
    const updated = addObservation(activeIncident, category, rawText, attribution, status);
    setActiveIncident(updated);
  };

  // 112 Dialler Triggered
  const handleDiallerTriggered = () => {
    if (activeIncident) {
      const updated = addTimelineEvent(
        activeIncident,
        'dialler_opened',
        '112 dialler opened on device',
        'User triggered',
        'Keypad dialler opened with 112 pre-filled. Call placement not verifiable by web application.'
      );
      setActiveIncident(updated);
    }
  };

  // Demo Responder Acknowledge
  const handleDemoResponderAcknowledge = (
    responderName: string,
    deskUnit: string
  ) => {
    if (!activeIncident) return;
    const updated = acknowledgeIncidentByDemoResponder(
      activeIncident,
      responderName,
      deskUnit
    );
    setActiveIncident(updated);
  };

  // Handover reviewed
  const handleHandoverReviewed = () => {
    if (!activeIncident) return;
    if (!activeIncident.handoverReviewed) {
      const withHandover: Incident = {
        ...activeIncident,
        handoverReviewed: true,
      };
      const updated = addTimelineEvent(
        withHandover,
        'handover_reviewed',
        'Simulated clinical handover viewed',
        'User review',
        'Handover briefing copy/print action triggered.'
      );
      setActiveIncident(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#141618] text-[#F4F5F7] flex flex-col selection:bg-[#EB232D] selection:text-white">
      {/* Top Banner with Persistent Demo Warning & Navigation */}
      <HeaderBanner
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        isDrillActive={isDrillModeActive}
        onToggleDrill={() => setIsDrillModeActive(!isDrillModeActive)}
        hasActiveIncident={Boolean(activeIncident)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <EmergencyHomeView
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelectProfile={(id) => setSelectedProfileId(id)}
            onStartIncident={handleStartIncident}
            onOpenDialler={() => setIs112ModalOpen(true)}
            onManageProfiles={() => setCurrentView('profiles')}
            onOpenRoadmap={() => setIsRoadmapModalOpen(true)}
            isDrillModeActive={isDrillModeActive}
            onToggleDrillMode={() => setIsDrillModeActive(!isDrillModeActive)}
          />
        )}

        {currentView === 'incident' && activeIncident && (
          <IncidentActiveView
            incident={activeIncident}
            onOpenDialler={() => setIs112ModalOpen(true)}
            onOpenObservationModal={() => setIsObservationModalOpen(true)}
            onOpenHandoverModal={() => setIsHandoverModalOpen(true)}
            onOpenVideoRoom={() => setCurrentView('video_room')}
            onStartEpisodeTimer={handleStartEpisodeTimer}
            onUpdateLocation={handleUpdateLocation}
            onEndIncident={handleEndIncident}
            onViewProfiles={() => setCurrentView('profiles')}
          />
        )}

        {currentView === 'profiles' && (
          <FamilyProfilesView
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelectProfile={(id) => {
              setSelectedProfileId(id);
              setCurrentView('home');
            }}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
            onBack={() => setCurrentView(activeIncident ? 'incident' : 'home')}
          />
        )}

        {currentView === 'responder_desk' && (
          <ResponderDeskView
            incident={activeIncident}
            onAcknowledge={handleDemoResponderAcknowledge}
            onOpenHandover={() => setIsHandoverModalOpen(true)}
            onOpenVideo={() => setCurrentView('video_room')}
            onReturnToPatientView={() => setCurrentView(activeIncident ? 'incident' : 'home')}
          />
        )}

        {currentView === 'video_room' && activeIncident && (
          <VideoRoomView
            incident={activeIncident}
            onLeave={() => setCurrentView('incident')}
            onOpenDialler={() => setIs112ModalOpen(true)}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <Dialler112Modal
        isOpen={is112ModalOpen}
        onClose={() => setIs112ModalOpen(false)}
        onDiallerTriggered={handleDiallerTriggered}
      />

      <ObservationsModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
        onSubmitObservation={handleAddObservation}
      />

      {activeIncident && (
        <HospitalHandoverModal
          isOpen={isHandoverModalOpen}
          onClose={() => setIsHandoverModalOpen(false)}
          incident={activeIncident}
          onHandoverReviewed={handleHandoverReviewed}
        />
      )}

      <RoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
      />
    </div>
  );
}
