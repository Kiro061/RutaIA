package com.rutaia.DTO.Response;

public record CursoResponse(
    Long id,
    String nombre,
    String descripcion,
    String categoria,
    String nivel,
    Boolean activo,
    String duracion

) {
}
