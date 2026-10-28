"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type ExamLevel = "1" | "2" | "3";
export type ExamRecord = { best: number; passed: boolean; attempts: number; date?: string };

export type Progress = {
  version: 1;
  studentName: string;
  visited: Record<string, number>;
  explorerViewed: string[];
  explorerChallengeBest: number;
  roomFound: string[];
  roomGoodViewed: string[];
  roomChecklistBest: number;
  safetyTopics: string[];
  safetyExercises: Record<string, boolean>;
  installTopics: string[];
  simScenarios: string[];
  modesViewed: string[];
  redundancyExperiments: string[];
  diagnostics: Record<string, number>;
  calculators: string[];
  exams: Record<ExamLevel, ExamRecord>;
};

/** Keys whose value is a list of unique ids. */
export type ListKey =
  | "explorerViewed"
  | "roomFound"
  | "roomGoodViewed"
  | "safetyTopics"
  | "installTopics"
  | "simScenarios"
  | "modesViewed"
  | "redundancyExperiments"
  | "calculators";

const emptyExam = (): ExamRecord => ({ best: 0, passed: false, attempts: 0 });

export const initialProgress = (): Progress => ({
  version: 1,
  studentName: "",
  visited: {},
  explorerViewed: [],
  explorerChallengeBest: 0,
  roomFound: [],
  roomGoodViewed: [],
  roomChecklistBest: 0,
  safetyTopics: [],
  safetyExercises: {},
  installTopics: [],
  simScenarios: [],
  modesViewed: [],
  redundancyExperiments: [],
  diagnostics: {},
  calculators: [],
  exams: { "1": emptyExam(), "2": emptyExam(), "3": emptyExam() },
});

const STORAGE_KEY = "genset-academy:progress:v1";

type ProgressValue = {
  progress: Progress;
  loaded: boolean;
  update: (fn: (p: Progress) => Progress) => void;
  addToList: (key: ListKey, id: string) => void;
  markVisited: (moduleId: string) => void;
  recordDiagnostic: (scenarioId: string, scorePct: number) => void;
  recordExam: (level: ExamLevel, scorePct: number, passed: boolean) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressValue | null>(null);

function merge(saved: Partial<Progress>): Progress {
  const base = initialProgress();
  return {
    ...base,
    ...saved,
    exams: { ...base.exams, ...(saved.exams ?? {}) },
    version: 1,
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [loaded, setLoaded] = useState(false);
  const firstSave = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(merge(JSON.parse(raw) as Partial<Progress>));
    } catch {
      /* corrupted or unavailable storage: start fresh */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable */
    }
  }, [progress, loaded]);

  const update = useCallback((fn: (p: Progress) => Progress) => setProgress((p) => fn(p)), []);

  const addToList = useCallback((key: ListKey, id: string) => {
    setProgress((p) => (p[key].includes(id) ? p : { ...p, [key]: [...p[key], id] }));
  }, []);

  const markVisited = useCallback((moduleId: string) => {
    setProgress((p) => ({ ...p, visited: { ...p.visited, [moduleId]: Date.now() } }));
  }, []);

  const recordDiagnostic = useCallback((scenarioId: string, scorePct: number) => {
    setProgress((p) => ({
      ...p,
      diagnostics: { ...p.diagnostics, [scenarioId]: Math.max(scorePct, p.diagnostics[scenarioId] ?? 0) },
    }));
  }, []);

  const recordExam = useCallback((level: ExamLevel, scorePct: number, passed: boolean) => {
    setProgress((p) => {
      const prev = p.exams[level];
      const improved = scorePct >= prev.best;
      return {
        ...p,
        exams: {
          ...p.exams,
          [level]: {
            best: Math.max(prev.best, scorePct),
            passed: prev.passed || passed,
            attempts: prev.attempts + 1,
            date: passed && (improved || !prev.passed) ? new Date().toISOString() : prev.date,
          },
        },
      };
    });
  }, []);

  const reset = useCallback(() => setProgress(initialProgress()), []);

  const value = useMemo(
    () => ({ progress, loaded, update, addToList, markVisited, recordDiagnostic, recordExam, reset }),
    [progress, loaded, update, addToList, markVisited, recordDiagnostic, recordExam, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
