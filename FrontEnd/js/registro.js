
const registroForm = document.getElementById("registroForm");

const nombreCompleto = document.getElementById("nombreCompleto");
const correo = document.getElementById("correo");
const nivelExperiencia = document.getElementById("nivelExperiencia");
const areaInteres = document.getElementById("areaInteres");

const mensaje = document.getElementById("mensaje");


// ========================================
// MOSTRAR MENSAJE
// ========================================

function mostrarMensaje(texto, tipo) {

    mensaje.textContent = texto;

    mensaje.className = "mensaje";

    if (tipo === "exito") {
        mensaje.classList.add("exito");
    } else {
        mensaje.classList.add("error-mensaje");
    }
}


// ========================================
// LIMPIAR ERRORES
// ========================================

function limpiarErrores() {

    document.getElementById("nombreError").textContent = "";
    document.getElementById("correoError").textContent = "";
    document.getElementById("nivelError").textContent = "";
    document.getElementById("areaError").textContent = "";

    mensaje.textContent = "";
    mensaje.className = "mensaje";
}


// ========================================
// VALIDAR FORMULARIO
// ========================================

function validarFormulario() {

    limpiarErrores();

    let valido = true;


    // NOMBRE COMPLETO

    if (nombreCompleto.value.trim() === "") {

        document.getElementById("nombreError").textContent =
            "El nombre completo es obligatorio.";

        valido = false;
    }


    // CORREO

    if (correo.value.trim() === "") {

        document.getElementById("correoError").textContent =
            "El correo electrónico es obligatorio.";

        valido = false;

    } else {

        const formatoCorreo =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correo.value.trim())) {

            document.getElementById("correoError").textContent =
                "Ingresa un correo electrónico válido.";

            valido = false;
        }
    }


    // NIVEL DE EXPERIENCIA

    const nivelesPermitidos = [
        "PRINCIPIANTE",
        "INTERMEDIO",
        "AVANZADO"
    ];

    if (!nivelesPermitidos.includes(nivelExperiencia.value)) {

        document.getElementById("nivelError").textContent =
            "Selecciona un nivel de experiencia.";

        valido = false;
    }


    // ÁREA DE INTERÉS

    if (areaInteres.value.trim() === "") {

        document.getElementById("areaError").textContent =
            "El área de interés es obligatoria.";

        valido = false;
    }


    return valido;
}


// ========================================
// ENVÍO DEL FORMULARIO
// ========================================

registroForm.addEventListener("submit", (event) => {

    event.preventDefault();


    if (!validarFormulario()) {
        return;
    }


    /*
     * AQUÍ SE CONECTARÁ POSTERIORMENTE
     * CON EL BACKEND DE SPRING BOOT.
     *
     * Los datos disponibles son:
     *
     * nombreCompleto.value
     * correo.value
     * nivelExperiencia.value
     * areaInteres.value
     */


    mostrarMensaje(
        "Formulario válido. Listo para conectar con el servidor.",
        "exito"
    );

});