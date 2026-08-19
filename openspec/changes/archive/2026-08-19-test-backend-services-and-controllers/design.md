# Design: Backend Services and Controllers Test Suite

## Technical Approach

Implement a comprehensive testing pyramid for the backend using JUnit 5, Mockito, and Spring MockMvc (`@WebMvcTest`), supplemented by the JaCoCo Maven plugin for automated test coverage and quality metrics.

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| **Service Layer Testing** | Mockito unit tests (`@ExtendWith(MockitoExtension.class)`) | `@SpringBootTest` full integration tests | Mockito unit tests execute in milliseconds, do not start a Spring context, and test pure business logic in complete isolation. |
| **Controller Layer Testing** | `@WebMvcTest` with `@MockBean` / `@MockitoBean` | RestAssured or `@SpringBootTest(webEnvironment=RANDOM_PORT)` | WebMvc slice tests verify routing, Spring Security rules, and DTO serialization without needing a real embedded servlet container or database. |
| **Coverage Tooling** | `jacoco-maven-plugin:0.8.12` | Cobertura / manual IDE coverage | JaCoCo is the standard Java coverage engine, generating HTML and XML reports directly during `mvn test`. |

## Data Flow

```
[ MockMvc / Unit Test Runner ]
          │
          ▼
┌─────────────────────────┐
│ WebMvc Slice Layer      │ ───► Verifies HTTP Status, Security Role, JSON Serializer
│ (Controller + Mock Sec) │
└─────────────────────────┘
          │ (Mock calls)
          ▼
┌─────────────────────────┐
│ Service Unit Layer      │ ───► Verifies Business Rules, DTO Mapping, Exceptions
│ (Service + Mockito)     │
└─────────────────────────┘
          │ (Mock calls)
          ▼
   [ Mock Repository ]
```

## File Changes

| File | Action | Description |
|---|---|---|
| `backend/pom.xml` | Modify | Add `jacoco-maven-plugin` configuration |
| `backend/src/test/java/.../services/UsuarioServiceTest.java` | Create | Unit test for `UsuarioService` CRUD and role mapping |
| `backend/src/test/java/.../services/DestinoServiceTest.java` | Create | Unit test for `DestinoService` CRUD |
| `backend/src/test/java/.../services/ActividadServiceTest.java` | Create | Unit test for `ActividadService` CRUD and destino binding |
| `backend/src/test/java/.../services/PlanificacionServiceTest.java` | Create | Unit test for `PlanificacionService` itinerary creation |
| `backend/src/test/java/.../controllers/UsuarioControllerTest.java` | Create | WebMvc slice test for `/api/usuarios` endpoints |
| `backend/src/test/java/.../controllers/DestinoControllerTest.java` | Create | WebMvc slice test for `/api/destinos` endpoints |
| `backend/src/test/java/.../controllers/ActividadControllerTest.java` | Create | WebMvc slice test for `/api/actividades` endpoints |
| `backend/src/test/java/.../controllers/PlanificacionControllerTest.java` | Create | WebMvc slice test for `/api/planificaciones` endpoints |

## Interfaces / Contracts

```java
@ExtendWith(MockitoExtension.class)
class ServiceUnitTestTemplate {
    @Mock private EntityRepository repository;
    @InjectMocks private EntityService service;
    // isolated JUnit 5 test methods
}
```

```java
@WebMvcTest(TargetController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class})
class ControllerSliceTestTemplate {
    @Autowired private MockMvc mockMvc;
    @MockBean private TargetService service;
    @MockBean private JwtService jwtService;
    // mockMvc.perform(...) test methods with @WithMockUser
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| **Service Units** | Business validations, entity-to-DTO conversions, repository invocations | Isolated JUnit 5 + Mockito tests |
| **Controller Slices** | Path mappings, HTTP status codes, security role gates (`ROLE_ADMIN` vs `ROLE_CLIENT`) | `@WebMvcTest` with Spring Security test context |
| **Code Coverage** | Instruction and branch coverage reports | Automated JaCoCo HTML report in `target/site/jacoco/` |

## Threat Matrix

| Boundary / Threat | Applicability | Mitigation & Test Plan |
|---|---|---|
| **Unauthorized Privilege Escalation** | Applicable | Controller tests verify that `ROLE_CLIENT` cannot access `/api/usuarios` or administrative endpoints (returns 403). |
| **Shell / Process Integration** | N/A | No shell or process commands in application code. |

## Migration / Rollout

No database or deployment migration required.

## Open Questions

None.
