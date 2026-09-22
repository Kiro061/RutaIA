package com.rutaia.DTO.Request;

import com.rutaia.Modelo.Enums.Rol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(

        @NotNull(message = "El nombre no puede ser nulo")
        @NotBlank(message = "El nombre no puede estar vacio")
        @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
        String nombre,

        @NotNull(message = "El correo no puede ser nulo")
        @NotBlank(message = "El correo no puede estar vacio")
        @Size(min = 3, max = 150, message = "El correo debe tener entre 3 y 100 caracteres")
        String correo,

        @NotNull(message = "El correo no puede ser nulo")
        @NotBlank(message = "El correo no puede estar vacio")
        @Size(min = 8, max = 255, message = "La debe tener entre 3 y 255 caracteres")
        String password,

        Rol rol
) {
}
