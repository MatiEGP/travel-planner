package com.travelplanner.api.controllers;

import com.travelplanner.api.dtos.CostoRequestDTO;
import com.travelplanner.api.dtos.CostoResponseDTO;
import com.travelplanner.api.models.Costo;
import com.travelplanner.api.services.CostoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/costos")
@RequiredArgsConstructor
public class CostoController {

    private final CostoService costoService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CostoResponseDTO> crearCosto(@RequestBody CostoRequestDTO request) {
        Costo nuevoCosto = new Costo();
        nuevoCosto.setCategoria(request.getCategoria());
        nuevoCosto.setMonto(request.getMonto());
        nuevoCosto.setDescripcion(request.getDescripcion());

        Costo costoGuardado = costoService.crearCosto(request.getPlanificacionId(), nuevoCosto);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapearAResponse(costoGuardado));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CostoResponseDTO> obtenerCosto(@PathVariable Long id) {
        Costo costo = costoService.buscarPorId(id);
        return ResponseEntity.ok(mapearAResponse(costo));
    }

    @GetMapping("/planificacion/{planificacionId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<CostoResponseDTO>> listarPorPlanificacion(@PathVariable Long planificacionId) {
        List<Costo> costos = costoService.obtenerCostosPorPlanificacion(planificacionId);
        List<CostoResponseDTO> responseList = costos.stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> eliminarCosto(@PathVariable Long id) {
        costoService.eliminarCosto(id);
        return ResponseEntity.noContent().build();
    }

    private CostoResponseDTO mapearAResponse(Costo costo) {
        CostoResponseDTO response = new CostoResponseDTO();
        response.setId(costo.getId());
        response.setPlanificacionId(costo.getPlanificacion().getId());
        response.setCategoria(costo.getCategoria());
        response.setMonto(costo.getMonto());
        response.setDescripcion(costo.getDescripcion());
        return response;
    }
}
