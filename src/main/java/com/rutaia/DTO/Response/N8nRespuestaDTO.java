package com.rutaia.DTO.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record N8nRespuestaDTO(
        String respuesta,
        String estado
) {
}
