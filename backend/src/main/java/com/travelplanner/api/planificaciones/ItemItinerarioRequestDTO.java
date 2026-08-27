package com.travelplanner.api.planificaciones;

import com.travelplanner.api.planificaciones.TipoItem;
import lombok.Data;
import java.time.LocalTime;

@Data
public class ItemItinerarioRequestDTO {
    private Long diaItinerarioId;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private TipoItem tipo;
    private Long referenciaId;
    private String notas;
}
