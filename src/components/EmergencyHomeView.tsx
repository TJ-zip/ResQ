import React, { useState } from 'react';
import { FamilyProfile } from '../types';
import {
  PhoneCall,
  Play,
  BookOpen,
  Users,
  Eye,
  AlertTriangle,
  Heart,
  Pill,
  ShieldCheck,
  ChevronRight,
  Info,
  Building2,
  Stethoscope,
  Activity,
} from 'lucide-react';

interface EmergencyHomeViewProps {
  profiles: FamilyProfile[];
  selectedProfileId: string;
  onSelectProfile: (id: string) => void;
  onStartIncident: (isDrill: boolean) => void;
  onOpenDialler: () => void;
  onManageProfiles: () => void;
  onOpenRoadmap: () => void;
  isDrillModeActive: boolean;
  onToggleDrillMode: () => void;
}

export const EmergencyHomeView: React.FC<EmergencyHomeViewProps> = ({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onStartIncident,
  onOpenDialler,
  onManageProfiles,
  onOpenRoadmap,
  isDrillModeActive,
  onToggleDrillMode,
}) => {
  const activeProfile =
    profiles.find((p) => p.id === selectedProfileId) || profiles[0] || null;

  return (
    <div className="max-w-xl mx-auto px-4 py-5 space-y-5">
      {/* Real Emergency Service Dialing Action (112) */}
      <div className="bg-[#EB232D] text-white rounded-3xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-red-100">
              Direct Lifeline (India ERSS)
            </span>
          </div>
          <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded text-white font-mono">
            National: 112
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight leading-tight">
            Open Phone to Call 112
          </h2>
          <p className="text-xs text-red-100 mt-1 leading-relaxed">
            Opens your phone’s keypad dialler with 112 pre-filled. ResQ cannot place calls silently or automatically.
          </p>
        </div>

        <button
          onClick={onOpenDialler}
          className="w-full min-h-[52px] bg-white text-[#EB232D] hover:bg-slate-100 active:scale-[0.98] font-black text-base rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg"
        >
          <PhoneCall className="w-5 h-5 text-[#EB232D]" />
          <span>Open Phone to Call 112</span>
        </button>

        <p className="text-[10px] text-center text-red-200">
          Dialler opening does NOT place the call. You must press dial on your device.
        </p>
      </div>

      {/* Demo Incident Action Area */}
      <div className="bg-[#181A1D] border-2 border-[#2E3339] rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#EB232D]" />
            <span>Care Coordination Engine</span>
          </span>
          <span className="text-[10px] bg-[#24272B] text-amber-300 px-2 py-0.5 rounded border border-[#383D43] font-semibold">
            Demonstration Mode
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-white tracking-tight leading-snug">
            {isDrillModeActive ? 'Start Practice Drill Run' : 'Start Demo Incident'}
          </h3>
          <p className="text-xs text-[#8E959E] mt-1 leading-relaxed">
            {isDrillModeActive
              ? 'Run an interactive training drill to rehearse patient handover and observation logging without any risk.'
              : 'Initializes a live incident coordination session with GPS/manual location, timestamped audit log, and responder sync.'}
          </p>
        </div>

        {/* Primary Start Action */}
        <button
          onClick={() => onStartIncident(isDrillModeActive)}
          className={`w-full min-h-[54px] font-black text-base rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-[0.98] ${
            isDrillModeActive
              ? 'bg-amber-500 hover:bg-amber-400 text-[#141618] shadow-amber-900/30'
              : 'bg-[#EB232D] hover:bg-[#d61d27] text-white shadow-red-950/40'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{isDrillModeActive ? 'Launch Practice Drill' : 'Start Demo Incident'}</span>
        </button>

        {/* Drill Mode Toggle Card */}
        <div className="pt-2 border-t border-[#2A2E34] flex items-center justify-between">
          <div className="text-xs text-[#8E959E]">
            <span className="text-white font-semibold">Training & Volunteer Mode:</span>{' '}
            <span>{isDrillModeActive ? 'Active (Obvious simulation)' : 'Standard Demo'}</span>
          </div>
          <button
            onClick={onToggleDrillMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              isDrillModeActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#24272B] text-[#8E959E] border-[#383D43] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1" />
            <span>{isDrillModeActive ? 'Disable Drill' : 'Enable Drill'}</span>
          </button>
        </div>
      </div>

      {/* Selected Patient Profile Quick Selector */}
      {activeProfile && (
        <div className="bg-[#181A1D] border border-[#2E3339] rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2A2E34]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#EB232D]" />
              <h4 className="font-bold text-sm text-white">Active Patient Profile</h4>
            </div>
            <button
              onClick={onManageProfiles}
              className="text-xs text-[#EB232D] hover:underline font-semibold flex items-center gap-0.5"
            >
              <span>Switch / Edit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-white block">
                  {activeProfile.displayName}
                </span>
                <span className="text-xs text-[#8E959E]">
                  {activeProfile.ageRange} · Blood Group: {activeProfile.bloodGroup}
                </span>
              </div>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                Self/Family Reported
              </span>
            </div>

            {/* Quick badges */}
            <div className="pt-1 text-xs space-y-1">
              <div>
                <span className="text-[#8E959E]">Reported conditions: </span>
                <span className="text-white">
                  {activeProfile.conditions.join(', ') || 'None reported'}
                </span>
              </div>
              {activeProfile.allergies.length > 0 && (
                <div className="text-red-300 font-medium">
                  <span>Reported Allergies: </span>
                  <span>{activeProfile.allergies.join(', ')}</span>
                </div>
              )}
              {activeProfile.hospitalPreference && (
                <div className="text-[#8E959E]">
                  <span>Hospital Preference: </span>
                  <span className="text-white">{activeProfile.hospitalPreference}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick select other family members pill bar */}
          {profiles.length > 1 && (
            <div className="pt-2 border-t border-[#2A2E34] space-y-1.5">
              <span className="text-[11px] text-[#8E959E] block">
                Quick select for this emergency:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                      p.id === activeProfile.id
                        ? 'bg-white text-[#141618] font-bold border-white'
                        : 'bg-[#24272B] text-[#8E959E] border-[#383D43] hover:text-white'
                    }`}
                  >
                    {p.displayName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety & Secondary Modules */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <button
          onClick={onManageProfiles}
          className="p-3.5 rounded-2xl bg-[#181A1D] border border-[#2E3339] hover:border-[#383D43] text-left transition-colors flex flex-col justify-between space-y-2"
        >
          <div className="w-8 h-8 rounded-lg bg-[#24272B] flex items-center justify-center text-white">
            <Users className="w-4 h-4 text-[#EB232D]" />
          </div>
          <div>
            <span className="font-bold text-white block">Family Profiles</span>
            <span className="text-[11px] text-[#8E959E]">
              Add or edit synthetic health records
            </span>
          </div>
        </button>

        <button
          onClick={onOpenRoadmap}
          className="p-3.5 rounded-2xl bg-[#181A1D] border border-[#2E3339] hover:border-[#383D43] text-left transition-colors flex flex-col justify-between space-y-2"
        >
          <div className="w-8 h-8 rounded-lg bg-[#24272B] flex items-center justify-center text-amber-400">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">Clinical Guidance</span>
            <span className="text-[11px] text-amber-400 font-medium">
              Roadmap (Disabled)
            </span>
          </div>
        </button>
      </div>

      {/* Disclaimer footer */}
      <div className="p-3 rounded-xl bg-[#141618] border border-[#24272B] text-center text-[11px] text-[#8E959E] leading-relaxed">
        ResQ is an India-focused emergency care coordination concept demo. Fictional people & synthetic records. No government affiliation or ambulance dispatch implied.
      </div>
    </div>
  );
};
