package com.rutaia.DTO.Response;

public record UsuarioResponse(
        Long id,
        String nombre,
        String correo,
        String rol,
        String nivelExperiencia,
        String areaInteres
) {
}