import { useState } from 'react';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/cn';
import { Button } from '@components/atoms/Button/Button';
import { ButtonBuilder } from '@components/atoms/Button/ButtonBuilder';

export const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    passwordPolicy: 'strong',
    sessionTimeout: '30',
    failedLoginAttempts: '5',
    passwordExpiry: '90',
    enableMfa: true,
    allowPasswordReset: true,
    ipRestriction: false,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Security settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Security Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configure security and access controls for your application.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={cn(
          "p-6 rounded-lg mb-6",
          useNeumorphism 
            ? "shadow-neumorph" 
            : "bg-white dark:bg-gray-800 shadow"
        )}>
          <h2 className="text-lg font-medium mb-4 dark:text-white">Password Policy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="passwordPolicy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password Strength
              </label>
              <select
                id="passwordPolicy"
                name="passwordPolicy"
                value={formData.passwordPolicy}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md",
                  useNeumorphism
                    ? "shadow-neumorph-inset focus:shadow-neumorph-inset focus:border-primary"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary"
                )}
              >
                <option value="basic">Basic (min 8 characters)</option>
                <option value="medium">Medium (min 8, alphanumeric)</option>
                <option value="strong">Strong (min 10, alphanumeric with symbols)</option>
                <option value="custom">Custom Policy</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password Expiry (days)
              </label>
              <input
                type="number"
                id="passwordExpiry"
                name="passwordExpiry"
                value={formData.passwordExpiry}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md",
                  useNeumorphism
                    ? "shadow-neumorph-inset focus:shadow-neumorph-inset focus:border-primary"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary"
                )}
              />
            </div>
            
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md",
                  useNeumorphism
                    ? "shadow-neumorph-inset focus:shadow-neumorph-inset focus:border-primary"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary"
                )}
              />
            </div>
            
            <div>
              <label htmlFor="failedLoginAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Failed Login Attempts Before Lockout
              </label>
              <input
                type="number"
                id="failedLoginAttempts"
                name="failedLoginAttempts"
                value={formData.failedLoginAttempts}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md",
                  useNeumorphism
                    ? "shadow-neumorph-inset focus:shadow-neumorph-inset focus:border-primary"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary"
                )}
              />
            </div>
          </div>
        </div>
        
        <div className={cn(
          "p-6 rounded-lg mb-6",
          useNeumorphism 
            ? "shadow-neumorph" 
            : "bg-white dark:bg-gray-800 shadow"
        )}>
          <h2 className="text-lg font-medium mb-4 dark:text-white">Advanced Security</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableMfa"
                name="enableMfa"
                checked={formData.enableMfa}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="enableMfa" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable Multi-Factor Authentication
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowPasswordReset"
                name="allowPasswordReset"
                checked={formData.allowPasswordReset}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="allowPasswordReset" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Allow Password Reset
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ipRestriction"
                name="ipRestriction"
                checked={formData.ipRestriction}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="ipRestriction" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable IP Restriction
              </label>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "p-6 rounded-lg mb-6",
          useNeumorphism 
            ? "shadow-neumorph" 
            : "bg-white dark:bg-gray-800 shadow"
        )}>
          <h2 className="text-lg font-medium mb-4 dark:text-white">Security Audit</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate a detailed report of your system's security settings and potential vulnerabilities.
          </p>
          
          <button
            type="button"
            className={cn(
              "px-4 py-2 rounded-md",
              useNeumorphism
                ? "shadow-neumorph text-gray-700 dark:text-gray-300"
                : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            )}
          >
            Generate Audit Report
          </button>
        </div>
        
        <div className="flex justify-end">
          <Button
            {...new ButtonBuilder()
              .withVariant('primary')
              .withSize('md')
              .withChildren(isSaving ? 'Saving...' : 'Save Settings')
              .withProps({ 
                disabled: isSaving,
                type: 'submit' 
              })
              .build()
            }
          />
        </div>
      </form>
    </div>
  );
}; 