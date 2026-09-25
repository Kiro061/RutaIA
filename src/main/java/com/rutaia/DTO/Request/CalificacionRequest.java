package com.rutaia.DTO.Request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CalificacionRequest(
        @NotNull(message = "El id de la consulta es obligatorio")
        @Positive(message = "El id de la consulta debe ser positivo")
        Long consultaId,

        @NotNull(message = "La puntuacion es obligatoria")
        @Min(value = 1, message = "La puntuacion minima es 1")
        @Max(value = 5, message = "La puntuacion maxima es 5")
        Integer puntuacion,

        @Size(max = 500, message = "El comentario no puede superar los 500 caracteres")
        String comentario
) {
}