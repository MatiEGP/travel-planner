# Design: Enhance CI with Coverage and Security Scanning

## Technical Approach

We will augment the existing `maven.yml` and `frontend-ci.yml` workflows to fail if code coverage drops below the agreed 50% threshold (implementing `REQ-TEST-003` and `REQ-FTEST-005`). Code coverage thresholds will be enforced directly in the respective build tools (`pom.xml` via JaCoCo check goal, and `vite.config.ts` via Vitest coverage options). We will also introduce a `codeql.yml` workflow that acts as a non-blocking security audit on `main` and `develop` branches (`REQ-TEST-004` and `REQ-FTEST-006`).

## Architecture Decisions

### Decision: Enforcing Coverage in Build Tools vs CI Steps

**Choice**: Enforce coverage in `pom.xml` (JaCoCo `check` goal) and `vite.config.ts` (Vitest `thresholds`).
**Alternatives considered**: Enforcing coverage by parsing report files in bash scripts within the GitHub Actions runner.
**Rationale**: Native build tool enforcement is more robust, less error-prone, and enables developers to catch coverage drops locally before pushing to CI.

### Decision: CodeQL Workflow Strategy

**Choice**: Separate asynchronous workflow (`codeql.yml`) triggering only on `push` to `main` and `develop`.
**Alternatives considered**: Integrating CodeQL directly into the PR validation workflows (`maven.yml` and `frontend-ci.yml`).
**Rationale**: CodeQL on Java requires a full compilation step. Running it on every PR commit adds significant wait times. An audit-only approach balances security visibility with developer velocity.

## Data Flow

    GitHub Actions (PR/Push)
         │
         ├───> maven.yml ────> mvn verify (Runs Tests & JaCoCo Check)
         │                       └──> Fails if coverage < 50%
         │
         ├───> frontend-ci.yml ──> npm run test:coverage (Vitest Check)
         │                       └──> Fails if coverage < 50%
         │
         └───> codeql.yml (Async) ──> Compiles & Scans ──> Uploads to GH Security Tab

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/pom.xml` | Modify | Add `<execution><id>check</id>` to `jacoco-maven-plugin` with 50% minimum threshold. |
| `frontend/vite.config.ts` | Modify | Add `thresholds: { lines: 50, branches: 50, functions: 50, statements: 50 }` under `test.coverage`. |
| `.github/workflows/frontend-ci.yml` | Modify | Add a step to run `npm run test:coverage` before the build step. Add an artifact upload step for `coverage/` directory. |
| `.github/workflows/maven.yml` | Modify | Add an artifact upload step for `backend/target/site/jacoco/` directory. |
| `.github/workflows/codeql.yml` | Create | Standard GitHub CodeQL template for Java and JavaScript, restricted to `main` and `develop` pushes. |

## Interfaces / Contracts

### JaCoCo Check Configuration (`pom.xml`)
```xml
<execution>
    <id>check</id>
    <goals><goal>check</goal></goals>
    <configuration>
        <rules>
            <rule>
                <element>BUNDLE</element>
                <limits>
                    <limit>
                        <counter>INSTRUCTION</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.50</minimum>
                    </limit>
                    <limit>
                        <counter>BRANCH</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.50</minimum>
                    </limit>
                </limits>
            </rule>
        </rules>
    </configuration>
</execution>
```

### Vitest Coverage Configuration (`vite.config.ts`)
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'html'],
  thresholds: {
    lines: 50,
    branches: 50,
    functions: 50,
    statements: 50,
  }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | CI Configurations | N/A (CI pipelines cannot be unit tested directly). |
| Integration | Coverage Enforcements | Create a dummy PR that drops coverage below 50% to ensure CI turns red. |
| E2E | CodeQL Audit | Merge a test commit to `develop` and verify CodeQL triggers and uploads to Security tab. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation (affecting execution within the app), executable-file classification, or process-integration boundary inside the application code. These are standard CI validations.

## Migration / Rollout

No data migration required. Existing PRs may fail if their respective coverage is already below 50%. The team should be notified of the new CI rules.

## Open Questions

- None
