package com.travelplanner.api.controllers;

import com.travelplanner.api.dtos.UsuarioRequestDTO;
import com.travelplanner.api.dtos.UsuarioResponseDTO;
import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> registrarUsuario(@RequestBody UsuarioRequestDTO request) {
        // Mapeo manual de requestDTO a Entity
        Usuario usuarioNuevo = new Usuario();
        usuarioNuevo.setNombre(request.getNombre());
        usuarioNuevo.setEmail(request.getEmail());
        usuarioNuevo.setPassword(request.getPassword());

        Usuario usuarioGuardado = usuarioService.registrarUsuario(usuarioNuevo);

        UsuarioResponseDTO response = mapearAResponse(usuarioGuardado);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(mapearAResponse(usuario));
    }

    @GetMapping("")
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        List<UsuarioResponseDTO> responses = usuarios.stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Helper para armar el response de Usuario
    private UsuarioResponseDTO mapearAResponse(Usuario usuario) {
        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(usuario.getId());
        response.setNombre(usuario.getNombre());
        response.setEmail(usuario.getEmail());
        response.setFechaRegistro(usuario.getFechaRegistro());
        return response;
    }
}
