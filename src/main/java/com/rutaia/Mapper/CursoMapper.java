package com.rutaia.Mapper;

import com.rutaia.DTO.Request.CursoRequest;
import com.rutaia.DTO.Response.CursoResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Modelo.Curso;
import com.rutaia.Modelo.Enums.Categoria;
import com.rutaia.Modelo.Enums.Nivel;

public class CursoMapper {

    public CursoResponse entityToDto(Curso curso){
        return new CursoResponse(
                curso.getId(),
                curso.getNombre(),
                curso.getDescripcion(),
                String.valueOf(curso.getCategoria()),
                String.valueOf(curso.getNivel()),
                curso.isActivo()
        );
    }

    public Curso dtoToEntity(CursoRequest dto){
        if(dto == null) return null;

        Curso curso = new Curso();
        curso.setNombre(dto.nombre());
        curso.setDescripcion(dto.descripcion());

        try {
            curso.setCategoria(Categoria.valueOf(dto.categoria().toUpperCase()));
        }catch (Exception e){
            throw new BuisnessRuleException("La categoria brindada para el curso es invalida");
        }

        try {
            curso.setNivel(Nivel.valueOf(dto.nivel().toUpperCase()));
        }catch (Exception e){
            throw new BuisnessRuleException("El nivel brindado es invalido");
        }

        return curso;
    }

    public void updateDtoToEntity(Curso curso, CursoRequest dto){
        if(dto == null || curso == null) return;

        curso.setNombre(dto.nombre());
        curso.setDescripcion(dto.descripcion());

        try {
            curso.setCategoria(Categoria.valueOf(dto.categoria().toUpperCase()));
        }catch (Exception e){
            throw new BuisnessRuleException("La categoria brindada para el curso es invalida");
        }

        try {
            curso.setNivel(Nivel.valueOf(dto.nivel().toUpperCase()));
        }catch (Exception e){
            throw new BuisnessRuleException("El nivel brindado es invalido");
        }
    }
}
