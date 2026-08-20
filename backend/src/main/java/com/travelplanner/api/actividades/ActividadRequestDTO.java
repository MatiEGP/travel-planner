package com.travelplanner.api.actividades;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActividadRequestDTO {
    private Long destinoId;
    private String nombre;
    private LocalDateTime fechaHora;
    private String notas;
}