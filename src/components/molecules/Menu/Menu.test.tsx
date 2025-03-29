import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Menu } from './Menu';
import { MemoryRouter } from 'react-router-dom';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';

// Mock the feature flags
vi.mock('../../../core/config/featureFlags', () => ({
  isFeatureEnabled: (flag: string) => {
    // Return true for test scenarios by default
    return true;
  },
  FeatureFlags: {
    USE_NEUMORPHISM: 'USE_NEUMORPHISM',
    SHOW_USERS: 'SHOW_USERS',
    SHOW_SETTINGS: 'SHOW_SETTINGS',
    SHOW_REPORTS: 'SHOW_REPORTS'
  }
}));

const renderWithRouter = (ui: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

describe('Menu Component', () => {
  it('renders menu items correctly', () => {
    renderWithRouter(<Menu isOpen={true} />);
    
    // Check for the main menu sections
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });
  
  it('applies active link styles to the current route', () => {
    renderWithRouter(<Menu isOpen={true} />);
    
    // Find the Dashboard link and check its styling
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-primary');
    
    // Click on another link and check if active styling changes
    fireEvent.click(screen.getByText('Users'));
    
    // Note: In a real scenario, the route would change and active styling would update
    // For this test, we're mainly verifying the component structure
  });
  
  it('toggles submenu when clicking on a section with children', () => {
    renderWithRouter(<Menu isOpen={true} />);
    
    // Users section should have submenus
    const usersSection = screen.getByText('Users');
    fireEvent.click(usersSection);
    
    // After clicking, the submenu should be visible
    expect(screen.getByText('User Profiles')).toBeInTheDocument();
    expect(screen.getByText('User Roles')).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(usersSection);
    
    // In a real component with animation, we might check for CSS classes
    // that indicate collapsed state
  });
  
  it('hides menu items when feature flags are disabled', () => {
    // Override the mock implementation for this test
    const isFeatureEnabledMock = vi.fn().mockImplementation((flag: string) => {
      return flag !== 'SHOW_REPORTS';
    });
    
    const originalMock = vi.mocked(isFeatureEnabled);
    originalMock.mockImplementation(isFeatureEnabledMock);
    
    renderWithRouter(<Menu isOpen={true} />);
    
    // Reports should be hidden
    expect(screen.queryByText('Reports')).not.toBeInTheDocument();
    
    // Other sections should still be visible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
  
  it('renders collapsible menu for mobile/closed state', () => {
    renderWithRouter(<Menu isOpen={false} />);
    
    // When menu is closed, check that it has the correct class for collapsed state
    const menuElement = screen.getByRole('navigation');
    expect(menuElement).toHaveClass('w-16');
    
    // Only icons should be visible in collapsed state, not text
    const menuItems = screen.getAllByRole('link');
    menuItems.forEach(item => {
      expect(item.querySelector('svg')).toBeInTheDocument();
    });
  });
  
  it('renders neomorphic styling when the feature flag is enabled', () => {
    const mockFeature = vi.mocked(isFeatureEnabled);
    mockFeature.mockReturnValue(true);
    
    renderWithRouter(<Menu isOpen={true} />);
    
    const menuElement = screen.getByRole('navigation');
    expect(menuElement).toHaveClass('shadow-neumorph');
  });
}); 