// ========================================
// VARIABLES DEL JUEGO
// ========================================

let cantidadJugadores = 0;
let jugadores = [];
let jugadorActual = 0;


// ========================================
// BOTÓN JUGAR
// ========================================

const botonJugar = document.getElementById("boton-jugar");

botonJugar.addEventListener("click", function() {

    document.getElementById("pantalla-inicio").classList.add("oculto");
    document.getElementById("pantalla-jugadores").classList.remove("oculto");

});


// ========================================
// SELECCIONAR CANTIDAD DE JUGADORES
// ========================================

const botonesJugadores = document.querySelectorAll(".boton-jugadores");

botonesJugadores.forEach(function(boton) {

    boton.addEventListener("click", function() {

        cantidadJugadores = Number(this.dataset.jugadores);

        document.getElementById("pantalla-jugadores").classList.add("oculto");
        document.getElementById("pantalla-nombres").classList.remove("oculto");

        crearCamposNombres();

    });

});


// ========================================
// CREAR CAMPOS PARA LOS NOMBRES
// ========================================

function crearCamposNombres() {

    const contenedor = document.getElementById("campos-nombres");

    contenedor.innerHTML = "";

    for (let i = 0; i < cantidadJugadores; i++) {

        const input = document.createElement("input");

        input.type = "text";
        input.className = "campo-jugador";
        input.placeholder = "Nombre del jugador " + (i + 1);
        input.required = true;

        contenedor.appendChild(input);

    }

}


// ========================================
// GUARDAR JUGADORES
// ========================================

document.getElementById("formulario-jugadores").addEventListener("submit", function(evento) {

    evento.preventDefault();

    const campos = document.querySelectorAll(".campo-jugador");

    jugadores = [];

    campos.forEach(function(campo, indice) {

        jugadores.push({
            nombre: campo.value,
            posicion: 0,
            puntos: 0,
            ficha: ["🔵", "🩷", "🟣", "🟢", "🟡", "🟠"][indice]
        });

    });

    jugadorActual = 0;

    document.getElementById("pantalla-nombres").classList.add("oculto");
    document.getElementById("pantalla-juego").classList.remove("oculto");

    mostrarJugadores();
    actualizarFichas();

});


// ========================================
// MOSTRAR JUGADORES
// ========================================

function mostrarJugadores() {

    const lista = document.getElementById("lista-jugadores");

    lista.innerHTML = "";

    jugadores.forEach(function(jugador) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "jugador";

        tarjeta.innerHTML = `
            <strong>${jugador.ficha} ${jugador.nombre}</strong>
            <br>
            ⭐ ${jugador.puntos} puntos
            <br>
            📍 Casilla ${jugador.posicion}
        `;

        lista.appendChild(tarjeta);

    });

    if (jugadores.length > 0) {

        document.getElementById("turno").textContent =
            "🎮 Turno de " + jugadores[jugadorActual].nombre;

    }

}


// ========================================
// FICHAS EN EL TABLERO
// ========================================

function actualizarFichas() {

    document.querySelectorAll(".fichas-casilla").forEach(function(contenedor) {
        contenedor.remove();
    });

    jugadores.forEach(function(jugador) {

        const casilla = document.querySelector(
            `[data-casilla="${jugador.posicion}"]`
        );

        if (!casilla) return;

        let contenedor = casilla.querySelector(".fichas-casilla");

        if (!contenedor) {

            contenedor = document.createElement("div");
            contenedor.className = "fichas-casilla";

            casilla.appendChild(contenedor);

        }

        const ficha = document.createElement("span");

        ficha.className = "ficha";
        ficha.textContent = jugador.ficha;
        ficha.title = jugador.nombre;

        contenedor.appendChild(ficha);

    });

}


// ========================================
// DADO
// ========================================

const botonDado = document.getElementById("boton-dado");

const carasDado = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

botonDado.addEventListener("click", function() {

    if (jugadores.length === 0) return;

    const jugador = jugadores[jugadorActual];

    // Número del 1 al 6
    const numero = Math.floor(Math.random() * 6) + 1;

    // Mostrar dado
    document.getElementById("dado").textContent =
        carasDado[numero - 1];

    // Mover jugador
    jugador.posicion += numero;

    // Meta = casilla 30
    if (jugador.posicion >= 30) {
        jugador.posicion = 30;
    }

    mostrarJugadores();
    actualizarFichas();

    // Revisar casilla
    revisarCasilla(jugador);

});


// ========================================
// ACCIONES DE LAS CASILLAS
// ========================================

function revisarCasilla(jugador) {

    const posicion = jugador.posicion;


    // 🟦 PREGUNTAS
    const casillasPregunta = [
    2, 3, 4, 6, 7, 8,
    10, 11, 12, 14, 15, 17,
    19, 21, 22, 24, 27, 28
];

    if (casillasPregunta.includes(posicion)) {

        abrirPregunta();

        return;

    }


    // ⭐ PREMIO
    const casillasPremio = [20, 29];

    if (casillasPremio.includes(posicion)) {

        jugador.puntos += 10;

        alert(
            "⭐ ¡Premio!\n\n" +
            jugador.nombre +
            " ganó 10 puntos."
        );

        mostrarJugadores();

    }


    // 🎁 SORPRESA
    if (posicion === 23) {

        const gano = Math.random() < 0.5;

        if (gano) {

            jugador.puntos += 10;

            alert("🎁 ¡Sorpresa!\n\nGanaste 10 puntos.");

        } else {

            jugador.puntos -= 5;

            if (jugador.puntos < 0) {
                jugador.puntos = 0;
            }

            alert("😱 ¡Sorpresa!\n\nPerdiste 5 puntos.");

        }

        mostrarJugadores();

    }


    // 🎲 VOLVER A TIRAR
    if (posicion === 26) {

        alert("🎲 ¡Puedes tirar otra vez!");

        document.getElementById("turno").textContent =
            "🎮 Turno de " + jugador.nombre;

        return;

    }


    // 🏆 META
    if (posicion === 30) {

        alert(
            "🏆 ¡" +
            jugador.nombre +
            " llegó a la META!"
        );

        return;

    }


    // Siguiente jugador
    siguienteJugador();

}


// ========================================
// CAMBIAR TURNO
// ========================================

function siguienteJugador() {

    jugadorActual++;

    if (jugadorActual >= jugadores.length) {
        jugadorActual = 0;
    }

    document.getElementById("turno").textContent =
        "🎮 Turno de " +
        jugadores[jugadorActual].nombre;

}


// ========================================
// PREGUNTAS
// ========================================

const preguntas = [

    // ===== PRINCIPIOS GENERALES =====

    {
        pregunta: "¿Qué artículo trata sobre los Derechos Humanos?",
        respuestas: [
            "Artículo 1",
            "Artículo 2",
            "Artículo 3",
            "Artículo 5"
        ],
        correcta: 0
    },

    {
        pregunta: "¿Qué artículo habla sobre el Trabajo Digno?",
        respuestas: [
            "Artículo 1",
            "Artículo 2",
            "Artículo 4",
            "Artículo 8"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la Igualdad?",
        respuestas: [
            "Artículo 2",
            "Artículo 3",
            "Artículo 5",
            "Artículo 7"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo corresponde a la Libertad?",
        respuestas: [
            "Artículo 3",
            "Artículo 4",
            "Artículo 6",
            "Artículo 8"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la Irrenunciabilidad?",
        respuestas: [
            "Artículo 4",
            "Artículo 5",
            "Artículo 6",
            "Artículo 9"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo corresponde a la Supletoriedad?",
        respuestas: [
            "Artículo 5",
            "Artículo 6",
            "Artículo 7",
            "Artículo 10"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la Nacionalidad?",
        respuestas: [
            "Artículo 6",
            "Artículo 7",
            "Artículo 8",
            "Artículo 9"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo define al Trabajador?",
        respuestas: [
            "Artículo 7",
            "Artículo 8",
            "Artículo 9",
            "Artículo 10"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo corresponde al Trabajador de Confianza?",
        respuestas: [
            "Artículo 8",
            "Artículo 9",
            "Artículo 10",
            "Artículo 16"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre el Patrón?",
        respuestas: [
            "Artículo 8",
            "Artículo 9",
            "Artículo 10",
            "Artículo 16"
        ],
        correcta: 2
    },


    // ===== RELACIONES INDIVIDUALES =====

    {
        pregunta: "¿Qué artículo trata sobre el concepto de empresa, establecimiento y entorno laboral?",
        respuestas: [
            "Artículo 10",
            "Artículo 16",
            "Artículo 20",
            "Artículo 21"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo habla sobre la Relación de Trabajo?",
        respuestas: [
            "Artículo 16",
            "Artículo 20",
            "Artículo 21",
            "Artículo 24"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo establece la presunción de la relación laboral?",
        respuestas: [
            "Artículo 20",
            "Artículo 21",
            "Artículo 22",
            "Artículo 25"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre el trabajo de menores?",
        respuestas: [
            "Artículo 21",
            "Artículo 22",
            "Artículo 23",
            "Artículo 29"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la prohibición del trabajo infantil peligroso?",
        respuestas: [
            "Artículo 22",
            "Artículo 22 Bis",
            "Artículo 23",
            "Artículo 24"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la autorización para menores?",
        respuestas: [
            "Artículo 22",
            "Artículo 23",
            "Artículo 24",
            "Artículo 25"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo corresponde al contrato escrito?",
        respuestas: [
            "Artículo 20",
            "Artículo 22",
            "Artículo 24",
            "Artículo 26"
        ],
        correcta: 2
    },

    {
        pregunta: "¿Qué artículo trata sobre el contenido del contrato?",
        respuestas: [
            "Artículo 23",
            "Artículo 24",
            "Artículo 25",
            "Artículo 27"
        ],
        correcta: 2
    },

    {
        pregunta: "¿Qué artículo habla sobre la falta de contrato escrito?",
        respuestas: [
            "Artículo 24",
            "Artículo 25",
            "Artículo 26",
            "Artículo 28"
        ],
        correcta: 2
    },

    {
        pregunta: "¿Qué artículo trata sobre la nulidad de cláusulas del contrato?",
        respuestas: [
            "Artículo 25",
            "Artículo 26",
            "Artículo 27",
            "Artículo 29"
        ],
        correcta: 2
    },


    // ===== DURACIÓN, SUSPENSIÓN, RESCISIÓN Y TERMINACIÓN =====

    {
        pregunta: "¿Qué artículo trata sobre el trabajo fuera del país?",
        respuestas: [
            "Artículo 27",
            "Artículo 28",
            "Artículo 28-A",
            "Artículo 29"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre el reclutamiento regulado en el extranjero?",
        respuestas: [
            "Artículo 28",
            "Artículo 28-A",
            "Artículo 28-B",
            "Artículo 29"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre seguridad social y condiciones dignas en el extranjero?",
        respuestas: [
            "Artículo 28",
            "Artículo 28-A",
            "Artículo 28-B",
            "Artículo 29"
        ],
        correcta: 2
    },

    {
        pregunta: "¿Qué artículo establece las formas de las relaciones laborales?",
        respuestas: [
            "Artículo 29",
            "Artículo 35",
            "Artículo 36",
            "Artículo 37"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo corresponde a la relación por obra determinada?",
        respuestas: [
            "Artículo 35",
            "Artículo 36",
            "Artículo 37",
            "Artículo 38"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la relación por tiempo determinado?",
        respuestas: [
            "Artículo 35",
            "Artículo 36",
            "Artículo 37",
            "Artículo 39"
        ],
        correcta: 2
    },

    {
        pregunta: "¿Qué artículo trata sobre el periodo a prueba?",
        respuestas: [
            "Artículo 39",
            "Artículo 39-A",
            "Artículo 39-B",
            "Artículo 39-C"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo corresponde a la capacitación inicial?",
        respuestas: [
            "Artículo 39-A",
            "Artículo 39-B",
            "Artículo 39-C",
            "Artículo 39-D"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la suspensión temporal?",
        respuestas: [
            "Artículo 41",
            "Artículo 42",
            "Artículo 42 Bis",
            "Artículo 43"
        ],
        correcta: 1
    },

    {
        pregunta: "¿Qué artículo trata sobre la terminación de las relaciones laborales?",
        respuestas: [
            "Artículo 46",
            "Artículo 47",
            "Artículo 51",
            "Artículo 53"
        ],
        correcta: 3
    }

];


// ========================================
// ABRIR PREGUNTA
// ========================================

function abrirPregunta() {

    const pregunta =
        preguntas[Math.floor(Math.random() * preguntas.length)];

    document.getElementById("texto-pregunta").textContent =
        pregunta.pregunta;

    const respuestas =
        document.getElementById("respuestas");

    respuestas.innerHTML = "";

    pregunta.respuestas.forEach(function(respuesta, indice) {

        const boton = document.createElement("button");

        boton.textContent = respuesta;

        boton.addEventListener("click", function() {

            if (indice === pregunta.correcta) {

                jugadores[jugadorActual].puntos += 10;

                alert("✅ ¡Correcto! +10 puntos");

            } else {

                alert("❌ Respuesta incorrecta");

            }

            document.getElementById("ventana-pregunta")
                .classList.add("oculto");

            mostrarJugadores();
            actualizarFichas();

            siguienteJugador();

        });

        respuestas.appendChild(boton);

    });


    document.getElementById("ventana-pregunta")
        .classList.remove("oculto");

}