import React from 'react';
import { Navigate } from 'react-router-dom';
import { FeatureFlags } from '@/core/config/featureFlags';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';

interface ProtectedRouteProps {
  element: React.ReactNode;
  flag: FeatureFlags;
  permissions?: string[];
}

const permissionsGuard = (permissions: string[]): boolean => {
  // Aquí iría la lógica para verificar los permisos del usuario
  // Por ahora, retornamos true para simular que el usuario tiene todos los permisos
  return true;
};

/**
 * A component that protects routes requiring authentication
 * If user is not authenticated, redirects to login page
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  flag, 
  permissions 
}) => {
  const { hasFeature } = useModuleFeatures();

  if (flag && !hasFeature(flag)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permissions && !permissionsGuard(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element as JSX.Element;
}; 