package com.rutaia.Controller;

import com.rutaia.DTO.Request.ConsultaRequest;
import com.rutaia.DTO.Response.ConsultaResponse;
import com.rutaia.Service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @PostMapping
    public ResponseEntity<ConsultaResponse> crear(@Valid @RequestBody ConsultaRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consultaService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultaResponse> actualizar(@Valid @RequestBody ConsultaRequest dto, @PathVariable Long id){
        return ResponseEntity.ok(consultaService.actualizar(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.obtenerPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ConsultaResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(consultaService.listarPorUsuario(usuarioId));
    }

    @GetMapping
    public ResponseEntity<List<ConsultaResponse>> listarTodas() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        consultaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}