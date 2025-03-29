import { useCallback, useEffect, useState } from 'react';
import { FeatureFlags } from '@/core/types';

// ModuleFeatures ahora es un objeto que permite cualquier clave
export interface ModuleFeatures {
  [key: string]: boolean;
  neumorphism: boolean;  // Propiedad específica para mantener compatibilidad
}

// Configuración inicial de feature flags
const defaultFeatures: ModuleFeatures = {
  [FeatureFlags.ENABLE_DARK_MODE]: true,
  [FeatureFlags.NEUMORPHISM]: true,
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
  neumorphism: true,  // Propiedad específica para mantener compatibilidad
};

const STORAGE_KEY = 'feature_flags';

export const useModuleFeatures = () => {
  const [features, setFeatures] = useState<ModuleFeatures>(() => {
    // Obtener feature flags almacenados o usar los predeterminados
    const storedFeatures = localStorage.getItem(STORAGE_KEY);
    
    if (storedFeatures) {
      try {
        const parsedFeatures = JSON.parse(storedFeatures);
        
        // Verificar si hay nuevos feature flags que no estén en localStorage
        const updatedFeatures = { ...defaultFeatures };
        let hasNewFlags = false;
        
        // Mantener los valores existentes
        Object.keys(parsedFeatures).forEach(key => {
          if (key in defaultFeatures) {
            updatedFeatures[key] = parsedFeatures[key];
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
        
        // Asegurar que neumorphism esté sincronizado con NEUMORPHISM
        updatedFeatures.neumorphism = updatedFeatures[FeatureFlags.NEUMORPHISM];
        
        return updatedFeatures;
      } catch (e) {
        console.error('Error parsing stored features', e);
        return defaultFeatures;
      }
    }
    
    return defaultFeatures;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
  }, [features]);

  const hasFeature = useCallback((feature: string): boolean => {
    return features[feature] ?? false;
  }, [features]);

  const setFeature = useCallback((feature: string, enabled: boolean) => {
    setFeatures(prev => {
      const updated = {
        ...prev,
        [feature]: enabled,
      };
      
      // Mantener sincronizado neumorphism con NEUMORPHISM
      if (feature === FeatureFlags.NEUMORPHISM) {
        updated.neumorphism = enabled;
      } else if (feature === 'neumorphism') {
        updated[FeatureFlags.NEUMORPHISM] = enabled;
      }
      
      return updated;
    });
  }, []);

  return {
    hasFeature,
    setFeature,
    features,
  };
};
