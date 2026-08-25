package com.travelplanner.api.services;

import com.travelplanner.api.models.Costo;
import com.travelplanner.api.models.Planificacion;
import com.travelplanner.api.repositories.CostoRepository;
import com.travelplanner.api.repositories.PlanificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CostoService {

    private final CostoRepository costoRepository;
    private final PlanificacionRepository planificacionRepository;

    @Transactional
    public Costo crearCosto(Long planificacionId, Costo costo) {
        Planificacion planificacion = planificacionRepository.findById(planificacionId)
                .orElseThrow(() -> new IllegalArgumentException("La Planificacion con ID " + planificacionId + " no existe."));
        
        costo.setPlanificacion(planificacion);
        return costoRepository.save(costo);
    }

    @Transactional(readOnly = true)
    public Costo buscarPorId(Long id) {
        return costoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El Costo con ID " + id + " no encontrado."));
    }

    @Transactional(readOnly = true)
    public List<Costo> obtenerCostosPorPlanificacion(Long planificacionId) {
        if (!planificacionRepository.existsById(planificacionId)) {
            throw new IllegalArgumentException("La Planificacion con ID " + planificacionId + " no existe.");
        }
        return costoRepository.findByPlanificacionId(planificacionId);
    }

    @Transactional
    public void eliminarCosto(Long id) {
        if (!costoRepository.existsById(id)) {
            throw new IllegalArgumentException("El Costo con ID " + id + " no se pudo eliminar porque no existe.");
        }
        costoRepository.deleteById(id);
    }
}
