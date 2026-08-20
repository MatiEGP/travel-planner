# Design: Frontend Vitest Infrastructure and Test Suites

## Technical Approach

Configure Vitest and React Testing Library directly inside the existing Vite 8 + React 19 configuration, using `jsdom` as the DOM environment. Implement unit and component tests that validate auth state transitions, route guards with `<MemoryRouter>`, role-gated UI controls, and API client request mapping.

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| **Test Runner** | Vitest (`vitest`) | Jest + ts-jest | Vitest shares Vite's build configuration, transform pipeline, and plugins without duplicate configuration drift. |
| **DOM Environment** | `jsdom` | `happy-dom` | `jsdom` offers superior compatibility with React 19 SyntheticEvent dispatching and DOM attributes. |
| **Component Testing** | `@testing-library/react` + `@testing-library/jest-dom` | Enzyme / Cypress Component Testing | React Testing Library focuses on testing user-visible behavior and accessibility roles rather than internal component implementation details. |
| **Router Mocking** | `MemoryRouter` with `initialEntries` | Mocking `useNavigate` / `useLocation` hooks directly | `MemoryRouter` executes real React Router 7 route resolution and history state transitions without mock fragility. |

## Data Flow

```
[ Vitest Test Runner ]
          │
          ▼
┌─────────────────────────┐
│ React Testing Library   │ ───► Simulates user clicks, navigation, and renders
│ (MemoryRouter + jsdom)  │
└─────────────────────────┘
          │
          ▼
┌─────────────────────────┐
│ Component / Hook Layer  │ ───► AuthContext, ProtectedRoute, Header, HomePage
└─────────────────────────┘
          │ (Mocked client calls)
          ▼
┌─────────────────────────┐
│ API Services / vi.mock  │ ───► authService, planificacionService, etc.
└─────────────────────────┘
```

## File Changes

| File | Action | Description |
|---|---|---|
| `frontend/package.json` | Modify | Add `vitest`, `jsdom`, `@testing-library/*`, `@vitest/coverage-v8` and test scripts |
| `frontend/vite.config.ts` | Modify | Add `test` configuration block with `jsdom` and setup file |
| `frontend/src/setupTests.ts` | Create | Global setup importing `@testing-library/jest-dom/vitest` and test cleanup |
| `frontend/src/context/__tests__/AuthContext.test.tsx` | Create | Unit test for `AuthProvider` and `useAuth` lifecycle |
| `frontend/src/components/auth/__tests__/ProtectedRoute.test.tsx` | Create | Component test for `ProtectedRoute` redirects and loading state |
| `frontend/src/components/auth/__tests__/GuestRoute.test.tsx` | Create | Component test for `GuestRoute` guest isolation |
| `frontend/src/components/auth/__tests__/RoleRoute.test.tsx` | Create | Component test for `RoleRoute` role verification |
| `frontend/src/components/layout/__tests__/Header.test.tsx` | Create | Component test for `Header` active classes and role navigation |
| `frontend/src/pages/__tests__/HomePage.test.tsx` | Create | Component test for `HomePage` role-gated CTA buttons |
| `frontend/src/services/__tests__/apiServices.test.ts` | Create | Unit test for API service modules with mocked Axios client |

## Interfaces / Contracts

```ts
// src/setupTests.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
```

```tsx
// Test Wrapper Pattern
const renderWithRouter = (ui: React.ReactElement, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  )
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| **Hooks & Context** | Auth state hydration, login/logout transitions, role checks | Testing Library `renderHook` + `waitFor` |
| **Route Guards** | Access control, redirected locations, preserved `state.from` | Component testing inside `<MemoryRouter>` |
| **Navigation & Pages** | Role-based CTAs, active highlight classes on links | Component tests querying accessible roles/text |
| **API Services** | Endpoint URLs, HTTP verbs, payload serialization | Isolated unit tests mocking `api/client.ts` |

## Threat Matrix

| Boundary / Threat | Applicability | Mitigation & Test Plan |
|---|---|---|
| **Unauthorized Frontend Route Access** | Applicable | `ProtectedRoute.test.tsx` and `RoleRoute.test.tsx` verify that non-authorized users cannot render protected views. |
| **Shell / Subprocess Automation** | N/A | No shell or process commands in frontend application code. |

## Migration / Rollout

No data or build migration required.

## Open Questions

None.
