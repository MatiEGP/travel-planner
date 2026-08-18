package com.travelplanner.api.controllers;

import com.travelplanner.api.dtos.LoginRequestDTO;
import com.travelplanner.api.dtos.RegistroRequestDTO;
import com.travelplanner.api.dtos.UsuarioResponseDTO;
import com.travelplanner.api.models.Rol;
import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.repositories.RolRepository;
import com.travelplanner.api.services.JwtService;
import com.travelplanner.api.services.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtService jwtService;

    @Mock
    private RolRepository rolRepository;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        ReflectionTestUtils.setField(authController, "cookieSecure", false);
    }

    @Test
    void registro_conDatosValidos_debeRetornarCreatedYSetCookie() {
        RegistroRequestDTO request = new RegistroRequestDTO();
        request.setNombre("Carlos");
        request.setEmail("carlos@example.com");
        request.setPassword("password123");

        Rol rolClient = Rol.builder().id(1L).nombre("CLIENT").build();
        Usuario usuarioGuardado = Usuario.builder()
                .id(1L)
                .nombre("Carlos")
                .email("carlos@example.com")
                .roles(Set.of(rolClient))
                .build();

        when(rolRepository.findByNombre("CLIENT")).thenReturn(Optional.of(rolClient));
        when(usuarioService.registrarUsuario(any(Usuario.class))).thenReturn(usuarioGuardado);
        when(jwtService.generarToken(usuarioGuardado)).thenReturn("mock.jwt.token");

        ResponseEntity<UsuarioResponseDTO> response = authController.registro(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getHeaders().getFirst(HttpHeaders.SET_COOKIE));
        String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertTrue(setCookie.contains("token=mock.jwt.token"));
        assertTrue(setCookie.contains("HttpOnly"));
    }

    @Test
    void login_conCredencialesValidas_debeRetornarOkYSetCookie() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("carlos@example.com");
        request.setPassword("password123");

        Rol rolClient = Rol.builder().id(1L).nombre("CLIENT").build();
        Usuario usuario = Usuario.builder()
                .id(1L)
                .nombre("Carlos")
                .email("carlos@example.com")
                .roles(Set.of(rolClient))
                .build();

        when(usuarioService.autenticar("carlos@example.com", "password123")).thenReturn(usuario);
        when(jwtService.generarToken(usuario)).thenReturn("mock.jwt.token");

        ResponseEntity<UsuarioResponseDTO> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getHeaders().getFirst(HttpHeaders.SET_COOKIE));
        String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertTrue(setCookie.contains("token=mock.jwt.token"));
    }

    @Test
    void logout_debeRetornarCookieConMaxAgeCero() {
        ResponseEntity<Void> response = authController.logout();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertNotNull(setCookie);
        assertTrue(setCookie.contains("Max-Age=0"));
    }

    @Test
    void getMe_cuandoEstaAutenticado_debeRetornarUsuarioDTO() {
        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getName()).thenReturn("carlos@example.com");

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        Usuario usuario = Usuario.builder()
                .id(1L)
                .nombre("Carlos")
                .email("carlos@example.com")
                .roles(Set.of(Rol.builder().id(1L).nombre("CLIENT").build()))
                .build();

        when(usuarioService.buscarPorEmail("carlos@example.com")).thenReturn(Optional.of(usuario));

        ResponseEntity<UsuarioResponseDTO> response = authController.getMe();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Carlos", response.getBody().getNombre());
    }
}