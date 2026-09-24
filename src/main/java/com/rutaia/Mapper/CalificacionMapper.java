package com.rutaia.Mapper;

import com.rutaia.DTO.Request.CalificacionRequest;
import com.rutaia.DTO.Response.CalificacionResponse;
import com.rutaia.DTO.Response.RecomendacionResponse;
import com.rutaia.Modelo.Calificacion;
import com.rutaia.Modelo.Recomendacion;
import org.springframework.stereotype.Component;

@Component
public class CalificacionMapper {

    public Calificacion dtoToEntity(CalificacionRequest dto, Recomendacion recomendacion) {
        Calificacion calificacion = new Calificacion();
        calificacion.setRecomendacion(recomendacion);
        calificacion.setPuntuacion(dto.puntuacion());
        calificacion.setComentario(dto.comentario());
        return calificacion;
    }

    public CalificacionResponse entityToDto(Calificacion calificacion, RecomendacionResponse recomendacionResponse) {
        return new CalificacionResponse(
                calificacion.getId(),
                recomendacionResponse,
                calificacion.getPuntuacion(),
                calificacion.getComentario()
        );
    }

    public void updateDtoToEntity(Calificacion calificacion, CalificacionRequest dto, Recomendacion recomendacion) {
        calificacion.setRecomendacion(recomendacion);
        calificacion.setPuntuacion(dto.puntuacion());
        calificacion.setComentario(dto.comentario());
    }
}