import React from 'react';
import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { FeatureFlags } from '@/core/types';
import { cn } from '@utils/cn';

/**
 * Componente Button atómico con soporte para diferentes variantes, tamaños,
 * y estilo neumórfico. Implementa el patrón de diseño atómico.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      neumorph,
      className = '',
      disabled = false,
      onClick,
      children,
      fullWidth = false,
      testId,
      asChild,
      ...props
    },
    ref
  ) => {
    const { features } = useModuleFeatures();
    const isNeumorph = neumorph ?? features.neumorphism;

    const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary: isNeumorph
        ? 'btn-neumorph-primary'
        : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white transition-colors duration-200',
      secondary: isNeumorph
        ? 'btn-neumorph-secondary'
        : 'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white transition-colors duration-200',
      success: isNeumorph
        ? 'btn-neumorph-success'
        : 'bg-success-500 hover:bg-success-600 active:bg-success-700 text-white transition-colors duration-200',
      danger: isNeumorph
        ? 'btn-neumorph-danger'
        : 'bg-danger-500 hover:bg-danger-600 active:bg-danger-700 text-white transition-colors duration-200',
      outline: isNeumorph
        ? 'btn-neumorph-outline'
        : 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-primary-900 dark:active:bg-primary-800 transition-colors duration-200',
      ghost: isNeumorph
        ? 'btn-neumorph-ghost'
        : 'text-primary-500 hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-primary-900 dark:active:bg-primary-800 transition-colors duration-200',
      link: isNeumorph
        ? 'btn-neumorph-link'
        : 'text-primary-500 hover:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 dark:active:text-primary-200 underline transition-colors duration-200',
      neutral: isNeumorph
        ? 'btn-neumorph-neutral'
        : 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white transition-colors duration-200',
    };

    const buttonStyles = cn(baseStyles, sizeStyles[size], variantStyles[variant], fullWidth ? 'w-full' : '', className);

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        ref,
        className: buttonStyles,
        disabled: disabled || isLoading,
        onClick,
        'data-testid': testId,
        ...props
      });
    }

    return (
      <button
        ref={ref}
        className={buttonStyles}
        disabled={disabled || isLoading}
        onClick={onClick}
        data-testid={testId}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
