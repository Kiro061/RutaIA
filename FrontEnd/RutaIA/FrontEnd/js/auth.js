/* =========================================
   RUTAIA - AUTENTICACIÓN
   Funciones reutilizables para manejar la
   sesión guardada por login.js.
========================================= */

function obtenerToken() {
    return localStorage.getItem("token");
}

function obtenerUsuario() {
    const datos = localStorage.getItem("usuario");
    return datos ? JSON.parse(datos) : null;
}

function estaAutenticado() {
    return Boolean(obtenerToken());
}

function rutaLogin() {
    return window.location.pathname.includes("/pages/") ? "login.html" : "pages/login.html";
}

function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = rutaLogin();
}

/*
 * Bloquea el acceso a la página actual si no hay
 * sesión iniciada. Debe llamarse justo después de
 * abrir <body>, antes de mostrar contenido.
 */
function requerirSesion() {
    if (!estaAutenticado()) {
        window.location.href = rutaLogin();
    }
}
