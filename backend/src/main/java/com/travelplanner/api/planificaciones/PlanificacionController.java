package com.travelplanner.api.planificaciones;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/planificaciones")
@RequiredArgsConstructor
public class PlanificacionController {

    private final PlanificacionService planificacionService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<PlanificacionResponseDTO> crearPlanificacion(@RequestBody PlanificacionRequestDTO request) {
        // Mapeo de DTO a Entity
        Planificacion planificacionNueva = new Planificacion();
        planificacionNueva.setTitulo(request.getTitulo());
        planificacionNueva.setDescripcion(request.getDescripcion());
        planificacionNueva.setFechaInicio(request.getFechaInicio());
        planificacionNueva.setFechaFin(request.getFechaFin());

        Planificacion planificacionGuardada = planificacionService.crearPlanificacion(request.getUsuarioId(), planificacionNueva);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapearAResponse(planificacionGuardada));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<PlanificacionResponseDTO> obtenerPlanificacion(@PathVariable Long id) {
        Planificacion planificacion = planificacionService.buscarPorId(id);
        return ResponseEntity.ok(mapearAResponse(planificacion));
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<PlanificacionResponseDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Planificacion> planificaciones = planificacionService.obtenerPlanificacionesPorUsuario(usuarioId);
        List<PlanificacionResponseDTO> responseList = planificaciones.stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> eliminarPlanificacion(@PathVariable Long id) {
        planificacionService.eliminarPlanificacion(id);
        return ResponseEntity.noContent().build();
    }

    // Helper para mapeo de ResponseDTO.
    private PlanificacionResponseDTO mapearAResponse(Planificacion planificacion) {
        PlanificacionResponseDTO response = new PlanificacionResponseDTO();
        response.setId(planificacion.getId());
        response.setTitulo(planificacion.getTitulo());
        response.setDescripcion(planificacion.getDescripcion());
        response.setFechaInicio(planificacion.getFechaInicio());
        response.setFechaFin(planificacion.getFechaFin());
        return response;
    }
}
