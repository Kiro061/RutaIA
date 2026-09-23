/* =========================================
   RUTAIA - LOGIN
========================================= */
/* =========================================
   URL DE LA API
========================================= */


const API_URL = "http://localhost:8080";

/* =========================================
   ESPERAR A QUE CARGUE EL DOM
========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       OBTENER ELEMENTOS
    ===================================== */

    const loginForm = document.getElementById("loginForm");

    const correoInput = document.getElementById("correo");

    const passwordInput = document.getElementById("password");

    const loginMessage = document.getElementById("loginMessage");


    /* =====================================
       VERIFICAR ELEMENTOS
    ===================================== */

    if (
        !loginForm ||
        !correoInput ||
        !passwordInput ||
        !loginMessage
    ) {

        console.error(
            "No se encontraron los elementos del formulario de login."
        );

        return;
    }


    /* =====================================
       EVENTO DEL FORMULARIO
    ===================================== */

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        /* =================================
           OBTENER DATOS
        ================================= */

        const correo = correoInput.value.trim();

        const password = passwordInput.value;


        /* =================================
           VALIDACIÓN
        ================================= */

        if (!correo || !password) {

            mostrarMensaje(
                "Completa todos los campos.",
                "error"
            );

            return;
        }


        /* =================================
           DESACTIVAR BOTÓN
        ================================= */

        const boton = loginForm.querySelector("button");

        boton.disabled = true;

        boton.textContent = "Iniciando sesión...";


        try {


            /* =============================
               PETICIÓN A SPRING BOOT
            ============================= */

            const respuesta = await fetch(
                `${API_URL}/auth/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        correo: correo,
                        password: password
                    })

                }
            );


            /* =============================
               CONVERTIR RESPUESTA
            ============================= */

            const datos = await respuesta.json();


            /* =============================
               LOGIN EXITOSO
            ============================= */

            if (respuesta.ok) {


                /*
                 * Guardamos el token recibido
                 * por Spring Boot.
                 */

                if (datos.token) {

                    localStorage.setItem(
                        "token",
                        datos.token
                    );

                }


                /*
                 * Guardamos información del usuario
                 * si el backend la devuelve.
                 */

                if (datos.usuario) {

                    localStorage.setItem(
                        "usuario",
                        JSON.stringify(datos.usuario)
                    );

                }


                mostrarMensaje(
                    "Inicio de sesión exitoso.",
                    "success"
                );


                /*
                 * Esperamos un momento para
                 * mostrar el mensaje.
                 */

                setTimeout(() => {

                    window.location.href =
                        "consulta.html";

                }, 800);


            } else {


                /* =========================
                   ERROR DEL SERVIDOR
                ========================= */

                mostrarMensaje(
                    datos.mensaje ||
                    datos.message ||
                    "Correo o contraseña incorrectos.",
                    "error"
                );


                boton.disabled = false;

                boton.textContent =
                    "Iniciar sesión";

            }


        } catch (error) {


            /* =============================
               ERROR DE CONEXIÓN
            ============================= */

            console.error(
                "Error al conectar con la API:",
                error
            );


            mostrarMensaje(
                "No fue posible conectar con el servidor.",
                "error"
            );


            boton.disabled = false;

            boton.textContent =
                "Iniciar sesión";

        }

    });



    /* =====================================
       FUNCIÓN PARA MOSTRAR MENSAJES
    ===================================== */

    function mostrarMensaje(mensaje, tipo) {

        loginMessage.textContent = mensaje;


        if (tipo === "success") {

            loginMessage.style.color = "#16a34a";

        } else {

            loginMessage.style.color = "#dc2626";

        }

    }

});