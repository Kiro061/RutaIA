package com.rutaia.DTO.Response;

import java.time.LocalDateTime;

public record ConsultaResponse(
        Long id,
        UsuarioResponse usuario,
        String texto,
        LocalDateTime fechaConsulta,
        String respuesta,
        String estado,
        CalificacionResponse calificacion
) {
}