# Spec: Planificaciones View & Travel Cards

## Feature: My Trips Dashboard (`/planificaciones`)

### Scenario: Viewing upcoming and past trips with pill tabs
- **GIVEN** an authenticated user on the `/planificaciones` page
- **WHEN** the page loads
- **THEN** the H1 heading MUST display "Mis Viajes"
- **AND** a pill tab group MUST display "Próximos Viajes" (active by default) and "Viajes Pasados"
- **AND** a Coral "+ Crear Planificación" button MUST be displayed in the header.

### Scenario: Tab filtering by date status
- **GIVEN** user has trips scheduled in the future, currently active, and completed in the past
- **WHEN** the user selects the "Próximos Viajes" tab
- **THEN** the grid SHALL display the Quick Create card followed by trips whose end date is >= today (Upcoming and In Progress)
- **WHEN** the user selects the "Viajes Pasados" tab
- **THEN** the grid SHALL display the Quick Create card followed by trips whose end date is < today (Completed).

### Scenario: Quick Create Card interaction
- **GIVEN** the travel trips grid
- **WHEN** the user views the grid on either tab
- **THEN** the first card in the grid MUST be the Quick Create card with a dashed border, a circular '+' button, and the label "Crear nueva planificación"
- **WHEN** the user clicks anywhere on the Quick Create card or the '+' button
- **THEN** the `PlanificacionFormModal` MUST open.

### Scenario: Travel Card visual tokens & content
- **GIVEN** a trip entity with title, description, start date, and end date
- **WHEN** the card renders
- **THEN** it MUST feature a 16:9 or 4:3 cover image with rounded corners and no hard solid borders
- **AND** a glassmorphism badge MUST appear on the top-left of the image indicating:
  - "⏰ Próximo" if start date is in the future
  - "✈️ En curso" if today is between start date and end date
  - "✅ Finalizado" if end date is in the past
- **AND** a floating heart button MUST appear on the top-right of the image
- **AND** the trip title, truncated description, and formatted date range with a calendar icon MUST be displayed
- **AND** clicking the card MUST navigate to `/planificaciones/:id/destinos`.
