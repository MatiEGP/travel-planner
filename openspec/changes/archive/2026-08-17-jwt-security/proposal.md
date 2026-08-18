# Proposal: jwt-security

## 1. Goal

Wire Spring Boot's existing JWT backend to the React frontend using an **httpOnly cookie** session strategy. After this change, authentication is real end-to-end: login persists across page reloads, all API calls are automatically credentialed, routes are protected by both authentication and role (`ADMIN` / `CLIENT`), and the session is terminated server-side on logout.

---

## 2. Guiding Principles

- **Frontend never touches the raw token.** The JWT lives exclusively in an httpOnly cookie; JavaScript cannot read it.
- **`/api/auth/me` is the source of truth for frontend auth state.** Called once on app mount to hydrate the context.
- **Zero new schema changes.** All decisions are confined to application-layer code.
- **IDOR in `PlanificacionController` is explicitly out of scope** — tracked separately.

---

## 3. Locked Assumptions

| ID | Decision |
|----|----------|
| A1 | Backend sets `Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict; Path=/` on login |
| A2 | `GET /api/auth/me` is required (new backend endpoint) |
| A3 | CORS configured with `allowCredentials = true` + explicit `allowedOrigins` (not `*`) |
| A4 | Open self-service registration; `RegisterPage` linked from `LoginPage` |
| A5 | Role-based UI gating: `ADMIN` vs `CLIENT` (routes + UI elements) |
| A6 | Post-login redirect uses `state.from` pattern; falls back to `/` |
| A7 | `POST /api/auth/logout` responds with `Set-Cookie: token=; Max-Age=0; HttpOnly` (stateless, no blacklist) |
| A8 | `UserPicker.tsx` deleted |
| A9 | `UsuarioResponseDTO` gains `roles: List<String>` field |
| A10 | IDOR risk in `PlanificacionController` out of scope |

---

## 4. Architecture Overview

```
Browser
  │
  ├── App mount → GET /api/auth/me (cookie sent automatically)
  │                    └── 200 → populate AuthContext (user, roles)
  │                    └── 401 → AuthContext stays null (unauthenticated)
  │
  ├── POST /api/auth/login  { email, password }
  │       └── 200 → Set-Cookie: token=...; HttpOnly  +  body: { id, nombre, email, roles }
  │
  ├── POST /api/auth/logout
  │       └── 200 → Set-Cookie: token=; Max-Age=0; HttpOnly
  │
  └── All other API calls → cookie attached automatically by browser (withCredentials: true)
```

**Auth filter reads cookie, not `Authorization` header.** `JwtAuthFilter` changes from `request.getHeader("Authorization")` to reading a cookie named `token`.

---

## 5. Backend Changes

### 5.1 `JwtAuthFilter.java`
- Read JWT from cookie named `token` instead of `Authorization` header.
- Null-guard: handle `request.getCookies() == null`.
- If no cookie → `chain.doFilter()` (unauthenticated); SecurityConfig handles the 401.

### 5.2 `AuthController.java`

| Endpoint | Change |
|----------|--------|
| `POST /api/auth/login` | Set `ResponseCookie` (HttpOnly, SameSite=Strict, Path=/, Secure in prod); return `UsuarioResponseDTO` (with roles) in body — **no token in body** |
| `POST /api/auth/registro` | Same cookie strategy as login (auto-login after register) |
| `POST /api/auth/logout` | **NEW** — returns `Set-Cookie: token=; Max-Age=0; HttpOnly` |
| `GET /api/auth/me` | **NEW** — reads `SecurityContextHolder`, returns `UsuarioResponseDTO`; 401 if unauthenticated |

Shared cookie builder:
```java
ResponseCookie buildTokenCookie(String token, long maxAge) {
    return ResponseCookie.from("token", token)
        .httpOnly(true)
        .secure(true)          // toggled via @Value — false in dev profile
        .sameSite("Strict")
        .path("/")
        .maxAge(maxAge)        // 3600 prod, 86400 dev
        .build();
}
```

### 5.3 `SecurityConfig.java`
- Replace wildcard origin with explicit `allowedOrigins("http://localhost:5173")`.
- Set `allowCredentials(true)`.
- Add `/api/auth/logout` to `permitAll` (harmless to call unauthenticated).
- CSRF remains disabled (SameSite=Strict + REST API = acceptable for MVP).

### 5.4 `UsuarioResponseDTO.java`
- Add `List<String> roles` field populated from the user's authorities.

### 5.5 `JwtService.java`
- Add `extractRoles(token)` claim helper — keeps `/api/auth/me` stateless (reads roles from JWT claims, not DB).

---

## 6. Frontend Changes

### 6.1 `types/usuario.ts`
```typescript
export interface LoginRequestDTO { email: string; password: string; }
export interface RegisterRequestDTO { nombre: string; email: string; password: string; }
export interface CurrentUserDTO { id: number; nombre: string; email: string; roles: string[]; }
```

### 6.2 `api/client.ts`
- Add `withCredentials: true` to Axios instance config.
- Add 401 response interceptor → `window.location.href = '/login'`.

### 6.3 `services/authService.ts` (NEW)
```typescript
export const authService = {
  login:    (data: LoginRequestDTO)    => client.post<CurrentUserDTO>('/api/auth/login', data),
  register: (data: RegisterRequestDTO) => client.post<CurrentUserDTO>('/api/auth/registro', data),
  logout:   ()                         => client.post('/api/auth/logout'),
  me:       ()                         => client.get<CurrentUserDTO>('/api/auth/me'),
};
```

### 6.4 `context/AuthContext.tsx`
- State: `user: CurrentUserDTO | null`, `loading: boolean`.
- On mount: call `authService.me()` → set `user`; on 401 → `user = null`.
- Expose: `login()`, `logout()` (confirmation dialog → cookie clear → redirect), `hasRole(role)`, `isAuthenticated`.
- Remove `setUsuario` from public context shape.

### 6.5 `components/ProtectedRoute.tsx` (NEW)
- Redirects to `/login` with `state={{ from: location }}` if not authenticated.
- Shows loading spinner while `loading === true`.

### 6.6 `components/RoleRoute.tsx` (NEW)
- Renders children only if `hasRole(role)` is true; renders `<AccessDeniedPage />` otherwise.

### 6.7 `router/index.tsx`
```
/login      → <LoginPage />                                    (public)
/register   → <RegisterPage />                                 (public)
/           → <ProtectedRoute> ... </ProtectedRoute>           (authenticated)
/admin/*    → <ProtectedRoute><RoleRoute role="ROLE_ADMIN">    (admin only)
```
Post-login redirect: reads `location.state.from?.pathname ?? '/'`.

### 6.8 `pages/LoginPage.tsx` (NEW)
Form with email + password, field-level validation, link to `/register`.

### 6.9 `pages/RegisterPage.tsx` (NEW)
Form with nombre + email + password, link back to `/login`.

### 6.10 `components/layout/Header.tsx`
Show `user.nombre`, role badge (`Admin` / `Client`), logout button (triggers confirmation dialog).

### 6.11 `components/temp/UserPicker.tsx`
**DELETE** — remove all imports and references.

---

## 7. Affected File Summary

### Backend
| File | Change |
|------|--------|
| `JwtAuthFilter.java` | Modify — cookie instead of header |
| `AuthController.java` | Modify — cookie on login/register; add `/logout` + `/me` |
| `SecurityConfig.java` | Modify — CORS credentials + logout permitAll |
| `UsuarioResponseDTO.java` | Modify — add `roles` field |
| `JwtService.java` | Modify (minor) — `extractRoles()` helper |

### Frontend
| File | Change |
|------|--------|
| `types/usuario.ts` | Modify |
| `api/client.ts` | Modify |
| `services/authService.ts` | **NEW** |
| `context/AuthContext.tsx` | Modify (full replacement of stub) |
| `components/ProtectedRoute.tsx` | **NEW** |
| `components/RoleRoute.tsx` | **NEW** |
| `router/index.tsx` | Modify |
| `pages/LoginPage.tsx` | **NEW** |
| `pages/RegisterPage.tsx` | **NEW** |
| `components/layout/Header.tsx` | Modify |
| `components/temp/UserPicker.tsx` | **DELETE** |

---

## 8. Risks

| Severity | Risk | Mitigation |
|----------|------|------------|
| HIGH (out of scope) | IDOR in `PlanificacionController` | Tracked separately |
| MEDIUM | CSRF with httpOnly cookie | SameSite=Strict mitigates; acceptable for MVP |
| MEDIUM | `Secure` flag off in dev | Spring profile (`dev`/`prod`) toggles it on `ResponseCookie` |
| MEDIUM | CORS misconfiguration breaks credentials | Explicit `allowedOrigins`; test login flow in CI |
| LOW | `/api/auth/me` DB hit on every page load | Cache in `AuthContext`; re-fetch only on explicit events |
| LOW | No token blacklist | Accepted; logout clears cookie both client + server side |

---

## 9. Out of Scope

- IDOR fix in `PlanificacionController`
- Refresh token / token rotation
- OAuth / social login
- Backend token blacklisting
- Admin user management UI
- Rate limiting on auth endpoints

---

## 10. Task Breakdown

```
T1  [Backend]   UsuarioResponseDTO — add roles field
T2  [Backend]   JwtService — add extractRoles() claim helper
T3  [Backend]   JwtAuthFilter — read JWT from cookie
T4  [Backend]   AuthController — set cookie on login + registro; add /logout + /me
T5  [Backend]   SecurityConfig — CORS allowCredentials, allowedOrigins, logout permitAll
T6  [Frontend]  types/usuario.ts — add DTOs
T7  [Frontend]  api/client.ts — withCredentials + 401 interceptor
T8  [Frontend]  services/authService.ts — NEW
T9  [Frontend]  context/AuthContext.tsx — full implementation
T10 [Frontend]  components/ProtectedRoute.tsx — NEW
T11 [Frontend]  components/RoleRoute.tsx — NEW
T12 [Frontend]  pages/LoginPage.tsx — NEW
T13 [Frontend]  pages/RegisterPage.tsx — NEW
T14 [Frontend]  router/index.tsx — add public routes, wrap protected
T15 [Frontend]  components/layout/Header.tsx — user + logout
T16 [Frontend]  components/temp/UserPicker.tsx — DELETE + remove all refs
```

**Execution order**: T1 → T2 → T3 → T4 → T5 (backend complete, testable via curl) → T6 → T7 → T8 → T9 → T10 → T11 → T14 → T12 → T13 → T15 → T16
