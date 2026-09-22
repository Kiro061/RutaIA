CREATE DATABASE IF NOT EXISTS rutaia

USE rutaia;

CREATE TABLE usuario (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    correo     VARCHAR(150) NOT NULL UNIQUE,  
    password   VARCHAR(255) NOT NULL,         
    rol        ENUM('ESTUDIANTE', 'ADMIN') NOT NULL DEFAULT 'ESTUDIANTE'
);

CREATE TABLE curso (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL UNIQUE,
    categoria   ENUM('PROGRAMACION', 'DESARROLLO_WEB', 'BASES_DE_DATOS',
                     'INTELIGENCIA_ARTIFICIAL', 'AUTOMATIZACION',
                     'ANALISIS_DE_DATOS', 'HERRAMIENTAS') NOT NULL,
    descripcion TEXT         NOT NULL,
    nivel       ENUM('BASICO', 'INTERMEDIO', 'AVANZADO') NOT NULL,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,

    INDEX idx_curso_activo_nivel (activo, nivel)
);

CREATE TABLE consulta (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id     BIGINT   NOT NULL,
    texto          TEXT     NOT NULL,
    fecha_consulta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    -- Índice: historial de un usuario ordenado por fecha
    INDEX idx_consulta_usuario_fecha (usuario_id, fecha_consulta)
);

CREATE TABLE recomendacion (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    consulta_id       BIGINT        NOT NULL,
    curso_id          BIGINT        NOT NULL,
    puntaje_similitud DECIMAL(5,4),
    justificacion     TEXT          NOT NULL,
    FOREIGN KEY (consulta_id) REFERENCES consulta (id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id)    REFERENCES curso (id)

    UNIQUE (consulta_id, curso_id)
);

CREATE TABLE calificacion (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    recomendacion_id BIGINT   NOT NULL UNIQUE,  
    puntuacion       TINYINT  NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario       VARCHAR(500),
    FOREIGN KEY (recomendacion_id) REFERENCES recomendacion (id) ON DELETE CASCADE
);