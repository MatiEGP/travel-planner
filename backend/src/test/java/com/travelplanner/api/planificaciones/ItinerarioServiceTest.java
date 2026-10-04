package com.travelplanner.api.planificaciones;

import com.travelplanner.api.actividades.Actividad;
import com.travelplanner.api.actividades.ActividadRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItinerarioServiceTest {

    @Mock
    private DiaItinerarioRepository diaItinerarioRepository;

    @Mock
    private ItemItinerarioRepository itemItinerarioRepository;

    @Mock
    private PlanificacionRepository planificacionRepository;

    @Mock
    private ActividadRepository actividadRepository;

    @InjectMocks
    private ItinerarioService itinerarioService;

    @Test
    void crearDiaItinerario_ThrowsException_WhenDateIsOutOfBounds() {
        Long planificacionId = 1L;
        Planificacion planificacion = new Planificacion();
        planificacion.setId(planificacionId);
        planificacion.setFechaInicio(LocalDate.of(2023, 10, 5));
        planificacion.setFechaFin(LocalDate.of(2023, 10, 10));

        DiaItinerario dia = new DiaItinerario();
        dia.setFecha(LocalDate.of(2023, 10, 4));

        when(planificacionRepository.findById(planificacionId)).thenReturn(Optional.of(planificacion));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            itinerarioService.crearDiaItinerario(planificacionId, dia);
        });

        assertEquals("La fecha del día debe estar dentro del rango de la planificación.", exception.getMessage());
        verify(diaItinerarioRepository, never()).save(any());
    }

    @Test
    void crearDiaItinerario_ThrowsException_WhenDateIsAfterFechaFin() {
        Long planificacionId = 1L;
        Planificacion planificacion = new Planificacion();
        planificacion.setId(planificacionId);
        planificacion.setFechaInicio(LocalDate.of(2023, 10, 5));
        planificacion.setFechaFin(LocalDate.of(2023, 10, 10));

        DiaItinerario dia = new DiaItinerario();
        dia.setFecha(LocalDate.of(2023, 10, 11));

        when(planificacionRepository.findById(planificacionId)).thenReturn(Optional.of(planificacion));

        assertThrows(IllegalArgumentException.class, () ->
                itinerarioService.crearDiaItinerario(planificacionId, dia));

        verify(diaItinerarioRepository, never()).save(any());
    }

    @Test
    void crearDiaItinerario_SavesDia_WhenDateIsWithinRange() {
        Long planificacionId = 1L;
        Planificacion planificacion = new Planificacion();
        planificacion.setId(planificacionId);
        planificacion.setFechaInicio(LocalDate.of(2023, 10, 5));
        planificacion.setFechaFin(LocalDate.of(2023, 10, 10));

        DiaItinerario dia = new DiaItinerario();
        dia.setFecha(LocalDate.of(2023, 10, 7));

        when(planificacionRepository.findById(planificacionId)).thenReturn(Optional.of(planificacion));
        when(diaItinerarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        DiaItinerario result = itinerarioService.crearDiaItinerario(planificacionId, dia);

        assertNotNull(result);
        verify(diaItinerarioRepository).save(dia);
    }

    @Test
    void crearItem_AutoFillsHoraInicio_WhenMissingAndTypeIsActividad() {
        Long diaId = 1L;
        DiaItinerario dia = new DiaItinerario();
        dia.setId(diaId);

        ItemItinerario item = new ItemItinerario();
        item.setTipo(TipoItem.ACTIVIDAD);
        item.setReferenciaId(10L);

        Actividad actividad = new Actividad();
        actividad.setId(10L);
        actividad.setFechaHora(LocalDateTime.of(2023, 10, 5, 14, 30));

        when(diaItinerarioRepository.findById(diaId)).thenReturn(Optional.of(dia));
        when(actividadRepository.findById(10L)).thenReturn(Optional.of(actividad));
        when(itemItinerarioRepository.save(any(ItemItinerario.class))).thenAnswer(i -> i.getArgument(0));

        ItemItinerario savedItem = itinerarioService.crearItem(diaId, item);

        assertEquals(14, savedItem.getHoraInicio().getHour());
        assertEquals(30, savedItem.getHoraInicio().getMinute());
        verify(itemItinerarioRepository).save(item);
    }

    @Test
    void crearItem_DoesNotOverrideHoraInicio_WhenAlreadySet() {
        Long diaId = 1L;
        DiaItinerario dia = new DiaItinerario();
        dia.setId(diaId);

        ItemItinerario item = new ItemItinerario();
        item.setTipo(TipoItem.ACTIVIDAD);
        item.setReferenciaId(10L);
        item.setHoraInicio(LocalTime.of(9, 0));

        when(diaItinerarioRepository.findById(diaId)).thenReturn(Optional.of(dia));
        when(itemItinerarioRepository.save(any(ItemItinerario.class))).thenAnswer(i -> i.getArgument(0));

        ItemItinerario savedItem = itinerarioService.crearItem(diaId, item);

        assertEquals(LocalTime.of(9, 0), savedItem.getHoraInicio());
        verify(actividadRepository, never()).findById(any());
    }

    @Test
    void crearItem_DoesNotAutoFill_WhenTypeIsDestino() {
        Long diaId = 1L;
        DiaItinerario dia = new DiaItinerario();
        dia.setId(diaId);

        ItemItinerario item = new ItemItinerario();
        item.setTipo(TipoItem.DESTINO);
        item.setReferenciaId(5L);

        when(diaItinerarioRepository.findById(diaId)).thenReturn(Optional.of(dia));
        when(itemItinerarioRepository.save(any(ItemItinerario.class))).thenAnswer(i -> i.getArgument(0));

        ItemItinerario savedItem = itinerarioService.crearItem(diaId, item);

        assertNull(savedItem.getHoraInicio());
        verify(actividadRepository, never()).findById(any());
    }

    @Test
    void crearItem_DoesNotSetHoraInicio_WhenActividadHasNoFechaHora() {
        Long diaId = 1L;
        DiaItinerario dia = new DiaItinerario();
        dia.setId(diaId);

        ItemItinerario item = new ItemItinerario();
        item.setTipo(TipoItem.ACTIVIDAD);
        item.setReferenciaId(10L);

        Actividad actividad = new Actividad();
        actividad.setId(10L);
        actividad.setFechaHora(null);

        when(diaItinerarioRepository.findById(diaId)).thenReturn(Optional.of(dia));
        when(actividadRepository.findById(10L)).thenReturn(Optional.of(actividad));
        when(itemItinerarioRepository.save(any(ItemItinerario.class))).thenAnswer(i -> i.getArgument(0));

        ItemItinerario savedItem = itinerarioService.crearItem(diaId, item);

        assertNull(savedItem.getHoraInicio());
    }
}

