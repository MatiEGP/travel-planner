# Design: Fix Navbar Active States and HomePage Role Gating

## Technical Approach

Implement active route styling on header auth navigation links using React Router's `<NavLink>` and update `HomePage.tsx` to conditionally render call-to-action buttons based on user authentication state and role.

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| **Auth Link Navigation Component** | `<NavLink>` with active CSS helper functions | Manual URL comparison with `useLocation().pathname` | `NavLink` encapsulates active matching natively with React Router, supporting nested routes and query params. |
| **HomePage Role Presentation** | Conditional render based on `useAuth()` (`isAuthenticated`, `hasRole('ADMIN')`) | Separate landing page components for guest vs user | Single component with clean declarative conditional blocks keeps layout DRY while enforcing role boundaries. |

## Data Flow

```
[ Visitor / Client / Admin on "/" ]
       │
       ▼ (useAuth context)
       ├─ If !isAuthenticated ───► Render [ Registrarse ] + [ Iniciar sesión ]
       ├─ If ROLE_CLIENT       ───► Render [ Mis Planificaciones ]
       └─ If ROLE_ADMIN        ───► Render [ Mis Planificaciones ] + [ Panel de Administración ]
```

## File Changes

| File | Action | Description |
|---|---|---|
| `frontend/src/components/layout/Header.tsx` | Modify | Switch guest auth `<Link>` to `<NavLink>` with active style helper functions |
| `frontend/src/pages/HomePage.tsx` | Modify | Connect `useAuth()` and conditionally render role-based CTA buttons |

## Interfaces / Contracts

```typescript
// Header NavLink Active Class Helpers
const getAuthNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
    isActive ? 'bg-teal-900 text-white' : 'text-teal-100 hover:bg-teal-700 hover:text-white'
  }`;

const getRegisterNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `text-sm font-medium py-1.5 px-3.5 rounded-lg transition-colors duration-200 ${
    isActive
      ? 'bg-teal-900 text-white ring-1 ring-white/30'
      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
  }`;
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| **Static Verification** | TypeScript compilation & ESLint | `npm run lint && npm run build` |
| **Visual / Behavioral** | NavLink active state on `/login` and `/register`, CTA visibility per role | React router render inspection |

## Threat Matrix

| Boundary / Threat | Applicability | Mitigation & Test Plan |
|---|---|---|
| **UI Information Leakage** | Applicable | Admin panel entry point is completely omitted from DOM for non-admin sessions. |
| **Shell / Process Integration** | N/A | No shell or process execution boundaries involved. |

## Migration / Rollout

No database or infrastructure migration required.

## Open Questions

None.
