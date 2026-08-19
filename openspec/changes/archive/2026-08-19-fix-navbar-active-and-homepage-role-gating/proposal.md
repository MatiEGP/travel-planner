# Proposal: Fix Navbar Active States and HomePage Role Gating

## Intent

Standardize navbar active indicators for authentication routes (`/login`, `/register`) and gate homepage action buttons based on user authentication and roles (`ROLE_ADMIN` vs `ROLE_CLIENT` vs Guest).

## Scope

### In Scope
- **Header Navigation**: Convert `Iniciar sesión` and `Registrarse` links from plain `<Link>` to `<NavLink>` with active styling to highlight when viewing `/login` or `/register`.
- **HomePage Actions**:
  - **Unauthenticated (Guest)**: Show primary "Registrarse" and secondary "Iniciar sesión" CTA buttons.
  - **Client (`ROLE_CLIENT`)**: Show "Mis Planificaciones" CTA button only (hide Admin panel).
  - **Admin (`ROLE_ADMIN`)**: Show both "Mis Planificaciones" and "Panel de Administración" CTA buttons.

### Out of Scope
- Backend authorization or endpoint changes (already protected).
- Modifying other static landing page content.

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `auth`: Update `REQ-FE-004` (Role-Based Component Gating) and `REQ-FE-005` (Navigation & Active States) to specify role-dependent homepage presentation and navbar active state indicators.

## Approach

1. **Header Component**:
   - In `Header.tsx`, wrap `/login` and `/register` in `<NavLink>` with dynamic classes applying `bg-teal-900 text-white` (or styled active background) when active.
2. **HomePage Component**:
   - In `HomePage.tsx`, consume `useAuth()` (`isAuthenticated`, `hasRole('ADMIN')`) and render role-appropriate action buttons.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `frontend/src/components/layout/Header.tsx` | Modified | Use `NavLink` for `/login` and `/register` with active classes |
| `frontend/src/pages/HomePage.tsx` | Modified | Add role-gated CTA button rendering |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Active state conflicts on nested/aliased paths | Low | Use `end` prop on `NavLink` matching |

## Rollback Plan

Revert changes to `Header.tsx` and `HomePage.tsx`.

## Dependencies

None

## Success Criteria

- [ ] Navigating to `/login` marks the "Iniciar sesión" navbar button as active.
- [ ] Navigating to `/register` marks the "Registrarse" navbar button as active.
- [ ] Unauthenticated users on `/` see "Registrarse" and "Iniciar sesión" buttons, and no Admin panel button.
- [ ] Clients on `/` see only "Mis Planificaciones".
- [ ] Admins on `/` see "Mis Planificaciones" and "Panel de Administración".
