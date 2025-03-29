import { InvestmentOrderEntity } from '../entities/InvestmentOrderEntity';
import { InvestmentOrderRepository } from './InvestmentOrderRepository';

/**
 * Implementación del repositorio que consume la API de Cloudflare Workers
 */
export class CloudflareWorkerRepository implements InvestmentOrderRepository {
  private readonly apiUrl: string;

  constructor() {
    // En desarrollo, usamos localhost. En producción, usamos la URL de Cloudflare
    this.apiUrl = import.meta.env.DEV 
      ? 'http://localhost:8787' 
      : 'https://api.reacttemplate.pages.dev';
  }

  async getAll(): Promise<InvestmentOrderEntity[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/investment-orders`);
      
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error fetching orders');
      }
      
      return result.data.map((item: any) => this.mapToEntity(item));
    } catch (error) {
      console.error('Error fetching investment orders:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<InvestmentOrderEntity> {
    try {
      const response = await fetch(`${this.apiUrl}/api/investment-orders/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error fetching order');
      }
      
      return this.mapToEntity(result.data);
    } catch (error) {
      console.error(`Error fetching investment order ${id}:`, error);
      throw error;
    }
  }

  async create(data: Partial<InvestmentOrderEntity>): Promise<InvestmentOrderEntity> {
    try {
      const response = await fetch(`${this.apiUrl}/api/investment-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error creating order: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error creating order');
      }
      
      return this.mapToEntity(result.data);
    } catch (error) {
      console.error('Error creating investment order:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<InvestmentOrderEntity>): Promise<InvestmentOrderEntity> {
    try {
      const response = await fetch(`${this.apiUrl}/api/investment-orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error updating order: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error updating order');
      }
      
      return this.mapToEntity(result.data);
    } catch (error) {
      console.error(`Error updating investment order ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/investment-orders/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting order: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error deleting order');
      }
    } catch (error) {
      console.error(`Error deleting investment order ${id}:`, error);
      throw error;
    }
  }

  private mapToEntity(data: any): InvestmentOrderEntity {
    return {
      id: data.id,
      type: 'investment-order',
      symbol: data.symbol,
      quantity: data.quantity,
      price: data.price,
      orderType: data.orderType,
      status: data.status,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      executedAt: data.executedAt ? new Date(data.executedAt) : undefined,
      notes: data.notes,
      userId: data.userId
    };
  }
} 