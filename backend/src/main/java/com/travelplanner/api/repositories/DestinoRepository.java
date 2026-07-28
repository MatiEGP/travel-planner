package com.travelplanner.api.repositories;

import com.travelplanner.api.models.Destino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinoRepository extends JpaRepository<Destino, Long> {

    // Trae los destinos planificados para un viaje específico
    List<Destino> findByPlanificacionId (Long planificacionId);
}
