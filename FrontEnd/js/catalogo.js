/* =========================================
   RUTAIA - CATÁLOGO
========================================= */

const API_URL = "http://localhost:8080/rutaia/api/v1";

let cursosCache = [];

async function cargarCatalogo() {

    const grid = document.getElementById("catalogoGrid");

    grid.innerHTML = `
        <p class="catalogo-estado">
            Cargando catálogo…
        </p>
    `;

    try {
        // El catálogo es público: no requiere sesión ni token.
        const respuesta = await fetch(`${API_URL}/cursos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const texto = await respuesta.text();

        if (!respuesta.ok) {
            throw new Error(
                `Error ${respuesta.status}: ${texto || "Sin respuesta"}`
            );
        }

        if (!texto.trim()) {
            throw new Error("El servidor respondió vacío.");
        }

        const datos = JSON.parse(texto);
        cursosCache = Array.isArray(datos) ? datos : [];
        renderCursos(cursosCache);
    } catch (error) {
        console.error("Error al cargar catálogo:", error);
        grid.innerHTML = `
            <p class="catalogo-estado">
                ${error.message}
            </p>
        `;
    }
}

function renderCursos(cursos) {
    const grid = document.getElementById("catalogoGrid");
    grid.innerHTML = "";

    if (!cursos.length) {
        grid.innerHTML = '<p class="catalogo-estado">No hay cursos que coincidan con tu búsqueda.</p>';
        return;
    }

    cursos.forEach((curso) => {
        const card = document.createElement("article");
        card.className = "curso-card";
        card.innerHTML = `
            <span class="categoria">${curso.categoria || "General"}</span>
            <h3>${curso.nombre || "Curso sin nombre"}</h3>
            <p>${curso.descripcion || ""}</p>
            <div class="meta">
                <span>${curso.nivel || ""}</span>
                <span>${curso.duracion ? curso.duracion : ""}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCatalogo();

    document.getElementById("buscador").addEventListener("input", (evento) => {
        const termino = evento.target.value.trim().toLowerCase();
        if (!termino) return renderCursos(cursosCache);

        renderCursos(cursosCache.filter((c) =>
            (c.nombre || "").toLowerCase().includes(termino) ||
            (c.categoria || "").toLowerCase().includes(termino)
        ));
    });
});