# Guía de Creación de Módulos

Esta guía explica cómo crear un nuevo módulo en la aplicación e integrarlo con el sistema de feature flags.

## 1. Estructura del Módulo

Cada módulo debe seguir la arquitectura de "feature slice". Crea la siguiente estructura de carpetas:

```
src/
  features/
    your-module/
      domain/         # Entidades y lógica de dominio
        entities/
        repositories/
      application/    # Casos de uso y estado
        hooks/
        stores/
      presentation/   # Componentes de UI
        components/
        pages/
```

## 2. Implementación Base

1. **Crear la entidad principal**:

```typescript
// src/features/your-module/domain/entities/YourEntity.ts
export interface YourEntity {
  id: string;
  // ... otras propiedades
}
```

2. **Definir el repositorio**:

```typescript
// src/features/your-module/domain/repositories/YourRepository.ts
import { YourEntity } from '../entities/YourEntity';

export interface YourRepository {
  getAll(): Promise<YourEntity[]>;
  // ... otros métodos
}
```

3. **Implementar los casos de uso**:

```typescript
// src/features/your-module/application/hooks/useYourModule.ts
import { useState } from 'react';
import { YourEntity } from '../../domain/entities/YourEntity';

export const useYourModule = () => {
  const [items, setItems] = useState<YourEntity[]>([]);
  
  // ... implementación
  
  return {
    items,
    // ... otros métodos
  };
};
```

4. **Crear el componente principal**:

```typescript
// src/features/your-module/presentation/pages/YourModule.tsx
import { useYourModule } from '../../application/hooks/useYourModule';

export const YourModule = () => {
  const { items } = useYourModule();
  
  return (
    <div>
      {/* Tu implementación */}
    </div>
  );
};
```

## 3. Integración con Feature Flags

1. **Agregar el feature flag**:

```typescript
// src/core/config/featureFlags.ts
export enum FeatureFlags {
  // ... flags existentes
  YOUR_MODULE = 'YOUR_MODULE',
}

// Agregar a defaultFeatureFlags
const defaultFeatureFlags: Record<FeatureFlags, boolean> = {
  // ... flags existentes
  [FeatureFlags.YOUR_MODULE]: false,
};

// Agregar a la configuración de featureFlags
export const featureFlags = [
  // ... flags existentes
  {
    name: FeatureFlags.YOUR_MODULE,
    description: 'Your module description',
    enabled: defaultFeatureFlags[FeatureFlags.YOUR_MODULE],
    requiresAuth: true,
    permissions: ['required-permission'],
    group: 'Core'
  }
];
```

2. **Agregar la ruta protegida**:

```typescript
// src/core/router/routes.tsx
import { YourModule } from '@/features/your-module/presentation/pages/YourModule';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      // ... rutas existentes
      {
        path: 'your-module',
        element: (
          <ProtectedRoute
            element={<YourModule />}
            flag={FeatureFlags.YOUR_MODULE}
            permissions={['required-permission']}
          />
        )
      }
    ]
  }
];
```

3. **Agregar al menú de navegación**:

```typescript
// src/core/config/menuConfig.tsx
import { YourModuleIcon } from 'lucide-react';

export const menuItems = [
  // ... items existentes
  {
    label: 'Your Module',
    path: '/your-module',
    icon: <YourModuleIcon />,
    featureFlag: FeatureFlags.YOUR_MODULE,
    permissions: ['required-permission']
  }
];
```

## 4. Testing

1. **Test del componente**:

```typescript
// src/features/your-module/presentation/pages/YourModule.test.tsx
import { render, screen } from '@testing-library/react';
import { YourModule } from './YourModule';

describe('YourModule', () => {
  it('renders correctly', () => {
    render(<YourModule />);
    // ... tus assertions
  });
});
```

2. **Test de integración con feature flags**:

```typescript
// src/features/your-module/YourModule.integration.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { YourModule } from './presentation/pages/YourModule';
import { FeatureFlags } from '@/core/config/featureFlags';

vi.mock('@/core/config/featureFlags', () => ({
  isFeatureEnabled: vi.fn().mockReturnValue(true),
  FeatureFlags: {
    YOUR_MODULE: 'YOUR_MODULE'
  }
}));

describe('YourModule Integration', () => {
  it('integrates with feature flags', () => {
    render(
      <MemoryRouter>
        <YourModule />
      </MemoryRouter>
    );
    // ... tus assertions
  });
});
```

## 5. Activación del Módulo

1. Accede a http://localhost:3006/admin/feature-flags
2. Encuentra tu módulo en la sección "Application Features"
3. Activa el toggle para habilitar el módulo
4. Haz clic en "Save Changes"
5. El módulo ahora estará disponible en el menú si el usuario tiene los permisos necesarios

## 6. Próximos Pasos

- Implementaremos un generador con Plop para automatizar este proceso
- Agregaremos más pruebas de integración
- Mejoraremos la documentación con ejemplos específicos 