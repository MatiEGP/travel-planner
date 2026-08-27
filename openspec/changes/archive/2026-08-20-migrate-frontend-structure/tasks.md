# Tasks: Migrate Frontend to Feature Folders & Container/Presentational Pattern

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~350-500 lines (Package/Import statements only) |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Full Structural Refactor | PR 1 | `npm run build` | `npm run dev` to manually check router loads correctly | Abandon branch |

## Phase 1: Shared Architecture Foundation

- [x] 1.1 Create `src/shared/api/`, `src/shared/components/layout/`, and `src/shared/types/`.
- [x] 1.2 Move `src/api/client.ts` to `src/shared/api/client.ts`.
- [x] 1.3 Move `src/types/error.ts` to `src/shared/types/error.ts`.
- [x] 1.4 Move `src/components/layout/*` to `src/shared/components/layout/`.

## Phase 2: Feature Slices Creation (auth, usuarios)

- [x] 2.1 Create `src/features/auth/` containing `api/`, `components/`, `containers/`, `pages/`, `context/`, `types/`.
- [x] 2.2 Move Auth logic: `services/authService.ts` to `api/`, `context/` files to `context/`, `pages/LoginPage.tsx` & `RegisterPage.tsx` to `pages/`, UI to `components/`, and Protected Routes to `containers/`.
- [x] 2.3 Create `src/features/usuarios/` containing `api/`, `components/`, `containers/`, `pages/`, `types/`.
- [x] 2.4 Move Usuario logic: `services/usuarioService.ts` to `api/`, `UsuarioManager.tsx` to `containers/`, `UsuarioForm`/`UsuarioList` to `components/`, `AdminPage.tsx` to `pages/`, and `types/usuario.ts` to `types/`.

## Phase 3: Feature Slices Creation (actividades, destinos, planificaciones)

- [x] 3.1 Create `src/features/actividades/` and move `ActividadManager.tsx` to `containers/`, `ActividadForm`/`Card` to `components/`, `ActividadesPage.tsx` to `pages/`, `services` to `api/`, `types` to `types/`.
- [x] 3.2 Create `src/features/destinos/` and move `DestinoManager.tsx` to `containers/`, `DestinoForm`/`Card` to `components/`, `DestinosPage.tsx` to `pages/`, `services` to `api/`, `types` to `types/`.
- [x] 3.3 Create `src/features/planificaciones/` and move `PlanificacionManager.tsx` to `containers/`, `PlanificacionForm`/`Card` to `components/`, `PlanificacionesPage.tsx` to `pages/`, `services` to `api/`, `types` to `types/`.

## Phase 4: Import Resolution & Routing

- [x] 4.1 Update all internal imports within `src/features/*` to point to their new local feature paths.
- [x] 4.2 Update all cross-domain imports (e.g., features referencing `shared/api/client.ts` or `shared/types/error.ts`).
- [x] 4.3 Update `src/router/index.tsx` to point to the new `src/features/<feature>/pages/` routes.

## Phase 5: Cleanup & Verification

- [x] 5.1 Delete empty legacy directories: `src/components`, `src/pages`, `src/services`, `src/context`, `src/api`, `src/types`.
- [x] 5.2 Run `npm run build` (which runs `tsc && vite build`) to verify there are no broken imports or unresolved modules.
- [x] 5.3 Run `npm run test` to verify any moved unit tests successfully execute in their new locations.
