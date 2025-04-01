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

## Arquitectura de Seguridad

La implementación de seguridad en la aplicación sigue la filosofía de diseño del resto del proyecto: modular, basada en interfaces abstraídas, y siguiendo patrones funcionales.

### 1. Autenticación y Autorización

#### 1.1 Integración con Cloudflare Access (Zero Trust)

La primera capa de seguridad utiliza Cloudflare Access para implementar un modelo Zero Trust:

```
┌────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Usuario      │────▶│  Cloudflare      │────▶│  Aplicación │
│                │     │  Access + JWT    │     │             │
└────────────────┘     └──────────────────┘     └─────────────┘
```

1. **Configuración de Cloudflare Access**:
   - Crear aplicación en el panel Zero Trust de Cloudflare
   - Configurar dominios: `reacttemplate.pages.dev` y `api.reacttemplate.pages.dev`
   - Definir políticas basadas en:
     - Dirección de correo
     - Dominios de correo permitidos
     - Factores de autenticación adicionales

2. **Verificación de JWT en Workers**:
   ```typescript
   // workers-api/src/middleware/authMiddleware.ts
   
   export async function verifyAuth(request: Request, env: Env) {
     const token = request.headers.get('CF-Access-JWT-Assertion');
     
     if (!token) {
       return new Response(JSON.stringify({
         success: false,
         error: 'No autorizado'
       }), {
         status: 401,
         headers: {
           'Content-Type': 'application/json',
           ...corsHeaders
         }
       });
     }
     
     try {
       // Verificar con clave pública de Cloudflare Access
       const payload = await verifyCloudflareToken(token, env.CF_TEAM_DOMAIN);
       
       // Adjuntar usuario al request
       request.user = extractUserFromPayload(payload);
       
       return null; // Continuar con la request
     } catch (error) {
       return new Response(JSON.stringify({
         success: false,
         error: 'Token inválido'
       }), {
         status: 403,
         headers: {
           'Content-Type': 'application/json',
           ...corsHeaders
         }
       });
     }
   }
   ```

#### 1.2 Sistema de Roles y Permisos

Implementación siguiendo la arquitectura por features y principios funcionales:

```
src/features/auth/
  ├── domain/                   # Lógica de dominio para autenticación
  │   ├── entities/            
  │   │   └── User.ts           # Define el modelo de usuario con roles
  │   ├── repositories/        
  │   │   └── AuthRepository.ts # Interfaz para auth
  │   └── value-objects/       
  │       └── Permission.ts     # Value objects para permisos
  ├── application/             
  │   ├── hooks/               
  │   │   ├── useAuth.ts        # Hook principal de autenticación
  │   │   └── usePermissions.ts # Verificación de permisos
  │   └── services/            
  │       └── TokenService.ts   # Manejo de tokens JWT
  └── presentation/            
      ├── components/          
      │   └── ProtectedRoute.tsx # Componente para rutas protegidas
      └── pages/               
          └── Login.tsx          # Página de inicio de sesión
```

1. **Definición de Modelos**:
   ```typescript
   // domain/entities/User.ts
   export enum UserRole {
     ADMIN = 'admin',
     MANAGER = 'manager',
     USER = 'user'
   }
   
   export interface User {
     id: string;
     email: string;
     roles: UserRole[];
     permissions: string[];
   }
   
   // domain/value-objects/Permission.ts
   export class Permission {
     constructor(
       public readonly resource: string,
       public readonly action: 'read' | 'write' | 'delete' | 'admin'
     ) {}
     
     static fromString(permissionString: string): Permission {
       const [resource, action] = permissionString.split(':');
       return new Permission(
         resource, 
         action as 'read' | 'write' | 'delete' | 'admin'
       );
     }
     
     toString(): string {
       return `${this.resource}:${this.action}`;
     }
     
     // Métodos puros para comparación
     isReadPermission(): boolean {
       return this.action === 'read';
     }
     
     matches(other: Permission): boolean {
       return this.resource === other.resource && 
              (this.action === other.action || this.action === 'admin');
     }
   }
   ```

2. **Hooks de Autenticación Funcionales**:
   ```typescript
   // application/hooks/useAuth.ts
   import { useState, useEffect, useCallback } from 'react';
   import { User } from '../../domain/entities/User';
   import { tokenService } from '../services/TokenService';
   
   export const useAuth = () => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     
     // Cargar usuario inicial
     useEffect(() => {
       const initAuth = async () => {
         try {
           // Obtener token de Cloudflare Access
           const token = await tokenService.getToken();
           if (token) {
             const userData = tokenService.parseToken(token);
             setUser(userData);
           }
         } finally {
           setLoading(false);
         }
       };
       
       initAuth();
     }, []);
     
     // Verificar si el usuario tiene un rol específico
     const hasRole = useCallback((role: UserRole): boolean => {
       return user?.roles.includes(role) || false;
     }, [user]);
     
     // Verificar si el usuario tiene un permiso específico
     const hasPermission = useCallback((permissionString: string): boolean => {
       if (!user) return false;
       
       const requestedPermission = Permission.fromString(permissionString);
       
       return user.permissions.some(p => {
         const userPermission = Permission.fromString(p);
         return userPermission.matches(requestedPermission);
       });
     }, [user]);
     
     return {
       user,
       loading,
       hasRole,
       hasPermission,
       isAuthenticated: !!user
     };
   };
   ```

3. **Componente de Ruta Protegida**:
   ```tsx
   // presentation/components/ProtectedRoute.tsx
   import { Navigate, Outlet } from 'react-router-dom';
   import { useAuth } from '../../application/hooks/useAuth';
   
   interface ProtectedRouteProps {
     requiredPermission?: string;
     requiredRole?: UserRole;
   }
   
   export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
     requiredPermission,
     requiredRole
   }) => {
     const { user, loading, hasPermission, hasRole } = useAuth();
     
     if (loading) {
       return <LoadingScreen />;
     }
     
     if (!user) {
       return <Navigate to="/login" replace />;
     }
     
     if (requiredRole && !hasRole(requiredRole)) {
       return <Navigate to="/unauthorized" replace />;
     }
     
     if (requiredPermission && !hasPermission(requiredPermission)) {
       return <Navigate to="/unauthorized" replace />;
     }
     
     return <Outlet />;
   };
   ```

### 2. Integración con Feature Flags

El sistema de seguridad se integra con el mecanismo existente de Feature Flags, permitiendo controlar acceso basado en roles:

```typescript
// core/router/FeatureProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { useAuth } from '@/features/auth/application/hooks/useAuth';
import { FeatureFlags } from '@/core/types';

interface FeatureProtectedRouteProps {
  featureFlag: FeatureFlags;
  requiredRole?: UserRole;
}

export const FeatureProtectedRoute: React.FC<FeatureProtectedRouteProps> = ({
  featureFlag,
  requiredRole
}) => {
  const { features } = useModuleFeatures();
  const { hasRole, isAuthenticated } = useAuth();
  
  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar rol si se requiere
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Verificar feature flag
  if (!features.has(featureFlag)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};
```

### 3. Implementación Backend en Cloudflare Workers

En el backend, el sistema de seguridad se implementa como middleware:

```typescript
// workers-api/src/index.ts
import { authMiddleware } from './middleware/authMiddleware';
import { corsMiddleware } from './middleware/corsMiddleware';
import { handleInvestmentOrders } from './handlers/investmentOrders';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Middleware CORS para preflight
    const corsResponse = corsMiddleware(request);
    if (corsResponse) return corsResponse;
    
    // Middleware de autenticación
    const authResponse = await authMiddleware(request, env);
    if (authResponse) return authResponse;
    
    // Obtener ruta solicitada
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Rutas protegidas
    if (path.startsWith('/api/investment-orders')) {
      return handleInvestmentOrders(request, env, request.user);
    }
    
    // Ruta no encontrada
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
```

### 4. Almacenamiento Seguro de Sesión

Para almacenar credenciales, se utiliza una implementación funcional y segura:

```typescript
// application/services/SessionStorage.ts
import { z } from 'zod';

// Esquema para validar datos
const SessionSchema = z.object({
  token: z.string(),
  expiresAt: z.number()
});

type Session = z.infer<typeof SessionSchema>;

export const SessionStorage = {
  // Guardar sesión de forma segura
  save: (token: string, expiresIn: number): void => {
    const expiresAt = Date.now() + expiresIn * 1000;
    const session: Session = { token, expiresAt };
    
    // Almacenar en localStorage de forma segura
    try {
      localStorage.setItem('session', JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  },
  
  // Obtener sesión con validación
  get: (): Session | null => {
    try {
      const data = localStorage.getItem('session');
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      const result = SessionSchema.safeParse(parsed);
      
      if (!result.success) {
        // Datos inválidos, eliminar sesión
        SessionStorage.clear();
        return null;
      }
      
      // Verificar expiración
      if (result.data.expiresAt < Date.now()) {
        SessionStorage.clear();
        return null;
      }
      
      return result.data;
    } catch {
      SessionStorage.clear();
      return null;
    }
  },
  
  // Eliminar sesión
  clear: (): void => {
    localStorage.removeItem('session');
  }
};
```

### 5. Guía de Implementación

#### 5.1 Integración con Cloudflare Access

1. **Crear aplicación en Cloudflare Zero Trust**:
   - Acceder a [Cloudflare Zero Trust Dashboard](https://dash.teams.cloudflare.com/)
   - Crear aplicación de tipo "Self-hosted"
   - Configurar dominio: `reacttemplate.pages.dev`
   - Establecer políticas de acceso (por dominio, email, etc.)

2. **Obtener información de configuración**:
   - Team Domain (AUD): `https://[your-team-name].cloudflareaccess.com`
   - Auth Domain: `https://[your-team-name].cloudflareaccess.com`

3. **Variables de Entorno para Workers**:
   ```
   # Para Cloudflare Workers
   CF_TEAM_DOMAIN=https://[your-team-name].cloudflareaccess.com
   CF_CLIENT_ID=[client-id-from-dashboard]
   CF_CLIENT_SECRET=[client-secret-from-dashboard]
   ```

#### 5.2 Implementación de Autenticación en Frontend

1. **Instalar dependencias**:
   ```bash
   npm install jose react-router-dom@latest zod
   ```

2. **Crear Feature de Autenticación**:
   ```bash
   npm run generate feature -- --name auth
   ```

3. **Generar componentes de auth**:
   ```bash
   npm run generate component -- --name ProtectedRoute --path src/features/auth/presentation/components
   ```

4. **Actualizar rutas para usar protección**:
   ```tsx
   // src/core/router/routes.tsx
   import { ProtectedRoute } from '@/features/auth/presentation/components/ProtectedRoute';
   
   export const routes = [
     {
       path: '/',
       element: <PublicLayout />,
       children: [
         { path: '/', element: <HomePage /> },
         { path: '/login', element: <LoginPage /> },
       ],
     },
     {
       path: '/app',
       element: <ProtectedRoute />,
       children: [
         {
           path: '',
           element: <AppLayout />,
           children: [
             { path: 'dashboard', element: <Dashboard /> },
             { 
               path: 'investment-orders', 
               element: <ProtectedRoute requiredPermission="investment-orders:read" />,
               children: [
                 { path: '', element: <InvestmentOrderList /> },
                 { path: ':id', element: <InvestmentOrderDetail /> },
               ] 
             },
             // Más rutas protegidas...
           ],
         },
       ],
     },
   ];
   ```

#### 5.3 Integración de JWT en Workers API

1. **Instalar dependencias en Workers**:
   ```bash
   cd workers-api
   npm install @tsndr/cloudflare-worker-jwt
   ```

2. **Implementar middleware de autenticación**:
   ```bash
   mkdir -p workers-api/src/middleware
   touch workers-api/src/middleware/authMiddleware.ts
   ```

3. **Integrar verificación en API**:
   ```typescript
   // Modificar index.ts para usar el middleware de auth
   import { authMiddleware } from './middleware/authMiddleware';
   // resto del código...
   ```

#### 5.4 Integración con Feature Flags Existente

1. **Extender el sistema para considerar roles**:
   ```typescript
   // hooks/useRoleBasedFeatures.ts
   import { useModuleFeatures } from './useModuleFeatures';
   import { useAuth } from '@/features/auth/application/hooks/useAuth';
   import { UserRole } from '@/features/auth/domain/entities/User';
   
   // Mapa de features restringidas por rol
   const ROLE_RESTRICTED_FEATURES = {
     [FeatureFlags.ADMIN_MODULE]: [UserRole.ADMIN],
     [FeatureFlags.INVESTMENT_ORDER]: [UserRole.ADMIN, UserRole.MANAGER],
     // Otras restricciones...
   };
   
   export const useRoleBasedFeatures = () => {
     const { features, setFeature } = useModuleFeatures();
     const { hasRole } = useAuth();
     
     // Filtrar features basado en roles
     const accessibleFeatures = Object.entries(features).reduce(
       (acc, [key, value]) => {
         const featureKey = key as FeatureFlags;
         const requiredRoles = ROLE_RESTRICTED_FEATURES[featureKey];
         
         // Si no hay restricción de rol, mantener el valor actual
         if (!requiredRoles) {
           acc[featureKey] = value;
           return acc;
         }
         
         // Si hay restricción, verificar si tiene alguno de los roles requeridos
         acc[featureKey] = value && requiredRoles.some(role => hasRole(role));
         return acc;
       },
       {} as Record<FeatureFlags, boolean>
     );
     
     return {
       features: accessibleFeatures,
       setFeature
     };
   };
   ```

### 6. Consideraciones Adicionales

1. **CORS y Seguridad**:
   - Configurar CORS adecuadamente en Workers API
   - Implementar protección contra CSRF
   - Usar HTTPS para todas las comunicaciones

2. **Rate Limiting**:
   - Implementar limitación de solicitudes en Workers
   - Prevenir ataques de fuerza bruta

3. **Auditoría y Logging**:
   - Registrar acciones críticas
   - Implementar sistema de auditoría para cambios sensibles

4. **Renovación de Tokens**:
   - Estrategia para renovar tokens JWT vencidos
   - Manejo de sesiones inactivas

5. **Pruebas de Seguridad**:
   - Implementar tests específicos para autorización
   - Validar protecciones de rutas y endpoints

La implementación sigue los mismos principios arquitectónicos del resto del proyecto: separación por features, programación funcional, y uso extensivo de interfaces para desacoplar implementaciones concretas de abstracciones.
