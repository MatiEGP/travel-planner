package com.travelplanner.api.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "destinos")
@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Destino {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 255)
    private String pais;

    @Column(length = 255)
    private String ciudad;

    @Column(length = 500)
    private String notas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planificacion_id", nullable = false)
    @ToString.Exclude // Evitar bucles infinitos al llamar metodo ToString de Planificacion
    @EqualsAndHashCode.Exclude // Evitar comparaciones innecesarias en memoria
    private Planificacion planificacion;

    @OneToMany(mappedBy = "destino", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Actividad> actividades = new ArrayList<>();
}
