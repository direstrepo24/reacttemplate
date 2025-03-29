import React from 'react';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';

export const SecuritySettings: React.FC = () => {
  const { features } = useModuleFeatures();

  return (
    <div className={`p-6 ${features.neumorphism ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'} rounded-lg`}>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Security Settings</h1>
      {/* Aquí iría el contenido del componente */}
    </div>
  );
}; 