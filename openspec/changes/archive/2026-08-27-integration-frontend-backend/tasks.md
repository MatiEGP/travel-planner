# Tasks: integration-frontend-backend

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250-350 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: single-pr
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Complete frontend integration | PR 1 | `npm run test` | `npm run dev` (Itinerary view) | Revert the single PR |

## Phase 1: Foundation / Infrastructure

- [x] 1.1 Create `frontend/src/shared/components/ErrorBoundary.tsx` matching standard React error boundary implementation.
- [x] 1.2 Modify `frontend/src/layouts/PlannerLayout.tsx` to wrap the layout content and data hooks with `ErrorBoundary`.
- [x] 1.3 Create `frontend/src/features/planificaciones/types/itinerario.ts` defining `CostoDTO`, `ItemItinerarioDTO`, and `DiaItinerarioDTO` from the design.
- [x] 1.4 Create `frontend/src/features/planificaciones/api/itinerarioService.ts` containing API fetching methods.

## Phase 2: Core Implementation

- [x] 2.1 Create `frontend/src/features/planificaciones/components/ItemItinerarioRow.tsx` to display an individual item and its costs.
- [x] 2.2 Create `frontend/src/features/planificaciones/components/DiaItinerarioCard.tsx` to iterate over `ItemItinerarioRow` components without pagination.
- [x] 2.3 Create `frontend/src/features/planificaciones/components/ItinerarioView.tsx` to map over `DiaItinerarioCard` components, handle empty state ("add your first destination"), and aggregate `Costo`.

## Phase 3: Integration / Wiring

- [x] 3.1 Wire `ItinerarioView.tsx` into the parent page/container to receive data from `itinerarioService`.

## Phase 4: Testing

- [x] 4.1 Write unit test for `ErrorBoundary.tsx` (force throw to assert fallback UI).
- [x] 4.2 Write unit test for `itinerarioService.ts` (mock apiClient to test fetching and error handling).
- [x] 4.3 Write integration test for `ItinerarioView.tsx` (mock data, verify full hierarchical rendering and empty states).
