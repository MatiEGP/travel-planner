# Delta for planificacion-detail-view

## MODIFIED Requirements

### Requirement: REQ-PDV-003 — Actividades Section

The Actividades section MUST group activities by destination (or as general activities), render them with date/time badges and status indicators, and provide an activity creation form. The form MUST allow creating standalone activities directly linked to the itinerary (without requiring a specific destination) if no destination is selected or required.

(Previously: The Actividades section MUST group activities by destination and render them with date/time badges, status indicators, and an activity creation form.)

#### Scenario: Displaying Activities
- GIVEN an itinerary with destinations and scheduled activities
- WHEN the user views the Actividades section
- THEN the system MUST group activities under their respective destination cards
- AND each activity MUST display its title, date/time, and status badge.

#### Scenario: Creating Standalone Activities
- GIVEN a user creating an activity in the Actividades section
- WHEN the user fills out the form without selecting a destination
- THEN the system MUST save the activity linked directly to the `planificacionId`
- AND render the standalone activity in a general activities list.

### Requirement: REQ-PDV-005 — Itinerario Chronological Timeline

The Itinerario section MUST render interactive chronological day tabs (`DiaItinerario`) and time-slotted items (`ItemItinerario`), allowing users to inspect and add items per day. When adding a new day, the system MUST enforce that the selected date falls within the `Planificacion` date range, restricting the date picker and validating on the backend. When adding an activity to the itinerary, the system MUST pre-fill the item's start time (`horaInicio`) using the activity's date/time (`fechaHora`).

(Previously: The Itinerario section MUST render interactive chronological day tabs (DiaItinerario) and time-slotted items (ItemItinerario), allowing users to inspect and add items per day.)

#### Scenario: Timeline Browsing
- GIVEN an itinerary spanning multiple days
- WHEN the user navigates the Itinerario section
- THEN the system MUST display sorted `DiaItinerario` tabs
- AND selecting a day MUST display all its scheduled `ItemItinerario` elements.

#### Scenario: Date Range Validation for Itinerary Days
- GIVEN an itinerary with defined start and end dates
- WHEN the user attempts to add a new `DiaItinerario`
- THEN the date picker MUST restrict selection to dates within the itinerary's range
- AND the backend MUST reject any day creation request outside this range with a 400 Bad Request.

#### Scenario: Activity Start Time Auto-fill
- GIVEN a user scheduling an existing activity into a `DiaItinerario`
- WHEN the user selects the activity from the item creation form
- THEN the system MUST pre-fill the start time input with the activity's scheduled time
- AND if submitted without a time, the backend MUST fallback to the activity's time.
