# Delta for backend-testing

## ADDED Requirements

### Requirement: REQ-TEST-004 — Static Application Security Testing (CodeQL)

The backend CI pipeline **MUST** execute GitHub CodeQL static analysis as an asynchronous audit on pushes to the `main` and `develop` branches. It **MUST NOT** run as a blocking check on Pull Requests.

#### Scenario: CodeQL Audit on Main Branch Push
- **GIVEN** a developer merges a PR into `main`
- **WHEN** the `push` event is processed by GitHub Actions
- **THEN** the CodeQL workflow executes Java static analysis
- **AND** the results are published to the repository's Security tab without blocking developer velocity.

## MODIFIED Requirements

### Requirement: REQ-TEST-003 — Automated Code Coverage Enforcement (JaCoCo)

The Maven build **MUST** configure the JaCoCo plugin to enforce a strict minimum line and branch coverage threshold of 50%. The build **MUST** fail if coverage drops below this threshold.
(Previously: JaCoCo merely recorded test execution and generated a report without enforcing any thresholds)

#### Scenario: Automated Coverage Report Generation
- **GIVEN** a successful execution of `mvn test`
- **WHEN** the surefire test phase completes
- **THEN** JaCoCo produces `target/site/jacoco/index.html` recording instruction and branch coverage.

#### Scenario: Pipeline Failure on Coverage Drop
- **GIVEN** the JaCoCo coverage thresholds are set to 50%
- **WHEN** a PR drops total test coverage to 49%
- **THEN** the Maven build fails during the `verify` phase
- **AND** the CI pipeline reports a failure, blocking the PR from merging.
