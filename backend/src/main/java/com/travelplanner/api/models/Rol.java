package com.travelplanner.api.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre único del rol (ej: "ADMIN", "CLIENT").
     * Se usa directamente en los claims del JWT y en Spring Security como autoridad.
     */
    @Column(nullable = false, unique = true, length = 50)
    private String nombre;
}
