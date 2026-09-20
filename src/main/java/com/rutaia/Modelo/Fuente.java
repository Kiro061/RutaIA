package com.rutaia.Modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Fuente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Curso curso;
    @Column(nullable = false,length = 150)
    private String titulo;
    @Column(nullable = false,columnDefinition = "TEXT")
    private String contenido;
}
