import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-color', '#f8fafc');
      document.documentElement.style.setProperty('--bg-card', '#ffffff');
      document.documentElement.style.setProperty('--bg-panel', 'rgba(241, 245, 249, 0.85)');
      document.documentElement.style.setProperty('--text-main', '#0f172a');
      document.documentElement.style.setProperty('--text-muted', '#475569');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.85)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(15, 23, 42, 0.1)');
    } else {
      document.documentElement.style.setProperty('--bg-color', '#050814');
      document.documentElement.style.setProperty('--bg-card', '#0b1126');
      document.documentElement.style.setProperty('--bg-panel', 'rgba(11, 17, 38, 0.6)');
      document.documentElement.style.setProperty('--text-main', '#f8fafc');
      document.documentElement.style.setProperty('--text-muted', '#94a3b8');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(11, 17, 38, 0.45)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.05)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

