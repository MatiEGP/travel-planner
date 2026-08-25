package com.travelplanner.api.repositories;

import com.travelplanner.api.models.ItemItinerario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemItinerarioRepository extends JpaRepository<ItemItinerario, Long> {
    List<ItemItinerario> findByDiaItinerarioIdOrderByHoraInicioAsc(Long diaItinerarioId);
}
