// =========================================
// ELEMENTOS DEL DOM
// =========================================

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

const nombreUsuario = document.getElementById("nombreUsuario");
const nombreHeader = document.getElementById("nombreHeader");


// =========================================
// DATOS TEMPORALES
// =========================================
//
// Estos datos posteriormente serán obtenidos
// desde el backend después del login.
//
// Por ahora solamente sirven para comprobar
// la estructura del panel.
//

const usuario = {

    nombre: "Estudiante",

    rol: "ESTUDIANTE"

};


// =========================================
// MOSTRAR INFORMACIÓN DEL USUARIO
// =========================================

function mostrarUsuario() {

    nombreUsuario.textContent = usuario.nombre;

    nombreHeader.textContent = usuario.nombre;

}


// =========================================
// CERRAR SESIÓN
// =========================================

btnCerrarSesion.addEventListener("click", function() {

    /*
        Posteriormente aquí se eliminará el token
        o la información de sesión.

        Por ahora simplemente regresamos al login.
    */

    window.location.href = "login.html";

});


// =========================================
// INICIALIZAR PANEL
// =========================================

mostrarUsuario();