/**
 * ============================================================
 * CAPA DE API — RutaIA
 * ============================================================
 * Envuelve fetch() para hablar exclusivamente con la API de
 * Spring Boot. No hay lógica de interfaz aquí: solo peticiones,
 * cabeceras y manejo de errores HTTP.
 * ============================================================
 */
const RutaIAApi = (() => {
  /**
   * Lee la sesión guardada (token + usuario) desde localStorage.
   */
  function getSession() {
    const raw = localStorage.getItem(RUTAIA_CONFIG.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveSession(session) {
    localStorage.setItem(RUTAIA_CONFIG.STORAGE_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(RUTAIA_CONFIG.STORAGE_KEY);
  }

  /**
   * Petición genérica a la API. Añade el token de sesión si existe
   * y convierte errores HTTP en excepciones con mensaje legible.
   */
  async function request(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
      const session = getSession();
      if (!session?.token) {
        throw new Error("Debes iniciar sesión para continuar.");
      }
      headers["Authorization"] = `Bearer ${session.token}`;
    }

    let response;
    try {
      response = await fetch(`${RUTAIA_CONFIG.BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (networkError) {
      throw new Error(
        "No se pudo contactar la API. Verifica que el backend de Spring Boot esté corriendo y accesible."
      );
    }

    if (response.status === 204) return null;

    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const mensaje =
        (data && (data.mensaje || data.message || data.error)) ||
        `Error ${response.status} al comunicarse con la API.`;
      throw new Error(mensaje);
    }

    return data;
  }

  return {
    getSession,
    saveSession,
    clearSession,

    registro(datos) {
      return request(RUTAIA_CONFIG.ENDPOINTS.registro, {
        method: "POST",
        body: datos,
      });
    },

    login(credenciales) {
      return request(RUTAIA_CONFIG.ENDPOINTS.login, {
        method: "POST",
        body: credenciales,
      });
    },

    obtenerCursos() {
      return request(RUTAIA_CONFIG.ENDPOINTS.cursos, { method: "GET" });
    },

    enviarConsulta(textoConsulta) {
      return request(RUTAIA_CONFIG.ENDPOINTS.consultas, {
        method: "POST",
        body: { textoConsulta },
        auth: true,
      });
    },

    obtenerHistorial() {
      return request(RUTAIA_CONFIG.ENDPOINTS.consultas, {
        method: "GET",
        auth: true,
      });
    },

    calificarConsulta(consultaId, valor, comentario) {
      return request(RUTAIA_CONFIG.ENDPOINTS.calificacion(consultaId), {
        method: "POST",
        body: { valor, comentario },
        auth: true,
      });
    },
  };
})();
