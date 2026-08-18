# Archive Report: `jwt-security`

**Change Name**: `jwt-security`
**Completed Date**: 2026-08-17
**Store Mode**: hybrid
**Status**: CLOSED & ARCHIVED

## 1. Summary of Changes
- Implemented full JWT authentication & authorization with `HttpOnly; SameSite=Strict` cookie strategy in Spring Boot 4.1 & React 19.
- Backend: `JwtAuthFilter` cookie extraction, `AuthController` (`login`, `registro`, `logout`, `me`), `SecurityConfig` stateless setup, parameterizable `cookie-secure` flag, unit tests (`JwtServiceTest`, `AuthControllerTest`).
- Frontend: Axios `withCredentials: true`, `AuthService`, `AuthContext` mount-time hydration, `ProtectedRoute`, `RoleRoute`, `LoginPage`, `RegisterPage`, `Header` user badge & logout confirmation modal, deleted prototype `UserPicker`.

## 2. Test & Verification Evidence
- Backend Tests: 6/6 tests passing (`./mvnw test`).
- Frontend Build: `tsc -b && vite build` passing with 0 errors (108 modules transformed).

## 3. Specs Synchronized
- `openspec/specs/auth/spec.md` updated with requirements REQ-AUTH-001 through REQ-AUTH-004, REQ-SEC-001, REQ-SEC-002, REQ-FE-001 through REQ-FE-006.