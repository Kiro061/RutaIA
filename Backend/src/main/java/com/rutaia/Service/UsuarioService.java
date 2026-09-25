package com.rutaia.Service;

import com.rutaia.DTO.Request.UsuarioRequest;
import com.rutaia.DTO.Response.UsuarioResponse;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse guardar(UsuarioRequest dto);
    UsuarioResponse buscarPorId(Long id);

    List<UsuarioResponse> listarTodos();

    List<UsuarioResponse> buscarPorNombreSimilarA(String nombre);

    UsuarioResponse buscarPorCorreo(String correo);

    List<UsuarioResponse> buscarPorRol(String rol);

    UsuarioResponse actualizar(UsuarioRequest dto, Long id);

    void eliminar(Long id);

}
