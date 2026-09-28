# RutaIA — Frontend

Interfaz web (HTML + CSS + JavaScript puro, sin frameworks) que consume la
API REST de Spring Boot del proyecto RutaIA.

## Estructura

```
FrontEnd/
├── index.html
├── README.md
├── css/
│   ├── styles.css     → global: variables, navbar, hero, secciones, botones, auth
│   ├── login.css       → solo lo propio de login (fondo, animación)
│   ├── registro.css     → tarjeta de registro (diseño oscuro independiente)
│   ├── catalogo.css      → grilla de cursos
│   └── consulta.css       → chatbot de consulta (burbujas, historial)
├── js/
│   ├── auth.js         → sesión (token/usuario), guardián de páginas privadas
│   ├── navbar.js         → menú hamburguesa, scroll, link activo, mostrar/ocultar según sesión
│   ├── index.js
│   ├── login.js
│   ├── registro.js
│   ├── catalogo.js
│   └── consulta.js
└── pages/
    ├── login.html
    ├── registro.html
    ├── catalogo.html
    └── consulta.html       → protegida: requiere sesión iniciada
```

## Cómo ejecutarlo

No necesita build. Sirve la carpeta como archivos estáticos (por ejemplo con
la extensión "Live Server" de VS Code o `python3 -m http.server`) y asegúrate
de que el backend de Spring Boot esté corriendo en `http://localhost:8080`
(o ajusta `API_URL` en cada archivo `.js` si tu backend usa otra URL).

## Autenticación y guardián de rutas

- `login.js` guarda `token` y `usuario` en `localStorage` al iniciar sesión.
- `auth.js` expone `estaAutenticado()`, `obtenerToken()`, `obtenerUsuario()`,
  `cerrarSesion()` y `requerirSesion()`.
- `pages/consulta.html` llama a `requerirSesion()` como primer script del
  `<body>`, así que redirige a login antes de mostrar contenido si no hay
  sesión.
- **Importante:** esto es solo para experiencia de usuario. La protección
  real debe hacerla Spring Security validando el JWT en cada endpoint
  protegido — el frontend nunca reemplaza esa validación. `consulta.js`
  también cierra la sesión automáticamente si la API responde `401`.
- `navbar.js` muestra/oculta el enlace "Consulta", el botón de login y el
  bloque de usuario/cerrar sesión según haya o no sesión activa, en todas
  las páginas.

## Contrato de API asumido

| Acción | Método | Ruta | Requiere token |
|---|---|---|---|
| Login | POST | `/auth/login` | No |
| Registro | POST | `/api/usuarios` | No |
| Catálogo | GET | `/api/cursos` | No |
| Enviar consulta | POST | `/api/consultas` | Sí |
| Historial | GET | `/api/consultas` | Sí |
| Calificar | POST | `/api/consultas/{id}/calificacion` | Sí |

Si tu backend usa otras rutas o nombres de campos, ajusta la constante
`API_URL` y las referencias a campos (`nombreCurso`, `justificacion`,
`fuentes`, etc.) en `catalogo.js` y `consulta.js`.

## Pendiente

- Registro: agregar campos de nivel de experiencia (Principiante / Intermedio
  / Avanzado) y área de interés, y validar correos duplicados contra el
  backend.
