package com.rutaia.Mapper;

import com.rutaia.DTO.Request.RecomendacionRequest;
import com.rutaia.DTO.Response.ConsultaResponse;
import com.rutaia.DTO.Response.CursoResponse;
import com.rutaia.DTO.Response.RecomendacionResponse;
import com.rutaia.Modelo.Consulta;
import com.rutaia.Modelo.Curso;
import com.rutaia.Modelo.Recomendacion;
import org.springframework.stereotype.Component;

@Component
public class RecomendacionMapper {

    public Recomendacion dtoToEntity(RecomendacionRequest dto, Consulta consulta, Curso curso) {
        Recomendacion recomendacion = new Recomendacion();
        recomendacion.setConsulta(consulta);
        recomendacion.setCurso(curso);
        recomendacion.setPuntajeSimilitud(dto.puntajeSimilitud());
        recomendacion.setJustificacion(dto.justificacion());
        return recomendacion;
    }

    public RecomendacionResponse entityToDto(Recomendacion recomendacion, ConsultaResponse consultaResponse, CursoResponse cursoResponse) {
        return new RecomendacionResponse(
                recomendacion.getId(),
                consultaResponse,
                cursoResponse,
                recomendacion.getPuntajeSimilitud(),
                recomendacion.getJustificacion()
        );
    }

    public void updateDtoToEntity(Recomendacion recomendacion, RecomendacionRequest dto, Consulta consulta, Curso curso) {
        recomendacion.setConsulta(consulta);
        recomendacion.setCurso(curso);
        recomendacion.setPuntajeSimilitud(dto.puntajeSimilitud());
        recomendacion.setJustificacion(dto.justificacion());
    }
}