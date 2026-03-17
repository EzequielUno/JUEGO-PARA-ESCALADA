let puntosA = 0;
let puntosB = 0;
let TiempoA = 0;
let TiempoB = 0;
let equipo = "A";
let tiempo = 0;
let intervalo;
const prendas = ["Romas", "Apliques", "Regletas", "Bidedos", "Laterales", "COMODIN"];
let cuadrados = [];

for (let i = 0; i < 9; i++) {
    const cuadrado = document.createElement("div");
    cuadrado.classList.add("cuadrado");
    cuadrado.addEventListener("click", mostrarPrenda);
    cuadrados.push(cuadrado);
    document.getElementById("grilla").appendChild(cuadrado);
}

intervalo = setInterval(() => {
    tiempo++;
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    document.getElementById("tiempo").textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}, 1000);

function mostrarPrenda(event) {
    const cuadrado = event.target;
    if (cuadrado.classList.contains("bloqueado")) return;
    cuadrado.classList.add("bloqueado");
    const prenda = prendas[Math.floor(Math.random() * prendas.length)];
    document.getElementById("prenda").textContent = prenda;
    $("#modalPrenda").modal("show");
}

document.getElementById("cumple").addEventListener("click", sumarPunto);

function sumarPunto() {
    if (equipo === "A") {
        puntosA++;
        document.getElementById("puntos-a").textContent = puntosA;
    } else {
        puntosB++;
        document.getElementById("puntos-b").textContent = puntosB;
    }
    equipo = (equipo === "A") ? "B" : "A";
    $("#modalPrenda").modal("hide");
    if (puntosA === 8 || puntosB === 8) {
        clearInterval(intervalo);
        let mensaje;
        if (puntosA > puntosB) {
            mensaje = "El equipo A gana";
        } else if (puntosB > puntosA) {
            mensaje = "El equipo B gana";
        } else {
            mensaje = "Empate, gana el equipo que completó las pruebas en el menor tiempo";
        }
        document.getElementById("resultado").textContent = mensaje;
        $("#modalResultado").modal("show");
            }
        }
