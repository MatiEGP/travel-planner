# Proposal: Fix Auth HTTP Status Codes and Guest Routing

## Intent

Resolve HTTP status code discrepancies on authentication endpoints and improve frontend routing for guest views. Specifically:
1. Spring Security returns `403 Forbidden` instead of `401 Unauthorized` when unauthenticated clients access `/api/auth/me` or protected endpoints without credentials.
2. Backend returns empty `403 Forbidden` when authenticated users access `/api/auth/login` or `/api/auth/registro`.
3. Frontend uses imperative `useEffect` redirects in `LoginPage` and `RegisterPage` instead of a declarative `GuestRoute` wrapper.

## Scope

### In Scope
- **Backend**: Configure `AuthenticationEntryPoint` in `SecurityConfig` to return `401 Unauthorized` with JSON error payload for unauthenticated requests.
- **Backend**: Update `AuthController` to handle already-authenticated requests to `/login` and `/registro` by returning structured responses or replacing session cookies.
- **Frontend**: Create declarative `GuestRoute` wrapper in `router/index.tsx` to redirect authenticated users cleanly without page mounting flicker.
- **Frontend / Tests**: Update test suites and mock assertions to align with standard 401 unauthenticated status.

### Out of Scope
- Redesigning token refresh mechanisms or token expiration flows.
- Modifying business domain entity permissions (`Planificacion`, `Destino`, `Actividad`).

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `auth`: Align unauthenticated responses with HTTP 401 semantics across Spring Security entry point and add declarative guest route protection for login/registration views.

## Approach

1. **Spring Security Entry Point**: Implement custom `AuthenticationEntryPoint` returning HTTP 401 with standard `ErrorResponseDTO` JSON body for unauthenticated API requests.
2. **AuthController Behavior**: Allow `/login` and `/registro` to issue replacement JWT cookies or reject with `400 Bad Request` + descriptive message rather than bare 403.
3. **Frontend Routing**: Introduce `GuestRoute` component in `src/components/auth/GuestRoute.tsx` and wrap `/login`, `/register`, and `/registro` routes in `router/index.tsx`. Remove imperative page-level redirect `useEffects`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/.../config/SecurityConfig.java` | Modified | Add `AuthenticationEntryPoint` returning 401 |
| `backend/.../controllers/AuthController.java` | Modified | Update `estaAutenticado()` response handling |
| `backend/src/test/.../AuthControllerTest.java` | Modified | Update status code test assertions (401 vs 403) |
| `frontend/src/components/auth/GuestRoute.tsx` | New | Declarative redirect for authenticated users |
| `frontend/src/router/index.tsx` | Modified | Wrap login and register routes with `GuestRoute` |
| `frontend/src/pages/LoginPage.tsx` | Modified | Remove imperative `useEffect` redirect |
| `frontend/src/pages/RegisterPage.tsx` | Modified | Remove imperative `useEffect` redirect |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend tests expecting 403 fail | Medium | Update test assertions to match standard 401 |
| Redirection loops on guest routes | Low | Verify `isLoading` state before redirecting in `GuestRoute` |

## Rollback Plan

Revert git commit changes to `SecurityConfig.java`, `AuthController.java`, `router/index.tsx`, and associated frontend pages.

## Dependencies

None

## Success Criteria

- [ ] Unauthenticated requests to `/api/auth/me` return HTTP 401 (not 403).
- [ ] Authenticated users visiting `/login` or `/register` are cleanly redirected via `GuestRoute` without form flash.
- [ ] All backend (`mvn clean verify`) and frontend (`npm run build && npm run lint`) quality gates pass.
