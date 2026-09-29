import React, { useState } from 'react';
import { Incident } from '../types';
import {
  Monitor,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  User,
  Heart,
  Pill,
  ShieldCheck,
  FileText,
  Video,
  Radio,
  Lock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { formatDateIST, formatTimeIST } from '../utils/storage';

interface ResponderDeskViewProps {
  incident: Incident | null;
  onAcknowledge: (responderName: string, deskUnit: string) => void;
  onOpenHandover: () => void;
  onOpenVideo: () => void;
  onReturnToPatientView: () => void;
}

export const ResponderDeskView: React.FC<ResponderDeskViewProps> = ({
  incident,
  onAcknowledge,
  onOpenHandover,
  onOpenVideo,
  onReturnToPatientView,
}) => {
  // Demo responder session state
  const [responderName, setResponderName] = useState('EMT-D Vinay Kumar');
  const [deskUnit, setDeskUnit] = useState('Desk 4 — EMRI Demo Cell (Bengaluru Hub)');
  const [isEditingResponder, setIsEditingResponder] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Desk Station Bar */}
      <div className="bg-[#1C1F22] border border-[#2E3339] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white text-[#141618] flex items-center justify-center font-bold shrink-0">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Emergency Coordination Desk — Demo Station
              </h1>
              <span className="text-[10px] uppercase font-bold bg-[#EB232D] text-white px-2 py-0.5 rounded tracking-wider">
                Simulated Console
              </span>
            </div>
            <p className="text-xs text-[#8E959E] mt-0.5">
              Authorized Demo Operator:{' '}
              <strong className="text-white">{responderName}</strong> ·{' '}
              <span>{deskUnit}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsEditingResponder(!isEditingResponder)}
            className="text-xs text-[#8E959E] hover:text-white px-3 py-1.5 rounded-lg border border-[#383D43] bg-[#24272B] transition-colors"
          >
            {isEditingResponder ? 'Save Operator' : 'Change Operator'}
          </button>
          <button
            onClick={onReturnToPatientView}
            className="text-xs font-semibold text-white hover:text-white px-3 py-1.5 rounded-lg bg-[#2E3339] hover:bg-[#383D43] transition-colors flex items-center gap-1.5"
          >
            <span>Exit to Patient App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Operator Config (Collapsible) */}
      {isEditingResponder && (
        <div className="p-4 rounded-xl bg-[#181A1D] border border-[#383D43] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[#8E959E] mb-1 font-semibold">Demo Operator Name</label>
            <input
              type="text"
              value={responderName}
              onChange={(e) => setResponderName(e.target.value)}
              className="w-full h-9 px-3 rounded bg-[#141618] border border-[#2E3339] text-white"
            />
          </div>
          <div>
            <label className="block text-[#8E959E] mb-1 font-semibold">Coordination Desk Unit</label>
            <input
              type="text"
              value={deskUnit}
              onChange={(e) => setDeskUnit(e.target.value)}
              className="w-full h-9 px-3 rounded bg-[#141618] border border-[#2E3339] text-white"
            />
          </div>
        </div>
      )}

      {/* Active Incident Container */}
      {!incident ? (
        <div className="p-12 rounded-2xl bg-[#181A1D] border border-[#2E3339] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#24272B] mx-auto flex items-center justify-center text-[#8E959E]">
            <Radio className="w-8 h-8 text-[#8E959E]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">No Active Incident Stream</h2>
            <p className="text-xs text-[#8E959E] max-w-md mx-auto mt-1">
              There is currently no emergency or practice incident initiated on this device. Switch to the Patient View to launch a demo incident or start a Practice Drill.
            </p>
          </div>
          <button
            onClick={onReturnToPatientView}
            className="px-5 py-2.5 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>Launch Incident in Patient View</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Incident Core & Observations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Header Status Bar */}
            <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2A2E34]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-black text-white">
                    {incident.id}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                      incident.isDrill
                        ? 'bg-amber-950/60 text-amber-300 border-amber-600/40'
                        : 'bg-red-950/60 text-red-200 border-red-600/40'
                    }`}
                  >
                    {incident.isDrill ? 'Practice Simulation' : 'Live Incident Stream'}
                  </span>
                </div>

                <div className="text-xs text-[#8E959E] flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#EB232D]" />
                  <span>Initiated: {incident.createdTimeString} IST</span>
                </div>
              </div>

              {/* Status & Explicit Acknowledgement Control */}
              <div className="p-4 rounded-xl bg-[#141618] border border-[#2E3339] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-[#8E959E] uppercase font-bold tracking-wider block">
                    Coordination Status
                  </span>
                  {incident.responderAcknowledged ? (
                    <div className="space-y-0.5 mt-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Demo responder acknowledged</span>
                      </div>
                      <p className="text-[11px] text-[#8E959E]">
                        Logged at {incident.responderAcknowledged.timeString} by {incident.responderAcknowledged.responderName} ({incident.responderAcknowledged.deskUnit})
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5 mt-1">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                        <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                        <span>Pending Coordinator Acknowledgement</span>
                      </div>
                      <p className="text-[11px] text-[#8E959E]">
                        Incident received from bystander/family applet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                {!incident.responderAcknowledged ? (
                  <button
                    onClick={() => onAcknowledge(responderName, deskUnit)}
                    className="min-h-[48px] px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Demo Acknowledge</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8E959E] italic">
                      Acknowledgement broadcasted to patient app
                    </span>
                  </div>
                )}
              </div>

              {/* Strict No-Ambulance-Dispatch Disclosure */}
              <div className="p-3 rounded-lg bg-[#24272B] border border-[#383D43] text-xs text-[#8E959E] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Verification Invariant:</strong> Status is explicitly marked as demo acknowledgement. This screen will never claim an ambulance is dispatched, hospital has accepted, or a doctor is connected.
                </p>
              </div>
            </div>

            {/* Incident Location Panel */}
            <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#EB232D]" />
                  <span>Reported Incident Location</span>
                </h3>
                <span className="text-[11px] font-mono uppercase bg-[#24272B] px-2 py-0.5 rounded text-[#8E959E] border border-[#383D43]">
                  {incident.location.sourceDescription}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141618] border border-[#24272B] space-y-1.5">
                <p className="text-white font-semibold text-sm leading-relaxed">
                  {incident.location.address}
                </p>
                {incident.location.landmark && (
                  <p className="text-xs text-[#8E959E]">
                    Landmark: <span className="text-white font-medium">{incident.location.landmark}</span>
                  </p>
                )}
                {incident.location.coordinates && (
                  <div className="pt-1 flex items-center gap-4 text-xs font-mono text-[#8E959E]">
                    <span>Coordinates: {incident.location.coordinates.latitude.toFixed(5)}, {incident.location.coordinates.longitude.toFixed(5)}</span>
                    {incident.location.accuracyMeters && (
                      <span>Accuracy: ±{Math.round(incident.location.accuracyMeters)}m</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bystander Observations Stream */}
            <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#EB232D]" />
                    <span>Reported Observations (Non-Inferred Chronology)</span>
                  </h3>
                  <p className="text-[11px] text-[#8E959E] mt-0.5">
                    Separated bystander reports · No automated inference applied
                  </p>
                </div>
                <span className="text-xs font-mono text-[#8E959E]">
                  Count: {incident.observations.length}
                </span>
              </div>

              {incident.observations.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8E959E] bg-[#141618] rounded-xl border border-[#24272B]">
                  No bystander observations reported yet for this incident.
                </div>
              ) : (
                <div className="space-y-2">
                  {incident.observations.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-3 rounded-xl bg-[#141618] border border-[#2E3339] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{obs.category}</span>
                          <span className="text-[10px] text-[#8E959E] bg-[#24272B] px-1.5 py-0.5 rounded border border-[#383D43]">
                            Reported by: {obs.attribution}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-[#8E959E]">
                          <span>{obs.timeReported}</span>
                          <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-600/30">
                            {obs.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#F4F5F7] leading-relaxed">
                        {obs.rawText}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Episode Timer if active */}
              {incident.episodeTimer && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      User-Reported Episode Timer: Started at {formatTimeIST(incident.episodeTimer.startedAt)} by {incident.episodeTimer.reportedBy}
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">
                    User-Reported
                  </span>
                </div>
              )}
            </div>

            {/* Incident Chronology Timeline */}
            <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-[#2A2E34]">
                <Clock className="w-4 h-4 text-[#EB232D]" />
                <span>Verified Incident Audit Trail</span>
              </h3>

              <div className="space-y-2">
                {incident.timeline.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 text-xs p-2 rounded-lg bg-[#141618] border border-[#24272B]"
                  >
                    <span className="font-mono text-[#8E959E] shrink-0 text-[11px]">
                      {entry.timeString}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{entry.label}</span>
                        <span className="text-[10px] text-[#8E959E]">· {entry.attribution}</span>
                      </div>
                      {entry.details && (
                        <p className="text-[11px] text-[#8E959E] mt-0.5 truncate">
                          {entry.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Scoped Patient Reported Summary & Tools */}
          <div className="space-y-6">
            {/* Scoped Patient Profile Card */}
            <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="pb-3 border-b border-[#2A2E34]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8E959E] uppercase font-bold tracking-wider">
                    Reported Patient Baseline
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                    Not Clinically Verified
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  {incident.patientProfile.displayName}
                </h3>
                <p className="text-xs text-[#8E959E]">
                  {incident.patientProfile.ageRange} · Blood Group: {incident.patientProfile.bloodGroup}
                </p>
              </div>

              {/* Clinical items */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#8E959E] block mb-0.5">Known Conditions:</span>
                  <span className="text-white font-medium">
                    {incident.patientProfile.conditions.join(', ') || 'None reported'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-700/40 text-red-200">
                  <span className="font-bold block text-red-300 text-[11px]">ALLERGIES (REPORTED):</span>
                  <span>{incident.patientProfile.allergies.join(', ') || 'None reported'}</span>
                </div>

                <div>
                  <span className="text-[#8E959E] block mb-0.5">Current Medicines:</span>
                  <span className="text-white font-mono text-[11px]">
                    {incident.patientProfile.medicines.join(', ') || 'None reported'}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#24272B] space-y-1.5">
                  <span className="font-bold text-white text-[11px] block">
                    Insurance Reference (For Hospital Verification):
                  </span>
                  <p className="text-white">
                    {incident.patientProfile.insuranceProvider || 'None'} ({incident.patientProfile.insurancePolicyRef || 'No ref'})
                  </p>
                  <p className="text-[10px] text-amber-300 leading-tight">
                    * Pre-authorisation NOT filed; cashless care NOT approved; claim NOT submitted.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#24272B] space-y-1">
                  <span className="font-bold text-white text-[11px] block">
                    Hospital Preference:
                  </span>
                  <p className="text-white font-medium">
                    {incident.patientProfile.hospitalPreference || 'None specified'}
                  </p>
                  <p className="text-[10px] text-[#8E959E] leading-tight">
                    * Family preference only — destination remains paramedic/triage choice.
                  </p>
                </div>

                {/* Emergency Contacts */}
                <div className="pt-2 border-t border-[#24272B] space-y-1.5">
                  <span className="font-bold text-white text-[11px] block">
                    Emergency Contacts:
                  </span>
                  {incident.patientProfile.emergencyContacts.map((c) => (
                    <div key={c.id} className="flex justify-between items-center text-[11px]">
                      <span className="text-white">{c.name} ({c.relationship})</span>
                      <span className="font-mono text-[#8E959E]">{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safe Link Scoping Disclaimer */}
              <div className="pt-2 border-t border-[#24272B] text-[10px] text-[#8E959E] flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Privacy: Full family tree isolated; only active incident shared.</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#181A1D] border border-[#2E3339] rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="font-bold text-sm text-white">Desk Handover Actions</h3>

              <button
                onClick={onOpenHandover}
                className="w-full min-h-[44px] px-4 py-2 bg-[#24272B] hover:bg-[#2F343B] text-white text-xs font-semibold rounded-xl border border-[#383D43] flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#EB232D]" />
                <span>Simulated Clinical Handover</span>
              </button>

              <button
                onClick={onOpenVideo}
                className="w-full min-h-[44px] px-4 py-2 bg-[#24272B] hover:bg-[#2F343B] text-white text-xs font-semibold rounded-xl border border-[#383D43] flex items-center justify-center gap-2 transition-colors"
              >
                <Video className="w-4 h-4 text-amber-400" />
                <span>Video Room Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
