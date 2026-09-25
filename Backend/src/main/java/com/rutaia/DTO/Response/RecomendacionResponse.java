package com.rutaia.DTO.Response;

public record RecomendacionResponse(
        Long id,
        ConsultaResponse consulta,
        CursoResponse curso,
        Double puntajeSimilitud,
        String justificacion
) {
}