const API_URL = "http://localhost:8080/api/usuarios";

const registroForm = document.getElementById("registroForm");

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const correo = document.getElementById("correo");
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

    if (password.value.length < 6) {

        document.getElementById("passwordError").textContent =
            "La contraseña debe tener mínimo 6 caracteres.";

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
// REGISTRO
// ===============================

registroForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    btnRegistrar.disabled = true;
    btnRegistrar.textContent = "Registrando...";

    const usuario = {
        nombre: nombre.value.trim(),
        apellido: apellido.value.trim(),
        correo: correo.value.trim(),
        password: password.value
    };

    try {

        const respuesta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje ||
                datos.message ||
                "No fue posible registrar el usuario."
            );
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