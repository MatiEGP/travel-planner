package com.travelplanner.api.planificaciones;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ItemItinerarioResponseDTO {
    private Long id;
    private Long diaItinerarioId;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private TipoItem tipo;
    private Long referenciaId;
    private String notas;
}
