package com.travelplanner.api.planificaciones;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "costos")
@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Costo {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String categoria;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Column(length = 255)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planificacion_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Planificacion planificacion;
}
