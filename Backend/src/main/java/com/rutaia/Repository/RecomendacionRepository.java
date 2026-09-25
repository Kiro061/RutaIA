package com.rutaia.Repository;
import com.rutaia.Modelo.Consulta;
import com.rutaia.Modelo.Curso;
import com.rutaia.Modelo.Recomendacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecomendacionRepository extends JpaRepository<Recomendacion, Long> {

    List<Recomendacion> findByConsulta(Consulta consulta);

    List<Recomendacion> findByCurso(Curso curso);
}
