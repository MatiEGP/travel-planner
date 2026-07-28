# Travel Planner - Development Guidelines

Este documento establece las políticas de desarrollo, gestión de configuración (SCM) y buenas prácticas implementadas en el monorepo de **travel-planner**. El objetivo es emular un entorno de desarrollo profesional, ordenado y escalable.

---

## 1. Gestión de Configuración de Software (SCM)

### 1.1. Estrategia de Ramas (Branching Strategy)

Se utiliza un flujo de trabajo basado en **Feature Branch Workflow** (una versión simplificada de Git-Flow), ideal para mantener la estabilidad del código.

#### Ramas Principales (Permanentes)
*   **`main`**: Contiene únicamente código 100% estable, probado y listo para producción.
*   **`develop`**: Es la rama de integración donde se consolidan las nuevas funcionalidades. **Nunca se programa directamente sobre `develop` ni `main`.**

#### Ramas Temporales
Toda nueva funcionalidad o corrección se desarrolla en una rama derivada de `develop`.

| Tipo | Nomenclatura | Descripción |
|------|-------------|-------------|
| Nueva funcionalidad | `feature/alcance-descripcion-corta` | Ej: `feature/backend-auth`, `feature/frontend-login` |
| Corrección de bug | `fix/alcance-descripcion-corta` | Ej: `fix/backend-token-expiry`, `fix/frontend-login-redirect` |
| Preparación de release | `release/vX.Y.Z` | Ej: `release/v1.0.0` — solo ajustes finales, sin nuevas features |

La integración a `develop` (o `main` en el caso de `release/*`) se realiza exclusivamente mediante un **Pull Request (PR)**.

#### Flujo de Release
Cuando `develop` está estable y lista para producción:
1.  Crear una rama `release/vX.Y.Z` desde `develop`.
2.  Realizar únicamente ajustes menores (versión, notas de release).
3.  Abrir un PR hacia `main` y otro de vuelta hacia `develop` para sincronizar los ajustes.
4.  Crear el **Git Tag** correspondiente en `main` (ej. `v1.0.0`).

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
*   `ci:` Cambios en los pipelines de integración continua (archivos de GitHub Actions, scripts de CI/CD).

**EJEMPLOS:**
```
feat(backend): implement jpa entities for travel destinations
fix(frontend): resolve login redirect loop on expired session
ci(github-actions): add frontend build and lint pipeline
```

### 1.3. Flujo de trabajo diario

1.  **Actualizar entorno local:** `git checkout develop` y `git pull origin develop`.
2.  **Crear rama de funcionalidad:** `git checkout -b feature/frontend-user-profile`.
3.  **Realizar cambios y confirmar:** `git add .` y `git commit -m "feat(frontend): build user profile page"`.
4.  **Subir la rama:** `git push -u origin feature/frontend-user-profile`.
5.  **Abrir un Pull Request** hacia `develop`.

---

## 2. Guías de Desarrollo Frontend

### 2.1. Framework de UI y Estilos

Para la construcción de la interfaz de usuario y la gestión de estilos, se utilizará **Tailwind CSS**. Este enfoque basado en clases de utilidad permite construir diseños directamente en el JSX de forma rápida y consistente.

*   **Priorizar clases de Tailwind:** Se debe evitar el uso de estilos en línea (`style={...}`).
*   **Configuración centralizada:** Las personalizaciones del tema (colores, espaciados, fuentes) se deben realizar en el archivo `tailwind.config.js`.

### 2.2. Manejo de Estado

Para la gestión del estado de la aplicación, nos apoyaremos en los **hooks nativos de React**:
*   **`useState`**: Para el estado local de los componentes.
*   **`useEffect`**: Para manejar efectos secundarios (ej. llamadas a la API).
*   **`useContext`**: Para estado compartido entre componentes, a través de los providers definidos en `src/context`.

No se introducirán librerías de manejo de estado global (ej. Redux, Zustand) para mantener la simplicidad del MVP.

### 2.3. Estructura de Carpetas (`src/`)

```
src/
├── api/          # Instancia y configuración base de Axios (interceptores, base URL)
├── assets/       # Imágenes, íconos y otros recursos estáticos
├── components/   # Componentes reutilizables (PascalCase, ej: TripCard.tsx)
├── context/      # Providers y Contexts de React (ej: AuthContext.tsx)
├── layouts/      # Componentes de estructura de página (ej: MainLayout.tsx)
├── pages/        # Componentes de página, mapeados 1:1 con rutas (ej: LoginPage.tsx)
├── router/       # Definición de rutas con React Router
├── services/     # Lógica de negocio y llamadas a la API (camelCase, ej: tripService.ts)
├── types/        # Interfaces y tipos de TypeScript (PascalCase)
│                 #   DTOs del backend: sufijo DTO (ej: TripResponseDTO.ts)
├── index.css     # Estilos globales y directivas de Tailwind
└── main.tsx      # Punto de entrada de la aplicación
```

### 2.4. Validaciones Automáticas (CI)

El proyecto cuenta con un pipeline de CI para el frontend que se ejecuta automáticamente en cada Pull Request y push. Las validaciones son:

*   **TypeScript (`tsc`):** Verifica que no haya errores de tipado en el código.
*   **Vite Build (`vite build`):** Asegura que el proyecto compile correctamente a producción.
*   **ESLint (`eslint .`):** Comprueba que el código siga las convenciones definidas en `eslint.config.js`.

Un PR cuyas validaciones fallen **no deberá ser mergeado** hasta que los errores sean corregidos.