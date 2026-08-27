# Planificaciones Specification

## Purpose

Defines the testing and coverage requirements for the domain models, DTOs, services, repositories, and controllers in the `planificaciones` module, specifically targeting the `evolucion-dominio` additions (`Costo`, `DiaItinerario`, `ItemItinerario`, `TipoItem`).

## Requirements

### Requirement: REQ-PLAN-001 — Unit Testing for Domain Models and DTOs

The system MUST include isolated unit tests for `Costo`, `DiaItinerario`, `ItemItinerario`, and `TipoItem` domain entities and their associated DTOs, verifying instantiations, getters, setters, and basic logic.

#### Scenario: Valid Model Instantiation and Data Access
- GIVEN valid data for a domain model or DTO
- WHEN the model or DTO is instantiated and its properties are accessed
- THEN the properties return the expected values.

### Requirement: REQ-PLAN-002 — Service Layer Testing

The system MUST provide unit tests for `planificaciones` services using mocked repositories to verify business logic and data mapping without database interaction.

#### Scenario: Service Logic Execution with Mocked Repository
- GIVEN a mocked repository returning valid domain entities
- WHEN the service method is invoked
- THEN the service correctly processes the data and returns the expected result.

### Requirement: REQ-PLAN-003 — Controller Slice Testing

The system MUST provide Spring MVC slice tests (`MockMvc`) for `planificaciones` controllers to verify HTTP request handling and response serialization.

#### Scenario: Controller Endpoint HTTP Handling
- GIVEN a valid simulated HTTP request via `MockMvc`
- WHEN the controller endpoint is invoked
- THEN the controller returns the expected HTTP status and serialized response payload.

### Requirement: REQ-PLAN-004 — Minimum Code Coverage Threshold

The `planificaciones` domain classes (models, DTOs, controllers, services, repositories) MUST achieve a minimum of 50% code coverage as reported by JaCoCo.

#### Scenario: JaCoCo Coverage Verification
- GIVEN the unit test suite has executed successfully
- WHEN the JaCoCo coverage report is generated
- THEN the coverage for the new `planificaciones` classes is at least 50%.
