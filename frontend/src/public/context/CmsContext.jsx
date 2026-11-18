import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, getNavigation, getPublicPages, resolveMediaUrl } from '../lib/api';
import { DEFAULT_CMS_FALLBACKS } from '../config/defaultCmsFallbacks';

const CmsContext = createContext();

export function CmsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_CMS_FALLBACKS.settings);
  const [navigation, setNavigation] = useState(DEFAULT_CMS_FALLBACKS.navigation);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCmsData = async () => {
    try {
      setLoading(true);
      const [settingsData, navData, pagesData] = await Promise.allSettled([
        getSettings(),
        getNavigation(),
        getPublicPages(),
      ]);

      if (settingsData.status === 'fulfilled' && settingsData.value) {
        const mergedSettings = {
          ...DEFAULT_CMS_FALLBACKS.settings,
          ...settingsData.value,
          socialLinks: {
            ...DEFAULT_CMS_FALLBACKS.settings.socialLinks,
            ...(settingsData.value.socialLinks || {}),
          },
        };
        setSettings(mergedSettings);
        applyBranding(mergedSettings);
      } else {
        applyBranding(DEFAULT_CMS_FALLBACKS.settings);
      }

      if (navData.status === 'fulfilled' && Array.isArray(navData.value) && navData.value.length > 0) {
        setNavigation(navData.value);
      } else {
        setNavigation(DEFAULT_CMS_FALLBACKS.navigation);
      }

      if (pagesData.status === 'fulfilled' && Array.isArray(pagesData.value)) {
        setPages(pagesData.value);
      } else {
        setPages([]);
      }
    } catch (err) {
      console.error('Error fetching CMS context data:', err);
      setError(err);
      applyBranding(DEFAULT_CMS_FALLBACKS.settings);
    } finally {
      setLoading(false);
    }
  };

  const applyBranding = (data) => {
    if (!data) return;
    const root = document.documentElement;
    const body = typeof document !== 'undefined' ? document.body : null;

    const normalizeHex = (c, fallback) => {
      if (!c || typeof c !== 'string') return fallback;
      const clean = c.trim();
      if (clean.startsWith('#')) return clean;
      if (/^[0-9A-Fa-f]{3,8}$/.test(clean)) return `#${clean}`;
      return clean;
    };

    // 1. Dynamic Brand Colors from CMS
    const primary = normalizeHex(data.primaryColor, '#3B66D4');
    const secondary = normalizeHex(data.secondaryColor, '#06B6D4');

    const targets = [root, body].filter(Boolean);
    targets.forEach((target) => {
      target.style.setProperty('--brand-primary', primary);
      target.style.setProperty('--primary', primary);
      target.style.setProperty('--border-focus', primary);
      target.style.setProperty('--brand-secondary', secondary);
      target.style.setProperty('--accent', secondary);
      target.style.setProperty('--secondary', secondary);
    });

    // 2. Dynamic Google Font
    if (data.fontFamily) {
      root.style.setProperty('--brand-font', `'${data.fontFamily}', system-ui, sans-serif`);
      root.style.setProperty('--font-sans', `'${data.fontFamily}', system-ui, sans-serif`);
      if (body) body.style.fontFamily = `'${data.fontFamily}', system-ui, sans-serif`;
      const fontLink = document.getElementById('dynamic-google-font');
      if (fontLink) {
        const encoded = encodeURIComponent(data.fontFamily);
        fontLink.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700;800;900&display=swap`;
      }
    }

    // 3. Dynamic Favicon
    if (data.favicon) {
      const fav = document.getElementById('dynamic-favicon');
      if (fav) {
        fav.href = resolveMediaUrl(data.favicon);
      }
    }

    // 4. Site Document Title
    if (data.siteName) {
      document.title = `${data.siteName} — ${data.siteTagline || 'IT, AI & Web Dev Studio'}`;
    }
  };

  useEffect(() => {
    fetchCmsData();

    // Synchronize branding updates triggered in real-time from Admin CMS
    const handleBrandingSync = (e) => {
      if (e.detail) {
        setSettings((prev) => ({
          ...prev,
          ...e.detail,
        }));
        applyBranding(e.detail);
      }
    };
    window.addEventListener('cms:branding-updated', handleBrandingSync);
    return () => window.removeEventListener('cms:branding-updated', handleBrandingSync);
  }, []);

  return (
    <CmsContext.Provider
      value={{
        settings,
        navigation,
        pages,
        loading,
        error,
        refreshSettings: fetchCmsData,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}
