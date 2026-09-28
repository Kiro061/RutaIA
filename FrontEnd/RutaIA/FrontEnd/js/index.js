/* =========================================
   RUTAIA - PÁGINA PRINCIPAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("RutaIA - Página principal cargada");


    /* =====================================
       ELEMENTOS DEL DOM
    ===================================== */

    const hero = document.querySelector(".hero");

    const heroTag = document.querySelector(".hero-tag");


    /* =====================================
       VERIFICAR QUE LOS ELEMENTOS EXISTAN
    ===================================== */

    if (!hero || !heroTag) {
        console.error("No se encontraron los elementos principales de la página.");
        return;
    }


    /* =====================================
       PEQUEÑA INTERACCIÓN DEL HERO
    ===================================== */

    hero.addEventListener("mouseenter", () => {

        heroTag.style.transform = "translateY(-2px)";

    });


    hero.addEventListener("mouseleave", () => {

        heroTag.style.transform = "translateY(0)";

    });


    /* =====================================
       ANIMACIÓN AL HACER SCROLL
    ===================================== */

    const cards = document.querySelectorAll(
        ".info-card, .feature"
    );


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    cards.forEach((card) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(20px)";

        card.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";

        observer.observe(card);

    });


    /* =====================================
       MENSAJE DE INICIO
    ===================================== */

    console.log(
        "Bienvenido a RutaIA. " +
        "Explora el catálogo o realiza una consulta."
    );

});