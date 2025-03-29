import { Link } from 'react-router-dom';
import { Button } from '@components/atoms/Button/Button';
import { ButtonBuilder } from '@components/atoms/Button/ButtonBuilder';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/cn';

export const Unauthorized = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className={cn(
        "w-24 h-24 rounded-full flex items-center justify-center mb-6",
        useNeumorphism 
          ? "shadow-neumorph dark:shadow-neumorph-dark" 
          : "bg-gray-100 dark:bg-gray-800"
      )}>
        <span className="text-5xl text-gray-400 dark:text-gray-500">403</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        You don't have permission to access this page. Please contact your administrator
        if you believe this is an error.
      </p>
      
      <div className="space-x-4">
        <Link to="/">
          <Button
            {...new ButtonBuilder()
              .withVariant('primary')
              .withSize('md')
              .withChildren('Go to Dashboard')
              .build()
            }
          />
        </Link>
        
        <button 
          onClick={() => window.history.back()}
          className={cn(
            "px-4 py-2 rounded-md font-medium",
            useNeumorphism
              ? "shadow-neumorph dark:shadow-neumorph-dark text-gray-700 dark:text-gray-300"
              : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          )}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}; 