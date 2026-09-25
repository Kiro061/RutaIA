package com.rutaia.Auth;

import com.rutaia.Config.JwtService;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Modelo.Usuario;
import com.rutaia.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.usuario());

        if (usuario == null) {
            throw new BuisnessRuleException("Credenciales inválidas");
        }

        if (!passwordEncoder.matches(request.contrasenia(), usuario.getPassword())) {
            throw new BuisnessRuleException("Credenciales inválidas");
        }

        try {
            String token = jwtService.generateToken(request.usuario());
            return Map.of(
                    "token", token,
                    "id", String.valueOf(usuario.getId())
            );
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return Map.of("token", "hubo error");
    }
}