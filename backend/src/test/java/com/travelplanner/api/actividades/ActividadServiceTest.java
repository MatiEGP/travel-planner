package com.travelplanner.api.actividades;

import com.travelplanner.api.actividades.Actividad;
import com.travelplanner.api.destinos.Destino;
import com.travelplanner.api.planificaciones.Planificacion;
import com.travelplanner.api.actividades.ActividadRepository;
import com.travelplanner.api.destinos.DestinoRepository;
import com.travelplanner.api.planificaciones.PlanificacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActividadServiceTest {

    @Mock
    private ActividadRepository actividadRepository;

    @Mock
    private DestinoRepository destinoRepository;

    @Mock
    private PlanificacionRepository planificacionRepository;

    @InjectMocks
    private ActividadService actividadService;

    private Destino destinoPrueba;
    private Actividad actividadPrueba;
    private Planificacion planificacionPrueba;

    @BeforeEach
    void setUp() {
        destinoPrueba = new Destino();
        destinoPrueba.setId(5L);
        destinoPrueba.setNombre("Roma");

        planificacionPrueba = new Planificacion();
        planificacionPrueba.setId(10L);

        actividadPrueba = new Actividad();
        actividadPrueba.setId(1L);
        actividadPrueba.setNombre("Visita al Coliseo");
        actividadPrueba.setFechaHora(LocalDateTime.now());
        actividadPrueba.setNotas("Comprar entradas temprano");
    }

    @Test
    void crearActividad_conDestinoExistente_debeGuardarYRetornarActividad() {
        when(planificacionRepository.findById(10L)).thenReturn(Optional.of(planificacionPrueba));
        when(destinoRepository.findById(5L)).thenReturn(Optional.of(destinoPrueba));
        when(actividadRepository.save(any(Actividad.class))).thenAnswer(inv -> inv.getArgument(0));

        Actividad resultado = actividadService.crearActividad(10L, 5L, actividadPrueba);

        assertNotNull(resultado);
        assertEquals("Visita al Coliseo", resultado.getNombre());
        assertEquals(destinoPrueba, resultado.getDestino());
        assertEquals(planificacionPrueba, resultado.getPlanificacion());
        verify(actividadRepository).save(actividadPrueba);
    }

    @Test
    void crearActividad_conDestinoInexistente_debeLanzarIllegalArgumentException() {
        when(planificacionRepository.findById(10L)).thenReturn(Optional.of(planificacionPrueba));
        when(destinoRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                actividadService.crearActividad(10L, 99L, actividadPrueba)
        );

        assertTrue(ex.getMessage().contains("no existe"));
        verify(actividadRepository, never()).save(any());
    }

    @Test
    void crearActividad_conPlanificacionInexistente_debeLanzarIllegalArgumentException() {
        when(planificacionRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                actividadService.crearActividad(99L, 5L, actividadPrueba)
        );

        assertTrue(ex.getMessage().contains("no existe"));
        verify(actividadRepository, never()).save(any());
    }

    @Test
    void obtenerActividadesPorDestino_cuandoDestinoExiste_debeRetornarLista() {
        when(destinoRepository.existsById(5L)).thenReturn(true);
        when(actividadRepository.findByDestinoIdOrderByFechaHoraAsc(5L)).thenReturn(List.of(actividadPrueba));

        List<Actividad> resultado = actividadService.obtenerActividadesPorDestino(5L);

        assertEquals(1, resultado.size());
        assertEquals("Visita al Coliseo", resultado.get(0).getNombre());
    }

    @Test
    void obtenerActividadesPorDestino_cuandoDestinoNoExiste_debeLanzarIllegalArgumentException() {
        when(destinoRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                actividadService.obtenerActividadesPorDestino(99L)
        );

        assertTrue(ex.getMessage().contains("no existe"));
    }

    @Test
    void buscarPorId_cuandoExiste_debeRetornarActividad() {
        when(actividadRepository.findById(1L)).thenReturn(Optional.of(actividadPrueba));

        Actividad resultado = actividadService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Visita al Coliseo", resultado.getNombre());
    }

    @Test
    void buscarPorId_cuandoNoExiste_debeLanzarIllegalArgumentException() {
        when(actividadRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                actividadService.buscarPorId(99L)
        );

        assertTrue(ex.getMessage().contains("no encontrada"));
    }

    @Test
    void eliminarActividad_cuandoExiste_debeLlamarDeleteById() {
        when(actividadRepository.existsById(1L)).thenReturn(true);

        actividadService.eliminarActividad(1L);

        verify(actividadRepository).deleteById(1L);
    }

    @Test
    void eliminarActividad_cuandoNoExiste_debeLanzarIllegalArgumentException() {
        when(actividadRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                actividadService.eliminarActividad(99L)
        );

        assertTrue(ex.getMessage().contains("no se pudo eliminar"));
        verify(actividadRepository, never()).deleteById(any());
    }
}
