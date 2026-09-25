package com.rutaia.Service.Impl;

import com.rutaia.DTO.Request.UsuarioRequest;
import com.rutaia.DTO.Response.UsuarioResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Mapper.UsuarioMapper;
import com.rutaia.Modelo.Enums.Rol;
import com.rutaia.Modelo.Usuario;
import com.rutaia.Repository.UsuarioRepository;
import com.rutaia.Service.UsuarioService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioMapper usuarioMapper;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UsuarioResponse guardar(UsuarioRequest dto) {
        if (usuarioRepository.findByCorreo(dto.correo()) != null) {
            throw new BuisnessRuleException("El correo ya está registrado");
        }

        Usuario usuario = usuarioMapper.dtoToEntity(dto);
        usuario.setPassword(passwordEncoder.encode(dto.password()));
        return usuarioMapper.entityToDto(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El estudiante con id " + id + " no existe"));
        return usuarioMapper.entityToDto(usuario);
    }

    @Override
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream().map(usuarioMapper::entityToDto).toList();
    }

    @Override
    public List<UsuarioResponse> buscarPorNombreSimilarA(String nombre) {
        return usuarioRepository.findByNombreContaining(nombre).stream().map(usuarioMapper::entityToDto).toList();
    }

    @Override
    public UsuarioResponse buscarPorCorreo(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo);
        if (usuario == null) {
            throw new EntityNotFoundException("El estudiante con correo " + correo + " no existe");
        }
        return usuarioMapper.entityToDto(usuario);
    }

    @Override
    public List<UsuarioResponse> buscarPorRol(String rol) {
        if(!rol.equals("ESTUDIANTE") && !rol.equals("ADMIN")){
            throw new BuisnessRuleException("El rol no existe");
        }

        return usuarioRepository.findByRol(Rol.valueOf(rol)).stream().map(
                usuarioMapper::entityToDto
        ).toList();
    }

    @Override
    public UsuarioResponse actualizar(UsuarioRequest dto, Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El estudiante con id " + id + " no existe"));

        Usuario conMismoCorreo = usuarioRepository.findByCorreo(dto.correo());
        if (conMismoCorreo != null && !conMismoCorreo.getId().equals(id)) {
            throw new BuisnessRuleException("El correo ya está registrado");
        }

        usuarioMapper.updateDtoToEntity(dto, usuario);
        usuario.setPassword(passwordEncoder.encode(dto.password()));
        return usuarioMapper.entityToDto(usuarioRepository.save(usuario));
    }

    @Override
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El estudiante con id " + id + " no existe"));
        usuarioRepository.delete(usuario);
    }
}