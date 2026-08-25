package com.travelplanner.api.dtos;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DiaItinerarioResponseDTO {
    private Long id;
    private Long planificacionId;
    private LocalDate fecha;
    private List<ItemItinerarioResponseDTO> items;
}
