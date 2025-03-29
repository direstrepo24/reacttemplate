import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/shadcn';

export const Reports = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Reports</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Generate and view reports for your application.
        </p>
      </div>
      
      <div className={cn(
        "p-6 rounded-lg",
        useNeumorphism 
          ? "container-neumorph" 
          : "bg-white dark:bg-gray-800 shadow"
      )}>
        <h2 className="text-lg font-medium mb-4 dark:text-white">Available Reports</h2>
        <div className="space-y-4">
          {['Monthly Usage Report', 'User Activity Report', 'System Performance Report', 'Audit Log Report'].map((report) => (
            <div 
              key={report}
              className={cn(
                "p-4 rounded-md flex justify-between items-center cursor-pointer",
                useNeumorphism
                  ? "button-neumorph"
                  : "bg-neutral/50 hover:bg-neutral dark:bg-gray-700/50 dark:hover:bg-gray-700"
              )}
            >
              <span className="text-sm font-medium dark:text-white">{report}</span>
              <button 
                className={cn(
                  "px-3 py-1 rounded-md text-xs",
                  useNeumorphism
                    ? "button-neumorph-primary"
                    : "bg-primary text-white"
                )}
              >
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 