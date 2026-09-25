package com.rutaia.DTO.Response;

public record CalificacionResponse(
        Long id,
        Long consultaId,
        Integer puntuacion,
        String comentario
) {
}