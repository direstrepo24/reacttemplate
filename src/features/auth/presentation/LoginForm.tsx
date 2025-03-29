import React from 'react';
import { Link } from 'react-router-dom';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { Button } from '@/components/atoms/Button';
import { ButtonBuilder } from '@/components/atoms/Button/ButtonBuilder';

export const LoginForm: React.FC = () => {
  const { features } = useModuleFeatures();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de login
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>
        <Link to="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
          Forgot password?
        </Link>
      </div>
      <div>
        <Button {...new ButtonBuilder()
          .setVariant('primary')
          .setNeumorph(features.neumorphism)
          .setChildren('Sign in')
          .setFullWidth(true)
          .build()}
        />
      </div>
      <div className="text-center">
        <Link to="/auth/register" className="text-sm text-primary-600 hover:text-primary-500">
          Don't have an account? Sign up
        </Link>
      </div>
    </form>
  );
};