package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

class DiaItinerarioRequestDTOTest {

    @Test
    void testGettersAndSetters() {
        DiaItinerarioRequestDTO dto = new DiaItinerarioRequestDTO();
        dto.setPlanificacionId(1L);
        dto.setFecha(LocalDate.of(2023, 10, 1));

        assertEquals(1L, dto.getPlanificacionId());
        assertEquals(LocalDate.of(2023, 10, 1), dto.getFecha());
    }
}
