package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class DiaItinerarioResponseDTOTest {

    @Test
    void testGettersAndSetters() {
        DiaItinerarioResponseDTO dto = new DiaItinerarioResponseDTO();
        dto.setId(10L);
        dto.setPlanificacionId(1L);
        dto.setFecha(LocalDate.of(2023, 10, 1));

        List<ItemItinerarioResponseDTO> items = new ArrayList<>();
        items.add(new ItemItinerarioResponseDTO());
        dto.setItems(items);

        assertEquals(10L, dto.getId());
        assertEquals(1L, dto.getPlanificacionId());
        assertEquals(LocalDate.of(2023, 10, 1), dto.getFecha());
        assertEquals(1, dto.getItems().size());
    }
}
