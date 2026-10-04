# Tasks: Migrate Backend to Package-by-Feature (Screaming Architecture)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250 lines (Package/Import statements only) |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Full Structural Refactor | PR 1 | `mvn clean verify` | N/A (pure refactor, no behavior change) | Abandon branch |

## Phase 1: Package Structure Initialization

- [x] 1.1 Create feature directories in `backend/src/main/java/com/travelplanner/api/`: `auth`, `usuarios`, `planificaciones`, `destinos`, `actividades`.
- [x] 1.2 Create identical feature directories in `backend/src/test/java/com/travelplanner/api/`.

## Phase 2: Feature Migration (Source Files)

*For each file moved, update its `package` declaration and any required `import` statements immediately.*

- [x] 2.1 Move `JwtService`, `AuthController`, `LoginRequestDTO`, `LoginResponseDTO`, `RegistroRequestDTO` to `auth/`.
- [x] 2.2 Move `Usuario`, `Rol`, `UsuarioRepository`, `RolRepository`, `UsuarioService`, `UsuarioController`, and `Usuario*DTO` to `usuarios/`.
- [x] 2.3 Move `Planificacion`, `PlanificacionRepository`, `PlanificacionService`, `PlanificacionController`, and `Planificacion*DTO` to `planificaciones/`.
- [x] 2.4 Move `Destino`, `DestinoRepository`, `DestinoService`, `DestinoController`, and `Destino*DTO` to `destinos/`.
- [x] 2.5 Move `Actividad`, `ActividadRepository`, `ActividadService`, `ActividadController`, and `Actividad*DTO` to `actividades/`.

## Phase 3: Global Imports Update

- [x] 3.1 Update imports in `config/SecurityConfig.java` and `config/JwtAuthFilter.java` to point to the new `auth` and `usuarios` packages.
- [x] 3.2 Update imports in `exceptions/GlobalExceptionHandler.java` if necessary.

## Phase 4: Test Migration

- [x] 4.1 Move all `*Test.java` files from `src/test/java/.../controllers`, `services`, `repositories` into their respective new feature packages in `test/`.
- [x] 4.2 Update `package` declarations and `import` statements for all moved test files.

## Phase 5: Cleanup & Verification

- [x] 5.1 Delete the now-empty legacy directories in `src/main/java`: `controllers`, `services`, `repositories`, `models`, `dtos`.
- [x] 5.2 Delete the now-empty legacy directories in `src/test/java`: `controllers`, `services`, `repositories`.
- [x] 5.3 Run `mvn clean verify` to ensure all imports are resolved, Spring context loads successfully, and tests pass.
