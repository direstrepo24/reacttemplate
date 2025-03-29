import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isFeatureEnabled, getFeatureFlag, findFeatureFlag, checkAuthorization, FeatureFlags, featureFlags } from './featureFlags';

// Mock specific functions instead of the entire module
vi.mock('./featureFlags', () => {
  // Use the actual implementation for most functions
  const actual = vi.importActual('./featureFlags');
  
  return {
    __esModule: true,
    ...actual,
    // Only override getFeatureFlag for testing
    getFeatureFlag: vi.fn((name: string) => {
      const mockFeatureState: Record<string, boolean> = {
        [FeatureFlags.USE_NEUMORPHISM]: true,
        [FeatureFlags.USE_DARK_MODE]: false,
        [FeatureFlags.USER_MANAGEMENT]: true,
        [FeatureFlags.USER_PROFILES]: true,
        [FeatureFlags.USER_ROLES]: false,
        [FeatureFlags.SETTINGS]: true,
      };
      return !!mockFeatureState[name];
    }),
  };
});

describe('Feature Flags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isFeatureEnabled', () => {
    it('returns true for enabled features', () => {
      expect(isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM)).toBe(true);
      expect(isFeatureEnabled(FeatureFlags.USER_MANAGEMENT)).toBe(true);
      expect(isFeatureEnabled(FeatureFlags.SETTINGS)).toBe(true);
    });

    it('returns false for disabled features', () => {
      expect(isFeatureEnabled(FeatureFlags.USE_DARK_MODE)).toBe(false);
      expect(isFeatureEnabled(FeatureFlags.USER_ROLES)).toBe(false);
    });
  });

  describe('findFeatureFlag', () => {
    it('finds root level feature flags', () => {
      const useNeumorphismFlag = findFeatureFlag('USE_NEUMORPHISM', featureFlags);
      expect(useNeumorphismFlag).toBeDefined();
      expect(useNeumorphismFlag?.name).toBe('USE_NEUMORPHISM');
    });

    it('finds nested feature flags', () => {
      const generalSettingsFlag = findFeatureFlag('GENERAL_SETTINGS', featureFlags);
      expect(generalSettingsFlag).toBeDefined();
      expect(generalSettingsFlag?.name).toBe('GENERAL_SETTINGS');
    });

    it('returns null for non-existent feature flags', () => {
      const nonExistentFlag = findFeatureFlag('NON_EXISTENT_FLAG', featureFlags);
      expect(nonExistentFlag).toBeNull();
    });
  });

  describe('checkAuthorization', () => {
    it('returns true when user has all required permissions', () => {
      // These are mocked permissions in the mockToken
      const result = checkAuthorization(['view_dashboard', 'view_analytics']);
      expect(result).toBe(true);
    });

    it('returns false when user is missing a required permission', () => {
      // 'admin' is not in the mocked permissions
      const result = checkAuthorization(['view_dashboard', 'admin']);
      expect(result).toBe(false);
    });
  });

  describe('Feature flag integration', () => {
    it('correctly validates feature flags with permissions', () => {
      const mockUserFeature = getFeatureFlag(FeatureFlags.USER_MANAGEMENT);
      expect(mockUserFeature).toBe(true);
      
      // This will use the original function but with mocked checkAuthorization
      expect(isFeatureEnabled(FeatureFlags.USER_MANAGEMENT)).toBe(true);
    });
  });
}); 