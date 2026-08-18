# Tasks: jwt-security

## Review Workload Forecast

| Metric | Forecast |
| :--- | :--- |
| Estimated Phases | 4 |
| Total Tasks / Checklist Items | 14 |
| Target Files Modified / Added | ~16 |
| Core Focus Areas | Backend Spring Security 6 & JWT HttpOnly Cookie, Frontend AuthContext & Axios Client, Route Guards & Pages, Legacy Cleanup & E2E Validation |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Work Unit | Target Files | Verification / Focused Test Command | Runtime Harness | Rollback Boundary |
| :--- | :--- | :--- | :--- | :--- |
| **WU-1: Security Dependencies & Properties** | `backend/pom.xml`, `backend/src/main/resources/application.properties` | `./mvnw test-compile` | Maven / Spring Boot 4.1.0 | `git checkout -- backend/pom.xml backend/src/main/resources/application.properties` |
| **WU-2: JWT Token Provider & Filter** | `backend/.../config/JwtService.java`, `backend/.../config/JwtAuthFilter.java`, `backend/.../config/JwtServiceTest.java` | `./mvnw test -Dtest=JwtServiceTest` | JUnit 5 & Mockito | `git checkout -- backend/src/main/java/com/travelplanner/api/config/` |
| **WU-3: SecurityFilterChain & UserDetailsService** | `backend/.../config/SecurityConfig.java`, `backend/.../services/UserDetailsServiceImpl.java` | `./mvnw test -Dtest=SecurityConfigTest` | Spring Security 6 MockMvc | `git checkout -- backend/src/main/java/com/travelplanner/api/config/ backend/src/main/java/com/travelplanner/api/services/` |
| **WU-4: Auth DTOs & AuthController** | `backend/.../controllers/AuthController.java`, `backend/.../dtos/AuthDto.java`, `backend/.../controllers/AuthControllerTest.java` | `./mvnw test -Dtest=AuthControllerTest` | MockMvc HttpOnly Cookie assertions | `git checkout -- backend/src/main/java/com/travelplanner/api/controllers/ backend/src/main/java/com/travelplanner/api/dtos/` |
| **WU-5: Frontend Axios Client & Auth Types** | `frontend/src/api/axios.ts`, `frontend/src/types/auth.ts`, `frontend/src/services/authService.ts` | `npm run build --prefix frontend` | TypeScript / Vite build | `git checkout -- frontend/src/api/ frontend/src/types/ frontend/src/services/` |
| **WU-6: Auth State Context & Hook** | `frontend/src/context/AuthContext.tsx`, `frontend/src/hooks/useAuth.ts` | `npm run test --prefix frontend` | Vitest / React Testing Library | `git checkout -- frontend/src/context/ frontend/src/hooks/` |
| **WU-7: Route Protection Components** | `frontend/src/components/auth/ProtectedRoute.tsx`, `frontend/src/components/auth/RoleRoute.tsx`, `frontend/src/router/index.tsx` | `npm run build --prefix frontend` | React Router v7 | `git checkout -- frontend/src/components/auth/ frontend/src/router/` |
| **WU-8: Auth Pages (Login & Register)** | `frontend/src/pages/LoginPage.tsx`, `frontend/src/pages/RegisterPage.tsx` | `npm run build --prefix frontend` | React 19 / TailwindCSS 4 | `git checkout -- frontend/src/pages/` |
| **WU-9: Header User Badge & Cleanup** | `frontend/src/components/layout/Header.tsx`, remove `frontend/src/components/temp/UserPicker.tsx` | `npm run build --prefix frontend` | React UI | `git checkout -- frontend/src/components/` |
| **WU-10: End-to-End & Integration Verification** | `backend/src/test/.../AuthIntegrationTest.java`, `frontend/src/tests/auth.test.tsx` | `./mvnw test && npm run test --prefix frontend` | Full Stack Dev Harness | `git reset --hard HEAD` |

---

## Phase 1: Backend Security & Cookie Auth

- [ ] **Task 1.1: Add Spring Security & JJWT dependencies to Maven**
  - Add `spring-boot-starter-security`, `jjwt-api` (0.12.6), `jjwt-impl` (0.12.6), `jjwt-jackson` (0.12.6) to [pom.xml](file:///C:/Users/matia/OneDrive/My%20GitHub/travel-planner/backend/pom.xml).
  - Configure `jwt.secret` and `jwt.expiration-ms` (86400000) in [application.properties](file:///C:/Users/matia/OneDrive/My%20GitHub/travel-planner/backend/src/main/resources/application.properties).
  - *Verification*: Run `./mvnw dependency:resolve` and `./mvnw test-compile` from `backend/`.

- [ ] **Task 1.2: Implement `JwtService` and `JwtAuthFilter`**
  - Create `JwtService.java` to generate tokens with claims (username, role), extract username, and validate token against signing key.
  - Create `JwtAuthFilter.java` extending `OncePerRequestFilter`: extract `token` from `HttpServletRequest.getCookies()`, validate via `JwtService`, load `UserDetails`, and populate `SecurityContextHolder`.
  - Add unit tests in `JwtServiceTest.java`.
  - *Verification*: Run `./mvnw test -Dtest=JwtServiceTest`.

- [ ] **Task 1.3: Configure `SecurityFilterChain` & CORS**
  - Implement `UserDetailsServiceImpl.java` loading user and authorities (`ROLE_ADMIN`, `ROLE_VIAJERO` / `ROLE_CLIENT`) from `UsuarioRepository`.
  - Implement `SecurityConfig.java`:
    - Disable CSRF for stateless REST API / cookie session.
    - Set `SessionCreationPolicy.STATELESS`.
    - Configure CORS: allow origin `http://localhost:5173`, credentials `true`, methods `GET,POST,PUT,DELETE,OPTIONS`, headers `*`.
    - Permit unrestricted access to `POST /api/auth/login`, `POST /api/auth/register`, and `/error`.
    - Protect all other endpoints requiring authentication (and role checks on admin endpoints).
    - Register `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`.
    - Expose `PasswordEncoder` (`BCryptPasswordEncoder`) and `AuthenticationManager` beans.
  - *Verification*: Run `./mvnw test-compile`.

- [ ] **Task 1.4: Implement `AuthController` with HttpOnly Cookie strategy**
  - Create DTOs: `LoginRequest`, `RegisterRequest`, `UserResponse` (`id`, `nombre`, `email`, `rol`).
  - Implement `AuthController.java`:
    - `POST /api/auth/login`: authenticate credentials, generate JWT, inject `ResponseCookie` (`token`, `HttpOnly=true`, `SameSite=Strict`, `Path=/`, `Max-Age=86400`, `Secure=false` for local / `true` for prod), return `UserResponse`.
    - `POST /api/auth/register`: encode password with `BCrypt`, persist user, generate JWT, set cookie, return `UserResponse`.
    - `POST /api/auth/logout`: inject `ResponseCookie` with `Max-Age=0` and `Value=""` to clear cookie, return `200 OK`.
    - `GET /api/auth/me`: extract authenticated principal, return current `UserResponse`.
  - Add integration tests in `AuthControllerTest.java` verifying cookie generation and invalidation.
  - *Verification*: Run `./mvnw test -Dtest=AuthControllerTest`.

---

## Phase 2: Frontend API Client & State Foundation

- [ ] **Task 2.1: Configure Axios instance with credentials & 401 interceptor**
  - Update [axios.ts](file:///C:/Users/matia/OneDrive/My%20GitHub/travel-planner/frontend/src/api/axios.ts):
    - Set `withCredentials: true` globally so browser sends HttpOnly cookies.
    - Add response interceptor catching `401 Unauthorized` responses to clear auth state and redirect to `/login` (except when hitting `/api/auth/me` during initial hydration).
  - Create `src/types/auth.ts` defining `User`, `LoginCredentials`, `RegisterData`, and `AuthContextType`.
  - *Verification*: Run `npm run build --prefix frontend`.

- [ ] **Task 2.2: Implement `authService`**
  - Create `src/services/authService.ts`:
    - `login(credentials: LoginCredentials): Promise<User>`
    - `register(data: RegisterData): Promise<User>`
    - `logout(): Promise<void>`
    - `getProfile(): Promise<User>`
  - *Verification*: Run `npm run build --prefix frontend`.

- [ ] **Task 2.3: Implement `AuthContext` and hydration lifecycle**
  - Create `src/context/AuthContext.tsx` and `src/hooks/useAuth.ts`:
    - Provide `user`, `isAuthenticated`, `isLoading`, `login`, `register`, `logout`.
    - On initial mount (`useEffect`), execute `authService.getProfile()` to silently hydrate session from HttpOnly cookie.
    - Set `isLoading = false` once session check resolves (success or failure).
  - *Verification*: Run `npm run test --prefix frontend` (or build check).

---

## Phase 3: Route Guards & UI Pages

- [ ] **Task 3.1: Implement `ProtectedRoute` and `RoleRoute`**
  - Create `src/components/auth/ProtectedRoute.tsx`:
    - While `isLoading`, show spinner / loading screen.
    - If `!isAuthenticated`, redirect to `/login` via `<Navigate to="/login" replace state={{ from: location }} />`.
  - Create `src/components/auth/RoleRoute.tsx`:
    - If user's role is not in `allowedRoles`, redirect to `/unauthorized` or `/dashboard`.
  - Update [router/index.tsx](file:///C:/Users/matia/OneDrive/My%20GitHub/travel-planner/frontend/src/router/index.tsx) wrapping authenticated routes (Destinos, Planificaciones, Actividades) in `ProtectedRoute`.
  - *Verification*: Run `npm run build --prefix frontend`.

- [ ] **Task 3.2: Implement `LoginPage` & `RegisterPage`**
  - Create `src/pages/LoginPage.tsx`:
    - Form with `email`, `password`, loading state, and error banner.
    - Submit calls `login(credentials)` and navigates to intended location or `/dashboard`.
  - Create `src/pages/RegisterPage.tsx`:
    - Form with `nombre`, `email`, `password`, `rol` selector.
    - Submit calls `register(data)` and navigates to `/dashboard`.
  - Register `/login` and `/register` in `router/index.tsx`.
  - *Verification*: Run `npm run build --prefix frontend`.

- [ ] **Task 3.3: Update `Header` component & Logout flow**
  - Update [Header.tsx](file:///C:/Users/matia/OneDrive/My%20GitHub/travel-planner/frontend/src/components/layout/Header.tsx):
    - Display current user's name and role badge if authenticated.
    - Add "Cerrar Sesión" button triggering a confirmation modal / direct logout call.
    - If unauthenticated, show "Iniciar Sesión" and "Registrarse" navigation links.
  - *Verification*: Run `npm run build --prefix frontend`.

---

## Phase 4: Integration, Testing & Legacy Cleanup

- [ ] **Task 4.1: Remove legacy `UserPicker.tsx` and clean up temp references**
  - Delete `frontend/src/components/temp/UserPicker.tsx`.
  - Remove all remaining references/imports to `UserPicker` across pages and components.
  - Ensure all mock user IDs in existing CRUD components are replaced with `user.id` from `useAuth()`.
  - *Verification*: Run `git grep "UserPicker"` to ensure zero occurrences, then run `npm run build --prefix frontend`.

- [ ] **Task 4.2: Full End-to-End & Integration Test Verification**
  - Backend integration suite: verify register -> login -> get `/api/auth/me` -> call protected resource -> logout -> call protected resource (expect 401).
  - Frontend test suite: verify `ProtectedRoute` blocks unauthenticated access and renders children upon hydration.
  - *Verification*: Run `./mvnw test` in `backend/` and `npm run test` in `frontend/`.
