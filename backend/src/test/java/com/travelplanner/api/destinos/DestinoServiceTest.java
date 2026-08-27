package com.travelplanner.api.destinos;

import com.travelplanner.api.destinos.Destino;
import com.travelplanner.api.planificaciones.Planificacion;
import com.travelplanner.api.destinos.DestinoRepository;
import com.travelplanner.api.planificaciones.PlanificacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DestinoServiceTest {

    @Mock
    private DestinoRepository destinoRepository;

    @Mock
    private PlanificacionRepository planificacionRepository;

    @InjectMocks
    private DestinoService destinoService;

    private Planificacion planificacionPrueba;
    private Destino destinoPrueba;

    @BeforeEach
    void setUp() {
        planificacionPrueba = new Planificacion();
        planificacionPrueba.setId(10L);
        planificacionPrueba.setTitulo("Viaje a Europa");

        destinoPrueba = new Destino();
        destinoPrueba.setId(1L);
        destinoPrueba.setNombre("París");
        destinoPrueba.setPais("Francia");
        destinoPrueba.setCiudad("París");
    }

    @Test
    void crearDestino_conPlanificacionExistente_debeGuardarYRetornarDestino() {
        when(planificacionRepository.findById(10L)).thenReturn(Optional.of(planificacionPrueba));
        when(destinoRepository.save(any(Destino.class))).thenAnswer(inv -> inv.getArgument(0));

        Destino resultado = destinoService.crearDestino(10L, destinoPrueba);

        assertNotNull(resultado);
        assertEquals("París", resultado.getNombre());
        assertEquals(planificacionPrueba, resultado.getPlanificacion());
        verify(destinoRepository).save(destinoPrueba);
    }

    @Test
    void crearDestino_conPlanificacionInexistente_debeLanzarIllegalArgumentException() {
        when(planificacionRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                destinoService.crearDestino(99L, destinoPrueba)
        );

        assertTrue(ex.getMessage().contains("Planificación no encontrada"));
        verify(destinoRepository, never()).save(any());
    }

    @Test
    void obtenerDestinosPorPlanificacion_cuandoPlanificacionExiste_debeRetornarLista() {
        when(planificacionRepository.existsById(10L)).thenReturn(true);
        when(destinoRepository.findByPlanificacionId(10L)).thenReturn(List.of(destinoPrueba));

        List<Destino> resultado = destinoService.obtenerDestinosPorPlanificacion(10L);

        assertEquals(1, resultado.size());
        assertEquals("París", resultado.get(0).getNombre());
    }

    @Test
    void obtenerDestinosPorPlanificacion_cuandoPlanificacionNoExiste_debeLanzarIllegalArgumentException() {
        when(planificacionRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                destinoService.obtenerDestinosPorPlanificacion(99L)
        );

        assertTrue(ex.getMessage().contains("no existe"));
    }

    @Test
    void buscarDestinoPorId_cuandoExiste_debeRetornarDestino() {
        when(destinoRepository.findById(1L)).thenReturn(Optional.of(destinoPrueba));

        Destino resultado = destinoService.buscarDestinoPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("París", resultado.getNombre());
    }

    @Test
    void buscarDestinoPorId_cuandoNoExiste_debeLanzarIllegalArgumentException() {
        when(destinoRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                destinoService.buscarDestinoPorId(99L)
        );

        assertTrue(ex.getMessage().contains("no existe"));
    }

    @Test
    void eliminarDestino_cuandoExiste_debeLlamarDeleteById() {
        when(destinoRepository.existsById(1L)).thenReturn(true);

        destinoService.eliminarDestino(1L);

        verify(destinoRepository).deleteById(1L);
    }

    @Test
    void eliminarDestino_cuandoNoExiste_debeLanzarIllegalArgumentException() {
        when(destinoRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                destinoService.eliminarDestino(99L)
        );

        assertTrue(ex.getMessage().contains("no se pudo eliminar"));
        verify(destinoRepository, never()).deleteById(any());
    }
}
