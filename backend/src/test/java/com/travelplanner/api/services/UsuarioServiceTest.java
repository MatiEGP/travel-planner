package com.travelplanner.api.services;

import com.travelplanner.api.exceptions.CredencialesInvalidasException;
import com.travelplanner.api.models.Rol;
import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        Rol rol = Rol.builder().id(1L).nombre("CLIENT").build();
        usuarioPrueba = Usuario.builder()
                .id(1L)
                .nombre("Matias")
                .email("matias@example.com")
                .password("rawPassword123")
                .roles(Set.of(rol))
                .build();
    }

    @Test
    void registrarUsuario_conEmailDisponible_debeHashearPasswordYGuardar() {
        when(usuarioRepository.existsByEmail("matias@example.com")).thenReturn(false);
        when(passwordEncoder.encode("rawPassword123")).thenReturn("encodedPassword123");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario resultado = usuarioService.registrarUsuario(usuarioPrueba);

        assertNotNull(resultado);
        assertEquals("encodedPassword123", resultado.getPassword());
        verify(usuarioRepository).save(usuarioPrueba);
    }

    @Test
    void registrarUsuario_conEmailExistente_debeLanzarIllegalArgumentException() {
        when(usuarioRepository.existsByEmail("matias@example.com")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                usuarioService.registrarUsuario(usuarioPrueba)
        );

        assertTrue(exception.getMessage().contains("El Email ya se encuentra registrado"));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void autenticar_conCredencialesCorrectas_debeRetornarUsuario() {
        Usuario usuarioEnDb = Usuario.builder()
                .id(1L)
                .nombre("Matias")
                .email("matias@example.com")
                .password("encodedPassword123")
                .build();

        when(usuarioRepository.findByEmail("matias@example.com")).thenReturn(Optional.of(usuarioEnDb));
        when(passwordEncoder.matches("rawPassword123", "encodedPassword123")).thenReturn(true);

        Usuario resultado = usuarioService.autenticar("matias@example.com", "rawPassword123");

        assertNotNull(resultado);
        assertEquals("matias@example.com", resultado.getEmail());
    }

    @Test
    void autenticar_conEmailInexistente_debeLanzarCredencialesInvalidasException() {
        when(usuarioRepository.findByEmail("inexistente@example.com")).thenReturn(Optional.empty());

        assertThrows(CredencialesInvalidasException.class, () ->
                usuarioService.autenticar("inexistente@example.com", "cualquiera")
        );
    }

    @Test
    void autenticar_conPasswordIncorrecta_debeLanzarCredencialesInvalidasException() {
        Usuario usuarioEnDb = Usuario.builder()
                .id(1L)
                .email("matias@example.com")
                .password("encodedPassword123")
                .build();

        when(usuarioRepository.findByEmail("matias@example.com")).thenReturn(Optional.of(usuarioEnDb));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword123")).thenReturn(false);

        assertThrows(CredencialesInvalidasException.class, () ->
                usuarioService.autenticar("matias@example.com", "wrongPassword")
        );
    }

    @Test
    void buscarPorEmail_cuandoExiste_debeRetornarOptionalConUsuario() {
        when(usuarioRepository.findByEmail("matias@example.com")).thenReturn(Optional.of(usuarioPrueba));

        Optional<Usuario> resultado = usuarioService.buscarPorEmail("matias@example.com");

        assertTrue(resultado.isPresent());
        assertEquals("Matias", resultado.get().getNombre());
    }

    @Test
    void buscarPorId_cuandoExiste_debeRetornarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        Usuario resultado = usuarioService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void buscarPorId_cuandoNoExiste_debeLanzarIllegalArgumentException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                usuarioService.buscarPorId(99L)
        );

        assertTrue(exception.getMessage().contains("Usuario no encontrado"));
    }

    @Test
    void listarUsuarios_debeRetornarListaDeUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(List.of(usuarioPrueba));

        List<Usuario> resultado = usuarioService.listarUsuarios();

        assertEquals(1, resultado.size());
        assertEquals("Matias", resultado.get(0).getNombre());
    }
}
