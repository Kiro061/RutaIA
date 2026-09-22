package com.rutaia.Mapper;

import com.rutaia.DTO.Request.UsuarioRequest;
import com.rutaia.DTO.Response.UsuarioResponse;
import com.rutaia.Modelo.Enums.Rol;
import com.rutaia.Modelo.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {
    public UsuarioResponse entityToDto(Usuario usuario){
        if(usuario == null) return null;

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getPassword(),
                String.valueOf(usuario.getRol())
        );

    }

    public Usuario dtoToEntity(UsuarioRequest dto){
        if(dto == null) return null;

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.nombre());
        usuario.setCorreo(dto.correo());
        usuario.setPassword(dto.password());

        if(dto.rol() != null){
            usuario.setRol(Rol.ADMIN);
        }else{
            usuario.setRol(Rol.ESTUDIANTE);
        }

        return usuario;
    }

    public void updateDtoToEntity(UsuarioRequest dto, Usuario usuario){
        if (dto == null || usuario == null) return;

        usuario.setNombre(dto.nombre());
        usuario.setCorreo(dto.correo());
        usuario.setPassword(dto.password());

    }
}
