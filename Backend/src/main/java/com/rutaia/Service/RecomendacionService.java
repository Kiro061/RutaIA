package com.rutaia.Service;

import com.rutaia.DTO.Request.RecomendacionRequest;
import com.rutaia.DTO.Response.RecomendacionResponse;

import java.util.List;

public interface RecomendacionService {

    RecomendacionResponse crear(RecomendacionRequest dto);

    RecomendacionResponse actualizar(Long id, RecomendacionRequest dto);

    RecomendacionResponse obtenerPorId(Long id);

    List<RecomendacionResponse> listarPorConsulta(Long consultaId);

    List<RecomendacionResponse> listarPorCurso(Long cursoId);

    List<RecomendacionResponse> listarTodas();

    void eliminar(Long id);
}
