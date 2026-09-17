package com.travelplanner.api.planificaciones;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DiaItinerarioRequestDTO {
    private Long planificacionId;
    private LocalDate fecha;
}
