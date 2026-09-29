import React from 'react';
import { AlertTriangle, ShieldAlert, Monitor, Smartphone, BookOpen, Users } from 'lucide-react';
import { AppView } from '../types';

interface HeaderBannerProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isDrillActive: boolean;
  onToggleDrill: () => void;
  hasActiveIncident: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  currentView,
  onNavigate,
  isDrillActive,
  onToggleDrill,
  hasActiveIncident,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#141618] border-b border-[#24272B] shadow-md select-none no-print">
      {/* Universal Mandatory Demo Warning Banner */}
      <div className="bg-[#EB232D]/15 border-b border-[#EB232D]/30 px-3 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-[#EB232D] shrink-0 animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-white uppercase truncate">
            DEMO — NO EMERGENCY SERVICE CONNECTED
          </span>
        </div>
        <span className="text-[11px] text-[#8E959E] hidden sm:inline whitespace-nowrap">
          Fictional data only · Never calls 112 automatically
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity focus-visible:outline-none"
            title="ResQ Emergency Coordination Concept"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EB232D] flex items-center justify-center text-white font-black text-lg shadow-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white leading-none">
                  ResQ
                </span>
                <span className="text-[10px] font-semibold bg-[#24272B] text-[#8E959E] px-1.5 py-0.5 rounded border border-[#383D43]">
                  INDIA DEMO
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center / Navigation Quick Controls */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Active Incident shortcut */}
          {hasActiveIncident && (
            <button
              onClick={() => onNavigate('incident')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'incident'
                  ? 'bg-[#EB232D] text-white shadow-sm'
                  : 'bg-[#EB232D]/20 text-[#EB232D] hover:bg-[#EB232D]/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#EB232D] ring-2 ring-white/30 animate-ping" />
              <span>Incident</span>
            </button>
          )}

          {/* Patient App vs Responder Desk Mode Switcher */}
          <button
            onClick={() => onNavigate(currentView === 'responder_desk' ? 'home' : 'responder_desk')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-all whitespace-nowrap ${
              currentView === 'responder_desk'
                ? 'bg-white text-[#141618] border-white font-semibold shadow-sm'
                : 'bg-[#24272B] text-[#F4F5F7] border-[#383D43] hover:bg-[#2F343B]'
            }`}
          >
            {currentView === 'responder_desk' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#141618]" />
                <span>Patient View</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#8E959E]" />
                <span className="hidden sm:inline">Demo Responder Desk</span>
                <span className="sm:hidden">Desk</span>
              </>
            )}
          </button>

          {/* Family Profiles */}
          <button
            onClick={() => onNavigate('profiles')}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors ${
              currentView === 'profiles'
                ? 'bg-[#2F343B] text-white border-[#8E959E]'
                : 'bg-[#24272B] text-[#8E959E] border-[#383D43] hover:text-white hover:bg-[#2F343B]'
            }`}
            title="Manage Patient & Family Profiles"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Profiles</span>
          </button>

          {/* Drill Toggle */}
          <button
            onClick={onToggleDrill}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors ${
              isDrillActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[#24272B] text-[#8E959E] border-[#383D43] hover:text-white hover:bg-[#2F343B]'
            }`}
            title="Toggle Practice Drill Simulation Mode"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDrillActive ? 'Drill: ON' : 'Practice Drill'}</span>
          </button>
        </nav>
      </div>

      {/* Drill Active Sub-Banner */}
      {isDrillActive && (
        <div className="bg-amber-950/40 border-b border-amber-600/30 px-3 py-1 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="font-bold tracking-wide uppercase bg-amber-500/30 px-1.5 py-0.5 rounded text-[10px]">
              Drill Mode
            </span>
            <span className="truncate">
              Practice simulation active · Learn handover & coordination steps safely without real services.
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
