# Design Document: `jwt-security`

## 1. Technical Approach
The `jwt-security` change transitions `travel-planner` from a prototype user-picker state to a production-grade, secure, cookie-based JWT authentication and authorization system.

### Core Strategy:
- **HttpOnly Cookie Authentication**: Instead of returning JWT tokens in response payloads to be stored in browser `localStorage` or `sessionStorage` (vulnerable to XSS), the backend issues a signed JWT within a secure `Set-Cookie` response header (`HttpOnly`, `Path=/`, `SameSite=Strict`, `Max-Age=86400`).
- **Spring Security 6 Stateless Filter Chain**: `JwtAuthFilter` extracts the JWT from incoming request cookies (`token`), validates HMAC-SHA256 signature and expiration via `JwtService`, and populates `SecurityContextHolder` with `UsernamePasswordAuthenticationToken` and `ROLE_*` authorities.
- **REST Auth Endpoints (`/api/auth`)**:
  - `POST /api/auth/login`: Authenticates credentials, writes `HttpOnly` cookie, returns sanitized user payload (`id`, `nombre`, `email`, `roles`).
  - `POST /api/auth/registro`: Registers a user, assigns `ROLE_CLIENT`, writes `HttpOnly` cookie, returns user payload.
  - `POST /api/auth/logout`: Clears the cookie (`Max-Age=0`).
  - `GET /api/auth/me`: Reads `SecurityContextHolder`, returns user payload with roles if authenticated (401 if unauthenticated).
- **CORS & Cookie Transport**: CORS config explicitly allows frontend origin `http://localhost:5173` with `allowCredentials(true)`. Axios client configures `withCredentials: true`.
- **Frontend SPA Auth Lifecycle (React 19 + Vite)**:
  - `AuthContext`: Hydrates user profile on initial mount via `GET /api/auth/me`, exposing `user`, `isLoading`, `isAuthenticated`, `login`, `register`, `logout`, and `hasRole`.
  - Route Protection: `ProtectedRoute` redirects unauthenticated users to `/login` preserving `location.state.from`. `RoleRoute` verifies required roles (e.g., `ROLE_ADMIN` vs `ROLE_CLIENT`).
  - Removal of Legacy Artifacts: Completely delete `UserPicker.tsx` and replace manual user switcher in `Header.tsx` and `PlanificacionesPage.tsx`.

---

## 2. Architecture Decisions & Rationale

| Decision | Choice | Rationale | Alternatives Considered |
|---|---|---|---|
| **Token Storage** | `HttpOnly` Cookie (`token`) | Prevents JavaScript access, mitigating XSS token theft. `SameSite=Strict` prevents CSRF attacks in modern browsers. | `localStorage` / `sessionStorage` (vulnerable to XSS); `Authorization: Bearer` memory-only (lost on page reload). |
| **Session Model** | Stateless JWT | Eliminates server-side session storage (Redis/DB) while keeping Spring Boot backend scalable and cloud-native. | Stateful HTTP sessions with `JSESSIONID` (requires distributed session storage across instances). |
| **Role Representation** | `ROLE_ADMIN`, `ROLE_CLIENT` | Standard Spring Security convention. Prefixed with `ROLE_` in `GrantedAuthority` mapping to work seamlessly with `@PreAuthorize("hasRole('ADMIN')")`. | Unprefixed strings (requires custom authority evaluators or `hasAuthority`). |
| **Auth Hydration** | `GET /api/auth/me` on mount | Since frontend cannot read the `HttpOnly` cookie directly, it probes `/api/auth/me` to determine active session and retrieve identity + roles. | Storing duplicate user profile in `localStorage` (causes state desynchronization upon cookie expiration). |
| **Route Guards** | Compound Layout / Wrapper Guards (`ProtectedRoute`, `RoleRoute`) | Declarative, reusable protection integrated with React Router v7 and `location.state.from` navigation redirect. | Route action loaders (harder to sync with React Context) or in-page conditional renders. |

---

## 3. Data Flow Diagrams (ASCII)

### 3.1 Login & Cookie Generation Flow
```
[ Browser (React) ]              [ Spring Boot (Backend) ]             [ PostgreSQL ]
       |                                    |                                 |
       |-- POST /api/auth/login ----------->|                                 |
       |   { email, password }              |-- findByEmail(email) ---------->|
       |                                    |<-- Usuario entity + Roles ------|
       |                                    |-- BCrypt verify password        |
       |                                    |-- JwtService.generarToken()     |
       |                                    |-- Create ResponseCookie "token" |
       |<-- 200 OK -------------------------|
       |    Set-Cookie: token=...; HttpOnly;|
       |                SameSite=Strict;    |
       |    Body: { id, nombre, email, roles }
       |                                    |
[ AuthContext updates user state ]
```

### 3.2 Authenticated Request Flow (e.g. `/api/auth/me` or `/api/planificaciones`)
```
[ Browser (React) ]              [ JwtAuthFilter ]           [ SecurityContext ]       [ Controller / Service ]
       |                                |                             |                           |
       |-- GET /api/auth/me ----------->|                             |                           |
       |   Cookie: token=<jwt>          |-- Extract "token" cookie    |                           |
       |                                |-- JwtService.validarToken() |                           |
       |                                |-- Extract email & roles     |                           |
       |                                |-- Set Authentication ------>|                           |
       |                                |-- doFilter(request, response) ------------------------->|
       |                                |                             |<-- Read Authentication --|
       |                                |                             |    (email, roles)         |
       |<-- 200 OK { id, nombre, email, roles } --------------------------------------------------|
```

### 3.3 Logout Flow
```
[ Browser (React) ]              [ Spring Boot (Backend) ]
       |                                    |
       |-- User confirms Logout Modal       |
       |-- POST /api/auth/logout ---------->|
       |   Cookie: token=<jwt>              |-- ResponseCookie.from("token", "")
       |                                    |   .maxAge(0).build()
       |<-- 200 OK -------------------------|
       |    Set-Cookie: token=; Max-Age=0;  |
       |                HttpOnly; Path=/    |
       |                                    |
[ AuthContext sets user = null, navigates to /login ]
```

---

## 4. File Changes

### Backend (`/backend`)
1. **`com.travelplanner.api.config.JwtAuthFilter`**
   - *Modification*: Change token extraction logic from `request.getHeader("Authorization")` to inspecting `request.getCookies()` for cookie named `token`.
2. **`com.travelplanner.api.config.SecurityConfig`**
   - *Modification*: Update `authorizeHttpRequests`:
     - Allow `/api/auth/login`, `/api/auth/registro`, `/api/auth/logout`.
     - Require authentication for `/api/auth/me` and `/api/planificaciones/**`, `/api/destinos/**`, `/api/actividades/**`.
     - Require `ROLE_ADMIN` for `/api/usuarios/**`.
     - Disable CSRF (or maintain stateless CSRF policy for cookie-based REST).
3. **`com.travelplanner.api.config.CorsConfig`**
   - *Modification*: Verify `allowCredentials(true)` with strict origin matching (`http://localhost:5173`), avoiding wildcard origin.
4. **`com.travelplanner.api.controllers.AuthController`**
   - *Modification*:
     - Update `/registro`: Issue `Set-Cookie` header (`token`) and return `AuthResponseDTO` with `roles`.
     - Update `/login`: Issue `Set-Cookie` header (`token`) and return `AuthResponseDTO` with `roles`.
     - Add `POST /logout`: Set `token` cookie with `maxAge(0)`.
     - Add `GET /me`: Retrieve `Authentication` from `SecurityContextHolder`, query user/claims, and return `AuthResponseDTO`.
5. **`com.travelplanner.api.dtos.AuthResponseDTO`** (or updated `LoginResponseDTO`/`UsuarioResponseDTO`)
   - *Creation/Modification*: Represents `{ id, nombre, email, roles }` without exposing the raw JWT token in the response body.

### Frontend (`/frontend`)
1. **`src/api/client.ts`**
   - *Modification*: Set `withCredentials: true` on Axios instance. Add 401 interceptor handler to sync session expiration.
2. **`src/types/usuario.ts` & `src/types/auth.ts`**
   - *Creation/Modification*: Define `AuthUser`, `LoginCredentials`, `RegisterCredentials`, `AuthResponse`.
3. **`src/services/authService.ts`**
   - *Creation*: API methods for `login()`, `registro()`, `logout()`, `getMe()`.
4. **`src/context/authContextDef.ts` & `src/context/AuthContext.tsx` & `src/context/useAuth.ts`**
   - *Modification*:
     - Provide `user`, `isAuthenticated`, `isLoading`, `login()`, `register()`, `logout()`, `hasRole(role)`.
     - Add initial hydration `useEffect` calling `authService.getMe()`.
5. **`src/components/auth/ProtectedRoute.tsx`**
   - *Creation*: Guard checking `isAuthenticated` and rendering `<Outlet />` or redirecting to `/login` with `state: { from: location }`.
6. **`src/components/auth/RoleRoute.tsx`**
   - *Creation*: Guard checking `hasRole(requiredRole)`.
7. **`src/pages/LoginPage.tsx`**
   - *Creation*: Login form (email, password), error message banner, link to `/registro`, redirect to `from` route upon success.
8. **`src/pages/RegisterPage.tsx`**
   - *Creation*: Registration form (name, email, password), validation, link to `/login`, automatic login redirect.
9. **`src/components/layout/Header.tsx`**
   - *Modification*: Render user badge, role indicator (`Admin`/`Client`), and "Cerrar sesión" button with confirmation modal. Remove old manual user switcher.
10. **`src/pages/PlanificacionesPage.tsx`**
    - *Modification*: Remove `UserPicker` reference and temporary checks.
11. **`src/components/temp/UserPicker.tsx`**
    - *Deletion*: Remove file completely.
12. **`src/router/index.tsx`**
    - *Modification*: Add `/login`, `/registro` routes. Wrap `/planificaciones`, `/admin`, etc. in `ProtectedRoute` and `RoleRoute`.

---

## 5. Interfaces & DTO Contracts

### 5.1 Java DTOs

```java
// AuthResponseDTO.java
package com.travelplanner.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private List<String> roles;
}
```

```java
// LoginRequestDTO.java
package com.travelplanner.api.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
```

```java
// RegistroRequestDTO.java
package com.travelplanner.api.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroRequestDTO {
    @NotBlank(message = "Name is required")
    private String nombre;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
```

### 5.2 TypeScript Interfaces

```typescript
// src/types/auth.ts
export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}
```

---

## 6. Testing Strategy

### Backend Tests (JUnit 5 + MockMvc)
1. **`JwtAuthFilterTest`**:
   - Valid `token` cookie sets `SecurityContextHolder` with `ROLE_*` authorities.
   - Missing or expired `token` cookie leaves `SecurityContext` empty without throwing unhandled exceptions.
2. **`AuthControllerTest`**:
   - `POST /api/auth/login` with valid credentials returns 200, user JSON, and `Set-Cookie` with `HttpOnly; SameSite=Strict`.
   - `POST /api/auth/login` with invalid credentials returns 401.
   - `POST /api/auth/registro` creates user, sets cookie, and returns 201.
   - `POST /api/auth/logout` returns 200 and `Set-Cookie` with `Max-Age=0`.
   - `GET /api/auth/me` returns 200 with user profile when cookie is present; returns 401 when cookie is missing.
3. **`SecurityAccessTest`**:
   - `/api/admin/**` or `/api/usuarios/**` returns 403 for users with only `ROLE_CLIENT`.
   - Public assets and `/swagger-ui/**` accessible without cookie.

### Frontend Tests (React Testing Library / Integration Tests)
1. **`AuthContext` Hydration**:
   - On mount, triggers `GET /api/auth/me`. If successful, sets `user` and `isAuthenticated=true`.
   - If `/api/auth/me` fails with 401, sets `user=null`, `isLoading=false`.
2. **`ProtectedRoute` & `RoleRoute`**:
   - Unauthenticated access to `/planificaciones` redirects to `/login` with `location.state.from`.
   - Authenticated user without `ROLE_ADMIN` accessing `/admin` is redirected.
3. **`LoginPage` & `RegisterPage`**:
   - Submits credentials, invokes auth context, displays errors on 401/400.
4. **`Header`**:
   - Renders user initials, role badge, and opens confirmation modal on "Cerrar sesión".

---

## 7. Threat Matrix

| Threat Category | Risk Description | Mitigation in Design | Status |
|---|---|---|---|
| **Spoofing** | Adversary crafts forged JWT to impersonate admin. | Cryptographic HMAC-SHA256 signature verification with high-entropy secret (`app.jwt.secret`). | Mitigated |
| **Tampering** | User modifies role claims in transit. | JWT integrity validated on every request by `JwtService.validarToken()`. Tampered token triggers parsing exception and 401 rejection. | Mitigated |
| **Information Disclosure** | Token stolen via XSS in client browser. | Token stored strictly in `HttpOnly` cookie; cannot be accessed via `document.cookie` or XSS payloads. | Mitigated |
| **CSRF** | Cross-site malicious request using ambient cookie credentials. | Cookie configured with `SameSite=Strict`. Backend requires JSON payload content-type for mutations. | Mitigated |
| **Denial of Service** | Token replay indefinitely. | Fixed token expiration (`app.jwt.expiration-ms`, e.g. 24h). Password hashing with BCrypt cost factor 10. | Mitigated |
| **Elevation of Privilege** | Client user attempts admin endpoint execution. | Server-side `@PreAuthorize("hasRole('ADMIN')")` and filter security matchers enforce authorization; frontend role checks are UX-only. | Mitigated |

---

## 8. Rollout / Migration Plan

1. **Step 1: Backend Cookie & Auth Endpoint Enhancement**:
   - Update `JwtAuthFilter` to extract token from Cookie.
   - Update `AuthController` with cookie generation, `/logout`, and `/me`.
   - Run backend tests to verify endpoints and security filter.
2. **Step 2: Frontend Client & Auth Architecture**:
   - Update Axios client `withCredentials: true`.
   - Implement `authService`, `AuthContext`, `ProtectedRoute`, `RoleRoute`.
3. **Step 3: UI Pages & Components**:
   - Create `LoginPage.tsx` and `RegisterPage.tsx`.
   - Update `Header.tsx` with role display and logout confirmation.
   - Update `router/index.tsx` with route guards and new routes.
4. **Step 4: Cleanup & Deprecation**:
   - Delete `UserPicker.tsx`.
   - Clean up mock auth comments and unused types.
5. **Step 5: End-to-End Verification**:
   - Test registration, login, protected navigation, admin access restriction, session persistence on page refresh, and logout.
