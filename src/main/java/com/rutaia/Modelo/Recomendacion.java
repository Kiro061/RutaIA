package com.rutaia.Modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Recomendacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Consulta consulta;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Curso curso;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Fuente fuente;
    private Double puntajeSimilitud;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String justificacion;

}
