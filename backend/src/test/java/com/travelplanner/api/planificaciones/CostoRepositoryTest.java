package com.travelplanner.api.planificaciones;

import com.travelplanner.api.usuarios.Usuario;
import com.travelplanner.api.usuarios.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CostoRepositoryTest {

    @Autowired
    private CostoRepository costoRepository;

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
    void findByPlanificacionId_debeRetornarCostosDePlanificacion() {
        Costo costo1 = Costo.builder()
                .categoria("Vuelo")
                .monto(new BigDecimal("1000.00"))
                .planificacion(planificacion)
                .build();
        Costo costo2 = Costo.builder()
                .categoria("Comida")
                .monto(new BigDecimal("500.00"))
                .planificacion(planificacion)
                .build();
        costoRepository.save(costo1);
        costoRepository.save(costo2);

        List<Costo> resultados = costoRepository.findByPlanificacionId(planificacion.getId());

        assertEquals(2, resultados.size());
    }

    @Test
    void findByPlanificacionId_cuandoNoHayCostos_debeRetornarListaVacia() {
        List<Costo> resultados = costoRepository.findByPlanificacionId(planificacion.getId());
        assertTrue(resultados.isEmpty());
    }
}
