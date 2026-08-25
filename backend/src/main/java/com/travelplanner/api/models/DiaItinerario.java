package com.travelplanner.api.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dias_itinerario")
@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DiaItinerario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planificacion_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Planificacion planificacion;

    @OneToMany(mappedBy = "diaItinerario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItemItinerario> items = new ArrayList<>();
}
