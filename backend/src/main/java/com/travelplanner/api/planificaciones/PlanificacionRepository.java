package com.travelplanner.api.planificaciones;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanificacionRepository extends JpaRepository<Planificacion, Long> {

    // Trae todas las planificaciones de un usuario específico
    List<Planificacion> findByUsuarioIdOrderByFechaInicioAsc(Long usuarioId);
}
