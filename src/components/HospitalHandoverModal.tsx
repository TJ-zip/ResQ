import React, { useState } from 'react';
import { Incident } from '../types';
import {
  FileText,
  Copy,
  Printer,
  X,
  AlertTriangle,
  Check,
  ShieldCheck,
  Building,
  User,
  Clock,
  MapPin,
  Pill,
  Heart,
  Phone,
} from 'lucide-react';
import { formatDateIST, formatTimeIST } from '../utils/storage';

interface HospitalHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident;
  onHandoverReviewed: () => void;
}

export const HospitalHandoverModal: React.FC<HospitalHandoverModalProps> = ({
  isOpen,
  onClose,
  incident,
  onHandoverReviewed,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const patient = incident.patientProfile;

  // Generate plain text version for copying
  const generateHandoverPlainText = (): string => {
    const lines: string[] = [];
    lines.push('=====================================================');
    lines.push('SIMULATED CLINICAL HANDOVER SUMMARY — FOR DEMO USE');
    lines.push('DEMO SYSTEM — NO EMERGENCY SERVICE CONNECTED');
    lines.push('=====================================================');
    lines.push(`Incident Ref: ${incident.id}`);
    lines.push(`Created: ${formatDateIST(incident.createdAt)} at ${incident.createdTimeString} IST`);
    lines.push(`Drill Mode: ${incident.isDrill ? 'YES (Training run)' : 'NO (Demo incident)'}`);
    lines.push('');
    lines.push('--- 1. PATIENT REPORTED IDENTIFIERS ---');
    lines.push(`Name: ${patient.displayName}`);
    lines.push(`Age Group: ${patient.ageRange}`);
    lines.push(`Blood Group: ${patient.bloodGroup || 'Not reported'}`);
    lines.push('Classification: Patient/family reported — not clinically verified');
    lines.push('');
    lines.push('--- 2. INCIDENT LOCATION ---');
    lines.push(`Address: ${incident.location.address}`);
    if (incident.location.landmark) lines.push(`Landmark: ${incident.location.landmark}`);
    lines.push(`Location Type: ${incident.location.type.toUpperCase()}`);
    lines.push(`Source: ${incident.location.sourceDescription}`);
    lines.push('');
    lines.push('--- 3. REPORTED HISTORY & ALLERGIES ---');
    lines.push(`Known Conditions: ${patient.conditions.join(', ') || 'None reported'}`);
    lines.push(`ALLERGIES (REPORTED): ${patient.allergies.join(', ') || 'None reported'}`);
    lines.push(`Routine Medicines: ${patient.medicines.join(', ') || 'None reported'}`);
    lines.push('');
    lines.push('--- 4. BYSTANDER OBSERVATIONS (NON-INFERRED) ---');
    if (incident.observations.length === 0) {
      lines.push('No bystander observations recorded.');
    } else {
      incident.observations.forEach((obs, idx) => {
        lines.push(`[${obs.timeReported}] ${obs.attribution}: ${obs.rawText} (${obs.status})`);
      });
    }
    if (incident.episodeTimer) {
      lines.push(`User-Reported Episode Timer: Started at ${formatTimeIST(incident.episodeTimer.startedAt)} by ${incident.episodeTimer.reportedBy}`);
    }
    lines.push('');
    lines.push('--- 5. INSURANCE & HOSPITAL PREFERENCE ---');
    lines.push(`Insurance Provider: ${patient.insuranceProvider || 'Not reported'}`);
    lines.push(`Policy Ref: ${patient.insurancePolicyRef || 'Not reported'}`);
    lines.push('Insurance Status: Available for hospital verification. Pre-authorisation NOT filed; cashless care NOT approved; claim NOT submitted.');
    lines.push(`Hospital Preference: ${patient.hospitalPreference || 'None specified'}`);
    lines.push('Destination Note: Patient/family preference only — not an automated destination decision or hospital acceptance.');
    lines.push('');
    lines.push('--- 6. COORDINATION TIMELINE ---');
    incident.timeline.forEach((t) => {
      lines.push(`[${t.timeString}] ${t.label} (By: ${t.attribution})`);
    });
    lines.push('');
    lines.push('=====================================================');
    lines.push('Generated via ResQ Demo — Not a medical record');
    lines.push('=====================================================');
    return lines.join('\n');
  };

  const handleCopy = () => {
    const text = generateHandoverPlainText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    onHandoverReviewed();
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    onHandoverReviewed();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181A1D] border border-[#383D43] rounded-2xl max-w-3xl w-full p-4 sm:p-7 text-[#F4F5F7] shadow-2xl my-auto print-card">
        {/* Top Action Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2A2E34] no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EB232D]/20 border border-[#EB232D]/40 flex items-center justify-center text-[#EB232D]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Simulated Clinical Handover Summary
              </h2>
              <p className="text-xs text-[#8E959E]">
                Concise SBAR-style briefing for paramedic & emergency department intake
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#24272B] hover:bg-[#2F343B] text-xs font-semibold rounded-lg border border-[#383D43] text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#24272B] hover:bg-[#2F343B] text-xs font-semibold rounded-lg border border-[#383D43] text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8E959E] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Handover Document Printable Container */}
        <div className="mt-4 space-y-4 text-xs font-sans">
          {/* Watermark / Legal Banner */}
          <div className="p-3 rounded-xl bg-[#EB232D]/10 border border-[#EB232D]/30 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#EB232D] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider">
                SIMULATED HANDOVER — NOT AN OFFICIAL HOSPITAL ACCEPTANCE
              </div>
              <p className="text-[11px] text-[#8E959E] mt-0.5 leading-relaxed">
                This document is a synthetic handover demonstration generated by ResQ. Clinical data is patient-reported, not verified. Emergency services are NOT automatically dispatched by this sheet.
              </p>
            </div>
          </div>

          {/* Section 1: Header / Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#141618] border border-[#2A2E34]">
            <div>
              <span className="text-[10px] text-[#8E959E] uppercase block">Incident ID</span>
              <span className="font-mono font-bold text-white text-sm">{incident.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E959E] uppercase block">Timestamp (IST)</span>
              <span className="font-mono text-white text-sm">{incident.createdTimeString}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E959E] uppercase block">Mode</span>
              <span className={`text-xs font-semibold ${incident.isDrill ? 'text-amber-400' : 'text-[#EB232D]'}`}>
                {incident.isDrill ? 'Practice Drill' : 'Demo Incident'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E959E] uppercase block">Data Status</span>
              <span className="text-[11px] text-amber-300 font-medium">Self/Family Reported</span>
            </div>
          </div>

          {/* Section 2: Patient Baseline */}
          <div className="p-3.5 rounded-xl bg-[#141618] border border-[#2A2E34] space-y-2">
            <div className="flex justify-between items-center border-b border-[#24272B] pb-1.5">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#EB232D]" />
                <span>Patient Baseline (Self-Entered)</span>
              </span>
              <span className="text-[10px] text-amber-400">Not clinically verified</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[#8E959E]">Name: </span>
                <strong className="text-white text-sm">{patient.displayName}</strong>
              </div>
              <div>
                <span className="text-[#8E959E]">Age Group: </span>
                <span className="text-white">{patient.ageRange}</span>
              </div>
              <div>
                <span className="text-[#8E959E]">Blood Group: </span>
                <span className="text-white font-mono">{patient.bloodGroup || 'Not reported'}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[#8E959E] block">Known Conditions:</span>
                <span className="text-white">{patient.conditions.join(', ') || 'None reported'}</span>
              </div>
              <div className="bg-red-950/40 p-2 rounded border border-red-700/40">
                <span className="text-red-300 font-bold block">ALLERGIES (CRITICAL):</span>
                <span className="text-red-100 font-semibold">{patient.allergies.join(', ') || 'None reported'}</span>
              </div>
            </div>
            <div>
              <span className="text-[#8E959E] block">Current Routine Medicines:</span>
              <span className="text-white font-mono">{patient.medicines.join(', ') || 'None reported'}</span>
            </div>
          </div>

          {/* Section 3: Incident Location */}
          <div className="p-3.5 rounded-xl bg-[#141618] border border-[#2A2E34] space-y-1.5">
            <div className="flex justify-between items-center border-b border-[#24272B] pb-1.5">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#EB232D]" />
                <span>Incident Scene Location</span>
              </span>
              <span className="text-[10px] text-[#8E959E] uppercase font-mono">
                Source: {incident.location.sourceDescription}
              </span>
            </div>
            <p className="text-white font-medium text-xs leading-relaxed">
              {incident.location.address}
            </p>
            {incident.location.landmark && (
              <p className="text-[#8E959E] text-[11px]">
                Landmark: <span className="text-white">{incident.location.landmark}</span>
              </p>
            )}
            {incident.location.coordinates && (
              <p className="text-[11px] font-mono text-[#8E959E]">
                Lat/Lng: {incident.location.coordinates.latitude.toFixed(5)}, {incident.location.coordinates.longitude.toFixed(5)}
              </p>
            )}
          </div>

          {/* Section 4: Reported Observations (Attributed, Non-Inferred) */}
          <div className="p-3.5 rounded-xl bg-[#141618] border border-[#2A2E34] space-y-2">
            <div className="flex justify-between items-center border-b border-[#24272B] pb-1.5">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#EB232D]" />
                <span>Bystander Observations (Non-Inferred Chronology)</span>
              </span>
              <span className="text-[10px] text-[#8E959E]">Attributed directly to witnesses</span>
            </div>
            {incident.observations.length === 0 ? (
              <p className="text-[#8E959E] italic py-1">No bystander observations entered yet.</p>
            ) : (
              <div className="space-y-1.5">
                {incident.observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-2 rounded bg-[#1C1F22] border border-[#2A2E34] flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{obs.category}</span>
                        <span className="text-[10px] text-[#8E959E]">· {obs.attribution}</span>
                      </div>
                      <p className="text-slate-300 mt-0.5">{obs.rawText}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] text-[#8E959E] block">{obs.timeReported}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#24272B] text-amber-300 border border-[#383D43]">
                        {obs.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {incident.episodeTimer && (
              <div className="p-2 rounded bg-amber-950/30 border border-amber-600/30 text-amber-200 text-[11px]">
                <strong>User-Reported Episode Timer:</strong> Started at {formatTimeIST(incident.episodeTimer.startedAt)} by {incident.episodeTimer.reportedBy}. (Not an AI-detected or automated duration).
              </div>
            )}
          </div>

          {/* Section 5: Insurance & Hospital Preference Verification */}
          <div className="p-3.5 rounded-xl bg-[#141618] border border-[#2A2E34] space-y-2">
            <div className="flex justify-between items-center border-b border-[#24272B] pb-1.5">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8E959E]" />
                <span>Insurance Details & Hospital Preference</span>
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">For Hospital Verification</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[#8E959E] block">Insurance Information:</span>
                <p className="text-white font-medium">
                  {patient.insuranceProvider || 'No provider entered'} — {patient.insurancePolicyRef || 'No policy reference'}
                </p>
                <p className="text-[11px] text-amber-300 leading-snug">
                  * Insurance details provided by family for hospital verification. Pre-authorisation NOT filed; cashless care NOT approved; claim NOT submitted.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#8E959E] block">Family Hospital Preference:</span>
                <p className="text-white font-medium">
                  {patient.hospitalPreference || 'None specified'}
                </p>
                <p className="text-[11px] text-[#8E959E] leading-snug">
                  * Patient/family preference only — not an automated destination decision, and does NOT constitute hospital acceptance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Emergency Contacts */}
          <div className="p-3.5 rounded-xl bg-[#141618] border border-[#2A2E34] space-y-1.5">
            <span className="font-bold text-white text-xs block">Emergency Contacts on File</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {patient.emergencyContacts.map((c) => (
                <div key={c.id} className="p-2 rounded bg-[#1C1F22] border border-[#2A2E34] flex justify-between items-center">
                  <div>
                    <span className="text-white font-semibold">{c.name}</span>{' '}
                    <span className="text-[#8E959E]">({c.relationship})</span>
                  </div>
                  <span className="font-mono text-white text-[11px]">{c.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="mt-5 pt-3 border-t border-[#2A2E34] flex items-center justify-between no-print">
          <span className="text-[11px] text-[#8E959E]">
            Review logged in incident timeline
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-[#24272B] hover:bg-[#2F343B] text-white text-xs font-semibold rounded-xl border border-[#383D43] transition-colors"
            >
              {copied ? 'Copied to Clipboard' : 'Copy Handover'}
            </button>
            <button
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Close Handover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
