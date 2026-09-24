/* =========================================
   RUTAIA - CHATBOT DE CONSULTA
========================================= */

const API_URL = "http://172.16.102.4:8080/rutaia/api/v1";

/* --- Tabs --- */

const tabConsultar = document.getElementById("tabConsultar");
const tabHistorial = document.getElementById("tabHistorial");
const vistaConsultar = document.getElementById("vistaConsultar");
const vistaHistorial = document.getElementById("vistaHistorial");

let historialCargado = false;

tabConsultar.addEventListener("click", () => {
    tabConsultar.classList.add("active");
    tabHistorial.classList.remove("active");
    vistaConsultar.hidden = false;
    vistaHistorial.hidden = true;
});

tabHistorial.addEventListener("click", () => {
    tabHistorial.classList.add("active");
    tabConsultar.classList.remove("active");
    vistaHistorial.hidden = false;
    vistaConsultar.hidden = true;

    if (!historialCargado) {
        cargarHistorial();
    }
});


/* =========================================
   FUNCIONES DE AUTENTICACIÓN
========================================= */

function obtenerToken() {
    return localStorage.getItem("token");
}

function obtenerUsuarioId() {
    return localStorage.getItem("usuarioId");
}

function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuario");

    window.location.href = "login.html";
}

function manejarNoAutorizado(respuesta) {

    if (respuesta.status === 401) {
        cerrarSesion();
        return true;
    }

    return false;
}


/* =========================================
   CHAT
========================================= */

const mensajesEl = document.getElementById("mensajes");
const formConsulta = document.getElementById("formConsulta");
const inputConsulta = document.getElementById("inputConsulta");


/* =========================================
   AGREGAR MENSAJE DEL USUARIO/BOT
========================================= */

function agregarMensaje(tipo, texto) {

    const div = document.createElement("div");

    div.className = "msg " + tipo;

    const burbuja = document.createElement("div");

    burbuja.className = "burbuja";

    burbuja.textContent = texto;

    div.appendChild(burbuja);

    mensajesEl.appendChild(div);

    mensajesEl.scrollTop = mensajesEl.scrollHeight;

    return div;
}


/* =========================================
   CREAR RESPUESTA DEL BOT
========================================= */

function crearRespuestaBot(consulta) {

    const div = document.createElement("div");

    div.className = "msg bot";


    const burbuja = document.createElement("div");

    burbuja.className = "burbuja";

    burbuja.textContent =
        "Esto es lo que encontré para ti:";

    div.appendChild(burbuja);


    /* =====================================
       RECOMENDACIONES
    ===================================== */

    const recomendaciones =
        consulta.recomendaciones || [];

    if (recomendaciones.length) {

        const cont =
            document.createElement("div");

        cont.className = "sugeridos";


        recomendaciones.forEach((rec) => {

            const item =
                document.createElement("div");

            item.className = "sugerido";

            item.innerHTML = `
                <strong>
                    ${rec.nombreCurso || "Curso recomendado"}
                </strong>
                <br>
                ${rec.justificacion || ""}
            `;

            cont.appendChild(item);
        });


        div.appendChild(cont);

    } else {

        burbuja.textContent =
            "No encontré una recomendación para esta consulta.";
    }


    /* =====================================
       FUENTES
    ===================================== */

    const fuentes =
        consulta.fuentes || [];

    if (fuentes.length) {

        const fcont =
            document.createElement("div");

        fcont.className = "fuentes";

        fcont.innerHTML =
            '<span class="fuentes-titulo">Fuentes</span>';


        fuentes.forEach((f) => {

            const item =
                document.createElement("div");

            item.className = "fuente";

            item.textContent =
                f.descripcion || "";

            fcont.appendChild(item);
        });


        div.appendChild(fcont);
    }


    /* =====================================
       CALIFICACIÓN
    ===================================== */

    if (recomendaciones.length) {

        div.appendChild(
            construirCalificacion(consulta)
        );
    }


    return div;
}


/* =========================================
   AGREGAR RESPUESTA DEL BOT
========================================= */

function agregarRespuestaBot(consulta) {

    const div =
        crearRespuestaBot(consulta);

    mensajesEl.appendChild(div);

    mensajesEl.scrollTop =
        mensajesEl.scrollHeight;

    return div;
}


/* =========================================
   CONSTRUIR CALIFICACIÓN
========================================= */

function construirCalificacion(consulta) {

    const box =
        document.createElement("div");

    box.className = "calificacion";


    /* =====================================
       SI YA ESTÁ CALIFICADA
    ===================================== */

    if (consulta.calificacion) {

        box.innerHTML = `
            <span class="calificacion-titulo">
                Tu calificación
            </span>

            <p class="calificacion-enviada">
                ${consulta.calificacion.valor} de 5
            </p>
        `;

        return box;
    }


    /* =====================================
       FORMULARIO DE CALIFICACIÓN
    ===================================== */

    box.innerHTML = `
        <span class="calificacion-titulo">
            ¿Qué tan útil fue esta recomendación?
        </span>

        <div class="estrellas"></div>

        <textarea
            rows="2"
            placeholder="Comentario opcional…">
        </textarea>

        <button type="button">
            Enviar calificación
        </button>
    `;


    const estrellasBox =
        box.querySelector(".estrellas");

    let seleccion = 0;


    /* =====================================
       CREAR ESTRELLAS
    ===================================== */

    for (let i = 1; i <= 5; i++) {

        const boton =
            document.createElement("button");

        boton.type = "button";

        boton.className = "estrella";

        boton.textContent = "★";


        boton.addEventListener("click", () => {

            seleccion = i;

            estrellasBox
                .querySelectorAll(".estrella")
                .forEach((el, idx) => {

                    el.classList.toggle(
                        "activa",
                        idx < seleccion
                    );
                });
        });


        estrellasBox.appendChild(boton);
    }


    /* =====================================
       ENVIAR CALIFICACIÓN
    ===================================== */

    box.querySelector(
        "button:not(.estrella)"
    ).addEventListener(
        "click",
        async (evento) => {

            if (!seleccion) return;

            const boton =
                evento.target;

            boton.disabled = true;


            try {

                const comentario =
                    box
                        .querySelector("textarea")
                        .value
                        .trim();


                const respuesta =
                    await fetch(
                        `${API_URL}/api/consultas/${consulta.id}/calificacion`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${obtenerToken()}`
                            },

                            body: JSON.stringify({
                                valor: seleccion,
                                comentario: comentario
                            })
                        }
                    );


                if (
                    manejarNoAutorizado(
                        respuesta
                    )
                ) {
                    return;
                }


                if (!respuesta.ok) {

                    throw new Error(
                        "No fue posible enviar la calificación."
                    );
                }


                box.innerHTML = `
                    <span class="calificacion-titulo">
                        Tu calificación
                    </span>

                    <p class="calificacion-enviada">
                        ${seleccion} de 5. ¡Gracias!
                    </p>
                `;


            } catch (error) {

                console.error(error);

                boton.disabled = false;
            }
        }
    );


    return box;
}


/* =========================================
   ENVIAR CONSULTA
========================================= */

formConsulta.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        /* =================================
           OBTENER TEXTO DE CONSULTA
        ================================= */

        const consulta =
            inputConsulta.value.trim();


        if (!consulta) {
            return;
        }


        /* =================================
           OBTENER ID DEL USUARIO
        ================================= */

        const usuarioId =
            obtenerUsuarioId();


        if (!usuarioId) {

            agregarMensaje(
                "bot",
                "No se encontró el usuario. Por favor, inicia sesión nuevamente."
            );

            return;
        }


        /* =================================
           MOSTRAR MENSAJE DEL USUARIO
        ================================= */

        agregarMensaje(
            "user",
            consulta
        );

        inputConsulta.value = "";


        /* =================================
           MENSAJE DE CARGA
        ================================= */

        const cargando =
            agregarMensaje(
                "bot",
                "Buscando en el catálogo académico..."
            );

        cargando.classList.add(
            "cargando"
        );


        formConsulta
            .querySelector("button")
            .disabled = true;


        try {

            /* =============================
               ENVIAR CONSULTA AL BACKEND
            ============================= */

            const respuesta =
                await fetch(
                    `${API_URL}/api/consultas`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${obtenerToken()}`
                        },

                        body: JSON.stringify({

                            usuarioId:
                                Number(usuarioId),

                            texto:
                                consulta
                        })
                    }
                );


            /* =============================
               QUITAR MENSAJE DE CARGA
            ============================= */

            cargando.remove();


            /* =============================
               VERIFICAR AUTORIZACIÓN
            ============================= */

            if (
                manejarNoAutorizado(
                    respuesta
                )
            ) {
                return;
            }


            /* =============================
               LEER RESPUESTA
            ============================= */

            const datos =
                await respuesta.json();


            console.log(
                "Consulta enviada:",
                {
                    usuarioId:
                        Number(usuarioId),

                    textoConsulta:
                        consulta
                }
            );


            console.log(
                "Respuesta del backend:",
                datos
            );


            /* =============================
               VERIFICAR ERROR
            ============================= */

            if (!respuesta.ok) {

                throw new Error(
                    datos.mensaje ||
                    datos.message ||
                    "No fue posible procesar la consulta."
                );
            }


            /* =============================
               MOSTRAR RESPUESTA
            ============================= */

            agregarRespuestaBot(
                datos
            );


        } catch (error) {

            /* =============================
               ERROR
            ============================= */

            cargando.remove();

            agregarMensaje(
                "bot",
                "Ocurrió un error: " +
                error.message
            );


        } finally {

            formConsulta
                .querySelector("button")
                .disabled = false;
        }
    }
);


/* =========================================
   ENVIAR CON ENTER
   SHIFT + ENTER = SALTO DE LÍNEA
========================================= */

inputConsulta.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.key === "Enter" &&
            !evento.shiftKey
        ) {

            evento.preventDefault();

            formConsulta.requestSubmit();
        }
    }
);


/* =========================================
   HISTORIAL
========================================= */

async function cargarHistorial() {

    const historialBox =
        document.getElementById(
            "historialBox"
        );


    try {

        const respuesta =
            await fetch(
                `${API_URL}/api/consultas`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${obtenerToken()}`
                    }
                }
            );


        if (
            manejarNoAutorizado(
                respuesta
            )
        ) {
            return;
        }


        const consultas =
            await respuesta.json();


        historialBox.innerHTML = "";

        historialCargado = true;


        /* =================================
           SIN CONSULTAS
        ================================= */

        if (
            !Array.isArray(consultas) ||
            !consultas.length
        ) {

            historialBox.innerHTML =
                '<p class="estado">Aún no has hecho ninguna consulta.</p>';

            return;
        }


        /* =================================
           ORDENAR HISTORIAL
        ================================= */

        consultas
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.fecha) -
                    new Date(a.fecha)
            )
            .forEach(
                (consulta) => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "historial-item";


                    item.innerHTML = `
                        <button
                            type="button"
                            class="historial-item-header"
                        >

                            <span class="fecha">
                                ${
                                    consulta.fecha
                                        ? new Date(
                                            consulta.fecha
                                        ).toLocaleString(
                                            "es-CO"
                                        )
                                        : ""
                                }
                            </span>

                            <span class="texto">
                                ${
                                    consulta.textoConsulta ||
                                    ""
                                }
                            </span>

                        </button>

                        <div
                            class="historial-item-body"
                            hidden
                        ></div>
                    `;


                    const boton =
                        item.querySelector(
                            ".historial-item-header"
                        );

                    const body =
                        item.querySelector(
                            ".historial-item-body"
                        );

                    let renderizado = false;


                    /* =========================
                       MOSTRAR DETALLE
                    ========================= */

                    boton.addEventListener(
                        "click",
                        () => {

                            body.hidden =
                                !body.hidden;


                            if (
                                !body.hidden &&
                                !renderizado
                            ) {

                                body.appendChild(
                                    crearRespuestaBot(
                                        consulta
                                    )
                                );

                                renderizado = true;
                            }
                        }
                    );


                    historialBox.appendChild(
                        item
                    );
                }
            );


    } catch (error) {

        console.error(error);

        historialBox.innerHTML =
            `<p class="estado">${error.message}</p>`;
    }
}


/* =========================================
   CARGAR HISTORIAL AL CARGAR LA PÁGINA
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    cargarHistorial
);