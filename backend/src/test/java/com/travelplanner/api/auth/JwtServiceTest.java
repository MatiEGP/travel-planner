package com.travelplanner.api.auth;

import com.travelplanner.api.config.JwtConfig;
import com.travelplanner.api.usuarios.Rol;
import com.travelplanner.api.usuarios.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Base64;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private JwtConfig jwtConfig;

    @BeforeEach
    void setUp() {
        jwtConfig = new JwtConfig();
        String secret32Bytes = Base64.getEncoder().encodeToString("12345678901234567890123456789012".getBytes());
        jwtConfig.setSecret(secret32Bytes);
        jwtConfig.setExpirationMs(3600000L);

        jwtService = new JwtService(jwtConfig);
    }

    @Test
    void generarToken_debeCrearTokenValidoConClaims() {
        Rol rol = Rol.builder().id(1L).nombre("CLIENT").build();
        Usuario usuario = Usuario.builder()
                .id(10L)
                .nombre("Matias")
                .email("matias@example.com")
                .roles(Set.of(rol))
                .build();

        String token = jwtService.generarToken(usuario);

        assertNotNull(token);
        assertTrue(jwtService.validarToken(token));
        assertEquals("matias@example.com", jwtService.extraerEmail(token));

        List<String> roles = jwtService.extraerRoles(token);
        assertEquals(1, roles.size());
        assertEquals("CLIENT", roles.get(0));
    }

    @Test
    void validarToken_conTokenInvalido_debeRetornarFalse() {
        assertFalse(jwtService.validarToken("token_invalido_totalmente_falso"));
    }
}