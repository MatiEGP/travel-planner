# Design: fix-activities-itinerary-ux

## Technical Approach

We will modify the frontend to allow creating activities without a destination, auto-populate item times from activities in the itinerary, and enforce the date boundaries of the trip both on the frontend and backend.

## Architecture Decisions

### Decision: Optional `destinoId`
**Choice**: Change `destinoId` to be optional in `ActividadRequestDTO` and remove UI guards that enforce it.
**Alternatives considered**: Create a separate DTO for standalone activities.
**Rationale**: Reusing the same entity and DTO but making the association optional is the simplest and aligns with the database schema where `destino_id` is already nullable.

### Decision: Itinerary time auto-fill
**Choice**: Handle in both frontend (UI reactivity) and backend (fallback).
**Alternatives considered**: Only frontend or only backend.
**Rationale**: Frontend autofill provides immediate visual feedback. Backend fallback provides data integrity in case clients skip sending the field.

### Decision: Date Validation
**Choice**: Validate the date in `ItinerarioService.crearDiaItinerario` and add HTML5 `min`/`max` in the frontend `input[type="date"]`.
**Alternatives considered**: Only frontend validation.
**Rationale**: Backend validation is required for security and consistency, throwing `IllegalArgumentException`. Frontend validation improves UX.

## Data Flow

    Frontend Forms ───(Optional destinoId)───→ Actividad API / Controller
         │
    Select Actividad ───(Auto-fill time)───→ ItemItinerario Form
         │
    Submit DiaItinerario ───(Validate Range)───→ ItinerarioService

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/features/actividades/types/actividad.ts` | Modify | Make `destinoId` optional in `ActividadRequestDTO`. |
| `frontend/src/features/actividades/components/ActividadForm.tsx` | Modify | Make `destinoId` optional, accept `planificacionId` as fallback. |
| `frontend/src/features/planificaciones/components/detail/ActividadesSection.tsx` | Modify | Remove `disabled` guard for no destinations. Add optional state to `destinoId` in modal. |
| `backend/src/main/java/com/travelplanner/api/planificaciones/ItinerarioService.java` | Modify | Add `ActividadRepository` dependency. Validate date range in `crearDiaItinerario`. Set `horaInicio` from `Actividad` in `crearItem` if missing. |
| `frontend/src/features/planificaciones/pages/PlanificacionDetailPage.tsx` | Modify | Pass `planificacion.fechaInicio` and `fechaFin` to `ItinerarioSection`. |
| `frontend/src/features/planificaciones/components/detail/ItinerarioSection.tsx` | Modify | Add `min`/`max` to date picker. Pre-fill `horaInicio` when selecting an `ACTIVIDAD` reference. |

## Interfaces / Contracts

```typescript
// frontend/src/features/actividades/types/actividad.ts
export interface ActividadRequestDTO {
  planificacionId?: number;
  destinoId?: number; // Now optional
  nombre: string;
  fechaHora: string;
  notas: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit (Backend) | `ItinerarioService` Date bounds | Test `crearDiaItinerario` throws exception if date is outside plan bounds. |
| Unit (Backend) | `ItinerarioService` Time autofill | Test `crearItem` with `ACTIVIDAD` without `horaInicio` inherits activity's time. |
| E2E | Itinerary Creation UX | Verify selecting an activity auto-fills time, and dates out of bounds are unselectable. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. The database schema already permits `destino_id` to be null.

## Open Questions

- None
