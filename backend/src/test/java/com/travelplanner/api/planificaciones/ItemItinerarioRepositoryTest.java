package com.travelplanner.api.planificaciones;

import com.travelplanner.api.usuarios.Usuario;
import com.travelplanner.api.usuarios.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ItemItinerarioRepositoryTest {

    @Autowired
    private ItemItinerarioRepository itemItinerarioRepository;

    @Autowired
    private DiaItinerarioRepository diaItinerarioRepository;

    @Autowired
    private PlanificacionRepository planificacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private DiaItinerario diaItinerario;

    @BeforeEach
    void setUp() {
        Usuario usuario = Usuario.builder()
                .nombre("Matias")
                .email("matias@example.com")
                .password("pass123")
                .build();
        usuario = usuarioRepository.save(usuario);

        Planificacion planificacion = Planificacion.builder()
                .titulo("Viaje a Japon")
                .fechaInicio(LocalDate.of(2026, 10, 1))
                .fechaFin(LocalDate.of(2026, 10, 15))
                .usuario(usuario)
                .build();
        planificacion = planificacionRepository.save(planificacion);

        diaItinerario = DiaItinerario.builder()
                .fecha(LocalDate.of(2026, 10, 1))
                .planificacion(planificacion)
                .build();
        diaItinerario = diaItinerarioRepository.save(diaItinerario);
    }

    @Test
    void findByDiaItinerarioIdOrderByHoraInicioAsc_debeRetornarItemsOrdenados() {
        ItemItinerario item2 = ItemItinerario.builder()
                .diaItinerario(diaItinerario)
                .horaInicio(LocalTime.of(14, 0))
                .horaFin(LocalTime.of(16, 0))
                .tipo(TipoItem.ACTIVIDAD)
                .referenciaId(2L)
                .build();
                
        ItemItinerario item1 = ItemItinerario.builder()
                .diaItinerario(diaItinerario)
                .horaInicio(LocalTime.of(10, 0))
                .horaFin(LocalTime.of(12, 0))
                .tipo(TipoItem.ACTIVIDAD)
                .referenciaId(1L)
                .build();

        itemItinerarioRepository.save(item2);
        itemItinerarioRepository.save(item1);

        List<ItemItinerario> resultados = itemItinerarioRepository.findByDiaItinerarioIdOrderByHoraInicioAsc(diaItinerario.getId());

        assertEquals(2, resultados.size());
        assertEquals(LocalTime.of(10, 0), resultados.get(0).getHoraInicio());
        assertEquals(LocalTime.of(14, 0), resultados.get(1).getHoraInicio());
    }

    @Test
    void findByDiaItinerarioIdOrderByHoraInicioAsc_cuandoNoHayItems_debeRetornarListaVacia() {
        List<ItemItinerario> resultados = itemItinerarioRepository.findByDiaItinerarioIdOrderByHoraInicioAsc(diaItinerario.getId());
        assertTrue(resultados.isEmpty());
    }
}
