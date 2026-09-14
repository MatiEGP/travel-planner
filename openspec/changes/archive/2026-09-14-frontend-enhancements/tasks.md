# Tasks: Frontend Enhancements

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Enhance Layouts and Itinerary UI | PR 1 | `npm run test` | `npm run dev` | Revert changes in `frontend/src` components |

## Phase 1: Routing & Navigation Layouts

- [x] 1.1 Modify `frontend/src/router/index.tsx`: Remove `MainLayout` from the global root. Wrap legacy routes within `MainLayout`, ensuring new pages render their own standalone layouts.
- [x] 1.2 Modify `frontend/src/components/layout/DiscoveryNavbar.tsx`: Remove the "Discover" link. Convert `<a>` tags to React Router `<Link>` tags, and link the logo to `/`.
- [x] 1.3 Modify `frontend/src/components/layout/PlannerSidebar.tsx`: Convert `<a>` tags to React Router `<Link>` tags.

## Phase 2: Views and Components

- [x] 2.1 Modify `frontend/src/components/itinerary/PlanificacionCard.tsx`: Add an `onDelete?: (id: number) => void` property to the component's `Props` interface.
- [x] 2.2 Update `PlanificacionCard.tsx`: Add an `onClick` handler to the main card element for routing to `/planificaciones/${planificacion.id}/destinos`.
- [x] 2.3 Update `PlanificacionCard.tsx`: Embed a Delete button with an `onClick` handler that calls `onDelete(id)` and `e.stopPropagation()`.
- [x] 2.4 Modify `frontend/src/pages/PlanificacionesPage.tsx`: Update the main list container to use a CSS grid layout with `gap-6 grid-cols-1 md:grid-cols-3`.
- [x] 2.5 Update `PlanificacionesPage.tsx`: Add a `handleDelete` method that triggers `planificacionService.delete(id)` (with local state filtering) and pass it to the `PlanificacionCard`.
