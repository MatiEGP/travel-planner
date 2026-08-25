package com.travelplanner.api.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CostoRequestDTO {
    private Long planificacionId;
    private String categoria;
    private BigDecimal monto;
    private String descripcion;
}
