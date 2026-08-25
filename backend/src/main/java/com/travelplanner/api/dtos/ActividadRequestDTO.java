package com.travelplanner.api.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActividadRequestDTO {
    private Long planificacionId;
    private Long destinoId;
    private String nombre;
    private LocalDateTime fechaHora;
    private String notas;
}