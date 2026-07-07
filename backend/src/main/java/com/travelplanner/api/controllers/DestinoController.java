package com.travelplanner.api.controllers;

import com.travelplanner.api.dtos.DestinoRequestDTO;
import com.travelplanner.api.dtos.DestinoResponseDTO;
import com.travelplanner.api.models.Destino;
import com.travelplanner.api.services.DestinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/destinos")
@RequiredArgsConstructor
public class DestinoController {

    private final DestinoService destinoService;

    @PostMapping
    public ResponseEntity<DestinoResponseDTO> crearDestino(@RequestBody DestinoRequestDTO request) {
        // Mapeo de DTO a Entity
        Destino destinoNuevo = new Destino();
        destinoNuevo.setNombre(request.getNombre());
        destinoNuevo.setPais(request.getPais());
        destinoNuevo.setCiudad(request.getCiudad());
        destinoNuevo.setNotas(request.getNotas());

        Destino destinoGuardado = destinoService.crearDestino(request.getPlanificacionId(), destinoNuevo);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapearAResponse(destinoGuardado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinoResponseDTO> obtenerDestino(@PathVariable Long id) {
        Destino destino = destinoService.buscarDestinoPorId(id);
        return ResponseEntity.ok(mapearAResponse(destino));
    }

    @GetMapping("/planificacion/{planificacionId}")
    public ResponseEntity<List<DestinoResponseDTO>> listarPorPlanificacion(@PathVariable Long planificacionId) {
        List<Destino> destinos = destinoService.obtenerDestinosPorPlanificacion(planificacionId);

        List<DestinoResponseDTO> responseList = destinos.stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDestino(@PathVariable Long id) {
        destinoService.eliminarDestino(id);
        return ResponseEntity.noContent().build();
    }

    // Helper para mapeo de ResponseDTO.
    private DestinoResponseDTO mapearAResponse(Destino destino) {
        DestinoResponseDTO response = new DestinoResponseDTO();
        response.setId(destino.getId());
        response.setNombre(destino.getNombre());
        response.setPais(destino.getPais());
        response.setCiudad(destino.getCiudad());
        response.setNotas(destino.getNotas());
        return response;
    }
}