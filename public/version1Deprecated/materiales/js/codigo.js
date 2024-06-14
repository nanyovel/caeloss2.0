// utilice esta variable porque he creado un objeto con los inputs, entonces quise poner el total de primero, pero resulta que entonces el total esta en la posicion 0, entonces tengo una incoherencia a la hora de utilizar el siclo y colocarle los datos a cada celda, para ello le sumo 1 con la variable o
let botonMenu = document.getElementById("botonMenu");
let menuM = document.getElementById("menuM");
let chimi = document.getElementById("chimi");
let equis = document.getElementById("equis");

botonMenu.addEventListener("click", mostrar);

function mostrar(){
  menuM.classList.toggle("moverDerecha");
  chimi.classList.toggle("noVisible");
  equis.classList.toggle("noVisible");
}

if(window.screen.width<800){
  document.getElementById('cajaMensajeNovedad').classList.add('ocultarCaja');
}