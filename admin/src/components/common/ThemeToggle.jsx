import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export function ThemeToggle({ variant = 'segmented', showLabels = false }) {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Segmented 3-button pill style
  if (variant === 'segmented') {
    return (
      <div
        className="theme-toggle-segmented"
        role="radiogroup"
        aria-label="Color theme switcher"
      >
        <button
          type="button"
          className={`theme-segment-btn ${themeMode === 'light' ? 'active' : ''}`}
          onClick={() => setThemeMode('light')}
          title="Light Mode"
          aria-checked={themeMode === 'light'}
          role="radio"
        >
          <Sun size={14} />
          {showLabels && <span>Light</span>}
        </button>

        <button
          type="button"
          className={`theme-segment-btn ${themeMode === 'dark' ? 'active' : ''}`}
          onClick={() => setThemeMode('dark')}
          title="Dark Mode"
          aria-checked={themeMode === 'dark'}
          role="radio"
        >
          <Moon size={14} />
          {showLabels && <span>Dark</span>}
        </button>

        <button
          type="button"
          className={`theme-segment-btn ${themeMode === 'system' ? 'active' : ''}`}
          onClick={() => setThemeMode('system')}
          title="System Preference"
          aria-checked={themeMode === 'system'}
          role="radio"
        >
          <Monitor size={14} />
          {showLabels && <span>System</span>}
        </button>
      </div>
    );
  }

  // Dropdown style
  const CurrentIcon =
    themeMode === 'light' ? Sun : themeMode === 'dark' ? Moon : Monitor;

  return (
    <div className="theme-toggle-dropdown-wrap" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn-icon theme-toggle-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title={`Theme: ${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} (Click to switch)`}
        aria-label="Select color theme"
        aria-expanded={isOpen}
      >
        <CurrentIcon size={18} />
      </button>

      {isOpen && (
        <div className="theme-dropdown-menu">
          <div className="theme-dropdown-header">Appearance</div>

          <button
            type="button"
            className={`theme-dropdown-item ${themeMode === 'light' ? 'active' : ''}`}
            onClick={() => {
              setThemeMode('light');
              setIsOpen(false);
            }}
          >
            <Sun size={15} />
            <span style={{ flex: 1, textAlign: 'left' }}>Light Mode</span>
            {themeMode === 'light' && <Check size={14} className="theme-check-icon" />}
          </button>

          <button
            type="button"
            className={`theme-dropdown-item ${themeMode === 'dark' ? 'active' : ''}`}
            onClick={() => {
              setThemeMode('dark');
              setIsOpen(false);
            }}
          >
            <Moon size={15} />
            <span style={{ flex: 1, textAlign: 'left' }}>Dark Mode</span>
            {themeMode === 'dark' && <Check size={14} className="theme-check-icon" />}
          </button>

          <button
            type="button"
            className={`theme-dropdown-item ${themeMode === 'system' ? 'active' : ''}`}
            onClick={() => {
              setThemeMode('system');
              setIsOpen(false);
            }}
          >
            <Monitor size={15} />
            <span style={{ flex: 1, textAlign: 'left' }}>System Default</span>
            {themeMode === 'system' && <Check size={14} className="theme-check-icon" />}
          </button>
        </div>
      )}
    </div>
  );
}

