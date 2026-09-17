# Delta for frontend-layouts

## ADDED Requirements

### Requirement: Layout Data Error Boundary

The system MUST wrap layout data fetching hooks with an ErrorBoundary to handle API failures gracefully.

#### Scenario: API fails or returns partial data

- GIVEN the user is navigating within a layout (e.g., PlannerLayout)
- WHEN the data fetching hook encounters an API error or receives partial data
- THEN the system MUST catch the error using the ErrorBoundary
- AND the system MUST display a fallback UI without crashing the entire application shell.
