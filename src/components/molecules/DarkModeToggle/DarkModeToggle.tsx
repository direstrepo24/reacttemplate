import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/cn';

interface DarkModeToggleProps {
  className?: string;
}

export const DarkModeToggle = ({ className }: DarkModeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const darkModeEnabled = isFeatureEnabled(FeatureFlags.USE_DARK_MODE);
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state based on saved preference or system preference
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else if (prefersDark) {
      setIsDarkMode(true);
    }
  }, []);

  // Update the document when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // If feature is disabled, don't render the toggle
  if (!darkModeEnabled) {
    return null;
  }

  return (
    <button
      data-testid="dark-mode-toggle"
      onClick={toggleDarkMode}
      className={cn(
        'p-2 rounded-full transition-colors',
        isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-blue-100 text-blue-800',
        useNeumorphism && 'shadow-neumorph',
        className
      )}
    >
      {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}; 