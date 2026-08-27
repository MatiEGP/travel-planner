package com.travelplanner.api.planificaciones;

import com.travelplanner.api.usuarios.Usuario;
import com.travelplanner.api.usuarios.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class DiaItinerarioRepositoryTest {

    @Autowired
    private DiaItinerarioRepository diaItinerarioRepository;

    @Autowired
    private PlanificacionRepository planificacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Planificacion planificacion;

    @BeforeEach
    void setUp() {
        Usuario usuario = Usuario.builder()
                .nombre("Matias")
                .email("matias@example.com")
                .password("pass123")
                .build();
        usuario = usuarioRepository.save(usuario);

        planificacion = Planificacion.builder()
                .titulo("Viaje a Japon")
                .fechaInicio(LocalDate.of(2026, 10, 1))
                .fechaFin(LocalDate.of(2026, 10, 15))
                .usuario(usuario)
                .build();
        planificacion = planificacionRepository.save(planificacion);
    }

    @Test
    void findByPlanificacionIdOrderByFechaAsc_debeRetornarDiasOrdenados() {
        DiaItinerario dia2 = DiaItinerario.builder()
                .fecha(LocalDate.of(2026, 10, 2))
                .planificacion(planificacion)
                .build();
        DiaItinerario dia1 = DiaItinerario.builder()
                .fecha(LocalDate.of(2026, 10, 1))
                .planificacion(planificacion)
                .build();
        
        diaItinerarioRepository.save(dia2);
        diaItinerarioRepository.save(dia1);

        List<DiaItinerario> resultados = diaItinerarioRepository.findByPlanificacionIdOrderByFechaAsc(planificacion.getId());

        assertEquals(2, resultados.size());
        assertEquals(LocalDate.of(2026, 10, 1), resultados.get(0).getFecha());
        assertEquals(LocalDate.of(2026, 10, 2), resultados.get(1).getFecha());
    }

    @Test
    void findByPlanificacionIdOrderByFechaAsc_cuandoNoHayDias_debeRetornarListaVacia() {
        List<DiaItinerario> resultados = diaItinerarioRepository.findByPlanificacionIdOrderByFechaAsc(planificacion.getId());
        assertTrue(resultados.isEmpty());
    }
}
