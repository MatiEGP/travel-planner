# Proposal: Backend Services and Controllers Test Suite

## Intent

Establish a comprehensive unit and slice testing suite across all core backend services and controllers (`Usuario`, `Destino`, `Actividad`, `Planificacion`) and configure the JaCoCo code coverage plugin in Maven to establish verifiable quality baselines before structural refactoring.

## Scope

### In Scope
- **Services Unit Tests (JUnit 5 + Mockito)**:
  - `UsuarioServiceTest`: CRUD operations, role assignment, password encoding verification, user not found handling.
  - `DestinoServiceTest`: CRUD operations, destination validation, cascade activity checks.
  - `ActividadServiceTest`: CRUD operations, destination relationship binding, date/cost validation.
  - `PlanificacionServiceTest`: Trip creation, destination association, user ownership checks.
- **Controllers Slice Tests (`@WebMvcTest` + Mock Security)**:
  - `UsuarioControllerTest`: Admin-only endpoints, user creation/update/deletion status codes.
  - `DestinoControllerTest`: Public/authenticated retrieval and admin-gated mutations.
  - `ActividadControllerTest`: Activity listing and management status codes.
  - `PlanificacionControllerTest`: Authenticated user plan management.
- **Quality Tooling**:
  - Add `jacoco-maven-plugin` to `pom.xml` to generate automated HTML/XML coverage reports on `mvn test`.

### Out of Scope
- Frontend tests (deferred to Phase 2).
- Modifying production business logic unless bugs are uncovered by new tests.

## Capabilities

### New Capabilities
- `backend-testing`: Comprehensive unit test coverage and automated code quality verification for all core backend services and REST endpoints.

### Modified Capabilities
None

## Approach

1. **Configure JaCoCo in Maven**:
   - Add `jacoco-maven-plugin` to `backend/pom.xml` configured for `prepare-agent` and `report` phases.
2. **Implement Service Unit Tests**:
   - Use `@ExtendWith(MockitoExtension.class)` for fast, isolated service tests verifying business logic, DTO mapping, and exception paths.
3. **Implement Controller WebMvc Slice Tests**:
   - Use `@WebMvcTest` with `@MockitoBean` / `@MockBean` and Spring Security test mock helpers to test HTTP status codes, request validation, and payload serialization.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `backend/pom.xml` | Modified | Add `jacoco-maven-plugin` |
| `backend/src/test/java/.../services/` | New | Add `UsuarioServiceTest`, `DestinoServiceTest`, `ActividadServiceTest`, `PlanificacionServiceTest` |
| `backend/src/test/java/.../controllers/` | New | Add `UsuarioControllerTest`, `DestinoControllerTest`, `ActividadControllerTest`, `PlanificacionControllerTest` |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Security filter chain interference in slice tests | Low | Import `SecurityConfig` and `JwtService` or mock authenticated context via `@WithMockUser` |

## Rollback Plan

Delete added test classes and remove the JaCoCo plugin configuration from `backend/pom.xml`.

## Dependencies

None

## Success Criteria

- [ ] All new backend unit and controller tests pass with `0` failures and `0` errors.
- [ ] Running `mvn test` generates an HTML coverage report under `backend/target/site/jacoco/`.
- [ ] Backend test execution time remains fast (< 10 seconds total).
