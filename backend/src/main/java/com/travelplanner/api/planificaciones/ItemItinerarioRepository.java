package com.travelplanner.api.planificaciones;

import com.travelplanner.api.planificaciones.ItemItinerario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemItinerarioRepository extends JpaRepository<ItemItinerario, Long> {
    List<ItemItinerario> findByDiaItinerarioIdOrderByHoraInicioAsc(Long diaItinerarioId);
}
