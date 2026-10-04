# Delta for `auth`

## MODIFIED Requirements

### Requirement: REQ-FE-003 — Protected Routes & Post-Login Redirection (`state.from`)

The frontend **MUST** enforce route guards (`ProtectedRoute`) that check `isAuthenticated` and redirect unauthenticated users to `/login`, storing the attempted location in `location.state.from`. Post-login and post-registration redirection **MUST** return users to `location.state.from` if available; otherwise, it **MUST** default to the home page (`/`).
(Previously: Defaulted post-login fallback to `/planificaciones` when navigating directly or from public pages)

#### Scenario 1: Intercepted Unauthorized Access
- **GIVEN** an unauthenticated visitor navigating to a protected route `/destinos/1/actividades`
- **WHEN** `ProtectedRoute` evaluates the session
- **THEN** the visitor is redirected to `/login` with `state: { from: location }`.

#### Scenario 2: Direct Login Navigation
- **GIVEN** an unauthenticated visitor navigating directly to `/login` without prior route state
- **WHEN** the user successfully logs in
- **THEN** the application redirects the user to the home page (`/`).

#### Scenario 3: Header Link Navigation
- **GIVEN** a visitor browsing a public view (e.g. `/`) who clicks "Iniciar sesión"
- **WHEN** the user successfully logs in
- **THEN** the application redirects the user back to the originating public view (`/`).

---

### Requirement: REQ-FE-007 — Guest Route Protection for Login and Registration

The frontend **MUST** provide a declarative `GuestRoute` wrapper around guest-only routes (`/login`, `/register`, `/registro`). If an authenticated user attempts to access these routes, the system **MUST** automatically redirect them to their target destination or default to the home page (`/`) without rendering guest form content.
(Previously: Defaulted guest route redirection to `/planificaciones`)

#### Scenario 1: Authenticated User Navigates to Login Directly
- **GIVEN** an active authenticated session (`isAuthenticated = true`)
- **WHEN** the user navigates directly to `/login` or `/register` without route state
- **THEN** `GuestRoute` redirects the user to `/` with `replace: true`
- **AND** the login/register forms are not rendered.

#### Scenario 2: Unauthenticated User Navigates to Login
- **GIVEN** an unauthenticated visitor (`isAuthenticated = false`, `isLoading = false`)
- **WHEN** the user navigates to `/login`
- **THEN** `GuestRoute` renders the child login view normally.

#### Scenario 3: Session Still Loading
- **GIVEN** an initial application load where `isLoading = true`
- **WHEN** the user navigates to `/login`
- **THEN** `GuestRoute` renders the loading spinner until hydration completes.
