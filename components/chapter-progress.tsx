'use client';

import { useEffect, useState } from "react";

function useProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const current = scrollTop;
      setProgress(total > 0 ? current / total : 0);
    };

    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return progress;
}

export function ChapterProgress() {
  const progress = useProgress();

  useEffect(() => {
    // Reserved for side effects when progress updates (e.g., analytics)
  }, [progress]);

  return (
    <div className="fixed left-0 right-0 top-0 h-1 bg-royal-gold/20">
      <div
        className="h-full bg-royal-gold transition-all duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

