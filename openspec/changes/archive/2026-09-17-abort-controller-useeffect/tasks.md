# Review Workload Forecast

- **Decision needed before apply**: No.
- **Chained PRs recommended**: No.
- **Chain strategy**: Single PR is appropriate. The changes apply a simple pattern across multiple files.
- **400-line budget risk**: Low to Medium. While multiple files are affected, changes are mostly mechanical.

# Tasks

## Phase 1: Update Services
- [x] Update frontend service modules (e.g. `auth`, `destinos`, `actividades`, `planificaciones`, `usuarios`) to accept an optional `signal?: AbortSignal` parameter in their fetch methods.
- [x] Ensure the `fetch` or `axios` calls in the service layer correctly forward the `signal` option.

## Phase 2: Update Components
- [x] Update data-fetching `useEffect` in `PlanificacionesPage.tsx` to instantiate `AbortController`, pass its `signal`, and `abort()` on cleanup. Catch and ignore `AbortError`.
- [x] Update data-fetching `useEffect` in `PlanificacionDetailPage.tsx` using the same `AbortController` pattern.
- [x] Update `useEffect` data fetching in entity managers (`UsuarioManager.tsx`, `DestinoManager.tsx`, `ActividadManager.tsx`, `PlanificacionManager.tsx`) to use `AbortController`.
- [x] Update `AuthContext.tsx` to use `AbortController` for session validation on mount.
- [x] Update `ItinerarioView.tsx` or other components listed that perform data fetching on mount to use `AbortController`.

## Phase 3: Validation
- [x] Verify rapid navigation between pages cancels network requests and does not throw unhandled promise rejections.
- [x] Check console for elimination of React warnings about state updates on unmounted components.
