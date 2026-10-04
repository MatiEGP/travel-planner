package com.travelplanner.api.actividades;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {

    private final ActividadService actividadService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ActividadResponseDTO> crearActividad(@RequestBody ActividadRequestDTO request) {
        Actividad nuevaActividad = new Actividad();
        nuevaActividad.setNombre(request.getNombre());
        nuevaActividad.setFechaHora(request.getFechaHora());
        nuevaActividad.setNotas(request.getNotas());

        Actividad actividadGuardada = actividadService.crearActividad(
                request.getPlanificacionId(), 
                request.getDestinoId(), 
                nuevaActividad
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(mapearAResponse(actividadGuardada));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ActividadResponseDTO> obtenerActividad(@PathVariable Long id) {
        Actividad actividad = actividadService.buscarPorId(id);
        return ResponseEntity.ok(mapearAResponse(actividad));
    }

    @GetMapping("/planificacion/{planificacionId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ActividadResponseDTO>> listarPorPlanificacion(@PathVariable Long planificacionId) {
        List<Actividad> actividades = actividadService.obtenerActividadesPorPlanificacion(planificacionId);
        List<ActividadResponseDTO> responseList = actividades.stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/destino/{destinoId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ActividadResponseDTO>> listarPorDestino(@PathVariable Long destinoId) {
        List<Actividad> actividades = actividadService.obtenerActividadesPorDestino(destinoId);
        List<ActividadResponseDTO> responseList = actividades.stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> eliminarActividad(@PathVariable Long id) {
        actividadService.eliminarActividad(id);
        return ResponseEntity.noContent().build();
    }

    private ActividadResponseDTO mapearAResponse(Actividad actividad) {
        ActividadResponseDTO response = new ActividadResponseDTO();
        response.setId(actividad.getId());
        if (actividad.getPlanificacion() != null) {
            response.setPlanificacionId(actividad.getPlanificacion().getId());
        }
        if (actividad.getDestino() != null) {
            response.setDestinoId(actividad.getDestino().getId());
        }
        response.setNombre(actividad.getNombre());
        response.setFechaHora(actividad.getFechaHora());
        response.setNotas(actividad.getNotas());
        return response;
    }
}