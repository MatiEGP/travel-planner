package com.travelplanner.api.config;

import com.travelplanner.api.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtro JWT que se ejecuta una vez por request.
 * Extrae el token del header Authorization, lo valida y, si es correcto,
 * establece la autenticación en el SecurityContextHolder para que
 * Spring Security reconozca al usuario en los endpoints protegidos.
 *
 * Flujo:
 *   1. Leer "Authorization: Bearer <token>"
 *   2. Validar token con JwtService (firma + expiración)
 *   3. Extraer email y roles del payload
 *   4. Convertir roles a GrantedAuthority con prefijo "ROLE_"
 *   5. Cargar el contexto de seguridad
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Si no hay header o no empieza con "Bearer ", continuar sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtService.validarToken(token)) {
            // Token inválido o expirado — continuar sin autenticar (devolverá 401)
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtService.extraerEmail(token);
        List<String> roles = jwtService.extraerRoles(token);

        // Convertir nombres de roles a GrantedAuthority con prefijo "ROLE_"
        // Ej: "ADMIN" → SimpleGrantedAuthority("ROLE_ADMIN")
        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .toList();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(email, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("Usuario autenticado via JWT: {} con roles: {}", email, roles);

        filterChain.doFilter(request, response);
    }
}
