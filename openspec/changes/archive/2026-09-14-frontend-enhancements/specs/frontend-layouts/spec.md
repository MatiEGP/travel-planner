# frontend-layouts Specification Delta

## MODIFIED Requirements

### Requirement: Discovery Layout Rendering

The system MUST wrap the Landing Page and exploration pages in a `DiscoveryLayout`. All navigation elements within the layout MUST use client-side routing (e.g., `<Link>`) to prevent full browser reloads.

#### Scenario: User visits Landing Page

- GIVEN the user navigates to the Landing Page
- WHEN the page renders
- THEN the system MUST render the `DiscoveryLayout` with a full-bleed structure without overlapping with other layout wrappers
- AND the `DiscoveryNavbar` MUST transition from transparent to solid on scroll
- AND the app name/logo MUST function as a link routing to the home page (`/`)
- AND the `DiscoveryNavbar` MUST NOT include a "Discover" link, leaving "Planificaciones" as the primary navigation link.
