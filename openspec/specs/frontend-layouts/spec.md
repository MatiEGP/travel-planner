# frontend-layouts Specification

## Purpose

Provides distinct layout structures for different workflows within the travel planner application, specifically a Discovery workflow and a Planner workflow. The UI system incorporates an organic, fluid design language avoiding derivative naming (e.g., no "Wander" prefixes).

## Requirements

### Requirement: Discovery Layout Rendering

The system MUST wrap the Landing Page and exploration pages in a `DiscoveryLayout` rendered on a light canvas (`#F7F9FA` / `slate-50`) with a modern translucent header surface, and MUST NOT render an `/admin` navigation link. All navigation elements within the layout MUST use client-side routing (e.g., `<Link>`) to prevent full browser reloads.

#### Scenario: User visits Landing Page

- GIVEN the user navigates to the Landing Page
- WHEN the page renders
- THEN the system MUST render the `DiscoveryLayout` on a light canvas (`#F7F9FA` / `slate-50`) with a full-bleed structure without overlapping with other layout wrappers
- AND the header MUST render a light translucent surface (`bg-white/80 backdrop-blur-md`)
- AND the app name/logo MUST function as a link routing to the home page (`/`)
- AND the navigation MUST NOT include an `/admin` link or "Discover" link, leaving "Planificaciones" as the primary trip link.

### Requirement: Modern Header Navigation & Profile

The `Header` component MUST render a light translucent surface (`bg-white/80 backdrop-blur-md`), a brand logo linking to `/`, responsive navigation links for "Inicio" and "Planificaciones", a user profile widget for authenticated users, a modal logout confirmation, and authentication links for guests.

#### Scenario: Authenticated user views header and initiates logout

- GIVEN an authenticated user on any application page
- WHEN the header renders
- THEN the system MUST display the brand logo linking to `/`, navigation links, and a user profile widget displaying the user identity
- AND clicking the logout trigger MUST display a confirmation modal before invalidating the session.

#### Scenario: Guest visitor views header navigation

- GIVEN an unauthenticated visitor
- WHEN the header renders
- THEN the system MUST display "Iniciar sesión" and "Registrarse" links
- AND the user profile widget and logout action MUST NOT be rendered.

### Requirement: Modern Landing Page Experience

The landing page at `/` MUST render a modern hero section matching the light design system (`#F7F9FA` / `slate-50`), providing primary calls-to-action (CTAs) to explore trips and access authentication.

#### Scenario: Visitor navigates to landing page

- GIVEN a visitor navigating to `/`
- WHEN the page loads
- THEN the system MUST render a modern hero section with fluid typography and light surface cards
- AND the page MUST display primary action CTAs routing to planificaciones and authentication workflows.

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
