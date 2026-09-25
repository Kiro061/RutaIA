# Pruebas de Consultas Obligatorias — RutaIA

Este documento registra la ejecución de las 10 consultas de prueba obligatorias exigidas en el enunciado del proyecto (sección 10), contra el endpoint:

```
POST /api/consultas
Authorization: Bearer <token>
```

Para cada una se indica qué requerimiento valida, el resultado esperado según el diseño del sistema, y espacio para registrar el resultado real obtenido (para completar durante la sustentación o como evidencia en el informe).

| # | Pregunta | Qué valida | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|---|---|
| 1 | Quiero aprender a crear páginas web. | Búsqueda semántica sobre la categoría Desarrollo Web (RF10) | `estado: "Respondida"`, con curso(s) de desarrollo web recomendados | | |
| 2 | Necesito aprender Java para trabajar con Spring Boot. | Búsqueda semántica sobre Programación/Spring Boot (RF10) | `estado: "Respondida"`, con curso(s) de programación/backend recomendados | | |
| 3 | Me interesa analizar datos y construir dashboards. | Búsqueda semántica sobre Análisis de Datos (RF10) | `estado: "Respondida"`, con curso(s) de análisis de datos recomendados | | |
| 4 | Quiero automatizar procesos empresariales. | Búsqueda semántica sobre Automatización (RF10) | `estado: "Respondida"`, con curso(s) de automatización recomendados | | |
| 5 | ¿Qué puedo estudiar para trabajar con inteligencia artificial? | Búsqueda semántica sobre Inteligencia Artificial (RF10) | `estado: "Respondida"`, con curso(s) de IA recomendados | | |
| 6 | Quiero aprender a proteger aplicaciones web. | Cobertura del catálogo en seguridad/ciberseguridad | Depende de si el catálogo tiene un curso afín; si no lo hay, `estado: "Sin resultados"` es el comportamiento correcto, no un error | | |
| 7 | Necesito desplegar aplicaciones usando contenedores. | Cobertura del catálogo en herramientas (Docker) | Depende de si el catálogo tiene un curso afín; igual que el caso anterior, "Sin resultados" también es válido si no existe | | |
| 8 | Quiero aprender cocina italiana. | Umbral de relevancia (RF11) — el sistema no debe inventar una recomendación fuera del dominio académico | `estado: "Sin resultados"`, `respuesta: null` | | |
| 9 | Enviar una pregunta vacía. | Validación de pregunta vacía (RF09, regla de negocio: "las preguntas vacías no deben enviarse a n8n") | HTTP 400 — la petición debe rechazarse en el backend antes de llegar a n8n | | |
| 10 | Realizar una consulta con un estudiante inexistente. | Regla de negocio: "toda consulta debe pertenecer a un estudiante existente" | HTTP 400 con mensaje "El usuario de la consulta no existe" (`BuisnessRuleException`) | | |

## Notas para completar las pruebas

- Antes de ejecutar los casos 1–8, confirma que Qdrant tenga los cursos cargados (`GET http://localhost:6333/collections/cursos` → `points_count` > 0) y que el workflow de Consulta RAG esté activo en n8n.
- Para el caso 9, el body de prueba es `{ "usuarioId": 1, "texto": "" }` (o `"   "` para probar también espacios en blanco).
- Para el caso 10, usa un `usuarioId` que no exista en la tabla `usuario` (por ejemplo `999999`).
- En los casos 6 y 7, si el resultado es "Sin resultados", **no es un error** — es evidencia de que el umbral de similitud (RF11) está funcionando correctamente al no forzar una recomendación fuera de contexto. Vale la pena anotar en la columna "Evidencia" el `score` real que Qdrant devolvió para ese caso (revisando la ejecución en n8n), para justificar el umbral elegido.
- Guarda una captura de pantalla (Postman + la ejecución correspondiente en n8n) por cada fila como evidencia para el informe.
