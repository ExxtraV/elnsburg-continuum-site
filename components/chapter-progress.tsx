"use client";

import { useEffect } from "react";
import { useProgress } from "@/components/progress-provider";

export function ChapterProgress({
  series,
  chapter,
}: {
  series: string;
  chapter: number;
}) {
  const { progress, add } = useProgress();
  const read = progress.some((p) => p.series === series && p.chapter === chapter);

  useEffect(() => {
    if (read) return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ series, chapter }),
    }).then(() => add({ series, chapter }));
  }, [series, chapter, add, read]);

  return read ? <span className="ml-2 text-xs text-green-400">(Read)</span> : null;
}
