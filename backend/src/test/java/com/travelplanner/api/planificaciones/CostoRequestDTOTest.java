package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class CostoRequestDTOTest {

    @Test
    void testGettersAndSetters() {
        CostoRequestDTO dto = new CostoRequestDTO();
        dto.setPlanificacionId(1L);
        dto.setCategoria("Comida");
        dto.setMonto(new BigDecimal("50.00"));
        dto.setDescripcion("Cena");

        assertEquals(1L, dto.getPlanificacionId());
        assertEquals("Comida", dto.getCategoria());
        assertEquals(new BigDecimal("50.00"), dto.getMonto());
        assertEquals("Cena", dto.getDescripcion());
    }
}
