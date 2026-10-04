# Proposal: Modern Planificaciones (My Trips) View

## Intent
Transform the "/planificaciones" frontend view into a modern, accessible, Wanderlog-inspired travel itinerary dashboard matching the UX/UI specifications and reference mockup.

## Scope

### In Scope
- **Design Tokens & Palette**: Integrate `#F7F9FA` light background, `#FFFFFF` pure white cards with soft shadows (no harsh borders), `#FF5A5F` vibrant coral CTAs, and Lucide React icons.
- **Header & Filter Controls**: H1 "Mis Viajes", pill-shaped interactive tabs ("Próximos Viajes" / "Viajes Pasados"), and "+ Crear Planificación" pill button.
- **Quick Create Card**: First grid item with dashed border (`border-dashed border-2`), circular '+' button, and quick modal launcher.
- **Travel Itinerary Cards**: Immersive cards featuring cover image (16:9 / 4:3), top-left glassmorphism status badges ("Próximo", "En curso", "Finalizado"), top-right floating heart/favorite button, title, description, formatted date range with calendar icon, and destination details.
- **Modal Alignment**: Modernize `PlanificacionFormModal` to match the borderless `#F1F3F4` input styling, coral primary buttons, and accessible modal behavior.
- **Layout & Responsiveness**: Mobile-first responsive grid (`gap-8`, 1 to 3 columns) with light theme support.
- **Testing**: Unit and integration tests for tabs filtering, card rendering, status calculation, quick create interaction, and accessibility.

### Out of Scope
- Backend schema changes (uses existing Spring Boot REST endpoints).
- Drag-and-drop itinerary reordering.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/pages/PlanificacionesPage.tsx` | Rewrite | Header, pill tabs, responsive grid, quick-create card, and status filtering. |
| `frontend/src/components/itinerary/PlanificacionCard.tsx` | Rewrite | Immersive travel card with cover image, glassmorphism status badge, heart button, and date formatting. |
| `frontend/src/components/itinerary/QuickCreateCard.tsx` | New | Dedicated quick creation dropzone/card. |
| `frontend/src/components/itinerary/PlanificacionFormModal.tsx` | Update | Light theme, soft input backgrounds, Coral CTAs, accessible modal. |
| `frontend/src/components/itinerary/__tests__/PlanificacionesPage.test.tsx` | New | Comprehensive behavioral and accessibility tests. |
| `frontend/src/components/itinerary/PlanificacionCard.test.tsx` | Update | Updated test suite for modern card structure. |

## Risks & Mitigation
- **Image Loading / Fallbacks**: Remote travel photos may fail to load. *Mitigation*: Curated fallback travel image mapped by keywords or deterministic hash to ensure beautiful imagery.
- **Date Status Calculation**: Timezones and date boundaries could misclassify "En curso" vs "Próximo". *Mitigation*: Robust date helper normalizing local dates.

## Rollback Plan
Revert changes to `PlanificacionesPage.tsx`, `PlanificacionCard.tsx`, and `PlanificacionFormModal.tsx`.
