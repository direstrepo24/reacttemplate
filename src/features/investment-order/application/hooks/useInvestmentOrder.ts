import { useState, useCallback } from 'react';
import { InvestmentOrderEntity } from '../../domain/entities/InvestmentOrderEntity';
import { InvestmentOrderRepository, MockInvestmentOrderRepository } from '../../domain/repositories/InvestmentOrderRepository';

// In a real app, this would be injected
const repository: InvestmentOrderRepository = new MockInvestmentOrderRepository();

export const useInvestmentOrder = () => {
  const [items, setItems] = useState<InvestmentOrderEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await repository.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (data: Partial<InvestmentOrderEntity>) => {
    try {
      setLoading(true);
      setError(null);
      const newItem = await repository.create(data);
      setItems(current => [...current, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: string, data: Partial<InvestmentOrderEntity>) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await repository.update(id, data);
      setItems(current => current.map(item => item.id === id ? updated : item));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await repository.delete(id);
      setItems(current => current.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
}; 