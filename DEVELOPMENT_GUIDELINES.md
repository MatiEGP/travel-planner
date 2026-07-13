# Travel Planner - Development Guidelines

Este documento establece las políticas de desarrollo, gestión de configuración (SCM) y buenas prácticas implementadas en el monorepo de **travel-planner**. El objetivo es emular un entorno de desarrollo profesional, ordenado y escalable.

---

## 1. Gestión de Configuración de Software (SCM)

Esta sección se basa en el contenido del antiguo `SCM_GUIDELINES.md`.

### 1.1. Estrategia de Ramas (Branching Strategy)

Se utiliza un flujo de trabajo basado en **Feature Branch Workflow** (una versión simplificada de Git-Flow), ideal para mantener la estabilidad del código.

#### Ramas Principales (Permanentes)
*   **`main`**: Contiene únicamente código 100% estable, probado y listo para producción.
*   **`develop`**: Es la rama de integración donde se consolidan las nuevas funcionalidades. **Nunca se programa directamente sobre `develop` ni `main`.**

#### Ramas Temporales (`feature/*`)
Toda nueva funcionalidad se desarrolla en una rama derivada de `develop`.
*   **Nomenclatura:** `feature/alcance-descripcion-corta` (ej. `feature/backend-auth`, `feature/frontend-login`).
*   La integración a `develop` se realiza exclusivamente mediante un **Pull Request (PR)**.

### 1.2. Convención de Commits (Conventional Commits)

Los mensajes de los commits siguen rigurosamente la especificación de *Conventional Commits*.

#### Estructura del Mensaje
```text
tipo(alcance): descripción corta en minúsculas y en tiempo presente
```
#### Tipos de commit

*   `feat:` Una nueva funcionalidad para el usuario final.
*   `fix:` Solución a un error o bug.
*   `docs:` Cambios o adiciones en la documentación.
*   `style:` Cambios puramente estéticos o de formato.
*   `refactor:` Modificaciones al código que mejoran su estructura sin cambiar su comportamiento.
*   `chore:` Tareas de mantenimiento, configuración de herramientas, actualización de dependencias, etc.

**EJEMPLO:** `feat(backend): implement jpa entities for travel destinations`

### 1.3. Flujo de trabajo diario

1.  **Actualizar entorno local:** `git checkout develop` y `git pull origin develop`.
2.  **Crear rama de funcionalidad:** `git checkout -b feature/frontend-user-profile`.
3.  **Realizar cambios y confirmar:** `git add .` y `git commit -m "feat(frontend): build user profile page"`.
4.  **Subir la rama:** `git push -u origin feature/frontend-user-profile`.
5.  **Abrir un Pull Request** hacia `develop`.

---

## 2. Guías de Desarrollo Frontend

### 2.1. Framework de UI y Estilos

Para la construcción de la interfaz de usuario y la gestión de estilos, se utilizará **Tailwind CSS**. Este enfoque basado en clases de utilidad nos permite construir diseños directamente en el JSX de forma rápida y consistente.

*   **Priorizar clases de Tailwind:** Se debe evitar el uso de estilos en línea (`style={...}`).
*   **Configuración centralizada:** Las personalizaciones del tema (colores, espaciados, fuentes) se deben realizar en el archivo `tailwind.config.js`.

### 2.2. Manejo de Estado

Para la gestión del estado de la aplicación, nos apoyaremos en los **hooks nativos de React**:
*   **`useState`**: Para el estado local de los componentes.
*   **`useEffect`**: Para manejar efectos secundarios (ej. llamadas a la API).

No se introducirán librerías de manejo de estado global para mantener la simplicidad del MVP.

### 2.3. Convenciones de Nomenclatura y Estructura

*   **Componentes:** Se nombrarán usando `PascalCase` (ej: `UsuarioList.tsx`). Se organizarán en `src/components`.
*   **Servicios:** Archivos con lógica de negocio o llamadas a API se nombrarán con `camelCase` (ej: `usuarioService.ts`). Residirán en `src/services`.
*   **Tipos e Interfaces:** Las definiciones de TypeScript se nombrarán con `PascalCase`.
    *   Para DTOs que mapean con el backend, se usará el sufijo `DTO` (ej: `UsuarioResponseDTO`).
    *   Se ubicarán en `src/types`.

### 2.4. Testing

Para la fase actual del MVP, la prioridad es el desarrollo de funcionalidades. Por lo tanto, **no se implementarán pruebas automatizadas**. Esta decisión se re-evaluará en futuras fases del proyecto.