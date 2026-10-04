# Tasks: Frontend Vitest Infrastructure and Test Suites

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~380–440 lines |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Vitest setup & Auth/Guards tests | Single PR | `cd frontend && npm test` | jsdom Vitest runner | `package.json`, `vite.config.ts`, `src/setupTests.ts`, `src/context/`, `src/components/auth/` |
| 2 | Component & Service tests | Single PR | `cd frontend && npm run test:coverage` | Vitest v8 coverage | `src/components/layout/`, `src/pages/`, `src/services/` |

---

## Phase 1: Test Infrastructure Setup

- [x] 1.1 Install `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `@vitest/coverage-v8` in `frontend/`.
- [x] 1.2 Update `frontend/vite.config.ts` with the `test` configuration block and add `test` and `test:coverage` scripts to `package.json`.
- [x] 1.3 Create `frontend/src/setupTests.ts` importing `@testing-library/jest-dom/vitest` and global cleanup.

## Phase 2: Auth Context & Route Guard Suites

- [x] 2.1 Create `frontend/src/context/__tests__/AuthContext.test.tsx` testing session hydration, login, register, logout, and role checking.
- [x] 2.2 Create `frontend/src/components/auth/__tests__/ProtectedRoute.test.tsx` testing authenticated access and unauthenticated redirection.
- [x] 2.3 Create `frontend/src/components/auth/__tests__/GuestRoute.test.tsx` testing guest access and authenticated redirection.
- [x] 2.4 Create `frontend/src/components/auth/__tests__/RoleRoute.test.tsx` testing role validation and forbidden redirection.

## Phase 3: Component & Service Suites

- [x] 3.1 Create `frontend/src/components/layout/__tests__/Header.test.tsx` testing active link classes and guest vs authenticated navigation.
- [x] 3.2 Create `frontend/src/pages/__tests__/HomePage.test.tsx` testing role-gated call-to-action buttons.
- [x] 3.3 Create `frontend/src/services/__tests__/apiServices.test.ts` testing API client methods for all 5 services.

## Phase 4: Full Suite Verification & Coverage

- [x] 4.1 Run `npm test` and `npm run test:coverage` to verify all frontend tests pass and coverage is recorded.
