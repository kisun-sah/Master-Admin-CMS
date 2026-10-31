import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({
  themeMode: 'system',
  resolvedTheme: 'dark',
  setThemeMode: () => {},
  cycleTheme: () => {},
  theme: 'system',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
});

const STORAGE_KEY = 'master_admin_theme_mode';

export function ThemeProvider({ children }) {
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch (e) {}
    return 'dark'; // Obsidian default for agency studio
  });

  const getResolvedTheme = useCallback((mode) => {
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState(() => getResolvedTheme(themeMode));

  const applyThemeToDOM = useCallback((theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (typeof document !== 'undefined' && document.body) {
      document.body.setAttribute('data-theme', theme);
    }
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      }
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
      root.style.colorScheme = 'light';
    }
  }, []);

  useEffect(() => {
    const resolved = getResolvedTheme(themeMode);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);

    try {
      localStorage.setItem(STORAGE_KEY, themeMode);
    } catch (e) {}
  }, [themeMode, getResolvedTheme, applyThemeToDOM]);

  useEffect(() => {
    if (themeMode !== 'system') return;
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newResolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      applyThemeToDOM(newResolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, applyThemeToDOM]);

  const setThemeMode = useCallback((mode) => {
    if (mode === 'light' || mode === 'dark' || mode === 'system') {
      setThemeModeState(mode);
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        setThemeMode,
        cycleTheme,
        theme: themeMode,
        setTheme: setThemeMode,
        toggleTheme: cycleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

