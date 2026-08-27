package com.travelplanner.api.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    /** El token JWT firmado listo para usar en el header Authorization. */
    private String token;

    /** Siempre "Bearer" — indica el esquema de autenticación al frontend. */
    @Builder.Default
    private String tipo = "Bearer";

    private String email;
    private String nombre;
    private List<String> roles;
}
