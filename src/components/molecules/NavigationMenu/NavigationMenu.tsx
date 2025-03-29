import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/core/utils/cn';
import { ChevronDown } from 'lucide-react';
import { MenuItem } from '@/core/types';
import { isFeatureEnabled, FeatureFlags, subscribeToFeatureFlags } from '@/core/config/featureFlags';
import { menuItems } from '@/core/config/menuConfig';

interface NavigationMenuProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  isExpanded: boolean;
  onToggle: () => void;
}

export const NavigationMenu = ({ 
  className, 
  orientation = 'vertical',
  isExpanded,
  onToggle
}: NavigationMenuProps) => {
  const location = useLocation();
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);

  // Filtra los items basado en sus feature flags
  const filterItem = (item: MenuItem): boolean => {
    if (!item.featureFlag) return true;
    // Convertimos el valor a string para evitar problemas de tipos
    const flagName = item.featureFlag.toString();
    return isFeatureEnabled(flagName as any);
  };

  // Efecto para filtrar los elementos del menú cuando cambian los feature flags
  useEffect(() => {
    // Función para filtrar elementos del menú basados en feature flags
    const filterMenuItems = () => {
      const filtered = menuItems.filter(filterItem);
      setFilteredItems(filtered);
    };

    // Filtrar inicialmente
    filterMenuItems();

    // Suscribirse a los cambios en los feature flags
    const unsubscribe = subscribeToFeatureFlags(() => {
      // Re-filtrar los elementos del menú cuando cambia cualquier flag
      filterMenuItems();
    });

    // Limpiar la suscripción cuando se desmonta el componente
    return () => {
      unsubscribe();
    };
  }, []);

  // Control de submenús expandidos
  const [expandedSubmenus, setExpandedSubmenus] = useState<string[]>([]);
  
  // Función para verificar si una ruta está activa
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Función para manejar la expansión de submenús
  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    // Filter subitems based on feature flags
    const filteredSubItems = item.children?.filter(filterItem) || [];

    const hasSubItems = filteredSubItems.length > 0;
    const isItemActive = isActive(item.path || '');
    const isSubmenuExpanded = expandedSubmenus.includes(item.path || '');
    const hasActiveChild = filteredSubItems.some(subItem => isActive(subItem.path || ''));

    return (
      <div key={item.path} className="mb-1">
        {/* Main item */}
        <div 
          className={cn(
            "flex justify-between items-center p-2 rounded-md cursor-pointer",
            useNeumorphism 
              ? isItemActive || hasActiveChild ? "button-neumorph-primary" : "button-neumorph" 
              : isItemActive || hasActiveChild 
                ? "bg-primary text-white" 
                : "hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]",
            "transition-colors"
          )}
          onClick={() => {
            if (hasSubItems) {
              toggleSubmenu(item.path || '');
            }
          }}
        >
          <Link 
            to={item.path || '#'} 
            className="flex items-center gap-2 flex-1"
            onClick={(e) => hasSubItems && e.preventDefault()}
          >
            {item.icon && <span className="w-5 h-5">{item.icon}</span>}
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
          {hasSubItems && (
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isSubmenuExpanded ? "rotate-180" : ""
              )} 
            />
          )}
        </div>
        
        {/* Subitems */}
        {hasSubItems && (
          <div 
            className={cn(
              "ml-2 pl-2 border-l border-[#e2e8f0] dark:border-[#334155] overflow-hidden transition-all duration-300 ease-in-out",
              isSubmenuExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
            )}
          >
            {filteredSubItems.map(subItem => {
              const isSubItemActive = isActive(subItem.path || '');
              
              return (
                <Link
                  key={subItem.path}
                  to={subItem.path || '#'}
                  className={cn(
                    "flex items-center gap-2 p-2 text-sm rounded-md my-1",
                    useNeumorphism 
                      ? isSubItemActive ? "button-neumorph-primary" : "button-neumorph" 
                      : isSubItemActive 
                        ? "bg-primary text-white" 
                        : "hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]",
                    "transition-colors"
                  )}
                >
                  {subItem.icon && <span className="w-4 h-4">{subItem.icon}</span>}
                  <span>{subItem.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={cn("w-full", className)}>
      {filteredItems.map(renderMenuItem)}
    </nav>
  );
}; 