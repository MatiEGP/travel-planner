# Tasks: frontend-refactor

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 600-800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation/Layouts) → PR 2 (Nested Cards) → PR 3 (Page Integration) |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Tailwind config & Layout components | PR 1 | `npm run test` (mock scroll) | Serve dev & inspect layout shells | Revert layout/tailwind PR |
| 2 | Nested Itinerary Components | PR 2 | `npm run test` (card counts) | Storybook/Dev server | Revert nested cards PR |
| 3 | Page Migrations (`HomePage`, `PlanificacionesPage`) | PR 3 | `npm run test` | Click through pages in dev | Revert page migrations PR |

## Phase 1: Foundation & Layouts

- [x] 1.1 Modify `frontend/tailwind.config.js` with natural colors, shadows, and organic radii.
- [x] 1.2 Create `frontend/src/components/layout/DiscoveryNavbar.tsx` with transparent-to-solid scroll logic.
- [x] 1.3 Create `frontend/src/components/layout/PlannerSidebar.tsx`.
- [x] 1.4 Create `frontend/src/layouts/DiscoveryLayout.tsx` wrapping `DiscoveryNavbar`.
- [x] 1.5 Create `frontend/src/layouts/PlannerLayout.tsx` as a 3-column shell with `PlannerSidebar`.
- [x] 1.6 Write unit test for `DiscoveryNavbar` scroll state changes.

## Phase 2: Nested Itinerary UI

- [x] 2.1 Create `frontend/src/components/itinerary/ActivityListItem.tsx` to render a single activity.
- [x] 2.2 Create `frontend/src/components/itinerary/MiniDestinoCard.tsx` that maps activities into `ActivityListItem`s.
- [x] 2.3 Create `frontend/src/components/itinerary/PlanificacionCard.tsx` that maps destinations into `MiniDestinoCard`s.
- [x] 2.4 Write unit test for `PlanificacionCard` verifying nested child counts.

## Phase 3: Page Integration

- [x] 3.1 Modify `frontend/src/pages/HomePage.tsx` to use `DiscoveryLayout` and organic styling.
- [x] 3.2 Modify `frontend/src/pages/PlanificacionesPage.tsx` to use `PlannerLayout` and `PlanificacionCard`.

## Phase 4: Verification & Cleanup

- [x] 4.1 Verify mobile responsiveness of `PlannerLayout` in the browser.
- [x] 4.2 Verify empty states render correctly in `PlanificacionesPage.tsx`.
