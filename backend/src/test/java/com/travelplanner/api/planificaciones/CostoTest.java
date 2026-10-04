package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class CostoTest {

    @Test
    void testCostoGettersAndSetters() {
        Costo costo = new Costo();
        costo.setId(1L);
        costo.setCategoria("Transporte");
        costo.setMonto(new BigDecimal("150.00"));
        costo.setDescripcion("Vuelo a Paris");

        Planificacion planificacion = new Planificacion();
        planificacion.setId(10L);
        costo.setPlanificacion(planificacion);

        assertEquals(1L, costo.getId());
        assertEquals("Transporte", costo.getCategoria());
        assertEquals(new BigDecimal("150.00"), costo.getMonto());
        assertEquals("Vuelo a Paris", costo.getDescripcion());
        assertEquals(planificacion, costo.getPlanificacion());
    }

    @Test
    void testCostoBuilder() {
        Planificacion planificacion = new Planificacion();
        planificacion.setId(10L);

        Costo costo = Costo.builder()
                .id(1L)
                .categoria("Transporte")
                .monto(new BigDecimal("150.00"))
                .descripcion("Vuelo a Paris")
                .planificacion(planificacion)
                .build();

        assertEquals(1L, costo.getId());
        assertEquals("Transporte", costo.getCategoria());
        assertEquals(new BigDecimal("150.00"), costo.getMonto());
        assertEquals("Vuelo a Paris", costo.getDescripcion());
        assertEquals(planificacion, costo.getPlanificacion());
    }
}
