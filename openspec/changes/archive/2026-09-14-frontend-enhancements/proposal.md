# Proposal: Frontend Enhancements

## Intent
Resolve architectural misalignments in the layout structure (double navbars, non-SPA routing) and restore critical plan management capabilities (CRUD). Refine the UI based on explicit user requests: removing unused navigation, ensuring responsive grids, and restoring interactivity to itinerary cards.

## Scope

### In Scope
- Restructure `router/index.tsx` to prevent `MainLayout` and `PlannerLayout` from overlapping.
- Replace all raw `<a>` tags with React Router `<Link>` components in the navigation shell.
- Make the app name/logo route to the home page (`/`).
- Remove the "Discover" button from the navbar, leaving only "Planificaciones".
- Refactor the plans list into a responsive CSS grid (approx 3 cards per row on desktop).
- Make plan cards clickable to enter a full detail view.
- Restore the "Delete" button capability directly on each plan card.

### Out of Scope
- Backend API changes (relying on existing endpoints).
- Deep nested data loading for inner destinations/activities.
- Full design system migration of legacy pages (Login, Register).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `frontend-layouts`: Routing structure is shifting from nested wrappers to direct layout components; navbar is losing the "Discover" link and gaining a working Home link.
- `itinerary-visualizer`: The plan cards are shifting from a 1-column list to a responsive 3-column grid, gaining a "Delete" action, and becoming clickable links.

## Approach
Implement Approach 1 (Core Layout Architecture & CRUD Restoration) combined with the UI tweaks. We will clean up `router/index.tsx`, update `DiscoveryNavbar.tsx` and `PlannerSidebar.tsx` to use `<Link>`, and refactor `PlanificacionesPage.tsx` to use a responsive Tailwind grid (`grid-cols-1 md:grid-cols-3`). We will re-wire the deletion handler from the page level down to the modified `PlanificacionCard`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/router/index.tsx` | Modified | Fixing the `MainLayout` wrapping issue. |
| `frontend/src/components/layout/DiscoveryNavbar.tsx` | Modified | Removing Discover button, changing to `<Link>`, linking logo. |
| `frontend/src/components/layout/PlannerSidebar.tsx` | Modified | Changing to `<Link>`. |
| `frontend/src/pages/PlanificacionesPage.tsx` | Modified | Implementing 3-column responsive grid, restoring delete handler. |
| `frontend/src/components/itinerary/PlanificacionCard.tsx` | Modified | Making card clickable, adding delete button and click handler prop. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Routing bugs when changing layout wrappers | Medium | Verify that all protected/public routes render with the correct shell without nesting. |
| Deletion state not updating locally | Low | Ensure the page state updates optimistically or triggers a re-fetch after deletion. |

## Rollback Plan
Revert the PR or feature branch and discard changes to the router, page, and components.

## Dependencies
- Existing backend API for deletion must be functional.

## Success Criteria
- [ ] Navigating between pages does not trigger a full browser reload.
- [ ] No double navbars are visible on the Home or Planificaciones pages.
- [ ] Clicking the app logo navigates to `/`.
- [ ] "Discover" button is gone.
- [ ] Plans display in a responsive grid (3 per row on wide screens).
- [ ] Clicking a plan card routes to its detail view.
- [ ] Clicking delete successfully removes the plan.
