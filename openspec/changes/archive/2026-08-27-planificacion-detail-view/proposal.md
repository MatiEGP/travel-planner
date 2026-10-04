# Proposal: Planificacion Detail View (Detalle de Planificación)

## Intent
Deliver a unified, Wanderlog-inspired detail view for travel itineraries (`/planificaciones/:planificacionId`) that centralizes destinations, activities, expenses, and a day-by-day timeline into an interactive 3-column dashboard.

## Scope

### In Scope
- **3-Column Desktop / Mobile Responsive Layout**: Left sticky anchor nav with active pill tracking, Center content area, Right sticky quick actions and mini-calendar summary; mobile-first bottom bar with anchor navigation.
- **Section Modules**:
  - *Destinos*: Destination cards with cover photography (16:9/4:3), city/country, notes, and quick creation modal launcher.
  - *Actividades*: Grouped activities per destination with status, date/time badge, and creation form.
  - *Gastos (Budget/Costs)*: Expense breakdown categorized by stay, transport, food, activities with `#10B981` budget badges and total calculation.
  - *Itinerario Timeline*: Interactive chronologically ordered day tabs (`DiaItinerario`) and time-slotted items (`ItemItinerario`).
- **Design Tokens**: `#F7F9FA` background, `#FFFFFF` rounded-2xl cards with soft shadows, `#FF5A5F` coral primary CTAs, `#222222` dark secondary buttons, rounded-full pill elements.
- **Routing & Navigation**: Route `/planificaciones/:planificacionId` in `router/index.tsx` and connect `PlanificacionCard` click navigation.
- **Frontend Services & State**: Unified queries and mutations for Planificacion, Destinos, Actividades, Costos, and Itinerario with strict TypeScript types.
- **Automated Testing**: Vitest/React Testing Library unit and integration tests covering layout rendering, anchor scrolling, modal forms, and calculations.

### Out of Scope
- Backend entity/schema modifications (backend already exposes all required REST endpoints).
- Drag-and-drop timeline reordering (future enhancement).
- Offline synchronization.

## Capabilities

### New Capabilities
- `planificacion-detail-view`: Full Wanderlog-style dashboard displaying travel itinerary details across 4 sections (Destinos, Actividades, Gastos, Itinerario) with 3-column desktop and responsive mobile layout.
- `itinerario-timeline-management`: Interactive chronological itinerary days and items viewer/editor.
- `gastos-management`: Expense tracking with category breakdown and total cost summaries.

### Modified Capabilities
- `planificaciones-navigation`: Update trip cards to route directly to `/planificaciones/:planificacionId`.

## Approach
1. Define unified TypeScript types and API service clients for `Costo`, `DiaItinerario`, and `ItemItinerario`.
2. Build reusable UI components: `TripDetailHeader`, `TripAnchorNav`, `DestinosSection`, `ActividadesSection`, `GastosSection`, `ItinerarioSection`, `QuickActionSidebar`, and `MiniCalendarWidget`.
3. Assemble `PlanificacionDetailPage` with 3-column grid, responsive bottom navigation for mobile, and intersection-observer anchor spy.
4. Integrate route `/planificaciones/:planificacionId` under protected routing.
5. Add unit and integration tests for components, calculations, and interactions.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/features/planificaciones/pages/PlanificacionDetailPage.tsx` | New | Main 3-column detail view container |
| `frontend/src/features/planificaciones/components/detail/*` | New | Modular sections: Anchors, Destinos, Actividades, Gastos, Itinerario, Sidebar |
| `frontend/src/features/planificaciones/types/*` | New/Modified | Domain interfaces for Costo, DiaItinerario, ItemItinerario |
| `frontend/src/features/planificaciones/api/*` | New/Modified | Service integration for Costos and Itinerario |
| `frontend/src/router/index.tsx` | Modified | Add `/planificaciones/:planificacionId` route |
| `frontend/src/components/itinerary/PlanificacionCard.tsx` | Modified | Route directly to detail page |
| `frontend/src/features/planificaciones/__tests__/*` | New | Test suites for detail view and components |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Multi-entity data loading waterfall | Medium | Parallelize `Promise.all` fetches for destinations, costs, and days. |
| Anchor nav scroll desync | Low | Use standard `IntersectionObserver` with fallback click handlers. |

## Rollback Plan
Revert changes to `router/index.tsx` and `PlanificacionCard.tsx`, returning to the previous list view routing.

## Success Criteria
- [ ] Navigating to `/planificaciones/:id` loads complete trip details, destinations, activities, costs, and timeline.
- [ ] Desktop displays 3-column layout (Nav / Main / Sidebar); mobile displays responsive single column with bottom anchor bar.
- [ ] CRUD operations for destinations, activities, costs, and itinerary items function properly.
- [ ] Typecheck (`tsc --noEmit`), lint (`npm run lint`), and tests (`npm run test`) pass with 0 errors.
