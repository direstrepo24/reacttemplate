import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ButtonBuilder } from '../components/atoms/Button/ButtonBuilder';
import { Button } from '../components/atoms/Button/Button';
import { NavigationMenu } from '../components/molecules/NavigationMenu/NavigationMenu';
import { useAuthStore } from '../features/auth/application/authStore';
import { isFeatureEnabled, FeatureFlags } from '../core/config/featureFlags';
import { cn } from '../core/utils/shadcn';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../core/theme/ThemeProvider';

/**
 * Layout for authenticated dashboard pages
 * Includes header with navigation and responsive sidebar
 */
export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();
  
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);

  const logoutButton = new ButtonBuilder()
    .setVariant('secondary')
    .setSize('sm')
    .setNeumorph(useNeumorphism)
    .setChildren('Logout')
    .setOnClick(logout)
    .build();

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDarkMode && "dark",
      "bg-[#f8f9fb] dark:bg-gray-900"
    )}>
      {/* Header */}
      <header className="w-full border-b border-neutral py-3 bg-white dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden mr-4 p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold dark:text-white">React Functional Template</h1>
          </div>
          <div className="flex items-center">
            <Button {...logoutButton} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 transform z-20 w-64 bg-white dark:bg-gray-800 border-r border-neutral dark:border-gray-700 transition-transform duration-300 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b border-neutral dark:border-gray-700">
            <div className="font-semibold text-sm dark:text-white">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </div>
          </div>
          <div className="p-4">
            <NavigationMenu 
              className="w-full" 
              orientation="vertical" 
              isExpanded={true}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          <main className="p-4 md:p-6 bg-[#f8f9fb] dark:bg-gray-900">
            <div className={cn(
              "p-6 rounded-lg",
              useNeumorphism
                ? 'container-neumorph' 
                : 'bg-white dark:bg-gray-800 shadow'
            )}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}; 