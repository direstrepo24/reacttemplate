import { ReactNode } from 'react';

export enum FeatureFlags {
  ENABLE_DARK_MODE = 'ENABLE_DARK_MODE',
  NEUMORPHISM = 'NEUMORPHISM',
  DASHBOARD = 'DASHBOARD',
  TODO_MODULE = 'TODO_MODULE',
  USERS_MODULE = 'USERS_MODULE',
  SETTINGS_MODULE = 'SETTINGS_MODULE',
  ADMIN_MODULE = 'ADMIN_MODULE',
  REPORTS_MODULE = 'REPORTS_MODULE',
  GENERAL_SETTINGS = 'GENERAL_SETTINGS',
  SECURITY_SETTINGS = 'SECURITY_SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ADVANCED_SECURITY = 'ADVANCED_SECURITY',
  USER_PROFILES = 'USER_PROFILES',
  USER_ROLES = 'USER_ROLES',
  INVESTMENT_ORDER = 'INVESTMENT_ORDER'
}

export interface MenuItem {
  label: string;
  path?: string;
  icon?: ReactNode;
  featureFlag?: string;  // Cambiado a string para evitar incompatibilidades
  permissions?: string[];
  children?: MenuItem[];
}

export interface Features {
  [key: string]: boolean;
}
