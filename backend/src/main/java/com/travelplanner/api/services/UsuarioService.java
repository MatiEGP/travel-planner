package com.travelplanner.api.services;

import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.repositories.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El Email ya se encuentra registrado");
        }
        // TODO: Agregar hasheo de contraseña al implementar JWT.
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
