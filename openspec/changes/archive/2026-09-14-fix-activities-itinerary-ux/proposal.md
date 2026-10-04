# Proposal: fix-activities-itinerary-ux

## Intent

Improve the UX when managing activities and itineraries. We need to allow standalone activities (without a destination), remove redundant time entry when scheduling activities into the itinerary, and prevent users from adding itinerary days outside the trip's date range.

## Scope

### In Scope
- Remove the destination requirement to create an activity in the frontend (allow linking directly to `planificacionId`).
- Automatically pre-fill `horaInicio` in `ItemItinerario` from `Actividad.fechaHora` when scheduling an activity (Backend + Frontend).
- Add backend validation in `ItinerarioService` to ensure `DiaItinerario.fecha` falls within the `Planificacion` date range (returning 400 Bad Request if out of bounds).
- Restrict the frontend date picker for `DiaItinerario` to only allow dates within the `Planificacion` range.

### Out of Scope
- Modifying the existing data model for `Actividad` or `ItemItinerario` beyond validation rules.
- Changing the layout of the `planificacion-detail-view` entirely.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `planificacion-detail-view`: Updates to the Activities and Itinerary sections to support standalone activities and enforce date boundaries.

## Approach

1. **Frontend Actividades**: Modify `ActividadForm` and its parent view to optionally accept `planificacionId` instead of strictly requiring `destinoId`. Remove the guard preventing form rendering without destinations.
2. **Backend Itinerario Time Sync**: Update `ItinerarioService.crearItem` to check if the `ItemItinerario` references an `Actividad` and, if `horaInicio` is empty, fallback to the activity's `fechaHora`. Update frontend form to pre-fill the time picker when an activity is selected.
3. **Backend Range Validation**: Update `ItinerarioService.crearDiaItinerario` to check `dia.getFecha()` against `planificacion.getFechaInicio()` and `getFechaFin()`. Throw a clear exception. Handle this gracefully in the frontend.
4. **Frontend Date Picker Constraint**: Pass `fechaInicio` and `fechaFin` from the `Planificacion` context to the itinerary day creation modal, applying `min` and `max` attributes on the date input.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/features/actividades/components/ActividadForm.tsx` | Modified | Accept `planificacionId`, make `destinoId` optional. |
| `frontend/src/features/actividades/components/...` | Modified | Remove destination block guard in activities section. |
| `backend/src/main/java/com/travelplanner/api/planificaciones/ItinerarioService.java` | Modified | Add date bounds validation; sync activity time to item. |
| `frontend/src/features/itinerario/components/...` | Modified | Pre-fill time when activity selected; Apply min/max to date picker. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Uncategorized activities break UI | Med | Ensure `planificacion-detail-view` renders standalone activities gracefully. |

## Rollback Plan

Revert the commits modifying `ActividadForm.tsx`, `ItinerarioService.java`, and the itinerary UI forms. No database migration is involved, making reverting safe.

## Success Criteria

- [ ] Activities can be created without a destination.
- [ ] Scheduling an activity automatically populates its start time in the itinerary.
- [ ] Attempting to add an itinerary day outside the plan's dates fails with a clear 400 error.
- [ ] Frontend date picker for itinerary days prevents selecting out-of-bounds dates.
