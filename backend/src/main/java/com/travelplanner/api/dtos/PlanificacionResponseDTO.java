package com.travelplanner.api.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PlanificacionResponseDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
