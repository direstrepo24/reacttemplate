import React, { createContext, useContext, useEffect } from 'react';
import { useModuleFeatures } from '@hooks/useModuleFeatures';
import { FeatureFlags } from '@core/types';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { hasFeature, setFeature, features } = useModuleFeatures();
  const isDarkMode = features[FeatureFlags.ENABLE_DARK_MODE] ?? false;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Sincronizar el estado inicial con localStorage
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setFeature(FeatureFlags.ENABLE_DARK_MODE, isDark);
  }, [setFeature]);

  const toggleDarkMode = () => {
    setFeature(FeatureFlags.ENABLE_DARK_MODE, !isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 