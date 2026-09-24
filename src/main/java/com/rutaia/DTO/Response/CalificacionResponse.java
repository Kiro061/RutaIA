package com.rutaia.DTO.Response;

public record CalificacionResponse(
        Long id,
        RecomendacionResponse recomendacion,
        Integer puntuacion,
        String comentario
) {
}
