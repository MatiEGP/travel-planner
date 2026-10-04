# Proposal: Modernize Frontend Shell and Landing Page

## Intent

The frontend shell (`Header`, `RootLayout`) retains dark styling (`bg-slate-900`) and unmanaged admin links that conflict with the light Wanderlog design in `PlanificacionesPage` and `AuthPage`. Also, `AnimatedAuthContainer` clips on tablet viewports due to fixed 3D offsets. This change modernizes the shell, aligns backgrounds, fixes auth responsiveness, and removes the `/admin` navigation link.

## Scope

### In Scope
- **Header Modernization**: Redesign `Header.tsx` with light backdrop blur, responsive nav links, user profile widget, polished logout modal, and guest CTAs. Logo links to `/`.
- **Admin Navigation Deprecation**: Remove `/admin` nav link from `Header.tsx` (Option B).
- **Home / Landing Page**: Modernize `HomePage.tsx` hero and CTAs matching the design system.
- **Auth Responsiveness**: Fix `AnimatedAuthContainer.tsx` 3D card translation to eliminate viewport clipping on smaller screens.
- **Layout Consistency**: Set `RootLayout.tsx` and `DiscoveryLayout.tsx` backgrounds to `#F7F9FA` / `slate-50`.

### Out of Scope
- Backend modifications (backend is read-only).
- Admin management CRUD implementation.
- Trip planning business logic.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `frontend-layouts`: Update shell requirements for light canvas, modern Header, and landing structure.
- `auth`: Remove `/admin` header link and add responsive constraints for `AnimatedAuthContainer`.

## Approach

1. Refactor `Header.tsx` from dark slate to light translucent styling (`bg-white/80 backdrop-blur-md border-b border-slate-200/80`), update active link styles, profile, and logout modal.
2. Remove `/admin` conditional link from `Header.tsx`.
3. Standardize `RootLayout.tsx` canvas to `bg-slate-50` (`#F7F9FA`).
4. Modernize `HomePage.tsx` hero section with light surfaces and clean CTAs.
5. Apply responsive translateX boundaries to `AnimatedAuthContainer.tsx` to prevent clipping.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/shared/components/layout/Header.tsx` | Modified | Light theme, removed admin link, modern profile |
| `frontend/src/layouts/RootLayout.tsx` | Modified | Light canvas background across routes |
| `frontend/src/layouts/DiscoveryLayout.tsx` | Modified | Light background token alignment |
| `frontend/src/features/planificaciones/pages/HomePage.tsx` | Modified | Modernized landing layout and CTAs |
| `frontend/src/features/auth/containers/AnimatedAuthContainer.tsx` | Modified | Responsive 3D card positioning |
| `frontend/src/shared/components/layout/__tests__/Header.test.tsx` | Modified | Update tests for new styling and removed admin link |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 3D animation glitch during auth flip | Low | Validate flip transition and reduced-motion mode across breakpoints |
| Test failures from removed admin link | Medium | Update `Header.test.tsx` assertions to match updated contract |

## Rollback Plan

Revert commits modifying `Header.tsx`, `RootLayout.tsx`, `DiscoveryLayout.tsx`, `HomePage.tsx`, and `AnimatedAuthContainer.tsx`.

## Dependencies

None (React 19, Tailwind CSS v4 stack).

## Success Criteria

- [ ] Header renders with light backdrop blur and styled user profile pill.
- [ ] `/admin` link is removed from Header navigation.
- [ ] RootLayout displays `#F7F9FA` / `slate-50` background consistently.
- [ ] AnimatedAuthContainer renders without overflow or clipping at widths >= 768px.
- [ ] Frontend tests pass (`npm run test:run`).
