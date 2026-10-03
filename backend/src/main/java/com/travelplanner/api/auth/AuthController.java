package com.travelplanner.api.auth;

import com.travelplanner.api.config.JwtConfig;
import com.travelplanner.api.usuarios.UsuarioResponseDTO;
import com.travelplanner.api.usuarios.Rol;
import com.travelplanner.api.usuarios.Usuario;
import com.travelplanner.api.usuarios.RolRepository;
import com.travelplanner.api.usuarios.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

/**
 * Endpoints de autenticación (Login, Registro, Logout, Me).
 * Utiliza transporte JWT seguro mediante cookies HttpOnly.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final RolRepository rolRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtConfig jwtConfig;

    /**
     * POST /api/auth/registro
     * Registra un nuevo usuario con rol CLIENT, genera JWT y setea cookie HttpOnly.
     */
    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDTO> registro(@RequestBody RegistroRequestDTO request) {
        Rol rolClient = rolRepository.findByNombre("CLIENT")
                .orElseThrow(() -> new IllegalStateException("Rol CLIENT no encontrado. Verificar datos iniciales."));

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(request.getPassword())
                .build();
        nuevoUsuario.getRoles().add(rolClient);

        Usuario usuarioGuardado = usuarioService.registrarUsuario(nuevoUsuario);

        String token = jwtService.generarToken(usuarioGuardado);
        ResponseCookie cookie = crearCookieJwt(token, refreshTokenService.getAccessTokenExpirationSeconds());

        UsuarioResponseDTO response = mapearAResponse(usuarioGuardado);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    /**
     * POST /api/auth/login
     * Autentica un usuario, genera JWT y setea cookie HttpOnly.
     */
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody LoginRequestDTO request) {
        Usuario usuario = usuarioService.autenticar(request.getEmail(), request.getPassword());
        String token = jwtService.generarToken(usuario);
        ResponseCookie cookie = crearCookieJwt(token, refreshTokenService.getAccessTokenExpirationSeconds());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(usuario);
        ResponseCookie refreshCookie = crearCookieRefreshToken(refreshToken.getToken(), refreshTokenService.getRefreshExpirationSeconds());

        UsuarioResponseDTO response = mapearAResponse(usuario);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    /**
     * POST /api/auth/refresh
     * Refresca el token JWT usando el refresh_token de la cookie.
     * Implementa Absolute Expiration: el nuevo refresh token hereda la fecha
     * de expiración original, no genera una nueva ventana de 7 días.
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@CookieValue(name = "refresh_token", required = false) String requestRefreshToken) {
        if (requestRefreshToken == null) {
            throw new IllegalArgumentException("Refresh Token is missing!");
        }

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(oldRefreshToken -> {
                    Usuario usuario = oldRefreshToken.getUsuario();
                    Instant absoluteExpiry = oldRefreshToken.getExpiryDate();

                    String token = jwtService.generarToken(usuario);
                    ResponseCookie jwtCookie = crearCookieJwt(token, refreshTokenService.getAccessTokenExpirationSeconds());

                    refreshTokenService.deleteByToken(requestRefreshToken);
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(usuario, absoluteExpiry);

                    long remainingSeconds = Duration.between(Instant.now(), absoluteExpiry).getSeconds();
                    ResponseCookie refreshCookie = crearCookieRefreshToken(newRefreshToken.getToken(), Math.max(remainingSeconds, 0));

                    List<String> roles = usuario.getRoles().stream().map(Rol::getNombre).toList();
                    LoginResponseDTO response = LoginResponseDTO.builder()
                            .token(token)
                            .email(usuario.getEmail())
                            .nombre(usuario.getNombre())
                            .roles(roles)
                            .build();

                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                            .body(response);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    /**
     * POST /api/auth/logout
     * Limpia la cookie HttpOnly "token" y "refresh_token", y borra el refresh token de la base de datos.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = "refresh_token", required = false) String requestRefreshToken) {
        if (requestRefreshToken != null) {
            refreshTokenService.deleteByToken(requestRefreshToken);
        }

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path("/api/auth")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .build();
    }

    /**
     * GET /api/auth/me
     * Retorna el perfil del usuario autenticado actual con sus roles.
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = auth.getName();
        Usuario usuario = usuarioService.buscarPorEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        return ResponseEntity.ok(mapearAResponse(usuario));
    }

    private ResponseCookie crearCookieJwt(String token, long maxAgeSegundos) {
        return ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path("/")
                .maxAge(maxAgeSegundos)
                .sameSite("Strict")
                .build();
    }

    private ResponseCookie crearCookieRefreshToken(String token, long maxAgeSegundos) {
        return ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path("/api/auth")
                .maxAge(maxAgeSegundos)
                .sameSite("Strict")
                .build();
    }

    private UsuarioResponseDTO mapearAResponse(Usuario usuario) {
        List<String> roles = (usuario.getRoles() != null)
                ? usuario.getRoles().stream().map(Rol::getNombre).toList()
                : List.of();

        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .fechaRegistro(usuario.getFechaRegistro())
                .roles(roles)
                .build();
    }
}
