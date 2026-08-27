package com.travelplanner.api.planificaciones;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PlanificacionRequestDTO {
    private Long usuarioId;
    private String titulo;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
