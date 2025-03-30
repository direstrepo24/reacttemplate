# React Functional Template

Plantilla para desarrollo de aplicaciones React siguiendo principios funcionales, arquitectura por features, y diseño atómico con soporte para neumorfismo.

## Arquitectura Implementada

### 1. Programación Funcional y Patrón Builder

- **Componentes Puros**: Todos los componentes están implementados como funciones puras, minimizando efectos secundarios.
- **Patrón Builder**: Implementado para la creación de componentes complejos como botones.
- **Inmutabilidad**: Todas las operaciones de estado utilizan patrones inmutables, sobre todo en los casos de uso como el de ToDo.
- **Composición de Funciones**: Los sistemas de utilidades están diseñados para ser componibles.

### 2. Desacoplamiento de Lógica de Negocio y UI

- **Patrón Container/Presentational**: Clara separación entre componentes de presentación y lógica.
- **Custom Hooks**: La lógica de negocio está encapsulada en hooks personalizados como `useTodoState`.
- **Entidades Inmutables**: El dominio define entidades inmutables (`TodoEntity`) y operaciones puras.
- **Adaptadores y Repos**: La comunicación con APIs externas se realiza a través de adaptadores y repositorios.

### 3. Diseño con Tailwind 4

- **Variables Globales y Tokens**: Sistema completo de tokens de diseño en CSS variables y Tailwind.
- **Clases Utilitarias**: Uso extensivo de clases utilitarias para estilos.
- **Temas**: Soporte para tema claro/oscuro y variante neumórfica.
- **Responsividad**: Todos los componentes se adaptan a diferentes tamaños de pantalla.

### 4. Neumorfismo con Diseño Atómico

- **Sistema de Diseño Atómico**: Componentes organizados según la metodología de diseño atómico:
  - **Átomos**: Button, Input, etc.
  - **Moléculas**: NavigationMenu, FormField, etc.
  - **Organismos**: TodoList, etc.
  - **Plantillas**: MainLayout, AuthLayout, etc.
- **Clases Neumórficas**: Conjunto de clases para estilo neumórfico que se puede activar/desactivar.

### 5. Librerías Headless Ligeras

- **Integración Headless**: Componentes sin estilos predefinidos para máxima personalización.
- **Accesibilidad**: Todos los componentes cumplen con estándares WCAG.

### 6. Arquitectura "Feature Slice" con Feature Flags

- **Organización por Features**: Estructura de carpetas organizada verticalmente por características:
  ```
  src/
    core/         # Núcleo de la aplicación
    features/     # Funcionalidades organizadas verticalmente
      auth/       # Feature de autenticación
        domain/   # Entidades y lógica de dominio
        application/ # Casos de uso y estado
        presentation/ # Componentes de UI
      todo/       # Feature de gestión de tareas
        domain/
        application/
        presentation/
    components/   # Componentes compartidos (sistema de diseño)
      atoms/
      molecules/
      organisms/
    utils/        # Utilidades generales
  ```
- **Sistema de Feature Flags**: Implementación robusta para habilitar/deshabilitar funcionalidades.
- **Activación en Tiempo Real**: Cambios dinámicos con notificación vía patrón observer.

### 7. Separación de la Capa de Presentación

- **Interfaces Abstractas**: Los repositorios y servicios se definen como interfaces.
- **Inversión de Dependencias**: Los casos de uso dependen de abstracciones, no de implementaciones concretas.
- **Fachadas**: Cada feature expone una API pública a través de hooks.

## Componentes Implementados

- **Botón**: Componente atómico con patrón Builder y soporte para distintas variantes y neumorfismo.
- **NavigationMenu**: Menú de navegación adaptable con soporte para feature flags.
- **ToDo**: Sistema completo de gestión de tareas con arquitectura limpia y enfoques funcionales.

## Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Arquitectura - requerimientos.

1. Paradigma de programación funcional con patrón Builder, funciones puras, fácil de testear cada componente, totalmente desacoplado de la interfaz
2. Interfaz que desacople lógica de negocio con lógica de comportamiento, componentes testeables
3. Diseño tailwind 4 con configuración de variables globales *como lo hace  SCSS variables o mixings, pero usando mejor Tailwind config para definir nuestros theme, colors y otras design tokens. y
4. Neumorphismo, fácil de extender y configurar, rehusando componentes atómicos, es decir sistema de diseño atómico 
5. Librerías de react headless livianas con alto perfomance, con shadcn y tanstack tables, en una carpeta dentro de "core" llamada "shared"
6. Separación de responsabilidades con arquitectura "vertical slice" o "feature slice" 
7.  Patron "Feature flags" para activar y desactivar características del menú a través de un panel de admin. Este feature flags puede ser un json simulando que consultamos desde un token jwt el claims para autorización y controlar que puede ver o no el usuario, pero también puede desde el panel activar o desactivar
8. El modulo de ejemplo puede ser un modulo para crear ordenes de inversión de compra y venta
9. La capa de presentación la colocas de ultima pensando en que en algún momento pueda usar otro framework para la capa de presentación
10. El sistema debe permitir crear un nuevo modulo que se inserte en el menú o submenú, usando react router y activarse o desactivarse en el panel administrativo
11. El tsconfig y el vite config debe tener path a cada "feature", componente o función de manera limpia, ejemplo: "paths": {  "@/*": ["./src/*"],   "@components/*": ["src/components/*"],   "@core/*": ["src/core/*"],      "@features/*": ["src/features/*"],     "@hooks/*": ["src/hooks/*"],     "@layouts/*": ["src/layouts/*"],      "@pages/*": ["src/pages/*"],"@utils/*": ["src/utils/*"]    }
12. Debe ser facilmente testeable, si no es facilmente testable no es mantanible, no está bien la arquitectura
13. Se debe poder crear nuevo modulos de manera fácil, incluso con algún comando y que automáticamente queden en el menú o submenú según se requiera.

## Guía de Desarrollo y Extensión

### 1. Creación de Nuevas Características en el Frontend

#### 1.1 Estructura de Carpetas para una Nueva Feature

Para añadir una nueva característica, sigue esta estructura:

```
src/features/nueva-feature/
  ├── domain/                # Lógica de dominio
  │   ├── entities/         # Definición de entidades
  │   ├── repositories/     # Interfaces de repositorios
  │   └── use-cases/        # Lógica de negocio pura
  ├── application/          # Casos de uso y estado
  │   ├── hooks/            # Custom hooks
  │   └── stores/           # Estado global (Zustand)
  └── presentation/         # Componentes UI
      ├── components/       # Componentes específicos
      └── pages/            # Páginas de la feature
```

#### 1.2 Paso a Paso para Crear una Nueva Feature

1. **Crear la estructura de carpetas**:
   ```bash
   npm run generate feature -- --name nueva-feature
   ```

2. **Definir entidades y repositorios**:
   ```typescript
   // domain/entities/NuevaEntidad.ts
   export interface NuevaEntidad {
     id: string;
     // Otros campos
   }
   
   // domain/repositories/NuevaEntidadRepository.ts
   export interface NuevaEntidadRepository {
     getAll(): Promise<NuevaEntidad[]>;
     getById(id: string): Promise<NuevaEntidad | null>;
     // Otros métodos
   }
   ```

3. **Implementar hooks y lógica de aplicación**:
   ```typescript
   // application/hooks/useNuevaFeature.ts
   import { useState, useCallback } from 'react';
   import { NuevaEntidad } from '../../domain/entities/NuevaEntidad';
   import { mockRepository } from '../../domain/repositories/NuevaEntidadRepository';

   export const useNuevaFeature = () => {
     const [items, setItems] = useState<NuevaEntidad[]>([]);
     const [loading, setLoading] = useState(false);

     const fetchItems = useCallback(async () => {
       setLoading(true);
       try {
         const result = await mockRepository.getAll();
         setItems(result);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }, []);

     return { items, loading, fetchItems };
   };
   ```

4. **Crear componentes de presentación**:
   ```tsx
   // presentation/pages/NuevaFeaturePage.tsx
   import { useEffect } from 'react';
   import { useNuevaFeature } from '../../application/hooks/useNuevaFeature';
   import { useModuleFeatures } from '@/hooks/useModuleFeatures';

   const NuevaFeaturePage = () => {
     const { items, loading, fetchItems } = useNuevaFeature();
     const { features } = useModuleFeatures();

     useEffect(() => {
       fetchItems();
     }, [fetchItems]);

     return (
       <div className={`p-6 ${features.neumorphism ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'} rounded-lg`}>
         <h1 className="text-2xl font-bold mb-4">Nueva Característica</h1>
         {loading ? (
           <p>Cargando...</p>
         ) : (
           <ul>
             {items.map(item => (
               <li key={item.id}>{/* Renderizar item */}</li>
             ))}
           </ul>
         )}
       </div>
     );
   };

   export default NuevaFeaturePage;
   ```

5. **Añadir al menú y rutas**:

   Agregar la ruta en `src/core/router/routes.ts`:
   ```typescript
   import NuevaFeaturePage from '@/features/nueva-feature/presentation/pages/NuevaFeaturePage';

   export const routes = [
     // Rutas existentes
     {
       path: '/nueva-feature',
       element: <NuevaFeaturePage />,
       requiredAuth: true,
     },
   ];
   ```

   Añadir la entrada del menú en `src/core/config/menuConfig.tsx`:
   ```typescript
   import { FeatureFlags } from '@/core/types';
   
   export const menuItems: MenuItem[] = [
     // Items existentes
     {
       label: 'Nueva Característica',
       path: '/nueva-feature',
       icon: <SomeIcon />,
       featureFlag: FeatureFlags.NUEVA_FEATURE,
     },
   ];
   ```

6. **Registrar el feature flag**:

   Añadir en `src/core/types.ts`:
   ```typescript
   export enum FeatureFlags {
     // Flags existentes
     NUEVA_FEATURE = 'NUEVA_FEATURE',
   }
   ```

   Activar en `src/hooks/useModuleFeatures.ts`:
   ```typescript
   const defaultFeatures: ModuleFeatures = {
     // Features existentes
     [FeatureFlags.NUEVA_FEATURE]: true,
   };
   ```

### 2. Extensión del Backend (Cloudflare Workers)

#### 2.1 Agregar un Nuevo Endpoint al API

1. **Modificar el archivo principal del Worker**:

```typescript
// workers-api/src/index.ts

// Añadir un nuevo endpoint
if (path === '/api/nueva-feature' && request.method === 'GET') {
  return new Response(JSON.stringify({
    success: true,
    data: [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ]
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
```

2. **Estructurar la lógica en módulos separados para mejor organización**:

```typescript
// workers-api/src/handlers/nuevaFeature.ts
import { corsHeaders } from '../utils/cors';

export function handleNuevaFeature(request: Request) {
  const data = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' }
  ];
  
  return new Response(JSON.stringify({
    success: true,
    data
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Luego importar y usar en index.ts
import { handleNuevaFeature } from './handlers/nuevaFeature';

// En la función fetch
if (path === '/api/nueva-feature' && request.method === 'GET') {
  return handleNuevaFeature(request);
}
```

3. **Desplegar los cambios**:

```bash
# Construir y desplegar
npm run build:worker
npm run deploy:worker

# O en un solo comando
npm run deploy:all
```

### 3. Sistema de Diseño Atómico y Tailwind CSS

#### 3.1 Uso de Componentes Atómicos

Los componentes atómicos son la base del sistema de diseño:

```tsx
// Crear un botón usando el patrón Builder
const myButton = new ButtonBuilder()
  .setVariant('primary')
  .setSize('md')
  .setNeumorph(true)
  .setChildren('Mi Botón')
  .build();

// Usar en un componente
return <Button {...myButton} />;

// O usar directamente
return (
  <Button 
    variant="primary" 
    size="md" 
    neumorph={true}
  >
    Mi Botón
  </Button>
);
```

#### 3.2 Creación de Nuevos Componentes Atómicos

1. **Estructura recomendada**:

```
src/components/atoms/NuevoComponente/
  ├── NuevoComponente.tsx     # Implementación
  ├── NuevoComponente.types.ts # Tipos
  ├── NuevoComponente.test.tsx # Tests
  └── index.ts                # Export
```

2. **Implementación con Tailwind**:

```typescript
// NuevoComponente.types.ts
export interface NuevoComponenteProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  neumorph?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

```tsx
// NuevoComponente.tsx
import React from 'react';
import { NuevoComponenteProps } from './NuevoComponente.types';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { cn } from '@/utils/cn';

export const NuevoComponente: React.FC<NuevoComponenteProps> = ({
  variant = 'primary',
  size = 'md',
  neumorph,
  className = '',
  children,
  ...props
}) => {
  const { features } = useModuleFeatures();
  const isNeumorph = neumorph ?? features.neumorphism;

  // Estilos base con Tailwind
  const baseStyles = 'rounded-md transition-all duration-200';
  
  // Estilos por variante
  const variantStyles = {
    primary: isNeumorph 
      ? 'nuevo-neumorph-primary' 
      : 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: isNeumorph 
      ? 'nuevo-neumorph-secondary' 
      : 'bg-secondary-500 text-white hover:bg-secondary-600',
  };
  
  // Estilos por tamaño
  const sizeStyles = {
    sm: 'text-sm p-2',
    md: 'text-base p-3',
    lg: 'text-lg p-4',
  };
  
  // Combinar clases con utility
  const componentClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <div className={componentClasses} {...props}>
      {children}
    </div>
  );
};
```

```typescript
// index.ts
export * from './NuevoComponente';
```

3. **Implementación del Patrón Builder para el componente**:

```typescript
// NuevoComponenteBuilder.ts
import { NuevoComponenteProps } from './NuevoComponente.types';

export class NuevoComponenteBuilder {
  private props: Partial<NuevoComponenteProps> = {};

  setVariant(variant: NuevoComponenteProps['variant']) {
    this.props.variant = variant;
    return this;
  }

  setSize(size: NuevoComponenteProps['size']) {
    this.props.size = size;
    return this;
  }

  setNeumorph(neumorph: boolean) {
    this.props.neumorph = neumorph;
    return this;
  }

  setChildren(children: React.ReactNode) {
    this.props.children = children;
    return this;
  }

  setClassName(className: string) {
    this.props.className = className;
    return this;
  }

  build(): NuevoComponenteProps {
    if (!this.props.children) {
      throw new Error('Component must have children');
    }
    return this.props as NuevoComponenteProps;
  }
}
```

#### 3.3 Estilos Neumórficos con Tailwind

El proyecto incluye extensiones de Tailwind para soportar el estilo neumórfico:

1. **Configuración en tailwind.config.js**:
```js
module.exports = {
  // Otras configuraciones
  theme: {
    extend: {
      boxShadow: {
        'neumorph-light': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neumorph-dark': '5px 5px 10px #202425, -5px -5px 10px #2c3032',
        'neumorph-inset-light': 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
        'neumorph-inset-dark': 'inset 2px 2px 5px #202425, inset -2px -2px 5px #2c3032',
      },
    },
  },
};
```

2. **Uso en los componentes**:
```tsx
<div className={`${
  isNeumorph 
    ? 'bg-gray-100 dark:bg-gray-800 shadow-neumorph-light dark:shadow-neumorph-dark' 
    : 'bg-white dark:bg-gray-700 shadow-md'
} rounded-xl p-4`}>
  {children}
</div>
```

3. **Clases utilitarias para neumorfismo**:
```css
/* src/styles/neumorphism.css */
.btn-neumorph-primary {
  @apply bg-gray-100 dark:bg-gray-800 text-primary-500 dark:text-primary-400 shadow-neumorph-light dark:shadow-neumorph-dark;
}

.btn-neumorph-primary:active {
  @apply shadow-neumorph-inset-light dark:shadow-neumorph-inset-dark;
}

/* Y otras variantes... */
```

#### 3.4 Creación de Moléculas y Organismos

Las moléculas combinan átomos para crear componentes más complejos:

```tsx
// src/components/molecules/FormField/FormField.tsx
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';

export const FormField = ({ label, name, error, ...inputProps }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...inputProps} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
```

Los organismos combinan moléculas y átomos:

```tsx
// src/components/organisms/InvestmentOrderForm/InvestmentOrderForm.tsx
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { useForm } from 'react-hook-form';

export const InvestmentOrderForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Símbolo"
        name="symbol"
        register={register('symbol', { required: 'Este campo es obligatorio' })}
        error={errors.symbol?.message}
      />
      
      <FormField
        label="Cantidad"
        name="quantity"
        type="number"
        register={register('quantity', { required: 'Este campo es obligatorio' })}
        error={errors.quantity?.message}
      />
      
      <div className="flex justify-end">
        <Button variant="primary" type="submit">Crear Orden</Button>
      </div>
    </form>
  );
};
```

### 4. Integración Frontend-Backend

#### 4.1 Consumir API desde el Frontend

1. **Crear adaptador para la API**:

```typescript
// src/features/investment-order/domain/repositories/InvestmentOrderApiAdapter.ts
import { InvestmentOrderEntity } from '../entities/InvestmentOrderEntity';
import { InvestmentOrderRepository } from './InvestmentOrderRepository';

const API_URL = 'https://reacttemplate-api.themakersdev.workers.dev';

export class InvestmentOrderApiAdapter implements InvestmentOrderRepository {
  async getAll(): Promise<InvestmentOrderEntity[]> {
    const response = await fetch(`${API_URL}/api/investment-orders`);
    if (!response.ok) {
      throw new Error('Error al obtener las órdenes');
    }
    const data = await response.json();
    return data.data;
  }

  async getById(id: string): Promise<InvestmentOrderEntity | null> {
    const response = await fetch(`${API_URL}/api/investment-orders/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al obtener la orden');
    }
    const data = await response.json();
    return data.data;
  }

  // Implementar otros métodos...
}
```

2. **Usar el adaptador en el hook**:

```typescript
// src/features/investment-order/application/hooks/useInvestmentOrder.ts
import { useCallback, useState } from 'react';
import { InvestmentOrderEntity } from '../../domain/entities/InvestmentOrderEntity';
import { InvestmentOrderApiAdapter } from '../../domain/repositories/InvestmentOrderApiAdapter';

const repository = new InvestmentOrderApiAdapter();

export const useInvestmentOrder = () => {
  const [orders, setOrders] = useState<InvestmentOrderEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repository.getAll();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Implementar otros métodos

  return {
    orders,
    loading,
    error,
    fetchOrders,
  };
};
```

### 5. Deploy y CI/CD

El proyecto utiliza GitHub Actions para implementar un flujo de CI/CD que despliega automáticamente a Cloudflare Pages y Workers:

1. **Frontend**:
   - El frontend se despliega a Cloudflare Pages en: https://reacttemplate.pages.dev

2. **Backend (API)**:
   - El backend se despliega como Worker en: https://reacttemplate-api.themakersdev.workers.dev
   - Endpoints disponibles:
     - `/api/investment-orders`: Lista todas las órdenes
     - `/api/investment-orders/{id}`: Obtiene una orden específica

3. **Proceso de despliegue**:
   - Cada push a la rama `main` activa el workflow
   - El proceso incluye:
     - Instalación de dependencias
     - Construcción del frontend y API
     - Despliegue a Cloudflare

4. **Personalización**:
   Para modificar el proceso de despliegue, edita el archivo `.github/workflows/deploy.yml`.

## Mejores Prácticas de Desarrollo

1. **Tests**:
   ```bash
   # Ejecutar tests unitarios
   npm run test
   
   # Ejecutar tests con cobertura
   npm run test:coverage
   
   # Ejecutar tests e2e
   npm run e2e
   ```

2. **Generadores**:
   ```bash
   # Generar un nuevo componente
   npm run generate component -- --name MiComponente
   
   # Generar una nueva feature
   npm run generate feature -- --name mi-feature
   ```

3. **Linting**:
   ```bash
   # Verificar estilo de código
   npm run lint
   ```

El proyecto sigue la metodología de Trunk Based Development, por lo que se recomienda:
- Realizar cambios pequeños y frecuentes
- Utilizar feature flags para controlar funcionalidades en desarrollo
- Asegurar que cada commit a `main` mantenga el código en estado deployable
