"use client";

import { create } from "zustand";
import type { VoiceAction } from "@/hooks/use-voice-score";

type VoiceStore = {
  voiceEnabled: boolean;
  listening: boolean;
  lastAction: VoiceAction | null;
  lastTranscript: string;
  supported: boolean;
  toggleVoice: () => void;
  setListening: (v: boolean) => void;
  setLastAction: (a: VoiceAction | null) => void;
  setLastTranscript: (t: string) => void;
  setSupported: (v: boolean) => void;
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  voiceEnabled: false,
  listening: false,
  lastAction: null,
  lastTranscript: "",
  supported: false,

  toggleVoice: () => set((s) => ({ voiceEnabled: !s.voiceEnabled })),
  setListening: (v) => set({ listening: v }),
  setLastAction: (a) => set({ lastAction: a }),
  setLastTranscript: (t) => set({ lastTranscript: t }),
  setSupported: (v) => set({ supported: v }),
}));
