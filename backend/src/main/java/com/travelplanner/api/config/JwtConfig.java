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
     * Tiempo de vida del token en milisegundos.
     * Desarrollo: 86400000 (24h) | Producción: 3600000 (1h).
     */
    private long expirationMs;
}
