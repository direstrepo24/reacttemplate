import { useCallback } from 'react';
import { useTheme } from '@/core/theme/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { FeatureFlags } from '@/core/types';
import { isFeatureEnabled } from '@/core/config/featureFlags';

/**
 * Componente para alternar entre modo claro y oscuro
 */
export const DarkModeToggle = () => {
  // Verificar si el dark mode está habilitado como feature flag
  const darkModeEnabled = isFeatureEnabled(FeatureFlags.ENABLE_DARK_MODE);
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const handleToggle = useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);
  
  if (!darkModeEnabled) {
    return null;
  }
  
  return (
    <button
      type="button"
      onClick={handleToggle}
      className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      aria-pressed={isDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">
        {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      </span>
      {isDarkMode ? (
        <SunIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
};
