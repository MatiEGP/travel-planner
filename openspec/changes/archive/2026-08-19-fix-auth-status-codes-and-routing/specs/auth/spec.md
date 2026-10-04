# Delta for `auth`

## ADDED Requirements

### Requirement: REQ-FE-007 — Guest Route Protection for Login and Registration

The frontend **MUST** provide a declarative `GuestRoute` wrapper around guest-only routes (`/login`, `/register`, `/registro`). If an authenticated user attempts to access these routes, the system **MUST** automatically redirect them to `/planificaciones` (or their intended destination) without flashing guest form content.

#### Scenario: Authenticated User Navigates to Login
- **GIVEN** an active authenticated session (`isAuthenticated = true`)
- **WHEN** the user navigates directly to `/login` or `/register`
- **THEN** `GuestRoute` redirects the user to `/planificaciones` with `replace: true`
- **AND** the login/register forms are not rendered.

#### Scenario: Unauthenticated User Navigates to Login
- **GIVEN** an unauthenticated visitor (`isAuthenticated = false`, `isLoading = false`)
- **WHEN** the user navigates to `/login`
- **THEN** `GuestRoute` renders the child login view normally.

#### Scenario: Session Still Loading
- **GIVEN** an initial application load where `isLoading = true`
- **WHEN** the user navigates to `/login`
- **THEN** `GuestRoute` renders the loading spinner until hydration completes.

---

## MODIFIED Requirements

### Requirement: REQ-AUTH-002 — User Login

The backend **MUST** provide an endpoint `POST /api/auth/login` accepting credentials. Upon verification, the server **MUST** generate a signed JWT containing user identity and granted authorities, returning it via an `HttpOnly` cookie. If an already-authenticated user submits a valid login request, the system **MUST** overwrite the session cookie with the new credentials rather than rejecting with `403 Forbidden`.
(Previously: Authenticated users submitting login received HTTP 403 Forbidden with empty body)

#### Scenario 1: Valid Credentials
- **GIVEN** an existing active user in the system
- **WHEN** `POST /api/auth/login` is requested with correct email and password
- **THEN** the server returns HTTP status `200 OK`
- **AND** the response contains `Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict; Path=/`
- **AND** the response body contains the authenticated user DTO (`id`, `nombre`, `email`, `roles`).

#### Scenario 2: Invalid Credentials
- **GIVEN** incorrect email or password credentials
- **WHEN** `POST /api/auth/login` is requested
- **THEN** the server returns HTTP status `401 Unauthorized`
- **AND** the response body contains an `ErrorResponseDTO`
- **AND** no authentication cookie is set.

#### Scenario 3: Login While Already Authenticated (Session Overwrite)
- **GIVEN** a client sending an existing valid `token` cookie
- **WHEN** `POST /api/auth/login` is requested with valid new credentials
- **THEN** the server returns HTTP status `200 OK`
- **AND** the response contains a new `Set-Cookie` header with the updated user's JWT.

---

### Requirement: REQ-SEC-001 — JWT Cookie Extraction & Filter Chain

The Spring Boot backend **MUST** implement a `JwtAuthFilter` that inspects incoming requests for the `token` cookie, validates signature and expiration, and populates `SecurityContextHolder`. Unauthenticated requests to protected endpoints or `/api/auth/me` **MUST** trigger a custom `AuthenticationEntryPoint` that returns HTTP `401 Unauthorized` with a structured `ErrorResponseDTO` payload.
(Previously: Spring Security defaulted to Http403ForbiddenEntryPoint returning 403 Forbidden on missing credentials)

#### Scenario 1: Request with Valid Token Cookie
- **GIVEN** a request directed to a protected endpoint containing a valid `token` cookie
- **WHEN** the JWT filter processes the request
- **THEN** the filter extracts claims, constructs an `Authentication` token with assigned roles (`ROLE_ADMIN` / `ROLE_CLIENT`), and sets it in `SecurityContextHolder`
- **AND** the filter chain proceeds to the endpoint handler.

#### Scenario 2: Request without Token Cookie on Protected Endpoint
- **GIVEN** an unauthenticated request to a protected endpoint (e.g. `/api/auth/me`, `/api/planificaciones/**`)
- **WHEN** the filter chain processes the request
- **THEN** the request fails authentication and triggers `AuthenticationEntryPoint` returning HTTP `401 Unauthorized`
- **AND** the response body contains a JSON `ErrorResponseDTO` with status `401` and error message `"No autenticado"`.
