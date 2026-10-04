package com.travelplanner.api.actividades;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActividadControllerTest {

    @Mock
    private ActividadService actividadService;

    @InjectMocks
    private ActividadController actividadController;

    private Actividad actividadPrueba;

    @BeforeEach
    void setUp() {
        actividadPrueba = new Actividad();
        actividadPrueba.setId(1L);
        actividadPrueba.setNombre("Tour Gastronómico");
        actividadPrueba.setFechaHora(LocalDateTime.of(2026, 8, 20, 19, 0));
        actividadPrueba.setNotas("Probar tapas locales");
    }

    @Test
    void crearActividad_debeRetornarCreatedYActividadResponseDTO() {
        ActividadRequestDTO request = new ActividadRequestDTO();
        request.setPlanificacionId(10L);
        request.setDestinoId(5L);
        request.setNombre("Tour Gastronómico");
        request.setFechaHora(LocalDateTime.of(2026, 8, 20, 19, 0));
        request.setNotas("Probar tapas locales");

        when(actividadService.crearActividad(eq(10L), eq(5L), any(Actividad.class))).thenReturn(actividadPrueba);

        ResponseEntity<ActividadResponseDTO> response = actividadController.crearActividad(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Tour Gastronómico", response.getBody().getNombre());
    }

    @Test
    void obtenerActividad_debeRetornarOkYActividadResponseDTO() {
        when(actividadService.buscarPorId(1L)).thenReturn(actividadPrueba);

        ResponseEntity<ActividadResponseDTO> response = actividadController.obtenerActividad(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Tour Gastronómico", response.getBody().getNombre());
    }

    @Test
    void listarPorDestino_debeRetornarListaDeActividades() {
        when(actividadService.obtenerActividadesPorDestino(5L)).thenReturn(List.of(actividadPrueba));

        ResponseEntity<List<ActividadResponseDTO>> response = actividadController.listarPorDestino(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Tour Gastronómico", response.getBody().get(0).getNombre());
    }

    @Test
    void eliminarActividad_debeRetornarNoContent() {
        doNothing().when(actividadService).eliminarActividad(1L);

        ResponseEntity<Void> response = actividadController.eliminarActividad(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(actividadService).eliminarActividad(1L);
    }
}
