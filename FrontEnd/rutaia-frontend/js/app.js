/**
 * ============================================================
 * APP — RutaIA
 * ============================================================
 * Manipulación del DOM y orquestación de vistas. Usa RutaIAApi
 * para toda comunicación con el backend.
 * ============================================================
 */
(() => {
  "use strict";

  // ---------- Utilidades generales ----------

  function $(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function $all(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  let toastTimer = null;
  function showToast(mensaje, { error = false } = {}) {
    const toast = $("#toast");
    toast.textContent = mensaje;
    toast.classList.toggle("is-error", error);
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
  }

  function formatFecha(valor) {
    if (!valor) return "";
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return String(valor);
    return fecha.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ---------- Navegación entre vistas ("paradas de la ruta") ----------

  const VIEWS = ["auth", "catalogo", "consulta", "historial"];
  const PROTECTED_VIEWS = ["consulta", "historial"];

  function goTo(viewName) {
    if (PROTECTED_VIEWS.includes(viewName) && !RutaIAApi.getSession()) {
      showToast("Inicia sesión para acceder a esa sección.", { error: true });
      viewName = "auth";
    }

    VIEWS.forEach((v) => {
      $(`#view-${v}`).hidden = v !== viewName;
    });

    $all(".route__stop").forEach((stop) => {
      stop.classList.toggle("is-active", stop.dataset.view === viewName);
    });

    if (viewName === "catalogo") cargarCatalogo();
    if (viewName === "historial") cargarHistorial();

    window.location.hash = viewName;
  }

  function initNavegacion() {
    $all(".route__stop-btn").forEach((btn) => {
      btn.addEventListener("click", () => goTo(btn.dataset.target));
    });

    const inicial = window.location.hash.replace("#", "");
    goTo(VIEWS.includes(inicial) ? inicial : "auth");
  }

  // ---------- Sesión (registro / login / logout) ----------

  function refrescarSessionBox() {
    const session = RutaIAApi.getSession();
    const nombreEl = $("#sessionName");
    const logoutBtn = $("#logoutBtn");

    if (session?.usuario) {
      nombreEl.textContent = session.usuario.nombreCompleto || session.usuario.correo;
      logoutBtn.hidden = false;
    } else {
      nombreEl.textContent = "Sin sesión";
      logoutBtn.hidden = true;
    }
  }

  function initTabs() {
    $all(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $all(".tab").forEach((t) => {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        $all("[data-panel]").forEach((panel) => {
          panel.hidden = panel.dataset.panel !== tab.dataset.tab;
        });
      });
    });
  }

  function mostrarErrorFormulario(id, error) {
    const el = $(`#${id}`);
    el.textContent = error?.message || "Ocurrió un error inesperado.";
    el.hidden = false;
  }

  function ocultarErrorFormulario(id) {
    $(`#${id}`).hidden = true;
  }

  function initAuth() {
    const loginForm = $("#loginForm");
    const registroForm = $("#registroForm");

    loginForm.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      ocultarErrorFormulario("loginError");
      const boton = loginForm.querySelector("button[type=submit]");
      boton.disabled = true;

      try {
        const datos = {
          correo: $("#loginCorreo").value.trim(),
          contrasena: $("#loginContrasena").value,
        };
        const respuesta = await RutaIAApi.login(datos);
        RutaIAApi.saveSession(respuesta);
        refrescarSessionBox();
        showToast(`Bienvenido, ${respuesta?.usuario?.nombreCompleto || "estudiante"}.`);
        loginForm.reset();
        goTo("catalogo");
      } catch (error) {
        mostrarErrorFormulario("loginError", error);
      } finally {
        boton.disabled = false;
      }
    });

    registroForm.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      ocultarErrorFormulario("regError");
      const boton = registroForm.querySelector("button[type=submit]");
      boton.disabled = true;

      try {
        const datos = {
          nombreCompleto: $("#regNombre").value.trim(),
          correo: $("#regCorreo").value.trim(),
          contrasena: $("#regContrasena").value,
        };
        await RutaIAApi.registro(datos);
        showToast("Cuenta creada. Ahora inicia sesión.");
        registroForm.reset();
        $('.tab[data-tab="login"]').click();
      } catch (error) {
        mostrarErrorFormulario("regError", error);
      } finally {
        boton.disabled = false;
      }
    });

    $("#logoutBtn").addEventListener("click", () => {
      RutaIAApi.clearSession();
      refrescarSessionBox();
      showToast("Sesión cerrada.");
      goTo("auth");
    });
  }

  // ---------- Catálogo ----------

  let cursosCache = [];

  function renderCursos(cursos) {
    const grid = $("#catalogoGrid");
    grid.innerHTML = "";

    if (!cursos.length) {
      grid.innerHTML = '<p class="empty-state">No hay cursos que coincidan con tu búsqueda.</p>';
      return;
    }

    const tpl = $("#tplCursoCard");
    cursos.forEach((curso) => {
      const nodo = tpl.content.cloneNode(true);
      $(".course-card__categoria", nodo).textContent = curso.categoria || "General";
      $(".course-card__nombre", nodo).textContent = curso.nombre || "Curso sin nombre";
      $(".course-card__descripcion", nodo).textContent = curso.descripcion || "";
      $(".course-card__nivel", nodo).textContent = curso.nivel || "";
      $(".course-card__duracion", nodo).textContent = curso.duracionHoras
        ? `${curso.duracionHoras} h`
        : "";
      grid.appendChild(nodo);
    });
  }

  async function cargarCatalogo() {
    const grid = $("#catalogoGrid");
    grid.innerHTML = '<p class="empty-state">Cargando catálogo…</p>';
    try {
      cursosCache = (await RutaIAApi.obtenerCursos()) || [];
      renderCursos(cursosCache);
    } catch (error) {
      grid.innerHTML = `<p class="empty-state">${error.message}</p>`;
    }
  }

  function initCatalogo() {
    $("#catalogoRefrescar").addEventListener("click", cargarCatalogo);

    $("#catalogoBuscar").addEventListener("input", (evento) => {
      const termino = evento.target.value.trim().toLowerCase();
      if (!termino) return renderCursos(cursosCache);
      renderCursos(
        cursosCache.filter(
          (c) =>
            c.nombre?.toLowerCase().includes(termino) ||
            c.categoria?.toLowerCase().includes(termino)
        )
      );
    });
  }

  // ---------- Consulta, resultado, fuentes y calificación ----------

  function construirBloqueResultado(consulta, { permitirCalificar = true } = {}) {
    const contenedor = document.createElement("div");
    contenedor.className = "result";

    const recomendaciones = consulta.recomendaciones || [];
    recomendaciones.forEach((rec) => {
      const bloque = document.createElement("div");
      bloque.className = "card result__recomendacion";
      bloque.innerHTML = `
        <h3 class="result__curso-nombre">${rec.nombreCurso || "Curso recomendado"}</h3>
        <p class="result__justificacion">${rec.justificacion || ""}</p>
      `;
      contenedor.appendChild(bloque);
    });

    if (!recomendaciones.length) {
      const vacio = document.createElement("p");
      vacio.className = "empty-state";
      vacio.textContent = "La API no devolvió recomendaciones para esta consulta.";
      contenedor.appendChild(vacio);
    }

    const fuentes = consulta.fuentes || [];
    if (fuentes.length) {
      const bloqueFuentes = document.createElement("div");
      bloqueFuentes.className = "card fuentes";
      bloqueFuentes.innerHTML = "<h3>Fuentes de la recomendación</h3>";
      const lista = document.createElement("ul");
      lista.className = "fuentes__lista";
      fuentes.forEach((fuente) => {
        const item = document.createElement("li");
        item.className = "fuentes__item";
        item.innerHTML = `
          ${fuente.descripcion || ""}
          ${fuente.referencia ? `<small>${fuente.referencia}</small>` : ""}
        `;
        lista.appendChild(item);
      });
      bloqueFuentes.appendChild(lista);
      contenedor.appendChild(bloqueFuentes);
    }

    if (permitirCalificar) {
      contenedor.appendChild(construirBloqueCalificacion(consulta));
    }

    return contenedor;
  }

  function construirBloqueCalificacion(consulta) {
    const bloque = document.createElement("div");
    bloque.className = "card calificacion";

    const yaCalificada = Boolean(consulta.calificacion);

    if (yaCalificada) {
      bloque.innerHTML = `
        <h3>Tu calificación</h3>
        <p class="calificacion__enviado">
          Calificaste esta ruta con ${consulta.calificacion.valor} de 5.
          ${consulta.calificacion.comentario ? `— "${consulta.calificacion.comentario}"` : ""}
        </p>
      `;
      return bloque;
    }

    bloque.innerHTML = `
      <h3>¿Qué tan útil fue esta recomendación?</h3>
      <div class="calificacion__estrellas" role="radiogroup" aria-label="Calificación de 1 a 5"></div>
      <textarea class="calificacion__comentario" rows="2" placeholder="Comentario opcional…"></textarea>
      <button type="button" class="btn btn--primary calificacion__enviar">Enviar calificación</button>
    `;

    const contenedorEstrellas = $(".calificacion__estrellas", bloque);
    let valorSeleccionado = 0;

    for (let i = 1; i <= 5; i++) {
      const estrella = document.createElement("button");
      estrella.type = "button";
      estrella.className = "estrella";
      estrella.textContent = "★";
      estrella.dataset.valor = String(i);
      estrella.addEventListener("click", () => {
        valorSeleccionado = i;
        $all(".estrella", contenedorEstrellas).forEach((el) => {
          el.classList.toggle("is-selected", Number(el.dataset.valor) <= i);
        });
      });
      contenedorEstrellas.appendChild(estrella);
    }

    $(".calificacion__enviar", bloque).addEventListener("click", async (evento) => {
      if (!valorSeleccionado) {
        showToast("Selecciona una calificación de 1 a 5 estrellas.", { error: true });
        return;
      }
      const boton = evento.target;
      boton.disabled = true;
      try {
        const comentario = $(".calificacion__comentario", bloque).value.trim();
        await RutaIAApi.calificarConsulta(consulta.id, valorSeleccionado, comentario);
        showToast("Gracias por calificar tu ruta.");
        bloque.innerHTML = `
          <h3>Tu calificación</h3>
          <p class="calificacion__enviado">Calificaste esta ruta con ${valorSeleccionado} de 5.</p>
        `;
      } catch (error) {
        showToast(error.message, { error: true });
        boton.disabled = false;
      }
    });

    return bloque;
  }

  function initConsulta() {
    const form = $("#consultaForm");
    const resultBox = $("#resultBox");
    const boton = $("#consultaSubmitBtn");

    form.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      ocultarErrorFormulario("consultaError");
      const texto = $("#consultaTexto").value.trim();
      if (!texto) return;

      boton.disabled = true;
      boton.textContent = "Buscando…";
      resultBox.hidden = true;

      try {
        const consulta = await RutaIAApi.enviarConsulta(texto);
        resultBox.innerHTML = "";
        resultBox.appendChild(construirBloqueResultado(consulta));
        resultBox.hidden = false;
      } catch (error) {
        mostrarErrorFormulario("consultaError", error);
      } finally {
        boton.disabled = false;
        boton.textContent = "Buscar mi ruta";
      }
    });
  }

  // ---------- Historial ----------

  async function cargarHistorial() {
    const contenedor = $("#historialList");
    contenedor.innerHTML = '<p class="empty-state">Cargando historial…</p>';

    try {
      const consultas = (await RutaIAApi.obtenerHistorial()) || [];
      contenedor.innerHTML = "";

      if (!consultas.length) {
        contenedor.innerHTML = '<p class="empty-state">Aún no has hecho ninguna consulta.</p>';
        return;
      }

      const tpl = $("#tplHistorialItem");
      consultas
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .forEach((consulta) => {
          const nodo = tpl.content.cloneNode(true);
          const item = $(".historial-item", nodo);
          $(".historial-item__fecha", nodo).textContent = formatFecha(consulta.fecha);
          $(".historial-item__texto", nodo).textContent = consulta.textoConsulta || "";

          const header = $(".historial-item__header", nodo);
          const body = $(".historial-item__body", nodo);
          let renderizado = false;

          header.addEventListener("click", () => {
            const abrir = body.hidden;
            body.hidden = !abrir;
            item.classList.toggle("is-open", abrir);
            if (abrir && !renderizado) {
              body.appendChild(construirBloqueResultado(consulta));
              renderizado = true;
            }
          });

          contenedor.appendChild(nodo);
        });
    } catch (error) {
      contenedor.innerHTML = `<p class="empty-state">${error.message}</p>`;
    }
  }

  // ---------- Arranque ----------

  document.addEventListener("DOMContentLoaded", () => {
    initNavegacion();
    initTabs();
    initAuth();
    initCatalogo();
    initConsulta();
    refrescarSessionBox();
  });
})();
