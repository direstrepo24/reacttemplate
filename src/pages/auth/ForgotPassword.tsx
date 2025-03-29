import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/atoms/Button/Button';
import { ButtonBuilder } from '@components/atoms/Button/ButtonBuilder';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';
import { cn } from '@core/utils/cn';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mb-6 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Check Your Email</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've sent a password reset link to <strong>{email}</strong>. 
          Please check your inbox and follow the instructions.
        </p>
        
        <Link to="/login">
          <Button
            {...new ButtonBuilder()
              .withVariant('primary')
              .withSize('md')
              .withChildren('Back to Login')
              .build()
            }
          />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-2 dark:text-white">Forgot Your Password?</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              useNeumorphism
                ? "shadow-neumorph-inset focus:shadow-neumorph-inset focus:border-primary"
                : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary dark:focus:border-primary"
            )}
            required
          />
        </div>
        
        <div>
          <Button
            {...new ButtonBuilder()
              .withVariant('primary')
              .withSize('lg')
              .withChildren(isLoading ? 'Sending Link...' : 'Send Reset Link')
              .withClassName('w-full')
              .withProps({ 
                disabled: isLoading,
                type: 'submit' 
              })
              .build()
            }
          />
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}; 