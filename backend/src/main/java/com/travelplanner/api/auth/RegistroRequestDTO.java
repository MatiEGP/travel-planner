package com.travelplanner.api.auth;

import lombok.Data;

@Data
public class RegistroRequestDTO {
    private String nombre;
    private String email;
    private String password;
}
