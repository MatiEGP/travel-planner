# Travel Planner - SCM Guidelines

Este documento establece las políticas de **Gestión de Configuración de Software (SCM)** y las buenas prácticas de Git implementadas en el monorepo de **travel-planner**. El objetivo es emular un entorno de desarrollo profesional, ordenado y escalable.

---

## 1. Estrategia de Ramas (Branching Strategy)

Se utiliza un flujo de trabajo basado en **Feature Branch Workflow** (una versión simplificada de Git-Flow), ideal para mantener la estabilidad del código en proyectos de tipo monorepo.

### Ramas Principales (Permanentes)
*   **`main`**: Contiene únicamente código 100% estable, probado y listo para producción. Cada cambio aquí representa un incremento real de la aplicación.
*   **`develop`**: Es la rama de integración. Aquí se consolidan todas las nuevas funcionalidades desarrolladas antes de pasar a producción. **Nunca se programa directamente sobre `develop` ni `main`.**

### Ramas Temporales (`feature/*`)
Para cualquier tarea, cambio o nueva funcionalidad, se debe crear una rama específica que se derive de `develop`:
*   **Nomenclatura:** `feature/alcance-descripcion-corta` (ej. `feature/backend-auth`, `feature/frontend-login`).
*   Una vez finalizada y probada la tarea, el código se integra a `develop` exclusivamente mediante un **Pull Request (PR)** en GitHub.

---

## 2. Convención de Commits (Conventional Commits)

Los mensajes de los commits siguen rigurosamente la especificación de *Conventional Commits*. Esto facilita la lectura del historial y describe con precisión el impacto de cada cambio.

### Estructura del Mensaje
```text
tipo(alcance): descripción corta en minúsculas y en tiempo presente
```
### Tipos de commit

`feat:` Una nueva funcionalidad para el usuario final.

`fix:` Solución a un error o bug.

`docs:` Cambios o adiciones en la documentación (como este archivo).

`style:` Cambios puramente estéticos o de formato que no alteran la lógica.

`refactor:` Modificaciones al código existentes que mejoran su estructura interna sin cambiar su comportamiento

`chore:` Tareas de mantenimiento general, configuracion de herramientas, actualización de dependencias o builds, etc.

**EJEMPLO:**
```
feat(backend): implement jpa entities for travel destinations.
```

## 3. Flujo de trabajo diario

1. Actualizar entorno local
```
git checkout develop
git pull origin develop
```
2. Crear rama de funcionalidad
```
git checkout -b feature/backend-trip-crud
```
3. Realizar los cambios y confirmar (commit)
```
git add .
git commit -m "feat(backend): add basic crud endpoints for trip planning"
```
4. Subir la rama al repositorio
```
git push -u origin feature/backend-trip-crud
```
5. Abrir un Pull Request desde la nueva rama hacia develop, revisar el código y confirmar la fusión