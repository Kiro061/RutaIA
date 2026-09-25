# RutaIA

Sistema de recomendación de cursos mediante búsqueda semántica y generación aumentada por recuperación (RAG).

## Integrantes

- Andrés Castellanos
- Arturo Ojeda Tarazona
- Santiago Rueda

## Descripción de la problemática y solución propuesta

La institución educativa ofrece un catálogo de cursos (programación, desarrollo web, bases de datos, IA, automatización, análisis de datos y herramientas tecnológicas), pero los estudiantes lo consultan manualmente y no siempre logran identificar el curso que mejor se ajusta a sus intereses y nivel de conocimiento. Una búsqueda tradicional por palabras clave falla cuando la forma de preguntar no coincide con el nombre o la descripción exacta del curso.

**RutaIA** resuelve esto permitiendo que el estudiante escriba su necesidad en lenguaje natural (por ejemplo, *"quiero aprender a proteger aplicaciones web"*) y recibiendo una recomendación generada por IA, fundamentada exclusivamente en los cursos reales del catálogo — nunca en información inventada por el modelo.

## Tecnologías y arquitectura

| Capa | Tecnología |
|---|---|
| Frontend | HTML, CSS, JavaScript (Fetch API) |
| Backend / API REST | Java + Spring Boot, Spring Data JPA, Jakarta Validation |
| Base de datos relacional | MySQL |
| Base de datos vectorial | Qdrant |
| Orquestación / automatización | n8n |
| Embeddings y LLM | OpenRouter (`openai/text-embedding-3-small`, `openai/gpt-4o-mini`) |

**Flujo de la arquitectura (RAG):**

```
Frontend (HTML/JS)
      │  (único conocido por el frontend)
      ▼
Backend Spring Boot  ──── MySQL (estudiantes, cursos, consultas, historial)
      │  (intermediario obligatorio)
      ▼
n8n (workflow de consulta)
      │
      ├──► OpenRouter — genera el embedding de la pregunta
      ├──► Qdrant — búsqueda semántica por similitud (con umbral)
      └──► OpenRouter — redacta la respuesta usando solo el contexto recuperado
      │
      ▼
Respuesta (texto + estado) devuelta a Spring Boot → Frontend
```

El frontend **nunca** llama directamente a n8n, Qdrant u OpenRouter — toda esa comunicación pasa por el backend, que actúa como intermediario obligatorio.

Un segundo workflow de n8n (carga inicial) sincroniza el catálogo de cursos desde el backend/MySQL hacia Qdrant, generando el embedding de cada curso y guardándolo como punto vectorial con su información como *payload*.

## Requisitos de instalación

- Java 17
- Maven
- MySQL 8
- Docker (para n8n y Qdrant)
- Cuenta y API key de [OpenRouter](https://openrouter.ai)
- Postman (para pruebas de los endpoints y del workflow)

### Variables de entorno / configuración

En `src/main/resources/application.properties` del backend:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rutaia
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false

server.port=8080

# URL del webhook de n8n (workflow de consulta). Cambia el host si n8n corre
# en otro contenedor/servidor o si se usa un túnel de ngrok.
n8n.webhook.consulta-url=http://localhost:5678/webhook/rutaia-consulta
```

En n8n, se necesitan dos credenciales configuradas manualmente (no viajan al importar los workflows):

- **MySQL rutaia** — conexión a la base de datos relacional (usada solo por el workflow de carga inicial).
- **OpenRouter Bearer Auth** (tipo *Bearer Auth*) — con la API key de OpenRouter como token.

## Ejecución de contenedores, backend y frontend

1. **Base de datos:** crear la base `rutaia` en MySQL y ejecutar el script de creación de tablas (`usuario`, `curso`, `fuente`, `consulta`, `recomendacion`, `calificacion`), y cargar al menos 20 cursos activos.

2. **n8n y Qdrant** (vía Docker):
   ```
   docker ps
   ```
   deben aparecer los contenedores `n8n` y `qdrant` corriendo. Si n8n y Qdrant están en el mismo docker-compose, se resuelven entre sí por nombre de contenedor (`http://qdrant:6333`); si no, usar la IP/host correspondiente.

3. **Crear la colección en Qdrant** (una sola vez, o cada vez que se reinicia el contenedor sin volumen persistente):
   ```
   PUT http://localhost:6333/collections/cursos
   Content-Type: application/json

   { "vectors": { "size": 1536, "distance": "Cosine" } }
   ```

4. **Backend:** desde la raíz del proyecto,
   ```
   mvn spring-boot:run
   ```
   o ejecutar la clase principal desde IntelliJ. Queda disponible en `http://localhost:8080`.

5. **Frontend:** archivos estáticos (HTML/CSS/JS) — se pueden abrir directamente o servir con Live Server. Solo necesitan apuntar a la URL base del backend (`http://localhost:8080`), nunca a n8n ni a Qdrant.

6. **(Opcional) Exponer n8n a internet para pruebas remotas:** `ngrok http 5678`, y actualizar `n8n.webhook.consulta-url` con la URL pública generada.

## Importación de workflows

En n8n: menú **☰ → Import from File**, y seleccionar cada uno:

| Workflow | Trigger | Función |
|---|---|---|
| `RutaIA - Carga Inicial a Qdrant` | Manual Trigger | Trae los cursos activos, genera su embedding y los sube a Qdrant (RF05) |
| `RutaIA - Consulta RAG` | Webhook (`/webhook/rutaia-consulta`) | Recibe la pregunta desde el backend, busca en Qdrant y genera la respuesta con el LLM (RF08–RF13) |

Después de importar cada uno:
- Reasignar las credenciales (MySQL y OpenRouter Bearer Auth) en los nodos correspondientes — los IDs de credencial no se conservan al importar.
- **Activar** (toggle verde) el workflow de Consulta RAG, ya que expone un webhook que debe estar disponible en todo momento.
- El workflow de Carga Inicial se ejecuta manualmente (botón "Execute workflow") cada vez que cambie el catálogo de cursos.

## Endpoints principales y ejemplos de uso

Base URL: `http://localhost:8080`

Todos los endpoints, excepto login, requieren `Authorization: Bearer <token>`.

**Login**
```
POST /auth/login
{ "usuario": "correo@ejemplo.com", "contrasenia": "..." }
```
→ `{ "token": "eyJ...", "id": "1" }`

**Hacer una consulta (chatbot)**
```
POST /api/consultas
Authorization: Bearer <token>
{ "usuarioId": 1, "texto": "Quiero aprender a crear páginas web" }
```
→
```json
{
  "id": 12,
  "usuario": { ... },
  "texto": "Quiero aprender a crear páginas web",
  "fechaConsulta": "2026-09-24T19:42:44",
  "respuesta": "Te recomiendo el curso de Desarrollo Web...",
  "estado": "Respondida"
}
```
Si ningún curso supera el umbral de similitud, `estado` es `"Sin resultados"` y `respuesta` es `null`.

**Ver historial de un estudiante**
```
GET /api/consultas/usuario/{usuarioId}
Authorization: Bearer <token>
```

**Catálogo de cursos**
```
GET /api/cursos?activo=true
```

## Errores conocidos

- **El campo `duracion` no existe** en la tabla `curso` ni en la entidad `Curso`, aunque el enunciado del proyecto lo pide para el contexto RAG y las fuentes mostradas al estudiante. Pendiente agregar la columna y regenerar los vectores en Qdrant.
- **El `UsuarioResponse` expone el hash de la contraseña** (`password`) en las respuestas de la API, incluyendo dentro del historial de consultas. Debe eliminarse ese campo del DTO antes de la entrega.
- **Advertencia interstitial de ngrok (plan gratuito):** al exponer n8n con ngrok, la primera petición puede devolver una página HTML de advertencia en vez de JSON. Se soluciona agregando el header `ngrok-skip-browser-warning: true` a las peticiones del backend hacia n8n.
- **Umbral de similitud (`score_threshold`) en Qdrant:** un valor demasiado alto (por ejemplo 0.75) puede filtrar recomendaciones válidas y devolver siempre `"Sin resultados"`. Se recomienda calibrarlo revisando los `score` reales devueltos por Qdrant contra las consultas de prueba del enunciado.
- **El proyecto usa Maven**, mientras que el enunciado especifica Gradle como parte del stack del backend (sección 8.2). Verificar si esto afecta la calificación.
- Si se corre una consulta antes de ejecutar el workflow de carga inicial en una instancia nueva de Qdrant (por ejemplo, tras cambiar de computador), la colección `cursos` estará vacía y todas las consultas devolverán `"Sin resultados"` aunque MySQL sí tenga cursos cargados — recordar que son dos bases de datos independientes.
