# Release Notes - v1.2.0 (Fuimonos) 🚀

Esta versión marca un antes y un después en la aplicación, la cual ahora ha sido renombrada oficialmente a **Fuimonos**. Trae una modernización completa de la interfaz de usuario, rediseños arquitectónicos profundos tanto en Frontend como en Backend, e infraestructura de testing y seguridad de nivel producción.

## 🎨 Frontend y Experiencia de Usuario (UX/UI)
* **Renombramiento y Rebranding**: La app ahora se llama "Fuimonos", incorporando una nueva Landing Page ("Yendiendo"), modo oscuro (Dark Mode) y una paleta de colores moderna centrada en tonos *Coral* y *Slate*.
* **Modernización Visual**:
  * Nuevo **Auth Layout** inspirado en Wanderlog con gradientes marinos invertidos y texturas de ondas.
  * Nuevo **Dashboard de Planificaciones** con tarjetas responsivas, temas de glassmorfismo y navegación global superior consolidada.
  * Modales transparentes y un selector dinámico de fechas/horas en los formularios.
* **Transiciones y Navegación**:
  * Se añadió un **Overlay global** de transiciones de páginas (con barra de progreso) eliminando por completo los saltos bruscos y *micro-flickers* en el renderizado.
  * Las validaciones de inicio y cierre de sesión muestran spinners e interceptan mejor la navegación (ahora redirigen automáticamente al origen post-login).

## 🏗️ Arquitectura y Dominio
* **Frontend FSD (Feature-Sliced Design)**: Reestructuración total de las carpetas de UI para un mantenimiento modular por dominios de negocio.
* **Backend Package-by-Feature**: Refactor profundo de la arquitectura de la API hacia un modelo centrado en funcionalidades (package-by-feature).
* **Evolución del Planificador**:
  * Ahora el modelo de dominio en el backend soporta control de **gastos** y el rastreo granular de **actividades del itinerario**.
* **Renovación del Auth Flow**: Implementación completa y robusta de **Refresh Tokens** en toda la capa de seguridad, manejando cookies `HttpOnly`, interceptores en Axios para reintentar consultas y proteger los cierres de sesión.

## 🐛 Correcciones de Errores y Optimizaciones
* **Freezes y Rendimiento**: Se resolvieron bloqueos de pantalla (`freezes`) en el frontend durante la navegación rápida y problemas asociados con `IntersectionObserver`.
* **Data Fetching**: Se implementó `AbortController` en los custom hooks de consulta para cancelar peticiones huérfanas y evitar fugas de memoria.
* **Correcciones Críticas**:
  * Ya no se pueden agregar días duplicados en un itinerario.
  * Se corrigió la protección de las rutas (`RoleRoute`, `GuestRoute`) y el loop infinito de los interceptores.

## 🧪 Testing y Calidad (QA)
* **Testing en Frontend**: Se construyó desde cero la infraestructura de pruebas con **Vitest**, cubriendo componentes, servicios, layouts y flujos de UI.
* **Testing en Backend**: Ampliación de la cobertura de unit tests para controladores, DTOs, entidades y repositorios.
* **Integración Continua (CI)**: Se aplicaron guardias estrictos para mantener umbrales mínimos de code coverage (cobertura) y CodeQL scanning.
