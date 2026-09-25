package com.rutaia.Repository;

import com.rutaia.Modelo.Calificacion;
import com.rutaia.Modelo.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {
    Optional<Calificacion> findByConsulta(Consulta consulta);
}