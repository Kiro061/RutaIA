package com.rutaia.Mapper;

import com.rutaia.DTO.Response.N8nRespuestaDTO;
import com.rutaia.DTO.Request.ConsultaRequest;
import com.rutaia.DTO.Response.ConsultaResponse;
import com.rutaia.DTO.Response.UsuarioResponse;
import com.rutaia.Modelo.Consulta;
import com.rutaia.Modelo.Usuario;
import org.springframework.stereotype.Component;

@Component
public class ConsultaMapper {

    public Consulta dtoToEntity(ConsultaRequest dto, Usuario usuario) {
        Consulta consulta = new Consulta();
        consulta.setUsuario(usuario);
        consulta.setTexto(dto.texto());
        return consulta;
    }

    // Se usa donde no hay respuesta de n8n de por medio (actualizar, obtener, listar)
    public ConsultaResponse entityToDto(Consulta consulta, UsuarioResponse usuarioResponse) {
        return new ConsultaResponse(
                consulta.getId(),
                usuarioResponse,
                consulta.getTexto(),
                consulta.getFechaConsulta(),
                null,
                null
        );
    }

    // Se usa justo después de crear la consulta, cuando ya tenemos la respuesta de n8n
    public ConsultaResponse entityToDto(Consulta consulta, UsuarioResponse usuarioResponse, N8nRespuestaDTO n8nRespuesta) {
        return new ConsultaResponse(
                consulta.getId(),
                usuarioResponse,
                consulta.getTexto(),
                consulta.getFechaConsulta(),
                n8nRespuesta != null ? n8nRespuesta.respuesta() : null,
                n8nRespuesta != null ? n8nRespuesta.estado() : "Error"
        );
    }

    public void UpdateDtoToEntity(Consulta consulta, ConsultaRequest dto, Usuario usuario) {
        consulta.setUsuario(usuario);
        consulta.setTexto(dto.texto());
    }
}