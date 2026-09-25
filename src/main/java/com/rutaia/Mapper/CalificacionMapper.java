package com.rutaia.Mapper;

import com.rutaia.DTO.Request.CalificacionRequest;
import com.rutaia.DTO.Response.CalificacionResponse;
import com.rutaia.Modelo.Calificacion;
import com.rutaia.Modelo.Consulta;
import org.springframework.stereotype.Component;

@Component
public class CalificacionMapper {

    public Calificacion dtoToEntity(CalificacionRequest dto, Consulta consulta) {
        Calificacion calificacion = new Calificacion();
        calificacion.setConsulta(consulta);
        calificacion.setPuntuacion(dto.puntuacion());
        calificacion.setComentario(dto.comentario());
        return calificacion;
    }

    public CalificacionResponse entityToDto(Calificacion calificacion) {
        return new CalificacionResponse(
                calificacion.getId(),
                calificacion.getConsulta().getId(),
                calificacion.getPuntuacion(),
                calificacion.getComentario()
        );
    }

    public void updateDtoToEntity(Calificacion calificacion, CalificacionRequest dto) {
        calificacion.setPuntuacion(dto.puntuacion());
        calificacion.setComentario(dto.comentario());
    }
}