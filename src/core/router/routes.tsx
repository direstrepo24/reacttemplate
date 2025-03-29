import React from 'react';
import { RouteObject } from 'react-router-dom';
import { FeatureFlags } from '@/core/config/featureFlags';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { LoginPage } from '@/features/auth/presentation/LoginPage';
import { RegisterPage } from '@/features/auth/presentation/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/presentation/ForgotPasswordPage';
import { TodoList } from '@/features/todo/presentation/TodoList';
import { UserRoles } from '@/features/users/presentation/UserRoles';
import { SecuritySettings } from '@/features/settings/presentation/SecuritySettings';
import { GeneralSettings } from '@/features/settings/presentation/GeneralSettings';
import { NotFound } from '@/features/errors/presentation/NotFound';
import { Unauthorized } from '@/features/errors/presentation/Unauthorized';
import { ProtectedRoute } from './ProtectedRoute';
import { InvestmentOrder } from '@/features/investment-order/presentation/pages/InvestmentOrder';
import { FeatureFlagsAdmin } from '@/pages/admin/FeatureFlagsAdmin';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            path: 'todo',
            element: (
              <ProtectedRoute
                element={<TodoList />}
                flag={FeatureFlags.TODO_MODULE}
              />
            ),
          },
          {
            path: 'users/roles',
            element: (
              <ProtectedRoute
                element={<UserRoles />}
                flag={FeatureFlags.USER_ROLES}
                permissions={['manage_roles']}
              />
            ),
          },
          {
            path: 'settings/general',
            element: (
              <ProtectedRoute
                element={<GeneralSettings />}
                flag={FeatureFlags.GENERAL_SETTINGS}
              />
            ),
          },
          {
            path: 'settings/security',
            element: (
              <ProtectedRoute
                element={<SecuritySettings />}
                flag={FeatureFlags.SECURITY_SETTINGS}
                permissions={['manage_security']}
              />
            ),
          },
          {
            path: 'admin',
            children: [
              {
                path: 'feature-flags',
                element: (
                  <ProtectedRoute
                    element={<FeatureFlagsAdmin />}
                    flag={FeatureFlags.ADMIN_MODULE}
                    permissions={['admin']}
                  />
                ),
              },
            ],
          },
          {
            path: 'investment-order',
            element: (
              <ProtectedRoute 
                element={<InvestmentOrder />} 
                flag={FeatureFlags.INVESTMENT_ORDER} 
                permissions={["admin","finance-manager"]} 
              />
            ),
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: 'unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 