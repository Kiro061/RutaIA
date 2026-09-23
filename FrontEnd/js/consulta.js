// =========================================
// ELEMENTOS DEL DOM
// =========================================

const mensajes = document.getElementById("mensajes");
const formConsulta = document.getElementById("formConsulta");
const inputConsulta = document.getElementById("inputConsulta");
const btnConsultar = document.getElementById("btnConsultar");


// =========================================
// AGREGAR MENSAJE AL CHAT
// =========================================

function agregarMensaje(tipo, texto) {

    const mensaje = document.createElement("div");

    mensaje.classList.add("mensaje", tipo);


    const burbuja = document.createElement("div");

    burbuja.classList.add("burbuja");

    burbuja.textContent = texto;


    mensaje.appendChild(burbuja);

    mensajes.appendChild(mensaje);


    // Llevar el scroll hasta el último mensaje

    mensajes.scrollTop = mensajes.scrollHeight;
}


// =========================================
// MOSTRAR CURSOS RECOMENDADOS
// =========================================

function mostrarCursos(cursos) {

    const mensaje = document.createElement("div");

    mensaje.classList.add("mensaje", "bot");


    const contenido = document.createElement("div");

    contenido.classList.add("burbuja");


    const titulo = document.createElement("p");

    titulo.textContent = "Estos cursos podrían ayudarte:";

    contenido.appendChild(titulo);


    const contenedorCursos = document.createElement("div");

    contenedorCursos.classList.add("cursos-recomendados");


    cursos.forEach(curso => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("curso-recomendado");


        const nombre = document.createElement("h3");

        nombre.textContent = curso.nombre;


        const descripcion = document.createElement("p");

        descripcion.textContent = curso.descripcion;


        const informacion = document.createElement("div");

        informacion.classList.add("curso-info");


        const nivel = document.createElement("span");

        nivel.textContent = curso.nivel;


        const duracion = document.createElement("span");

        duracion.textContent = curso.duracion;


        informacion.appendChild(nivel);

        informacion.appendChild(duracion);


        tarjeta.appendChild(nombre);

        tarjeta.appendChild(descripcion);

        tarjeta.appendChild(informacion);


        contenedorCursos.appendChild(tarjeta);

    });


    contenido.appendChild(contenedorCursos);

    mensaje.appendChild(contenido);

    mensajes.appendChild(mensaje);


    mensajes.scrollTop = mensajes.scrollHeight;
}


// =========================================
// ENVIAR CONSULTA
// =========================================

formConsulta.addEventListener("submit", function(event) {

    event.preventDefault();


    const consulta = inputConsulta.value.trim();


    // Evitar consultas vacías

    if (consulta === "") {
        return;
    }


    // Mostrar mensaje del usuario

    agregarMensaje("usuario", consulta);


    // Limpiar campo

    inputConsulta.value = "";


    // Preparar botón

    btnConsultar.disabled = true;

    btnConsultar.textContent = "Consultando...";


    /*
        ============================================
        CONEXIÓN CON EL BACKEND

        La conexión con Spring Boot se agregará
        posteriormente.

        En este momento solamente mostramos una
        respuesta temporal para comprobar que
        la interfaz funciona correctamente.
        ============================================
    */


    setTimeout(function() {

        agregarMensaje(
            "bot",
            "Tu consulta fue recibida. Aquí se mostrarán las recomendaciones de cursos cuando conectemos el frontend con la API."
        );


        btnConsultar.disabled = false;

        btnConsultar.textContent = "Consultar";

    }, 700);

});


// =========================================
// ENTER PARA ENVIAR
// =========================================

inputConsulta.addEventListener("keydown", function(event) {

    // Enter envía la consulta

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        formConsulta.requestSubmit();

    }

});


// =========================================
// AJUSTAR ALTURA DEL TEXTAREA
// =========================================

inputConsulta.addEventListener("input", function() {

    this.style.height = "auto";

    this.style.height = this.scrollHeight + "px";

});