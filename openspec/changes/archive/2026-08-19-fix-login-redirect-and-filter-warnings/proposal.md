# Proposal: Fix Login Redirect and Filter Warnings

## Intent

Fix post-login redirection behavior in the frontend so users return to their previous view (or fall back to the landing/home page `/` when navigating directly), and eliminate Java compiler/IDE null-safety warnings in `JwtAuthFilter`.

## Scope

### In Scope
- **Frontend**: Update post-login and post-registration redirect fallback from `/planificaciones` to the home page (`/`).
- **Frontend**: Preserve current location in router state when clicking "Iniciar sesión" or "Registrarse" in `Header.tsx`.
- **Frontend**: Update `GuestRoute` fallback destination to `/`.
- **Backend**: Remove `@NonNull` annotations from `JwtAuthFilter.doFilterInternal` parameters to match Spring's `OncePerRequestFilter` superclass signature without compiler diagnostics.

### Out of Scope
- Modifying authentication endpoints, token format, or session storage.
- Adding server-side redirect callbacks.

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `auth`: Update `REQ-FE-003` and `REQ-FE-007` so post-login and guest redirection defaults to `/` (home) instead of `/planificaciones` and preserves prior location across header links.

## Approach

1. **Frontend Redirection**:
   - In `LoginPage.tsx`, `RegisterPage.tsx`, and `GuestRoute.tsx`, set destination fallback to `/`.
   - In `Header.tsx`, pass `state={{ from: location }}` to `/login` and `/register` links.
   - Robustly resolve `from` as a string or `Location` object while guarding against `/login` or `/register` self-loops.
2. **Backend Filter Signature**:
   - Remove `org.springframework.lang.NonNull` annotations from `JwtAuthFilter.doFilterInternal(request, response, filterChain)`.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `frontend/src/pages/LoginPage.tsx` | Modified | Update redirect fallback to `/` |
| `frontend/src/pages/RegisterPage.tsx` | Modified | Update redirect fallback to `/` |
| `frontend/src/components/auth/GuestRoute.tsx` | Modified | Update redirect fallback to `/` |
| `frontend/src/components/layout/Header.tsx` | Modified | Attach current `location` to auth links |
| `backend/.../config/JwtAuthFilter.java` | Modified | Remove `@NonNull` on overridden method |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Redirect loop to `/login` if `from` is `/login` | Low | Sanitize `from` to fallback to `/` if pointing to guest routes |

## Rollback Plan

Revert git changes to `LoginPage.tsx`, `RegisterPage.tsx`, `GuestRoute.tsx`, `Header.tsx`, and `JwtAuthFilter.java`.

## Dependencies

None

## Success Criteria

- [ ] Direct navigation to `/login` redirects to `/` upon successful login.
- [ ] Clicking "Iniciar sesión" from any page returns the user to that page post-login.
- [ ] Backend compiles cleanly with zero null-safety / method-override warnings.
- [ ] All frontend and backend builds pass.
