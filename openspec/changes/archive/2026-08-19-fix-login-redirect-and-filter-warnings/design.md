# Design: Fix Login Redirect and Filter Warnings

## Technical Approach

Standardize post-login navigation across the application by defaulting redirection fallback to `/` (home) while preserving the caller's location state across header navigation links. In the backend, remove `@NonNull` parameter annotations from `JwtAuthFilter.doFilterInternal` to align with Spring Security's `OncePerRequestFilter` base signature.

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| **Default Post-Login Target** | Landing / Home page (`/`) | Dashboard (`/planificaciones`) | Users navigating directly to login expect to land on the homepage; users arriving via protected routes or header links return to their contextual view. |
| **Header Link Location State** | Pass `state={{ from: location }}` in `Header.tsx` | URL query param (e.g. `?redirect=/`) | Router state cleanly encapsulates navigation history without cluttering the URL bar. |
| **Filter Parameter Nullability** | Remove `@NonNull` from overridden `doFilterInternal` parameters | Suppress warnings with `@SuppressWarnings` | Overriding an unannotated method from a framework superclass with `@NonNull` violates contravariance and triggers compiler warnings. |

## Data Flow

```
[ Visitor on /destinos/1 ]
       │
       ▼ (Clicks "Iniciar sesión" in Header)
[ /login with state: { from: { pathname: '/destinos/1' } } ]
       │
       ▼ (Submits valid credentials)
[ Redirects to /destinos/1 ]
```

```
[ Visitor typing /login in browser directly ]
       │
       ▼ (No router state)
[ /login ]
       │
       ▼ (Submits valid credentials)
[ Redirects to / (Home) ]
```

## File Changes

| File | Action | Description |
|---|---|---|
| `frontend/src/components/layout/Header.tsx` | Modify | Use `useLocation()` and pass `state={{ from: location }}` to auth links |
| `frontend/src/pages/LoginPage.tsx` | Modify | Update fallback to `/` and sanitize against self-redirection |
| `frontend/src/pages/RegisterPage.tsx` | Modify | Update fallback to `/` and sanitize against self-redirection |
| `frontend/src/components/auth/GuestRoute.tsx` | Modify | Update destination fallback to `/` |
| `backend/.../config/JwtAuthFilter.java` | Modify | Remove `@NonNull` parameter annotations on `doFilterInternal` |

## Interfaces / Contracts

### Frontend Redirect Resolution Helper
```typescript
export const getRedirectDestination = (stateFrom: unknown): string => {
  if (!stateFrom) return '/';
  if (typeof stateFrom === 'string') {
    return ['/login', '/register', '/registro'].includes(stateFrom) ? '/' : stateFrom;
  }
  if (typeof stateFrom === 'object' && 'pathname' in stateFrom) {
    const path = (stateFrom as { pathname: string }).pathname;
    return ['/login', '/register', '/registro'].includes(path) ? '/' : path;
  }
  return '/';
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| **Static / Compilation (Backend)** | Clean Java compilation without parameter redefinition warnings | Run `mvn clean compile` |
| **Unit / Integration (Backend)** | JWT filter authentication execution | Run `mvn test -Dtest=JwtServiceTest,AuthControllerTest` |
| **Static Verification (Frontend)** | TypeScript compilation & ESLint | Run `npm run build && npm run lint` |

## Threat Matrix

| Boundary / Threat | Applicability | Mitigation & Test Plan |
|---|---|---|
| **Open Redirection** | Applicable | Destination is strictly internal relative path, falling back to `/`. |
| **Infinite Redirect Loop** | Applicable | Check ensures `/login`, `/register`, `/registro` paths fallback to `/`. |
| **Shell / Process Integration** | N/A | No shell commands or process spawning involved. |

## Migration / Rollout

No database or infrastructure changes required.

## Open Questions

None.
