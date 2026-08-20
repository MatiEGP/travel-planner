package com.travelplanner.api.destinos;

import com.travelplanner.api.destinos.Destino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinoRepository extends JpaRepository<Destino, Long> {

    // Trae los destinos planificados para un viaje específico
    List<Destino> findByPlanificacionId (Long planificacionId);
}
