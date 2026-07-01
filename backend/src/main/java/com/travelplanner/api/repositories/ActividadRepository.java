package com.travelplanner.api.repositories;

import com.travelplanner.api.models.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    // Trae la agenda de actividades de un destino ordenadas cronologicamente
    List<Actividad> findByDestinoIdOrderByFechaHoraAsc (Long destinoId);
}
