import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isFeatureEnabled, FeatureFlags } from '../config/featureFlags';

interface FeatureProtectedRouteProps {
  children: ReactNode;
  featureFlag: keyof typeof FeatureFlags;
  fallbackPath?: string;
}

/**
 * A component that protects routes based on feature flags
 * If feature is not enabled, redirects to fallback path or dashboard
 */
export const FeatureProtectedRoute = ({ 
  children, 
  featureFlag,
  fallbackPath = '/dashboard'
}: FeatureProtectedRouteProps) => {
  const isEnabled = isFeatureEnabled(featureFlag);

  if (!isEnabled) {
    // Redirect to the fallback path if feature is not enabled
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}; 