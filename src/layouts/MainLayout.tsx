import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { isFeatureEnabled, FeatureFlags } from '../utils/featureFlags';
import { cn } from '../utils/cn';

// Icons (using simple text for now)
const DashboardIcon = () => <span>📊</span>;
const TodoIcon = () => <span>✓</span>;
const UsersIcon = () => <span>👥</span>;
const SettingsIcon = () => <span>⚙️</span>;
const AdminIcon = () => <span>🔐</span>;
const LogoutIcon = () => <span>🚪</span>;

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Navigation items with access control
  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <DashboardIcon /> 
    },
    { 
      path: '/todo', 
      label: 'Todo List', 
      icon: <TodoIcon /> 
    },
    { 
      path: '/users/profiles', 
      label: 'User Profiles', 
      icon: <UsersIcon />,
      featureFlag: FeatureFlags.USER_PROFILES
    },
    { 
      path: '/users/roles', 
      label: 'User Roles', 
      icon: <UsersIcon />,
      featureFlag: FeatureFlags.USER_ROLES
    },
    { 
      path: '/settings/general', 
      label: 'General Settings', 
      icon: <SettingsIcon />,
      featureFlag: FeatureFlags.GENERAL_SETTINGS
    },
    { 
      path: '/settings/security', 
      label: 'Security Settings', 
      icon: <SettingsIcon />,
      featureFlag: FeatureFlags.SECURITY_SETTINGS
    },
    { 
      path: '/admin/feature-flags', 
      label: 'Feature Flags', 
      icon: <AdminIcon />,
      permission: 'admin'
    }
  ];
  
  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "transition-all duration-300 ease-in-out h-screen fixed lg:static z-10",
          useNeumorphism ? "shadow-neumorph dark:shadow-neumorph-dark" : "bg-white dark:bg-gray-800 shadow-lg",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* App Logo */}
          <div className={cn(
            "p-4 flex items-center",
            sidebarOpen ? "justify-between" : "justify-center"
          )}>
            <Link to="/" className="font-bold text-xl">
              {sidebarOpen ? "AppName" : "A"}
            </Link>
            <button 
              onClick={toggleSidebar}
              className={cn(
                "p-2 rounded-full",
                useNeumorphism ? "button-neumorph" : "hover:bg-gray-100 dark:hover:bg-gray-700",
                !sidebarOpen && "hidden lg:block"
              )}
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              // Skip items that require feature flags that are disabled
              if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) {
                return null;
              }
              
              // In a real app, check permissions here
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    isActiveRoute(item.path) 
                      ? useNeumorphism 
                        ? "shadow-neumorph-inset" 
                        : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100" 
                      : useNeumorphism 
                        ? "hover:shadow-neumorph" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          
          {/* User Profile / Logout */}
          <div className={cn(
            "p-4 border-t border-gray-200 dark:border-gray-700",
            useNeumorphism && "shadow-neumorph-inset"
          )}>
            <Link 
              to="/login" 
              className={cn(
                "flex items-center p-3 rounded-lg",
                useNeumorphism ? "button-neumorph" : "hover:bg-gray-100 dark:hover:bg-gray-700",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogoutIcon />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </Link>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 overflow-auto",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Top Nav Bar */}
        <header className={cn(
          "h-16 flex items-center px-6 sticky top-0 z-10",
          useNeumorphism ? "shadow-neumorph" : "bg-white dark:bg-gray-800 shadow-md"
        )}>
          <button 
            className="lg:hidden mr-4 text-xl"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{
              navItems.find(item => isActiveRoute(item.path))?.label || 'Dashboard'
            }</h1>
          </div>
          
          {/* User Profile / Settings / Notifications */}
          <div className="flex items-center space-x-4">
            {isFeatureEnabled(FeatureFlags.NOTIFICATIONS) && (
              <button className={cn(
                "rounded-full p-2",
                useNeumorphism ? "button-neumorph" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}>
                🔔
              </button>
            )}
            
            {isFeatureEnabled(FeatureFlags.ENABLE_DARK_MODE) && (
              <button className={cn(
                "rounded-full p-2",
                useNeumorphism ? "button-neumorph" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}>
                🌙
              </button>
            )}
          </div>
        </header>
        
        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 