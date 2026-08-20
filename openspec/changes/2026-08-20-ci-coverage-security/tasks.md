# Tasks: Enhance CI with Coverage and Security Scanning

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~60-80 lines |
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
| 1 | CI enhancements | PR 1 | `npm run test:coverage` & `mvn test` | N/A (CI config changes only) | Revert the single PR |

## Phase 1: Local Coverage Enforcement (Build Tools)

- [x] 1.1 **Backend Coverage**: Modify `backend/pom.xml` to add `<execution><id>check</id>` to `jacoco-maven-plugin` with `COVEREDRATIO` minimums of `0.50` for `INSTRUCTION` and `BRANCH`.
- [x] 1.2 **Frontend Coverage**: Modify `frontend/vite.config.ts` to add `thresholds: { lines: 50, branches: 50, functions: 50, statements: 50 }` inside the `test.coverage` block.

## Phase 2: GitHub Actions Workflows (CI Integration)

- [x] 2.1 **Frontend CI Action**: Modify `.github/workflows/frontend-ci.yml` to run `npm run test:coverage` (instead of standard test, or add it as a new step) and add an `actions/upload-artifact@v4` step for the `frontend/coverage/` directory.
- [x] 2.2 **Backend CI Action**: Modify `.github/workflows/maven.yml` to add an `actions/upload-artifact@v4` step for `backend/target/site/jacoco/` (since `mvn verify` inherently runs the JaCoCo check phase).
- [x] 2.3 **CodeQL Security Workflow**: Create `.github/workflows/codeql.yml` from standard GitHub Java/JS templates, triggered on `push` to `[ "main", "develop" ]`.

## Phase 3: Testing & Verification

- [x] 3.1 **Integration Validation (Backend)**: Temporarily modify a backend file to drop coverage below 50% and verify `mvn verify` fails locally. Revert the file.
- [x] 3.2 **Integration Validation (Frontend)**: Temporarily comment out frontend tests to drop coverage below 50% and verify `npm run test:coverage` fails locally. Revert the file.
