package com.travelplanner.api.destinos;

import lombok.Data;

@Data
public class DestinoResponseDTO {
    private Long id;
    private String nombre;
    private String pais;
    private String ciudad;
    private String notas;
}
