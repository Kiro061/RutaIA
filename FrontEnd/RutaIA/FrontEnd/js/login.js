/* =========================================
   RUTAIA - LOGIN
========================================= */

/* =========================================
   URL DE LA API
========================================= */

const API_URL = "http://localhost:8080/rutaia/api/v1";


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
                        usuario: correo,
                        contrasenia: password
                    })
                }
            );


            /* =============================
               CONVERTIR RESPUESTA
            ============================= */

            const datos = await respuesta.json();

            console.log("Respuesta del servidor:", datos);


            /* =============================
               LOGIN EXITOSO
            ============================= */

            if (respuesta.ok) {

                /* =========================
                   GUARDAR TOKEN
                ========================= */

                if (datos.token) {

                    localStorage.setItem(
                        "token",
                        datos.token
                    );
                }


                /* =========================
                   GUARDAR ID Y DATOS DEL USUARIO
                ========================= */

                if (datos.id) {

                    localStorage.setItem(
                        "usuarioId",
                        datos.id
                    );

                    // Traemos el resto de los datos del usuario (nombre, correo,
                    // nivel de experiencia, área de interés) para que el
                    // dashboard y la navbar puedan mostrarlos. auth.js y
                    // dashboard.js leen la clave "usuario" de localStorage.
                    try {

                        const respUsuario = await fetch(
                            `${API_URL}/usuarios/${datos.id}`,
                            {
                                headers: {
                                    "Authorization": `Bearer ${datos.token}`
                                }
                            }
                        );

                        if (respUsuario.ok) {

                            const usuario = await respUsuario.json();

                            localStorage.setItem(
                                "usuario",
                                JSON.stringify(usuario)
                            );
                        }

                    } catch (error) {

                        console.error(
                            "No fue posible cargar los datos del usuario:",
                            error
                        );
                    }

                    console.log(
                        "ID del usuario guardado:",
                        datos.id
                    );
                }


                /* =========================
                   MENSAJE DE ÉXITO
                ========================= */

                mostrarMensaje(
                    "Inicio de sesión exitoso.",
                    "success"
                );


                /* =========================
                   REDIRECCIÓN
                ========================= */

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

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
                boton.textContent = "Iniciar sesión";
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
            boton.textContent = "Iniciar sesión";
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