// ========================================
// ELEMENTOS DEL DOM
// ========================================

const listaCursos =
    document.getElementById("listaCursos");

const contadorCursos =
    document.getElementById("contadorCursos");

const sinResultados =
    document.getElementById("sinResultados");

const filtroCategoria =
    document.getElementById("filtroCategoria");

const filtroNivel =
    document.getElementById("filtroNivel");


// ========================================
// MOSTRAR CURSOS
// ========================================

function mostrarCursos(cursos) {

    listaCursos.innerHTML = "";


    contadorCursos.textContent =
        `${cursos.length} curso${cursos.length !== 1 ? "s" : ""}`;


    if (cursos.length === 0) {

        sinResultados.style.display = "block";

        return;
    }


    sinResultados.style.display = "none";


    cursos.forEach(curso => {

        const tarjeta =
            document.createElement("article");

        tarjeta.classList.add("curso-card");


        tarjeta.innerHTML = `

            <span class="categoria">
                ${curso.categoria}
            </span>

            <h3>
                ${curso.nombre}
            </h3>

            <p class="descripcion">
                ${curso.descripcion}
            </p>

            <div class="curso-info">

                <span>
                    Nivel:
                    ${curso.nivel}
                </span>

                <span>
                    Duración:
                    ${curso.duracion}
                </span>

            </div>

        `;


        listaCursos.appendChild(tarjeta);

    });

}


// ========================================
// FILTRAR CURSOS
// ========================================

function filtrarCursos(cursos) {

    const categoriaSeleccionada =
        filtroCategoria.value;

    const nivelSeleccionado =
        filtroNivel.value;


    const cursosFiltrados =
        cursos.filter(curso => {

            const coincideCategoria =
                categoriaSeleccionada === "" ||
                curso.categoria === categoriaSeleccionada;


            const coincideNivel =
                nivelSeleccionado === "" ||
                curso.nivel === nivelSeleccionado;


            return (
                coincideCategoria &&
                coincideNivel
            );

        });


    mostrarCursos(cursosFiltrados);
}


// ========================================
// EVENTOS DE FILTROS
// ========================================

filtroCategoria.addEventListener(
    "change",
    () => {

        /*
         * Cuando conectes Spring Boot,
         * aquí puedes volver a ejecutar
         * el filtrado de los cursos.
         */

    }
);


filtroNivel.addEventListener(
    "change",
    () => {

        /*
         * Cuando conectes Spring Boot,
         * aquí puedes volver a ejecutar
         * el filtrado de los cursos.
         */

    }
);


// ========================================
// FUNCIÓN PARA CARGAR CURSOS
// ========================================

function cargarCursos(cursos) {

    /*
     * Esta función está preparada para
     * recibir los cursos provenientes
     * del backend.
     *
     * El backend deberá enviar únicamente
     * los cursos que estén activos.
     */

    mostrarCursos(cursos);
}


// ========================================
// INICIO
// ========================================

/*
 * No se cargan cursos todavía porque
 * el frontend aún no está conectado
 * con Spring Boot.
 */