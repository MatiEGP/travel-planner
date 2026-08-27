package com.travelplanner.api.planificaciones;

import com.travelplanner.api.planificaciones.Costo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CostoRepository extends JpaRepository<Costo, Long> {
    List<Costo> findByPlanificacionId(Long planificacionId);
}
