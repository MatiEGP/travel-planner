package com.travelplanner.api.repositories;

import com.travelplanner.api.models.Costo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CostoRepository extends JpaRepository<Costo, Long> {
    List<Costo> findByPlanificacionId(Long planificacionId);
}
