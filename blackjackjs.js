let valores = ["as","2","3","4","5","6","7","8","9","10","j","q","k"];
let figuras = ["c","d","p","t"];
var fuente1 = 'img/reverso.jpeg';
var comp = [];
let jugador;
let sumJug;
let sumDeal;
let idPP='ScoreP';
let idPD='ScoreD';
let apuesta;
let coins=100;

function convertirANumero(valor,cantidad) {
    switch (valor) {
        case "j":
        case "q":
        case "k":
            return 10;
        case "as":
            return valorAs(cantidad);
        default:
            return parseInt(valor, 10);
    }
}

function obtenerCarta() {
    // Seleccionar una carta aleatoria que no haya sido seleccionada antes
    let valor, figura, carta;
    do {
        valor = valores[Math.floor(Math.random() * valores.length)];
        figura = figuras[Math.floor(Math.random() * figuras.length)];
        carta = valor + figura;
    } while (comp.includes(carta)); // Repetir hasta obtener una carta no seleccionada

    comp.push(carta);
    return { carta, valor };
}

function iniciar() {
    sumJug = 0;
    sumDeal = 0;
    if(registrarApuesta()){
        //Eliminar cartas anteriores
        limpiar('cartasJug');
        limpiar('cartasDeal');
        limpiar('anuncio');

        // Primera carta del jugador
        cartasAPlayer();

        // Segunda carta del jugador
        cartasAPlayer();

        actualizarPuntaje(idPP,sumJug);

        // Primera carta del dealer
        cartasADealer();

        // Segunda carta del dealer
        cartasADealer();

        actualizarPuntaje(idPD,sumDeal);
        
        deshabilitar('Iniciar');
        habilitar('Carta');
        habilitar('Plantarse');
        habilitar('Duplicar');
        }
}

function deshabilitar(id){
    let boton = document.getElementById(id);
    boton.style.display='none';
}

function habilitar(id){
    let boton = document.getElementById(id);
    boton.style.display='inline-block';
}
function actualizarPuntaje(id,puntaje){
    let ps = document.getElementById(id);
    ps.textContent = 'Puntos: '+ puntaje;
}

function carta(){
    //Dar nueva carta
    cartasAPlayer();

    //Sumar la nueva cantidad
    actualizarPuntaje(idPP,sumJug);
    habilitar('Duplicar');

    //Comprobar si no ha rebasado 21
    comprobarScore(2);
}
function comprobarScore(forma){
    var contenedor = document.querySelector('.anuncio');
    let avisar = document.createElement('h2');
    contenedor.appendChild(avisar);
    if(forma==1){
        if(sumJug == sumDeal){
            avisar.textContent='Empate';
            avisar.style.background='rgba(0, 0, 255, 0.9)';
            coins+=apuesta;
            actuCoins();
        }else if(sumJug<sumDeal && sumDeal<=21){
            avisar.textContent='Perdiste';
            avisar.style.background='rgba(255, 0, 0, 0.9)';
        }else{
            avisar.textContent='Ganaste';
            avisar.style.background='rgba(0, 255, 0, 0.9)';
            apuesta*=2;
            coins+=apuesta;
            actuCoins();
        }
        reiniciar();
    }else if(sumJug>21){
        avisar.textContent='Perdiste';
        avisar.style.background='rgba(255, 0, 0, 0.9)';
        reiniciar();
    }
}
function plantarse(){
    while(sumDeal<sumJug && sumJug<=21){
        cartasADealer();
    }
    actualizarPuntaje(idPD,sumDeal);
    reiniciar();
    comprobarScore(1);
}
function cartasADealer(){
    let dealer=obtenerCarta();
    sumDeal += convertirANumero(dealer.valor,sumDeal);
    var imgD = document.createElement('img');
    imgD.src = 'img/' + dealer.carta + '.jpeg';
    var contenedor = document.querySelector('.cartasDeal'); 
    contenedor.appendChild(imgD);
}
function cartasAPlayer(){
    jugador = obtenerCarta();
    sumJug += convertirANumero(jugador.valor,sumJug);
    var imgJ = document.createElement('img');
    imgJ.src = 'img/' + jugador.carta + '.jpeg';
    var contenedor = document.querySelector('.cartasJug'); 
    contenedor.appendChild(imgJ);
}
function reiniciar(){
    habilitar('Iniciar');
    deshabilitar('Carta');
    deshabilitar('Plantarse');
    deshabilitar('Duplicar');
    limpiar('apostar');
    var contenedor = document.querySelector('.apostar');
    let strong = document.createElement('strong');
    contenedor.appendChild(strong);
    strong.textContent='Apuesta ';
    let input = document.createElement('input');
    input.type='number';
    input.id='apuesta';
    input.min='10';
    input.step='10';
    contenedor.appendChild(input);
}
function valorAs(cantidad){
    if(cantidad<=10){
        return 11;
    }else{
        return 1;
    }
}

function registrarApuesta() {
    let apuestaRegistrada=false;
    // Obtener el valor de la apuesta
    apuesta = document.getElementById('apuesta').value;
    let apostar=document.getElementById('apostar');
    let dinero=document.getElementById('dinero');

    // Verificar si la apuesta ya ha sido registrada
    if (apuesta<10) {
        mostrarAlerta('Apuesta mínima 10 pejecoins');
        apostar.style.background='red';
        apostar.style.color='white';
        dinero.style.background='none';
    } else if(apuesta<=coins){
        limpiar('apostar');
        var contenedor = document.querySelector('.apostar');
        let valor = document.createElement('strong');
        valor.id='sumApuesta';
        contenedor.appendChild(valor);
        coins-=apuesta;
        actuCoins();

        // Realiza acciones con la apuesta (puedes enviarla a un servidor, almacenarla, etc.)
        valor.textContent = 'Apuesta registrada: $' + apuesta;

        // Marca la apuesta como registrada
        apuestaRegistrada = true;

        apostar.style.background='white';
        apostar.style.color='black';
        dinero.style.background='none';
    }else{
        mostrarAlerta('No cuentas con suficientes fondos');
        apostar.style.background='white';
        apostar.style.color='black';
        dinero.style.background='red';

    }
    return apuestaRegistrada;
}
function limpiar(id){
    var contenedor = document.getElementById(id);

    // Eliminar todas las imágenes en el contenedor
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}
function doble(){
    coins-=apuesta;
    actuCoins();
    apuesta *=2;
    let texto = document.getElementById('sumApuesta');
    texto.textContent='Apuesta registrada: '+apuesta;
    deshabilitar('Duplicar');
}
function actuCoins(){
    let dinero = document.getElementById('dinero');
    dinero.textContent='Pejecoins: '+coins;
}

// Función para mostrar la alerta
function mostrarAlerta(mensaje) {
    // Obtener el contenedor de la alerta y el fondo oscuro
    var alertContainer = document.getElementById('alerta');
    var aviso=document.getElementById('aviso');
    aviso.textContent=mensaje;
    var overlay = document.getElementById('overlay');

    // Mostrar el fondo oscuro
    overlay.style.display = 'block';

    // Mostrar el contenedor de la alerta
    alertContainer.style.display = 'block';
}

// Función para ocultar la alerta
function ocultarAlerta() {
    // Obtener el contenedor de la alerta y el fondo oscuro
    var alertContainer = document.getElementById('alerta');
    var overlay = document.getElementById('overlay');

    // Ocultar el contenedor de la alerta y el fondo oscuro
    alertContainer.style.display = 'none';
    overlay.style.display = 'none';
}