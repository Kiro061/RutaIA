package com.rutaia.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CursoRequest(
        @NotBlank(message = "el nombre no puede ser vacio")
        @NotNull(message = "el nombre no puede ser nulo")
        @Size(min = 8, max = 150, message = "El nombre debe tener entre 8 y 150 caracteres")
        String nombre,

        @NotBlank(message = "el nombre no puede ser vacio")
        @NotNull(message = "el nombre no puede ser nulo")
        @Size(min = 8, max = 150, message = "El nombre debe tener entre 8 y 150 caracteres")
        String categoria,

        @NotBlank(message = "el nombre no puede ser vacio")
        @NotNull(message = "el nombre no puede ser nulo")
        @Size(min = 8, max = 150, message = "El nombre debe tener entre 8 y 150 caracteres")
        String descripcion,

        @NotBlank(message = "el nivel no puede ser vacio")
        @NotNull(message = "el nivel no puede ser nulo")
        String nivel,

        Boolean activo,

        @NotBlank(message = "La duracion no puede ser vacia")
        @NotNull(message = "La duracion no puede ser nula")
        @Size(min = 1, max = 150, message = "la duracion debe tener entre 1 y 150 caracteres")
        String duracion
) {
}
