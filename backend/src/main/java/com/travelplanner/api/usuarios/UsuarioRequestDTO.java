package com.travelplanner.api.usuarios;

import lombok.Data;

@Data
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password;
}
