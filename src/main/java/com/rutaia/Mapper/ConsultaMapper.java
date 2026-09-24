package com.rutaia.Mapper;

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

    public ConsultaResponse entityToDto(Consulta consulta, UsuarioResponse usuarioResponse) {
        return new ConsultaResponse(
                consulta.getId(),
                usuarioResponse,
                consulta.getTexto(),
                consulta.getFechaConsulta()
        );
    }

    public void UpdateDtoToEntity(Consulta consulta, ConsultaRequest dto, Usuario usuario) {
        consulta.setUsuario(usuario);
        consulta.setTexto(dto.texto());
    }
}