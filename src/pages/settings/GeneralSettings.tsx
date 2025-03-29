import React from 'react';
import { ButtonBuilder } from '@components/atoms/Button/ButtonBuilder';
import { Button } from '@components/atoms/Button/Button';
import { useModuleFeatures } from '@hooks/useModuleFeatures';
import { useTheme } from '@core/theme/ThemeProvider';
import { FeatureFlags } from '@core/types';

export const GeneralSettings: React.FC = () => {
  const { hasFeature, setFeature, features } = useModuleFeatures();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleToggleNeumorph = () => {
    setFeature(FeatureFlags.USE_NEUMORPHISM, !features[FeatureFlags.USE_NEUMORPHISM]);
  };

  const neumorphButton = new ButtonBuilder()
    .withVariant('primary')
    .withSize('md')
    .withNeumorph(true)
    .withChildren('Toggle Neumorphism')
    .withOnClick(handleToggleNeumorph)
    .build();

  const darkModeButton = new ButtonBuilder()
    .withVariant('secondary')
    .withSize('md')
    .withNeumorph(hasFeature(FeatureFlags.USE_NEUMORPHISM))
    .withChildren('Toggle Dark Mode')
    .withOnClick(toggleDarkMode)
    .build();

  const renderFeatureButton = (key: string, enabled: boolean) => {
    const button = new ButtonBuilder()
      .withVariant(enabled ? 'success' : 'danger')
      .withSize('sm')
      .withNeumorph(hasFeature(FeatureFlags.USE_NEUMORPHISM))
      .withChildren(enabled ? 'Enabled' : 'Disabled')
      .withOnClick(() => setFeature(key as FeatureFlags, !enabled))
      .build();

    return <Button {...button} />;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-200">General Settings</h1>
      
      <div className="space-y-6">
        <div className={`p-6 rounded-lg transition-all duration-200 ${
          hasFeature(FeatureFlags.USE_NEUMORPHISM)
            ? 'container-neumorph'
            : 'bg-white dark:bg-gray-800 shadow-md'
        }`}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-200">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Neumorphic Design</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  Enable or disable neumorphic design system
                </p>
              </div>
              <Button {...neumorphButton} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Dark Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  Switch between light and dark theme
                </p>
              </div>
              <Button {...darkModeButton} />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg transition-all duration-200 ${
          hasFeature(FeatureFlags.USE_NEUMORPHISM)
            ? 'container-neumorph'
            : 'bg-white dark:bg-gray-800 shadow-md'
        }`}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-200">Feature Flags</h2>
          
          <div className="space-y-4">
            {Object.entries(features)
              .filter(([key]) => key !== FeatureFlags.USE_NEUMORPHISM && key !== FeatureFlags.ENABLE_DARK_MODE)
              .map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{key.replace(/_/g, ' ').toLowerCase()}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  {renderFeatureButton(key, enabled)}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 