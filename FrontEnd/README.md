# RutaIA — Frontend

Interfaz web estática (HTML + CSS + JavaScript puro, sin frameworks) que consume
únicamente la API REST de Spring Boot del proyecto RutaIA.

## Cómo ejecutarlo

No necesita build ni instalación. Basta con servir la carpeta como archivos estáticos:

```bash
# Opción simple con Python
python3 -m http.server 5500

# o con la extensión "Live Server" de VS Code
```

Luego abre `http://localhost:5500` en el navegador. Asegúrate de que tu API de
Spring Boot esté corriendo (por defecto se asume `http://localhost:8080/api`).

## Estructura

```
rutaia-frontend/
├── index.html         → estructura de las 4 vistas (Acceso, Catálogo, Consulta, Historial)
├── css/styles.css      → estilos, responsive incluido
├── js/config.js        → URL base y rutas de la API (edítalo aquí si cambian)
├── js/api.js            → funciones fetch + async/await hacia el backend
└── js/app.js             → navegación, formularios y manipulación del DOM
```

## Contrato de API asumido

Como no tenía el contrato exacto del backend, `js/config.js` documenta los
endpoints y formatos de petición/respuesta que asumí, siguiendo convenciones
REST estándar en español (coherente con el resto del proyecto):

| Acción | Método | Ruta | Requiere token |
|---|---|---|---|
| Registro | POST | `/auth/registro` | No |
| Login | POST | `/auth/login` | No |
| Catálogo | GET | `/cursos` | No |
| Enviar consulta | POST | `/consultas` | Sí |
| Historial | GET | `/consultas` | Sí |
| Calificar | POST | `/consultas/{id}/calificacion` | Sí |

**Si tu equipo definió rutas o nombres de campos distintos, solo tienes que
editar `RUTAIA_CONFIG` en `js/config.js`** (y, si cambian los nombres de los
campos dentro de las respuestas — por ejemplo `nombreCurso` vs `titulo` —,
ajustar las referencias correspondientes en `app.js`, que están todas
agrupadas en las funciones `renderCursos`, `construirBloqueResultado` y
`cargarHistorial`).

## Autenticación

El token que devuelve `/auth/login` se guarda en `localStorage` (clave
`rutaia_session`) y se envía como `Authorization: Bearer <token>` en cada
petición protegida. Al cerrar sesión se borra.

## Funcionalidades implementadas

- **Registro** e **inicio de sesión** con validación básica y mensajes de error.
- **Catálogo** de cursos con buscador en vivo (filtra por nombre/categoría).
- **Formulario de consulta** en lenguaje natural.
- **Resultado** de la recomendación con su justificación.
- **Fuentes**: bloque que muestra en qué información académica se basó la recomendación.
- **Calificación**: 1 a 5 estrellas + comentario opcional, enviada a la API.
- **Historial**: lista expandible de consultas anteriores, cada una con su
  resultado, fuentes y calificación (o el formulario para calificarla si aún
  no se hizo).
- Diseño **adaptable a móvil**: la navegación pasa de barra lateral a franja
  horizontal por debajo de 860px de ancho.
