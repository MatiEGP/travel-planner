# Tasks: Fix Navbar Active States and HomePage Role Gating

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~20–35 lines |
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
| 1 | Navbar active indicators & HomePage role gating | Single PR | `cd frontend && npm run lint && npm run build` | N/A (UI render / navigation) | `Header.tsx`, `HomePage.tsx` |

---

## Phase 1: Core Implementation

- [x] 1.1 Update `frontend/src/components/layout/Header.tsx` to use `<NavLink>` with active styling helpers for `/login` and `/register`.
- [x] 1.2 Update `frontend/src/pages/HomePage.tsx` to conditionally render CTA buttons per role using `useAuth()`.

## Phase 2: Verification

- [x] 2.1 Verify TypeScript compilation, ESLint, and production build via `cd frontend && npm run lint && npm run build`.
