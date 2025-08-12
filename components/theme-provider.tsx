'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      document.documentElement.classList.add(stored);
    } else {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.add(theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-sm text-royal-gold border border-royal-gold rounded"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
}

