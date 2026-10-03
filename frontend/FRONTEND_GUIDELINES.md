# Travel Planner - Frontend Design & Style Guidelines

Esta guía documenta las decisiones de diseño, paleta de colores y patrones de componentes de la aplicación web "Travel Planner". Todo el desarrollo futuro del frontend debe basarse en estas reglas para mantener consistencia y coherencia visual.

## 1. Paleta de Colores y Estética Principal

La aplicación utiliza un diseño basado en un esquema neutral con un fuerte contraste para los Call To Action (CTA).

### Paleta Base y Textos (Neutros / Slate)
- **Fondo General (Light Mode)**: `bg-[#F7F9FA]` (Gris ultra-claro, da sensación de amplitud).
- **Contenedores de Tarjetas y Modales**: `bg-white` puro para contrastar contra el fondo.
- **Títulos Principales**: `slate-900` (suele acompañarse con `font-extrabold tracking-tight`).
- **Subtítulos y Descripciones**: `slate-500` con `font-medium`.
- **Contadores / Badges Numéricos**: Texto `slate-600` sobre fondo `bg-slate-100`.

### Marca y Acentos (Primary CTA)
El protagonista visual es el **Coral** (estilo Airbnb), que se usa estrictamente para llamar la atención en la acción principal (crear viaje) y estados de carga.
- **Color Principal (Background)**: `bg-[#FF5A5F]` (`coral-500` en Tailwind).
- **Estado Hover**: `hover:bg-[#E0484D]` (`coral-600` en Tailwind).
- **Sombras de interacción**: `hover:shadow-rose-500/25` (Da un resplandor integrado).
- **Indicadores de Carga (Spinners)**: `border-coral-500` (`border-[#FF5A5F]`).

### Filtros (Pill Tabs)
Utilizados para navegaciones internas o cambios de vista (Ej: Próximos Viajes vs Viajes Pasados).
- **Contenedor**: `bg-slate-200/80` con sombra interna (`shadow-inner`).
- **Tab Activo**: Elevado visualmente usando `bg-white text-slate-900 shadow-sm`.
- **Tab Inactivo**: Transparente, con texto `text-slate-600 hover:text-slate-900`.

### Alertas y Errores
Se usa la paleta `rose` de Tailwind, que acompaña armónicamente al coral sin perder el significado de "alerta".
- **Fondo de Alerta**: `bg-rose-50`.
- **Bordes**: `border-rose-200`.
- **Textos e Íconos de Error**: `text-rose-700` y `text-rose-500`.

### Formas y Layout
- **Radios de Borde (Border Radius)**: Tiende a formas orgánicas. Los botones y selectores principales usan `rounded-full`, mientras que las tarjetas o inputs usan `rounded-xl` o `rounded-2xl`.

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
