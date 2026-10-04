package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CostoServiceTest {

    @Mock
    private CostoRepository costoRepository;

    @Mock
    private PlanificacionRepository planificacionRepository;

    @InjectMocks
    private CostoService costoService;

    private Planificacion planificacionPrueba;
    private Costo costoPrueba;

    @BeforeEach
    void setUp() {
        planificacionPrueba = new Planificacion();
        planificacionPrueba.setId(1L);

        costoPrueba = Costo.builder()
                .id(100L)
                .categoria("Alojamiento")
                .monto(new BigDecimal("150.00"))
                .descripcion("Hotel en Roma")
                .build();
    }

    @Test
    void crearCosto_conPlanificacionExistente_debeGuardarYRetornarCosto() {
        when(planificacionRepository.findById(1L)).thenReturn(Optional.of(planificacionPrueba));
        when(costoRepository.save(any(Costo.class))).thenAnswer(inv -> inv.getArgument(0));

        Costo resultado = costoService.crearCosto(1L, costoPrueba);

        assertNotNull(resultado);
        assertEquals("Alojamiento", resultado.getCategoria());
        assertEquals(planificacionPrueba, resultado.getPlanificacion());
        verify(costoRepository).save(costoPrueba);
    }

    @Test
    void crearCosto_conPlanificacionInexistente_debeLanzarExcepcion() {
        when(planificacionRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                costoService.crearCosto(99L, costoPrueba)
        );

        assertTrue(ex.getMessage().contains("no existe"));
        verify(costoRepository, never()).save(any());
    }

    @Test
    void buscarPorId_cuandoExiste_debeRetornarCosto() {
        when(costoRepository.findById(100L)).thenReturn(Optional.of(costoPrueba));

        Costo resultado = costoService.buscarPorId(100L);

        assertNotNull(resultado);
        assertEquals(100L, resultado.getId());
        assertEquals("Alojamiento", resultado.getCategoria());
    }

    @Test
    void buscarPorId_cuandoNoExiste_debeLanzarExcepcion() {
        when(costoRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                costoService.buscarPorId(99L)
        );

        assertTrue(ex.getMessage().contains("no encontrado"));
    }

    @Test
    void obtenerCostosPorPlanificacion_cuandoExiste_debeRetornarLista() {
        when(planificacionRepository.existsById(1L)).thenReturn(true);
        when(costoRepository.findByPlanificacionId(1L)).thenReturn(List.of(costoPrueba));

        List<Costo> resultado = costoService.obtenerCostosPorPlanificacion(1L);

        assertEquals(1, resultado.size());
        assertEquals("Alojamiento", resultado.get(0).getCategoria());
    }

    @Test
    void obtenerCostosPorPlanificacion_cuandoNoExiste_debeLanzarExcepcion() {
        when(planificacionRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                costoService.obtenerCostosPorPlanificacion(99L)
        );

        assertTrue(ex.getMessage().contains("no existe"));
    }

    @Test
    void eliminarCosto_cuandoExiste_debeLlamarDeleteById() {
        when(costoRepository.existsById(100L)).thenReturn(true);

        costoService.eliminarCosto(100L);

        verify(costoRepository).deleteById(100L);
    }

    @Test
    void eliminarCosto_cuandoNoExiste_debeLanzarExcepcion() {
        when(costoRepository.existsById(99L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                costoService.eliminarCosto(99L)
        );

        assertTrue(ex.getMessage().contains("no se pudo eliminar porque no existe"));
        verify(costoRepository, never()).deleteById(any());
    }
}
