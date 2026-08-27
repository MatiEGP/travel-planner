# Tasks: Test Coverage para Evolución Dominio

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~600 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Entities & DTOs) -> PR 2 (Services & Repos) -> PR 3 (Controllers) |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Domain & DTOs Tests | PR 1 | `mvn test -Dtest=*Test` | N/A (Tests only) | `backend/src/test/java/.../planificaciones/*` |
| 2 | Services & Repos Tests | PR 2 | `mvn test -Dtest=*ServiceTest,*RepositoryTest` | N/A (Tests only) | `backend/src/test/java/.../planificaciones/*` |
| 3 | Controller Slice Tests | PR 3 | `mvn test -Dtest=*ControllerTest` | N/A (Tests only) | `backend/src/test/java/.../planificaciones/*` |

## Phase 1: Models & DTOs Testing (Unit)

- [x] 1.1 Create `CostoTest.java`, `CostoRequestDTOTest.java`, and `CostoResponseDTOTest.java`
- [x] 1.2 Create `DiaItinerarioTest.java`, `DiaItinerarioRequestDTOTest.java`, and `DiaItinerarioResponseDTOTest.java`
- [x] 1.3 Create `ItemItinerarioTest.java`, `ItemItinerarioRequestDTOTest.java`, and `ItemItinerarioResponseDTOTest.java`
- [x] 1.4 Create `TipoItemTest.java`

## Phase 2: Service & Repository Layer Testing

- [x] 2.1 Create `CostoServiceTest.java` with mocked `CostoRepository`
- [x] 2.2 Create `CostoRepositoryTest.java`
- [x] 2.3 Create `DiaItinerarioRepositoryTest.java`
- [x] 2.4 Create `ItemItinerarioRepositoryTest.java`

## Phase 3: Controller Layer Testing

- [ ] 3.1 Create `CostoControllerTest.java` using `@WebMvcTest(CostoController.class)`

## Phase 4: Verification

- [ ] 4.1 Run JaCoCo report to verify `planificaciones` package coverage is >= 50%
