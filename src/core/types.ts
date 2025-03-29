import { ReactNode } from 'react';

export enum FeatureFlags {
  USE_DARK_MODE = 'darkMode',
  NEUMORPHISM = 'neumorphism',
  GENERAL_SETTINGS = 'GENERAL_SETTINGS',
  SECURITY_SETTINGS = 'SECURITY_SETTINGS',
  REPORTS = 'REPORTS',
  USER_ROLES = 'USER_ROLES',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ADVANCED_SECURITY = 'ADVANCED_SECURITY',
  USER_PROFILES = 'USER_PROFILES'
}

export interface MenuItem {
  label: string;
  path?: string;
  icon?: ReactNode;
  featureFlag?: FeatureFlags;
  permissions?: string[];
  children?: MenuItem[];
}

export interface Features {
  [key: string]: boolean;
} 