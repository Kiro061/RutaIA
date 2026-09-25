package com.rutaia.Controller;

import com.rutaia.DTO.Request.RecomendacionRequest;
import com.rutaia.DTO.Response.RecomendacionResponse;
import com.rutaia.Service.RecomendacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recomendaciones")
@RequiredArgsConstructor
public class RecomendacionController {

    private final RecomendacionService recomendacionService;

    @PostMapping
    public ResponseEntity<RecomendacionResponse> crear(@Valid @RequestBody RecomendacionRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recomendacionService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecomendacionResponse> actualizar(@Valid @RequestBody RecomendacionRequest dto, @PathVariable Long id) {
        return ResponseEntity.ok(recomendacionService.actualizar(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecomendacionResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(recomendacionService.obtenerPorId(id));
    }

    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity<List<RecomendacionResponse>> listarPorConsulta(@PathVariable Long consultaId) {
        return ResponseEntity.ok(recomendacionService.listarPorConsulta(consultaId));
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<RecomendacionResponse>> listarPorCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(recomendacionService.listarPorCurso(cursoId));
    }

    @GetMapping
    public ResponseEntity<List<RecomendacionResponse>> listarTodas() {
        return ResponseEntity.ok(recomendacionService.listarTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        recomendacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}