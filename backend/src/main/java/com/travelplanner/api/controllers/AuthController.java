package com.travelplanner.api.controllers;

import com.travelplanner.api.dtos.LoginRequestDTO;
import com.travelplanner.api.dtos.LoginResponseDTO;
import com.travelplanner.api.dtos.RegistroRequestDTO;
import com.travelplanner.api.dtos.UsuarioResponseDTO;
import com.travelplanner.api.models.Rol;
import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.repositories.RolRepository;
import com.travelplanner.api.services.JwtService;
import com.travelplanner.api.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints públicos de autenticación.
 * No requieren token JWT — están en la lista blanca de SecurityConfig.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final RolRepository rolRepository;

    /**
     * POST /api/auth/registro
     * Registra un nuevo usuario asignándole automáticamente el rol CLIENT.
     * Rechaza la petición con 403 si el solicitante ya tiene sesión activa (JWT válido).
     */
    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDTO> registro(@RequestBody RegistroRequestDTO request) {
        // Bloquear registro si el usuario ya está autenticado.
        // Evita que un usuario logueado cree nuevas cuentas manipulando la URL o la API.
        if (estaAutenticado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Rol rolClient = rolRepository.findByNombre("CLIENT")
                .orElseThrow(() -> new IllegalStateException("Rol CLIENT no encontrado. Verificar datos iniciales."));

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(request.getPassword())
                .build();
        nuevoUsuario.getRoles().add(rolClient);

        Usuario usuarioGuardado = usuarioService.registrarUsuario(nuevoUsuario);

        UsuarioResponseDTO response = mapearAResponse(usuarioGuardado);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Autentica un usuario y devuelve un JWT firmado con clave simétrica (HS256).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        // Bloquear login si el usuario ya está autenticado con un token válido.
        if (estaAutenticado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Usuario usuario = usuarioService.autenticar(request.getEmail(), request.getPassword());

        String token = jwtService.generarToken(usuario);

        List<String> roles = usuario.getRoles().stream()
                .map(Rol::getNombre)
                .toList();

        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(token)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .roles(roles)
                .build();

        return ResponseEntity.ok(response);
    }

    // Helper: construye el UsuarioResponseDTO desde la entidad
    private UsuarioResponseDTO mapearAResponse(Usuario usuario) {
        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(usuario.getId());
        response.setNombre(usuario.getNombre());
        response.setEmail(usuario.getEmail());
        response.setFechaRegistro(usuario.getFechaRegistro());
        return response;
    }

    /**
     * Verifica si la petición actual proviene de un usuario ya autenticado con JWT.
     * Spring Security asigna un AnonymousAuthenticationToken cuando no hay token —
     * por eso hay que excluir ese caso explícitamente.
     */
    private boolean estaAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null
                && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);
    }
}
