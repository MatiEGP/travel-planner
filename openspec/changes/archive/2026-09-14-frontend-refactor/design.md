# Design: frontend-refactor

## Technical Approach

The frontend architecture will transition from a monolithic app shell to workflow-specific layout wrappers (`DiscoveryLayout` and `PlannerLayout`). The UI will adopt an organic, fluid travel-inspired language configured via a centralized `tailwind.config.js`. We will implement a hierarchical component tree for trip itineraries to replace the current flat lists.

## Architecture Decisions

### Decision: Dual Layout Strategy

**Choice**: Separate `DiscoveryLayout` and `PlannerLayout` wrappers.
**Alternatives considered**: A single dynamic layout component with conditional rendering based on route.
**Rationale**: The structural differences (immersive full-bleed vs. 3-column dashboard) are too significant for a single component. Separate layouts keep code clean and maintainable.

### Decision: Nested Component Hierarchy for Itineraries

**Choice**: `PlanificacionCard` > `MiniDestinoCard` > `ActivityListItem`.
**Alternatives considered**: Keeping the existing flat list managers (`PlanificacionManager`, `DestinoCard`, `ActividadCard`).
**Rationale**: A nested structure provides a better contextual overview of the entire trip, matching the user's mental model of a travel itinerary.

## Data Flow

    [Page Component] ──(fetches data)──> [PlanificacionCard]
                                                │
                                                └──(maps Destinos)──> [MiniDestinoCard]
                                                                            │
                                                                            └──(maps Actividades)──> [ActivityListItem]

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/tailwind.config.js` | Modify | Add natural colors, soft shadows, and organic radii |
| `frontend/src/layouts/DiscoveryLayout.tsx` | Create | Immersive wrapper for discovery pages |
| `frontend/src/layouts/PlannerLayout.tsx` | Create | 3-column app shell for planner pages |
| `frontend/src/components/layout/DiscoveryNavbar.tsx` | Create | Navbar with transparent-to-solid scroll transition |
| `frontend/src/components/layout/PlannerSidebar.tsx` | Create | Sidebar navigation for the planner |
| `frontend/src/components/itinerary/PlanificacionCard.tsx` | Create/Modify | Outer nested container for a trip |
| `frontend/src/components/itinerary/MiniDestinoCard.tsx` | Create | Inner container for destinations |
| `frontend/src/components/itinerary/ActivityListItem.tsx` | Create | Leaf component for activities |
| `frontend/src/pages/HomePage.tsx` | Modify | Migrate to DiscoveryLayout; apply organic redesign |
| `frontend/src/pages/PlanificacionesPage.tsx` | Modify | Migrate to PlannerLayout and nested itinerary UI |

## Interfaces / Contracts

No new backend API contracts. Frontend components will reuse existing TS types (e.g., `Planificacion`, `Destino`, `Actividad`) passed as props down the hierarchy.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `DiscoveryNavbar` scroll | Mock window scroll events and assert class changes |
| Unit | Nested Card rendering | Mount `PlanificacionCard` with mock data and verify child counts |
| Integration | Mobile responsiveness | Render `PlannerLayout` at mobile viewport sizes and assert sidebar is hidden/collapsible |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No data migration required. Feature rollout will be handled via standard PR deployment.

## Open Questions

- None
