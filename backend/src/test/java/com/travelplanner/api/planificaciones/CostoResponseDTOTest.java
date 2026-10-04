package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class CostoResponseDTOTest {

    @Test
    void testGettersAndSetters() {
        CostoResponseDTO dto = new CostoResponseDTO();
        dto.setId(10L);
        dto.setPlanificacionId(1L);
        dto.setCategoria("Alojamiento");
        dto.setMonto(new BigDecimal("200.00"));
        dto.setDescripcion("Hotel Paris");

        assertEquals(10L, dto.getId());
        assertEquals(1L, dto.getPlanificacionId());
        assertEquals("Alojamiento", dto.getCategoria());
        assertEquals(new BigDecimal("200.00"), dto.getMonto());
        assertEquals("Hotel Paris", dto.getDescripcion());
    }
}
