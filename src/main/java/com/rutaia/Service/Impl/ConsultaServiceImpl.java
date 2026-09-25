package com.rutaia.Service.Impl;

import com.rutaia.DTO.Response.N8nRespuestaDTO;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
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

        // Llamada SÍNCRONA: esperamos la respuesta del chatbot antes de responderle al frontend
        N8nRespuestaDTO n8nRespuesta = enviarAN8n(consulta);

        return consultaMapper.entityToDto(consulta, usuarioMapper.entityToDto(consulta.getUsuario()), n8nRespuesta);
    }

    private N8nRespuestaDTO enviarAN8n(Consulta consulta) {
        // El workflow de n8n espera exactamente estos dos campos: consulta_id y pregunta.
        // No se le manda el objeto Consulta completo para no exponer el usuario (con su password) innecesariamente.
        Map<String, Object> body = new HashMap<>();
        body.put("consulta_id", consulta.getId());
        body.put("pregunta", consulta.getTexto());

        try {
            return restClient.post()
                    .uri(n8nWebhookUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(N8nRespuestaDTO.class);
        } catch (Exception e) {
            log.error("Error al comunicarse con el motor de recomendaciones (n8n): {}", e.getMessage());
            return new N8nRespuestaDTO(null, "Error");
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