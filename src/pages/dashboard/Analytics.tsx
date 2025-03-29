import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/shadcn';

export const Analytics = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View analytics and statistics for your application.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn(
          "p-6 rounded-lg h-64",
          useNeumorphism 
            ? "container-neumorph" 
            : "bg-white dark:bg-gray-800 shadow"
        )}>
          <h2 className="text-lg font-medium mb-4 dark:text-white">Traffic Overview</h2>
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
          </div>
        </div>
        
        <div className={cn(
          "p-6 rounded-lg h-64",
          useNeumorphism 
            ? "container-neumorph" 
            : "bg-white dark:bg-gray-800 shadow"
        )}>
          <h2 className="text-lg font-medium mb-4 dark:text-white">User Demographics</h2>
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 