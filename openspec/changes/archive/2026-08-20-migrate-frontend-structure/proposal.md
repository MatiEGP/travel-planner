# Proposal: Migrate Frontend to Feature Folders & Container/Presentational Pattern

## Intent

Restructure the React/Vite frontend from a horizontal layering approach (e.g., all components in one folder, all hooks in another) to a vertical slice architecture using Feature Folders. Within these feature folders, apply the Container/Presentational pattern. This reduces tight coupling, increases cohesion, and improves scalability without changing the existing application behavior.

## Scope

### In Scope
- Create domain-specific feature folders (e.g., `auth`, `users`, `trips`, `destinations`, `activities`).
- Move existing React components, hooks, services, and state management into their respective feature folders.
- Refactor complex components to separate logic (Container components) from UI (Presentational components).
- Update imports across the frontend application.
- Maintain existing routing, layout, and global UI components in a `shared` or `core` directory.

### Out of Scope
- Adding new UI features or changing existing visual designs.
- Modifying backend API contracts.
- Changing the state management library (e.g., if using Context/Zustand, it remains the same).

## Capabilities

> This section is the CONTRACT between proposal and specs phases.

### New Capabilities
- None (This is a pure structural refactoring).

### Modified Capabilities
- None (Behavior remains strictly identical).

## Approach

We will reorganize `src/` to group code by feature. Each feature folder (e.g., `src/features/trips`) will contain its own `components/`, `hooks/`, `services/`, and `utils/`. 
Within `components/`, we will distinguish between Containers (handling data fetching, state, API calls) and Presentational components (pure, UI-only, prop-driven). Global elements like generic buttons or layout wrappers will reside in `src/components` or `src/shared`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/components` | Modified | Generic components stay, domain-specific ones move to `features/`. |
| `frontend/src/features/*` | New | Vertical slices for `auth`, `trips`, `destinations`, etc. |
| `frontend/src/hooks` | Modified | Domain hooks move into feature folders. |
| `frontend/src/services` | Modified | API calls move into feature folders. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Broken imports causing build failures | Medium | Use automated refactoring scripts and rely on Vite/TypeScript compiler checks. |
| Over-engineering simple components | Low | Only split Container/Presentational where there is actual logic/state overhead. |

## Rollback Plan

Abandon the `feature/migrate-frontend-structure` Git branch. If merged, `git revert` the structural PR.

## Dependencies

- Existing Vite/React build tools.

## Success Criteria

- [ ] Project directory is reorganized into feature slices.
- [ ] Container components are separated from Presentational UI where applicable.
- [ ] `npm run build` succeeds with zero errors.
- [ ] UI behaves identically to the pre-refactor state.
