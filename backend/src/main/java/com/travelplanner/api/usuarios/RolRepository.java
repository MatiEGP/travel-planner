package com.travelplanner.api.usuarios;

import com.travelplanner.api.usuarios.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {

    // Usado al registrar un usuario para asignarle el rol por nombre
    Optional<Rol> findByNombre(String nombre);
}
