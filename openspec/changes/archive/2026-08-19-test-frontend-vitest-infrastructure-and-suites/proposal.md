# Proposal: Frontend Vitest Infrastructure and Test Suites

## Intent

Establish an automated unit and component testing infrastructure in the React frontend using Vitest, jsdom, and React Testing Library. Implement test suites covering authentication context, route guards, key navigation components, and API service layers with code coverage reporting.

## Scope

### In Scope
- **Testing Infrastructure**:
  - Install `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `@vitest/coverage-v8`.
  - Configure `vite.config.ts` (or `vitest.config.ts`) and create `src/setupTests.ts`.
  - Add `npm test` (`vitest run`) and `npm run test:coverage` (`vitest run --coverage`) scripts to `package.json`.
- **Auth Context & Hook Tests**:
  - `AuthContext.test.tsx`: initial session hydration (`/api/auth/me`), `login`, `register`, `logout`, error handling, and `hasRole` checks.
- **Route Guard Tests**:
  - `ProtectedRoute.test.tsx`: redirect to `/login` when unauthenticated, render children when authenticated.
  - `GuestRoute.test.tsx`: redirect to `/` when authenticated, render children when unauthenticated.
  - `RoleRoute.test.tsx`: 403 / redirect when role is missing, render children when role matches.
- **Component & Navigation Tests**:
  - `Header.test.tsx`: verify active navbar indicators on auth pages and role-gated navigation items.
  - `HomePage.test.tsx`: verify role-gated call-to-action buttons.
- **Service Integration Tests**:
  - Unit tests for `authService.ts`, `planificacionService.ts`, `destinoService.ts`, `actividadService.ts`, and `usuarioService.ts` with mocked Axios client.

### Out of Scope
- End-to-end (E2E) browser testing (Playwright/Cypress deferred to future milestone).
- Modifying production UI styling or layout.

## Capabilities

### New Capabilities
- `frontend-testing`: Automated unit, component, and hook testing harness using Vitest and React Testing Library with v8 code coverage.

### Modified Capabilities
None

## Approach

1. **Install and Configure Vitest**:
   - Add devDependencies and configure `vite.config.ts` with `test: { globals: true, environment: 'jsdom', setupFiles: './src/setupTests.ts' }`.
2. **Implement Test Suites**:
   - Write tests for Context (`AuthContext`), route guards (`ProtectedRoute`, `GuestRoute`, `RoleRoute`), components (`Header`, `HomePage`), and API services.
3. **Validate Quality & Coverage**:
   - Run `npm test` and `npm run test:coverage` to verify all suites pass with 100% success.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `frontend/package.json` | Modified | Add Vitest dependencies and npm test scripts |
| `frontend/vite.config.ts` | Modified | Add test configuration block |
| `frontend/src/setupTests.ts` | New | Global test setup and `@testing-library/jest-dom` imports |
| `frontend/src/context/__tests__/` | New | `AuthContext.test.tsx` |
| `frontend/src/components/auth/__tests__/` | New | Route guard tests (`ProtectedRoute`, `GuestRoute`, `RoleRoute`) |
| `frontend/src/components/layout/__tests__/` | New | `Header.test.tsx` |
| `frontend/src/pages/__tests__/` | New | `HomePage.test.tsx` |
| `frontend/src/services/__tests__/` | New | Service unit tests for API clients |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| React 19 compatibility with testing library | Low | Use current `@testing-library/react` and `@testing-library/jest-dom` |
| React Router context in component tests | Low | Wrap rendered components with `<MemoryRouter>` |

## Rollback Plan

Remove test files, uninstall testing devDependencies, and revert `vite.config.ts` and `package.json`.

## Dependencies

None

## Success Criteria

- [ ] `npm test` runs all frontend tests and exits with code `0`.
- [ ] `npm run test:coverage` generates v8 coverage report with zero test errors.
- [ ] `npm run lint` and `npm run build` continue to pass cleanly.
