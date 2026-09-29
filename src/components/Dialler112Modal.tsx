import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Dialler112ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiallerTriggered: () => void;
}

export const Dialler112Modal: React.FC<Dialler112ModalProps> = ({
  isOpen,
  onClose,
  onDiallerTriggered,
}) => {
  const [hasOpenedDialler, setHasOpenedDialler] = useState(false);

  if (!isOpen) return null;

  const handleOpenDialler = () => {
    setHasOpenedDialler(true);
    onDiallerTriggered();
    // Attempt standard tel: protocol
    window.location.href = 'tel:112';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C1F22] border-2 border-[#EB232D] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-[#F4F5F7]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#2E3339]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EB232D] flex items-center justify-center text-white shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                National Emergency Helpline 112
              </h2>
              <span className="text-xs text-[#8E959E]">
                Official Emergency Response Support System (ERSS India)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E959E] hover:text-white hover:bg-[#2A2E35] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Critical Legal & Operational Notice */}
        <div className="my-4 p-4 rounded-xl bg-[#EB232D]/10 border border-[#EB232D]/40 space-y-2">
          <div className="flex items-center gap-2 text-[#EB232D] font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>CRITICAL EMERGENCY NOTICE</span>
          </div>
          <p className="text-xs text-[#F4F5F7] leading-relaxed">
            Tapping the button below opens your phone’s keypad dialler with <strong>112</strong> pre-filled where supported.
          </p>
          <div className="text-xs text-[#F4F5F7] space-y-1.5 bg-black/40 p-3 rounded-lg border border-[#EB232D]/20">
            <div className="flex items-start gap-2">
              <span className="text-[#EB232D] font-bold">1.</span>
              <span><strong>Opening the dialler does NOT place or answer the call.</strong> You must tap the call button in your device’s phone application.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#EB232D] font-bold">2.</span>
              <span><strong>ResQ cannot silently or automatically place emergency calls.</strong> Indian telecom regulations restrict emergency dialing exclusively to the phone operator interface.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#EB232D] font-bold">3.</span>
              <span><strong>ResQ is NOT an ambulance dispatch service.</strong> ResQ only coordinates patient handover details.</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        {!hasOpenedDialler ? (
          <div className="space-y-3">
            <button
              onClick={handleOpenDialler}
              className="w-full min-h-[52px] bg-[#EB232D] hover:bg-[#d61d27] active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#EB232D]/20"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Open Phone Dialler to 112</span>
            </button>
            <p className="text-[11px] text-center text-[#8E959E]">
              Works on mobile devices with telephony capability. Desktop browsers may prompt to open an associated call app.
            </p>
          </div>
        ) : (
          <div className="space-y-3 bg-[#24272B] p-4 rounded-xl border border-[#383D43]">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Dialler Triggered on Device</span>
            </div>
            <p className="text-xs text-[#8E959E] leading-relaxed">
              Check your phone application to ensure the call was pressed. ResQ does not verify call duration or operator response.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleOpenDialler}
                className="flex-1 min-h-[44px] bg-[#383D43] hover:bg-[#454B53] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Re-open 112 in Dialler</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 min-h-[44px] bg-white text-[#141618] hover:bg-slate-200 text-xs font-bold rounded-lg transition-colors"
              >
                Continue in ResQ
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[#2E3339] flex justify-end">
          <button
            onClick={onClose}
            className="text-xs text-[#8E959E] hover:text-white px-3 py-1.5 rounded transition-colors"
          >
            Dismiss Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
