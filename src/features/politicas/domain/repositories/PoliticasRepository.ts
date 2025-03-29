import { PoliticasEntity } from '../entities/PoliticasEntity';

export interface PoliticasRepository {
  getAll(): Promise<PoliticasEntity[]>;
  getById(id: string): Promise<PoliticasEntity | null>;
  create(data: Partial<PoliticasEntity>): Promise<PoliticasEntity>;
  update(id: string, data: Partial<PoliticasEntity>): Promise<PoliticasEntity>;
  delete(id: string): Promise<void>;
}

export class MockPoliticasRepository implements PoliticasRepository {
  private items: PoliticasEntity[] = [];

  async getAll(): Promise<PoliticasEntity[]> {
    return this.items;
  }

  async getById(id: string): Promise<PoliticasEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async create(data: Partial<PoliticasEntity>): Promise<PoliticasEntity> {
    const item = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    this.items.push(item);
    return item;
  }

  async update(id: string, data: Partial<PoliticasEntity>): Promise<PoliticasEntity> {
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