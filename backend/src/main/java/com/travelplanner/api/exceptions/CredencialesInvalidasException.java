package com.travelplanner.api.exceptions;

/**
 * Excepción lanzada cuando las credenciales de login son incorrectas.
 * El GlobalExceptionHandler la captura y devuelve HTTP 401 Unauthorized.
 */
public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException(String mensaje) {
        super(mensaje);
    }
}
