import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({
  themeMode: 'system', // 'light' | 'dark' | 'system'
  resolvedTheme: 'light', // 'light' | 'dark'
  setThemeMode: () => {},
  cycleTheme: () => {},
});

const STORAGE_KEY = 'master_admin_theme_mode';

export function ThemeProvider({ children }) {
  // Read saved mode from localStorage, fallback to 'system'
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch (e) {
      // localStorage disabled or security error
    }
    return 'system';
  });

  // Calculate resolved theme based on current mode and system preferences
  const getResolvedTheme = useCallback((mode) => {
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState(() => getResolvedTheme(themeMode));

  // Update DOM when resolvedTheme changes
  const applyThemeToDOM = useCallback((theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, []);

  // Update theme mode and persist to storage
  const setThemeMode = useCallback(
    (newMode) => {
      if (newMode !== 'light' && newMode !== 'dark' && newMode !== 'system') return;
      setThemeModeState(newMode);
      try {
        localStorage.setItem(STORAGE_KEY, newMode);
      } catch (e) {}

      const resolved = getResolvedTheme(newMode);
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);
    },
    [getResolvedTheme, applyThemeToDOM]
  );

  // Cycle between light -> dark -> system
  const cycleTheme = useCallback(() => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, [setThemeMode]);

  // Handle system preference changes in real-time
  useEffect(() => {
    const resolved = getResolvedTheme(themeMode);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);

    if (themeMode !== 'system') return;

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const nextResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextResolved);
        applyThemeToDOM(nextResolved);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode, getResolvedTheme, applyThemeToDOM]);

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

