package com.travelplanner.api.actividades;

import com.travelplanner.api.actividades.ActividadRequestDTO;
import com.travelplanner.api.actividades.ActividadResponseDTO;
import com.travelplanner.api.actividades.Actividad;
import com.travelplanner.api.actividades.ActividadService;
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
        // 1. Mapeo manual de DTO a Entidad
        Actividad nuevaActividad = new Actividad();
        nuevaActividad.setNombre(request.getNombre());
        nuevaActividad.setFechaHora(request.getFechaHora());
        nuevaActividad.setNotas(request.getNotas());

        // 2. Ejecutar lógica de negocio
        Actividad actividadGuardada = actividadService.crearActividad(request.getDestinoId(), nuevaActividad);

        // 3. Devolver la respuesta mapeada
        return ResponseEntity.status(HttpStatus.CREATED).body(mapearAResponse(actividadGuardada));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ActividadResponseDTO> obtenerActividad(@PathVariable Long id) {
        Actividad actividad = actividadService.buscarPorId(id);
        return ResponseEntity.ok(mapearAResponse(actividad));
    }

    @GetMapping("/destino/{destinoId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ActividadResponseDTO>> listarPorDestino(@PathVariable Long destinoId) {
        // El servicio ya devuelve la lista ordenada por fechaHora ascendente
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

    // Metodo helper para evitar duplicar código de mapeo
    private ActividadResponseDTO mapearAResponse(Actividad actividad) {
        ActividadResponseDTO response = new ActividadResponseDTO();
        response.setId(actividad.getId());
        response.setNombre(actividad.getNombre());
        response.setFechaHora(actividad.getFechaHora());
        response.setNotas(actividad.getNotas());
        return response;
    }
}