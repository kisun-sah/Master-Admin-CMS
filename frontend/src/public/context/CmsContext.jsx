import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, getNavigation, resolveMediaUrl } from '../lib/api';

const CmsContext = createContext();

export function CmsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCmsData = async () => {
    try {
      setLoading(true);
      const [settingsData, navData] = await Promise.allSettled([
        getSettings(),
        getNavigation(),
      ]);

      if (settingsData.status === 'fulfilled') {
        const s = settingsData.value;
        setSettings(s);
        applyBranding(s);
      } else {
        console.warn('Could not load public settings, using defaults', settingsData.reason);
        // Fallback default brand identity
        const fallback = {
          siteName: 'NEXUS DEVS',
          siteTagline: 'Personal IT, AI, Web Development & Digital Marketing Studio',
          primaryColor: '#4F46E5',
          secondaryColor: '#06B6D4',
          fontFamily: 'Inter',
          contactEmail: 'contact@nexusdevs.io',
          contactPhone: '+1 (555) 019-2834',
          address: 'Silicon Valley, California & Remote Worldwide',
          socialLinks: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
          },
        };
        setSettings(fallback);
        applyBranding(fallback);
      }

      if (navData.status === 'fulfilled') {
        setNavigation(Array.isArray(navData.value) ? navData.value : []);
      }
    } catch (err) {
      console.error('Error fetching CMS context data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const applyBranding = (data) => {
    if (!data) return;
    const root = document.documentElement;

    // 1. Dynamic Brand Colors
    if (data.primaryColor) {
      root.style.setProperty('--brand-primary', data.primaryColor);
    }
    if (data.secondaryColor) {
      root.style.setProperty('--brand-secondary', data.secondaryColor);
    }

    // 2. Dynamic Google Font
    if (data.fontFamily) {
      root.style.setProperty('--brand-font', `'${data.fontFamily}', system-ui, sans-serif`);
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
      document.title = `${data.siteName} — ${data.siteTagline || 'IT, AI & Web Development Studio'}`;
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  return (
    <CmsContext.Provider
      value={{
        settings,
        navigation,
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
