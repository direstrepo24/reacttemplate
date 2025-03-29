import { useEffect, useState } from 'react';
import { useInvestmentOrder } from '../../application/hooks/useInvestmentOrder';
import { InvestmentOrderEntity } from '../../domain/entities/InvestmentOrderEntity';
import { ButtonBuilder } from '@/components/atoms/Button/ButtonBuilder';
import { Button } from '@/components/atoms/Button/Button';
import { isFeatureEnabled, FeatureFlags } from '@/core/config/featureFlags';
import { cn } from '@/core/utils/cn';
import { useAuthStore } from '@/features/auth/application/authStore';
import { RefreshCcw, Plus } from 'lucide-react';

// Builder para tarjetas de órdenes
class OrderCardBuilder {
  private className = '';
  private order: InvestmentOrderEntity | null = null;
  private onStatusChange: ((id: string, status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REJECTED') => void) | null = null;
  private useNeumorphism = false;

  setOrder(order: InvestmentOrderEntity): OrderCardBuilder {
    this.order = order;
    return this;
  }

  setOnStatusChange(callback: (id: string, status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REJECTED') => void): OrderCardBuilder {
    this.onStatusChange = callback;
    return this;
  }

  setClassName(className: string): OrderCardBuilder {
    this.className = className;
    return this;
  }

  setUseNeumorphism(value: boolean): OrderCardBuilder {
    this.useNeumorphism = value;
    return this;
  }

  build() {
    if (!this.order) {
      throw new Error('Order is required');
    }

    return {
      order: this.order,
      onStatusChange: this.onStatusChange,
      className: this.className,
      useNeumorphism: this.useNeumorphism
    };
  }
}

// Componente funcional puro para la tarjeta de orden
const OrderCard = ({ 
  order, 
  onStatusChange, 
  className,
  useNeumorphism 
}: ReturnType<OrderCardBuilder['build']>) => {
  // Builders para botones de acción
  const completeButton = new ButtonBuilder()
    .setVariant('success')
    .setSize('sm')
    .setChildren('Completar')
    .setDisabled(order.status !== 'PENDING')
    .setNeumorph(useNeumorphism)
    .setOnClick((e) => { onStatusChange?.(order.id, 'COMPLETED'); })
    .build();

  const cancelButton = new ButtonBuilder()
    .setVariant('danger')
    .setSize('sm')
    .setChildren('Cancelar')
    .setDisabled(order.status !== 'PENDING')
    .setNeumorph(useNeumorphism)
    .setOnClick((e) => { onStatusChange?.(order.id, 'CANCELED'); })
    .build();

  // Cálculo de clases condicionales
  const statusColor = order.status === 'COMPLETED' 
    ? 'bg-green-100 text-green-800 border-green-200' 
    : order.status === 'CANCELED' 
      ? 'bg-red-100 text-red-800 border-red-200'
      : order.status === 'REJECTED'
        ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
        : 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <div className={cn(
      'p-4 border rounded-lg transition-all',
      useNeumorphism ? 'shadow-neumorph' : 'shadow-md',
      order.status === 'PENDING' ? 'bg-white' : 'bg-gray-50',
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">
            {order.symbol} - {order.orderType === 'BUY' ? 'Compra' : 'Venta'}
          </h3>
          <p className="text-sm text-gray-600">
            {order.quantity} unidades a ${order.price.toFixed(2)}
          </p>
        </div>
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          statusColor
        )}>
          {order.status === 'PENDING' ? 'Pendiente' : 
           order.status === 'COMPLETED' ? 'Completada' : 
           order.status === 'CANCELED' ? 'Cancelada' : 'Rechazada'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">Valor total: <strong>${(order.quantity * order.price).toFixed(2)}</strong></p>
          <p className="text-xs text-gray-500">
            {order.createdAt.toLocaleString()}
          </p>
        </div>
        
        {order.status === 'PENDING' && (
          <div className="space-x-2">
            <Button {...completeButton} />
            <Button {...cancelButton} />
          </div>
        )}
      </div>
      
      {order.notes && (
        <div className="mt-3 p-2 bg-gray-50 border rounded-md text-sm">
          {order.notes}
        </div>
      )}
    </div>
  );
};

// Componente principal
export const InvestmentOrder = () => {
  const { items, loading, error, fetchItems, updateItem, createItem } = useInvestmentOrder();
  const { user } = useAuthStore();
  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: 1,
    price: 0,
    orderType: 'BUY' as const,
    notes: ''
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Actualización inmutable del estado del formulario
  const updateFormData = (field: string, value: string | number) => {
    setFormData(current => ({
      ...current,
      [field]: value
    }));
  };

  // Manejador funcional para cambio de estado
  const handleStatusChange = async (id: string, status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REJECTED') => {
    try {
      const order = items.find(item => item.id === id);
      if (order) {
        await updateItem(id, { status, updatedAt: new Date() });
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  // Manejador para crear órdenes
  const handleCreateOrder = async () => {
    if (!formData.symbol || formData.quantity <= 0 || formData.price <= 0 || !user?.id) {
      return;
    }

    try {
      await createItem({
        symbol: formData.symbol,
        quantity: formData.quantity,
        price: formData.price,
        orderType: formData.orderType,
        notes: formData.notes || undefined,
        userId: user.id,
        status: 'PENDING'
      });

      // Limpiar el formulario
      setFormData({
        symbol: '',
        quantity: 1,
        price: 0,
        orderType: 'BUY',
        notes: ''
      });
      
      setIsCreating(false);
    } catch (error) {
      console.error('Error al crear orden:', error);
    }
  };

  // Builder para el botón de recargar
  const refreshButton = new ButtonBuilder()
    .setVariant('secondary')
    .setSize('sm')
    .setLeftIcon(<RefreshCcw className="w-4 h-4" />)
    .setChildren('Recargar')
    .setOnClick((e) => { fetchItems(); })
    .setNeumorph(useNeumorphism)
    .build();

  // Builder para el botón de nueva orden
  const newOrderButton = new ButtonBuilder()
    .setVariant('primary')
    .setSize('sm')
    .setLeftIcon(<Plus className="w-4 h-4" />)
    .setChildren('Nueva Orden')
    .setOnClick((e) => { setIsCreating(true); })
    .setNeumorph(useNeumorphism)
    .build();

  // Builder para el botón de guardar
  const saveOrderButton = new ButtonBuilder()
    .setVariant('success')
    .setSize('md')
    .setChildren('Guardar Orden')
    .setDisabled(!formData.symbol || formData.quantity <= 0 || formData.price <= 0)
    .setOnClick(handleCreateOrder)
    .setNeumorph(useNeumorphism)
    .build();

  // Builder para el botón de cancelar
  const cancelOrderButton = new ButtonBuilder()
    .setVariant('secondary')
    .setSize('md')
    .setChildren('Cancelar')
    .setOnClick((e) => { setIsCreating(false); })
    .setNeumorph(useNeumorphism)
    .build();

  if (loading && items.length === 0) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-800 p-4 rounded-lg">Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className={cn(
        'flex justify-between items-center mb-6 p-4 bg-white rounded-lg',
        useNeumorphism && 'shadow-neumorph'
      )}>
        <h1 className="text-2xl font-bold">Órdenes de Inversión</h1>
        <div className="flex space-x-2">
          <Button {...refreshButton} />
          {!isCreating && <Button {...newOrderButton} />}
        </div>
      </div>

      {/* Formulario de creación */}
      {isCreating && (
        <div className={cn(
          'mb-6 p-4 bg-white rounded-lg border',
          useNeumorphism && 'shadow-neumorph'
        )}>
          <h2 className="text-xl font-semibold mb-4">Nueva Orden</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Símbolo</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.symbol}
                onChange={(e) => updateFormData('symbol', e.target.value)}
                placeholder="Ej: AAPL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.orderType}
                onChange={(e) => updateFormData('orderType', e.target.value)}
              >
                <option value="BUY">Compra</option>
                <option value="SELL">Venta</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.quantity}
                onChange={(e) => updateFormData('quantity', parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.price}
                onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Notas adicionales (opcional)"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button {...cancelOrderButton} />
            <Button {...saveOrderButton} />
          </div>
        </div>
      )}

      {/* Lista de órdenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No hay órdenes. Crea una nueva orden para comenzar.
          </div>
        ) : (
          items.map(order => {
            // Uso del builder para cada tarjeta
            const cardProps = new OrderCardBuilder()
              .setOrder(order)
              .setOnStatusChange(handleStatusChange)
              .setUseNeumorphism(useNeumorphism)
              .build();
              
            return <OrderCard key={order.id} {...cardProps} />;
          })
        )}
      </div>
    </div>
  );
}; 