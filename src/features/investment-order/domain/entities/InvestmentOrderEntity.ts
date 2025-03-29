export interface InvestmentOrderEntity {
  id: string;
  type: 'investment-order'; // Tipo de entidad
  orderType: 'BUY' | 'SELL'; // Tipo de orden: compra o venta
  symbol: string; // Símbolo del instrumento
  quantity: number; // Cantidad
  price: number; // Precio
  status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REJECTED'; // Estado
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date; // Fecha de ejecución (si aplica)
  userId: string; // ID del usuario que creó la orden
  notes?: string; // Notas adicionales
}

/**
 * Implementación funcional e inmutable para InvestmentOrder
 * Sigue principios de diseño orientado a objetos y patrones funcionales
 */
export class InvestmentOrder implements InvestmentOrderEntity {
  readonly id: string;
  readonly type: 'investment-order';
  readonly orderType: 'BUY' | 'SELL';
  readonly symbol: string;
  readonly quantity: number;
  readonly price: number;
  readonly status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REJECTED';
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly executedAt?: Date;
  readonly userId: string;
  readonly notes?: string;

  private constructor(props: InvestmentOrderEntity) {
    this.id = props.id;
    this.type = props.type;
    this.orderType = props.orderType;
    this.symbol = props.symbol;
    this.quantity = props.quantity;
    this.price = props.price;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.executedAt = props.executedAt;
    this.userId = props.userId;
    this.notes = props.notes;
    
    // Congelar el objeto para hacerlo inmutable
    Object.freeze(this);
  }

  // Factory estático para crear instancias
  static create(data: Partial<InvestmentOrderEntity>): InvestmentOrder {
    // Valores por defecto y validación
    if (!data.symbol) throw new Error('Symbol is required');
    if (!data.quantity || data.quantity <= 0) throw new Error('Quantity must be positive');
    if (!data.price || data.price <= 0) throw new Error('Price must be positive');
    if (!data.userId) throw new Error('User ID is required');
    
    return new InvestmentOrder({
      id: data.id || crypto.randomUUID(),
      type: 'investment-order',
      orderType: data.orderType || 'BUY',
      symbol: data.symbol,
      quantity: data.quantity,
      price: data.price,
      status: data.status || 'PENDING',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      executedAt: data.executedAt,
      userId: data.userId,
      notes: data.notes
    });
  }

  // Métodos inmutables para actualizar (retornan nuevas instancias)
  withStatus(status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REJECTED'): InvestmentOrder {
    return new InvestmentOrder({
      ...this,
      status,
      updatedAt: new Date(),
      executedAt: status === 'COMPLETED' ? new Date() : this.executedAt
    });
  }

  withNotes(notes: string): InvestmentOrder {
    return new InvestmentOrder({
      ...this,
      notes,
      updatedAt: new Date()
    });
  }

  // Métodos de cálculo
  getTotalValue(): number {
    return this.quantity * this.price;
  }

  // Verificadores funcionales
  isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  isPending(): boolean {
    return this.status === 'PENDING';
  }

  isCanceled(): boolean {
    return this.status === 'CANCELED';
  }

  isRejected(): boolean {
    return this.status === 'REJECTED';
  }

  // Método para serializar a JSON
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      orderType: this.orderType,
      symbol: this.symbol,
      quantity: this.quantity,
      price: this.price,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      executedAt: this.executedAt,
      userId: this.userId,
      notes: this.notes,
      totalValue: this.getTotalValue()
    };
  }
} 