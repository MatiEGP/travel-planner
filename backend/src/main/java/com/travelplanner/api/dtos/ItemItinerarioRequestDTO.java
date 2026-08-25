package com.travelplanner.api.dtos;

import com.travelplanner.api.models.TipoItem;
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
