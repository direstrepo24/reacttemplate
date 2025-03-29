// Feature flags for the application
export enum FeatureFlags {
  USE_NEUMORPHISM = 'USE_NEUMORPHISM',
  ENABLE_DARK_MODE = 'ENABLE_DARK_MODE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ADVANCED_SECURITY = 'ADVANCED_SECURITY',
  USER_PROFILES = 'USER_PROFILES',
  USER_ROLES = 'USER_ROLES',
  GENERAL_SETTINGS = 'GENERAL_SETTINGS',
  SECURITY_SETTINGS = 'SECURITY_SETTINGS',
  REPORTS = 'REPORTS',
}

// Default state of feature flags
const defaultFeatureFlags: Record<FeatureFlags, boolean> = {
  [FeatureFlags.USE_NEUMORPHISM]: true,
  [FeatureFlags.ENABLE_DARK_MODE]: true,
  [FeatureFlags.NOTIFICATIONS]: true,
  [FeatureFlags.ADVANCED_SECURITY]: false,
  [FeatureFlags.USER_PROFILES]: true,
  [FeatureFlags.USER_ROLES]: true,
  [FeatureFlags.GENERAL_SETTINGS]: true,
  [FeatureFlags.SECURITY_SETTINGS]: true,
  [FeatureFlags.REPORTS]: false,
};

// Current state of feature flags (initialized with defaults)
let currentFeatureFlags = { ...defaultFeatureFlags };

/**
 * Check if a feature is enabled
 * @param flag The feature flag to check
 * @returns True if the feature is enabled, false otherwise
 */
export function isFeatureEnabled(flag: FeatureFlags): boolean {
  return currentFeatureFlags[flag] ?? false;
}

/**
 * Enable a feature flag
 * @param flag The feature flag to enable
 */
export function enableFeature(flag: FeatureFlags): void {
  currentFeatureFlags[flag] = true;
}

/**
 * Disable a feature flag
 * @param flag The feature flag to disable
 */
export function disableFeature(flag: FeatureFlags): void {
  currentFeatureFlags[flag] = false;
}

/**
 * Toggle a feature flag
 * @param flag The feature flag to toggle
 * @returns The new state of the feature flag
 */
export function toggleFeature(flag: FeatureFlags): boolean {
  currentFeatureFlags[flag] = !currentFeatureFlags[flag];
  return currentFeatureFlags[flag];
}

/**
 * Reset feature flags to their default state
 */
export function resetFeatureFlags(): void {
  currentFeatureFlags = { ...defaultFeatureFlags };
}

/**
 * Get all feature flags and their current state
 * @returns Record of all feature flags and their current state
 */
export function getAllFeatureFlags(): Record<FeatureFlags, boolean> {
  return { ...currentFeatureFlags };
}

/**
 * Update multiple feature flags at once
 * @param flags Record of feature flags to update and their new state
 */
export function updateFeatureFlags(flags: Partial<Record<FeatureFlags, boolean>>): void {
  currentFeatureFlags = { ...currentFeatureFlags, ...flags };
} 