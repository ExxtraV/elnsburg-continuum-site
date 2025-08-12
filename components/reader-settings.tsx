'use client';

import { useEffect, useState } from 'react';

export function ReaderSettings() {
  const [fontSize, setFontSize] = useState<number>(16);
  const [lineHeight, setLineHeight] = useState<number>(1.75);

  useEffect(() => {
    const storedSize = Number(window.localStorage.getItem('reader-font-size'));
    const storedLine = Number(window.localStorage.getItem('reader-line-height'));
    if (!isNaN(storedSize)) setFontSize(storedSize);
    if (!isNaN(storedLine)) setLineHeight(storedLine);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--reader-font-size', `${fontSize}px`);
    window.localStorage.setItem('reader-font-size', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.style.setProperty('--reader-line-height', `${lineHeight}`);
    window.localStorage.setItem('reader-line-height', String(lineHeight));
  }, [lineHeight]);

  return (
    <div className="mb-4 space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <label htmlFor="font-size" className="w-24">Font Size</label>
        <input
          id="font-size"
          type="range"
          min={14}
          max={24}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="line-height" className="w-24">Line Height</label>
        <input
          id="line-height"
          type="range"
          min={1.2}
          max={2}
          step={0.05}
          value={lineHeight}
          onChange={(e) => setLineHeight(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

