document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const abierto = menu.classList.toggle("is-open");
            toggle.classList.toggle("is-open", abierto);
            toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
        });

        menu.querySelectorAll("a").forEach((enlace) => {
            enlace.addEventListener("click", () => {
                menu.classList.remove("is-open");
                toggle.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("is-scrolled", window.scrollY > 10);
        });
    }

    const actual = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#navMenu a:not(.btn-nav)").forEach((enlace) => {
        const destino = enlace.getAttribute("href").split("/").pop();
        enlace.classList.toggle("is-active", destino === actual);
    });

    if (typeof estaAutenticado === "function") {
        const logueado = estaAutenticado();

        document.querySelectorAll("[data-auth-only]").forEach((el) => { el.hidden = !logueado; });
        document.querySelectorAll("[data-guest-only]").forEach((el) => { el.hidden = logueado; });

        if (logueado) {
            const usuario = typeof obtenerUsuario === "function" ? obtenerUsuario() : null;
            const nombreEl = document.getElementById("navUserName");
            if (nombreEl && usuario) {
                nombreEl.textContent = usuario.nombre || usuario.correo || "Mi cuenta";
            }
        }
    }

    const logoutBtn = document.getElementById("navLogoutBtn");
    if (logoutBtn && typeof cerrarSesion === "function") {
        logoutBtn.addEventListener("click", cerrarSesion);
    }

});