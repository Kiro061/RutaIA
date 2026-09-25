package com.rutaia.Controller;

import com.rutaia.DTO.Request.CalificacionRequest;
import com.rutaia.DTO.Response.CalificacionResponse;
import com.rutaia.Service.CalificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calificaciones")
@RequiredArgsConstructor
public class CalificacionController {

    private final CalificacionService calificacionService;

    @PostMapping
    public ResponseEntity<CalificacionResponse> crear(@Valid @RequestBody CalificacionRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(calificacionService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalificacionResponse> actualizar(@Valid @RequestBody CalificacionRequest dto, @PathVariable Long id) {
        return ResponseEntity.ok(calificacionService.actualizar(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalificacionResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(calificacionService.obtenerPorId(id));
    }

    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity<CalificacionResponse> obtenerPorConsulta(@PathVariable Long consultaId) {
        return ResponseEntity.ok(calificacionService.obtenerPorConsulta(consultaId));
    }

    @GetMapping
    public ResponseEntity<List<CalificacionResponse>> listarTodas() {
        return ResponseEntity.ok(calificacionService.listarTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        calificacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}