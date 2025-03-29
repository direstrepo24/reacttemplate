import { Link } from 'react-router-dom';
import { ButtonBuilder } from '@components/atoms/Button/ButtonBuilder';
import { Button } from '@components/atoms/Button/Button';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/shadcn';

export const NotFoundPage = () => {
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  const useDarkMode = isFeatureEnabled(FeatureFlags.USE_DARK_MODE);
  
  const homeButton = new ButtonBuilder()
    .withVariant('primary')
    .withSize('lg')
    .withNeumorph(useNeumorphism)
    .withChildren('Go to Homepage')
    .withClassName('mt-6')
    .build();
    
  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-4",
      useDarkMode && "dark",
      "bg-[#f0f2f5] dark:bg-gray-900"
    )}>
      <div className={cn(
        "max-w-md w-full p-8 rounded-lg text-center",
        useNeumorphism 
          ? 'container-neumorph' 
          : 'bg-white dark:bg-gray-800 shadow'
      )}>
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold mt-4 dark:text-white">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button {...homeButton} />
        </Link>
      </div>
    </div>
  );
}; 