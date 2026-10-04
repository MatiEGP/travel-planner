package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TipoItemTest {

    @Test
    void testEnumValues() {
        TipoItem[] values = TipoItem.values();
        assertEquals(2, values.length);
        assertEquals(TipoItem.DESTINO, values[0]);
        assertEquals(TipoItem.ACTIVIDAD, values[1]);
        
        assertEquals(TipoItem.DESTINO, TipoItem.valueOf("DESTINO"));
        assertEquals(TipoItem.ACTIVIDAD, TipoItem.valueOf("ACTIVIDAD"));
    }
}
