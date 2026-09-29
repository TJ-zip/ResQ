import React from 'react';
import { X, ShieldAlert, Lock, Stethoscope, AlertTriangle } from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181A1D] border border-[#383D43] rounded-2xl max-w-lg w-full p-6 text-[#F4F5F7] shadow-2xl">
        <div className="flex items-start justify-between pb-3 border-b border-[#2A2E34]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#24272B] border border-[#383D43] flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Clinical Guidance Protocols (Roadmap Item)
              </h3>
              <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                Module Disabled — Clinician Reviewed Only
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8E959E] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3 text-xs leading-relaxed text-[#8E959E]">
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Safety & Regulatory Architecture Guardrail</span>
            </div>
            <p className="text-[11px]">
              AI models must never diagnose, triage, calculate drug dosages, or offer medical advice autonomously in emergency situations.
            </p>
          </div>

          <p>
            In the production specification, interactive step-by-step guidance (such as CPR rhythm metronomes, recovery positioning aids, and choking manoeuvres) must be rigorously vetted, accredited by Indian medical boards (e.g., NMC / AIIMS guidelines), and reviewed by licensed clinicians.
          </p>

          <div className="p-3 rounded-xl bg-[#141618] border border-[#24272B] space-y-2">
            <span className="font-bold text-white text-xs block">Required Prior to Activation:</span>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
              <li>IRB / Ethics committee protocol clearance</li>
              <li>Dual clinician sign-off on all emergency decision trees</li>
              <li>Multi-lingual voice guidance in regional Indian languages</li>
              <li>Zero autonomous LLM inference in the diagnostic path</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-[#2A2E34] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#24272B] hover:bg-[#2F343B] text-white text-xs font-semibold rounded-xl border border-[#383D43] transition-colors"
          >
            Close Roadmap Overview
          </button>
        </div>
      </div>
    </div>
  );
};
