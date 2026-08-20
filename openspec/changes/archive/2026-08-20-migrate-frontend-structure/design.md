# Design: Migrate Frontend to Feature Folders & Container/Presentational Pattern

## Technical Approach

We will reorganize the React/Vite frontend into a vertical slice architecture (`src/features/*`), mirroring the backend's Screaming Architecture. Existing domain files will be migrated from horizontal layers (`src/pages`, `src/components`, `src/services`, `src/types`) into their corresponding feature folders (`auth`, `usuarios`, `planificaciones`, `destinos`, `actividades`). Within each feature, we will explicitly separate UI from logic by organizing them into `components/` (Presentational) and `containers/` (Logic wrappers like Managers/Pages). Generic utilities and cross-cutting components will move to a `src/shared/` directory.

## Architecture Decisions

### Decision: Feature Folder Strategy

**Choice**: Group files by domain into `src/features/<feature>/` (containing `api/`, `components/`, `containers/`, `pages/`, `types/`, and `context/`).
**Alternatives considered**: Keep horizontal layers but use stricter naming conventions (e.g. `src/components/DestinoCard.tsx`).
**Rationale**: Vertical slicing significantly increases cohesion. When working on a feature like "destinos", developers will find the service, UI, container, and types all in one directory instead of hunting across the `src/` root.

### Decision: Container/Presentational Separation

**Choice**: Move existing `*Manager.tsx` components to `src/features/<feature>/containers/`, and pure UI components like `*Card.tsx` or `*Form.tsx` to `src/features/<feature>/components/`.
**Alternatives considered**: Leave them mixed together in a single `features/<feature>/components/` folder.
**Rationale**: Explicitly separating state/data-fetching (Containers) from stateless UI (Presentational) enforces the Single Responsibility Principle and simplifies unit testing for pure UI components.

### Decision: Shared / Cross-Cutting Logic

**Choice**: Introduce a `src/shared/` directory for global elements like the Axios instance (`src/api/client.ts` -> `src/shared/api/client.ts`), Layout components (`Header.tsx`), and generic types (`error.ts`).
**Alternatives considered**: Keep them in the `src/` root or `src/core/`.
**Rationale**: `src/shared/` is a well-understood React convention for cross-feature code, creating a clear boundary between domain logic and infrastructural UI/API logic.

## Data Flow

No data flow or business logic changes. The React component lifecycle and API communication remain identical:

    (Feature Page) ── renders ──→ (Container / Manager) ── fetches data ──→ (Feature API Service)
                                       │
                                    renders
                                       │
                                       ▼
                             (Presentational Component)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/features/actividades/*` | Create | Moves `ActividadManager`, `ActividadForm`, `ActividadCard`, `ActividadesPage`, `actividadService`, and types into their feature slice. |
| `src/features/destinos/*` | Create | Moves `Destino*` UI, manager, page, and service into their feature slice. |
| `src/features/planificaciones/*` | Create | Moves `Planificacion*` UI, manager, page, and service. |
| `src/features/usuarios/*` | Create | Moves `Usuario*` UI, manager, page, and service. |
| `src/features/auth/*` | Create | Moves `Login/Register` pages, `AuthContext`, `ProtectedRoute` components, and `authService`. |
| `src/shared/components/layout/` | Create | Moves `Header.tsx` and related layout components out of `src/components/layout`. |
| `src/shared/api/` | Create | Moves the global Axios instance out of `src/api/`. |
| `src/router/*` | Modify | Update imports to point to `src/features/<name>/pages/*`. |
| `src/components/`, `src/pages/`, `src/services/`, `src/api/`, `src/context/`, `src/types/` | Delete | Removed once all contents are relocated. |

## Interfaces / Contracts

No new interfaces are created. Existing TypeScript definitions in `src/types/` will be split into their respective `src/features/<feature>/types/` folders (e.g. `src/features/destinos/types/index.ts`). `src/types/error.ts` moves to `src/shared/types/error.ts`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Imports & Compilation | `npm run build` must succeed using `tsc` to verify all cross-feature import paths are resolved. |
| Unit | Component tests | Existing Jest/Vitest tests in `__tests__` folders are relocated alongside the containers/services and executed. |
| E2E | App Boot | Manual or automated verification that the router loads pages successfully without 404s. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. This is a local structural refactor affecting source files only.

## Open Questions

- None.
