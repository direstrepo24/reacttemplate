import { Outlet } from 'react-router-dom';
import { isFeatureEnabled, FeatureFlags } from '../core/config/featureFlags';
import { cn } from '../core/utils/shadcn';

/**
 * Layout for public pages (login, register, etc.)
 * Uses a clean, minimal design with proper centering
 */
export const PublicLayout = () => {
  const useDarkMode = isFeatureEnabled(FeatureFlags.USE_DARK_MODE);
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      useDarkMode && "dark",
      "bg-[#f0f2f5] dark:bg-gray-900"
    )}>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-4 py-8 mx-auto">
          <Outlet />
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} React Functional Template</p>
      </footer>
    </div>
  );
}; 