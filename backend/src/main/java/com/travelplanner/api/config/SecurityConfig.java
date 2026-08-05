package com.travelplanner.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración central de Spring Security.
 *
 * Política de sesión: STATELESS (sin HttpSession — toda la autenticación va en el JWT).
 * CSRF: deshabilitado (API REST stateless con token en sessionStorage del frontend).
 * CORS: delegado a CorsConfig (WebMvcConfigurer) via Customizer.withDefaults().
 *
 * @EnableMethodSecurity habilita @PreAuthorize en los controllers para el próximo paso
 * de autorización por roles.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF deshabilitado: API REST stateless, token en sessionStorage (no en cookie)
                .csrf(AbstractHttpConfigurer::disable)

                // CORS delegado al WebMvcConfigurer definido en CorsConfig
                .cors(cors -> cors.configure(http))

                // Sin sesión HTTP — todo el estado de autenticación va en el JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos: autenticación y documentación Swagger
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()
                        // Todo lo demás requiere un JWT válido
                        .anyRequest().authenticated()
                )

                // Registrar el filtro JWT antes del filtro estándar de usuario/contraseña
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
