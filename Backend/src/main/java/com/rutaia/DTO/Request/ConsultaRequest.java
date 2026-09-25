package com.rutaia.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ConsultaRequest(
        @NotNull(message = "El id de usuario es obligatorio")
        @Positive(message = "El id de usuario debe ser positivo")
        Long usuarioId,

        @NotBlank(message = "El texto de la consulta no puede ser vacio")
        @NotNull(message = "El texto de la consulta no puede ser nulo")
        String texto
) {
}
