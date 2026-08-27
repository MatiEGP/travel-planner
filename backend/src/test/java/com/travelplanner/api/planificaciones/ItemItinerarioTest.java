package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.time.LocalTime;
import static org.junit.jupiter.api.Assertions.*;

class ItemItinerarioTest {

    @Test
    void testGettersAndSetters() {
        ItemItinerario item = new ItemItinerario();
        item.setId(1L);
        
        DiaItinerario dia = new DiaItinerario();
        dia.setId(10L);
        item.setDiaItinerario(dia);
        
        item.setHoraInicio(LocalTime.of(9, 0));
        item.setHoraFin(LocalTime.of(12, 0));
        item.setTipo(TipoItem.ACTIVIDAD);
        item.setReferenciaId(100L);
        item.setNotas("Visita guiada");

        assertEquals(1L, item.getId());
        assertEquals(dia, item.getDiaItinerario());
        assertEquals(LocalTime.of(9, 0), item.getHoraInicio());
        assertEquals(LocalTime.of(12, 0), item.getHoraFin());
        assertEquals(TipoItem.ACTIVIDAD, item.getTipo());
        assertEquals(100L, item.getReferenciaId());
        assertEquals("Visita guiada", item.getNotas());
    }

    @Test
    void testBuilder() {
        DiaItinerario dia = new DiaItinerario();
        dia.setId(10L);

        ItemItinerario item = ItemItinerario.builder()
                .id(1L)
                .diaItinerario(dia)
                .horaInicio(LocalTime.of(9, 0))
                .horaFin(LocalTime.of(12, 0))
                .tipo(TipoItem.ACTIVIDAD)
                .referenciaId(100L)
                .notas("Visita guiada")
                .build();

        assertEquals(1L, item.getId());
        assertEquals(dia, item.getDiaItinerario());
        assertEquals(LocalTime.of(9, 0), item.getHoraInicio());
        assertEquals(LocalTime.of(12, 0), item.getHoraFin());
        assertEquals(TipoItem.ACTIVIDAD, item.getTipo());
        assertEquals(100L, item.getReferenciaId());
        assertEquals("Visita guiada", item.getNotas());
    }
}
