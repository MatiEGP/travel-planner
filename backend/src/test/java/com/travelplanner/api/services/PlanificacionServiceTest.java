package com.travelplanner.api.services;

import com.travelplanner.api.models.Planificacion;
import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.repositories.PlanificacionRepository;
import com.travelplanner.api.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlanificacionServiceTest {

    @Mock
    private PlanificacionRepository planificacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private PlanificacionService planificacionService;

    private Usuario usuarioPrueba;
    private Planificacion planificacionPrueba;

    @BeforeEach
    void setUp() {
        usuarioPrueba = Usuario.builder().id(1L).nombre("Matias").build();

        planificacionPrueba = new Planificacion();
        planificacionPrueba.setId(10L);
        planificacionPrueba.setTitulo("Vacaciones 2026");
        planificacionPrueba.setDescripcion("Recorrido por Italia");
        planificacionPrueba.setFechaInicio(LocalDate.of(2026, 7, 1));
        planificacionPrueba.setFechaFin(LocalDate.of(2026, 7, 15));
    }

    @Test
    void crearPlanificacion_conDatosValidos_debeGuardarYRetornarPlanificacion() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioPrueba));
        when(planificacionRepository.save(any(Planificacion.class))).thenAnswer(inv -> inv.getArgument(0));

        Planificacion resultado = planificacionService.crearPlanificacion(1L, planificacionPrueba);

        assertNotNull(resultado);
        assertEquals("Vacaciones 2026", resultado.getTitulo());
        assertEquals(usuarioPrueba, resultado.getUsuario());
        verify(planificacionRepository).save(planificacionPrueba);
    }

    @Test
    void crearPlanificacion_conFechaFinAnteriorAFechaInicio_debeLanzarIllegalArgumentException() {
        planificacionPrueba.setFechaFin(LocalDate.of(2026, 6, 1));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                planificacionService.crearPlanificacion(1L, planificacionPrueba)
        );

        assertTrue(ex.getMessage().contains("La fecha fin no puede ser anterior a la fecha inicio"));
        verify(planificacionRepository, never()).save(any());
    }

    @Test
    void crearPlanificacion_conUsuarioInexistente_debeLanzarIllegalArgumentException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                planificacionService.crearPlanificacion(99L, planificacionPrueba)
        );

        assertTrue(ex.getMessage().contains("no existe"));
        verify(planificacionRepository, never()).save(any());
    }

    @Test
    void obtenerPlanificacionesPorUsuario_cuandoUsuarioExiste_debeRetornarLista() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(planificacionRepository.findByUsuarioIdOrderByFechaInicioAsc(1L)).thenReturn(List.of(planificacionPrueba));

        List<Planificacion> resultado = planificacionService.obtenerPlanificacionesPorUsuario(1L);

        assertEquals(1, resultado.size());
        assertEquals("Vacaciones 2026", resultado.get(0).getTitulo());
    }

    @Test
    void obtenerPlanificacionesPorUsuario_cuandoUsuarioNoExiste_debeLanzarIllegalArgumentException() {
        when(usuarioRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                planificacionService.obtenerPlanificacionesPorUsuario(99L)
        );

        assertTrue(ex.getMessage().contains("no existe"));
    }

    @Test
    void buscarPorId_cuandoExiste_debeRetornarPlanificacion() {
        when(planificacionRepository.findById(10L)).thenReturn(Optional.of(planificacionPrueba));

        Planificacion resultado = planificacionService.buscarPorId(10L);

        assertNotNull(resultado);
        assertEquals(10L, resultado.getId());
        assertEquals("Vacaciones 2026", resultado.getTitulo());
    }

    @Test
    void buscarPorId_cuandoNoExiste_debeLanzarIllegalArgumentException() {
        when(planificacionRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                planificacionService.buscarPorId(99L)
        );

        assertTrue(ex.getMessage().contains("no existe"));
    }

    @Test
    void eliminarPlanificacion_cuandoExiste_debeLlamarDeleteById() {
        when(planificacionRepository.existsById(10L)).thenReturn(true);

        planificacionService.eliminarPlanificacion(10L);

        verify(planificacionRepository).deleteById(10L);
    }

    @Test
    void eliminarPlanificacion_cuandoNoExiste_debeLanzarIllegalArgumentException() {
        when(planificacionRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                planificacionService.eliminarPlanificacion(99L)
        );

        assertTrue(ex.getMessage().contains("no se pudo eliminar"));
        verify(planificacionRepository, never()).deleteById(any());
    }
}
