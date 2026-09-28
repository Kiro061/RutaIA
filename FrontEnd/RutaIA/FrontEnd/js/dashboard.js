/* =========================================
   RUTAIA - DASHBOARD
   Requiere auth.js (obtenerToken, obtenerUsuario,
   cerrarSesion) cargado antes que este archivo.
========================================= */

const API_URL = "http://localhost:8080/rutaia/api/v1";

/* --- Utilidades --- */

function crear(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    const d = new Date(fecha);
    return isNaN(d) ? "" : d.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

function mostrarEstado(contenedor, mensaje) {
    contenedor.replaceChildren(crear("p", "dash-estado", mensaje));
}

/* --- Peticiones --- */

async function pedirConsultas() {
    const respuesta = await fetch(`${API_URL}/api/consultas`, {
        headers: { "Authorization": `Bearer ${obtenerToken()}` }
    });

    // Token vencido o inválido: cerramos sesión y volvemos a login
    if (respuesta.status === 401) {
        cerrarSesion();
        return null;
    }
    if (!respuesta.ok) throw new Error("No fue posible cargar tus consultas.");

    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
}

async function pedirCursos() {
    const respuesta = await fetch(`${API_URL}/cursos`);
    if (!respuesta.ok) throw new Error("No fue posible cargar el catálogo.");

    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
}

/* --- Render --- */

function renderUltimasConsultas(consultas) {
    const cont = document.getElementById("listaConsultas");

    if (!consultas.length) {
        mostrarEstado(cont, "Aún no has hecho ninguna consulta.");
        return;
    }

    cont.replaceChildren();
    consultas.slice(0, 5).forEach((consulta) => {
        const item = crear("a", "lista-item");
        item.href = "consulta.html";

        item.appendChild(crear("span", "fecha", formatearFecha(consulta.fechaConsulta)));
        item.appendChild(crear("span", "texto", consulta.texto || "Consulta sin texto"));
        item.appendChild(crear("span", "detalle", consulta.estado || ""));

        cont.appendChild(item);
    });
}

function renderEstadisticas(consultas, cursos) {
    if (consultas) {
        document.getElementById("statConsultas").textContent = consultas.length;
    }

    if (cursos) {
        document.getElementById("statCatalogo").textContent =
            cursos.filter((curso) => curso.activo !== false).length;
    }
}

/* --- Inicio --- */

document.addEventListener("DOMContentLoaded", async () => {

    const usuario = obtenerUsuario();
    if (usuario) {
        document.getElementById("dashNombre").textContent =
            usuario.nombre || usuario.correo || "estudiante";

        const perfilEl = document.getElementById("dashPerfil");
        if (perfilEl && (usuario.nivelExperiencia || usuario.areaInteres)) {
            const partes = [];
            if (usuario.nivelExperiencia) partes.push(`Nivel: ${usuario.nivelExperiencia}`);
            if (usuario.areaInteres) partes.push(`Interés: ${usuario.areaInteres}`);
            perfilEl.textContent = partes.join(" · ");
        }
    }

    // Las dos peticiones van en paralelo; si una falla, la otra igual se muestra
    const [resConsultas, resCursos] = await Promise.allSettled([
        pedirConsultas(),
        pedirCursos()
    ]);

    let consultas = null;

    if (resConsultas.status === "fulfilled") {
        if (resConsultas.value === null) return; // sesión cerrada por 401

        consultas = resConsultas.value
            .slice()
            .sort((a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta));

        renderUltimasConsultas(consultas);
    } else {
        console.error(resConsultas.reason);
        mostrarEstado(document.getElementById("listaConsultas"), "No fue posible cargar tus consultas.");
    }

    let cursos = null;
    if (resCursos.status === "fulfilled") {
        cursos = resCursos.value;
    } else {
        console.error(resCursos.reason);
    }

    renderEstadisticas(consultas, cursos);
});