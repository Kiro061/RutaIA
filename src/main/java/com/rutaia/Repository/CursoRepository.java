package com.rutaia.Repository;

import com.rutaia.Modelo.Curso;
import com.rutaia.Modelo.Enums.Categoria;
import com.rutaia.Modelo.Enums.Nivel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByNombreContaining(String nombre);
    List<Curso> findByDescripcionContaining(String descripcion);
    List<Curso> findByCategoria(Categoria categoria);
    List<Curso> findByNivel(Nivel nivel);
    List<Curso> findByActivo(Boolean activo);

}
