package com.rutaia.Auth;

import com.rutaia.Config.JwtService;
import com.rutaia.DTO.Response.UsuarioResponse;
import com.rutaia.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        UsuarioResponse usuario;
        try {
            usuario = usuarioService.buscarPorCorreo(request.usuario());
        } catch (Exception e) {
            throw new RuntimeException("Credenciales inválidas");
        }

        if (!request.contrasenia().equals(usuario.password())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = jwtService.generateToken(usuario.correo());
        return Map.of("token", token);
    }
}