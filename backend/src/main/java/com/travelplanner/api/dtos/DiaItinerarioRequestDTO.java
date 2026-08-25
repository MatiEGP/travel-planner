package com.travelplanner.api.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DiaItinerarioRequestDTO {
    private Long planificacionId;
    private LocalDate fecha;
}
