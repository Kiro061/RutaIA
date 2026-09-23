package com.rutaia.Controller;

import com.rutaia.DTO.Request.CursoRequest;
import com.rutaia.DTO.Response.CursoResponse;
import com.rutaia.Service.CursoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
@Validated
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    @PostMapping
    public ResponseEntity<CursoResponse> crearCurso(@Valid @RequestBody CursoRequest dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(cursoService.guardarCurso(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoResponse> actualizarCurso(@PathVariable Long id, @Valid @RequestBody CursoRequest dto){
        return ResponseEntity.status(HttpStatus.OK).body(cursoService.actualizarCurso(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCurso(@PathVariable Long id){
        cursoService.eliminarCurso(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoResponse> buscarCursoId(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(cursoService.buscarCursoId(id));
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<CursoResponse>> buscarCursoNombreSimilar(@PathVariable String nombre){
        return ResponseEntity.status(HttpStatus.OK).body(cursoService.buscarCursoNombreSimilar(nombre));
    }

    @GetMapping("/descripcion/{descripcion}")
    public ResponseEntity<List<CursoResponse>> buscarCursoDescripcionSimilar(@PathVariable String descripcion){
        return ResponseEntity.status(HttpStatus.OK).body(cursoService.buscarCursoDescripcionSimilar(descripcion));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<CursoResponse>> buscarCursoCategoria(@PathVariable String categoria){
        return ResponseEntity.status(HttpStatus.OK).body(cursoService.buscarCursoCategoria(categoria));
    }

    @GetMapping("/nivel/{nivel}")
    public ResponseEntity<List<CursoResponse>> buscarCursoNivel(@PathVariable String nivel){
        return ResponseEntity.status(HttpStatus.OK).body(cursoService.buscarCursoNivel(nivel));
    }

    @GetMapping("/activo/{activo}")
    public ResponseEntity<List<CursoResponse>> buscarCursoActivo(@PathVariable Boolean activo){
        return ResponseEntity.status(HttpStatus.OK).body(cursoService.buscarCursoActivo(activo));
    }
}