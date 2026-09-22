package com.rutaia.Repository;

import com.rutaia.Modelo.Enums.Rol;
import com.rutaia.Modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByNombreContaining(String nombre);
    Usuario findByCorreo(String correo);

    List<Usuario> findByRol(Rol rol);
}
