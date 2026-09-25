const API_URL = "http://localhost:8080/rutaia/api/v1";

const registroForm = document.getElementById("registroForm");

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const correo = document.getElementById("correo");
const nivelExperiencia = document.getElementById("nivelExperiencia");
const areaInteres = document.getElementById("areaInteres");
const password = document.getElementById("password");
const confirmarPassword = document.getElementById("confirmarPassword");

const btnRegistrar = document.getElementById("btnRegistrar");
const mensaje = document.getElementById("mensaje");

const mostrarPassword = document.getElementById("mostrarPassword");
const mostrarConfirmarPassword = document.getElementById("mostrarConfirmarPassword");


// ===============================
// MOSTRAR / OCULTAR CONTRASEÑA
// ===============================

mostrarPassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        mostrarPassword.textContent = "Ocultar";
    } else {
        password.type = "password";
        mostrarPassword.textContent = "Mostrar";
    }

});


mostrarConfirmarPassword.addEventListener("click", () => {

    if (confirmarPassword.type === "password") {
        confirmarPassword.type = "text";
        mostrarConfirmarPassword.textContent = "Ocultar";
    } else {
        confirmarPassword.type = "password";
        mostrarConfirmarPassword.textContent = "Mostrar";
    }

});


// ===============================
// FUNCIONES DE MENSAJES
// ===============================

function mostrarMensaje(texto, tipo) {

    mensaje.textContent = texto;

    mensaje.className = "mensaje";

    if (tipo === "exito") {
        mensaje.classList.add("exito");
    } else {
        mensaje.classList.add("error-mensaje");
    }
}


function limpiarErrores() {

    document.getElementById("nombreError").textContent = "";
    document.getElementById("apellidoError").textContent = "";
    document.getElementById("correoError").textContent = "";
    document.getElementById("nivelExperienciaError").textContent = "";
    document.getElementById("areaInteresError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmarPasswordError").textContent = "";

    mensaje.textContent = "";
    mensaje.className = "mensaje";
}


// ===============================
// VALIDACIÓN
// ===============================

function validarFormulario() {

    limpiarErrores();

    let valido = true;

    if (nombre.value.trim() === "") {
        document.getElementById("nombreError").textContent =
            "El nombre es obligatorio.";

        valido = false;
    }

    if (apellido.value.trim() === "") {
        document.getElementById("apellidoError").textContent =
            "El apellido es obligatorio.";

        valido = false;
    }

    if (correo.value.trim() === "") {

        document.getElementById("correoError").textContent =
            "El correo es obligatorio.";

        valido = false;

    } else if (!correo.value.includes("@")) {

        document.getElementById("correoError").textContent =
            "Ingresa un correo válido.";

        valido = false;
    }

    if (nivelExperiencia.value === "") {
        document.getElementById("nivelExperienciaError").textContent =
            "Selecciona tu nivel de experiencia.";

        valido = false;
    }

    if (areaInteres.value.trim() === "") {
        document.getElementById("areaInteresError").textContent =
            "El área de interés es obligatoria.";

        valido = false;
    }

    if (password.value.length < 8) {

        document.getElementById("passwordError").textContent =
            "La contraseña debe tener mínimo 8 caracteres.";

        valido = false;
    }

    if (password.value !== confirmarPassword.value) {

        document.getElementById("confirmarPasswordError").textContent =
            "Las contraseñas no coinciden.";

        valido = false;
    }

    return valido;
}


// ===============================
// LECTURA SEGURA DE LA RESPUESTA
// ===============================

async function leerCuerpoSeguro(respuesta) {

    const texto = await respuesta.text();

    if (!texto.trim()) {
        return null; // respuesta sin cuerpo (p. ej. un 403 de Spring Security)
    }

    try {
        return JSON.parse(texto);
    } catch (e) {
        console.error("La respuesta no es JSON válido:", texto);
        return null;
    }
}


// ===============================
// REGISTRO
// ===============================

registroForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    btnRegistrar.disabled = true;
    btnRegistrar.textContent = "Registrando...";

    // El backend maneja un solo campo "nombre" (nombre completo),
    // así que combinamos nombre + apellido antes de enviarlo.
    const usuario = {
        nombre: `${nombre.value.trim()} ${apellido.value.trim()}`.trim(),
        correo: correo.value.trim(),
        password: password.value,
        nivelExperiencia: nivelExperiencia.value,
        areaInteres: areaInteres.value.trim()
    };

    try {

        const respuesta = await fetch(`${API_URL}/usuarios`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)

        });

        const datos = await leerCuerpoSeguro(respuesta);

        if (!respuesta.ok) {

            // Errores de validación (400) llegan como { errors: { campo: mensaje } }
            if (datos && datos.errors) {
                const primerError = Object.values(datos.errors)[0];
                throw new Error(primerError || "Revisa los datos del formulario.");
            }

            if (datos && (datos.mensaje || datos.message)) {
                throw new Error(datos.mensaje || datos.message);
            }

            if (respuesta.status === 403) {
                throw new Error("El servidor rechazó la solicitud (403). Verifica la configuración de seguridad del backend.");
            }

            throw new Error(`No fue posible registrar el usuario (código ${respuesta.status}).`);
        }

        mostrarMensaje(
            "Cuenta creada correctamente. Redirigiendo al login...",
            "exito"
        );

        registroForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (error) {

        console.error("Error:", error);

        mostrarMensaje(
            error.message || "Error al conectar con el servidor.",
            "error"
        );

    } finally {

        btnRegistrar.disabled = false;
        btnRegistrar.textContent = "Crear cuenta";
    }

});