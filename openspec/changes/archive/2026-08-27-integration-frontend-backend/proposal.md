# Proposal: Integration of Frontend Layout and Backend Domain v2

## Intent
Integrate the refactored frontend layout (`feature/frontend-layout-refactor-v2`) with the new backend domain entities (`feature/evolucion-dominio-v2`) so that the UI can accurately fetch and render `Costo`, `DiaItinerario`, and `ItemItinerario` data.

## Scope

### In Scope
- Wire the itinerary details page to the new domain v2 APIs.
- Display `Costo`, `DiaItinerario`, and `ItemItinerario` data in the new frontend layout.
- Update data fetching hooks/services on the frontend to handle the new backend payloads.

### Out of Scope
- Modifying backend database schemas or business logic.
- Redesigning other pages beyond the itinerary and layout affected by these features.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `frontend-layouts`: Update data bindings and hooks to support the new backend entities.
- `itinerary-visualizer`: Update models and components to display `Costo`, `DiaItinerario`, and `ItemItinerario`.

## Approach
Update the API services in the frontend to correctly type and request the new endpoints. Refactor the relevant itinerary visualization components in the new layout to iterate over `DiaItinerario` and `ItemItinerario`, and aggregate or display `Costo` correctly.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/frontend/components/` | Modified | Update UI components to accept new data structures |
| `src/frontend/services/` | Modified | Update API fetching and typings |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Data structure mismatch between FE/BE | Medium | Use strict TypeScript interfaces generated or mapped precisely to BE payloads |
| UI performance with large itineraries | Low | Ensure list rendering uses proper keys and pagination/lazy loading if necessary |

## Rollback Plan
Revert the frontend UI to use the previous API endpoints and previous component state by reverting the PR. Since the backend changes were additive or separate, old endpoints might still be available, or we just rollback the integration commit.

## Dependencies
- Backend domain v2 endpoints must be deployed and accessible.

## Success Criteria
- [ ] Frontend successfully fetches `DiaItinerario`, `ItemItinerario`, and `Costo` without errors.
- [ ] The new layout renders these entities accurately in the itinerary view.
- [ ] End-to-end user flow for viewing an itinerary works correctly.

## Proposal question round
- Are there specific edge cases for empty states when an itinerary has no items or costs yet?
- Do we need to support pagination or infinite scrolling for `ItemItinerario` if a day has many items?
- What are the fallback behaviors if the backend API returns partial data?
