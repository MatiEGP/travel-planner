# Design: Modernize Frontend Shell and Landing Page

## Technical Approach

Migrate the frontend shell and landing experience from legacy dark-slate styles (`bg-slate-900`) to a cohesive, light Wanderlog-inspired aesthetic (`#F7F9FA`, `bg-white/80 backdrop-blur-md`). This change standardizes canvas backgrounds in `RootLayout` and `DiscoveryLayout`, removes unmanaged `/admin` navigation links from `Header`, redesigns the user profile and logout modal with accessible light surfaces, and applies responsive translation clamping in `AnimatedAuthContainer` to eliminate 3D card clipping on tablet viewports (>= 768px).

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|-------------------------|-----------|
| **Global Canvas Color** | Standardize `#F7F9FA` / `bg-slate-50` across all layouts | Maintain `bg-slate-900` on root; dynamic dark/light theme | Eliminates abrupt background flashes between `/planificaciones`, `/login`, and root shell navigation. |
| **Header Surface & Tokens** | Light translucent `bg-white/80 backdrop-blur-md border-slate-200/80` with teal accents | Solid white background; dark translucent navbar | Matches modern Wanderlog aesthetic while preserving sticky elevation and readability over page content. |
| **Admin Link Deprecation** | Remove `/admin` navigation link from `Header.tsx` | Retain conditional `/admin` link; move to profile dropdown | Consumer-facing header should not expose administrative links; `/admin` route remains protected via `RoleRoute` for direct access. |
| **Logout Modal Styling** | Centered light dialog with `bg-white`, `border-slate-200`, rose action button | Native `window.confirm()`; instant logout without prompt | Light card matches application theme while preventing accidental session termination with accessible confirmation. |
| **Auth 3D Card Responsiveness** | Responsive clamp on `translateX` offset (40% on tablet, 60% on desktop) + container constraints | Disable 3D flip on tablet; reduce padding only | Prevents 3D cards from overflowing the 768px viewport while preserving interactive flip animations and full clickability. |

## Component Structure & Data Flow

```
+-------------------------------------------------------------+
| RootLayout (bg-[#F7F9FA], min-h-screen)                     |
|  ├── GlobalLoadingBar                                       |
|  ├── Header (if !isAuthRoute: bg-white/80, profile, modal)  |
|  └── Outlet                                                 |
|       ├── HomePage (DiscoveryLayout, light hero & CTAs)    |
|       ├── PlanificacionesPage (Mis Viajes, Wanderlog tabs)  |
|       └── AuthPage / AnimatedAuthContainer (responsive 3D)  |
+-------------------------------------------------------------+
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/shared/components/layout/Header.tsx` | Modify | Apply light translucent styling, remove `/admin` link, update profile pill and light logout modal |
| `frontend/src/layouts/RootLayout.tsx` | Modify | Unify canvas background to `bg-[#F7F9FA]` across auth and non-auth routes |
| `frontend/src/layouts/DiscoveryLayout.tsx` | Modify | Replace `bg-sand-50` with `bg-[#F7F9FA]` / `bg-slate-50` light canvas |
| `frontend/src/features/planificaciones/pages/HomePage.tsx` | Modify | Modernize hero typography, icon surfaces, and action CTA buttons |
| `frontend/src/features/auth/containers/AnimatedAuthContainer.tsx` | Modify | Apply responsive translation clamping and container boundaries to avoid tablet overflow |
| `frontend/src/shared/components/layout/__tests__/Header.test.tsx` | Modify | Update test assertions for light styling and verify `/admin` is not rendered |
| `frontend/src/layouts/__tests__/RootLayout.test.tsx` | Modify | Update tests to assert `bg-[#F7F9FA]` canvas on both auth and root routes |
| `frontend/src/features/auth/pages/__tests__/AuthPages.test.tsx` | Modify | Adjust 3D transform assertions for responsive desktop/tablet clamping |

## Interfaces / Contracts

No new backend API contracts or external interfaces are introduced. Component prop signatures remain backward-compatible:

```typescript
// Unchanged external props contract
export interface AnimatedAuthContainerProps {
  activeMode?: 'login' | 'signup';
  onModeChange?: (mode: 'login' | 'signup') => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `Header.tsx` light styling & removed admin link | Vitest + React Testing Library verifying logo link, guest/client links, modal behavior, and absence of `/admin` |
| Unit | `RootLayout.tsx` canvas consistency | Vitest asserting `bg-[#F7F9FA]` class presence on all routes |
| Integration | `HomePage.tsx` landing hero and CTAs | Verify hero rendering and navigation CTAs for authenticated and guest users |
| Integration | `AnimatedAuthContainer.tsx` tablet/desktop rendering | Verify 3D card positioning, clamp behavior, mode flips, and accessibility without clipping |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Pure frontend presentation refactor deployed with standard static asset release.

## Open Questions

None. All styling tokens, layout requirements, and component interfaces are fully resolved.
