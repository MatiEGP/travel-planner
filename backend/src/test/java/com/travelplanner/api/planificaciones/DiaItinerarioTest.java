package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class DiaItinerarioTest {

    @Test
    void testGettersAndSetters() {
        DiaItinerario dia = new DiaItinerario();
        dia.setId(1L);
        dia.setFecha(LocalDate.of(2023, 10, 1));
        
        Planificacion planificacion = new Planificacion();
        planificacion.setId(10L);
        dia.setPlanificacion(planificacion);

        List<ItemItinerario> items = new ArrayList<>();
        items.add(new ItemItinerario());
        dia.setItems(items);

        assertEquals(1L, dia.getId());
        assertEquals(LocalDate.of(2023, 10, 1), dia.getFecha());
        assertEquals(planificacion, dia.getPlanificacion());
        assertEquals(1, dia.getItems().size());
    }

    @Test
    void testBuilder() {
        Planificacion planificacion = new Planificacion();
        planificacion.setId(10L);

        List<ItemItinerario> items = new ArrayList<>();
        items.add(new ItemItinerario());

        DiaItinerario dia = DiaItinerario.builder()
                .id(1L)
                .fecha(LocalDate.of(2023, 10, 1))
                .planificacion(planificacion)
                .items(items)
                .build();

        assertEquals(1L, dia.getId());
        assertEquals(LocalDate.of(2023, 10, 1), dia.getFecha());
        assertEquals(planificacion, dia.getPlanificacion());
        assertEquals(1, dia.getItems().size());
    }
}
