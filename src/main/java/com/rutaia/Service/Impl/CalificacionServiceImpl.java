package com.rutaia.Service.Impl;

import com.rutaia.DTO.Request.CalificacionRequest;
import com.rutaia.DTO.Response.CalificacionResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Mapper.CalificacionMapper;
import com.rutaia.Modelo.Calificacion;
import com.rutaia.Modelo.Consulta;
import com.rutaia.Repository.CalificacionRepository;
import com.rutaia.Repository.ConsultaRepository;
import com.rutaia.Service.CalificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CalificacionServiceImpl implements CalificacionService {

    private final CalificacionRepository calificacionRepository;
    private final ConsultaRepository consultaRepository;
    private final CalificacionMapper calificacionMapper;

    @Override
    @Transactional
    public CalificacionResponse crear(CalificacionRequest dto) {
        Consulta consulta = consultaRepository.findById(dto.consultaId())
                .orElseThrow(() -> new BuisnessRuleException("La consulta de la calificacion no existe"));

        calificacionRepository.findByConsulta(consulta).ifPresent(c -> {
            throw new BuisnessRuleException("Esta consulta ya tiene una calificacion registrada");
        });

        Calificacion calificacion = calificacionMapper.dtoToEntity(dto, consulta);
        calificacion = calificacionRepository.save(calificacion);
        return calificacionMapper.entityToDto(calificacion);
    }

    @Override
    @Transactional
    public CalificacionResponse actualizar(Long id, CalificacionRequest dto) {
        Calificacion calificacion = calificacionRepository.findById(id)
                .orElseThrow(() -> new BuisnessRuleException("La calificacion no existe"));

        calificacionMapper.updateDtoToEntity(calificacion, dto);
        calificacion = calificacionRepository.save(calificacion);
        return calificacionMapper.entityToDto(calificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public CalificacionResponse obtenerPorId(Long id) {
        Calificacion calificacion = calificacionRepository.findById(id)
                .orElseThrow(() -> new BuisnessRuleException("La calificacion no existe"));
        return calificacionMapper.entityToDto(calificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public CalificacionResponse obtenerPorConsulta(Long consultaId) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new BuisnessRuleException("La consulta no existe"));

        Calificacion calificacion = calificacionRepository.findByConsulta(consulta)
                .orElseThrow(() -> new BuisnessRuleException("Esta consulta no tiene calificacion registrada"));

        return calificacionMapper.entityToDto(calificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalificacionResponse> listarTodas() {
        return calificacionRepository.findAll().stream()
                .map(calificacionMapper::entityToDto)
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