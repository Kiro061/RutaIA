package com.rutaia.Service;

import com.rutaia.DTO.Request.ConsultaRequest;
import com.rutaia.DTO.Response.ConsultaResponse;

import java.util.List;

public interface ConsultaService {
    ConsultaResponse crear(ConsultaRequest dto);

    ConsultaResponse actualizar(Long id, ConsultaRequest dto);

    ConsultaResponse obtenerPorId(Long id);

    List<ConsultaResponse> listarPorUsuario(Long usuarioId);

    List<ConsultaResponse> listarTodas();

    void eliminar(Long id);
}
