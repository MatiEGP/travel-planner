package com.travelplanner.api.repositories;

import com.travelplanner.api.models.DiaItinerario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaItinerarioRepository extends JpaRepository<DiaItinerario, Long> {
    List<DiaItinerario> findByPlanificacionIdOrderByFechaAsc(Long planificacionId);
}
