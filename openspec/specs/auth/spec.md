# Specification: `jwt-security`

**Status**: PROPOSED  
**Target Scope**: Backend (Spring Boot Security) & Frontend (React 19 + TypeScript)  

---

## 1. Overview & Scope

This specification defines the functional and non-functional requirements for JWT-based authentication and authorization using an `HttpOnly` cookie strategy across the Spring Boot REST API and the React 19 single-page application.

---

## 2. Authentication & Session Lifecycle Specifications

### Requirement: REQ-AUTH-001 — User Registration
The backend **MUST** provide an endpoint `POST /api/auth/registro` (or `/api/auth/register`) accepting user details. Upon successful registration, the system **MUST** hash the password, persist the user with the default role `ROLE_CLIENT`, generate a signed JWT, and attach it to an `HttpOnly` cookie in the `Set-Cookie` response header.

- **Scenario 1: Successful Registration**
  - **GIVEN** a guest user submitting valid registration details with an unused email/username
  - **WHEN** `POST /api/auth/registro` is requested
  - **THEN** the server returns HTTP status `201 Created` (or `200 OK`)
  - **AND** the response contains a `Set-Cookie` header with `token=<jwt>; HttpOnly; SameSite=Strict; Path=/; Max-Age=<duration>`
  - **AND** the response body returns the created user profile (`id`, `nombre`, `email`, `roles`) excluding the password.

- **Scenario 2: Duplicate Registration Attempt**
  - **GIVEN** an existing email in the database
  - **WHEN** `POST /api/auth/registro` is requested with existing credentials
  - **THEN** the server returns HTTP status `400 Bad Request` or `409 Conflict`
  - **AND** no `Set-Cookie` header is returned.

---

### Requirement: REQ-AUTH-002 — User Login
The backend **MUST** provide an endpoint `POST /api/auth/login` accepting credentials. Upon verification, the server **MUST** generate a signed JWT containing user identity and granted authorities, returning it via an `HttpOnly` cookie. If an already-authenticated user submits a valid login request, the system **MUST** overwrite the session cookie with the new credentials rather than rejecting with `403 Forbidden`.

- **Scenario 1: Valid Credentials**
  - **GIVEN** an existing active user in the system
  - **WHEN** `POST /api/auth/login` is requested with correct email and password
  - **THEN** the server returns HTTP status `200 OK`
  - **AND** the response contains `Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict; Path=/`
  - **AND** the response body contains the authenticated user DTO (`id`, `nombre`, `email`, `roles`).

- **Scenario 2: Invalid Credentials**
  - **GIVEN** incorrect email or password credentials
  - **WHEN** `POST /api/auth/login` is requested
  - **THEN** the server returns HTTP status `401 Unauthorized`
  - **AND** the response body contains an `ErrorResponseDTO`
  - **AND** no authentication cookie is set.

- **Scenario 3: Login While Already Authenticated (Session Overwrite)**
  - **GIVEN** a client sending an existing valid `token` cookie
  - **WHEN** `POST /api/auth/login` is requested with valid new credentials
  - **THEN** the server returns HTTP status `200 OK`
  - **AND** the response contains a new `Set-Cookie` header with the updated user's JWT.

---

### Requirement: REQ-AUTH-003 — Session Hydration (`/me`)
The backend **MUST** provide an endpoint `GET /api/auth/me` to allow clients to verify session validity and fetch the currently authenticated user's profile and roles.

- **Scenario 1: Authenticated Session Hydration**
  - **GIVEN** an HTTP request to `GET /api/auth/me` containing a valid, unexpired `token` cookie
  - **WHEN** the request is processed
  - **THEN** the server returns HTTP status `200 OK`
  - **AND** the response body contains the user payload `{ id, nombre, email, roles }`.

- **Scenario 2: Unauthenticated / Expired Session**
  - **GIVEN** an HTTP request to `GET /api/auth/me` missing the `token` cookie or bearing an invalid/expired JWT
  - **WHEN** the request is processed
  - **THEN** the server returns HTTP status `401 Unauthorized`.

---

### Requirement: REQ-AUTH-004 — User Logout
The backend **MUST** provide an endpoint `POST /api/auth/logout` that invalidates the client session cookie by returning `Max-Age=0`.

- **Scenario 1: Successful Logout**
  - **GIVEN** an authenticated user session
  - **WHEN** `POST /api/auth/logout` is requested
  - **THEN** the server returns HTTP status `200 OK`
  - **AND** the response contains `Set-Cookie: token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`.

---

## 3. Security & Token Filter Specifications

### Requirement: REQ-SEC-001 — JWT Cookie Extraction & Filter Chain
The Spring Boot backend **MUST** implement a `JwtAuthFilter` that inspects incoming requests for the `token` cookie, validates signature and expiration, and populates `SecurityContextHolder`. Unauthenticated requests to protected endpoints or `/api/auth/me` **MUST** trigger a custom `AuthenticationEntryPoint` that returns HTTP `401 Unauthorized` with a structured `ErrorResponseDTO` payload.

- **Scenario 1: Request with Valid Token Cookie**
  - **GIVEN** a request directed to a protected endpoint containing a valid `token` cookie
  - **WHEN** the JWT filter processes the request
  - **THEN** the filter extracts claims, constructs an `Authentication` token with assigned roles (`ROLE_ADMIN` / `ROLE_CLIENT`), and sets it in `SecurityContextHolder`
  - **AND** the filter chain proceeds to the endpoint handler.

- **Scenario 2: Request without Token Cookie on Protected Endpoint**
  - **GIVEN** an unauthenticated request to a protected endpoint (e.g. `/api/auth/me`, `/api/planificaciones/**`)
  - **WHEN** the filter chain processes the request
  - **THEN** the request fails authentication and triggers `AuthenticationEntryPoint` returning HTTP `401 Unauthorized`
  - **AND** the response body contains a JSON `ErrorResponseDTO` with status `401` and error message `"No autenticado"`.

---

### Requirement: REQ-SEC-002 — CORS Configuration for Cookie Credentials
The backend CORS filter **MUST** explicitly configure `allowCredentials = true` and specify explicit allowed origins (e.g. `http://localhost:5173`) rather than wildcard `*`.

- **Scenario 1: Cross-Origin Request with Credentials**
  - **GIVEN** frontend application running on `http://localhost:5173` making an Axios request with `withCredentials: true`
  - **WHEN** preflight and subsequent API requests are received
  - **THEN** the server returns `Access-Control-Allow-Origin: http://localhost:5173`
  - **AND** `Access-Control-Allow-Credentials: true`.

---

## 4. Frontend Access Control & Routing Specifications

### Requirement: REQ-FE-001 — Axios Client Credential Configuration
The frontend Axios instance **MUST** be configured with `withCredentials: true` across all requests to guarantee cookies are automatically transmitted.

---

### Requirement: REQ-FE-002 — AuthContext & Session State Management
The frontend **MUST** provide an `AuthContext` managing authentication state (`user`, `isAuthenticated`, `isLoading`, `login`, `register`, `logout`). On application load, `AuthContext` **MUST** call `GET /api/auth/me` to hydrate the session.

- **Scenario 1: Initial App Load Hydration**
  - **GIVEN** the user loads or refreshes the React app
  - **WHEN** `AuthProvider` mounts
  - **THEN** it sets `isLoading = true` and initiates `GET /api/auth/me`
  - **AND** if `/me` succeeds, sets `user = response.data` and `isAuthenticated = true`
  - **AND** if `/me` fails (401), sets `user = null` and `isAuthenticated = false`
  - **AND** sets `isLoading = false`.

---

### Requirement: REQ-FE-003 — Protected Routes & Post-Login Redirection (`state.from`)
The frontend **MUST** enforce route guards (`ProtectedRoute`) that check `isAuthenticated` and redirect unauthenticated users to `/login`, storing the attempted location in `location.state.from`.

- **Scenario 1: Unauthorized Access Attempt**
  - **GIVEN** an unauthenticated visitor navigating directly to `/itinerarios/nuevo`
  - **WHEN** `ProtectedRoute` evaluates the session
  - **THEN** the user is redirected to `/login` with router state `{ from: '/itinerarios/nuevo' }`.

- **Scenario 2: Post-Login Redirection**
  - **GIVEN** a user redirected to `/login` with `location.state.from = '/itinerarios/nuevo'`
  - **WHEN** the user successfully completes login
  - **THEN** the application navigates to `/itinerarios/nuevo` instead of the default `/` dashboard.

---

### Requirement: REQ-FE-004 — Role-Based Route and Component Gating
The frontend **MUST** support role-based gating for administrative routes and UI controls requiring `ROLE_ADMIN` vs `ROLE_CLIENT`.

- **Scenario 1: Client Accessing Admin Route**
  - **GIVEN** an authenticated user with only `ROLE_CLIENT`
  - **WHEN** navigating to an admin-only route (e.g. `/admin/usuarios`)
  - **THEN** the route guard denies access and renders a `403 Forbidden` view or redirects.

- **Scenario 2: Admin Accessing Admin Route**
  - **GIVEN** an authenticated user with `ROLE_ADMIN`
  - **WHEN** navigating to `/admin/usuarios`
  - **THEN** the route renders the administration dashboard without restriction.

---

### Requirement: REQ-FE-005 — Registration & Login Navigation
The UI **MUST** provide a public Registration page accessible at `/register`, linked directly from the `/login` screen.

---

### Requirement: REQ-FE-006 — Removal of Legacy `UserPicker`
The application **MUST** completely remove `UserPicker.tsx` and its invocations from the codebase.

---

### Requirement: REQ-FE-007 — Guest Route Protection for Login and Registration
The frontend **MUST** provide a declarative `GuestRoute` wrapper around guest-only routes (`/login`, `/register`, `/registro`). If an authenticated user attempts to access these routes, the system **MUST** automatically redirect them to `/planificaciones` (or their intended destination) without flashing guest form content.

- **Scenario 1: Authenticated User Navigates to Login**
  - **GIVEN** an active authenticated session (`isAuthenticated = true`)
  - **WHEN** the user navigates directly to `/login` or `/register`
  - **THEN** `GuestRoute` redirects the user to `/planificaciones` with `replace: true`
  - **AND** the login/register forms are not rendered.

- **Scenario 2: Unauthenticated User Navigates to Login**
  - **GIVEN** an unauthenticated visitor (`isAuthenticated = false`, `isLoading = false`)
  - **WHEN** the user navigates to `/login`
  - **THEN** `GuestRoute` renders the child login view normally.

- **Scenario 3: Session Still Loading**
  - **GIVEN** an initial application load where `isLoading = true`
  - **WHEN** the user navigates to `/login`
  - **THEN** `GuestRoute` renders the loading spinner until hydration completes.

