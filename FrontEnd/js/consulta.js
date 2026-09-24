/* =========================================
   RUTAIA - CHATBOT DE CONSULTA
   (mismo patrón que el ejemplo de clase:
   tabs, burbujas, tarjetas sugeridas)
========================================= */

const API_URL = "http://localhost:8080";

/* --- Tabs --- */

const tabConsultar = document.getElementById("tabConsultar");
const tabHistorial = document.getElementById("tabHistorial");
const vistaConsultar = document.getElementById("vistaConsultar");
const vistaHistorial = document.getElementById("vistaHistorial");

let historialCargado = false;

tabConsultar.addEventListener("click", () => {
    tabConsultar.classList.add("active");
    tabHistorial.classList.remove("active");
    vistaConsultar.hidden = false;
    vistaHistorial.hidden = true;
});

tabHistorial.addEventListener("click", () => {
    tabHistorial.classList.add("active");
    tabConsultar.classList.remove("active");
    vistaHistorial.hidden = false;
    vistaConsultar.hidden = true;
    if (!historialCargado) cargarHistorial();
});

/* --- Chat --- */

const mensajesEl = document.getElementById("mensajes");
const formConsulta = document.getElementById("formConsulta");
const inputConsulta = document.getElementById("inputConsulta");

function manejarNoAutorizado(respuesta) {
    if (respuesta.status === 401) {
        cerrarSesion();
        return true;
    }
    return false;
}

function agregarMensaje(tipo, texto) {
    const div = document.createElement("div");
    div.className = "msg " + tipo;

    const burbuja = document.createElement("div");
    burbuja.className = "burbuja";
    burbuja.textContent = texto;
    div.appendChild(burbuja);

    mensajesEl.appendChild(div);
    mensajesEl.scrollTop = mensajesEl.scrollHeight;
    return div;
}

function agregarRespuestaBot(consulta) {
    const div = document.createElement("div");
    div.className = "msg bot";

    const burbuja = document.createElement("div");
    burbuja.className = "burbuja";
    burbuja.textContent = "Esto es lo que encontré para ti:";
    div.appendChild(burbuja);

    const recomendaciones = consulta.recomendaciones || [];
    if (recomendaciones.length) {
        const cont = document.createElement("div");
        cont.className = "sugeridos";
        recomendaciones.forEach((rec) => {
            const item = document.createElement("div");
            item.className = "sugerido";
            item.innerHTML = `<strong>${rec.nombreCurso || "Curso recomendado"}</strong><br>${rec.justificacion || ""}`;
            cont.appendChild(item);
        });
        div.appendChild(cont);
    } else {
        burbuja.textContent = "No encontré una recomendación para esta consulta.";
    }

    const fuentes = consulta.fuentes || [];
    if (fuentes.length) {
        const fcont = document.createElement("div");
        fcont.className = "fuentes";
        fcont.innerHTML = '<span class="fuentes-titulo">Fuentes</span>';
        fuentes.forEach((f) => {
            const item = document.createElement("div");
            item.className = "fuente";
            item.textContent = f.descripcion || "";
            fcont.appendChild(item);
        });
        div.appendChild(fcont);
    }

    if (recomendaciones.length) {
        div.appendChild(construirCalificacion(consulta));
    }

    mensajesEl.appendChild(div);
    mensajesEl.scrollTop = mensajesEl.scrollHeight;
    return div;
}

function construirCalificacion(consulta) {
    const box = document.createElement("div");
    box.className = "calificacion";

    if (consulta.calificacion) {
        box.innerHTML = `
            <span class="calificacion-titulo">Tu calificación</span>
            <p class="calificacion-enviada">${consulta.calificacion.valor} de 5</p>
        `;
        return box;
    }

    box.innerHTML = `
        <span class="calificacion-titulo">¿Qué tan útil fue esta recomendación?</span>
        <div class="estrellas"></div>
        <textarea rows="2" placeholder="Comentario opcional…"></textarea>
        <button type="button">Enviar calificación</button>
    `;

    const estrellasBox = box.querySelector(".estrellas");
    let seleccion = 0;

    for (let i = 1; i <= 5; i++) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "estrella";
        boton.textContent = "★";
        boton.addEventListener("click", () => {
            seleccion = i;
            estrellasBox.querySelectorAll(".estrella").forEach((el, idx) => {
                el.classList.toggle("activa", idx < seleccion);
            });
        });
        estrellasBox.appendChild(boton);
    }

    box.querySelector("button:not(.estrella)").addEventListener("click", async (evento) => {
        if (!seleccion) return;
        const boton = evento.target;
        boton.disabled = true;

        try {
            const comentario = box.querySelector("textarea").value.trim();
            const respuesta = await fetch(`${API_URL}/api/consultas/${consulta.id}/calificacion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${obtenerToken()}`
                },
                body: JSON.stringify({ valor: seleccion, comentario })
            });

            if (manejarNoAutorizado(respuesta)) return;
            if (!respuesta.ok) throw new Error("No fue posible enviar la calificación.");

            box.innerHTML = `
                <span class="calificacion-titulo">Tu calificación</span>
                <p class="calificacion-enviada">${seleccion} de 5. ¡Gracias!</p>
            `;

        } catch (error) {
            console.error(error);
            boton.disabled = false;
        }
    });

    return box;
}

formConsulta.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const consulta = inputConsulta.value.trim();
    if (!consulta) return;

    agregarMensaje("user", consulta);
    inputConsulta.value = "";

    const cargando = agregarMensaje("bot", "Buscando en el catálogo académico...");
    cargando.classList.add("cargando");

    formConsulta.querySelector("button").disabled = true;

    try {
        const respuesta = await fetch(`${API_URL}/api/consultas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${obtenerToken()}`
            },
            body: JSON.stringify({ textoConsulta: consulta })
        });

        cargando.remove();

        if (manejarNoAutorizado(respuesta)) return;

        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.mensaje || datos.message || "No fue posible procesar la consulta.");

        agregarRespuestaBot(datos);

    } catch (error) {
        cargando.remove();
        agregarMensaje("bot", "Ocurrió un error: " + error.message);
    } finally {
        formConsulta.querySelector("button").disabled = false;
    }
});

/* Enviar con Enter (Shift+Enter para salto de línea) */
inputConsulta.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
        evento.preventDefault();
        formConsulta.requestSubmit();
    }
});

/* --- Historial --- */

async function cargarHistorial() {
    const historialBox = document.getElementById("historialBox");

    try {
        const respuesta = await fetch(`${API_URL}/api/consultas`, {
            headers: { "Authorization": `Bearer ${obtenerToken()}` }
        });

        if (manejarNoAutorizado(respuesta)) return;

        const consultas = await respuesta.json();
        historialBox.innerHTML = "";
        historialCargado = true;

        if (!Array.isArray(consultas) || !consultas.length) {
            historialBox.innerHTML = '<p class="estado">Aún no has hecho ninguna consulta.</p>';
            return;
        }

        consultas
            .slice()
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .forEach((consulta) => {
                const item = document.createElement("div");
                item.className = "historial-item";
                item.innerHTML = `
                    <button type="button" class="historial-item-header">
                        <span class="fecha">${consulta.fecha ? new Date(consulta.fecha).toLocaleString("es-CO") : ""}</span>
                        <span class="texto">${consulta.textoConsulta || ""}</span>
                    </button>
                    <div class="historial-item-body" hidden></div>
                `;

                const boton = item.querySelector(".historial-item-header");
                const body = item.querySelector(".historial-item-body");
                let renderizado = false;

                boton.addEventListener("click", () => {
                    body.hidden = !body.hidden;
                    if (!body.hidden && !renderizado) {
                        const respuestaBot = document.createElement("div");
                        respuestaBot.className = "msg bot";
                        respuestaBot.style.maxWidth = "100%";
                        body.appendChild(respuestaBot);
                        body.replaceChild(agregarRespuestaBotEnNodo(consulta), respuestaBot);
                        renderizado = true;
                    }
                });

                historialBox.appendChild(item);
            });

    } catch (error) {
        console.error(error);
        historialBox.innerHTML = `<p class="estado">${error.message}</p>`;
    }
}

/* Reutiliza agregarRespuestaBot pero sin insertarlo en #mensajes,
   para poder colocarlo dentro de un ítem del historial. */
function agregarRespuestaBotEnNodo(consulta) {
    const antes = mensajesEl.lastElementChild;
    const nodo = agregarRespuestaBot(consulta);
    mensajesEl.removeChild(nodo);
    return nodo;
}