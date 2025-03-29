import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/cn';

export const UserProfiles = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  // Sample user data
  const users = [
    { id: 1, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Bob Williams', email: 'bob@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Carol Davis', email: 'carol@example.com', role: 'Editor', status: 'Active' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">User Profiles</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage user profiles and information.
        </p>
      </div>
      
      <div className={cn(
        "p-6 rounded-lg",
        useNeumorphism 
          ? "shadow-neumorph" 
          : "bg-white dark:bg-gray-800 shadow"
      )}>
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className={cn(
                "pl-10 pr-4 py-2 rounded-md border",
                useNeumorphism
                  ? "shadow-neumorph-inset focus:shadow-neumorph-inset focus:border-primary"
                  : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary"
              )}
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <button className={cn(
            "px-4 py-2 rounded-md text-white bg-primary hover:bg-primary/90",
            useNeumorphism && "shadow-neumorph-primary"
          )}>
            Add User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium dark:text-white">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      user.status === 'Active' 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-primary hover:text-primary/90 mr-3">Edit</button>
                    <button className="text-red-500 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing 1 to {users.length} of {users.length} entries
          </div>
          
          <div className="flex space-x-2">
            <button disabled className={cn(
              "px-3 py-1 rounded-md text-sm",
              useNeumorphism
                ? "shadow-neumorph text-gray-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
            )}>
              Previous
            </button>
            
            <button className={cn(
              "px-3 py-1 rounded-md text-sm",
              useNeumorphism
                ? "shadow-neumorph"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            )}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 