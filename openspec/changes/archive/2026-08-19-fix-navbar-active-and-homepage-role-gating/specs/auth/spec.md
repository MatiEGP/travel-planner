# Delta for `auth`

## MODIFIED Requirements

### Requirement: REQ-FE-004 — Role-Based Route and Component Gating

The frontend **MUST** support role-based gating for administrative routes, UI controls, and landing page actions. On the home page (`/`), the system **MUST** render "Panel de Administración" only for users with `ROLE_ADMIN`, and **MUST** hide it from unauthenticated visitors and standard clients (`ROLE_CLIENT`).
(Previously: Unrestricted rendering of administration button on home page for all users)

#### Scenario 1: Client Viewing Home Page
- **GIVEN** an authenticated user with `ROLE_CLIENT`
- **WHEN** the user views the home page (`/`)
- **THEN** the application renders "Mis Planificaciones"
- **AND** does NOT render the "Panel de Administración" button.

#### Scenario 2: Admin Viewing Home Page
- **GIVEN** an authenticated user with `ROLE_ADMIN`
- **WHEN** the user views the home page (`/`)
- **THEN** the application renders both "Mis Planificaciones" and "Panel de Administración".

#### Scenario 3: Unauthenticated Visitor Viewing Home Page
- **GIVEN** a guest visitor (`isAuthenticated = false`)
- **WHEN** the visitor views the home page (`/`)
- **THEN** the application renders guest call-to-action buttons ("Registrarse", "Iniciar sesión")
- **AND** does NOT render the "Panel de Administración" button.

#### Scenario 4: Admin Accessing Admin Route
- **GIVEN** an authenticated user with `ROLE_ADMIN`
- **WHEN** navigating to `/admin` or `/admin/usuarios`
- **THEN** the route renders the administration dashboard without restriction.

---

### Requirement: REQ-FE-005 — Registration & Login Navigation and Active State Indication

The UI **MUST** provide registration and login access via the navbar and dedicated views. Navbar items for `/login` and `/register` **MUST** dynamically display active visual state indicators when the user is currently visiting those routes.
(Previously: Auth links in navbar did not reflect active router state)

#### Scenario 1: Active Login Route Indication
- **GIVEN** a visitor navigating to `/login`
- **WHEN** the header component renders
- **THEN** the "Iniciar sesión" navbar button is visually styled with active state highlighting.

#### Scenario 2: Active Register Route Indication
- **GIVEN** a visitor navigating to `/register`
- **WHEN** the header component renders
- **THEN** the "Registrarse" navbar button is visually styled with active state highlighting.

#### Scenario 3: Unselected Auth State on Other Pages
- **GIVEN** a visitor browsing the home page (`/`)
- **WHEN** the header component renders
- **THEN** "Inicio" is marked as active and neither "Iniciar sesión" nor "Registrarse" is styled as active.
