package com.rutaia.Service.Impl;

import com.rutaia.DTO.Request.CursoRequest;
import com.rutaia.DTO.Response.CursoResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Mapper.CursoMapper;
import com.rutaia.Modelo.Curso;
import com.rutaia.Modelo.Enums.Categoria;
import com.rutaia.Modelo.Enums.Nivel;
import com.rutaia.Repository.CursoReporitory;
import com.rutaia.Service.CursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoService {

    private final CursoMapper cursoMapper;
    private final CursoReporitory cursoReporitory;

    @Override
    public CursoResponse guardarCurso(CursoRequest dto) {
        Curso curso = cursoMapper.dtoToEntity(dto);
        return cursoMapper.entityToDto(cursoReporitory.save(curso));
    }

    @Override
    public CursoResponse actualizarCurso(Long id, CursoRequest dto) {
        Curso curso = cursoReporitory.findById(id).orElseThrow(()-> new BuisnessRuleException("El curso a actualizar no existe"));
        cursoMapper.updateDtoToEntity(curso, dto);
        return cursoMapper.entityToDto(cursoReporitory.save(curso));
    }

    @Override
    public void eliminarCurso(Long id) {
        Curso curso = cursoReporitory.findById(id).orElseThrow(()-> new BuisnessRuleException("El curso a eliminar no existe"));
        cursoReporitory.delete(curso);
    }

    @Override
    public CursoResponse buscarCursoId(Long id) {
        Curso curso = cursoReporitory.findById(id).orElseThrow(()-> new BuisnessRuleException("El curso no existe"));
        return cursoMapper.entityToDto(curso);
    }

    @Override
    public List<CursoResponse> listarTodos() {
        return cursoReporitory.findAll().stream().map(cursoMapper::entityToDto).toList();
    }

    @Override
    public List<CursoResponse> buscarCursoNombreSimilar(String nombre) {
        return cursoReporitory.findByNombreContaining(nombre).stream().map(
                cursoMapper::entityToDto
        ).toList();
    }

    @Override
    public List<CursoResponse> buscarCursoDescripcionSimilar(String descripcion) {
        return cursoReporitory.findByDescripcionContaining(descripcion).stream().map(
                cursoMapper::entityToDto
        ).toList();
    }

    @Override
    public List<CursoResponse> buscarCursoCategoria(String categoria) {
        try{
            return cursoReporitory.findByCategoria(Categoria.valueOf(categoria)).stream().map(
                    cursoMapper::entityToDto
            ).toList();
        }catch (Exception e){
            throw new BuisnessRuleException("La categoria de cursos a buscar no existe");
        }
    }

    @Override
    public List<CursoResponse> buscarCursoNivel(String nivel) {
        try{
            return cursoReporitory.findByNivel(Nivel.valueOf(nivel)).stream().map(
                    cursoMapper::entityToDto
            ).toList();
        }catch (Exception e){
            throw new BuisnessRuleException("El nivel de cursos a buscar no existe");
        }
    }

    @Override
    public List<CursoResponse> buscarCursoActivo(Boolean activo) {
        return cursoReporitory.findByActivo(activo).stream().map(
                cursoMapper::entityToDto
        ).toList();
    }
}
