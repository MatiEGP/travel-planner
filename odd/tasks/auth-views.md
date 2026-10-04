# Autenticación: Vistas Login y Registro

## Objective
Implementar un layout split-screen responsivo y fluido para las vistas de Login y Registro, utilizando Framer Motion para transiciones (flip/slide) y micro-interacciones (floating labels, tap effects), con soporte de Dark Mode.

## Scope
- Sobrescribir `AuthLayout.tsx` para layout split-screen (imagen/patrón + formulario).
- Refactorizar componentes de formularios (`LoginForm`, `RegisterForm`) para usar `framer-motion` y floating labels.
- Implementar toggle de Dark/Light mode en el layout.
- Integrar con backend-ready handlers (`useAuth`).

## Constraints
- Mobile-first, responsive.
- Sin navegación global (Navbar/Footer).
- Usar Tailwind CSS y Framer Motion.

## Tasks
- [x] 1. Refactorizar `AuthLayout.tsx`: Implementar Split-Screen, Dark Mode Toggle.
- [x] 2. Crear componentes de Forms con Framer Motion (Floating labels, tap bounce).
- [x] 3. Refactorizar `AuthPage.tsx` para usar `AnimatePresence` y alternar entre los forms fluidamente.
- [x] 4. Limpiar componentes anteriores obsoletos (`AnimatedAuthContainer`, `LoginFormCard`, `RegisterFormCard`).
