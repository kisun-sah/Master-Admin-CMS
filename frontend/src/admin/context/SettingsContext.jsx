import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

const SettingsContext = createContext(null);

// Default branding tokens
const DEFAULT_BRANDING = {
  siteName: 'Master CMS',
  siteTagline: 'Universal Control Plane',
  logo: '',
  darkLogo: '',
  favicon: '',
  primaryColor: '#4F46E5',
  secondaryColor: '#06B6D4',
  fontFamily: 'Inter',
};

/**
 * Convert Hex Color to RGB components
 */
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  if (c.length !== 6) return null;
  const num = parseInt(c, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Adjust hex color brightness (negative for darker, positive for lighter)
 */
function adjustColorBrightness(hex, percent) {
  if (!hex || typeof hex !== 'string') return hex;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  if (c.length !== 6) return hex;
  const num = parseInt(c, 16);
  if (isNaN(num)) return hex;

  const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + Math.round(255 * (percent / 100))));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + Math.round(255 * (percent / 100))));
  const b = Math.min(255, Math.max(0, (num & 255) + Math.round(255 * (percent / 100))));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Ensure requested Google Font stylesheet is injected into head
 */
function ensureGoogleFont(fontName) {
  if (!fontName) return;
  const standardFonts = ['Arial', 'Helvetica', 'sans-serif', 'serif', 'monospace', 'system-ui', 'Segoe UI'];
  if (standardFonts.includes(fontName)) return;

  const fontId = `dynamic-google-font-${fontName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      fontName
    )}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }
}

/**
 * Update browser tab favicon icon dynamically
 */
function updateFavicon(faviconUrl) {
  const targetUrl = faviconUrl ? faviconUrl : '/favicon.ico';
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = targetUrl;
}

/**
 * Core engine to apply brand colors, fonts, favicon, and title to document
 */
export function applyThemeToDom(theme) {
  if (!theme) return;
  const root = document.documentElement;

  // 1. Primary brand color tokens
  const primary = theme.primaryColor || DEFAULT_BRANDING.primaryColor;
  if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(primary)) {
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--border-focus', primary);

    // Compute hover/active darker tone
    const primaryDark = adjustColorBrightness(primary, -15);
    root.style.setProperty('--primary-dark', primaryDark);

    // Compute light background tint for active sidebar items & badges
    const rgb = hexToRgb(primary);
    if (rgb) {
      root.style.setProperty('--primary-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
    }
  }

  // 2. Secondary/Accent color
  const accent = theme.secondaryColor || DEFAULT_BRANDING.secondaryColor;
  if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(accent)) {
    root.style.setProperty('--accent', accent);
  }

  // 3. Typography font family
  const font = theme.fontFamily || DEFAULT_BRANDING.fontFamily;
  if (font) {
    ensureGoogleFont(font);
    const fontStack = `'${font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    root.style.setProperty('--font-family', fontStack);
    document.body.style.fontFamily = fontStack;
  }

  // 4. Favicon
  updateFavicon(theme.favicon);

  // 5. Document title
  if (theme.siteName) {
    const currentTitle = document.title;
    if (!currentTitle || currentTitle.includes('Master Admin CMS') || currentTitle.includes('Admin Panel')) {
      document.title = `${theme.siteName} — Admin Panel`;
    }
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      // Try authenticated endpoint first, fallback to public settings
      let res;
      try {
        res = await api.get('/settings');
      } catch (err) {
        res = await api.get('/public/settings');
      }

      if (res && res.success && res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
          primaryColor: res.data.primaryColor || DEFAULT_BRANDING.primaryColor,
          secondaryColor: res.data.secondaryColor || DEFAULT_BRANDING.secondaryColor,
          fontFamily: res.data.fontFamily || DEFAULT_BRANDING.fontFamily,
        }));
        applyThemeToDom(res.data);
      }
    } catch (error) {
      console.warn('Failed to load site branding settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /**
   * Save settings to server and apply changes permanently
   */
  const saveSettings = async (newSettings) => {
    const res = await api.put('/settings', newSettings);
    if (res.success && res.data) {
      setSettings((prev) => ({
        ...prev,
        ...res.data,
      }));
      applyThemeToDom(res.data);
      return res.data;
    }
    throw new Error(res.error?.message || 'Failed to update settings');
  };

  /**
   * Live preview branding changes in real time
   */
  const previewTheme = (partialTheme) => {
    applyThemeToDom({
      ...settings,
      ...partialTheme,
    });
  };

  /**
   * Reset theme to currently persisted settings
   */
  const resetTheme = () => {
    applyThemeToDom(settings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        loading,
        fetchSettings,
        saveSettings,
        previewTheme,
        resetTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

