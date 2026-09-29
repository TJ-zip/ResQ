import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  AlertTriangle,
  ShieldAlert,
  ArrowLeft,
  Info,
  Radio,
  UserCheck,
} from 'lucide-react';
import { Incident } from '../types';

interface VideoRoomViewProps {
  incident: Incident;
  onLeave: () => void;
  onOpenDialler: () => void;
}

export const VideoRoomView: React.FC<VideoRoomViewProps> = ({
  incident,
  onLeave,
  onOpenDialler,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAudioFirstMode, setIsAudioFirstMode] = useState(false);
  const [mediaPermissionState, setMediaPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera/mic test
  useEffect(() => {
    let active = true;

    async function startMedia() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMediaPermissionState('denied');
          setErrorMessage('Media devices API not supported by browser.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setMediaPermissionState('granted');
        setErrorMessage(null);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err: unknown) {
        console.warn('Camera/mic access was not granted or denied:', err);
        setMediaPermissionState('denied');
        setErrorMessage(
          'Camera and microphone access denied or not available. Running in Audio-First / Text Demonstration Mode.'
        );
      }
    }

    startMedia();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  const enableAudioFirstFallback = () => {
    setIsAudioFirstMode(true);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
    }
    setIsVideoOff(true);
  };

  const handleLeave = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    onLeave();
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleLeave}
          className="flex items-center gap-1.5 text-xs text-[#8E959E] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Incident Sheet</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDialler}
            className="px-3 py-1.5 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <span>Emergency 112 Dialler</span>
          </button>
        </div>
      </div>

      {/* Prominent Demo Notice Required by Spec */}
      <div className="p-3.5 rounded-xl bg-[#EB232D]/15 border-2 border-[#EB232D] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#EB232D] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
            <span>VIDEO UI DEMO — NO LIVE TRANSMISSION</span>
            <span className="text-[10px] bg-[#24272B] px-1.5 py-0.5 rounded text-white border border-[#383D43]">
              Credentials Unconfigured
            </span>
          </div>
          <p className="text-xs text-[#F4F5F7] leading-relaxed">
            LiveKit / WebRTC provider credentials are not configured in this demo build. No video or audio is transmitted over the network, recorded, transcribed, or stored.
          </p>
        </div>
      </div>

      {/* Permission Denied / Error Feedback Banner */}
      {mediaPermissionState === 'denied' && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={enableAudioFirstFallback}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold rounded border border-amber-500/40 whitespace-nowrap"
          >
            Use Audio-First Mode
          </button>
        </div>
      )}

      {/* Video Screens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Stream (Bystander View) */}
        <div className="relative aspect-video rounded-2xl bg-[#141618] border border-[#2E3339] overflow-hidden flex items-center justify-center shadow-lg">
          {mediaPermissionState === 'granted' && !isVideoOff && !isAudioFirstMode ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#24272B] flex items-center justify-center text-[#8E959E]">
                {isAudioFirstMode ? <Radio className="w-7 h-7 text-amber-400" /> : <VideoOff className="w-7 h-7" />}
              </div>
              <span className="font-semibold text-white text-sm">
                {isAudioFirstMode
                  ? 'Audio-First Mode Active'
                  : isVideoOff
                  ? 'Camera Turned Off'
                  : 'Camera Stream Not Available'}
              </span>
              <p className="text-xs text-[#8E959E] max-w-xs">
                {isAudioFirstMode
                  ? 'Optimized for low-bandwidth cellular networks in India'
                  : 'Local device video feed disabled'}
              </p>
            </div>
          )}

          {/* Local overlay label */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-white flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>You (Bystander / Family)</span>
          </div>

          <div className="absolute bottom-3 left-3 text-[10px] text-[#8E959E] bg-black/60 px-2 py-0.5 rounded">
            Local preview only · Not streamed
          </div>
        </div>

        {/* Remote Participant Placeholder (Authorized Responder) */}
        <div className="relative aspect-video rounded-2xl bg-[#181A1D] border border-[#2E3339] overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-lg">
          <div className="w-14 h-14 rounded-full bg-[#24272B] border border-[#383D43] flex items-center justify-center text-[#8E959E]">
            <UserCheck className="w-7 h-7 text-[#EB232D]" />
          </div>

          <div>
            <h4 className="font-bold text-white text-sm">
              Demo Responder Station
            </h4>
            <span className="text-xs text-[#8E959E]">
              Opaque Room ID: <code className="font-mono text-slate-300">room-{incident.id.toLowerCase()}</code>
            </span>
          </div>

          {/* Explicit simulated status label */}
          <div className="p-2.5 rounded-lg bg-[#24272B] border border-[#383D43] text-xs text-[#8E959E] max-w-sm">
            <span className="font-semibold text-amber-300 block">Simulated Participant State:</span>
            No live remote responder stream. ResQ will never fake remote medical footage or claim clinician connectivity.
          </div>

          {/* Remote overlay label */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-white flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Remote Channel (Demo Coordinator)</span>
          </div>
        </div>
      </div>

      {/* Touch-Friendly Control Bar (Bottom 40% thumb zone) */}
      <div className="bg-[#1C1F22] border border-[#2E3339] rounded-2xl p-4 flex flex-wrap items-center justify-center gap-3 shadow-lg">
        {/* Mute button */}
        <button
          onClick={toggleMute}
          className={`min-h-[48px] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            isMuted
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#24272B] hover:bg-[#2F343B] text-white border border-[#383D43]'
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4 text-amber-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
        </button>

        {/* Video toggle button */}
        <button
          onClick={toggleVideo}
          className={`min-h-[48px] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            isVideoOff
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#24272B] hover:bg-[#2F343B] text-white border border-[#383D43]'
          }`}
        >
          {isVideoOff ? <VideoOff className="w-4 h-4 text-amber-400" /> : <Video className="w-4 h-4 text-emerald-400" />}
          <span>{isVideoOff ? 'Start Camera' : 'Stop Camera'}</span>
        </button>

        {/* Audio-first toggle */}
        <button
          onClick={() => {
            if (isAudioFirstMode) {
              setIsAudioFirstMode(false);
              setIsVideoOff(false);
            } else {
              enableAudioFirstFallback();
            }
          }}
          className={`min-h-[48px] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            isAudioFirstMode
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'bg-[#24272B] hover:bg-[#2F343B] text-white border border-[#383D43]'
          }`}
          title="Switch to low-bandwidth voice mode"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isAudioFirstMode ? 'Video Enabled' : 'Audio-First Fallback'}</span>
        </button>

        {/* Leave button */}
        <button
          onClick={handleLeave}
          className="min-h-[48px] px-5 py-2.5 bg-[#EB232D] hover:bg-[#d61d27] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Leave Room</span>
        </button>
      </div>

      {/* Safety Notice regarding Transcription / Recording */}
      <div className="p-3 rounded-xl bg-[#141618] border border-[#24272B] text-xs text-[#8E959E] flex items-center justify-between">
        <div>
          <span className="text-white font-semibold">Privacy Policy: </span>
          <span>Audio/video is never recorded or automatically transcribed. No automated model diagnosis is active.</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
          Recording: Disabled
        </span>
      </div>
    </div>
  );
};
