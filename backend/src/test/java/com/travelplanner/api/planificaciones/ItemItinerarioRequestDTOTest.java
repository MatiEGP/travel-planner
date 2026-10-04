package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.time.LocalTime;
import static org.junit.jupiter.api.Assertions.*;

class ItemItinerarioRequestDTOTest {

    @Test
    void testGettersAndSetters() {
        ItemItinerarioRequestDTO dto = new ItemItinerarioRequestDTO();
        dto.setDiaItinerarioId(1L);
        dto.setHoraInicio(LocalTime.of(10, 0));
        dto.setHoraFin(LocalTime.of(11, 0));
        dto.setTipo(TipoItem.DESTINO);
        dto.setReferenciaId(200L);
        dto.setNotas("Llegada al hotel");

        assertEquals(1L, dto.getDiaItinerarioId());
        assertEquals(LocalTime.of(10, 0), dto.getHoraInicio());
        assertEquals(LocalTime.of(11, 0), dto.getHoraFin());
        assertEquals(TipoItem.DESTINO, dto.getTipo());
        assertEquals(200L, dto.getReferenciaId());
        assertEquals("Llegada al hotel", dto.getNotas());
    }
}
