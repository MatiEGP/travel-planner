# Proposal: frontend-refactor

## Intent

Refactor the frontend architecture to support distinct layouts (Discovery vs. Planner) with an organic, travel-inspired aesthetic. We will avoid derivative names like "Wander" or "Wanderlog", introduce a fluid and natural design language, and build nested, intuitive visualizations for trip itineraries.

## Scope

### In Scope
- Modify `tailwind.config.js` with natural, fluid color palettes and organic styling (e.g., softer shadows, subtle gradients, rounded organic shapes) across all views.
- Create foundational Layout components (`DiscoveryLayout`, `PlannerLayout`).
- Develop semantic UI components (Navbars, Sidebars, Cards, Buttons).
- Redesign the Landing Page (Home) to feature an immersive, natural, and fluid travel style instead of rigid, static blocks.
- Redesign the Planificaciones View to display nested trip data visually: `Planificacion Card` > `Mini Destino Cards` > `Activity List Items`.
- Migrate existing views to use new layouts and components.

### Out of Scope
- Backend changes or new API endpoints.
- Modifying business logic or functionality.

## Capabilities

### New Capabilities
- `frontend-layouts`: Distinct layout structures for Discovery and Planner workflows.
- `itinerary-visualizer`: Nested UI capability to render Planificaciones, Destinos, and Actividades in a hierarchical, interactive card format.

### Modified Capabilities
- None

## Approach

Distinct Layouts & Organic UI System.
- **Organic Tailwind Config**: Implement fluid color transitions, natural travel tones (integrating the brand palette with organic hues), softer drop-shadows, and dynamic border radii to break away from rigid, boxy designs.
- **Discovery Layout (Home/Landing)**: Immersive, fluid layout with a transparent-to-solid navbar, full-bleed imagery, and soft transitions.
- **Planner Layout**: 3-column app shell (left sidebar, center content, right sidebar) optimized for trip management.
- **Nested Itinerary UI (Planificaciones)**: Implement hierarchical card structures. The main `PlanificacionCard` will embed a horizontally or vertically scrollable list of `MiniDestinoCard` components, each containing a compact, easily readable list of activities.
- **Naming**: Use semantic, module-based names (`DiscoveryNavbar`, `PropertyCard`, `PlannerSidebar`, `MiniDestinoCard`, `ActivityListItem`) instead of Wander-specific names.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/tailwind.config.js` | Modified | Organic, fluid design tokens and natural color palettes |
| `frontend/src/layouts/` | New | `DiscoveryLayout.tsx`, `PlannerLayout.tsx` |
| `frontend/src/pages/HomePage.tsx` | Modified | Complete redesign for natural, immersive style |
| `frontend/src/pages/PlanificacionesPage.tsx` | Modified | Nested UI integration for trip itineraries |
| `frontend/src/components/` | Modified | Semantic components replacing old ones |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| UI breakage during migration of existing pages | Medium | Migrate page-by-page and test layouts in isolation first |
| Nested UI performance issues | Low | Use virtualization or pagination if the list of activities/destinations grows too large |

## Rollback Plan

Revert the pull request/commit that introduces the layout migration and component renaming. 

## Dependencies

- None

## Success Criteria

- [ ] `tailwind.config.js` is updated with all design tokens, prioritizing natural and fluid aesthetics.
- [ ] Discovery and Planner views use their respective layout shells.
- [ ] Landing page feels organic, immersive, and styled for travelers.
- [ ] Planificaciones view displays nested cards (Planificacion -> Destinos -> Actividades).
- [ ] No "Wander" prefixed component names exist in the codebase.
