# planificacion-detail-view Specification

## Purpose

Provides a unified, Wanderlog-inspired detail view for travel itineraries (`/planificaciones/:planificacionId`) that centralizes destinations, activities, expenses, and day-by-day chronological timeline items into an interactive 3-column dashboard.

## Requirements

### Requirement: REQ-PDV-001 — Responsive 3-Column Layout & Navigation

The system MUST render `/planificaciones/:planificacionId` in a 3-column layout on desktop (Sticky Left Anchor Nav, Center Content Stream, Sticky Right Quick Actions + Mini-Calendar) and MUST collapse sidebars into a mobile-first layout with a sticky bottom anchor navigation bar. The left anchor navigation MUST track active sections in real time via Intersection Observer.

#### Scenario: Desktop Navigation
- GIVEN a user viewing an itinerary on a desktop viewport (>= 1024px)
- WHEN the page renders
- THEN the system MUST display the Sticky Left Anchor Nav, the Center Stream, and the Sticky Right Quick Actions + Mini-Calendar
- AND scrolling through sections MUST highlight the corresponding active anchor pill.

#### Scenario: Mobile Viewport
- GIVEN a user viewing an itinerary on a mobile viewport (< 768px)
- WHEN the page renders
- THEN the system MUST hide desktop sidebars and render a sticky bottom anchor bar.

---

### Requirement: REQ-PDV-002 — Destinos Management Section

The Destinos section MUST render all associated destination cards with 16:9 or 4:3 cover photos, city/country labels, and notes. The section MUST provide a creation modal to add new destinations.

#### Scenario: Viewing and Adding Destinations
- GIVEN an itinerary with destinations
- WHEN the user views the Destinos section
- THEN the system MUST render each destination card with cover image, location, and notes
- AND clicking the add destination button MUST open a modal form to submit a new destination.

---

### Requirement: REQ-PDV-003 — Actividades Section

The Actividades section MUST group activities by destination and render them with date/time badges, status indicators, and an activity creation form.

#### Scenario: Displaying Activities
- GIVEN an itinerary with destinations and scheduled activities
- WHEN the user views the Actividades section
- THEN the system MUST group activities under their respective destination cards
- AND each activity MUST display its title, date/time, and status badge.

---

### Requirement: REQ-PDV-004 — Gastos & Budget Summary

The Gastos section MUST categorize expenses by stay, transport, food, and activities, displaying individual costs alongside a total budget summary with `#10B981` badges and color tokens.

#### Scenario: Expense Aggregation
- GIVEN an itinerary with recorded expenses across multiple categories
- WHEN the user views the Gastos section
- THEN the system MUST calculate and render the total cost sum
- AND the system MUST display category breakdown badges styled with `#10B981`.

---

### Requirement: REQ-PDV-005 — Itinerario Chronological Timeline

The Itinerario section MUST render interactive chronological day tabs (`DiaItinerario`) and time-slotted items (`ItemItinerario`), allowing users to inspect and add items per day.

#### Scenario: Timeline Browsing
- GIVEN an itinerary spanning multiple days
- WHEN the user navigates the Itinerario section
- THEN the system MUST display sorted `DiaItinerario` tabs
- AND selecting a day MUST display all its scheduled `ItemItinerario` elements.

---

### Requirement: REQ-PDV-006 — Routing & Navigation Direct Integration

The application router MUST register `/planificaciones/:planificacionId` under protected routing, and clicking any `PlanificacionCard` MUST navigate directly to its detail route.

#### Scenario: Navigating from List to Detail
- GIVEN an authenticated user on `/planificaciones`
- WHEN the user clicks a `PlanificacionCard`
- THEN the application MUST navigate directly to `/planificaciones/:planificacionId`.
