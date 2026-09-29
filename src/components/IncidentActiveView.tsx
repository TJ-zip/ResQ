import React, { useState, useEffect } from 'react';
import { Incident, IncidentLocation } from '../types';
import {
  PhoneCall,
  MapPin,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  Heart,
  FileText,
  Video,
  Plus,
  CheckCircle2,
  Navigation,
  Edit3,
  Users,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatTimeIST } from '../utils/storage';

interface IncidentActiveViewProps {
  incident: Incident;
  onOpenDialler: () => void;
  onOpenObservationModal: () => void;
  onOpenHandoverModal: () => void;
  onOpenVideoRoom: () => void;
  onStartEpisodeTimer: (label: string, reportedBy: string) => void;
  onUpdateLocation: (loc: IncidentLocation) => void;
  onEndIncident: () => void;
  onViewProfiles: () => void;
}

export const IncidentActiveView: React.FC<IncidentActiveViewProps> = ({
  incident,
  onOpenDialler,
  onOpenObservationModal,
  onOpenHandoverModal,
  onOpenVideoRoom,
  onStartEpisodeTimer,
  onUpdateLocation,
  onEndIncident,
  onViewProfiles,
}) => {
  // Location manual entry states
  const [isManualLocationOpen, setIsManualLocationOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualLandmark, setManualLandmark] = useState('');
  const [manualCity, setManualCity] = useState('Bengaluru');
  const [manualPincode, setManualPincode] = useState('');
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Episode timer running tick
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (incident.episodeTimer) {
      const calc = () => {
        const diff = Math.floor((Date.now() - incident.episodeTimer!.startedAt) / 1000);
        setTimerElapsedSeconds(Math.max(0, diff));
      };
      calc();
      interval = setInterval(calc, 1000);
    } else {
      setTimerElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [incident.episodeTimer]);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Browser Geolocation flow
  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatusMessage('Browser does not support Geolocation. Please enter address manually.');
      setIsManualLocationOpen(true);
      return;
    }

    setIsLocating(true);
    setLocationStatusMessage('Requesting browser location permission...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const loc: IncidentLocation = {
          type: 'gps',
          address: `GPS Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
          city: 'Device Geolocation',
          coordinates: { latitude, longitude },
          accuracyMeters: accuracy,
          sourceDescription: `Device GPS (Accuracy: ±${Math.round(accuracy)}m)`,
          timestamp: Date.now(),
        };
        onUpdateLocation(loc);
        setLocationStatusMessage(`GPS acquired (±${Math.round(accuracy)}m accuracy)`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation denied or failed:', err);
        setLocationStatusMessage('Location permission denied or unavailable. Enter address manually below.');
        setIsManualLocationOpen(true);
        // Record denied in state
        const deniedLoc: IncidentLocation = {
          type: 'denied',
          address: 'Location permission denied by user. Manual address required.',
          sourceDescription: 'Permission denied / unavailable',
          timestamp: Date.now(),
        };
        onUpdateLocation(deniedLoc);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const handleSaveManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    const fullAddr = [
      manualAddress.trim(),
      manualLandmark ? `Near ${manualLandmark.trim()}` : '',
      manualCity.trim(),
      manualPincode.trim(),
    ]
      .filter(Boolean)
      .join(', ');

    const loc: IncidentLocation = {
      type: 'manual',
      address: fullAddr,
      landmark: manualLandmark.trim(),
      city: manualCity.trim(),
      pincode: manualPincode.trim(),
      sourceDescription: 'Manually entered by user',
      timestamp: Date.now(),
    };

    onUpdateLocation(loc);
    setIsManualLocationOpen(false);
    setLocationStatusMessage('Manual location updated successfully.');
  };

  const patient = incident.patientProfile;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {/* Real Emergency 112 Call Banner (Always Accessible) */}
      <div className="bg-[#EB232D] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-white animate-pulse" />
            <h2 className="text-lg font-black tracking-tight leading-none">
              Need Real Emergency Help?
            </h2>
          </div>
          <p className="text-xs text-red-100 leading-snug">
            ResQ is an emergency handover concept. For real dispatch, call <strong>112</strong> immediately.
          </p>
        </div>

        <button
          onClick={onOpenDialler}
          className="min-h-[48px] px-5 py-2.5 bg-white text-[#EB232D] hover:bg-red-50 active:scale-[0.98] font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
        >
          <PhoneCall className="w-4 h-4 text-[#EB232D]" />
          <span>Open Phone to Call 112</span>
        </button>
      </div>

      {/* Incident Status Banner */}
      <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#2A2E34]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-black text-white text-base">
              {incident.id}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                incident.isDrill
                  ? 'bg-amber-950/60 text-amber-300 border-amber-600/40'
                  : 'bg-red-950/60 text-red-200 border-red-600/40'
              }`}
            >
              {incident.isDrill ? 'Practice Drill Run' : 'Active Demo Incident'}
            </span>
          </div>

          <span className="text-xs font-mono text-[#8E959E]">
            {incident.createdTimeString} IST
          </span>
        </div>

        {/* Dynamic Verified Acknowledgement Status */}
        <div className="p-3.5 rounded-xl bg-[#141618] border border-[#24272B] flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#8E959E] uppercase font-bold tracking-wider block">
              Coordinator Status
            </span>
            {incident.responderAcknowledged ? (
              <div className="space-y-0.5 mt-0.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Demo responder acknowledged</span>
                </div>
                <p className="text-[11px] text-[#8E959E]">
                  Logged at {incident.responderAcknowledged.timeString} by {incident.responderAcknowledged.responderName}
                </p>
              </div>
            ) : (
              <div className="space-y-0.5 mt-0.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs sm:text-sm">
                  <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>Awaiting Demo Coordinator Review</span>
                </div>
                <p className="text-[11px] text-[#8E959E]">
                  Open the desktop Responder Desk view to test immediate coordinator acknowledgement.
                </p>
              </div>
            )}
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] text-[#8E959E] block">ETA Policy</span>
            <span className="text-[11px] text-slate-400 font-mono">No ETA Invented</span>
          </div>
        </div>
      </div>

      {/* Patient Baseline Briefing */}
      <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">{patient.displayName}</h3>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-600/40">
                Self/Family Reported
              </span>
            </div>
            <p className="text-xs text-[#8E959E] mt-0.5">
              {patient.ageRange} · Blood Group: {patient.bloodGroup}
            </p>
          </div>
          <button
            onClick={onViewProfiles}
            className="text-xs text-[#8E959E] hover:text-white flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Profile</span>
          </button>
        </div>

        {/* Clinical alerts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#8E959E] block">Known Conditions:</span>
            <span className="text-white font-medium">
              {patient.conditions.join(', ') || 'None reported'}
            </span>
          </div>
          <div className="p-2 rounded bg-red-950/40 border border-red-700/40 text-red-200">
            <span className="font-bold block text-red-300 text-[11px]">ALLERGIES (REPORTED):</span>
            <span className="font-semibold">{patient.allergies.join(', ') || 'None reported'}</span>
          </div>
        </div>

        <div className="text-xs">
          <span className="text-[#8E959E]">Medicines: </span>
          <span className="text-white font-mono text-[11px]">
            {patient.medicines.join(', ') || 'None reported'}
          </span>
        </div>

        {patient.hospitalPreference && (
          <div className="text-xs pt-1 border-t border-[#24272B] text-[#8E959E]">
            <span>Hospital Preference: </span>
            <span className="text-white font-medium">{patient.hospitalPreference}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              (Family preference only — not a destination guarantee)
            </span>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EB232D]" />
            <h3 className="font-bold text-white text-sm">Incident Location</h3>
          </div>
          <span className="text-[11px] font-mono text-[#8E959E] bg-[#24272B] px-2 py-0.5 rounded border border-[#383D43]">
            {incident.location.sourceDescription}
          </span>
        </div>

        {/* Current location display */}
        <div className="p-3 rounded-xl bg-[#141618] border border-[#24272B] space-y-1">
          <p className="text-white font-medium text-xs leading-relaxed">
            {incident.location.address}
          </p>
          {incident.location.landmark && (
            <p className="text-[11px] text-[#8E959E]">
              Landmark: <span className="text-white">{incident.location.landmark}</span>
            </p>
          )}
          {locationStatusMessage && (
            <p className="text-[11px] text-amber-300 pt-1 font-mono">
              {locationStatusMessage}
            </p>
          )}
        </div>

        {/* Location Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleRequestGPS}
            disabled={isLocating}
            className="min-h-[44px] px-3.5 py-2 bg-[#24272B] hover:bg-[#2F343B] text-white text-xs font-semibold rounded-xl border border-[#383D43] flex items-center gap-2 transition-colors"
          >
            <Navigation className={`w-3.5 h-3.5 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Share Device GPS'}</span>
          </button>

          <button
            onClick={() => setIsManualLocationOpen(!isManualLocationOpen)}
            className="min-h-[44px] px-3.5 py-2 bg-[#24272B] hover:bg-[#2F343B] text-white text-xs font-semibold rounded-xl border border-[#383D43] flex items-center gap-2 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{isManualLocationOpen ? 'Hide Manual Form' : 'Enter Address Manually'}</span>
          </button>
        </div>

        {/* Manual Address Entry Form */}
        {isManualLocationOpen && (
          <form
            onSubmit={handleSaveManualLocation}
            className="mt-3 p-3.5 rounded-xl bg-[#141618] border border-[#2E3339] space-y-3 text-xs"
          >
            <div className="font-semibold text-white">Manual Location Entry (Indian Context)</div>
            <div>
              <label className="block text-[#8E959E] mb-1">Building / Flat / Street *</label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 402, Green Glen Layout, Bellandur Outer Ring Road"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="w-full h-9 px-3 rounded bg-[#1C1F22] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-1">
                <label className="block text-[#8E959E] mb-1">Nearest Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Central Mall"
                  value={manualLandmark}
                  onChange={(e) => setManualLandmark(e.target.value)}
                  className="w-full h-9 px-3 rounded bg-[#1C1F22] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8E959E] mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full h-9 px-3 rounded bg-[#1C1F22] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8E959E] mb-1">Pincode</label>
                <input
                  type="text"
                  placeholder="e.g. 560103"
                  value={manualPincode}
                  onChange={(e) => setManualPincode(e.target.value)}
                  className="w-full h-9 px-3 rounded bg-[#1C1F22] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsManualLocationOpen(false)}
                className="px-3 py-1.5 text-xs text-[#8E959E] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Save Location
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Episode / Symptom Timer Section */}
      <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#EB232D]" />
            <h3 className="font-bold text-white text-sm">Episode / Symptom Duration Timer</h3>
          </div>
          <span className="text-[10px] text-[#8E959E] uppercase font-mono">
            User-Reported (Not AI-Detected)
          </span>
        </div>

        {incident.episodeTimer ? (
          <div className="p-4 rounded-xl bg-[#141618] border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-amber-300">
                {incident.episodeTimer.label}
              </div>
              <p className="text-[11px] text-[#8E959E]">
                Started at {formatTimeIST(incident.episodeTimer.startedAt)} IST by {incident.episodeTimer.reportedBy}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono tabular-nums text-white">
                {formatElapsed(timerElapsedSeconds)}
              </span>
              <span className="text-[10px] text-[#8E959E] block">Elapsed Time</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#141618] border border-[#24272B]">
            <p className="text-xs text-[#8E959E]">
              If an acute episode (e.g. seizure, chest pain, shaking) is occurring right now, start the timer manually.
            </p>
            <button
              onClick={() => onStartEpisodeTimer('Acute Episode / Seizure / Shaking', 'Bystander')}
              className="min-h-[44px] px-4 py-2 bg-[#24272B] hover:bg-[#2F343B] text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl border border-amber-500/40 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Symptom Timer</span>
            </button>
          </div>
        )}
      </div>

      {/* Bystander Observations Section */}
      <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#EB232D]" />
            <h3 className="font-bold text-white text-sm">Bystander Observations</h3>
          </div>
          <button
            onClick={onOpenObservationModal}
            className="min-h-[40px] px-3 py-1.5 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Observation</span>
          </button>
        </div>

        {incident.observations.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#141618] border border-[#24272B] text-xs text-[#8E959E] text-center">
            No observations recorded yet. Tap "Add Observation" to log witnessed signs without clinical inference.
          </div>
        ) : (
          <div className="space-y-2">
            {incident.observations.map((obs) => (
              <div
                key={obs.id}
                className="p-3 rounded-xl bg-[#141618] border border-[#24272B] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{obs.category}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#8E959E]">
                    <span>{obs.timeReported}</span>
                    <span className="text-[10px] text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-600/30">
                      {obs.status}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300">{obs.rawText}</p>
                <span className="text-[10px] text-[#8E959E] block">
                  Reported by: {obs.attribution}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Timeline Audit Trail */}
      <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#EB232D]" />
            <h3 className="font-bold text-white text-sm">Timestamped Incident Timeline</h3>
          </div>
          <span className="text-xs font-mono text-[#8E959E]">
            {incident.timeline.length} Events
          </span>
        </div>

        <div className="space-y-2">
          {incident.timeline.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-[#141618] border border-[#24272B]"
            >
              <span className="font-mono text-[#8E959E] text-[11px] shrink-0">
                {entry.timeString}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{entry.label}</span>
                  <span className="text-[10px] text-[#8E959E]">· {entry.attribution}</span>
                </div>
                {entry.details && (
                  <p className="text-[11px] text-[#8E959E] mt-0.5">
                    {entry.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Handover & Video Room Action Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={onOpenHandoverModal}
          className="min-h-[50px] p-3 rounded-2xl bg-[#24272B] hover:bg-[#2F343B] border border-[#383D43] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4 text-[#EB232D]" />
          <span>Simulated Clinical Handover</span>
        </button>

        <button
          onClick={onOpenVideoRoom}
          className="min-h-[50px] p-3 rounded-2xl bg-[#24272B] hover:bg-[#2F343B] border border-[#383D43] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Video className="w-4 h-4 text-amber-400" />
          <span>Open Video Room Demo</span>
        </button>
      </div>

      {/* Close/End Incident */}
      <div className="pt-4 border-t border-[#2A2E34] flex justify-center">
        <button
          onClick={() => {
            if (confirm('End this demo incident and clear active session?')) {
              onEndIncident();
            }
          }}
          className="text-xs text-[#8E959E] hover:text-red-400 py-2 transition-colors"
        >
          End & Clear Demo Incident
        </button>
      </div>
    </div>
  );
};
