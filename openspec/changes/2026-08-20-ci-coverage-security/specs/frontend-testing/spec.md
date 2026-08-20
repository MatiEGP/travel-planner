# Delta for frontend-testing

## ADDED Requirements

### Requirement: REQ-FTEST-005 — Vitest Coverage Enforcement

The frontend CI pipeline **MUST** configure Vitest to collect coverage using `v8` or `istanbul`, and it **MUST** enforce a minimum coverage threshold of 50%. The CI pipeline **MUST** fail if coverage drops below this threshold.

#### Scenario: Pipeline Failure on Coverage Drop
- **GIVEN** Vitest coverage thresholds are set to 50%
- **WHEN** a PR drops frontend coverage to 49%
- **THEN** the `npm run build` or `npm run test` command fails
- **AND** the GitHub Action reports a failure, blocking the PR from merging.

### Requirement: REQ-FTEST-006 — Static Application Security Testing (CodeQL)

The frontend CI pipeline **MUST** execute GitHub CodeQL static analysis as an asynchronous audit on pushes to the `main` and `develop` branches. It **MUST NOT** run as a blocking check on Pull Requests.

#### Scenario: CodeQL Audit on Develop Branch Push
- **GIVEN** a developer merges a PR into `develop`
- **WHEN** the `push` event is processed by GitHub Actions
- **THEN** the CodeQL workflow executes JavaScript/TypeScript static analysis
- **AND** the results are published to the repository's Security tab without blocking developer velocity.
