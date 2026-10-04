package com.travelplanner.api.config;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtAuthenticationEntryPointTest {

    private final JwtAuthenticationEntryPoint entryPoint = new JwtAuthenticationEntryPoint();

    @Test
    void commence_debeRetornar401ConJsonErrorResponseDTO() throws IOException {
        HttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        entryPoint.commence(request, response, new BadCredentialsException("Bad token"));

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, response.getContentType());
        String body = response.getContentAsString();
        assertTrue(body.contains("\"status\":401"));
        assertTrue(body.contains("\"error\":\"Unauthorized\""));
        assertTrue(body.contains("No autenticado"));
    }
}
