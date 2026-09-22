/**
 * ============================================================
 * CONFIGURACIÓN DE LA API — RutaIA
 * ============================================================
 * Este archivo es el ÚNICO lugar donde deberías tocar algo
 * si los endpoints reales de tu equipo (Spring Boot) no
 * coinciden con lo asumido aquí. Todo lo demás en api.js y
 * app.js usa estas rutas, nunca las escribe "a mano".
 *
 * SUPUESTOS DE CONTRATO (ajusta a lo que decida el equipo):
 *
 *  POST   {BASE_URL}/auth/registro
 *         body: { nombreCompleto, correo, contrasena }
 *
 *  POST   {BASE_URL}/auth/login
 *         body: { correo, contrasena }
 *         resp: { token, usuario: { id, nombreCompleto, correo } }
 *
 *  GET    {BASE_URL}/cursos
 *         resp: [{ id, nombre, descripcion, categoria, nivel, duracionHoras }]
 *
 *  POST   {BASE_URL}/consultas          (requiere token)
 *         body: { textoConsulta }
 *         resp: {
 *           id, fecha, textoConsulta,
 *           recomendaciones: [{ cursoId, nombreCurso, justificacion }],
 *           fuentes: [{ id, descripcion, referencia }]
 *         }
 *
 *  GET    {BASE_URL}/consultas          (requiere token, historial propio)
 *         resp: [ ...mismo objeto que arriba, más `calificacion` si existe ]
 *
 *  POST   {BASE_URL}/consultas/{id}/calificacion   (requiere token)
 *         body: { valor, comentario }
 * ============================================================
 */
const RUTAIA_CONFIG = {
  // Cambia esto por la URL real de tu backend Spring Boot.
  BASE_URL: "http://localhost:8080/api",

  ENDPOINTS: {
    registro: "/auth/registro",
    login: "/auth/login",
    cursos: "/cursos",
    consultas: "/consultas",
    calificacion: (consultaId) => `/consultas/${consultaId}/calificacion`,
  },

  // Clave usada en localStorage para persistir la sesión.
  STORAGE_KEY: "rutaia_session",
};
