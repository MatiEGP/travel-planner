package com.travelplanner.api.planificaciones;

import com.travelplanner.api.usuarios.Usuario;
import com.travelplanner.api.usuarios.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service @RequiredArgsConstructor
public class PlanificacionService {

    private final PlanificacionRepository planificacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Planificacion crearPlanificacion(Long usuarioId, Planificacion planificacion) {
        if (planificacion.getFechaFin().isBefore(planificacion.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha fin no puede ser anterior a la fecha inicio");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("El usuario con ID " + usuarioId + " no existe."));
        planificacion.setUsuario(usuario);
        return planificacionRepository.save(planificacion);
    }

    @Transactional(readOnly = true)
    public List<Planificacion> obtenerPlanificacionesPorUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new IllegalArgumentException("El usuario con ID " + usuarioId + " no existe.");
        }
        return planificacionRepository.findByUsuarioIdOrderByFechaInicioAsc(usuarioId);
    }

    @Transactional(readOnly = true)
    public Planificacion buscarPorId(Long id) {
        return planificacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La planificación con ID " + id + " no existe."));
    }

    @Transactional
    public void eliminarPlanificacion(Long id) {
        if (!planificacionRepository.existsById(id)) {
            throw new IllegalArgumentException("La planificación con ID " + id + " no se pudo eliminar porque no existe.");
        }
        planificacionRepository.deleteById(id);
    }
}
