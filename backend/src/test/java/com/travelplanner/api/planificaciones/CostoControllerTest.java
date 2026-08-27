package com.travelplanner.api.planificaciones;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CostoControllerTest {

    @Mock
    private CostoService costoService;

    @InjectMocks
    private CostoController costoController;

    private Costo costo;
    private Planificacion planificacion;

    @BeforeEach
    void setUp() {
        planificacion = new Planificacion();
        planificacion.setId(1L);

        costo = new Costo();
        costo.setId(1L);
        costo.setCategoria("Transporte");
        costo.setMonto(new BigDecimal("1500.00"));
        costo.setDescripcion("Vuelo a Paris");
        costo.setPlanificacion(planificacion);
    }

    @Test
    void crearCosto_debeRetornarCreated() {
        CostoRequestDTO requestDTO = new CostoRequestDTO();
        requestDTO.setPlanificacionId(1L);
        requestDTO.setCategoria("Transporte");
        requestDTO.setMonto(new BigDecimal("1500.00"));
        requestDTO.setDescripcion("Vuelo a Paris");

        when(costoService.crearCosto(eq(1L), any(Costo.class))).thenReturn(costo);

        ResponseEntity<CostoResponseDTO> response = costoController.crearCosto(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Transporte", response.getBody().getCategoria());
        assertEquals(new BigDecimal("1500.00"), response.getBody().getMonto());
    }

    @Test
    void obtenerCosto_debeRetornarOk() {
        when(costoService.buscarPorId(1L)).thenReturn(costo);

        ResponseEntity<CostoResponseDTO> response = costoController.obtenerCosto(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void listarPorPlanificacion_debeRetornarListaDeCostos() {
        when(costoService.obtenerCostosPorPlanificacion(1L)).thenReturn(List.of(costo));

        ResponseEntity<List<CostoResponseDTO>> response = costoController.listarPorPlanificacion(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getId());
    }

    @Test
    void eliminarCosto_debeRetornarNoContent() {
        doNothing().when(costoService).eliminarCosto(1L);

        ResponseEntity<Void> response = costoController.eliminarCosto(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(costoService).eliminarCosto(1L);
    }
}
