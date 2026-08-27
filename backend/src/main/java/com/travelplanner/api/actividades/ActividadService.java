package com.travelplanner.api.actividades;

import com.travelplanner.api.actividades.Actividad;
import com.travelplanner.api.destinos.Destino;
import com.travelplanner.api.planificaciones.Planificacion;
import com.travelplanner.api.actividades.ActividadRepository;
import com.travelplanner.api.destinos.DestinoRepository;
import com.travelplanner.api.planificaciones.PlanificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service @RequiredArgsConstructor
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final DestinoRepository destinoRepository;
    private final PlanificacionRepository planificacionRepository;

    @Transactional
    public Actividad crearActividad(Long planificacionId, Long destinoId, Actividad actividad) {
        Planificacion planificacion = planificacionRepository.findById(planificacionId)
                .orElseThrow(() -> new IllegalArgumentException("La Planificacion con ID " + planificacionId + " no existe."));
        actividad.setPlanificacion(planificacion);

        if (destinoId != null) {
            Destino destino = destinoRepository.findById(destinoId)
                    .orElseThrow(() -> new IllegalArgumentException("El Destino con ID " + destinoId + " no existe."));
            actividad.setDestino(destino);
        }

        return actividadRepository.save(actividad);
    }

    @Transactional(readOnly = true)
    public List<Actividad> obtenerActividadesPorPlanificacion(Long planificacionId) {
        if (!planificacionRepository.existsById(planificacionId)) {
            throw new IllegalArgumentException("La Planificacion con ID " + planificacionId + " no existe.");
        }
        return actividadRepository.findByPlanificacionIdOrderByFechaHoraAsc(planificacionId);
    }

    @Transactional(readOnly = true)
    public List<Actividad> obtenerActividadesPorDestino(Long destinoId) {
        if (!destinoRepository.existsById(destinoId)) {
            throw new IllegalArgumentException("El Destino con ID " + destinoId + " no existe.");
        }
        return actividadRepository.findByDestinoIdOrderByFechaHoraAsc(destinoId);
    }

    @Transactional(readOnly = true)
    public Actividad buscarPorId(Long id) {
        return actividadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La Actividad con ID " + id + " no encontrada."));
    }

    @Transactional
    public void eliminarActividad(Long id) {
        if (!actividadRepository.existsById(id)) {
            throw new IllegalArgumentException("La Actividad con ID " + id + " no se pudo eliminar porque no existe.");
        }
        actividadRepository.deleteById(id);
    }
}
