// Menu hamburguesa
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

// Inputs solo aceten numeros literalmente que solo acepten 0123456789. y recordar el punto--------------------------------------------------------------------------
function alpha(e) {
  var k;
  document ? k = e.keyCode : k = e.which;
  return ( (k >= 46 && k <= 57));
}

// Shorthands
document.addEventListener('keydown', selecionarRadioTecla);
function selecionarRadioTecla(e){
  // if(e.key == "a" || e.key =="A"){
  //     tamano[0].click();
  //     ancho_habitacion[0].focus();
  //    }
  //    else if(e.key == "s" || e.key =="S"){
  //     tamano[1].click();
  //     ancho_habitacion[0].focus();
  //    }
  //    else if(e.key == "d" || e.key =="D"){
  //     tamano[2].click();
  //     ancho_habitacion[0].focus();
  //    }

  if(e.key == "q" || e.key =="Q"){
    modo[0].click();
    ancho_habitacion[0].focus();
  }
  else if(e.key == "w" || e.key =="W"){
    modo[1].click();
    ancho_habitacion[0].focus();
  }
  else if(e.key == "e" || e.key =="E"){
    modo[2].click();
    ancho_habitacion[0].focus();
  }
  else if(e.key == "r" || e.key =="R"){
    modo[3].click();
    ancho_habitacion[0].focus();
  }
  if (e.keyCode == 13) {
    // e.path[3].scrollY = 0;
    calcular();
  }
  if (e.key == "+") {
    agrearHabitacion();
  }

  if (e.key == "-") {
    eliminarHabitacion();
  }

  if(e.key == "Delete"){
    limpieza();
  }
}

// Modalidad ML, PL, M2, P2 y el algoritmo para que se ejecuten correctamente--------------------------------------------------------------------------
let modo = document.getElementsByName("modo");
let caja_area2_habitacion = document.getElementsByName('caja_area2_habitacion');
let caja_perimetro_linear = document.getElementsByName('caja_perimetro_linear');
let ancho_habitacion = document.getElementsByName('ancho_habitacion');
let largo_habitacion = document.getElementsByName('largo_habitacion');
let puertas = document.getElementsByName('puertas');

for(i=0;i<modo.length; i++){
  modo[i].addEventListener("click", alternarModalidad);
}
function alternarModalidad(){
  // Para reinicial varias cosas cada vez que el usuario alterne entre modalidades
  limpiarDatos();
  limpieza();
  caja_error_perimetroLineal.classList.remove('mostrarError');

  for(i=0; i<padreInput.childElementCount-2; i++){

    if (modo[0].checked == true || modo[1].checked == true){ //1 Inicio // Metros lineales / Pies Lineales
      caja_area2_habitacion[i].setAttribute('type', 'text');
      caja_perimetro_linear[i].setAttribute('type', 'text');
      // caja_area2_habitacion[i].setAttribute('placeholder', 'Area 2')
      // caja_perimetro_linear[i].setAttribute('placeholder', 'Perimetro L')
      caja_area2_habitacion[i].disabled = true;
      caja_perimetro_linear[i].disabled = true;
      ancho_habitacion[i].disabled = false;
      largo_habitacion[i].disabled = false;

      caja_area2_habitacion[i].classList.add("cajaInactiva");
      caja_perimetro_linear[i].classList.add("cajaInactiva");
      caja_area2_habitacion[i].classList.remove("cajaActiva");
      caja_perimetro_linear[i].classList.remove("cajaActiva");

      ancho_habitacion[i].classList.add("cajaActiva");
      largo_habitacion[i].classList.add("cajaActiva");
      ancho_habitacion[i].classList.remove("cajaInactiva");
      largo_habitacion[i].classList.remove("cajaInactiva");
    }

    else if(modo[2].checked == true){ //3 Metros cuadrados
      caja_area2_habitacion[i].setAttribute('type', 'number');
      caja_perimetro_linear[i].setAttribute('type', 'number');
      // caja_area2_habitacion[i].setAttribute('placeholder', 'Ingrese M2')
      // caja_perimetro_linear[i].setAttribute('placeholder', 'Ingrese ML');

      caja_area2_habitacion[i].disabled = false;
      caja_perimetro_linear[i].disabled = false;
      caja_area2_habitacion[i].classList.remove("cajaInactiva");
      caja_area2_habitacion[i].classList.add("cajaActiva");
      caja_perimetro_linear[i].classList.remove("cajaInactiva");
      caja_perimetro_linear[i].classList.add("cajaActiva");
      ancho_habitacion[i].disabled = true;
      ancho_habitacion[i].classList.remove("cajaActiva");
      ancho_habitacion[i].classList.add("cajaInactiva");
      largo_habitacion[i].disabled = true;
      largo_habitacion[i].classList.remove("cajaActiva");
      largo_habitacion[i].classList.add("cajaInactiva");
    }
    else if(modo[3].checked == true){ //4 Pies cuadrados

      caja_area2_habitacion[i].setAttribute('type', 'number');
      caja_perimetro_linear[i].setAttribute('type', 'number');
      // caja_area2_habitacion[i].setAttribute('placeholder', 'Ingrese P2')
      // caja_perimetro_linear[i].setAttribute('placeholder', 'Ingrese PL');

      caja_area2_habitacion[i].disabled = false;
      caja_perimetro_linear[i].disabled = false;
      largo_habitacion[i].disabled = true;
      ancho_habitacion[i].disabled = true;

      caja_area2_habitacion[i].classList.remove("cajaInactiva");
      caja_perimetro_linear[i].classList.remove("cajaInactiva");
      caja_area2_habitacion[i].classList.add("cajaActiva");
      caja_perimetro_linear[i].classList.add("cajaActiva");

      ancho_habitacion[i].classList.remove("cajaActiva");
      largo_habitacion[i].classList.remove("cajaActiva");
      ancho_habitacion[i].classList.add("cajaInactiva");
      largo_habitacion[i].classList.add("cajaInactiva");
    }
  }

}

// Tamaño del plafon 2x4, 2x4 cortar a 2x2, 2x2 y su respectiva funcionalidad -------------------------------------------------------------------------------------
let na = "N/A";
let radioSelecionado = true;

let rendimientoInput = document.getElementById('rendimientoInput');
let cajaErrorRendimiento = document.getElementById('cajaErrorRendimiento');

// Agregar y eliminar habitaciones---------------------------------------------------------------------------------------------------------------------------------
let nodoNuevoCopia;
let medidaN = "D";
let siguienteHab;
let idCelditas;
let nombreSiguienteHabitacion = "habitacion";
let copia_encabezado;
let copiaCeldaA;
let copiaCeldaB;
let copiaCeldaC;
let copiaCeldaD;
let copiaCeldaE;
let copiaCeldaF;
// let copiaCeldaG;
// let copiaCeldaH;
// let copiaCeldaI;
// let copiaCeldaJ;

let padre_celdaA = document.getElementById("padre_celdaA");
let padre_celdaB = document.getElementById("padre_celdaB");
// let padre_celdaC = document.getElementById("padre_celdaC");
let padre_celdaD = document.getElementById("padre_celdaD");
// let padre_celdaE = document.getElementById("padre_celdaE");
let padre_celdaF = document.getElementById("padre_celdaF");
// let padre_celdaG = document.getElementById("padre_celdaG");
// let padre_celdaH = document.getElementById("padre_celdaH");
// let padre_celdaI = document.getElementById("padre_celdaI");
// let padre_celdaJ = document.getElementById("padre_celdaJ");

let padre_encabezado = document.getElementById('padre_encabezado');

let padreInput = document.getElementById('container-calcuar');
let caja_copiar = document.getElementById('caja_copiar');
let cajaUltimaInput =document.getElementById('cajaUltimaInput');

let btn_mas = document.getElementById('btn_mas');
btn_mas.addEventListener('click', agrearHabitacion);
let btn_menos = document.getElementById("btn_menos");
btn_menos.addEventListener('click', eliminarHabitacion);

let maxHab=20;
let anchoPermitido=3;

if(window.screen.width>600){
  maxHab =26;
  anchoPermitido=15;
}
let encabezadoCopiar =document.getElementById('encabezadoCopiar');
function agrearHabitacion(){
  while(cuarto.length<ancho_habitacion.length){
    cuarto.push(new Habitaciones);
  }
  if(ancho_habitacion.length >anchoPermitido){
    document.querySelector('.seccion_tabla').style.overflowX = 'scroll';
  }
  else if(ancho_habitacion.length<anchoPermitido){
    console.log('58');
    document.querySelector('.seccion_tabla').style.overflowX = '';
  }

  nombreSiguienteHabitacion = "habitacion";
  if(padreInput.childElementCount <=maxHab ){
    siguienteHab = padre_encabezado.childElementCount -2;
    nombreSiguienteHabitacion = nombreSiguienteHabitacion.concat(siguienteHab);
    nodoNuevoCopia = caja_copiar.cloneNode(true);
    borrarDatos(nodoNuevoCopia);
    padreInput.insertBefore(nodoNuevoCopia, cajaUltimaInput);
    const habitacion3 = new Habitaciones(0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    crearHabitacion(copia_encabezado, encabezadoCopiar, padre_encabezado);
    padre_encabezado.lastElementChild.innerHTML = medidaN.concat(siguienteHab);

    crearHabitacion(copiaCeldaA,cajaCeldaA[1],padre_celdaA);
    crearHabitacion(copiaCeldaB,cajaCeldaB[1],padre_celdaB);
    // crearHabitacion(copiaCeldaC,cajaCeldaC[1],padre_celdaC);
    crearHabitacion(copiaCeldaD,cajaCeldaD[1],padre_celdaD);
    // crearHabitacion(copiaCeldaE,cajaCeldaE[1],padre_celdaE);
    crearHabitacion(copiaCeldaF,cajaCeldaF[1],padre_celdaF);
    // crearHabitacion(copiaCeldaG,cajaCeldaG[1],padre_celdaG);
    // crearHabitacion(copiaCeldaH,cajaCeldaH[1],padre_celdaH);
    // crearHabitacion(copiaCeldaI,cajaCeldaI[1],padre_celdaI);
    // crearHabitacion(copiaCeldaJ,cajaCeldaJ[1],padre_celdaJ);

    function crearHabitacion(copia,original,padre){
      copia = original.cloneNode(true);
      copia.innerHTML = null;
      padre.appendChild(copia);
      copia.id = copia.id.slice(0,-1);
      idCelditas = copia.id.concat(siguienteHab);
      copia.id = idCelditas;

    }

    function borrarDatos(elemento){
      for(i=0;i<elemento.childElementCount;i++)
        elemento.children[i].value = null;
    }
  }
  // fijarRadio2()
}

function eliminarHabitacion(){
  if(ancho_habitacion.length >anchoPermitido){
    document.querySelector('.seccion_tabla').style.overflowX = 'scroll';
  }
  else if(ancho_habitacion.length<anchoPermitido){
    console.log('58');
    document.querySelector('.seccion_tabla').style.overflowX = '';
  }
  nombreSiguienteHabitacion = "habitacion";
  if(padreInput.childElementCount >4){
    padreInput.removeChild(padreInput.children[padreInput.childElementCount-2]);

    padre_encabezado.removeChild(padre_encabezado.children[padre_encabezado.childElementCount-1]);
    padre_celdaA.removeChild(padre_celdaA.children[padre_celdaA.childElementCount-1]);
    padre_celdaB.removeChild(padre_celdaB.children[padre_celdaB.childElementCount-1]);
    // padre_celdaC.removeChild(padre_celdaC.children[padre_celdaC.childElementCount-1])
    padre_celdaD.removeChild(padre_celdaD.children[padre_celdaD.childElementCount-1]);
    // padre_celdaE.removeChild(padre_celdaE.children[padre_celdaE.childElementCount-1])
    padre_celdaF.removeChild(padre_celdaF.children[padre_celdaF.childElementCount-1]);
    // padre_celdaG.removeChild(padre_celdaG.children[padre_celdaG.childElementCount-1])
    // padre_celdaH.removeChild(padre_celdaH.children[padre_celdaH.childElementCount-1])
    // padre_celdaI.removeChild(padre_celdaI.children[padre_celdaI.childElementCount-1])
    // padre_celdaJ.removeChild(padre_celdaJ.children[padre_celdaJ.childElementCount-1])

  }
  limpiarDatos();
  if(radioSelecionado == true){
    calcular();

  }
// fijarRadio2()
}

//enemos dos cosas por un lado cada celda o caja es un objeto donde el total esta en la posicion 0, pero por el otro tenemos el dato que vamos introducir en esa celda, donde el total no es parte del objeto y la posicion 0 corresponde a la primera hab, se hizo de esta manera porque de otra forma cuando sumemos el algoritmo tambien sumaria el total y el total debe estar aparte

let cajaCeldaA = document.getElementsByName('celdaA');
let cajaCeldaB = document.getElementsByName('celdaB');
// let cajaCeldaC = document.getElementsByName('celdaC');
let cajaCeldaD = document.getElementsByName('celdaD');
// let cajaCeldaE = document.getElementsByName('celdaE');
let cajaCeldaF = document.getElementsByName('celdaF');
// let cajaCeldaG = document.getElementsByName('celdaG');
// let cajaCeldaH = document.getElementsByName('celdaH');
// let cajaCeldaI = document.getElementsByName('celdaI');
// let cajaCeldaJ = document.getElementsByName('celdaJ');

class Habitaciones{
  constructor(lamina,zocalo,bajo_piso, silicon,masilla,reducer, t_molding,ancho,largo){
    this.lamina = lamina;
    this.zocalo = zocalo;
    this.bajo_piso = bajo_piso;
    this.silicon = silicon;
    this.masilla = masilla;
    this.reducer = reducer;
    this.t_molding = t_molding;
    this.ancho = ancho;
    this.largo = largo;
  }
  area2(){
    return this.ancho * this.largo;
  }
  perimetroL(){
    return (this.ancho + this.largo) * 2;
  }
}

const totalHab = new Habitaciones(0,0,0,0,0,0,0,0,0,0,0,0,0,0);

// este es el array total, solo tiene los objeto para sumar, el objeto total no es parte de
let cuarto = [];

// Calcular----------------------------------------------------------------------------------------------------------------------------------------------------
let o;
let var_area2 = 0;
let var_perimetroL = 0;
let caja_titulo_tamano = document.getElementById("caja_titulo_tamano");
let caja_error_perimetroLineal = document.getElementById('caja_error_perimetroLineal');
let anchoA;
let largoA;
let metros2 = 0;
let metrosL = 0;
let contadorParaMensajeErrorPerimetroLineal = 0;
// let romo;

let boton_habitacion = document.getElementById('boton_habitacion');
boton_habitacion.addEventListener('click', calcular);

function calcular(){
  limpieza('no');
  while(cuarto.length<ancho_habitacion.length){
    cuarto.push(new Habitaciones);

  }
  contadorParaMensajeErrorPerimetroLineal = 0;

  // Si el usuario no selecionó ningun tamano (2x2, 2x4 cortar a 2x2, 2x2), entonces que salga un mensaje de error en rojo, que indique Seleciona un tamaño
  if(radioSelecionado == false){
    // caja_titulo_tamano.classList.add("mostrarError")
    // window.scrollTo(0, 0);
  }
  // Si el usuario selecionó un tamaño entonces quita el mensaje y calcula
  else if(radioSelecionado == true){
    // caja_titulo_tamano.classList.remove("mostrarError")

    for(i=0;i<ancho_habitacion.length;i++){
      o=i+1;
      if(modo[0].checked == true){ //1 Inicio // Metros lineales
        caja_area2_habitacion[i].value = "";
        caja_perimetro_linear[i].value = "";
        cuarto[i].ancho = ancho_habitacion[i].value;
        cuarto[i].largo = largo_habitacion[i].value;
        metros2 = cuarto[i].ancho *cuarto[i].largo;
        metrosL = parseFloat(cuarto[i].ancho) + parseFloat(cuarto[i].largo);
        metrosL = metrosL *2;

        if(cuarto[i].ancho == "" || cuarto[i].largo == ""){
          continue;
        }
      }

      else if(modo[1].checked == true){ //2 Pies lineales
        caja_area2_habitacion[i].value = "";
        caja_perimetro_linear[i].value = "";
        cuarto[i].ancho = ancho_habitacion[i].value * 0.3048;
        cuarto[i].largo = largo_habitacion[i].value * 0.3048;
        metros2 = cuarto[i].ancho *cuarto[i].largo;
        metrosL = parseFloat(cuarto[i].ancho) + parseFloat(cuarto[i].largo);
        metrosL = metrosL *2;

        if(cuarto[i].ancho == "" || cuarto[i].largo == ""){
          continue;
        }
      }
      else if(modo[2].checked == true){ //3 Metros cuadrados
        metros2 = 0;
        metros2 = caja_area2_habitacion[i].value;

        if(caja_area2_habitacion[i].value == ''){
          metros2 = 99999999999999999999999999999999999;
          continue;
        }

        else{
          metros2 = caja_area2_habitacion[i].value;
        }
        if(caja_perimetro_linear[i].value == ''){
          metrosL = 0;

          // Esto es para que el error cuando el usuario no coloca perimetro linea, funcione correctamente y va amarrado con el if que se activa cuando el contador esta en 0 y esta varias lineas mas abajo y dice "este es JJ"
          contadorParaMensajeErrorPerimetroLineal +=1;
          if(contadorParaMensajeErrorPerimetroLineal > 0){
            window.scrollTo(0, 0);
            caja_error_perimetroLineal.classList.add('mostrarError');
          }

        }
        else{
          metrosL = caja_perimetro_linear[i].value;
        }

        // "este es JJ"
        if(contadorParaMensajeErrorPerimetroLineal == 0){
          console.log("asd");
          window.scrollTo(0, 0);
          caja_error_perimetroLineal.classList.remove('mostrarError');
        }
      }
      else if(modo[3].checked == true){ //4 Pies cuadrados
        metros2 = 0;
        metros2 = caja_area2_habitacion[i].value;

        if(caja_area2_habitacion[i].value == ''){

          continue;
        }

        if(caja_area2_habitacion[i].value == ''){
          metros2 = 0;
        }
        else{
          metros2 = caja_area2_habitacion[i].value * 0.0929;
        }

        if(caja_perimetro_linear[i].value == ''){
          metrosL = 0;
          // Esto es para que el error cuando el usuario no coloca perimetro linea, funcione correctamente y va amarrado con el if que se activa cuando el contador esta en 0 y esta varias lineas mas abajo y dice "este es JJ"
          contadorParaMensajeErrorPerimetroLineal +=1;
          if(contadorParaMensajeErrorPerimetroLineal > 0){

            caja_error_perimetroLineal.classList.add('mostrarError');
          }
        }
        else{
          metrosL = caja_perimetro_linear[i].value * 0.3048;
        }
        // "este es JJ"
        if(contadorParaMensajeErrorPerimetroLineal == 0){
          caja_error_perimetroLineal.classList.remove('mostrarError');
        }

      }

      cuarto[i].ancho = parseFloat(cuarto[i].ancho);
      cuarto[i].largo = parseFloat(cuarto[i].largo);

      if(rendimientoInput.value==""){
        cajaErrorRendimiento.classList.remove('ocultar');
        // limpieza()
        limpiarDatos();
        break;
      }
      else{
        cajaErrorRendimiento.classList.add('ocultar');

      }
      cuarto[i].lamina = metros2/ rendimientoInput.value;
      cuarto[i].lamina = Math.ceil(cuarto[i].lamina);

      cuarto[i].zocalo = metrosL/2.40;
      cuarto[i].zocalo = Math.ceil(cuarto[i].zocalo);

      // cuarto[i].bajo_piso = metros2;
      // cuarto[i].bajo_piso = Math.ceil(cuarto[i].bajo_piso);

      cuarto[i].silicon = metrosL/5;
      cuarto[i].silicon = cuarto[i].silicon.toFixed(2);
      cuarto[i].silicon = parseFloat(cuarto[i].silicon);
      if(cuarto[i].silicon<0.1){
        cuarto[i].silicon=0.1;
      }

      // cuarto[i].masilla = cuarto[i].zocalo/3
      // cuarto[i].masilla = Math.ceil(cuarto[i].masilla);

      cuarto[i].reducer = puertas[i].value / 2.10;
      cuarto[i].reducer = Math.ceil(cuarto[i].reducer);

      imprimirDato(cajaCeldaA[o], cuarto[i].lamina);
      imprimirDato(cajaCeldaB[o], cuarto[i].zocalo);
      // imprimirDato(cajaCeldaC[o], cuarto[i].bajo_piso);
      imprimirDato(cajaCeldaD[o], cuarto[i].silicon);
      // imprimirDato(cajaCeldaE[o], cuarto[i].masilla);
      imprimirDato(cajaCeldaF[o], cuarto[i].reducer);
      // imprimirDato(cajaCeldaG[o], cuarto[i].fundaClavoSinRedondear);
      // imprimirDato(cajaCeldaH[o], cuarto[i].fulminantes);
      // imprimirDato(cajaCeldaI[o], cuarto[i].clavoPlafon);
      // imprimirDato(cajaCeldaJ[o], cuarto[i].alambreSinRedondear);

      // Aqui solo tenemos dos posibles casos, pues aqui se calcula el area cuadrada y el area lineal a partir de el ancho y el largo, en caso de que usuario valla ingresar el area2 y areaL, entonces a raiz de esos datos no debe salir ningun ancho ni largo ni nada, por lo tanto aqui solo deben haber dos casos
      if(modo[0].checked == true){

        var_area2= cuarto[i].area2();
        var_area2 = var_area2.toFixed(2);
        var_area2 = formatNumber.new(var_area2, " M²");
        var_perimetroL = cuarto[i].perimetroL();
        var_perimetroL = var_perimetroL.toFixed(2);
        var_perimetroL = formatNumber.new(var_perimetroL, " ML");
        imprimirDato(caja_area2_habitacion[i], var_area2);
        imprimirDato(caja_perimetro_linear[i], var_perimetroL);
      }

      if(modo[1].checked == true){
        var_area2 = ancho_habitacion[i].value *largo_habitacion[i].value;
        anchoArea= parseFloat(ancho_habitacion[i].value);
        largoArea= parseFloat(largo_habitacion[i].value);
        var_area2 = var_area2.toFixed(2);
        var_area2 = formatNumber.new(var_area2, " P²");

        var_perimetroL = (anchoArea + largoArea) *2;
        var_perimetroL = var_perimetroL.toFixed(2);
        var_perimetroL = formatNumber.new(var_perimetroL, " PL");
        imprimirDato(caja_area2_habitacion[i], var_area2);
        imprimirDato(caja_perimetro_linear[i], var_perimetroL);
      }
    }
    sumarHabitaciones();

    function sumarHabitaciones(){
      totalHab.lamina =0;
      totalHab.zocalo =0;
      totalHab.bajo_piso=0;
      totalHab.silicon =0;
      totalHab.masilla =0;
      totalHab.reducer =0;
      totalHab.fundaClavo =0;
      totalHab.fulminantes =0;
      totalHab.clavoPlafon =0;
      totalHab.alambre =0;

      for(i=0; i<ancho_habitacion.length; i++){

        if(cuarto[i].lamina== undefined){
          continue;
        }
        if(modo[0].checked ==true || modo[1].checked == true){

          if(cuarto[i].largo == 0 || cuarto[i].ancho ==0){
            continue;
          }
        }
        else if(modo[2].checked == true || modo[3].checked == true){
          if(caja_area2_habitacion[i].value == 0 || caja_area2_habitacion[i].value == ''){
            continue;
          }
        }
        totalHab.lamina += cuarto[i].lamina;
        console.log( cuarto[i].lamina);
        totalHab.zocalo += cuarto[i].zocalo;
        totalHab.bajo_piso+= cuarto[i].bajo_piso;
        totalHab.silicon += cuarto[i].silicon;
        totalHab.masilla += cuarto[i].masilla;
        totalHab.reducer += cuarto[i].reducer;

        totalHab.fundaClavo += cuarto[i].fundaClavoSinRedondear;

        totalHab.fulminantes += cuarto[i].fulminantes;
        totalHab.fulminantes = Math.ceil(totalHab.fulminantes / 10) * 10;

        totalHab.clavoPlafon += cuarto[i].clavoPlafon;
        totalHab.clavoPlafon = Math.ceil(totalHab.clavoPlafon / 10) * 10;

        totalHab.alambre += cuarto[i].alambreSinRedondear;

        imprimirDato(cajaCeldaA[0], totalHab.lamina + 'cjas');
        imprimirDato(cajaCeldaB[0], totalHab.zocalo);
        // imprimirDato(cajaCeldaC[0], totalHab.bajo_piso);
        imprimirDato(cajaCeldaD[0], totalHab.silicon);
        // imprimirDato(cajaCeldaE[0], totalHab.masilla);
        imprimirDato(cajaCeldaF[0], totalHab.reducer);

      }

      // fijarRadio2()
    }

  }
}

function imprimirDato(caja,dato){
  if(caja.tagName == "INPUT"){
    caja.value = dato;
  }else if(caja.tagName == "TD" && dato !== ""){

    // dato = Math.ceil(dato);
    caja.innerHTML = dato;
  }
  else if (caja.tagName == "TD" && dato == ""){
    caja.innerHTML = dato;
  }
}

var formatNumber = {
  separador: ",", // separador para los miles
  sepDecimal: '.', // separador para los decimales
  formatear:function (num){
    num +='';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
    }
    return this.simbol + splitLeft +splitRight;
  },
  new:function(simbol, num ){
    this.simbol = simbol ||'';
    return this.formatear(num);
  }
};

let btn_limpiar = document.getElementById('btn-limpiar');
btn_limpiar.addEventListener('click', limpieza);
function limpieza(no){
  if(no !== 'no'){

    for(i=0; i<ancho_habitacion.length;i++){

      ancho_habitacion[i].value = "";
      largo_habitacion[i].value = "";
      puertas[i].value = "";
      caja_area2_habitacion[i].value = "";
      caja_perimetro_linear[i].value = "";
    }
  }
  for(i=0; i<cajaCeldaA.length;i++){
    imprimirDato(cajaCeldaA[i], "");
    imprimirDato(cajaCeldaB[i], "");
    // imprimirDato(cajaCeldaC[i], "")
    imprimirDato(cajaCeldaD[i], "");
    // imprimirDato(cajaCeldaE[i], "")
    imprimirDato(cajaCeldaF[i], "");
    // imprimirDato(cajaCeldaG[i], "")
    // imprimirDato(cajaCeldaH[i], "")
    // imprimirDato(cajaCeldaI[i], "")
    // imprimirDato(cajaCeldaJ[i], "")
  }
}

// limpiarDatos()

function limpiarDatos(){
  for(let i=0; i<cuarto.length; i++){

    for (const arroz in cuarto[i]) {
      cuarto[i][arroz] = 0;
    }
  }
}

// Cosas que debe hacer.
// -Debe sumar los articulos de alto rendimiento, por cada habitacion incluir decimales y en el total redondear hacia arriba
// -Contener comandos de teclado identificados en la pantalla
// -Cuando se elimine una habitacion la app debe sumar solo lo que se esta motrando en pantalla, es decir tienes 3 habitaciones con cantidades ya calculado y eliminas la numero 3, cuando le vuelvas a dar a calcular la app debe sumar solo la 1 y 2, pues la 3 ya no existe
// -Debe salir el Punto pero no el signo mas ni el menos
// -Debe ser descriptiva e intuitiva