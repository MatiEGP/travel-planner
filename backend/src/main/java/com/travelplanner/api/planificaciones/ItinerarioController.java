package com.travelplanner.api.planificaciones;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/itinerarios")
@RequiredArgsConstructor
public class ItinerarioController {

    private final ItinerarioService itinerarioService;

    // --- DIAS ---

    @PostMapping("/dias")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<DiaItinerarioResponseDTO> crearDia(@RequestBody DiaItinerarioRequestDTO request) {
        DiaItinerario dia = new DiaItinerario();
        dia.setFecha(request.getFecha());
        
        DiaItinerario guardado = itinerarioService.crearDiaItinerario(request.getPlanificacionId(), dia);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapearDia(guardado));
    }

    @GetMapping("/planificacion/{planificacionId}/dias")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<DiaItinerarioResponseDTO>> listarDias(@PathVariable Long planificacionId) {
        List<DiaItinerario> dias = itinerarioService.obtenerDiasPorPlanificacion(planificacionId);
        List<DiaItinerarioResponseDTO> response = dias.stream().map(this::mapearDia).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/dias/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> eliminarDia(@PathVariable Long id) {
        itinerarioService.eliminarDia(id);
        return ResponseEntity.noContent().build();
    }

    // --- ITEMS ---

    @PostMapping("/items")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ItemItinerarioResponseDTO> crearItem(@RequestBody ItemItinerarioRequestDTO request) {
        ItemItinerario item = new ItemItinerario();
        item.setHoraInicio(request.getHoraInicio());
        item.setHoraFin(request.getHoraFin());
        item.setTipo(request.getTipo());
        item.setReferenciaId(request.getReferenciaId());
        item.setNotas(request.getNotas());

        ItemItinerario guardado = itinerarioService.crearItem(request.getDiaItinerarioId(), item);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapearItem(guardado));
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> eliminarItem(@PathVariable Long id) {
        itinerarioService.eliminarItem(id);
        return ResponseEntity.noContent().build();
    }

    // --- MAPPERS ---

    private DiaItinerarioResponseDTO mapearDia(DiaItinerario dia) {
        DiaItinerarioResponseDTO dto = new DiaItinerarioResponseDTO();
        dto.setId(dia.getId());
        dto.setPlanificacionId(dia.getPlanificacion().getId());
        dto.setFecha(dia.getFecha());
        if (dia.getItems() != null) {
            dto.setItems(dia.getItems().stream().map(this::mapearItem).collect(Collectors.toList()));
        }
        return dto;
    }

    private ItemItinerarioResponseDTO mapearItem(ItemItinerario item) {
        ItemItinerarioResponseDTO dto = new ItemItinerarioResponseDTO();
        dto.setId(item.getId());
        dto.setDiaItinerarioId(item.getDiaItinerario().getId());
        dto.setHoraInicio(item.getHoraInicio());
        dto.setHoraFin(item.getHoraFin());
        dto.setTipo(item.getTipo());
        dto.setReferenciaId(item.getReferenciaId());
        dto.setNotas(item.getNotas());
        return dto;
    }
}
