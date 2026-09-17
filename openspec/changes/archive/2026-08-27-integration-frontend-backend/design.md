# Design: integration-frontend-backend

## Technical Approach

Integrate the frontend application with the new domain v2 entities (`DiaItinerario`, `ItemItinerario`, `Costo`) by defining TypeScript interfaces that mirror the backend DTOs. Create a new `itinerarioService` to handle the data fetching for itineraries. Update the itinerary visualization components to render these new entities hierarchically without pagination. Additionally, implement an `ErrorBoundary` component to wrap layout data-fetching hooks (e.g. in `PlannerLayout`) to ensure the shell remains stable if API failures occur.

## Architecture Decisions

### Decision: Dedicated Itinerary Types and Service
**Choice**: Create new `itinerario.ts` and `itinerarioService.ts` files under `features/planificaciones` rather than overloading existing `planificacion` files.
**Alternatives considered**: Appending the new types and API methods to `planificacion.ts` and `planificacionService.ts`.
**Rationale**: Keeps the concern of itinerary details (days, items, costs) separate from high-level planning entities.

### Decision: No Pagination for Itinerary Items
**Choice**: Load and render all `ItemItinerario` and `DiaItinerario` data for a trip at once.
**Alternatives considered**: Implementing infinite scroll or pagination for `ItemItinerario`.
**Rationale**: The spec strictly mandates all items MUST be loaded at once.

### Decision: Layout Data Error Boundary
**Choice**: Create a generic `ErrorBoundary` component in `shared/components` and wrap layout rendering trees (like `PlannerLayout`) and specific data hooks.
**Alternatives considered**: Try-catch blocks inside components to manage local state.
**Rationale**: Using a React Error Boundary prevents entire shell crashes on render errors, addressing the specific "Layout Data Error Boundary" requirement.

## Data Flow

    [Frontend PlannerLayout] ──→ (itinerarioService) ──→ [Backend ItinerarioController / CostoController]
             │                              │
             └──────── (ErrorBoundary) ─────┘
             │
    [Itinerary Components: DiaItinerarioList ─→ ItemItinerario ─→ Costo]

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/shared/components/ErrorBoundary.tsx` | Create | React Error Boundary component to wrap layouts and handle API failures gracefully. |
| `frontend/src/layouts/PlannerLayout.tsx` | Modify | Wrap the layout content and data fetching hooks with `ErrorBoundary`. |
| `frontend/src/features/planificaciones/types/itinerario.ts` | Create | Interfaces for `DiaItinerarioDTO`, `ItemItinerarioDTO`, `CostoDTO`. |
| `frontend/src/features/planificaciones/api/itinerarioService.ts` | Create | Service methods for fetching itinerary entities from the backend. |
| `frontend/src/features/planificaciones/components/ItinerarioView.tsx` | Create | Main component to render the hierarchical itinerary view. |
| `frontend/src/features/planificaciones/components/DiaItinerarioCard.tsx` | Create | Component to display a day and iterate over its items. |
| `frontend/src/features/planificaciones/components/ItemItinerarioRow.tsx` | Create | Component to display an individual item and its associated costs. |

## Interfaces / Contracts

```typescript
export interface CostoDTO {
  id: number;
  descripcion: string;
  monto: number;
  moneda: string;
}

export interface ItemItinerarioDTO {
  id: number;
  titulo: string;
  tipo: string; // e.g. 'ACTIVIDAD', 'VUELO'
  horaInicio: string;
  horaFin: string;
  costo: CostoDTO | null;
}

export interface DiaItinerarioDTO {
  id: number;
  fecha: string;
  items: ItemItinerarioDTO[];
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `ErrorBoundary` | Force a throw in a child component and assert the fallback UI renders. |
| Unit | `itinerarioService` | Mock `apiClient` to test successful data fetching and error propagation. |
| Integration | `ItinerarioView` | Render with mock `DiaItinerarioDTO` data and verify nested items and costs render without pagination. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. The frontend updates will consume existing domain v2 endpoints.

## Open Questions

- None
