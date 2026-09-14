# Tasks: Planificacion Detail View

## Review Workload Forecast

| Metric | Estimate |
|---|---|
| Estimated changed lines | ~750 lines |
| 400-line budget risk | High |
| Chained PRs recommended | No |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

---

## Phase 1: Foundation (Types & API Services)

- [x] 1.1 Create `frontend/src/features/planificaciones/types/costo.ts` (`CostoRequestDTO`, `CostoResponseDTO`) and update `types/itinerario.ts` (`DiaItinerarioRequestDTO`, `DiaItinerarioResponseDTO`, `ItemItinerarioRequestDTO`, `ItemItinerarioResponseDTO`).
- [x] 1.2 Implement `frontend/src/features/planificaciones/api/costoService.ts` using Axios `apiClient` (`getByPlanificacion`, `create`, `delete`).
- [x] 1.3 Refactor `frontend/src/features/planificaciones/api/itinerarioService.ts` to Axios `apiClient` with typed DTO endpoints.
- [x] 1.4 Update `frontend/src/features/actividades/api/actividadService.ts` to add `getByPlanificacion(planificacionId)`.

---

## Phase 2: Detail Subcomponents

- [x] 2.1 Implement `TripDetailHeader.tsx` (hero cover image, dates, status badge, stats summary).
- [x] 2.2 Implement `TripAnchorNav.tsx` (sticky left desktop navigation with IntersectionObserver active pill tracking).
- [x] 2.3 Implement `TripBottomNav.tsx` (sticky mobile bottom navigation bar).
- [x] 2.4 Implement `DestinosSection.tsx` (16:9 destination cards, notes, and add modal trigger).
- [x] 2.5 Implement `ActividadesSection.tsx` (destination-grouped activities with status/time badges and creation form).
- [x] 2.6 Implement `GastosSection.tsx` (expense categorization, total sum calculations, and `#10B981` budget indicators).
- [x] 2.7 Implement `ItinerarioSection.tsx` (chronological day tabs and time-slotted item list).
- [x] 2.8 Implement `TripDetailSidebar.tsx` (sticky right sidebar with quick action buttons and mini-calendar summary).

---

## Phase 3: Page Integration & Routing

- [x] 3.1 Implement `PlanificacionDetailPage.tsx` container orchestrating parallel `Promise.all` data loading, error/loading states, and responsive 3-column layout.
- [x] 3.2 Register route `/planificaciones/:planificacionId` in `frontend/src/router/index.tsx` under protected routing.
- [x] 3.3 Update `frontend/src/components/itinerary/PlanificacionCard.tsx` click navigation to `/planificaciones/:planificacionId`.

---

## Phase 4: Testing & Verification

- [x] 4.1 Create unit tests for `costoService` and `itinerarioService` API client operations.
- [x] 4.2 Create component tests for `TripDetailHeader`, `TripAnchorNav`, `GastosSection`, and `ItinerarioSection`.
- [x] 4.3 Create integration test for `PlanificacionDetailPage` validating concurrent data fetching, rendering, and modal interactions.
- [x] 4.4 Run `npm run build`, `npm run lint`, and `npm test` across frontend suites to ensure 0 errors.
