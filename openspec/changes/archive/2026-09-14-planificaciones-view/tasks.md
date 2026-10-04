# Tasks: Modern Planificaciones View

## Phase 1: Foundation & Design Tokens Setup
- [x] 1.1 Ensure Lucide React icon library integration and date helper utilities (`getTripStatus`, `formatDateRange`, `getCoverImage`).
- [x] 1.2 Create `QuickCreateCard` component following dashed border and circular action button specifications.

## Phase 2: Card & Modal Modernization
- [x] 2.1 Refactor `PlanificacionCard` with immersive cover image, glassmorphism status badges ("Próximo", "En curso", "Finalizado"), floating heart button, and formatted dates.
- [x] 2.2 Refactor `PlanificacionFormModal` with `#F1F3F4` borderless inputs, Coral `#FF5A5F` primary button, accessible labels, and smooth backdrop.

## Phase 3: Page Integration & Pill Tabs Filtering
- [x] 3.1 Implement `PlanificacionesPage` with `#F7F9FA` background, H1 "Mis Viajes", Pill Tabs ("Próximos Viajes" / "Viajes Pasados"), "+ Crear Planificación" Coral button, and responsive grid (`gap-8`).
- [x] 3.2 Wire state management, optimistic creation, and filtering between upcoming/in-progress and past trips.

## Phase 4: Verification & Automated Tests
- [x] 4.1 Update and expand unit tests for `PlanificacionCard` and `PlanificacionesPage`.
- [x] 4.2 Run `npm run build`, `npm run lint`, and `npm test` to ensure 100% type safety, clean lints, and test coverage.

