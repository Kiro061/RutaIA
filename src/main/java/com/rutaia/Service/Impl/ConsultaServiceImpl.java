package com.rutaia.Service.Impl;

import com.rutaia.DTO.Request.ConsultaRequest;
import com.rutaia.DTO.Response.ConsultaResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Mapper.ConsultaMapper;
import com.rutaia.Mapper.UsuarioMapper;
import com.rutaia.Modelo.Consulta;
import com.rutaia.Modelo.Usuario;
import com.rutaia.Repository.ConsultaRepository;
import com.rutaia.Repository.UsuarioRepository;
import com.rutaia.Service.ConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ConsultaServiceImpl implements ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConsultaMapper consultaMapper;
    private final UsuarioMapper usuarioMapper;

    @Override
    public ConsultaResponse crear(ConsultaRequest dto) {
        Usuario usuario = usuarioRepository.findById(dto.usuarioId()).orElseThrow(()-> new BuisnessRuleException("El usuario de la consulta no existe"));
        Consulta consulta = consultaMapper.dtoToEntity(dto, usuario);
        return consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario()));
    }

    @Override
    public ConsultaResponse actualizar(Long id, ConsultaRequest dto) {
        Usuario usuario = usuarioRepository.findById(dto.usuarioId()).orElseThrow(()-> new BuisnessRuleException("El usuario de la consulta no existe"));
        Consulta consulta = consultaRepository.findById(id).orElseThrow(()-> new BuisnessRuleException("La consulta no existe"));
        consultaMapper.UpdateDtoToEntity(consulta, dto, usuario);
        return consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario()));
    }

    @Override
    public ConsultaResponse obtenerPorId(Long id) {
        Consulta consulta = consultaRepository.findById(id).orElseThrow(()-> new BuisnessRuleException("La consulta no existe"));
        return consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario()));
    }

    @Override
    public List<ConsultaResponse> listarPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(()-> new BuisnessRuleException("El usuario no existe"));
        return consultaRepository.findByUsuario(usuario).stream().map(
                e-> consultaMapper.entityToDto(e, usuarioMapper.entityToDto(e.getUsuario()))
        ).toList();
    }

    @Override
    public List<ConsultaResponse> listarTodas() {
        return consultaRepository.findAll().stream().map(
                e-> consultaMapper.entityToDto(e, usuarioMapper.entityToDto(e.getUsuario()))
        ).toList();
    }

    @Override
    public void eliminar(Long id) {
        Consulta consulta = consultaRepository.findById(id).orElseThrow(()-> new BuisnessRuleException("La consulta no existe"));
        consultaRepository.delete(consulta);
    }
}
