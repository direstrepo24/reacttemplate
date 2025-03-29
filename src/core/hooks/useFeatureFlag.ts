import { useCallback, useEffect, useState } from 'react';
import { 
  FeatureFlags, 
  isFeatureEnabled, 
  subscribeToFeatureFlags 
} from '../config/featureFlags';

/**
 * Hook personalizado para usar feature flags en componentes de forma reactiva
 * Se actualizará automáticamente cuando cambie el estado del feature flag
 * 
 * @param flag - El feature flag a verificar
 * @returns - Un boolean que indica si el feature está habilitado
 * 
 * @example
 * // Uso básico
 * const isFeatureEnabled = useFeatureFlag(FeatureFlags.USE_NEUMORPHISM);
 * 
 * // En un componente condicional
 * if (isFeatureEnabled) {
 *   return <NeumorphicComponent />;
 * } else {
 *   return <StandardComponent />;
 * }
 */
export function useFeatureFlag(flag: FeatureFlags): boolean {
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(flag));

  useEffect(() => {
    // Suscribirse a cambios en el feature flag específico
    const unsubscribe = subscribeToFeatureFlags((changedFlag, newValue) => {
      if (changedFlag === flag) {
        setEnabled(newValue);
      }
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [flag]);

  return enabled;
}

/**
 * Hook para verificar múltiples feature flags a la vez
 * 
 * @param flags - Array de feature flags a verificar
 * @returns - Objeto con los estados de todos los feature flags
 * 
 * @example
 * // Verificar múltiples flags
 * const { useNeumorphism, enableDarkMode } = useFeatureFlags([
 *   FeatureFlags.USE_NEUMORPHISM,
 *   FeatureFlags.ENABLE_DARK_MODE
 * ]);
 */
export function useFeatureFlags(flags: FeatureFlags[]): Record<FeatureFlags, boolean> {
  const [enabledFlags, setEnabledFlags] = useState<Record<FeatureFlags, boolean>>(() => {
    return flags.reduce((acc, flag) => {
      acc[flag] = isFeatureEnabled(flag);
      return acc;
    }, {} as Record<FeatureFlags, boolean>);
  });

  useEffect(() => {
    // Suscribirse a cambios en múltiples feature flags
    const unsubscribe = subscribeToFeatureFlags((changedFlag, newValue) => {
      if (flags.includes(changedFlag)) {
        setEnabledFlags(prev => ({
          ...prev,
          [changedFlag]: newValue
        }));
      }
    });

    return () => unsubscribe();
  }, [flags]);

  return enabledFlags;
}

export function useModuleFeatures(moduleFlag: FeatureFlags): {
  isEnabled: boolean;
  features: Record<FeatureFlags, boolean>;
  subFeatures: FeatureFlags[];
} {
  const [moduleState, setModuleState] = useState(() => {
    const moduleEnabled = isFeatureEnabled(moduleFlag);
    const subFeatures = Object.values(FeatureFlags).filter(flag => 
      flag.startsWith(moduleFlag.toString().split('_')[0]) && flag !== moduleFlag
    );
    const features = subFeatures.reduce((acc, flag) => {
      acc[flag] = isFeatureEnabled(flag as FeatureFlags);
      return acc;
    }, {} as Record<FeatureFlags, boolean>);

    return {
      isEnabled: moduleEnabled,
      features,
      subFeatures
    };
  });

  useEffect(() => {
    const unsubscribe = subscribeToFeatureFlags((changedFlag, newValue) => {
      if (changedFlag === moduleFlag) {
        setModuleState(prev => ({
          ...prev,
          isEnabled: newValue
        }));
      } else if (moduleState.subFeatures.includes(changedFlag)) {
        setModuleState(prev => ({
          ...prev,
          features: {
            ...prev.features,
            [changedFlag]: newValue
          }
        }));
      }
    });

    return () => unsubscribe();
  }, [moduleFlag, moduleState.subFeatures]);

  return moduleState;
} 