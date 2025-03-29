import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InvestmentOrder } from './InvestmentOrder';

// Mockear el hook useInvestmentOrder
vi.mock('../../../application/hooks/useInvestmentOrder', () => ({
  useInvestmentOrder: vi.fn().mockReturnValue({
    items: [],
    loading: false,
    error: null,
    fetchItems: vi.fn(),
    createItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn()
  })
}));

describe('InvestmentOrder Component', () => {
  it('renders the orders list', () => {
    render(<InvestmentOrder />);
    expect(screen.getByText(/Investment Orders/i)).toBeInTheDocument();
  });
});
