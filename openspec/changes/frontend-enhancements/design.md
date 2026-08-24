# Design: Frontend Enhancements

## Technical Approach

Resolve the layout overlap by reconfiguring the React Router root tree to isolate `MainLayout`, `DiscoveryLayout`, and `PlannerLayout`. Enhance the `PlanificacionesPage` UI by switching from a 1-column list to a CSS grid (`grid-cols-1 md:grid-cols-3`) and adding interactive event handlers (navigation and deletion) directly to `PlanificacionCard`.

## Architecture Decisions

### Decision: Layout Routing Strategy

**Choice**: Remove `<MainLayout />` as the global root wrapper in `router/index.tsx`. Group legacy pages under a route that supplies `MainLayout`, while allowing new pages (`HomePage`, `PlanificacionesPage`) to render their own layouts standalone.
**Alternatives considered**: Keeping `MainLayout` at the root and conditionally rendering its navbar based on the current URL path.
**Rationale**: Conditional logic in a global layout gets messy and tightly couples the layout to route knowledge. Direct composition inside the route tree is cleaner and aligns better with React Router v6 paradigms.

### Decision: Delete Button Event Handling

**Choice**: Embed the Delete button inside the `PlanificacionCard` and use `e.stopPropagation()` in its click handler.
**Alternatives considered**: Creating a separate "Actions" dropdown menu or leaving the delete action on a dedicated detail page.
**Rationale**: The user explicitly requested a delete button directly on the card. `stopPropagation` is required because the entire card itself will be a clickable area that routes to the detail view.

## Data Flow

    PlanificacionesPage (State)
         │
         ├── render ──> PlanificacionCard (Click to Navigate)
         │                   │
         │                   └── render ──> Delete Button
         │                                       │
         └──── trigger onDelete() <──────────────┘
         │
    planificacionService.delete(id) (API Call)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/router/index.tsx` | Modify | Remove `MainLayout` from root; wrap legacy routes in `MainLayout`. |
| `frontend/src/components/layout/DiscoveryNavbar.tsx` | Modify | Remove "Discover" link; change `<a>` to `<Link>`; link logo to `/`. |
| `frontend/src/components/layout/PlannerSidebar.tsx` | Modify | Change `<a>` tags to `<Link>`. |
| `frontend/src/pages/PlanificacionesPage.tsx` | Modify | Apply `grid-cols-1 md:grid-cols-3`; add `handleDelete` method. |
| `frontend/src/components/itinerary/PlanificacionCard.tsx` | Modify | Add `onDelete` prop, delete button, and `onClick` routing for the card. |

## Interfaces / Contracts

```typescript
// frontend/src/components/itinerary/PlanificacionCard.tsx
interface Props {
  planificacion: PlanificacionResponseDTO;
  destinos?: DestinoWithActividades[];
  onDelete?: (id: number) => void; // NEW
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `PlanificacionCard` click events | Verify that clicking the card routes, and clicking the delete button fires `onDelete` without routing (preventing event bubbling). |
| Integration | Routing Layouts | Render specific paths in test router to ensure `MainLayout` does not leak into `HomePage` or `PlanificacionesPage`. |
| E2E | Plan deletion | N/A |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required.

## Open Questions

- None
