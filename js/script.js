var limpiar = document.getElementById("limpiar");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var cw = canvas.width = 300, cx = cw / 2;
var ch = canvas.height = 300, cy = ch/2;

var dibujar = false;
var factorDeAlisamiento = 5;
var Trazados = [];
var puntos = [];

ctx.lineJoin = "round";

//*Agregar un evento para limpiar el canvas*/
limpiar.addEventListener('click',function(){
    dibujar = false;
    ctx.clearRect(0,0,cw,ch); //selimpia el canvas
    Trazados.length = 0; //se vacia el historial de trazos
    puntos.length = 0; //se vacia el historial de puntos
},false);

/*agregar evento para el inicio del dibujo */
canvas.addEventListener('mousedown',function(){
    dibujar = true;
    puntos.length = 0;
    ctx.beginPath();
},false);

/*agregar evento para cuando el usuario ha dejado de presionar el raton*/
canvas.addEventListener('mouseup',redibujarTrazados,false);

/*agregar evento para cuando el púntero hasalido del canvas*/
canvas.addEventListener('mouseout',redibujarTrazados,false);

/*agregar evento para el dibujo continuo al mover el raton */
canvas.addEventListener('mousemove',function(evt){
    if(dibujar){
        var m = oMousePos(canvas,evt); //obtener la posicion del puntero del raton
        puntos.push(m); //almacenar la la posicion del punto del raton en un arreglo
        ctx.lineTo(m.x,m.y); //dibujar una linea desde el ultimo punto creado hasta el punto
        ctx.stroke(); //crear el dibujo
    }
},false);

/* funcion para reducir la cantidad de puntos en el trazado*/
function reducirArray(n,elArray){
    let nuevoArray = elArray.filter( (_,i) => i % n === 0); //se filtran los puntos en cada "n" posiciones
    nuevoArray.push(elArray[elArray.length - 1]); //se agrega el ultimo punto al arreglo
    Trazados.push(nuevoArray); //se guarda el trazado realizado en el arreglo de trazado
}

//funcion para calcular el punto de control en la curva de alizamiento
function calcularPuntoDeControl(ry, a, b){
    return {
        x: (ry[a].x + ry[b].x)/2,
        y: (ry[a].y + ry[b].y)/2
    };
}

function alisarTrazado(ry){
    if(ry.length > 1){ //se verifica que existan mas de 1 puntos para realizar el trazado
        var ultimoPunto = ry.length - 1;
        ctx.beginPath();
        ctx.moveTo(ry[0].x,ry[0].y); // Iniciar el trazado desde el primer punto establecido

        for(let i = 1; i < ry.length - 2; i++){
            let pc = calcularPuntoDeControl(ry, i, i + 1); //calcular el punto de control
            ctx.quadraticCurveTo(ry[i].x, ry[i].y, pc.x, pc.y); //dibujar uan curva, desde el punto actual, hasta el punto de control
        }

        //se crea una curva para conectar los puntos
        ctx.quadraticCurveTo(ry[ultimoPunto - 1].x, ry[ultimoPunto - 1].y, ry[ultimoPunto].x, ry[ultimoPunto].y);
        ctx.stroke();
    } 
}

function redibujarTrazados(){
    dibujar = false;
    ctx.clearRect(0,0,cw,ch); //limpiar el canvas
    reducirArray(factorDeAlisamiento,puntos); //reducir la cantidad de puntos
    Trazados.forEach(trazado => alisarTrazado(trazado)); //suavizar y redubujar los trazados
}

function oMousePos(canvas,evt){
    let rect = canvas.getBoundingClientRect(); //se obtienen los limites del canvas
    return {
        x : Math.round(evt.clientX - rect.left),
        y : Math.round(evt.clientY - rect.top) 
    };
}