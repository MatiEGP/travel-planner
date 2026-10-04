# Proposal: Enhance CI with Coverage and Security Scanning

## Intent
Enforce automated code coverage thresholds for both the backend (JaCoCo) and frontend (Vitest) to prevent regressions in test coverage. Add static security scanning (CodeQL) to catch vulnerabilities early in the CI pipeline.

## Scope
### In Scope
- Modify `maven.yml` to enforce JaCoCo coverage and upload reports.
- Modify `frontend-ci.yml` to enforce Vitest coverage and upload reports.
- Create a new workflow `codeql.yml` for security scanning.
- Scope explicitly affects **both backend and frontend**.

### Out of Scope
- End-to-End (E2E) testing (e.g., Playwright or Cypress).
- Modifying existing application code (this is strictly a CI/CD and build configuration change).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `backend-testing`: Update REQ-TEST-003 to include enforcement thresholds.
- `frontend-testing`: Add a new requirement for Vitest coverage enforcement.

## Approach
1. **Coverage (Backend)**: Add JaCoCo maven plugin configurations to `backend/pom.xml` to set a minimum line/branch coverage threshold of **50%**. The `maven.yml` pipeline will naturally fail if this threshold isn't met.
2. **Coverage (Frontend)**: Update `frontend/vitest.config.ts` (or `vite.config.ts`) with Vitest coverage thresholds of **50%**. Update `frontend-ci.yml` to run tests and fail if the threshold isn't met.
3. **Security**: Add `.github/workflows/codeql.yml` using the standard GitHub CodeQL template for Java and JavaScript/TypeScript. Configure it to run **only as an audit on pushes to `develop` and `main`**, intentionally avoiding blocking PRs.

## Affected Areas
| Area | Impact | Description |
|------|--------|-------------|
| `.github/workflows/maven.yml` | Modified | Add coverage reporting/upload |
| `.github/workflows/frontend-ci.yml` | Modified | Add vitest coverage run |
| `.github/workflows/codeql.yml` | New | Add CodeQL SAST scanning |
| `backend/pom.xml` | Modified | Add JaCoCo thresholds |
| `frontend/vitest.config.ts` | Modified | Configure coverage thresholds |
| `frontend/package.json` | Modified | Ensure test scripts exist |

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Build failures due to coverage drops | High | Threshold is explicitly set to a conservative 50% baseline. |
| CodeQL vulnerability noise | Medium | CodeQL is configured as an audit-only workflow on main/develop to prevent blocking daily PR velocity. |

## Rollback Plan
Revert the PR containing the workflow changes. Remove the JaCoCo threshold checks from `pom.xml` and Vitest thresholds from `vitest.config.ts`.

## Dependencies
- GitHub Actions environment.
- CodeQL Advanced Security (must be enabled in repository settings if this is a private repo).

## Success Criteria
- [ ] PRs fail if code coverage falls below the 50% threshold.
- [ ] CodeQL analysis runs successfully as an audit on `develop`/`main` pushes and reports vulnerabilities to the GitHub Security tab.
- [ ] Test coverage reports are generated as artifacts in the CI run.
