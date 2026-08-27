package com.travelplanner.api.actividades;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActividadResponseDTO {
    private Long id;
    private String nombre;
    private LocalDateTime fechaHora;
    private String notas;
}