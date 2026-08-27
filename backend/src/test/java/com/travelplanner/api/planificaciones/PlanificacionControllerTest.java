package com.travelplanner.api.planificaciones;

import com.travelplanner.api.planificaciones.PlanificacionRequestDTO;
import com.travelplanner.api.planificaciones.PlanificacionResponseDTO;
import com.travelplanner.api.planificaciones.Planificacion;
import com.travelplanner.api.planificaciones.PlanificacionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlanificacionControllerTest {

    @Mock
    private PlanificacionService planificacionService;

    @InjectMocks
    private PlanificacionController planificacionController;

    private Planificacion planificacionPrueba;

    @BeforeEach
    void setUp() {
        planificacionPrueba = new Planificacion();
        planificacionPrueba.setId(10L);
        planificacionPrueba.setTitulo("Ruta por los Alpes");
        planificacionPrueba.setDescripcion("Senderismo y naturaleza");
        planificacionPrueba.setFechaInicio(LocalDate.of(2026, 9, 1));
        planificacionPrueba.setFechaFin(LocalDate.of(2026, 9, 10));
    }

    @Test
    void crearPlanificacion_debeRetornarCreatedYPlanificacionResponseDTO() {
        PlanificacionRequestDTO request = new PlanificacionRequestDTO();
        request.setUsuarioId(1L);
        request.setTitulo("Ruta por los Alpes");
        request.setDescripcion("Senderismo y naturaleza");
        request.setFechaInicio(LocalDate.of(2026, 9, 1));
        request.setFechaFin(LocalDate.of(2026, 9, 10));

        when(planificacionService.crearPlanificacion(eq(1L), any(Planificacion.class))).thenReturn(planificacionPrueba);

        ResponseEntity<PlanificacionResponseDTO> response = planificacionController.crearPlanificacion(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Ruta por los Alpes", response.getBody().getTitulo());
    }

    @Test
    void obtenerPlanificacion_debeRetornarOkYPlanificacionResponseDTO() {
        when(planificacionService.buscarPorId(10L)).thenReturn(planificacionPrueba);

        ResponseEntity<PlanificacionResponseDTO> response = planificacionController.obtenerPlanificacion(10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(10L, response.getBody().getId());
        assertEquals("Ruta por los Alpes", response.getBody().getTitulo());
    }

    @Test
    void listarPorUsuario_debeRetornarListaDePlanificaciones() {
        when(planificacionService.obtenerPlanificacionesPorUsuario(1L)).thenReturn(List.of(planificacionPrueba));

        ResponseEntity<List<PlanificacionResponseDTO>> response = planificacionController.listarPorUsuario(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Ruta por los Alpes", response.getBody().get(0).getTitulo());
    }

    @Test
    void eliminarPlanificacion_debeRetornarNoContent() {
        doNothing().when(planificacionService).eliminarPlanificacion(10L);

        ResponseEntity<Void> response = planificacionController.eliminarPlanificacion(10L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(planificacionService).eliminarPlanificacion(10L);
    }
}
