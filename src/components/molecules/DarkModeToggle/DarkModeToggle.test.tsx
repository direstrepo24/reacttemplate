import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from './DarkModeToggle';
import { FeatureFlags } from '@/core/types';

// Mock de las funciones y módulos
vi.mock('@/core/config/featureFlags', () => ({
  isFeatureEnabled: (flag: string) => {
    if (flag === 'ENABLE_DARK_MODE') return true;
    return false;
  },
  FeatureFlags: { ENABLE_DARK_MODE: 'ENABLE_DARK_MODE' }
}));

describe('DarkModeToggle', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<DarkModeToggle />);
    expect(getByRole('button')).toBeInTheDocument();
  });
  
  it('toggles dark mode when clicked', () => {
    const { getByRole } = render(<DarkModeToggle />);
    const button = getByRole('button');
    
    fireEvent.click(button);
    // Verificar que se llamó al toggle
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
