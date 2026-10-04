# Delta for itinerary-visualizer

## MODIFIED Requirements

### Requirement: Hierarchical Rendering

The system MUST render itinerary data using nested components representing domain v2 entities: iterating over `DiaItinerario` and `ItemItinerario`, and aggregating or displaying `Costo` correctly. All items MUST be loaded at once without pagination or infinite scroll.
(Previously: The system MUST render itinerary data using nested components: `PlanificacionCard` containing `MiniDestinoCard`s, containing `ActivityListItem`s.)

#### Scenario: User views a populated Planificacion

- GIVEN the user has a trip with multiple days, items, and costs
- WHEN the Planificaciones view renders
- THEN the itinerary components MUST display a complete list of `DiaItinerario` components
- AND each day MUST display all its `ItemItinerario` elements at once (no pagination)
- AND the aggregated `Costo` MUST be displayed accurately.

#### Scenario: User views an empty Planificacion

- GIVEN the user has a trip with no days or items added yet
- WHEN the itinerary components render
- THEN the system MUST display an empty state containing an "add your first destination" button
- AND the system MUST NOT render empty day cards.

## ADDED Requirements

### Requirement: Itinerary Data Fallback

The system MUST handle API failures gracefully when loading itinerary data.

#### Scenario: API returns partial data or fails

- GIVEN the user requests itinerary data
- WHEN the API fails or returns incomplete data structures for days or items
- THEN the system MUST show an ErrorBoundary fallback UI
- AND the system MUST NOT crash the entire layout.
