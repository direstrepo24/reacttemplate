import { useCallback, useEffect, useState } from 'react';
import { FeatureFlags } from '@/core/config/featureFlags';

type ModuleFeatures = Record<FeatureFlags, boolean>;

// Configuración inicial de feature flags
const defaultFeatures: ModuleFeatures = {
  [FeatureFlags.USE_NEUMORPHISM]: true,
  [FeatureFlags.ENABLE_DARK_MODE]: true,
  [FeatureFlags.NOTIFICATIONS]: true,
  [FeatureFlags.ADVANCED_SECURITY]: false,
  [FeatureFlags.USER_PROFILES]: true,
  [FeatureFlags.USER_ROLES]: true,
  [FeatureFlags.GENERAL_SETTINGS]: true,
  [FeatureFlags.SECURITY_SETTINGS]: true,
  [FeatureFlags.DASHBOARD]: true,
  [FeatureFlags.TODO_MODULE]: true,
  [FeatureFlags.USERS_MODULE]: true,
  [FeatureFlags.SETTINGS_MODULE]: true,
  [FeatureFlags.ADMIN_MODULE]: true,
  [FeatureFlags.REPORTS_MODULE]: false,
  [FeatureFlags.INVESTMENT_ORDER]: true,
};

const STORAGE_KEY = 'feature_flags';

export const useModuleFeatures = () => {
  const [features, setFeatures] = useState<ModuleFeatures>(() => {
    // Obtener feature flags almacenados o usar los predeterminados
    const storedFeatures = localStorage.getItem(STORAGE_KEY);
    
    if (storedFeatures) {
      const parsedFeatures = JSON.parse(storedFeatures);
      
      // Verificar si hay nuevos feature flags que no estén en localStorage
      const updatedFeatures = { ...defaultFeatures };
      let hasNewFlags = false;
      
      // Mantener los valores existentes
      Object.keys(parsedFeatures).forEach(key => {
        if (key in defaultFeatures) {
          updatedFeatures[key as FeatureFlags] = parsedFeatures[key];
        }
      });
      
      // Verificar si hay flags nuevos que no estaban en localStorage
      Object.keys(defaultFeatures).forEach(key => {
        if (!(key in parsedFeatures)) {
          hasNewFlags = true;
        }
      });
      
      // Si hay nuevos flags, guardar la versión actualizada
      if (hasNewFlags) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFeatures));
      }
      
      return updatedFeatures;
    }
    
    return defaultFeatures;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
  }, [features]);

  const hasFeature = useCallback((feature: FeatureFlags): boolean => {
    return features[feature] ?? false;
  }, [features]);

  const setFeature = useCallback((feature: FeatureFlags, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: enabled,
    }));
  }, []);

  return {
    hasFeature,
    setFeature,
    features,
  };
}; 