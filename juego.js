let puntosA = 0;
let puntosB = 0;
let TiempoA = 0; 
let TiempoB = 0; 
let equipo = "A";
let tiempo = 0;
let intervalo;
let sonidoActivo = true;
let etapa = 1; // Control de la etapa del juego
const prendas = ["Roma", "Aplique", "Regleta", "Bidedo", "Lateral", "COMODIN"];
let cuadrados = [];
let cuadradoActivo = null; // Para saber qué cuadrado se clickeó

// Función para formatear segundos a MM:SS (útil para mostrar totales)
function formatearTiempo(segundosTotales) {
    const min = Math.floor(segundosTotales / 60);
    const seg = segundosTotales % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function cuadricula() {

for (let i = 0; i < 9; i++) {
    const cuadrado = document.createElement("div");
    cuadrado.classList.add("cuadrado");
    cuadrado.addEventListener("click", mostrarPrenda);
    cuadrados.push(cuadrado);
    document.getElementById("grilla").appendChild(cuadrado);
}
}

cuadricula();

// function mostrarPrenda(event) {
//     const cuadrado = event.target;
//     if (cuadrado.classList.contains("bloqueado")) return;
//     cuadrado.classList.add("bloqueado");
//     const prenda = prendas[Math.floor(Math.random() * prendas.length)];
//     document.getElementById("prenda").textContent = prenda;
//     $("#modalPrenda").modal("show");
// }

//
function mostrarPrenda(event) {
    cuadradoActivo = event.target; // Guardamos la referencia al cuadrado clickeado
    if (cuadradoActivo.classList.contains("bloqueado")) return;

    // Reiniciar tiempo y empezar el cronómetro del turno
    tiempo = 0;
    document.getElementById("tiempo").textContent = "00:00"; // Actualizamos el visor inmediatamente

    // Detenemos cualquier intervalo anterior por seguridad y creamos uno nuevo para el turno
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        tiempo++;
        // Usamos la función de formateo para mantener la consistencia
        document.getElementById("tiempo").textContent = formatearTiempo(tiempo);
    }, 1000);

    cuadradoActivo.classList.add("bloqueado");
    
    let prendaTexto = "";
    const contenedorImagenes = document.getElementById("contenedor-imagenes");
    contenedorImagenes.innerHTML = ""; // Limpiar imágenes anteriores

    if (etapa === 1) {
        const prenda = prendas[Math.floor(Math.random() * prendas.length)];
        prendaTexto = prenda;
        
        const img = document.createElement("img");
        img.src = "IMAGES/" + prenda.toLowerCase() + ".jpg";
        img.className = "img-fluid";
        img.style.maxHeight = "200px";
        contenedorImagenes.appendChild(img);
    } else {
        // Etapa 2: Combinatoria
        const p1 = prendas[Math.floor(Math.random() * prendas.length)];
        const p2 = prendas[Math.floor(Math.random() * prendas.length)];
        prendaTexto = `${p1} + ${p2}`;
        
        // Función auxiliar para crear las imágenes
        const crearImg = (nombre) => {
            const img = document.createElement("img");
            img.src = "IMAGES/" + nombre.toLowerCase() + ".jpg";
            img.className = "img-fluid mx-2"; // mx-2 agrega separación horizontal
            img.style.maxHeight = "150px";    // Un poco más pequeñas para que entren bien
            return img;
        };
        
        contenedorImagenes.appendChild(crearImg(p1));
        contenedorImagenes.appendChild(crearImg(p2));
    }
    
    // Actualizar el título del modal con el equipo actual
    document.getElementById("modal-titulo-prenda").textContent = `Etapa ${etapa} - Equipo ${equipo}`;

    document.getElementById("prenda").textContent = prendaTexto;
    $("#modalPrenda").modal("show");
}
document.getElementById("cumple").addEventListener("click", sumarPunto);
document.getElementById("no-cumple").addEventListener("click", noCumple);
document.getElementById("btnSonido").addEventListener("click", toggleSonido);
document.getElementById("btn-comenzar").addEventListener("click", iniciarJuego);

function iniciarJuego() {
    document.getElementById("pantalla-inicio").style.display = "none";
    document.getElementById("pantalla-juego").style.display = "block";
}

function toggleSonido() {
    sonidoActivo = !sonidoActivo;
    const btn = document.getElementById("btnSonido");
    btn.textContent = sonidoActivo ? "SILENCIAR" : "ACTIVAR SONIDO";
    btn.classList.toggle("btn-secondary");
    btn.classList.toggle("btn-danger");
}

function sumarPunto() {
    // Al registrar el punto, detenemos el cronómetro del turno actual.
    clearInterval(intervalo);
    if (sonidoActivo) {
        document.getElementById("sonido-acierto").play();
    }

    // Usamos la referencia directa al cuadrado que se clickeó
    if (cuadradoActivo) {
        cuadradoActivo.classList.add(`equipo-${equipo}`);
        cuadradoActivo.textContent = equipo; // <-- Esto agrega la letra A o B

        // Aplicar estilos de color según el equipo
        if (equipo === 'A') {
            cuadradoActivo.classList.add('equipo-a-color');
        } else {
            cuadradoActivo.classList.add('equipo-b-color');
        }
    }

    // 1. Acumular valores según el equipo actual
    if (equipo === "A") {
        puntosA++;
        TiempoA += tiempo;
        document.getElementById("puntos-a").textContent = puntosA;
        document.getElementById("tiempo-a").textContent = formatearTiempo(TiempoA);
    } else {
        puntosB++;
        TiempoB += tiempo;
        document.getElementById("puntos-b").textContent = puntosB;
        document.getElementById("tiempo-b").textContent = formatearTiempo(TiempoB);
    }
    siguienteTurno();
}

function noCumple() {
    // Detener cronómetro sin sumar puntos ni tiempo
    clearInterval(intervalo);
    if (sonidoActivo) {
        document.getElementById("sonido-error").play();
    }
    siguienteTurno();
}

function siguienteTurno() {
    // 2. Cambiar de turno y cerrar modal actual
    equipo = (equipo === "A") ? "B" : "A";
    cuadradoActivo = null; // Limpiamos la referencia para el siguiente turno
    $("#modalPrenda").modal("hide");

    // 3. Verificar si el juego terminó (Por puntos o porque no hay más cuadrados)
    const cuadradosBloqueados = document.querySelectorAll(".cuadrado.bloqueado").length;
    
    // Ajustamos la condición de victoria/fin de etapa
    // En etapa 1: si se llenan los 9 o alguien hace 8 (casi imposible de remontar en esa grilla, pero seguimos la lógica anterior)
    // En etapa 2: si se llenan los 9 de nuevo o alguien llega a un puntaje inalcanzable (ej: 17, ya que el max total es 18)
    
    const maxPuntosEtapa1 = 8;
    const maxPuntosTotal = 17; // 9 de la etapa 1 + 8 de la etapa 2 (aprox)
    
    const finEtapa1 = etapa === 1 && (cuadradosBloqueados === 9 || puntosA >= 8 || puntosB >= 8);
    const finJuego = etapa === 2 && (cuadradosBloqueados === 9 || puntosA >= 17 || puntosB >= 17);

    if (finEtapa1) {
        iniciarSegundaEtapa();
    } else if (finJuego) {
        
        let mensaje;
        if (puntosA > puntosB) {
            mensaje = "¡El Equipo A gana por puntos!";
        } else if (puntosB > puntosA) {
            mensaje = "¡El Equipo B gana por puntos!";
        } else {
            // Desempate por tiempo si los puntos son iguales
            if (TiempoA < TiempoB) {
                mensaje = `Empate en puntos. ¡Gana Equipo A por velocidad! (${formatearTiempo(TiempoA)} vs ${formatearTiempo(TiempoB)})`;
            } else if (TiempoB < TiempoA) {
                mensaje = `Empate en puntos. ¡Gana Equipo B por velocidad! (${formatearTiempo(TiempoB)} vs ${formatearTiempo(TiempoA)})`;
            } else {
                mensaje = "¡Empate absoluto en puntos y tiempo!";
            }
        }

        // 4. USAR UN TIMEOUT para mostrar el resultado
        // Esto evita el conflicto entre el cierre de un modal y la apertura de otro
        setTimeout(() => {
            document.getElementById("resultado").textContent = mensaje;
            $("#modalResultado").modal("show");
            // Lanzar animación de confeti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 500); // 500ms es suficiente para que el primer modal desaparezca
    }
}

function iniciarSegundaEtapa() {
    etapa = 2;
    
    // Mensaje de transición (usamos el modal de resultado momentáneamente o un alert simple)
    setTimeout(() => {
        alert("¡Fin de la Primera Etapa! \n\nAhora comienza la Etapa 2: PRENDAS COMBINADAS.");
        limpiarTablero();
        
        // Actualizar visualmente para indicar etapa 2
        document.getElementById("pantalla-juego").querySelector("h1").textContent = "JUEGO DE PRENDAS - ETAPA 2";
        document.getElementById("indicador-etapa").textContent = "Etapa 2";
    }, 500);
}

function limpiarTablero() {
    cuadrados.forEach(cuadrado => {
        cuadrado.className = "cuadrado"; // Quita bloqueado, colores de equipo, etc.
        cuadrado.textContent = "";       // Quita A o B
    });
}

   document.getElementById("resetBot").addEventListener("click", EjecutaReset);
   function EjecutaReset() {
        // 1. Detener el cronómetro actual para que no se duplique la velocidad
        clearInterval(intervalo);
        
        puntosA = 0;
        puntosB = 0;
        TiempoA = 0;
        TiempoB = 0;
        tiempo = 0;
        equipo = "A"; // Resetear también a quién le toca
        etapa = 1;    // Volver a etapa 1
        document.getElementById("pantalla-juego").querySelector("h1").textContent = "JUEGO DE PRENDAS";
        document.getElementById("indicador-etapa").textContent = "Etapa 1";

        // 2. Actualizar visualmente
        document.getElementById("puntos-a").innerText = "0";
        document.getElementById("puntos-b").innerText = "0";
        document.getElementById("tiempo-a").innerText = "00:00";
        document.getElementById("tiempo-b").innerText = "00:00";
        document.getElementById("tiempo").innerText = "00:00";
        
        // 3. Limpiar grilla
        const grilla = document.getElementById("grilla");
        while (grilla.firstChild) {
            grilla.removeChild(grilla.firstChild);
        }
        cuadrados = []; // Vaciar el array

        // 4. Recrear grilla y REINICIAR el intervalo
        cuadricula();
        // Ya no se reinicia el intervalo aquí, se hará al iniciar el próximo turno.
    }