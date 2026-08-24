# Travel Planner - Frontend Design & Style Guidelines

Esta guía documenta las decisiones de diseño, paleta de colores y patrones de componentes de la aplicación web "Travel Planner". Todo el desarrollo futuro del frontend debe basarse en estas reglas para mantener consistencia y coherencia visual.

## 1. Paleta de Colores

### Marca y Acentos (Primary)
- **Teal (Verde Agua)**: Es el color principal de la marca, elegido para dar una sensación natural y orientada a los viajes.
  - Elementos interactivos sobre fondos claros: `teal-600` (Hover: `teal-700`).
  - Elementos interactivos sobre fondos oscuros: `teal-400` (Hover: `teal-300`).
  - Anillos de foco (Focus rings): `focus:ring-teal-400` / `focus:ring-teal-500`.

### Neutrales y Textos
- **Textos Principales (Light Mode)**: `slate-900` para títulos (con `font-extrabold tracking-tight`), `slate-700` o `slate-600` para cuerpos de texto.
- **Textos Secundarios (Light Mode)**: `slate-500`.
- **Textos en Dark Mode / Paneles Oscuros**: `white` para títulos, `slate-200` y `slate-300` para subtítulos y labels.

### Temática Especial: "Marino Texturizado" (Auth)
Se utiliza para destacar paneles importantes (como los formularios de Login/Registro):
- **Gradiente Radial Marino**: `radial-gradient(ellipse at center, #204060 0%, #122842 50%, #071321 100%)`. Centro iluminado, bordes súper oscuros (viñeta).
- **Textura de Olas**: Archivo `/waves.svg` aplicado por encima del gradiente con `bg-repeat`, `opacity-40` y `mix-blend-overlay`.

## 2. Layouts y Estructura

- **AuthLayout (Split-screen)**: Inspirado en Wanderlog. 
  - *Izquierda (Desktop)*: Imagen fotográfica de alta calidad (viajes) que cubre el 100% de la altura, con un gradiente oscuro superior para contrastar el logo y un gradiente inferior para contrastar las citas inspiracionales.
  - *Derecha*: Panel con el tema "Marino Texturizado" centrado para los formularios.
  - Este layout es *independiente* (no se anida dentro de `MainLayout`) para que la navegación a estas rutas se sienta como una transición limpia a pantalla completa.

- **MainLayout**:
  - Envuelve la aplicación principal (Landing Page, Dashboard, etc.).
  - Utiliza el `DiscoveryNavbar` en la parte superior.

## 3. UI Components (Patrones)

### Navegación (DiscoveryNavbar)
- **Glassmorphism**: El navbar utiliza `bg-white/90 backdrop-blur-md` para garantizar el contraste de los textos sobre cualquier fondo (ya que la app principal usa fondos blancos).
- **Menú de Usuario**: Muestra el nombre, un avatar genérico y un menú desplegable/popover (relativo) para confirmar el cierre de sesión, manteniendo al usuario en contexto.

### Formularios (Inputs & Labels)
- **Modo Oscuro (Glassmorphism)**: 
  - Fondo: `bg-slate-800/50 backdrop-blur-sm`.
  - Bordes: `border-slate-600` (Focus: `ring-2 ring-teal-400 border-transparent`).
  - Textos: `text-white`, placeholders `placeholder-slate-400`.
  - Labels: `font-semibold text-sm mb-1.5`.

- **Modo Claro**:
  - Fondo: `bg-white`.
  - Bordes: `border-slate-300` (Focus: `ring-2 ring-teal-500 border-transparent`).
  - Textos: `text-slate-800`.

### Botones (Primary)
- **Formas**: Redondeados, modernos (`rounded-xl`). Padding amplio (`py-3.5 px-4`).
- **Sobre fondos oscuros**: Botón brillante para máximo contraste (`bg-teal-400 text-slate-900 font-bold`).
- **Efectos de estado**: 
  - Hover: sutil cambio de brillo (ej: `hover:bg-teal-300`).
  - Disabled: `opacity-50 cursor-not-allowed`.
  - Loading: Spinner integrado alineado horizontalmente con el texto.

## 4. Tipografía y Espaciado
- Estilo limpio y moderno con Tailwind sans-serif por defecto.
- Títulos: Suelen usar `font-extrabold` y `tracking-tight`.
- Cajas y Contenedores: Generosos márgenes (`space-y-4`, `space-y-5`) y padding (`p-8 sm:p-12`) para dar un aspecto "aireado" y premium.
