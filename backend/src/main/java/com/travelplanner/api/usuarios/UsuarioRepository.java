package com.travelplanner.api.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // metodo para validar login y registros unicos
    Optional<Usuario> findByEmail(String email);

    // metodo para verificar si el mail ya está en uso
    boolean existsByEmail(String email);
}
