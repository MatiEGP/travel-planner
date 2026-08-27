package com.travelplanner.api.planificaciones;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItinerarioService {

    private final DiaItinerarioRepository diaItinerarioRepository;
    private final ItemItinerarioRepository itemItinerarioRepository;
    private final PlanificacionRepository planificacionRepository;

    @Transactional
    public DiaItinerario crearDiaItinerario(Long planificacionId, DiaItinerario dia) {
        Planificacion planificacion = planificacionRepository.findById(planificacionId)
                .orElseThrow(() -> new IllegalArgumentException("Planificacion no existe."));
        dia.setPlanificacion(planificacion);
        return diaItinerarioRepository.save(dia);
    }

    @Transactional(readOnly = true)
    public List<DiaItinerario> obtenerDiasPorPlanificacion(Long planificacionId) {
        return diaItinerarioRepository.findByPlanificacionIdOrderByFechaAsc(planificacionId);
    }

    @Transactional
    public void eliminarDia(Long id) {
        if (!diaItinerarioRepository.existsById(id)) {
            throw new IllegalArgumentException("El dia no existe.");
        }
        diaItinerarioRepository.deleteById(id);
    }

    @Transactional
    public ItemItinerario crearItem(Long diaId, ItemItinerario item) {
        DiaItinerario dia = diaItinerarioRepository.findById(diaId)
                .orElseThrow(() -> new IllegalArgumentException("El dia del itinerario no existe."));
        item.setDiaItinerario(dia);
        return itemItinerarioRepository.save(item);
    }

    @Transactional
    public void eliminarItem(Long id) {
        if (!itemItinerarioRepository.existsById(id)) {
            throw new IllegalArgumentException("El item no existe.");
        }
        itemItinerarioRepository.deleteById(id);
    }
}
