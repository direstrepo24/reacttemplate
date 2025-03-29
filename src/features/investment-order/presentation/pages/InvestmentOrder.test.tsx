import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InvestmentOrder } from './InvestmentOrder';

// Mock the feature flags
vi.mock('@/core/config/featureFlags', () => ({
  isFeatureEnabled: vi.fn().mockReturnValue(true),
  FeatureFlags: {
    USE_NEUMORPHISM: 'USE_NEUMORPHISM'
  }
}));

// Mock the hooks
vi.mock('../../application/hooks/useInvestmentOrder', () => ({
  useInvestmentOrder: () => ({
    items: [
      {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    loading: false,
    error: null,
    fetchItems: vi.fn()
  })
}));

describe('InvestmentOrder', () => {
  it('renders correctly', () => {
    render(<InvestmentOrder />);
    
    // Check title
    expect(screen.getByText('InvestmentOrder')).toBeInTheDocument();
    
    // Check refresh button
    expect(screen.getByText('Refresh')).toBeInTheDocument();
    
    // Check items are rendered
    expect(screen.getByText(/"id": "1"/)).toBeInTheDocument();
  });

  it('handles loading state', () => {
    vi.mocked(useInvestmentOrder).mockReturnValue({
      items: [],
      loading: true,
      error: null,
      fetchItems: vi.fn()
    });

    render(<InvestmentOrder />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles error state', () => {
    vi.mocked(useInvestmentOrder).mockReturnValue({
      items: [],
      loading: false,
      error: new Error('Test error'),
      fetchItems: vi.fn()
    });

    render(<InvestmentOrder />);
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('calls fetchItems on mount and refresh', () => {
    const fetchItems = vi.fn();
    vi.mocked(useInvestmentOrder).mockReturnValue({
      items: [],
      loading: false,
      error: null,
      fetchItems
    });

    render(<InvestmentOrder />);
    
    // Should be called on mount
    expect(fetchItems).toHaveBeenCalledTimes(1);
    
    // Click refresh button
    fireEvent.click(screen.getByText('Refresh'));
    expect(fetchItems).toHaveBeenCalledTimes(2);
  });
}); 