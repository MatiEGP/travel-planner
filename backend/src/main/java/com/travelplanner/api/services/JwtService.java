package com.travelplanner.api.services;

import com.travelplanner.api.config.JwtConfig;
import com.travelplanner.api.models.Rol;
import com.travelplanner.api.models.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

/**
 * Servicio responsable de toda la lógica JWT:
 * generación, validación y extracción de claims.
 * Utiliza HMAC-SHA256 con clave simétrica (HS256).
 */
@Service
@Slf4j
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtService(JwtConfig jwtConfig) {
        // Decodifica el secret de Base64URL y construye la SecretKey para HS256.
        // Se usa BASE64URL (RFC 4648) que no acepta '+' '/' pero si '-' '_',
        // cubriendo claves generadas con openssl, herramientas online, etc.
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(jwtConfig.getSecret()));
        this.expirationMs = jwtConfig.getExpirationMs();
    }

    /**
     * Genera un JWT firmado con los datos del usuario.
     * Claims incluidos: sub (email), nombre, roles, iat, exp.
     */
    public String generarToken(Usuario usuario) {
        List<String> roles = usuario.getRoles().stream()
                .map(Rol::getNombre)
                .toList();

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("nombre", usuario.getNombre())
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Extrae el email (subject) del token sin verificar expiración.
     * Siempre llamar a validarToken() antes de usar este método.
     */
    public String extraerEmail(String token) {
        return extraerClaims(token).getSubject();
    }

    /**
     * Extrae la lista de roles del claim "roles" del token.
     */
    @SuppressWarnings("unchecked")
    public List<String> extraerRoles(String token) {
        return (List<String>) extraerClaims(token).get("roles");
    }

    /**
     * Valida la firma y la expiración del token.
     *
     * @return true si el token es válido, false si está expirado, malformado o tiene firma incorrecta.
     */
    public boolean validarToken(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Token JWT expirado: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("Token JWT inválido: {}", e.getMessage());
        }
        return false;
    }

    // Parsea y verifica el token, lanzando excepción si algo falla
    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
