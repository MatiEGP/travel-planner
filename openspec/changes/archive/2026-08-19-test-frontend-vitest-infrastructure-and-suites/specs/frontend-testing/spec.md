# Frontend Testing Specification

## Purpose

Defines automated testing requirements, component verification criteria, hook validation, and code coverage enforcement for the React 19 single-page application using Vitest and React Testing Library.

## Requirements

### Requirement: REQ-FTEST-001 — AuthContext & Session Management Testing

The frontend test suite **MUST** verify session hydration (`GET /api/auth/me`), credential login, registration, logout, and role authorization logic (`hasRole`) within the `AuthContext` provider.

#### Scenario: Successful Initial Session Hydration
- **GIVEN** a mounted `AuthProvider` and an active session response from `/api/auth/me`
- **WHEN** hydration completes
- **THEN** `isAuthenticated` becomes `true`, `user` contains the profile data, and `isLoading` becomes `false`.

#### Scenario: Failed Session Hydration (Guest User)
- **GIVEN** `/api/auth/me` returns HTTP 401 Unauthorized
- **WHEN** hydration completes
- **THEN** `isAuthenticated` is `false`, `user` is `null`, and `isLoading` is `false`.

---

### Requirement: REQ-FTEST-002 — Route Guard Component Verification

The test harness **MUST** verify that `ProtectedRoute`, `GuestRoute`, and `RoleRoute` enforce correct navigation flow and prevent unauthorized rendering.

#### Scenario: Protected Route Intercepts Unauthenticated Visitor
- **GIVEN** an unauthenticated session (`isAuthenticated: false`)
- **WHEN** navigating to a protected route component wrapped in `ProtectedRoute`
- **THEN** the protected content is NOT rendered and the user is redirected to `/login` with `state.from`.

#### Scenario: Guest Route Redirects Authenticated User
- **GIVEN** an authenticated session (`isAuthenticated: true`)
- **WHEN** navigating to `/login` or `/register` wrapped in `GuestRoute`
- **THEN** the guest form is NOT rendered and the user is redirected to `/`.

#### Scenario: Role Route Denies Access to Non-Admin User
- **GIVEN** an authenticated user with only `ROLE_CLIENT`
- **WHEN** navigating to an admin route wrapped in `RoleRoute` requiring `ROLE_ADMIN`
- **THEN** access is denied and unauthorized fallback/redirection is triggered.

---

### Requirement: REQ-FTEST-003 — UI Component & Active State Verification

The frontend test suite **MUST** verify UI component rendering, including role-gated call-to-action buttons on `HomePage` and active route highlights on `Header`.

#### Scenario: Header Highlights Active Auth Link
- **GIVEN** current location is `/login`
- **WHEN** `Header` renders
- **THEN** the "Iniciar sesión" link contains active highlight classes (`bg-teal-900 text-white`).

#### Scenario: HomePage Renders Role-Gated Controls
- **GIVEN** an authenticated user with `ROLE_ADMIN`
- **WHEN** `HomePage` renders
- **THEN** both "Mis Planificaciones" and "Panel de Administración" action links are visible in the DOM.

---

### Requirement: REQ-FTEST-004 — API Service Unit Testing

The test harness **MUST** provide unit tests for all Axios API service modules (`authService`, `planificacionService`, `destinoService`, `actividadService`, `usuarioService`) verifying payload transmission and error handling with mock responses.

#### Scenario: Service Method Dispatches Expected HTTP Request
- **GIVEN** a mocked Axios client instance
- **WHEN** a service method (e.g. `planificacionService.listarPorUsuario(1)`) is called
- **THEN** the request is sent with `withCredentials: true` and the resolved response data is returned.
