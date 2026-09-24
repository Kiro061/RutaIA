package com.rutaia.Service.Impl;

import com.rutaia.DTO.Request.RecomendacionRequest;
import com.rutaia.DTO.Response.RecomendacionResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Mapper.ConsultaMapper;
import com.rutaia.Mapper.CursoMapper;
import com.rutaia.Mapper.RecomendacionMapper;
import com.rutaia.Mapper.UsuarioMapper;
import com.rutaia.Modelo.Consulta;
import com.rutaia.Modelo.Curso;
import com.rutaia.Modelo.Recomendacion;
import com.rutaia.Repository.ConsultaRepository;
import com.rutaia.Repository.CursoRepository;
import com.rutaia.Repository.RecomendacionRepository;
import com.rutaia.Service.RecomendacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class RecomendacionServiceImpl implements RecomendacionService {

    private final RecomendacionRepository recomendacionRepository;
    private final ConsultaRepository consultaRepository;
    private final CursoRepository cursoRepository;
    private final RecomendacionMapper recomendacionMapper;
    private final ConsultaMapper consultaMapper;
    private final CursoMapper cursoMapper;
    private final UsuarioMapper usuarioMapper;

    @Override
    @Transactional
    public RecomendacionResponse crear(RecomendacionRequest dto) {
        Consulta consulta = consultaRepository.findById(dto.consultaId())
                .orElseThrow(() -> new BuisnessRuleException("La consulta de la recomendacion no existe"));
        Curso curso = cursoRepository.findById(dto.cursoId())
                .orElseThrow(() -> new BuisnessRuleException("El curso de la recomendacion no existe"));

        Recomendacion recomendacion = recomendacionMapper.dtoToEntity(dto, consulta, curso);
        recomendacion = recomendacionRepository.save(recomendacion);

        return recomendacionMapper.entityToDto(
                recomendacion,
                consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario())),
                cursoMapper.entityToDto(curso)
        );
    }

    @Override
    @Transactional
    public RecomendacionResponse actualizar(Long id, RecomendacionRequest dto) {
        Recomendacion recomendacion = recomendacionRepository.findById(id).orElseThrow(() -> new BuisnessRuleException("La recomendacion no existe"));
        Consulta consulta = consultaRepository.findById(dto.consultaId()).orElseThrow(() -> new BuisnessRuleException("La consulta de la recomendacion no existe"));
        Curso curso = cursoRepository.findById(dto.cursoId())
                .orElseThrow(() -> new BuisnessRuleException("El curso de la recomendacion no existe"));

        recomendacionMapper.updateDtoToEntity(recomendacion, dto, consulta, curso);
        recomendacion = recomendacionRepository.save(recomendacion);

        return recomendacionMapper.entityToDto(
                recomendacion,
                consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario())),
                cursoMapper.entityToDto(curso)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public RecomendacionResponse obtenerPorId(Long id) {
        Recomendacion recomendacion = recomendacionRepository.findById(id).orElseThrow(() -> new BuisnessRuleException("La recomendacion no existe"));
        Consulta consulta = recomendacion.getConsulta();

        return recomendacionMapper.entityToDto(
                recomendacion,
                consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario())),
                cursoMapper.entityToDto(recomendacion.getCurso())
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecomendacionResponse> listarPorConsulta(Long consultaId) {
        Consulta consulta = consultaRepository.findById(consultaId).orElseThrow(() -> new BuisnessRuleException("La consulta no existe"));

        return recomendacionRepository.findByConsulta(consulta).stream().map(
                r -> recomendacionMapper.entityToDto(r, consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario())), cursoMapper.entityToDto(r.getCurso()))
        ).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecomendacionResponse> listarPorCurso(Long cursoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new BuisnessRuleException("El curso no existe"));

        return recomendacionRepository.findByCurso(curso).stream().map(
                r -> recomendacionMapper.entityToDto(r, consultaMapper.entityToDto(r.getConsulta(), usuarioMapper.entityToDto(r.getConsulta().getUsuario())), cursoMapper.entityToDto(r.getCurso()))
        ).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecomendacionResponse> listarTodas() {
        return recomendacionRepository.findAll().stream().map(
                r -> recomendacionMapper.entityToDto(r, consultaMapper.entityToDto(r.getConsulta(), usuarioMapper.entityToDto(r.getConsulta().getUsuario())), cursoMapper.entityToDto(r.getCurso()))
        ).toList();
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Recomendacion recomendacion = recomendacionRepository.findById(id).orElseThrow(() -> new BuisnessRuleException("La recomendacion no existe"));
        recomendacionRepository.delete(recomendacion);
    }
}