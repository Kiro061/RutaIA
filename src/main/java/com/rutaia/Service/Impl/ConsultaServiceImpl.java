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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import org.slf4j.Logger;                              // <-- Para el log
import org.slf4j.LoggerFactory;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ConsultaServiceImpl implements ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConsultaMapper consultaMapper;
    private final UsuarioMapper usuarioMapper;
    private final RestClient restClient;

    private static final Logger log = LoggerFactory.getLogger(ConsultaService.class);

    @Value("${n8n.webhook.consulta-url}")
    private String n8nWebhookUrl;

    @Override
    public ConsultaResponse crear(ConsultaRequest dto) {
        Usuario usuario = usuarioRepository.findById(dto.usuarioId()).orElseThrow(()-> new BuisnessRuleException("El usuario de la consulta no existe"));
        Consulta consulta = consultaMapper.dtoToEntity(dto, usuario);

        consultaRepository.save(consulta);
        enviarAN8n(consulta);

        return consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario()));
    }

    private void enviarAN8n(Consulta consulta) {
        try {
            restClient.post()
                    .uri(n8nWebhookUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(consulta)
                    .retrieve()
                    .toBodilessEntity(); // Ignora la respuesta si n8n responde 200 OK / 204 No Content
        } catch (Exception e) {
            // Manejo de error o log según la importancia del envío
            log.error("Error al enviar la consulta a n8n: {}", e.getMessage());
        }
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
