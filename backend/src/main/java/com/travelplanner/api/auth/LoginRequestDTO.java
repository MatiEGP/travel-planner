package com.travelplanner.api.auth;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String password;
}
