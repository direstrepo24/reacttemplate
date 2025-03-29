import { useState, useEffect } from 'react';
import { 
  isFeatureEnabled, 
  FeatureFlags, 
  featureFlags, 
  enableFeature, 
  disableFeature, 
  getAllFeatures, 
  updateFeatures
} from '@core/config/featureFlags';
import { cn } from '@core/utils/cn';
import { ButtonBuilder } from '@components/atoms/Button/ButtonBuilder';
import { Button } from '@components/atoms/Button/Button';

interface FeatureFlagToggleProps {
  name: string;
  description: string;
  enabled: boolean;
  onChange: (name: string, enabled: boolean) => void;
  permissions?: string[];
  requiresAuth?: boolean;
}

const FeatureFlagToggle = ({ 
  name, 
  description, 
  enabled, 
  onChange, 
  permissions, 
  requiresAuth 
}: FeatureFlagToggleProps) => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  return (
    <div 
      className={cn(
        'p-4 border rounded-lg mb-4',
        enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50',
        useNeumorphism && 'shadow-neumorph'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={enabled}
            onChange={() => onChange(name, !enabled)}
          />
          <div className={cn(
            "w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
            enabled ? 'peer-checked:bg-primary' : 'bg-gray-200'
          )}></div>
        </label>
      </div>
      
      {(permissions?.length || requiresAuth) && (
        <div className="mt-2 text-xs">
          {requiresAuth && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2">
              Requires Authentication
            </span>
          )}
          {permissions?.map(permission => (
            <span 
              key={permission}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2"
            >
              {permission}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const FeatureFlagsAdmin = () => {
  const [flags, setFlags] = useState(featureFlags);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  
  useEffect(() => {
    setFlags(featureFlags);
  }, []);
  
  const handleToggle = (name: string, enabled: boolean) => {
    setFlags(currentFlags => {
      const updatedFlags = JSON.parse(JSON.stringify(currentFlags));
      
      const updateFlag = (flags: any[]) => {
        for (let i = 0; i < flags.length; i++) {
          if (flags[i].name === name) {
            flags[i].enabled = enabled;
            return true;
          }
          
          if (flags[i].subFeatures?.length) {
            if (updateFlag(flags[i].subFeatures)) {
              return true;
            }
          }
        }
        return false;
      };
      
      updateFlag(updatedFlags);
      return updatedFlags;
    });
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    const changes: Partial<Record<FeatureFlags, boolean>> = {};
    
    const collectChanges = (flagsArray: any[]) => {
      flagsArray.forEach(flag => {
        if (Object.values(FeatureFlags).includes(flag.name as FeatureFlags)) {
          changes[flag.name as FeatureFlags] = flag.enabled;
        }
        
        if (flag.subFeatures?.length) {
          collectChanges(flag.subFeatures);
        }
      });
    };
    
    collectChanges(flags);
    
    updateFeatures(changes);
    
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 500);
  };
  
  const renderFlags = (flags: any[], level = 0) => {
    return flags.map(flag => (
      <div key={flag.name} style={{ marginLeft: `${level * 20}px` }}>
        <FeatureFlagToggle
          name={flag.name}
          description={flag.description}
          enabled={flag.enabled}
          onChange={handleToggle}
          permissions={flag.permissions}
          requiresAuth={flag.requiresAuth}
        />
        
        {flag.subFeatures?.length > 0 && (
          <div className="pl-4 border-l border-gray-200 mb-4">
            {renderFlags(flag.subFeatures, level + 1)}
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="p-6">
      <div className={cn(
        'flex justify-between items-center mb-6 p-4 bg-white rounded-lg',
        useNeumorphism && 'shadow-neumorph'
      )}>
        <h1 className="text-2xl font-bold">Feature Flags Management</h1>
        
        <div className="flex space-x-2">
          {isSuccess && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
              Changes saved successfully!
            </div>
          )}
          
          <Button
            {...new ButtonBuilder()
              .setVariant('primary')
              .setSize('md')
              .setChildren(isSaving ? 'Saving...' : 'Save Changes')
              .setDisabled(isSaving)
              .setOnClick(handleSave)
              .setNeumorph(useNeumorphism)
              .build()
            }
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Application Features</h2>
          {renderFlags(flags.filter(f => !f.name.startsWith('USE_')))}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">UI Configuration</h2>
          {renderFlags(flags.filter(f => f.name.startsWith('USE_')))}
        </div>
      </div>
    </div>
  );
};