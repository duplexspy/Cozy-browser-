/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserTheme } from '../types';

interface ThemeContextType {
  theme: BrowserTheme;
  setTheme: (theme: BrowserTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrowserTheme>(BrowserTheme.FOCUS);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Apply theme-specific CSS variables
    if (theme === BrowserTheme.GAMING) {
      root.style.setProperty('--accent', '#a855f7'); // Purple
      root.style.setProperty('--bg-main', '#0f172a'); // Slate 900
      root.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.7)');
      root.style.setProperty('--text-main', '#f8fafc');
    } else if (theme === BrowserTheme.FOCUS) {
      root.style.setProperty('--accent', '#78716c'); // Stone 500
      root.style.setProperty('--bg-main', '#f5f5f4'); // Stone 100
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.5)');
      root.style.setProperty('--text-main', '#1c1917');
    } else if (theme === BrowserTheme.KIDS) {
      root.style.setProperty('--accent', '#f43f5e'); // Rose 500
      root.style.setProperty('--bg-main', '#fdf4ff'); // Fuchsia 50
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--text-main', '#701a75');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
