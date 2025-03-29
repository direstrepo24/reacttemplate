import { InvestmentOrderEntity } from '../entities/InvestmentOrderEntity';

export interface InvestmentOrderRepository {
  getAll(): Promise<InvestmentOrderEntity[]>;
  getById(id: string): Promise<InvestmentOrderEntity | null>;
  create(data: Partial<InvestmentOrderEntity>): Promise<InvestmentOrderEntity>;
  update(id: string, data: Partial<InvestmentOrderEntity>): Promise<InvestmentOrderEntity>;
  delete(id: string): Promise<void>;
}

export class MockInvestmentOrderRepository implements InvestmentOrderRepository {
  private items: InvestmentOrderEntity[] = [];

  async getAll(): Promise<InvestmentOrderEntity[]> {
    return this.items;
  }

  async getById(id: string): Promise<InvestmentOrderEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async create(data: Partial<InvestmentOrderEntity>): Promise<InvestmentOrderEntity> {
    const now = new Date();
    const item = {
      id: crypto.randomUUID(),
      type: 'investment-order',
      orderType: data.orderType || 'BUY',
      symbol: data.symbol || '',
      quantity: data.quantity || 0,
      price: data.price || 0,
      status: data.status || 'PENDING',
      createdAt: now,
      updatedAt: now,
      executedAt: data.executedAt,
      userId: data.userId || '',
      notes: data.notes
    } as InvestmentOrderEntity;
    
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<InvestmentOrderEntity>): Promise<InvestmentOrderEntity> {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    const updated = {
      ...this.items[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.items[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
