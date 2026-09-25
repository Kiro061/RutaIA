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
    const respuesta = await fetch(`${API_URL}/consultas`, {
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

        item.appendChild(crear("span", "fecha", formatearFecha(consulta.fecha)));
        item.appendChild(crear("span", "texto", consulta.textoConsulta || "Consulta sin texto"));

        const total = (consulta.recomendaciones || []).length;
        item.appendChild(crear("span", "detalle",
            total === 1 ? "1 curso recomendado" : `${total} cursos recomendados`));

        cont.appendChild(item);
    });
}

function renderCursosTop(consultas) {
    const cont = document.getElementById("listaCursos");

    // Cuenta cuántas veces se recomendó cada curso
    const conteo = new Map();
    consultas.forEach((consulta) => {
        (consulta.recomendaciones || []).forEach((rec) => {
            const nombre = rec.nombreCurso;
            if (nombre) conteo.set(nombre, (conteo.get(nombre) || 0) + 1);
        });
    });

    if (!conteo.size) {
        mostrarEstado(cont, "Cuando hagas consultas, aquí verás tus cursos recomendados.");
        return conteo;
    }

    cont.replaceChildren();
    [...conteo.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([nombre, veces], indice) => {
            const item = crear("div", "lista-item curso-rank");
            item.appendChild(crear("span", "pos", String(indice + 1)));

            const info = crear("div", "info");
            info.appendChild(crear("span", "texto", nombre));
            info.appendChild(crear("span", "detalle",
                veces === 1 ? "Recomendado 1 vez" : `Recomendado ${veces} veces`));
            item.appendChild(info);

            cont.appendChild(item);
        });

    return conteo;
}

function renderEstadisticas(consultas, cursos, conteo) {
    if (consultas) {
        const ordenadas = consultas
            .slice()
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        document.getElementById("statConsultas").textContent = consultas.length;
        document.getElementById("statRecomendados").textContent = conteo ? conteo.size : 0;
        document.getElementById("statUltima").textContent =
            ordenadas.length ? (formatearFecha(ordenadas[0].fecha) || "–") : "Sin consultas";
    }

    if (cursos) {
        document.getElementById("statCatalogo").textContent = cursos.length;
    }
}

/* --- Inicio --- */

document.addEventListener("DOMContentLoaded", async () => {

    const usuario = obtenerUsuario();
    if (usuario) {
        document.getElementById("dashNombre").textContent =
            usuario.nombre || usuario.correo || "estudiante";
    }

    // Las dos peticiones van en paralelo; si una falla, la otra igual se muestra
    const [resConsultas, resCursos] = await Promise.allSettled([
        pedirConsultas(),
        pedirCursos()
    ]);

    let consultas = null;
    let conteo = null;

    if (resConsultas.status === "fulfilled") {
        if (resConsultas.value === null) return; // sesión cerrada por 401

        consultas = resConsultas.value
            .slice()
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        renderUltimasConsultas(consultas);
        conteo = renderCursosTop(consultas);
    } else {
        console.error(resConsultas.reason);
        mostrarEstado(document.getElementById("listaConsultas"), "No fue posible cargar tus consultas.");
        mostrarEstado(document.getElementById("listaCursos"), "No fue posible cargar tus recomendaciones.");
    }

    let cursos = null;
    if (resCursos.status === "fulfilled") {
        cursos = resCursos.value;
    } else {
        console.error(resCursos.reason);
    }

    renderEstadisticas(consultas, cursos, conteo);
});