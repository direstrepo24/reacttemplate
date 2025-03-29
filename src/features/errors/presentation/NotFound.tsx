import React from 'react';
import { Link } from 'react-router-dom';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { Button } from '@/components/atoms/Button';
import { ButtonBuilder } from '@/components/atoms/Button/ButtonBuilder';

export const NotFound: React.FC = () => {
  const { features } = useModuleFeatures();

  return (
    <div className={`min-h-screen flex items-center justify-center ${features.neumorphism ? 'bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}>
      <div className={`w-full max-w-md p-8 text-center ${features.neumorphism ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'} rounded-lg`}>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">Page not found</p>
        <Link to="/">
          <Button {...new ButtonBuilder()
            .setVariant('primary')
            .setNeumorph(features.neumorphism)
            .setChildren('Go Home')
            .build()}
          />
        </Link>
      </div>
    </div>
  );
}; 