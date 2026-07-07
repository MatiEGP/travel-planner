package com.travelplanner.api.dtos;

import lombok.Data;

@Data
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password;
}
