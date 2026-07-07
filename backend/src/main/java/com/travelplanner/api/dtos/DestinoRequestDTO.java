package com.travelplanner.api.dtos;

import lombok.Data;

@Data
public class DestinoRequestDTO {
    private Long planificacionId;
    private String nombre;
    private String pais;
    private String ciudad;
    private String notas;
}
