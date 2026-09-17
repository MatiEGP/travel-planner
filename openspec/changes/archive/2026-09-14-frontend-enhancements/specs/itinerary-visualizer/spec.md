# itinerary-visualizer Specification Delta

## ADDED Requirements

### Requirement: Responsive Grid Presentation

The system MUST display the collection of itinerary plans in a responsive grid layout.

#### Scenario: User views the plans list on desktop

- GIVEN the user is on the Planificaciones view and has multiple plans
- WHEN the plans list renders on a wide viewport
- THEN the system MUST display the `PlanificacionCard` components in a 3-column grid layout.

### Requirement: Card Interactivity and Actions

The `PlanificacionCard` component MUST support user actions directly on the card to navigate to details or delete the plan.

#### Scenario: User clicks on a plan card

- GIVEN a rendered `PlanificacionCard`
- WHEN the user clicks the card
- THEN the system MUST route the user to the full detail view for that specific plan.

#### Scenario: User deletes a plan from the card

- GIVEN a rendered `PlanificacionCard`
- WHEN the user clicks the "Delete" action on the card
- THEN the system MUST successfully remove the plan and the UI MUST update to reflect the deletion.
