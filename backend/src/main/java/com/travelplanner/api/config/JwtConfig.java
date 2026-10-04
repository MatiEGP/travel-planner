package com.travelplanner.api.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Mapeo tipado de las propiedades app.jwt.* del application.yml.
 * Evita el uso de @Value disperso en distintas clases.
 */
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtConfig {

    /**
     * Clave simétrica codificada en Base64 (mínimo 256 bits).
     * Se inyecta desde la variable de entorno JWT_SECRET.
     */
    private String secret;

    /**
     * Tiempo de vida del Access Token en milisegundos.
     * Desarrollo: 86400000 (24h) | Producción: 3600000 (1h).
     */
    private long expirationMs;

    /**
     * Tiempo de vida del Refresh Token en milisegundos.
     * Valor por defecto: 604800000 (7 días).
     */
    private long refreshExpirationMs = 604800000;

    /**
     * Flag Secure para cookies HttpOnly.
     * false en desarrollo local (HTTP), true en producción (HTTPS).
     */
    private boolean cookieSecure = false;
}
