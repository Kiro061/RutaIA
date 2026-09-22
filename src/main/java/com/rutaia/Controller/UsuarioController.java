package com.rutaia.Controller;

import com.rutaia.DTO.Request.UsuarioRequest;
import com.rutaia.DTO.Response.UsuarioResponse;
import com.rutaia.Service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usarios")
@Validated
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponse> crearUsuario(@Valid @RequestBody UsuarioRequest dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.guardar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> actualizarUsuario(@Valid @RequestBody UsuarioRequest dto, @PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.actualizar(dto, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id){
        usuarioService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> buscarTodos(){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarUsuarioId(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.buscarPorId(id));
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<UsuarioResponse>> buscarNombreSimilar(@PathVariable String nombre){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.buscarPorNombreSimilarA(nombre));
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<UsuarioResponse> buscarCorreo(@PathVariable String correo){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.buscarPorCorreo(correo));
    }

    @GetMapping("/Rol/{rol}")
    public ResponseEntity<List<UsuarioResponse>> buscarRol(@PathVariable String rol){
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.buscarPorRol(rol));
    }
}
