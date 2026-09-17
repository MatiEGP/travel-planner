# Tasks: fix-activities-itinerary-ux

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~80 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Not needed |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Full implementation | PR 1 | `cd backend && mvnw -B clean verify` | N/A (E2E manual UI check) | Revert the single PR |

## Phase 1: Backend API Changes

- [x] 1.1 Add `ActividadRepository` dependency to `ItinerarioService` in `backend/src/main/java/com/travelplanner/api/planificaciones/ItinerarioService.java`.
- [x] 1.2 RED: Write failing test in backend for `ItinerarioService.crearDiaItinerario` out of bounds date.
- [x] 1.3 GREEN: Update `crearDiaItinerario` in `ItinerarioService.java` to validate `dia.getFecha()` against `planificacion.getFechaInicio()` and `getFechaFin()`.
- [x] 1.4 RED: Write failing test in backend for `ItinerarioService.crearItem` missing `horaInicio`.
- [x] 1.5 GREEN: Update `crearItem` in `ItinerarioService.java` to fetch `Actividad` and fallback to its `fechaHora` time if `horaInicio` is empty.

## Phase 2: Frontend Data Types and Forms

- [x] 2.1 Update `ActividadRequestDTO` in `frontend/src/features/actividades/types/actividad.ts` to make `destinoId` optional and add optional `planificacionId`.
- [x] 2.2 Update `ActividadForm` in `frontend/src/features/actividades/components/ActividadForm.tsx` to handle optional `destinoId` and `planificacionId` props.
- [x] 2.3 Modify `frontend/src/features/planificaciones/components/detail/ActividadesSection.tsx` to remove the disabled guard, allowing creation of standalone activities without a destination.

## Phase 3: Frontend Itinerary UI

- [x] 3.1 Pass `planificacion.fechaInicio` and `planificacion.fechaFin` as props to `ItinerarioSection` in `frontend/src/features/planificaciones/pages/PlanificacionDetailPage.tsx`.
- [x] 3.2 Update `ItinerarioSectionProps` in `frontend/src/features/planificaciones/components/detail/ItinerarioSection.tsx` to receive the new date limits.
- [x] 3.3 Apply `min` and `max` attributes to the `#modal-day-fecha` input in `ItinerarioSection.tsx` using the provided date limits.
- [x] 3.4 In `ItinerarioSection.tsx`, update the activity selection logic to auto-fill `itemFormData.horaInicio` with the time extracted from the selected activity's `fechaHora`.

## Phase 4: Testing & Verification

- [x] 4.1 REFACTOR: Run `npm run lint` and `npm run build` in the frontend to ensure type correctness.
- [x] 4.2 Verify E2E behavior manually to ensure activities can be created without destinations and itinerary items respect date bounds.
