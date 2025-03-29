import React from 'react';
import { useRouteError } from 'react-router-dom';
import { useModuleFeatures } from '@hooks/useModuleFeatures';
import { FeatureFlags } from '@core/types';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-xl w-full mx-auto p-8">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
              <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorBoundary() {
  const error = useRouteError() as Error;
  const { hasFeature } = useModuleFeatures();
  const useNeumorph = hasFeature(FeatureFlags.USE_NEUMORPHISM);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-xl w-full mx-auto p-8">
        <div className={`p-6 text-center rounded-lg ${
          useNeumorph ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'
        }`}>
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Oops! Navigation Error
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error?.message || 'An unexpected error occurred while navigating'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className={`font-medium py-2 px-4 rounded transition-colors ${
              useNeumorph ? 'button-neumorph-primary' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
} 