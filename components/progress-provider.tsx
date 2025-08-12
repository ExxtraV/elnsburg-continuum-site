"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Progress = { id?: string; series: string; chapter: number };

type ProgressContextType = { progress: Progress[]; add: (p: Progress) => void };

const ProgressContext = createContext<ProgressContextType>({ progress: [], add: () => {} });

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => setProgress(data.progress || []))
      .catch(() => {});
  }, []);

  const add = (p: Progress) => setProgress((prev) => [...prev, p]);

  return <ProgressContext.Provider value={{ progress, add }}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  return useContext(ProgressContext);
}
