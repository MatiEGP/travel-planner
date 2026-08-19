# Tasks: Fix Login Redirect and Filter Warnings

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~35–50 lines |
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
| 1 | Backend filter signature cleanup | Single PR | `cd backend && mvnw -B test-compile` | N/A (compile warning check) | `JwtAuthFilter.java` |
| 2 | Frontend post-login home fallback & location state | Single PR | `cd frontend && npm run lint && npm run build` | N/A (React router navigation) | `Header.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, `GuestRoute.tsx` |

---

## Phase 1: Backend Filter Signature Cleanup

- [x] 1.1 Remove `@NonNull` parameter annotations from `JwtAuthFilter.doFilterInternal` in `backend/src/main/java/com/travelplanner/api/config/JwtAuthFilter.java`.

## Phase 2: Frontend Redirection and Location State

- [x] 2.1 Update `frontend/src/components/layout/Header.tsx` to pass `state={{ from: location }}` in "Iniciar sesión" and "Registrarse" links.
- [x] 2.2 Update `frontend/src/pages/LoginPage.tsx` to resolve `from` defaulting to `/` with self-loop prevention.
- [x] 2.3 Update `frontend/src/pages/RegisterPage.tsx` to resolve post-registration destination defaulting to `/`.
- [x] 2.4 Update `frontend/src/components/auth/GuestRoute.tsx` to fallback destination to `/`.

## Phase 3: Verification

- [x] 3.1 Verify backend compilation and tests via `cd backend && mvnw -B test "-Dtest=JwtServiceTest,AuthControllerTest"`.
- [x] 3.2 Verify frontend build and lint via `cd frontend && npm run lint && npm run build`.
