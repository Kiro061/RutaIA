package com.rutaia.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RecomendacionRequest(
        @NotNull(message = "El id de consulta es obligatorio")
        @Positive(message = "El id de consulta debe ser positivo")
        Long consultaId,

        @NotNull(message = "El id de curso es obligatorio")
        @Positive(message = "El id de curso debe ser positivo")
        Long cursoId,

        Double puntajeSimilitud,

        @NotBlank(message = "La justificacion no puede ser vacia")
        @NotNull(message = "La justificacion no puede ser nula")
        String justificacion
) {
}
