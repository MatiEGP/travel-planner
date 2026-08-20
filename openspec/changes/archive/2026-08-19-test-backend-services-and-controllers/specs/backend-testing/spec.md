# Backend Testing Specification

## Purpose

Defines functional quality and verification requirements for all core backend services, web controllers, and automated code coverage reporting in the Spring Boot application.

## Requirements

### Requirement: REQ-TEST-001 — Service Layer Unit Testing

The backend **MUST** provide isolated unit tests for `UsuarioService`, `DestinoService`, `ActividadService`, and `PlanificacionService` verifying CRUD operations, entity mapping, and error handling when dependencies are mocked.

#### Scenario: Successful Service Retrieval and Mapping
- **GIVEN** a valid entity ID present in the mocked repository
- **WHEN** the service `obtenerPorId` method is executed
- **THEN** the service returns the corresponding ResponseDTO without database interaction.

#### Scenario: Resource Not Found Exception
- **GIVEN** a non-existent entity ID in the repository
- **WHEN** the service `obtenerPorId` or `eliminar` method is executed
- **THEN** the service throws `RuntimeException` with an informative error message.

---

### Requirement: REQ-TEST-002 — Controller Slice Testing (`@WebMvcTest`)

The backend **MUST** provide Spring MVC slice tests for `UsuarioController`, `DestinoController`, `ActividadController`, and `PlanificacionController` verifying HTTP status codes, security role enforcement, and JSON serialization.

#### Scenario: Admin-Gated Controller Endpoint Authorization
- **GIVEN** an authenticated user with `ROLE_CLIENT`
- **WHEN** a request is made to `GET /api/usuarios` or `DELETE /api/destinos/1`
- **THEN** the server responds with HTTP status `403 Forbidden`.

#### Scenario: Valid Request Payload Processing
- **GIVEN** an authenticated user with required permissions submitting a valid JSON body
- **WHEN** a `POST` or `PUT` request is dispatched to the controller
- **THEN** the server returns HTTP status `200 OK` or `201 Created` with the JSON response DTO.

---

### Requirement: REQ-TEST-003 — Automated Code Coverage Enforcement (JaCoCo)

The Maven build **MUST** configure the JaCoCo plugin to record test execution and generate an HTML/XML code coverage report during `mvn test`.

#### Scenario: Automated Coverage Report Generation
- **GIVEN** a successful execution of `mvn test`
- **WHEN** the surefire test phase completes
- **THEN** JaCoCo produces `target/site/jacoco/index.html` recording instruction and branch coverage.
