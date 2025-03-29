import { MenuItem } from '../types';
import { FeatureFlags } from './featureFlags';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon as CogIcon,
  ShieldCheckIcon,
  ListBulletIcon as ListTaskIcon,
  ChartBarIcon,
  BellIcon,
  UserGroupIcon,
  KeyIcon,
  AdjustmentsHorizontalIcon as AdjustmentsIcon,
  LockClosedIcon,
  FlagIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import React from 'react';

// Menu configuration connected to feature flags
export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <HomeIcon />,
    featureFlag: FeatureFlags.DASHBOARD
  },
  {
    label: 'Todo',
    path: '/todo',
    icon: <ListTaskIcon />,
    featureFlag: FeatureFlags.TODO_MODULE
  },
  {
    label: 'Investment Order',
    path: '/investment-order',
    icon: <BanknotesIcon />,
    featureFlag: FeatureFlags.INVESTMENT_ORDER
  },
  {
    label: 'Users',
    path: '/users',
    icon: <UserIcon />,
    featureFlag: FeatureFlags.USERS_MODULE,
    children: [
      {
        label: 'Profiles',
        path: '/users/profiles',
        icon: <UserGroupIcon />,
        featureFlag: FeatureFlags.USER_PROFILES
      },
      {
        label: 'Roles',
        path: '/users/roles',
        icon: <KeyIcon />,
        featureFlag: FeatureFlags.USER_ROLES
      }
    ]
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <CogIcon />,
    featureFlag: FeatureFlags.SETTINGS_MODULE,
    children: [
      {
        label: 'General',
        path: '/settings/general',
        icon: <AdjustmentsIcon />,
        featureFlag: FeatureFlags.GENERAL_SETTINGS
      },
      {
        label: 'Security',
        path: '/settings/security',
        icon: <LockClosedIcon />,
        featureFlag: FeatureFlags.SECURITY_SETTINGS
      }
    ]
  },
  {
    label: 'Admin',
    path: '/admin',
    icon: <ShieldCheckIcon />,
    featureFlag: FeatureFlags.ADMIN_MODULE,
    children: [
      {
        label: 'Feature Flags',
        path: '/admin/feature-flags',
        icon: <FlagIcon />,
        permissions: ['admin']
      }
    ]
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: <ChartBarIcon />,
    featureFlag: FeatureFlags.REPORTS_MODULE
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: <BellIcon />,
    featureFlag: FeatureFlags.NOTIFICATIONS
  }
]; 