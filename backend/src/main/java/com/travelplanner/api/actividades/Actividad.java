package com.travelplanner.api.actividades;
import com.travelplanner.api.destinos.Destino;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "actividades")
@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Actividad {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 500)
    private String notas;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destino_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Destino destino;
}
