package com.travelplanner.api.services;

import com.travelplanner.api.exceptions.CredencialesInvalidasException;
import com.travelplanner.api.models.Usuario;
import com.travelplanner.api.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario hasheando su contraseña con BCrypt.
     * Lanza IllegalArgumentException si el email ya existe.
     */
    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El Email ya se encuentra registrado");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    /**
     * Valida las credenciales del usuario comparando la contraseña con BCrypt.
     *
     * @return el Usuario si las credenciales son correctas.
     * @throws IllegalArgumentException si el email no existe o la contraseña es incorrecta.
     */
    @Transactional(readOnly = true)
    public Usuario autenticar(String email, String rawPassword) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new CredencialesInvalidasException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(rawPassword, usuario.getPassword())) {
            throw new CredencialesInvalidasException("Credenciales incorrectas");
        }
        return usuario;
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
