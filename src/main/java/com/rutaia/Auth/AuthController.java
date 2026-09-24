package com.rutaia.Auth;

import com.rutaia.Config.JwtService;
import com.rutaia.DTO.Response.UsuarioResponse;
import com.rutaia.Exception.BuisnessRuleException;
import com.rutaia.Service.UsuarioService;
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
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        UsuarioResponse usuario;
        try {
            usuario = usuarioService.buscarPorCorreo(request.usuario());
        } catch (Exception e) {
            throw new BuisnessRuleException("Credenciales inválidas");
        }
        if(!passwordEncoder.matches(request.contrasenia(), usuario.password())){
            throw new BuisnessRuleException("Credenciales inválidas");
        }


        try{
            String token = jwtService.generateToken(request.usuario());
            return Map.of(
                    "token", token,
                    "id", String.valueOf(usuario.id())
            );
        }catch (Exception e){
            System.out.println(e.getMessage());
        }

        return Map.of("token", "hubo error");
    }
}
