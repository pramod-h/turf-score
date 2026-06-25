"use client";

import { useCallback, useRef } from "react";

export type VoiceAction =
  | "DOT"
  | "RUN_1"
  | "RUN_2"
  | "RUN_4"
  | "RUN_6"
  | "WIDE"
  | "NO_BALL"
  | "WICKET"
  | "UNDO";

// Web Speech API types — not in lib.dom.d.ts by default
interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}
type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function parse(transcript: string): VoiceAction | null {
  const t = transcript.toLowerCase().trim();

  if (/\b(wicket|out|dismissed|caught|bowled|lbw|stumped)\b/.test(t)) return "WICKET";
  if (/\b(no[- ]?ball|nob)\b/.test(t)) return "NO_BALL";
  if (/\b(wide|wides)\b/.test(t)) return "WIDE";
  if (/\b(six|sixer|maximum|6)\b/.test(t)) return "RUN_6";
  if (/\b(four|boundary|4)\b/.test(t)) return "RUN_4";
  if (/\b(two|double|2)\b/.test(t)) return "RUN_2";
  if (/\b(one|single|1)\b/.test(t)) return "RUN_1";
  if (/\b(dot|zero|miss|0)\b/.test(t)) return "DOT";
  if (/\b(undo|cancel|back|mistake)\b/.test(t)) return "UNDO";

  return null;
}

export function isVoiceSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as WindowWithSpeech;
  return !!(w.SpeechRecognition ?? w.webkitSpeechRecognition);
}

function getSR(): SpeechRecognitionConstructor | null {
  const w = window as WindowWithSpeech;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type VoiceScoreOptions = {
  handlers: Partial<Record<VoiceAction, () => void>>;
  onListening?: (v: boolean) => void;
  onAction?: (a: VoiceAction) => void;
  onTranscript?: (t: string) => void;
  autoRestart?: boolean;
};

export function useVoiceScore({
  handlers,
  onListening,
  onAction,
  onTranscript,
  autoRestart = true,
}: VoiceScoreOptions) {
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const activeRef = useRef(false);

  const stop = useCallback(() => {
    activeRef.current = false;
    recRef.current?.stop();
    recRef.current = null;
    onListening?.(false);
  }, [onListening]);

  const startOnce = useCallback(() => {
    const SR = getSR();
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 4;
    rec.continuous = false;
    recRef.current = rec;

    rec.onstart = () => onListening?.(true);

    rec.onend = () => {
      onListening?.(false);
      if (autoRestart && activeRef.current) {
        setTimeout(startOnce, 200);
      }
    };

    rec.onerror = () => {
      onListening?.(false);
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const result = e.results[0];
      const candidates = Array.from({ length: result.length }, (_, i) =>
        result[i].transcript
      );

      let action: VoiceAction | null = null;
      for (const c of candidates) {
        action = parse(c);
        if (action) {
          onTranscript?.(c);
          break;
        }
      }

      if (action) {
        onAction?.(action);
        handlers[action]?.();
      } else {
        onTranscript?.(candidates[0] ?? "");
      }
    };

    try {
      rec.start();
    } catch {
      onListening?.(false);
    }
  }, [handlers, onListening, onAction, onTranscript, autoRestart]);

  const start = useCallback(() => {
    if (!isVoiceSupported()) return;
    activeRef.current = true;
    startOnce();
  }, [startOnce]);

  return { start, stop };
}
