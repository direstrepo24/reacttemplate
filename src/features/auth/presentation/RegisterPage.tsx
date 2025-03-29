import React from 'react';
import { RegisterForm } from './RegisterForm';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { FeatureFlags } from '@/core/types';

export const RegisterPage: React.FC = () => {
  const { features } = useModuleFeatures();

  return (
    <div className={`min-h-screen flex items-center justify-center ${features.neumorphism ? 'bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}>
      <div className={`w-full max-w-md p-8 ${features.neumorphism ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'} rounded-lg`}>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create Account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
}; 