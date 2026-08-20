# Tasks: Backend Services and Controllers Test Suite

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~350–420 lines |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Quality tooling & Service tests | Single PR | `cd backend && mvnw -B test "-Dtest=*ServiceTest"` | JaCoCo HTML report | `pom.xml`, `src/test/java/.../services/` |
| 2 | Controller slice tests | Single PR | `cd backend && mvnw -B test "-Dtest=*ControllerTest"` | MockMvc Spring slices | `src/test/java/.../controllers/` |

---

## Phase 1: Quality Infrastructure

- [x] 1.1 Add `jacoco-maven-plugin:0.8.12` to `backend/pom.xml` configured for `prepare-agent` and `report` goals.

## Phase 2: Service Unit Tests

- [x] 2.1 Create `UsuarioServiceTest.java` in `backend/src/test/java/com/travelplanner/api/services/` covering CRUD, roles, and exceptions.
- [x] 2.2 Create `DestinoServiceTest.java` in `backend/src/test/java/com/travelplanner/api/services/` covering CRUD and not-found scenarios.
- [x] 2.3 Create `ActividadServiceTest.java` in `backend/src/test/java/com/travelplanner/api/services/` covering CRUD and destination binding.
- [x] 2.4 Create `PlanificacionServiceTest.java` in `backend/src/test/java/com/travelplanner/api/services/` covering itinerary creation and user mapping.

## Phase 3: Controller Slice Tests

- [x] 3.1 Create `UsuarioControllerTest.java` in `backend/src/test/java/com/travelplanner/api/controllers/` testing admin-only role guards and CRUD endpoints.
- [x] 3.2 Create `DestinoControllerTest.java` in `backend/src/test/java/com/travelplanner/api/controllers/` testing destination retrieval and admin mutations.
- [x] 3.3 Create `ActividadControllerTest.java` in `backend/src/test/java/com/travelplanner/api/controllers/` testing activity endpoints and status codes.
- [x] 3.4 Create `PlanificacionControllerTest.java` in `backend/src/test/java/com/travelplanner/api/controllers/` testing plan endpoints.

## Phase 4: Full Suite Verification & Coverage Report

- [x] 4.1 Run full backend test suite via `cd backend && mvnw -B test` and verify JaCoCo HTML report in `target/site/jacoco/index.html`.
