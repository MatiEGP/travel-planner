package com.travelplanner.api.planificaciones;

import com.travelplanner.api.planificaciones.DiaItinerario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaItinerarioRepository extends JpaRepository<DiaItinerario, Long> {
    List<DiaItinerario> findByPlanificacionIdOrderByFechaAsc(Long planificacionId);
}
