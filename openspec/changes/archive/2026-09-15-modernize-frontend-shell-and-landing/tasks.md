# Tasks: Modernize Frontend Shell and Landing Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Modernize frontend shell, align background canvas, refresh landing page, clamp 3D auth cards, and align test suite | Single PR | `npm run test:run` | `npm run dev` at `/`, `/login`, `/planificaciones` | Revert `RootLayout.tsx`, `DiscoveryLayout.tsx`, `Header.tsx`, `HomePage.tsx`, `AnimatedAuthContainer.tsx`, and associated tests |

## Phase 1: Foundations & Layout Background Alignment

- [x] 1.1 Unify canvas styling in `frontend/src/layouts/RootLayout.tsx` to `bg-[#F7F9FA]` / `bg-slate-50` across auth and authenticated routes.
  - Validation: `npm run test:run -- src/layouts/__tests__/RootLayout.test.tsx`
- [x] 1.2 Align `frontend/src/layouts/DiscoveryLayout.tsx` to use consistent light background `bg-[#F7F9FA]` / `bg-slate-50` without duplicate container nesting.
  - Validation: Inspect `DiscoveryLayout.tsx` structure and verify no conflicting dark background classes.

## Phase 2: Modern Header Redesign & Admin Removal

- [x] 2.1 Refactor `frontend/src/shared/components/layout/Header.tsx` surface to light translucent styling (`bg-white/80 backdrop-blur-md border-b border-slate-200/80`).
  - Validation: Verify container classes and brand link routing to `/`.
- [x] 2.2 Remove the `/admin` conditional navigation link completely from `frontend/src/shared/components/layout/Header.tsx`.
  - Validation: Verify no `hasRole('ADMIN')` or `/admin` JSX exists in `Header.tsx`.
- [x] 2.3 Redesign authenticated user profile pill and add accessible light-themed logout confirmation modal in `frontend/src/shared/components/layout/Header.tsx`.
  - Validation: Verify logout confirmation modal toggle and session invalidation on confirmation.

## Phase 3: Landing Page Modernization

- [x] 3.1 Modernize hero typography, subtle gradients, and card containers in `frontend/src/features/planificaciones/pages/HomePage.tsx`.
  - Validation: `npm run test:run -- src/features/planificaciones/pages/__tests__/HomePage.test.tsx`
- [x] 3.2 Update primary action buttons and guest/client CTAs in `frontend/src/features/planificaciones/pages/HomePage.tsx` to align with Wanderlog light aesthetic.
  - Validation: Verify CTA routing to `/planificaciones` and `/login` via React Router `<Link>`.

## Phase 4: Auth Responsive Fix

- [x] 4.1 Apply responsive `translateX` clamping (e.g. `md:max-w-md` and clamped translations) in `frontend/src/features/auth/containers/AnimatedAuthContainer.tsx` to prevent horizontal clipping on viewports >= 768px.
  - Validation: Inspect CSS transform classes and container overflow boundaries.
- [x] 4.2 Add reduced motion transform support in `frontend/src/features/auth/containers/AnimatedAuthContainer.tsx` using `motion-reduce:transform-none` or equivalent.
  - Validation: Verify reduced motion query compatibility and element accessibility.

## Phase 5: Verification & Test Suite Updates

- [x] 5.1 Update `frontend/src/shared/components/layout/__tests__/Header.test.tsx` to assert light theme styling, verify absence of `/admin` link for admin roles, and test logout modal.
  - Validation: `npm run test:run -- src/shared/components/layout/__tests__/Header.test.tsx`
- [x] 5.2 Update `frontend/src/layouts/__tests__/RootLayout.test.tsx` and `frontend/src/features/auth/pages/__tests__/AuthPages.test.tsx` to assert updated background canvas and 3D card layout attributes.
  - Validation: `npm run test:run -- src/layouts/__tests__/RootLayout.test.tsx src/features/auth/pages/__tests__/AuthPages.test.tsx`
- [x] 5.3 Execute full frontend test suite and production build.
  - Validation: Run `npm run test:run` and `npm run build` in `frontend/`.
