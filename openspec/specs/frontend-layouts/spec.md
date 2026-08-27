# frontend-layouts Specification

## Purpose

Provides distinct layout structures for different workflows within the travel planner application, specifically a Discovery workflow and a Planner workflow. The UI system incorporates an organic, fluid design language avoiding derivative naming (e.g., no "Wander" prefixes).

## Requirements

### Requirement: Discovery Layout Rendering

The system MUST wrap the Landing Page and exploration pages in a `DiscoveryLayout`.

#### Scenario: User visits Landing Page

- GIVEN the user navigates to the Landing Page
- WHEN the page renders
- THEN the system MUST render the `DiscoveryLayout` with a full-bleed structure
- AND the `DiscoveryNavbar` MUST transition from transparent to solid on scroll.

### Requirement: Planner Layout Rendering

The system MUST wrap trip-planning views (e.g., Planificaciones View) in a `PlannerLayout`.

#### Scenario: User manages a trip

- GIVEN the user is on the Planificaciones view
- WHEN the view loads
- THEN the system MUST render a 3-column app shell (left sidebar, center content, right sidebar)
- AND the sidebars MUST collapse gracefully on mobile viewports.

### Requirement: Layout Data Error Boundary

The system MUST wrap layout data fetching hooks with an ErrorBoundary to handle API failures gracefully.

#### Scenario: API fails or returns partial data

- GIVEN the user is navigating within a layout (e.g., PlannerLayout)
- WHEN the data fetching hook encounters an API error or receives partial data
- THEN the system MUST catch the error using the ErrorBoundary
- AND the system MUST display a fallback UI without crashing the entire application shell.
