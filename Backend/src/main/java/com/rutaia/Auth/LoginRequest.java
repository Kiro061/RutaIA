package com.rutaia.Auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LoginRequest (
        @NotNull(message = "El usuario no puede ser nulo")
        @NotBlank(message = "El usuario no puede ser vacio")
        @Size(min = 3, max = 50, message = "El usuario debe tener entre 3 y 50 caracteres")
        String usuario,
        @NotNull(message = "La contrasenia no puede ser nulo")
        @NotBlank(message = "La contrasenia no puede ser vacio")
        @Size(min = 3, max = 50, message = "La contrasenia debe tener entre 8 y 50 caracteres")
        String contrasenia
){

}