package com.travelplanner.api.destinos;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DestinoControllerTest {

    @Mock
    private DestinoService destinoService;

    @InjectMocks
    private DestinoController destinoController;

    private Destino destinoPrueba;

    @BeforeEach
    void setUp() {
        destinoPrueba = new Destino();
        destinoPrueba.setId(1L);
        destinoPrueba.setNombre("Madrid");
        destinoPrueba.setPais("España");
        destinoPrueba.setCiudad("Madrid");
        destinoPrueba.setNotas("Visitar Museo del Prado");
    }

    @Test
    void crearDestino_debeRetornarCreatedYDestinoResponseDTO() {
        DestinoRequestDTO request = new DestinoRequestDTO();
        request.setPlanificacionId(10L);
        request.setNombre("Madrid");
        request.setPais("España");
        request.setCiudad("Madrid");
        request.setNotas("Visitar Museo del Prado");

        when(destinoService.crearDestino(eq(10L), any(Destino.class))).thenReturn(destinoPrueba);

        ResponseEntity<DestinoResponseDTO> response = destinoController.crearDestino(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Madrid", response.getBody().getNombre());
        assertEquals("España", response.getBody().getPais());
    }

    @Test
    void obtenerDestino_debeRetornarOkYDestinoResponseDTO() {
        when(destinoService.buscarDestinoPorId(1L)).thenReturn(destinoPrueba);

        ResponseEntity<DestinoResponseDTO> response = destinoController.obtenerDestino(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Madrid", response.getBody().getNombre());
    }

    @Test
    void listarPorPlanificacion_debeRetornarListaDeDestinos() {
        when(destinoService.obtenerDestinosPorPlanificacion(10L)).thenReturn(List.of(destinoPrueba));

        ResponseEntity<List<DestinoResponseDTO>> response = destinoController.listarPorPlanificacion(10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Madrid", response.getBody().get(0).getNombre());
    }

    @Test
    void eliminarDestino_debeRetornarNoContent() {
        doNothing().when(destinoService).eliminarDestino(1L);

        ResponseEntity<Void> response = destinoController.eliminarDestino(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(destinoService).eliminarDestino(1L);
    }
}
