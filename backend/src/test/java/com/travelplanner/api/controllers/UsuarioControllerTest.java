package com.travelplanner.api.controllers;

import com.travelplanner.api.dtos.UsuarioResponseDTO;
import com.travelplanner.api.models.Rol;
import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.services.UsuarioService;
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
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        Rol rolAdmin = Rol.builder().id(1L).nombre("ADMIN").build();
        usuarioPrueba = Usuario.builder()
                .id(1L)
                .nombre("Admin User")
                .email("admin@example.com")
                .fechaRegistro(LocalDateTime.now())
                .roles(Set.of(rolAdmin))
                .build();
    }

    @Test
    void obtenerUsuarioPorId_debeRetornarUsuarioResponseDTO() {
        when(usuarioService.buscarPorId(1L)).thenReturn(usuarioPrueba);

        ResponseEntity<UsuarioResponseDTO> response = usuarioController.obtenerUsuarioPorId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Admin User", response.getBody().getNombre());
        assertEquals("admin@example.com", response.getBody().getEmail());
        assertTrue(response.getBody().getRoles().contains("ADMIN"));
    }

    @Test
    void listarUsuarios_debeRetornarListaDeUsuarioResponseDTO() {
        when(usuarioService.listarUsuarios()).thenReturn(List.of(usuarioPrueba));

        ResponseEntity<List<UsuarioResponseDTO>> response = usuarioController.listarUsuarios();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("admin@example.com", response.getBody().get(0).getEmail());
    }
}
