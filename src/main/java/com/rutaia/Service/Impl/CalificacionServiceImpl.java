package com.rutaia.Service.Impl;

import com.rutaia.DTO.Request.CalificacionRequest;
import com.rutaia.DTO.Response.CalificacionResponse;
import com.rutaia.DTO.Response.RecomendacionResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Mapper.CalificacionMapper;
import com.rutaia.Mapper.ConsultaMapper;
import com.rutaia.Mapper.CursoMapper;
import com.rutaia.Mapper.RecomendacionMapper;
import com.rutaia.Mapper.UsuarioMapper;
import com.rutaia.Modelo.Calificacion;
import com.rutaia.Modelo.Recomendacion;
import com.rutaia.Repository.CalificacionRepository;
import com.rutaia.Repository.RecomendacionRepository;
import com.rutaia.Service.CalificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CalificacionServiceImpl implements CalificacionService {

    private final CalificacionRepository calificacionRepository;
    private final RecomendacionRepository recomendacionRepository;
    private final CalificacionMapper calificacionMapper;
    private final RecomendacionMapper recomendacionMapper;
    private final ConsultaMapper consultaMapper;
    private final CursoMapper cursoMapper;
    private final UsuarioMapper usuarioMapper;

    private RecomendacionResponse construirRecomendacionResponse(Recomendacion recomendacion) {
        return recomendacionMapper.entityToDto(
                recomendacion,
                consultaMapper.entityToDto(recomendacion.getConsulta(), usuarioMapper.entityToDto(recomendacion.getConsulta().getUsuario())),
                cursoMapper.entityToDto(recomendacion.getCurso())
        );
    }

    @Override
    @Transactional
    public CalificacionResponse crear(CalificacionRequest dto) {
        Recomendacion recomendacion = recomendacionRepository.findById(dto.recomendacionId())
                .orElseThrow(() -> new BuisnessRuleException("La recomendacion de la calificacion no existe"));

        calificacionRepository.findByRecomendacion(recomendacion).ifPresent(c -> {
            throw new BuisnessRuleException("Esta recomendacion ya tiene una calificacion registrada");
        });

        Calificacion calificacion = calificacionMapper.dtoToEntity(dto, recomendacion);
        calificacion = calificacionRepository.save(calificacion);

        return calificacionMapper.entityToDto(calificacion, construirRecomendacionResponse(recomendacion));
    }

    @Override
    @Transactional
    public CalificacionResponse actualizar(Long id, CalificacionRequest dto) {
        Calificacion calificacion = calificacionRepository.findById(id)
                .orElseThrow(() -> new BuisnessRuleException("La calificacion no existe"));
        Recomendacion recomendacion = recomendacionRepository.findById(dto.recomendacionId())
                .orElseThrow(() -> new BuisnessRuleException("La recomendacion de la calificacion no existe"));

        calificacionMapper.updateDtoToEntity(calificacion, dto, recomendacion);
        calificacion = calificacionRepository.save(calificacion);

        return calificacionMapper.entityToDto(calificacion, construirRecomendacionResponse(recomendacion));
    }

    @Override
    @Transactional(readOnly = true)
    public CalificacionResponse obtenerPorId(Long id) {
        Calificacion calificacion = calificacionRepository.findById(id)
                .orElseThrow(() -> new BuisnessRuleException("La calificacion no existe"));

        return calificacionMapper.entityToDto(calificacion, construirRecomendacionResponse(calificacion.getRecomendacion()));
    }

    @Override
    @Transactional(readOnly = true)
    public CalificacionResponse obtenerPorRecomendacion(Long recomendacionId) {
        Recomendacion recomendacion = recomendacionRepository.findById(recomendacionId)
                .orElseThrow(() -> new BuisnessRuleException("La recomendacion no existe"));
        Calificacion calificacion = calificacionRepository.findByRecomendacion(recomendacion)
                .orElseThrow(() -> new BuisnessRuleException("Esta recomendacion no tiene calificacion registrada"));

        return calificacionMapper.entityToDto(calificacion, construirRecomendacionResponse(recomendacion));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalificacionResponse> listarTodas() {
        return calificacionRepository.findAll().stream()
                .map(c -> calificacionMapper.entityToDto(c, construirRecomendacionResponse(c.getRecomendacion())))
                .toList();
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Calificacion calificacion = calificacionRepository.findById(id)
                .orElseThrow(() -> new BuisnessRuleException("La calificacion no existe"));
        calificacionRepository.delete(calificacion);
    }


}