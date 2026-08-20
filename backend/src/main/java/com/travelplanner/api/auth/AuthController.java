package com.travelplanner.api.auth;

import com.travelplanner.api.auth.LoginRequestDTO;
import com.travelplanner.api.auth.RegistroRequestDTO;
import com.travelplanner.api.usuarios.UsuarioResponseDTO;
import com.travelplanner.api.usuarios.Rol;
import com.travelplanner.api.usuarios.Usuario;
import com.travelplanner.api.usuarios.RolRepository;
import com.travelplanner.api.auth.JwtService;
import com.travelplanner.api.usuarios.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @Value("${app.jwt.cookie-secure:false}")
    private boolean cookieSecure;

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
        ResponseCookie cookie = crearCookieJwt(token, 86400);

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
        ResponseCookie cookie = crearCookieJwt(token, 86400);

        UsuarioResponseDTO response = mapearAResponse(usuario);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    /**
     * POST /api/auth/logout
     * Limpia la cookie HttpOnly "token".
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
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
                .secure(cookieSecure)
                .path("/")
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
