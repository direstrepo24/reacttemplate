import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from './DarkModeToggle';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';

// Mock the featureFlags module
vi.mock('../../../core/config/featureFlags', () => ({
  isFeatureEnabled: vi.fn(),
  FeatureFlags: {
    USE_DARK_MODE: 'USE_DARK_MODE',
    USE_NEUMORPHISM: 'USE_NEUMORPHISM'
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('DarkModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isFeatureEnabled).mockImplementation((flag: keyof typeof FeatureFlags) => {
      if (flag === FeatureFlags.USE_DARK_MODE) return true;
      if (flag === FeatureFlags.USE_NEUMORPHISM) return true;
      return false;
    });
    localStorageMock.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders when dark mode feature is enabled', () => {
    render(<DarkModeToggle />);
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
  });

  it('does not render when dark mode feature is disabled', () => {
    vi.mocked(isFeatureEnabled).mockImplementation((flag: keyof typeof FeatureFlags) => {
      if (flag === FeatureFlags.USE_DARK_MODE) return false;
      return true;
    });
    
    render(<DarkModeToggle />);
    expect(screen.queryByTestId('dark-mode-toggle')).not.toBeInTheDocument();
  });

  it('toggles dark mode when clicked', () => {
    render(<DarkModeToggle />);
    
    const toggle = screen.getByTestId('dark-mode-toggle');
    
    // Initially light mode (default)
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    // Click to toggle to dark mode
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true');
    
    // Click to toggle back to light mode
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'false');
  });

  it('initializes from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('true');
    
    render(<DarkModeToggle />);
    
    // Should be in dark mode initially since localStorage has 'true'
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('shows sun icon in dark mode', () => {
    localStorageMock.getItem.mockReturnValueOnce('true');
    
    render(<DarkModeToggle />);
    
    // In dark mode, should show the sun icon
    expect(screen.getByTestId('dark-mode-toggle').innerHTML).toContain('FiSun');
  });

  it('shows moon icon in light mode', () => {
    localStorageMock.getItem.mockReturnValueOnce('false');
    
    render(<DarkModeToggle />);
    
    // In light mode, should show the moon icon
    expect(screen.getByTestId('dark-mode-toggle').innerHTML).toContain('FiMoon');
  });

  it('applies neumorphism styling when enabled', () => {
    render(<DarkModeToggle />);
    
    expect(screen.getByTestId('dark-mode-toggle')).toHaveClass('shadow-neumorph');
  });

  it('does not apply neumorphism styling when disabled', () => {
    vi.mocked(isFeatureEnabled).mockImplementation((flag: keyof typeof FeatureFlags) => {
      if (flag === FeatureFlags.USE_DARK_MODE) return true;
      if (flag === FeatureFlags.USE_NEUMORPHISM) return false;
      return false;
    });
    
    render(<DarkModeToggle />);
    
    expect(screen.getByTestId('dark-mode-toggle')).not.toHaveClass('shadow-neumorph');
  });
}); 