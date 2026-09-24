package com.rutaia.Repository;

import com.rutaia.Modelo.Consulta;
import com.rutaia.Modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByUsuario(Usuario usuario);

}
