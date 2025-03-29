import { Todo } from '@components/Todo';
import { isFeatureEnabled, FeatureFlags } from '../../core/config/featureFlags';
import { cn } from '../../core/utils/cn';

export const TodoList = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className={cn(
        "max-w-2xl mx-auto",
        useNeumorphism ? "p-6 container-neumorph" : "p-0"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <div className={cn(
            "px-3 py-1 rounded-full text-sm",
            useNeumorphism 
              ? "shadow-neumorph" 
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          )}>
            {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <div className="mb-8">
          <div className={cn(
            "p-4 rounded-lg mb-4 text-sm",
            useNeumorphism 
              ? "shadow-neumorph-inset" 
              : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
          )}>
            <p>Welcome to your task manager! Add, edit, and complete your tasks below.</p>
          </div>
        </div>
        
        <Todo />

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Tips: Click the checkbox to mark a task as completed. Use the edit button to modify a task.</p>
        </div>
      </div>
    </div>
  );
}; 