import { ForwardRefExoticComponent, SVGProps, RefAttributes, ReactElement } from 'react';
import { FeatureFlags } from '../config/featureFlags';

// Core types used across the application
export type FeatureFlag = {
  name: FeatureFlags;
  enabled: boolean;
  description?: string;
  requiresAuth?: boolean;
  permissions?: string[];
  subFeatures?: FeatureFlag[];
};

// Builder pattern interface for components
export interface ComponentBuilder<T> {
  build(): T;
  withProps(props: Partial<T>): ComponentBuilder<T>;
}

// Base component props interface
export interface BaseComponentProps {
  className?: string;
  testId?: string;
}

// User permission type
export type Permission = string;

// Heroicon component type
export type HeroIcon = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
  title?: string | undefined;
  titleId?: string | undefined;
} & RefAttributes<SVGSVGElement>>;

// Menu item type
export interface MenuItem {
  label: string;
  icon?: HeroIcon | ReactElement;
  path: string;
  featureFlag?: FeatureFlags;
  permissions?: Permission[];
  children?: MenuItem[];
}

// Authentication token structure
export interface AuthToken {
  userId: string;
  permissions: Permission[];
  expiresAt: number;
}