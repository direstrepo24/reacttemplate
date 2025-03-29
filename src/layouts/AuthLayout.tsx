import { Outlet } from 'react-router-dom';
import { isFeatureEnabled, FeatureFlags } from '../utils/featureFlags';
import { cn } from '../utils/cn';

export const AuthLayout = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className={cn(
        "w-full max-w-md p-8 rounded-xl",
        useNeumorphism 
          ? "container-neumorph" 
          : "bg-white dark:bg-gray-800 shadow-lg"
      )}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome to AppName</h1>
          <p className="text-gray-500 dark:text-gray-400">Your productivity solution</p>
        </div>
        
        <Outlet />
        
        <div className="mt-8 pt-6 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-700">
          &copy; {new Date().getFullYear()} AppName Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}; 