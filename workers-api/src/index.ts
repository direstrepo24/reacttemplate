import { Env } from './types';

// Datos de ejemplo para órdenes de inversión
const sampleOrders = [
  {
    id: '1',
    symbol: 'AAPL',
    quantity: 10,
    price: 185.92,
    orderType: 'BUY',
    status: 'COMPLETED',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T10:35:00Z',
    notes: 'Compra estratégica para cartera de largo plazo',
    userId: 'user123'
  },
  {
    id: '2',
    symbol: 'MSFT',
    quantity: 5,
    price: 420.45,
    orderType: 'BUY',
    status: 'PENDING',
    createdAt: '2023-06-16T14:20:00Z',
    updatedAt: null,
    notes: null,
    userId: 'user123'
  },
  {
    id: '3',
    symbol: 'TSLA',
    quantity: 3,
    price: 177.50,
    orderType: 'SELL',
    status: 'CANCELLED',
    createdAt: '2023-06-14T09:15:00Z',
    updatedAt: '2023-06-14T11:20:00Z',
    notes: 'Venta cancelada por volatilidad del mercado',
    userId: 'user456'
  }
];

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Manejador para responder a las solicitudes OPTIONS (preflight)
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}

// Función principal para manejar todas las solicitudes
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Manejo de solicitudes preflight CORS
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }
    
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Endpoint para obtener todas las órdenes
    if (path === '/api/investment-orders' && request.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        data: sampleOrders
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Endpoint para obtener una orden específica
    if (path.match(/^\/api\/investment-orders\/\w+$/) && request.method === 'GET') {
      const orderId = path.split('/').pop();
      const order = sampleOrders.find(o => o.id === orderId);
      
      if (order) {
        return new Response(JSON.stringify({
          success: true,
          data: order
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } else {
        return new Response(JSON.stringify({
          success: false,
          error: 'Orden no encontrada'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
    
    // Si no coincide ninguna ruta, devolver 404
    return new Response(JSON.stringify({
      success: false,
      error: 'Endpoint no encontrado'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}; 