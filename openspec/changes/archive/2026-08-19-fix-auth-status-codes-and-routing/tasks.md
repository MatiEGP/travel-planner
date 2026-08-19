# Tasks: Fix Auth HTTP Status Codes and Guest Routing

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~80–120 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Backend 401 EntryPoint & Controller update | Single PR | `cd backend && mvnw -B test -Dtest=AuthControllerTest` | N/A (MockMvc covers full HTTP cycle) | `SecurityConfig.java`, `JwtAuthenticationEntryPoint.java`, `AuthController.java` |
| 2 | Frontend GuestRoute & Page cleanup | Single PR | `cd frontend && npm run build && npm run lint` | N/A (React Router and TypeScript build) | `GuestRoute.tsx`, `router/index.tsx`, `LoginPage.tsx`, `RegisterPage.tsx` |

---

## Phase 1: Backend Security & Controller Updates

- [x] 1.1 Create `backend/src/main/java/com/travelplanner/api/config/JwtAuthenticationEntryPoint.java` implementing `AuthenticationEntryPoint` to write 401 `ErrorResponseDTO` JSON.
- [x] 1.2 Modify `backend/src/main/java/com/travelplanner/api/config/SecurityConfig.java` to register `JwtAuthenticationEntryPoint` in `http.exceptionHandling()`.
- [x] 1.3 Modify `backend/src/main/java/com/travelplanner/api/controllers/AuthController.java` to remove `estaAutenticado()` blocking check from `/login` and `/registro`.

## Phase 2: Frontend Guest Route & Component Refactoring

- [x] 2.1 Create `frontend/src/components/auth/GuestRoute.tsx` to handle loading state and redirect authenticated users to `/planificaciones` (or `state.from`).
- [x] 2.2 Modify `frontend/src/router/index.tsx` to wrap `/login`, `/register`, and `/registro` routes under `<GuestRoute />`.
- [x] 2.3 Modify `frontend/src/pages/LoginPage.tsx` to remove the redundant imperative `useEffect` redirect.
- [x] 2.4 Modify `frontend/src/pages/RegisterPage.tsx` to remove the redundant imperative `useEffect` redirect.

## Phase 3: Verification & Test Alignment

- [x] 3.1 Update `backend/src/test/java/com/travelplanner/api/controllers/AuthControllerTest.java` to verify 401 on unauthenticated `/api/auth/me` and session overwrite on `/api/auth/login`.
- [x] 3.2 Execute backend test suite via `cd backend && mvnw -B clean verify`.
- [x] 3.3 Execute frontend verification via `cd frontend && npm run lint && npm run build`.
