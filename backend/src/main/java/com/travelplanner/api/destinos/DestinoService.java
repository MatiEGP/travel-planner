package com.travelplanner.api.destinos;

import com.travelplanner.api.destinos.Destino;
import com.travelplanner.api.planificaciones.Planificacion;
import com.travelplanner.api.destinos.DestinoRepository;
import com.travelplanner.api.planificaciones.PlanificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service @RequiredArgsConstructor
public class DestinoService {

    private final DestinoRepository destinoRepository;
    private final PlanificacionRepository planificacionRepository;

    @Transactional
    public Destino crearDestino(Long planificacionId, Destino destino) {
        Planificacion planificacion = planificacionRepository.findById(planificacionId)
                .orElseThrow(() -> new IllegalArgumentException("Planificación no encontrada"));
        destino.setPlanificacion(planificacion);
        return destinoRepository.save(destino);
    }

    @Transactional(readOnly = true)
    public List<Destino> obtenerDestinosPorPlanificacion(Long planificacionId) {
        if (!planificacionRepository.existsById(planificacionId)) {
            throw new IllegalArgumentException("La planificacion con ID " + planificacionId + " no existe.");
        }
        return destinoRepository.findByPlanificacionId(planificacionId);
    }

    @Transactional(readOnly = true)
    public Destino buscarDestinoPorId(Long id) {
        return destinoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El Destino con ID " + id + " no existe."));
    }

    @Transactional
    public void eliminarDestino(Long id) {
        if (!destinoRepository.existsById(id)) {
            throw new IllegalArgumentException("El destino con ID " + id + " no se pudo eliminar porque no existe.");
        }
        destinoRepository.deleteById(id);
    }
}
