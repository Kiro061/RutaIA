package com.rutaia.Service;


import com.rutaia.DTO.Request.CalificacionRequest;
import com.rutaia.DTO.Response.CalificacionResponse;

import java.util.List;

public interface CalificacionService {

    CalificacionResponse crear(CalificacionRequest dto);

    CalificacionResponse actualizar(Long id, CalificacionRequest dto);

    CalificacionResponse obtenerPorId(Long id);

    CalificacionResponse obtenerPorRecomendacion(Long recomendacionId);

    List<CalificacionResponse> listarTodas();

    void eliminar(Long id);
}