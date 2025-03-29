import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureFlagsAdmin } from './FeatureFlagsAdmin';
import { FeatureFlags } from '@core/config/featureFlags';

// Mock the featureFlags module
vi.mock('@core/config/featureFlags', () => ({
  isFeatureEnabled: vi.fn().mockReturnValue(true),
  FeatureFlags: {
    USE_NEUMORPHISM: 'USE_NEUMORPHISM',
    ENABLE_DARK_MODE: 'ENABLE_DARK_MODE',
    TODO_MODULE: 'TODO_MODULE',
    ADMIN_MODULE: 'ADMIN_MODULE'
  },
  featureFlags: [
    {
      name: 'USE_NEUMORPHISM',
      description: 'Enable neumorphic design',
      enabled: true
    },
    {
      name: 'TODO_MODULE',
      description: 'Todo module',
      enabled: true,
      requiresAuth: true,
      permissions: ['admin']
    }
  ]
}));

describe('FeatureFlagsAdmin', () => {
  it('renders the feature flags management page', () => {
    render(<FeatureFlagsAdmin />);
    
    // Check title
    expect(screen.getByText('Feature Flags Management')).toBeInTheDocument();
    
    // Check sections
    expect(screen.getByText('Application Features')).toBeInTheDocument();
    expect(screen.getByText('UI Configuration')).toBeInTheDocument();
  });

  it('displays feature flags with their properties', () => {
    render(<FeatureFlagsAdmin />);
    
    // Check feature flag details
    expect(screen.getByText('USE_NEUMORPHISM')).toBeInTheDocument();
    expect(screen.getByText('Enable neumorphic design')).toBeInTheDocument();
    
    // Check permissions and auth requirements
    expect(screen.getByText('Requires Authentication')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('handles feature flag toggle', async () => {
    render(<FeatureFlagsAdmin />);
    
    // Find and click the toggle for USE_NEUMORPHISM
    const toggleInput = screen.getAllByRole('checkbox')[0];
    fireEvent.click(toggleInput);
    
    // Find and click save button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    // Check for success message
    expect(await screen.findByText('Changes saved successfully!')).toBeInTheDocument();
  });
}); 