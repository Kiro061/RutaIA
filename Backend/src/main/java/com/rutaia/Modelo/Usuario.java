package com.rutaia.Modelo;

import com.rutaia.Modelo.Enums.NivelExperiencia;
import com.rutaia.Modelo.Enums.Rol;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String correo;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_experiencia", length = 20)
    private NivelExperiencia nivelExperiencia;

    @Column(name = "area_interes", length = 100)
    private String areaInteres;
}