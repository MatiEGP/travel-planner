# Proposal: Test Coverage para Evolución Dominio

## Intent

Agregar pruebas unitarias de backend para alcanzar el mínimo del 50% de cobertura requerido por JaCoCo para los nuevos modelos, DTOs, controladores, servicios y repositorios introducidos en la rama `evolucion-dominio` (específicamente `Costo`, `DiaItinerario`, `ItemItinerario`, `TipoItem`). Esto asegura la calidad y mantenibilidad del código nuevo antes de su integración.

## Scope

### In Scope
- Escribir pruebas unitarias para modelos: `Costo`, `DiaItinerario`, `ItemItinerario`, `TipoItem`.
- Escribir pruebas unitarias para los DTOs asociados.
- Escribir pruebas unitarias para los controladores asociados.
- Escribir pruebas unitarias para los servicios asociados.
- Escribir pruebas unitarias para los repositorios asociados.
- Configurar/verificar reporte de JaCoCo para asegurar el 50% de cobertura.

### Out of Scope
- Pruebas de integración, E2E o de frontend.
- Refactorización de lógica de negocio existente, a menos que sea estrictamente necesario para la testabilidad.
- Alcanzar el 100% de cobertura (el objetivo es cumplir con el 50%).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None

## Approach

Se utilizará JUnit y Mockito (que son el estándar en aplicaciones Java Spring Boot típicas que usan JaCoCo) para escribir pruebas unitarias aisladas. Los servicios se probarán mockeando los repositorios. Los controladores se probarán utilizando `MockMvc` para simular llamadas HTTP. Los modelos y DTOs se probarán con instanciación directa verificando getters, setters y lógica simple. Se ejecutará JaCoCo localmente para validar que se alcanza el umbral del 50%.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/test/java/.../planificaciones/` | New | Pruebas unitarias para entidades (Costo, DiaItinerario, ItemItinerario, TipoItem) |
| `src/test/java/.../planificaciones/` | New | Pruebas unitarias para DTOs de dominio |
| `src/test/java/.../planificaciones/` | New | Pruebas unitarias para Controladores de dominio |
| `src/test/java/.../planificaciones/` | New | Pruebas unitarias para Servicios de dominio |
| `src/test/java/.../planificaciones/` | New | Pruebas unitarias para Repositorios de dominio |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Dependencias complejas no mockeables | Low | Refactorización menor o uso de `@Mock` / `@InjectMocks` |
| Cobertura por debajo del 50% en ciertas clases | Medium | Identificar ramas críticas y escribir pruebas específicas para ellas |

## Rollback Plan

Dado que solo se están agregando pruebas, si hay problemas en el pipeline (por ejemplo, fallos de compilación de pruebas o aserciones incorrectas), se pueden deshabilitar temporalmente con `@Disabled` o revertir el commit de las pruebas hasta que se corrijan localmente.

## Dependencies

- JUnit 5
- Mockito
- JaCoCo plugin configurado en el build (Maven/Gradle).

## Success Criteria

- [ ] Todas las pruebas unitarias pasan exitosamente (`BUILD SUCCESS`).
- [ ] El reporte de JaCoCo muestra una cobertura de al menos 50% para los paquetes/clases mencionadas.
- [ ] No se rompen pruebas existentes.
