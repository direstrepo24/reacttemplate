/**
 * Sistema de Feature Flags para habilitar/deshabilitar características
 * Implementa un patrón observable para notificar cambios a los componentes
 */

// Enum de los feature flags disponibles en la aplicación
export enum FeatureFlags {
  // Características de UI
  USE_NEUMORPHISM = 'USE_NEUMORPHISM',
  ENABLE_DARK_MODE = 'ENABLE_DARK_MODE',
  
  // Módulos principales
  DASHBOARD = 'DASHBOARD',
  TODO_MODULE = 'TODO_MODULE',
  USERS_MODULE = 'USERS_MODULE',
  SETTINGS_MODULE = 'SETTINGS_MODULE',
  ADMIN_MODULE = 'ADMIN_MODULE',
  REPORTS_MODULE = 'REPORTS_MODULE',
  
  // Submódulos y características específicas
  USER_PROFILES = 'USER_PROFILES',
  USER_ROLES = 'USER_ROLES',
  GENERAL_SETTINGS = 'GENERAL_SETTINGS',
  SECURITY_SETTINGS = 'SECURITY_SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ADVANCED_SECURITY = 'ADVANCED_SECURITY',
  INVESTMENT_ORDER = 'INVESTMENT_ORDER',

}

// Tipo para el callback de observadores
type FeatureFlagObserver = (flag: FeatureFlags, enabled: boolean) => void;

// Estado predeterminado de los feature flags
const defaultFeatureFlags: Record<FeatureFlags, boolean> = {
  // Características de UI habilitadas por defecto
  [FeatureFlags.USE_NEUMORPHISM]: true,
  [FeatureFlags.ENABLE_DARK_MODE]: true,
  
  // Módulos principales habilitados por defecto
  [FeatureFlags.DASHBOARD]: true,
  [FeatureFlags.TODO_MODULE]: true,
  [FeatureFlags.USERS_MODULE]: true,
  [FeatureFlags.SETTINGS_MODULE]: true,
  [FeatureFlags.ADMIN_MODULE]: true,
  [FeatureFlags.REPORTS_MODULE]: false, // Reportes desactivado por defecto
  
  // Submódulos específicos
  [FeatureFlags.USER_PROFILES]: true,
  [FeatureFlags.USER_ROLES]: true,
  [FeatureFlags.GENERAL_SETTINGS]: true,
  [FeatureFlags.SECURITY_SETTINGS]: true,
  [FeatureFlags.NOTIFICATIONS]: true,
  [FeatureFlags.ADVANCED_SECURITY]: false, // Seguridad avanzada desactivada por defecto
  [FeatureFlags.INVESTMENT_ORDER]: true,
};

// Estructura de datos para el panel de administración de feature flags
export const featureFlags = [
  // UI Features
  {
    name: FeatureFlags.USE_NEUMORPHISM,
    description: 'Enable neumorphic design style throughout the application',
    enabled: defaultFeatureFlags[FeatureFlags.USE_NEUMORPHISM],
    group: 'UI'
  },
  {
    name: FeatureFlags.ENABLE_DARK_MODE,
    description: 'Enable dark mode support',
    enabled: defaultFeatureFlags[FeatureFlags.ENABLE_DARK_MODE],
    group: 'UI'
  },
  
  // Core Modules
  {
    name: FeatureFlags.DASHBOARD,
    description: 'Dashboard module with analytics and summary',
    enabled: defaultFeatureFlags[FeatureFlags.DASHBOARD],
    requiresAuth: true,
    group: 'Core',
    subFeatures: []
  },
  {
    name: FeatureFlags.TODO_MODULE,
    description: 'ToDo list management module',
    enabled: defaultFeatureFlags[FeatureFlags.TODO_MODULE],
    requiresAuth: true,
    group: 'Core',
    subFeatures: []
  },
  {
    name: FeatureFlags.USERS_MODULE,
    description: 'User management module',
    enabled: defaultFeatureFlags[FeatureFlags.USERS_MODULE],
    requiresAuth: true,
    permissions: ['admin'],
    group: 'Core',
    subFeatures: [
      {
        name: FeatureFlags.USER_PROFILES,
        description: 'User profile management',
        enabled: defaultFeatureFlags[FeatureFlags.USER_PROFILES],
        requiresAuth: true,
        permissions: ['admin', 'user-manager']
      },
      {
        name: FeatureFlags.USER_ROLES,
        description: 'User role management',
        enabled: defaultFeatureFlags[FeatureFlags.USER_ROLES],
        requiresAuth: true,
        permissions: ['admin']
      }
    ]
  },
  {
    name: FeatureFlags.SETTINGS_MODULE,
    description: 'Application settings',
    enabled: defaultFeatureFlags[FeatureFlags.SETTINGS_MODULE],
    requiresAuth: true,
    permissions: ['admin'],
    group: 'Core',
    subFeatures: [
      {
        name: FeatureFlags.GENERAL_SETTINGS,
        description: 'General application settings',
        enabled: defaultFeatureFlags[FeatureFlags.GENERAL_SETTINGS],
        requiresAuth: true,
        permissions: ['admin']
      },
      {
        name: FeatureFlags.SECURITY_SETTINGS,
        description: 'Security configuration',
        enabled: defaultFeatureFlags[FeatureFlags.SECURITY_SETTINGS],
        requiresAuth: true,
        permissions: ['admin', 'security-admin']
      },
      {
        name: FeatureFlags.ADVANCED_SECURITY,
        description: 'Advanced security features like MFA and IP restrictions',
        enabled: defaultFeatureFlags[FeatureFlags.ADVANCED_SECURITY],
        requiresAuth: true,
        permissions: ['security-admin']
      }
    ]
  },
  {
    name: FeatureFlags.ADMIN_MODULE,
    description: 'Admin panel',
    enabled: defaultFeatureFlags[FeatureFlags.ADMIN_MODULE],
    requiresAuth: true,
    permissions: ['admin'],
    group: 'Core',
    subFeatures: []
  },
  {
    name: FeatureFlags.REPORTS_MODULE,
    description: 'Reporting and analytics',
    enabled: defaultFeatureFlags[FeatureFlags.REPORTS_MODULE],
    requiresAuth: true,
    permissions: ['admin', 'reports-viewer'],
    group: 'Core',
    subFeatures: []
  },
  {
    name: FeatureFlags.NOTIFICATIONS,
    description: 'In-app notifications system',
    enabled: defaultFeatureFlags[FeatureFlags.NOTIFICATIONS],
    group: 'Core'
  },
  {
    name: FeatureFlags.INVESTMENT_ORDER,
    description: 'Módulo para gestionar órdenes de inversión (compra/venta)',
    enabled: defaultFeatureFlags[FeatureFlags.INVESTMENT_ORDER],
    requiresAuth: true,
    permissions: ["admin","finance-manager"],
    group: 'Core',
    subFeatures: []
  }
];

// Clase para gestionar feature flags con patrón observer
class FeatureFlagsManager {
  private flags: Record<FeatureFlags, boolean>;
  private observers: Array<FeatureFlagObserver> = [];
  
  constructor(initialFlags: Record<FeatureFlags, boolean>) {
    // Inicializamos con los valores predeterminados
    this.flags = { ...initialFlags };
    
    // Intentamos cargar configuración desde localStorage si existe
    this.loadFromStorage();
  }
  
  // Verificar si un feature está habilitado
  public isEnabled(flag: FeatureFlags): boolean {
    return this.flags[flag] ?? false;
  }
  
  // Habilitar un feature específico
  public enable(flag: FeatureFlags): void {
    if (!this.flags[flag]) {
      this.flags[flag] = true;
      this.notifyObservers(flag, true);
      this.saveToStorage();
    }
  }
  
  // Deshabilitar un feature específico
  public disable(flag: FeatureFlags): void {
    if (this.flags[flag]) {
      this.flags[flag] = false;
      this.notifyObservers(flag, false);
      this.saveToStorage();
    }
  }
  
  // Cambiar el estado de un feature
  public toggle(flag: FeatureFlags): boolean {
    this.flags[flag] = !this.flags[flag];
    this.notifyObservers(flag, this.flags[flag]);
    this.saveToStorage();
    return this.flags[flag];
  }
  
  // Actualizar múltiples features a la vez
  public updateFeatures(updates: Partial<Record<FeatureFlags, boolean>>): void {
    Object.entries(updates).forEach(([flag, enabled]) => {
      const featureFlag = flag as FeatureFlags;
      if (this.flags[featureFlag] !== enabled) {
        this.flags[featureFlag] = enabled!;
        this.notifyObservers(featureFlag, enabled!);
      }
    });
    this.saveToStorage();
  }
  
  // Restablecer a valores predeterminados
  public resetToDefaults(): void {
    Object.entries(defaultFeatureFlags).forEach(([flag, enabled]) => {
      const featureFlag = flag as FeatureFlags;
      if (this.flags[featureFlag] !== enabled) {
        this.flags[featureFlag] = enabled;
        this.notifyObservers(featureFlag, enabled);
      }
    });
    this.saveToStorage();
  }
  
  // Obtener todos los feature flags actuales
  public getAllFeatures(): Record<FeatureFlags, boolean> {
    return { ...this.flags };
  }
  
  // Suscribirse a cambios en feature flags
  public subscribe(observer: FeatureFlagObserver): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }
  
  // Notificar a los observadores sobre un cambio
  private notifyObservers(flag: FeatureFlags, enabled: boolean): void {
    this.observers.forEach(observer => observer(flag, enabled));
  }
  
  // Guardar configuración en localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('featureFlags', JSON.stringify(this.flags));
    } catch (error) {
      console.error('Error al guardar feature flags en localStorage:', error);
    }
  }
  
  // Cargar configuración desde localStorage
  private loadFromStorage(): void {
    try {
      const storedFlags = localStorage.getItem('featureFlags');
      if (storedFlags) {
        const parsedFlags = JSON.parse(storedFlags);
        // Solo aplicar flags válidos que existan en la enumeración
        Object.keys(parsedFlags).forEach(flag => {
          if (Object.values(FeatureFlags).includes(flag as FeatureFlags)) {
            this.flags[flag as FeatureFlags] = parsedFlags[flag];
          }
        });
      }
    } catch (error) {
      console.error('Error al cargar feature flags desde localStorage:', error);
    }
  }
}

// Instancia singleton del gestor de feature flags
export const featureFlagsManager = new FeatureFlagsManager(defaultFeatureFlags);

// Funciones de conveniencia para facilitar el uso
export const isFeatureEnabled = (flag: FeatureFlags): boolean => {
  return featureFlagsManager.isEnabled(flag);
};

export const enableFeature = (flag: FeatureFlags): void => {
  featureFlagsManager.enable(flag);
};

export const disableFeature = (flag: FeatureFlags): void => {
  featureFlagsManager.disable(flag);
};

export const toggleFeature = (flag: FeatureFlags): boolean => {
  return featureFlagsManager.toggle(flag);
};

export const updateFeatures = (updates: Partial<Record<FeatureFlags, boolean>>): void => {
  featureFlagsManager.updateFeatures(updates);
};

export const resetFeatures = (): void => {
  featureFlagsManager.resetToDefaults();
};

export const getAllFeatures = (): Record<FeatureFlags, boolean> => {
  return featureFlagsManager.getAllFeatures();
};

export const subscribeToFeatureFlags = (
  callback: FeatureFlagObserver
): () => void => {
  return featureFlagsManager.subscribe(callback);
};