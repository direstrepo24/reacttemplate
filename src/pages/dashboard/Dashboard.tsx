import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/cn';

export const Dashboard = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome to your dashboard. Here's an overview of your key metrics.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: '2,467', change: '+12.5%', color: 'text-green-500' },
          { title: 'Active Sessions', value: '489', change: '+4.3%', color: 'text-green-500' },
          { title: 'Revenue', value: '$12,430', change: '-2.7%', color: 'text-red-500' },
          { title: 'Conversion Rate', value: '3.65%', change: '+0.9%', color: 'text-green-500' },
        ].map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg",
              useNeumorphism ? "shadow-neumorph" : "bg-white dark:bg-gray-800 shadow"
            )}
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.title}</p>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-2xl font-semibold dark:text-white">{stat.value}</p>
              <p className={cn("flex items-baseline text-sm font-semibold", stat.color)}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activity & Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className={cn(
          "p-6 rounded-lg",
          useNeumorphism ? "shadow-neumorph" : "bg-white dark:bg-gray-800 shadow"
        )}>
          <h2 className="text-lg font-medium dark:text-white mb-4">Usage Overview</h2>
          <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart Placeholder</p>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className={cn(
          "p-6 rounded-lg",
          useNeumorphism ? "shadow-neumorph" : "bg-white dark:bg-gray-800 shadow"
        )}>
          <h2 className="text-lg font-medium dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { user: 'Alice Johnson', action: 'Logged in', time: '2 minutes ago' },
              { user: 'Bob Smith', action: 'Updated profile', time: '47 minutes ago' },
              { user: 'Carol White', action: 'Uploaded document', time: '3 hours ago' },
              { user: 'Dave Miller', action: 'Changed settings', time: '5 hours ago' },
              { user: 'Eve Brown', action: 'Added new user', time: 'Yesterday' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">{activity.user}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 