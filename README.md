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
5. Librerías de react headless livianas con alto perfomance, con shadcn y tanstack tables, en una carpeta dentro de “core” llamada “shared”
6. Separación de responsabilidades con arquitectura “vertical slice” o “feature slice” 
7.  Patron “Feature flags” para activar y desactivar características del menú a través de un panel de admin. Este feature flags puede ser un json simulando que consultamos desde un token jwt el claims para autorización y controlar que puede ver o no el usuario, pero también puede desde el panel activar o desactivar
8. El modulo de ejemplo puede ser un modulo para crear ordenes de inversión de compra y venta
9. La capa de presentación la colocas de ultima pensando en que en algún momento pueda usar otro framework para la capa de presentación
10. El sistema debe permitir crear un nuevo modulo que se inserte en el menú o submenú, usando react router y activarse o desactivarse en el panel administrativo
11. El tsconfig y el vite config debe tener path a cada “feature”, componente o función de manera limpia, ejemplo: "paths": {  "@/*": ["./src/*"],   "@components/*": ["src/components/*"],   "@core/*": ["src/core/*"],      "@features/*": ["src/features/*"],     "@hooks/*": ["src/hooks/*"],     "@layouts/*": ["src/layouts/*"],      "@pages/*": ["src/pages/*"],"@utils/*": ["src/utils/*"]    }
12. Debe ser facilmente testeable, si no es facilmente testable no es mantanible, no está bien la arquitectura
13. Se debe poder crear nuevo modulos de manera fácil, incluso con algún comando y que automáticamente queden en el menú o submenú según se requiera.


## Licencia

MIT
