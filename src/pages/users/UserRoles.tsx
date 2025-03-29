import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/shadcn';

export const UserRoles = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">User Roles</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage roles and permissions for system users.
        </p>
      </div>
      
      <div className={cn(
        "p-6 rounded-lg",
        useNeumorphism 
          ? "container-neumorph" 
          : "bg-white dark:bg-gray-800 shadow"
      )}>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-neutral dark:border-gray-700">
            <h2 className="text-lg font-medium dark:text-white">Roles</h2>
            <button className={cn(
              "px-3 py-1 rounded-md text-sm",
              useNeumorphism
                ? "button-neumorph-primary"
                : "bg-primary text-white"
            )}>
              Add Role
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 1, name: 'Administrator', permissions: 'Full access', users: 3 },
              { id: 2, name: 'Editor', permissions: 'Content management', users: 5 },
              { id: 3, name: 'Viewer', permissions: 'Read only access', users: 12 },
            ].map((role) => (
              <div 
                key={role.id}
                className={cn(
                  "p-4 rounded-md flex justify-between items-center",
                  useNeumorphism
                    ? "button-neumorph"
                    : "bg-neutral/50 dark:bg-gray-700/50"
                )}
              >
                <div>
                  <h3 className="font-medium dark:text-white">{role.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{role.permissions}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{role.users} users</span>
                  <button className={cn(
                    "px-2 py-1 rounded-md text-xs",
                    useNeumorphism
                      ? "button-neumorph"
                      : "bg-neutral hover:bg-neutral-200 dark:bg-gray-600 dark:hover:bg-gray-500"
                  )}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={cn(
        "p-6 rounded-lg",
        useNeumorphism 
          ? "container-neumorph" 
          : "bg-white dark:bg-gray-800 shadow"
      )}>
        <h2 className="text-lg font-medium mb-4 dark:text-white">Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            'View Dashboard', 'Manage Users', 'Edit Settings', 
            'View Reports', 'Create Content', 'Delete Content',
            'Approve Workflow', 'Manage API Keys', 'System Configuration'
          ].map((permission) => (
            <div 
              key={permission}
              className={cn(
                "p-3 rounded-md",
                useNeumorphism
                  ? "button-neumorph"
                  : "bg-neutral/50 hover:bg-neutral dark:bg-gray-700/50 dark:hover:bg-gray-700"
              )}
            >
              <span className="text-sm font-medium dark:text-white">{permission}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 