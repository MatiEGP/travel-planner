package com.travelplanner.api.planificaciones;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "items_itinerario")
@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ItemItinerario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dia_itinerario_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private DiaItinerario diaItinerario;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoItem tipo;

    @Column(name = "referencia_id", nullable = false)
    private Long referenciaId;

    @Column(length = 500)
    private String notas;
}
