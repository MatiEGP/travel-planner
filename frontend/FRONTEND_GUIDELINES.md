# Travel Planner - Frontend Design & Style Guidelines

Esta guía documenta las decisiones de diseño, paleta de colores y patrones de componentes de la aplicación web "Travel Planner". Todo el desarrollo futuro del frontend debe basarse en estas reglas para mantener consistencia y coherencia visual.

## 1. Paleta de Colores

### Marca y Acentos (Primary)
- **Teal (Verde Agua)**: Es el color principal de la marca, elegido para dar una sensación natural y orientada a los viajes.
  - Elementos interactivos sobre fondos claros: `teal-600` (Hover: `teal-700`).
  - Elementos interactivos sobre fondos oscuros: `teal-400` / `teal-500` (Hover: `teal-300` / `teal-400`).
  - Anillos de foco (Focus rings): `focus:ring-teal-400` / `focus:ring-teal-500`.

### Neutrales y Textos
- **Textos Principales (Light Mode)**: `slate-900` para títulos (con `font-extrabold tracking-tight`), `slate-700` o `slate-600` para cuerpos de texto.
- **Textos Secundarios (Light Mode)**: `slate-500`.
- **Textos en Dark Mode / Paneles Oscuros**: `white` para títulos, `slate-200` y `slate-300` para subtítulos y labels.

### Temática Especial: "Marino Texturizado" y Glassmorphism
Se utiliza para destacar paneles importantes y las vistas principales de la aplicación:
- **Gradiente Radial Marino**: `radial-gradient(ellipse at center, #204060 0%, #122842 50%, #071321 100%)`. Centro iluminado, bordes súper oscuros (viñeta).
- **Textura de Olas**: Archivo `/waves.svg` aplicado por encima del gradiente con `bg-repeat`, `opacity-40` y `mix-blend-overlay`.
- **Glassmorphism (Efecto Cristal)**: Uso de fondos semitransparentes combinados con desenfoque de fondo. Ej: `bg-slate-900/60 backdrop-blur-md border border-slate-700/50`.

## 2. Layouts y Estructura Arquitectónica

- **RootLayout (Core)**: 
  - Actúa como la envoltura superior de la SPA. Contiene la `GlobalLoadingBar` y el **Header Global**, asegurando que la navegación superior y los indicadores de carga existan incondicionalmente en todas las pantallas.
  
- **Header Global**:
  - Reemplazó por completo los sidebars y navbars duplicados (`DiscoveryNavbar`, `PlannerSidebar`).
  - Usa Glassmorphism y se fija en el tope (`sticky top-0 z-40`).
  - Gestiona dinámicamente la interfaz (Logo + Links + Perfil si hay sesión; Logo + Botones de login si no hay sesión).

- **AuthLayout (Split-screen)**: 
  - *Izquierda (Desktop)*: Imagen fotográfica que cubre el 100% de la altura, con gradientes para contraste.
  - *Derecha*: Panel con el tema "Marino Texturizado".

- **PlannerLayout (Dashboard Principal)**:
  - Vista envolvente para las planificaciones. Hereda el diseño oscuro ("Marino Texturizado") en toda la pantalla, con renderizado de contenido central y un panel lateral derecho flotante opcional para accesos rápidos.

## 3. UI Components (Patrones)

### Modales
- Los formularios complejos (como crear una Planificación) se elevan a Modales sobre el Layout actual.
- Usa backdrop difuminado (`fixed inset-0 bg-slate-900/60 backdrop-blur-sm`).
- El cuerpo del modal sigue la estética oscura: `bg-slate-800 border-slate-600 rounded-2xl shadow-2xl`.

### Manejo de Estado y Datos Asíncronos
- **Optimistic UI / Elevación de estado**: Los modales devuelven callbacks a las páginas para actualizar localmente arreglos como la lista de planificaciones y evitar refetching innecesario.
- **Fetch Concurrente (Data Hydration)**: En casos donde un endpoint RESTful (ej. traer planificaciones) requiere hidratación de entidades secundarias (ej. traer destinos), se deben orquestar promesas concurrentes (`Promise.all()`) directamente en el hook `useEffect` responsable de cargar los datos de la vista.

### Botones (Primary)
- **Formas**: Redondeados, modernos (`rounded-xl`). Padding amplio (`py-3.5 px-4` o `py-2.5 px-6`).
- **Sobre fondos oscuros**: Botón brillante para máximo contraste (`bg-teal-500 text-slate-900 font-bold`).
- **Efectos de estado**: 
  - Hover: sutil cambio de brillo y sombras.
  - Disabled: `opacity-50 cursor-not-allowed`.
  - Loading: Spinner integrado alineado horizontalmente con el texto.

## 4. Tipografía y Espaciado
- Estilo limpio y moderno con Tailwind sans-serif por defecto.
- Títulos: Suelen usar `font-extrabold` y `tracking-tight`.
- Cajas y Contenedores: Generosos márgenes (`space-y-4`, `space-y-5`) y padding (`p-8 sm:p-12`) para dar un aspecto "aireado" y premium.

## 5. Reglas de Testing Frontend
- **Anti-Patrón Prohibido (Implementation Details)**: Nunca testear clases CSS especificas (como bg-teal-600), aserciones de color, o estructuras de DOM exactas. Esto genera tests frágiles.
- **Enfoque de Accesibilidad**: Los tests deben basarse en comportamiento y accesibilidad (W3C Roles). Utilizar funciones como getByRole en lugar de getByText sueltos para mayor robustez.
