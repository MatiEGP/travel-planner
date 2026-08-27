# itinerary-visualizer Specification

## Purpose

A nested UI capability designed to render trip data in a hierarchical, interactive card format: Planificaciones > Destinos > Actividades. It provides users with a clear visual representation of their itineraries using organic, fluid aesthetics.

## Requirements

### Requirement: Hierarchical Rendering

The system MUST render itinerary data using nested components: `PlanificacionCard` containing `MiniDestinoCard`s, containing `ActivityListItem`s.

#### Scenario: User views a populated Planificacion

- GIVEN the user has a trip with multiple destinations and activities
- WHEN the Planificaciones view renders
- THEN the `PlanificacionCard` MUST display a scrollable list of `MiniDestinoCard` components
- AND each `MiniDestinoCard` MUST display a compact list of `ActivityListItem` elements.

#### Scenario: User views an empty Planificacion

- GIVEN the user has a trip with no destinations added yet
- WHEN the `PlanificacionCard` renders
- THEN the system MUST display a user-friendly empty state placeholder
- AND the system MUST NOT render empty destination cards.
