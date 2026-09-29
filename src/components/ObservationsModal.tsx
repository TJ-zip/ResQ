import React, { useState } from 'react';
import { ObservationAttribution, ObservationStatus } from '../types';
import { Activity, Clock, ShieldAlert, AlertCircle, X, Check } from 'lucide-react';
import { formatTimeIST } from '../utils/storage';

interface ObservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitObservation: (
    category: string,
    rawText: string,
    attribution: ObservationAttribution,
    status: ObservationStatus
  ) => void;
}

const COMMON_CATEGORIES = [
  'Shaking / seizure-like movement',
  'Unresponsive / difficult to wake',
  'Breathing difficulty / gasping',
  'Severe chest discomfort',
  'Fall / visible trauma',
  'Slurred speech / facial weakness',
  'Severe allergic reaction / swelling',
  'Unknown / not observed',
  'Other observation',
];

export const ObservationsModal: React.FC<ObservationsModalProps> = ({
  isOpen,
  onClose,
  onSubmitObservation,
}) => {
  const [category, setCategory] = useState(COMMON_CATEGORIES[0]);
  const [attribution, setAttribution] = useState<ObservationAttribution>('Bystander');
  const [status, setStatus] = useState<ObservationStatus>('Ongoing');
  const [details, setDetails] = useState('');
  const [observedTimeText, setObservedTimeText] = useState('Just now');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let combinedDescription = details.trim();
    if (!combinedDescription) {
      if (category === 'Unknown / not observed') {
        combinedDescription = 'Bystander noted status is uncertain or not directly witnessed.';
      } else {
        combinedDescription = `${attribution} reports ${category.toLowerCase()} (${status.toLowerCase()}).`;
      }
    } else {
      // Ensure attribution is explicitly preserved
      combinedDescription = `${attribution} reports: ${combinedDescription}`;
    }

    if (observedTimeText && observedTimeText !== 'Just now') {
      combinedDescription += ` [Reported time: ${observedTimeText}]`;
    }

    onSubmitObservation(category, combinedDescription, attribution, status);
    // Reset and close
    setDetails('');
    setCategory(COMMON_CATEGORIES[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181A1D] border border-[#383D43] rounded-2xl max-w-lg w-full p-5 sm:p-6 text-[#F4F5F7] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#2A2E34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#24272B] border border-[#383D43] flex items-center justify-center text-[#EB232D]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Record Bystander Observation</h3>
              <p className="text-[11px] text-[#8E959E]">
                Document what was witnessed without automated inference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8E959E] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety & Clinical Guardrail Notice */}
        <div className="my-3 p-3 rounded-lg bg-[#24272B] border border-[#383D43] text-xs text-[#8E959E] space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Strict Clinical Non-Inference Rule</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Record only direct observations. ResQ will never infer seizure duration, respiratory status, or medical diagnoses. Uncertain observations remain explicitly labeled as reported.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[#8E959E] mb-1 font-semibold">
              Observed Symptom Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
            >
              {COMMON_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Attribution & Current Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#8E959E] mb-1 font-semibold">
                Reported By (Source)
              </label>
              <select
                value={attribution}
                onChange={(e) => setAttribution(e.target.value as ObservationAttribution)}
                className="w-full h-10 px-2 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
              >
                <option value="Bystander">Bystander</option>
                <option value="Family member">Family Member</option>
                <option value="Self">Self (Patient)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8E959E] mb-1 font-semibold">
                Episode State
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ObservationStatus)}
                className="w-full h-10 px-2 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
              >
                <option value="Ongoing">Observed Ongoing</option>
                <option value="Stopped">Observed Stopped</option>
                <option value="Unknown / not observed">Unknown / Not observed</option>
              </select>
            </div>
          </div>

          {/* Time text */}
          <div>
            <label className="block text-[#8E959E] mb-1 font-semibold flex items-center justify-between">
              <span>Time of Onset (User-Reported)</span>
              <span className="text-[10px] text-[#8E959E]">Current time: {formatTimeIST()}</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Just now, or Started at 14:03, or ~5 mins ago"
              value={observedTimeText}
              onChange={(e) => setObservedTimeText(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none"
            />
          </div>

          {/* Additional details text */}
          <div>
            <label className="block text-[#8E959E] mb-1 font-semibold">
              Bystander Notes & Specifics (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Shaking began suddenly while seated. Left arm jerking. Eyes open but unresponsive to voice."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#141618] border border-[#2E3339] text-white focus:border-[#EB232D] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-[#2A2E34] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#8E959E] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Log Observation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
