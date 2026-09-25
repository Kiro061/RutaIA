package com.rutaia.Service;

import com.rutaia.DTO.Request.CursoRequest;
import com.rutaia.DTO.Response.CursoResponse;

import java.util.List;

public interface CursoService {

    CursoResponse guardarCurso(CursoRequest dto);
    CursoResponse actualizarCurso(Long id, CursoRequest dto);
    void eliminarCurso(Long id);
    CursoResponse desactivarCurso(Long id);
    CursoResponse buscarCursoId(Long id);
    List<CursoResponse> listarTodos();
    List<CursoResponse> buscarCursoNombreSimilar(String nombre);
    List<CursoResponse> buscarCursoDescripcionSimilar(String descripcion);
    List<CursoResponse> buscarCursoCategoria(String categoria);
    List<CursoResponse> buscarCursoNivel(String nivel);
    List<CursoResponse> buscarCursoActivo(Boolean activo);
}