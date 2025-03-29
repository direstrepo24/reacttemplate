import React from 'react';
import { Link } from 'react-router-dom';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { Button } from '@/components/atoms/Button';
import { ButtonBuilder } from '@/components/atoms/Button/ButtonBuilder';

export const ForgotPasswordForm: React.FC = () => {
  const { features } = useModuleFeatures();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de recuperación de contraseña
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <Button {...new ButtonBuilder()
          .setVariant('primary')
          .setNeumorph(features.neumorphism)
          .setChildren('Reset Password')
          .setFullWidth(true)
          .build()}
        />
      </div>
      <div className="text-center">
        <Link to="/auth/login" className="text-sm text-primary-600 hover:text-primary-500">
          Back to Sign in
        </Link>
      </div>
    </form>
  );
}; 