import React from 'react';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { Button } from '@/components/atoms/Button';
import { ButtonBuilder } from '@/components/atoms/Button/ButtonBuilder';
import { useTheme } from '@/core/theme/ThemeProvider';
import { FiMoon, FiSun } from 'react-icons/fi';
import { FeatureFlags } from '@/core/types';

export const GeneralSettings: React.FC = () => {
  const { features, setFeature } = useModuleFeatures();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleNeumorphism = () => {
    setFeature(FeatureFlags.NEUMORPHISM, !features.neumorphism);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">General Settings</h1>

      <div className={`p-6 mb-6 ${features.neumorphism ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'} rounded-lg`}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Theme Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
            </div>
            <Button {...new ButtonBuilder()
              .setVariant('ghost')
              .setNeumorph(features.neumorphism)
              .setLeftIcon(isDarkMode ? <FiSun /> : <FiMoon />)
              .setChildren(isDarkMode ? 'Light Mode' : 'Dark Mode')
              .setOnClick(toggleDarkMode)
              .build()}
            />
          </div>
        </div>
      </div>

      <div className={`p-6 ${features.neumorphism ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'} rounded-lg`}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Feature Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Neumorphic Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable or disable neumorphic design system</p>
            </div>
            <Button {...new ButtonBuilder()
              .setVariant('ghost')
              .setNeumorph(features.neumorphism)
              .setChildren(features.neumorphism ? 'Disable Neumorphism' : 'Enable Neumorphism')
              .setOnClick(toggleNeumorphism)
              .build()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 