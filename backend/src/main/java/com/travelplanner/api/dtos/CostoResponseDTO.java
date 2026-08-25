package com.travelplanner.api.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CostoResponseDTO {
    private Long id;
    private Long planificacionId;
    private String categoria;
    private BigDecimal monto;
    private String descripcion;
}
