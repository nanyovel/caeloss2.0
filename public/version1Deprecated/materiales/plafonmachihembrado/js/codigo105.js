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

// Esto es para que los inputs solo aceten numeros literalmente, es decir un input de type number acepta la letra e, signo +, signo - etc, el objetivo de esta funcion es que solo acepten 0123456789. y recordar el punto
function alpha(e) {
  var k;
  document ? k = e.keyCode : k = e.which;
  return ( (k >= 46 && k <= 57));
}

// Shorthands
document.addEventListener('keydown', selecionarRadioTecla);
function selecionarRadioTecla(e){
  if(e.key == "q" || e.key =="Q"){
    modo[0].click();
    ancho_habitacion[0].focus();
  }
  else if(e.key == "w" || e.key =="W"){
    modo[1].click();
    ancho_habitacion[0].focus();
  }
  else if(e.key == "m" || e.key =="M"){
    copiarTabla();
  }

  else if(e.key == "Shift"){
    slideThree.click();

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

// variables globales
let var_area2 = 0;
let var_perimetroL = 0;
let imas1;
let anchoInvertido;
let largoInvertido;
let anchoMasLargo;
let largoMasCorto;

let pedazos = {
  cantidadXplancha:0,
  cantidadTotal:0,
  tamano:0,
  cantidadXlinea:0,
  totalLineas:0
};

const trozos = [];
trozos.push(pedazos);

// let pedazosAngularesArray = [];

// let pedazosAngulares0 = new pedazosAngulares(0,0)
// let pedazosAngulares1 = new pedazosAngulares(0,0)
// let pedazosAngulares2 = new pedazosAngulares(0,0)
// let pedazosAngulares3 = new pedazosAngulares(0,0)
// let pedazosAngulares4 = new pedazosAngulares(0,0)
// let pedazosAngulares5 = new pedazosAngulares(0,0)
// let pedazosAngulares6 = new pedazosAngulares(0,0)

class pedazosAngulares{
  constructor(cantidad,largo){
    this.cantidad = cantidad;
    this.largo = largo;
  }

}

let siguienteHab;
let nombreSiguienteHabitacion;
let nodoNuevoCopia;
let caja_inputs_uno = document.getElementById('caja_inputs_uno');
let cajaUltimaInput = document.getElementById('cajaUltimaInput');
let copia_encabezado;
let medidaN = "D";

let undM = '';

let copiaCeldaA;
let copiaCeldaB;
let copiaCeldaC;
let copiaCeldaD;
let copiaCeldaE;
let copiaCeldaF;
let copiaCeldaG;
let copiaCeldaH;
let copiaCeldaI;
// let copiaCeldaJ;

let ancho_habitacion = document.getElementsByName('ancho_habitacion');
let largo_habitacion = document.getElementsByName('largo_habitacion');
let caja_area2_habitacion = document.getElementsByName('caja_area2_habitacion');
let caja_perimetro_linear = document.getElementsByName('caja_perimetro_linear');
let parrafo = document.createElement('p');
let modo = document.getElementsByName("modo");
let unidadMedida;
let cuadrado2;
let lineales;
let a2EnMetros = document.getElementById("a2EnMetros");
let padreInput = document.getElementById("padreInput");
let cotejoBien = document.getElementsByName("cotejoBien");
let xMal = document.getElementsByName("xMal");
let slideThree = document.getElementById('slideThree');
let montoAhorrar = document.getElementById('montoAhorrar');
let datoMontoAhorra = 0;

let pedasosSlave;
let cantidadPedasosXplanchaSlave;
let tamanoPedasosSlave;
let precioMasterTotal = 0;
let precioSlaveTotal = 0;
let precioMasterTotalGeneral = 0;
let precioSlaveTotalGeneral = 0;
let h3TituloAhorro = document.getElementById('h3TituloAhorro');
let slaveCalculado = 0;

let padre_celdaA = document.getElementById("padre_celdaA");
let padre_celdaB = document.getElementById("padre_celdaB");
let padre_celdaC = document.getElementById("padre_celdaC");
let padre_celdaD = document.getElementById("padre_celdaD");
let padre_celdaE = document.getElementById("padre_celdaE");
let padre_celdaF = document.getElementById("padre_celdaF");
let padre_celdaH = document.getElementById("padre_celdaH");
let padre_celdaI = document.getElementById("padre_celdaI");

let padre_encabezado = document.getElementById('padre_encabezado');
let encabezadoUno =document.getElementById('encabezadoUno');
let cajaCeldaA = document.getElementsByName('celdaA');
let cajaCeldaB = document.getElementsByName('celdaB');
let cajaCeldaC = document.getElementsByName('celdaC');
let cajaCeldaD = document.getElementsByName('celdaD');
let cajaCeldaE = document.getElementsByName('celdaE');
let cajaCeldaF = document.getElementsByName('celdaF');
let cajaCeldaG = document.getElementsByName('celdaG');
let cajaCeldaH = document.getElementsByName('celdaH');
let cajaCeldaI = document.getElementsByName('celdaI');

let lamina = {
  largo:5.8,
  ancho:0.24,
  largoMinimo:1.20
};

let distancias ={
  maintee:1.22,
  clavitos:0.6,
  alambrito:25,
  unionsita:2.6
};

class Habitaciones{
  constructor(machihembrado,maintee,angularF,fundaClavo,clavoYeso, fulminantes, alambre,tornillo_estructura, unionLamina, ancho, largo, tamanoP){
    this.machihembrado =machihembrado;
    this.maintee =maintee;
    this.angularF =angularF;
    this.fundaClavo =fundaClavo;
    this.clavoYeso =clavoYeso;
    this.fulminantes =fulminantes;
    this.alambre =alambre;
    this.tornillo_estructura =tornillo_estructura;
    this.unionLamina =unionLamina;
    this.ancho = ancho;
    this.largo = largo;
    this.tamanoP = tamanoP;
  }
  area2(){
    return this.ancho * this.largo;
  }
  perimetroL(){
    return (this.ancho + this.largo) * 2;
  }
}

let cuarto = [];

const totalHab = new Habitaciones(0,0,0,0,0,0,0,0,0,0,0,0,0);

// for (let clave in totalHab){
//     console.log(totalHab[clave]);
//   }
//-----------------------------------------------------------------------------------------

let montoMaster = [];

let montoSlave = [];

// -------------------------------------------------------------------------------------------

let precios={
  plancha:611,
  paral:144,
  angularF:231,
  fundaClavo:53,
  clavoYeso: 6.3,
  fulminante: 5.8,
  alambre: 182,
  tornillo:271.7,
  unionLamina:100
};

// Escuchador de eventos de todos los botones de modalidad ML, PL y el algoritmo para que se ejecuten correctamente
for(i=0;i<modo.length; i++){
  modo[i].addEventListener("click", alternarModalidad);
}
function alternarModalidad(){
  // Resetear economia
  if(btnEconomia.checked == true){
    slideThree.click();
    limpieza();
    slideThree.click();
  }
  // Resetear imagenes de direciones etc
  for(i=0; i<ancho_habitacion.length; i++){
    cotejoBien[i].classList.add("noVista");
    xMal[i].classList.add("noVista");
    check_direccion[i].checked = false;
    img_direcion[i].classList.add('desaparecer');

  }
  // Definir modalidad metros o pies
  // for(i=0; i<padre_encabezado.childElementCount-2; i++){

  //     if (modo[0].checked == true){ //1 Inicio // Metros lineales
  //         cuadrado2 = "M²"
  //         lineales = "Perimetro L"
  //     }
  //    else if(modo[1].checked == true){//2 Pies lineales
  //     // cuadrado2 = "Pies2";
  //     // lineales = "Perimetro L"
  //     }

  //     a2EnMetros.innerText = cuadrado2;
  // }
  limpieza();
}

// Economía interruptor
let btnEconomia = document.getElementById('btnEconomia');
btnEconomia.checked = true;
btnEconomia.addEventListener('click', compararCalculos);

function compararCalculos(){

  precioMasterTotalGeneral = 0;
  precioSlaveTotalGeneral = 0;
  for(i=0; i<ancho_habitacion.length; i++){
    precioMasterTotal = 0;
    precioSlaveTotal = 0;

    if(ancho_habitacion[i].value == '' || largo_habitacion[i].value == ''){
      continue;
    }
    precioMasterTotal = sumarPrecios(montoMaster);
    precioSlaveTotal = sumarPrecios(montoSlave);

    function sumarPrecios(objeto){
      return objeto[i].machihembrado + objeto[i].maintee + objeto[i].angularF + objeto[i].fundaClavo + objeto[i].clavoYeso + objeto[i].fulminantes + objeto[i].tornillo_estructura + objeto[i].unionLamina;

    }

    if(btnEconomia.checked == true){
      if(precioSlaveTotal < precioMasterTotal){
        xMal[i].classList.remove("noVista");
        cotejoBien[i].classList.add("noVista");
      }
      else if(precioMasterTotal < precioSlaveTotal){
        xMal[i].classList.add("noVista");
        cotejoBien[i].classList.remove("noVista");
      }
      else if(ancho_habitacion[i].value == '' || largo_habitacion[i].value == ''){
        continue;
      }
      else if(precioSlaveTotal == precioMasterTotal){
        xMal[i].classList.add("noVista");
        cotejoBien[i].classList.remove("noVista");
      }

    }
    else if(btnEconomia.checked == false){
      datoMontoAhorra = 0;
      montoAhorrar.innerText = "+0%";
      xMal[i].classList.add("noVista");
      cotejoBien[i].classList.add("noVista");

    }

    precioMasterTotalGeneral += precioMasterTotal;
    precioSlaveTotalGeneral += precioSlaveTotal;
    if(ancho_habitacion[i].value !== '' && largo_habitacion[i].value !== '' && btnEconomia.checked == true){
      datoMontoAhorra = precioSlaveTotalGeneral - precioMasterTotalGeneral;

      datoMontoAhorra = datoMontoAhorra / precioSlaveTotalGeneral;
      datoMontoAhorra = datoMontoAhorra.toFixed(2);
      datoMontoAhorra = datoMontoAhorra*100;
      datoMontoAhorra = Math.ceil(datoMontoAhorra);

    }
    escribirAhorro();

  }

  function escribirAhorro(){
    if(datoMontoAhorra >=0){
      h3TituloAhorro.innerText = 'Ahorro';
      montoAhorrar.classList.remove('textoColorRojo');
      montoAhorrar.innerText = '+'+ datoMontoAhorra + '%';

    }
    else if(datoMontoAhorra < 0){
      h3TituloAhorro.innerText = 'Perdida';
      montoAhorrar.classList.add('textoColorRojo');
      montoAhorrar.innerText = datoMontoAhorra + '%';

    }
  }
}

//direccion del machihembrado
let img_direcion = document.getElementsByName('img_direcion');
let check_direccion = document.getElementsByName('check_direccion');
check_direccion[0].addEventListener('click', cambiarDireccion);
check_direccion[1].addEventListener('click', cambiarDireccion);

function cambiarDireccion(){
  for(i=0; i<img_direcion.length; i++ ){
    if(check_direccion[i].checked == true){
      img_direcion[i].classList.remove("desaparecer");
      // img_direcion[i].classList.toggle('desaparecer');
    }
    else if(check_direccion[i].checked == false){
      img_direcion[i].classList.add("desaparecer");
      // img_direcion[i].classList.toggle('desaparecer');
    }
  }
  calcular();
}

// Funcion calcular FUNCION PRINCIPAL
let btn_calcular = document.getElementById('btn_calcular');
btn_calcular.addEventListener('click', calcular);
let calculoRealizado=false;

function calcular(){
  limpieza('no');
  while(cuarto.length<ancho_habitacion.length){
    cuarto.push(new Habitaciones);
    montoSlave.push(new Habitaciones);
    montoMaster.push(new Habitaciones);

  }

  if(modo[1].checked==true){
    lamina = {
      largo:19,
      ancho:0.7874016,
      largoMinimo: 3.93701
    };
    distancias={
      maintee:4.0016,
      clavitos:1.9685,
      alambrito:82.021,
      unionsita:8.53018
    };
  }
  else if(modo[0].checked==true){
    lamina = {
      largo:5.8,
      ancho:0.24,
      largoMinimo:1.20
    };

    distancias ={
      maintee:1.22,
      clavitos:0.6,
      alambrito:25,
      unionsita:2.6
    };
  }

  ejecucionCalculo(cuarto);
  function ejecucionCalculo(objeto){
    for(let q=0; q<2;q++){

      for(i=0;i<ancho_habitacion.length;i++){

        // if(modo[1].checked == true){
        //     objeto[i].ancho = ancho_habitacion[i].value * 0.3048;
        //     objeto[i].largo = largo_habitacion[i].value * 0.3048;
        // }
        // else if(modo[0].checked == true){
        objeto[i].ancho = ancho_habitacion[i].value;
        objeto[i].largo = largo_habitacion[i].value;
        // }

        console.log(objeto[i].ancho);
        console.log(objeto[i].largo);
        if(objeto[i].ancho == "" ||objeto[i].largo == ""||objeto[i].largo == 0 || objeto[i].ancho ==0){
          // calculoRealizado=false
          continue;
        }
        else{
          console.log('assdsd');
          calculoRealizado=true;

        }
        objeto[i].ancho = parseFloat(objeto[i].ancho);
        objeto[i].largo = parseFloat(objeto[i].largo);

        if(objeto[i].ancho > objeto[i].largo){
          anchoMasLargo = objeto[i].largo;
          largoMasCorto = objeto[i].ancho;

          objeto[i].largo = largoMasCorto;
          objeto[i].ancho = anchoMasLargo;
        }

        // Estos dos bloques de codigos son importantes, sirven para que el algoritmo sepa que debe hacer dos calculos tomando la misma formula solo que la primera vez con los valores alreves y la segunda con los varores correcto, ambas veces el algoritmo lo guarda en los objetos montoSlave y montoMaster, etc etc
        if(check_direccion[i].checked == true ){

          if(q==0 ){
            // largoInvertido = objeto[i].ancho;
            // anchoInvertido = objeto[i].largo;

            // objeto[i].ancho = anchoInvertido;
            // objeto[i].largo = largoInvertido;
          }

          else if(q==1 ){

            largoInvertido = objeto[i].ancho;
            anchoInvertido = objeto[i].largo;

            objeto[i].ancho = anchoInvertido;
            objeto[i].largo = largoInvertido;

          }
        }

        if(check_direccion[i].checked == false ){

          if(q==0 ){
            largoInvertido = objeto[i].ancho;
            anchoInvertido = objeto[i].largo;

            objeto[i].ancho = anchoInvertido;
            objeto[i].largo = largoInvertido;
          }

          else if(q==1 ){
            // largoInvertido = objeto[i].ancho;
            // anchoInvertido = objeto[i].largo;

            // objeto[i].ancho = anchoInvertido;
            // objeto[i].largo = largoInvertido;

          }
        }

        pedazos.totalLineas = Math.ceil(objeto[i].largo / lamina.ancho);

        // if(objeto[i].ancho>5.80){
        pedazos.tamano = objeto[i].ancho;
        if(objeto[i].ancho>lamina.largo){
          pedazos.tamano = Math.ceil(objeto[i].ancho/lamina.largo);
          pedazos.tamano = objeto[i].ancho/ pedazos.tamano;
        }

        pedazos.cantidadXplancha = Math.floor(lamina.largo/objeto[i].ancho);
        if(objeto[i].ancho>lamina.largo){
          pedazos.cantidadXplancha =1;
        }

        pedazos.cantidadXlinea = objeto[i].ancho / pedazos.tamano;
        pedazos.cantidadTotal = pedazos.cantidadXlinea * pedazos.totalLineas;
        // }

        objeto[i].machihembrado = pedazos.cantidadTotal / pedazos.cantidadXplancha;
        objeto[i].machihembrado = Math.ceil(objeto[i].machihembrado);

        objeto[i].maintee =(objeto[i].largo/distancias.maintee)/0.95;
        objeto[i].maintee = objeto[i].maintee *pedazos.cantidadXlinea;
        objeto[i].maintee = Math.ceil(objeto[i].maintee);

        if(pedazos.tamano <= lamina.largoMinimo){
          objeto[i].maintee = 0;
        }

        objeto[i].angularF = objeto[i].perimetroL() / lamina.largo;
        objeto[i].angularF = Math.ceil(objeto[i].angularF);

        objeto[i].fundaClavo = objeto[i].perimetroL() /distancias.clavitos/100;
        objeto[i].fundaClavo = Math.ceil(objeto[i].fundaClavo * 10) /10;

        objeto[i].clavoYeso = objeto[i].maintee * 3;
        objeto[i].clavoYeso = Math.ceil(objeto[i].clavoYeso);

        objeto[i].fulminantes = objeto[i].maintee * 3;
        objeto[i].fulminantes = Math.ceil(objeto[i].fulminantes);

        objeto[i].alambre = objeto[i].area2() / distancias.alambrito;
        objeto[i].alambre = Math.ceil(objeto[i].alambre);

        objeto[i].tornillo_estructura = objeto[i].maintee /380;
        objeto[i].tornillo_estructura = Math.ceil(objeto[i].tornillo_estructura * 10) /10;

        objeto[i].unionLamina=0;

        if(objeto[i].ancho > lamina.largo){

          objeto[i].unionLamina = objeto[i].largo / distancias.unionsita;
          objeto[i].unionLamina = objeto[i].unionLamina* (Math.floor(objeto[i].ancho/lamina.largo));

        }

        if(check_direccion[i].checked == true){
          if(objeto[i].ancho>lamina.largo){

            objeto[i].unionLamina = objeto[i].largo/distancias.unionsita;
            objeto[i].unionLamina = objeto[i].unionLamina* (Math.floor(objeto[i].ancho/lamina.largo));
          }

        }

        objeto[i].unionLamina = objeto[i].unionLamina.toFixed(2);
        objeto[i].unionLamina = parseFloat(objeto[i].unionLamina);

        imprimirTabla();
        function imprimirTabla(){
          // for(i=0;i<ancho_habitacion.length;i++){
          // if(cuarto[i].ancho == "" || cuarto[i].largo== ""){
          //     continue
          // }

          imas1=i+1;
          imprimirDato(cajaCeldaA[imas1], cuarto[i].machihembrado);
          imprimirDato(cajaCeldaB[imas1], cuarto[i].maintee);
          imprimirDato(cajaCeldaC[imas1], cuarto[i].angularF);
          imprimirDato(cajaCeldaD[imas1], cuarto[i].fundaClavo);
          imprimirDato(cajaCeldaE[imas1], cuarto[i].clavoYeso);
          imprimirDato(cajaCeldaF[imas1], cuarto[i].fulminantes);
          imprimirDato(cajaCeldaG[imas1], cuarto[i].tornillo_estructura);
          imprimirDato(cajaCeldaH[imas1], cuarto[i].unionLamina);

          if(modo[0].checked== true){
            undM = 'Mts';
          }
          else if(modo[1].checked==true){
            undM="'";
            console.log(undM);
          }

          pedazos.tamano = pedazos.tamano.toFixed(2);
          pedazos.tamano = parseFloat(pedazos.tamano);
          imprimirDato(cajaCeldaI[imas1], (pedazos.tamano+ undM));

          var_area2= cuarto[i].area2();
          var_area2 = var_area2.toFixed(2);
          var_area2 = formatNumber.new(var_area2, " M²");

          var_perimetroL = cuarto[i].perimetroL();
          var_perimetroL = var_perimetroL.toFixed(2);
          var_perimetroL = formatNumber.new(var_perimetroL, " ML");

          if(modo[1].checked == true){
            var_area2 = ancho_habitacion[i].value *largo_habitacion[i].value;
            anchoArea= parseFloat(ancho_habitacion[i].value);
            largoArea= parseFloat(largo_habitacion[i].value);
            var_area2 = var_area2.toFixed(2);
            var_area2 = formatNumber.new(var_area2, " P²");

            var_perimetroL = (anchoArea + largoArea) *2;
            var_perimetroL = var_perimetroL.toFixed(2);
            var_perimetroL = formatNumber.new(var_perimetroL, " PL");
          }

          imprimirDato(caja_area2_habitacion[i], var_area2);
          imprimirDato(caja_perimetro_linear[i], var_perimetroL);
        // }
        }
      }

      sacarPrecios();

      function sacarPrecios(){
        if(q ==0){

          multiplicarPreciosXcantidad(montoSlave);
        }
        else if(q==1){
          multiplicarPreciosXcantidad(montoMaster);
        }
        function multiplicarPreciosXcantidad(objeto){
          for(i=0;i<ancho_habitacion.length;i++){
            objeto[i].machihembrado = cuarto[i].machihembrado * precios.plancha;
            objeto[i].maintee = cuarto[i].maintee * precios.paral;
            objeto[i].angularF = cuarto[i].angularF * precios.angularF;
            objeto[i].fundaClavo = cuarto[i].fundaClavo * precios.fundaClavo;
            objeto[i].clavoYeso = cuarto[i].clavoYeso * precios.clavoYeso;
            objeto[i].fulminantes = cuarto[i].fulminantes * precios.fulminante;
            objeto[i].tornillo_estructura = cuarto[i].tornillo_estructura * precios.tornillo;
            objeto[i].unionLamina = cuarto[i].unionLamina * precios.unionLamina;
          }
        }

      }

    }

    if(calculoRealizado==true){

      sumarHabitaciones();
    }
  }

  function sumarHabitaciones(){
    // Esto reinicia los valores, de esta manera aunque el usuario le de a calcular 2 veces no sumara dos veces etc
    totalHab.machihembrado =0;
    totalHab.maintee =0;
    totalHab.angularF=0;
    totalHab.fundaClavo =0;
    totalHab.clavoYeso =0;
    totalHab.fulminantes =0;
    // totalHab.alambre =0;
    totalHab.tornillo_estructura =0;
    totalHab.unionLamina =0;

    for(i=0; i<cuarto.length; i++){

      if(cuarto[i].largo == 0 || cuarto[i].ancho ==0 ||cuarto[i].largo == '' ||cuarto[i].ancho ==''){
        continue;
      }

      totalHab.machihembrado += cuarto[i].machihembrado;
      totalHab.maintee += cuarto[i].maintee;
      totalHab.angularF+= cuarto[i].angularF;
      totalHab.fundaClavo += cuarto[i].fundaClavo;

      totalHab.clavoYeso += cuarto[i].clavoYeso;
      totalHab.fulminantes += cuarto[i].fulminantes;

      totalHab.tornillo_estructura += cuarto[i].tornillo_estructura;
      totalHab.unionLamina += cuarto[i].unionLamina;

      // fijarRadio2()
    }

    // totalHab.clavoYeso += cuarto[i].clavoYeso;
    totalHab.clavoYeso = Math.ceil(totalHab.clavoYeso / 10) * 10;
    // totalHab.fulminantes += cuarto[i].fulminantes;
    totalHab.fulminantes = Math.ceil(totalHab.fulminantes / 10) * 10;

    totalHab.fundaClavo = Math.ceil(totalHab.fundaClavo);
    totalHab.tornillo_estructura = Math.ceil(totalHab.tornillo_estructura);

    totalHab.unionLamina = Math.ceil(totalHab.unionLamina);

    for(i=0;i<ancho_habitacion.length;i++){
      if(cuarto[i].largo == 0 || cuarto[i].ancho ==0 ||cuarto[i].largo == '' ||cuarto[i].ancho ==''){
        continue;
      }
      imprimirDato(cajaCeldaA[0], totalHab.machihembrado);
      imprimirDato(cajaCeldaB[0], totalHab.maintee);
      imprimirDato(cajaCeldaC[0], totalHab.angularF);
      imprimirDato(cajaCeldaD[0], totalHab.fundaClavo);
      imprimirDato(cajaCeldaE[0], totalHab.clavoYeso);
      imprimirDato(cajaCeldaF[0], totalHab.fulminantes);
      imprimirDato(cajaCeldaG[0], totalHab.tornillo_estructura);
      imprimirDato(cajaCeldaH[0], totalHab.unionLamina);
      imprimirDato(cajaCeldaI[0], 'N/A');
    }
    // imprimirDato(cajaCeldaI[0], totalHab.unionLamina);
    compararCalculos();
    copiarTabla();
  }

}

let seccion_tabla = document.getElementById('seccion_tabla');
seccion_tabla.addEventListener('click', copiarTabla);

let columnaQty=[];
let columnaCodigo=[];
let strPorta='';
let cajaTextoCopiado = document.getElementById('cajaTextoCopiado');
let cajaTextoNoCopiado = document.getElementById('cajaTextoNoCopiado');

function copiarTabla(e){
  if(calculoRealizado==true && window.screen.width>600){

    columnaQty.length=0;
    columnaCodigo.length =0;
    strPorta = 'Codigo	Cantidad\n';

    columnaCodigo.push(padre_celdaA.firstElementChild.textContent);
    columnaCodigo.push(padre_celdaB.firstElementChild.textContent);
    columnaCodigo.push(padre_celdaC.firstElementChild.textContent);
    columnaCodigo.push(padre_celdaD.firstElementChild.textContent);
    columnaCodigo.push(padre_celdaE.firstElementChild.textContent);
    columnaCodigo.push(padre_celdaF.firstElementChild.textContent);
    columnaCodigo.push(padre_celdaG.firstElementChild.textContent);
    columnaCodigo.push(padre_celdaH.firstElementChild.textContent);

    columnaQty.push(totalHab.machihembrado);
    columnaQty.push(totalHab.maintee);
    columnaQty.push(totalHab.angularF);
    columnaQty.push(totalHab.fundaClavo);
    columnaQty.push(totalHab.clavoYeso);
    columnaQty.push(totalHab.fulminantes);
    columnaQty.push(totalHab.tornillo_estructura);
    columnaQty.push(totalHab.unionLamina);

    for(i=0;i<columnaQty.length && i<columnaCodigo.length;i++){
      if(columnaQty[i]!=0){

        strPorta += columnaCodigo[i] +'	'+columnaQty[i]+'\n';

      }
    }
    navigator.clipboard.writeText(strPorta);
    cajaTextoNoCopiado.classList.add('ocultar');

    cajaTextoCopiado.classList.remove('ocultar');

    setTimeout(()=>{cajaTextoCopiado.classList.add('ocultar');},2500);
    console.log('po');

  }

  else if(calculoRealizado==false && window.screen.width>600){
    cajaTextoCopiado.classList.add('ocultar');
    cajaTextoNoCopiado.classList.remove('ocultar');

    cajaTextoNoCopiado.classList.remove('ocultar');
    setTimeout(()=>{cajaTextoNoCopiado.classList.add('ocultar');},2500);
  }
}

let maxHab=20;
let anchoPermitido=3;

if(window.screen.width>600){

  maxHab =26;
  anchoPermitido=15;

}

// Agregar habitaciones
let btn_mas = document.getElementById('btn_mas');
btn_mas.addEventListener('click', agrearHabitacion);
let btn_menos = document.getElementById("btn_menos");
btn_menos.addEventListener('click', eliminarHabitacion);

function agrearHabitacion(){
  while(cuarto.length<ancho_habitacion.length){
    cuarto.push(new Habitaciones);
    montoSlave.push(new Habitaciones);
    montoMaster.push(new Habitaciones);
  }
  if(ancho_habitacion.length >anchoPermitido){
    document.querySelector('.seccion_tabla').style.overflowX = 'scroll';
  }
  else if(ancho_habitacion.length<17){
    console.log('58');
    document.querySelector('.seccion_tabla').style.overflowX = '';
  }
  nombreSiguienteHabitacion = "habitacion";
  if(padreInput.childElementCount <=maxHab){
    siguienteHab = padre_encabezado.childElementCount -2;
    nodoNuevoCopia = caja_inputs_uno.cloneNode(true);
    borrarDatos(nodoNuevoCopia);

    nodoNuevoCopia.querySelector("label").click();
    padreInput.insertBefore(nodoNuevoCopia, cajaUltimaInput);

    // Esto para que la habitacion que se crea, no copie el estado actual de la hab, sino que salga por default en direccion corto y sin recomendacion
    nodoNuevoCopia.querySelector("label input").checked = false;
    nodoNuevoCopia.querySelectorAll('img')[3].classList.add('desaparecer');
    nodoNuevoCopia.querySelectorAll('img')[0].classList.add('noVista');
    nodoNuevoCopia.querySelectorAll('img')[1].classList.add('noVista');

    crearHabitacion(copia_encabezado, encabezadoUno, padre_encabezado);
    padre_encabezado.lastElementChild.innerHTML = medidaN.concat(siguienteHab);
    // padre_encabezado.lastElementChild.children[0].innerHTML = medidaN.concat(siguienteHab);
    crearHabitacion(copiaCeldaA,cajaCeldaA[1], padre_celdaA);
    crearHabitacion(copiaCeldaB,cajaCeldaB[1], padre_celdaB);
    crearHabitacion(copiaCeldaC,cajaCeldaC[1],padre_celdaC);
    crearHabitacion(copiaCeldaD,cajaCeldaD[1],padre_celdaD);
    crearHabitacion(copiaCeldaE,cajaCeldaE[1],padre_celdaE);
    crearHabitacion(copiaCeldaF,cajaCeldaF[1],padre_celdaF);
    crearHabitacion(copiaCeldaG,cajaCeldaG[1],padre_celdaG);
    crearHabitacion(copiaCeldaH,cajaCeldaH[1],padre_celdaH);
    crearHabitacion(copiaCeldaI,cajaCeldaI[1],padre_celdaI);

    function crearHabitacion(copia,original,padre){
      copia = original.cloneNode(true);
      copia.appendChild(parrafo);

      copia.innerHTML = null;
      padre.appendChild(copia);
      copia.id = copia.id.slice(0,-1);

      copia.id = copia.id.concat(siguienteHab);

    }

    function borrarDatos(elemento){
      for(i=0;i<elemento.childElementCount;i++)
        elemento.children[i].value = null;
    }
  }
  for(i=0; i<check_direccion.length; i++){
    check_direccion[i].addEventListener('click', cambiarDireccion);
  }
}

function eliminarHabitacion(){
  if(ancho_habitacion.length >anchoPermitido){
    document.querySelector('.seccion_tabla').style.overflowX = 'scroll';
  }
  else if(ancho_habitacion.length<17){
    console.log('58');
    document.querySelector('.seccion_tabla').style.overflowX = '';
  }
  nombreSiguienteHabitacion = "habitacion";
  if(padreInput.childElementCount >4){
    padreInput.removeChild(padreInput.children[padreInput.childElementCount-2]);

    // eliminar la info del inner
    padre_encabezado.removeChild(padre_encabezado.children[padre_encabezado.childElementCount-1]);
    padre_celdaA.removeChild(padre_celdaA.children[padre_celdaA.childElementCount-1]);
    padre_celdaB.removeChild(padre_celdaB.children[padre_celdaB.childElementCount-1]);
    padre_celdaC.removeChild(padre_celdaC.children[padre_celdaC.childElementCount-1]);
    padre_celdaD.removeChild(padre_celdaD.children[padre_celdaD.childElementCount-1]);
    padre_celdaE.removeChild(padre_celdaE.children[padre_celdaE.childElementCount-1]);
    padre_celdaF.removeChild(padre_celdaF.children[padre_celdaF.childElementCount-1]);
    padre_celdaG.removeChild(padre_celdaG.children[padre_celdaG.childElementCount-1]);
    padre_celdaH.removeChild(padre_celdaH.children[padre_celdaH.childElementCount-1]);
    padre_celdaI.removeChild(padre_celdaI.children[padre_celdaI.childElementCount-1]);

    // Elimanar los datos internamente al calcular, de esta manera cuando eliminemos habitaciones y le demos a calcular el calculo se hara correctamente
    for(let i =0; i<cuarto.length; i++){
      cuarto[i].machihembrado = "";
      cuarto[i].maintee = "";
      cuarto[i].angularF = "";
      cuarto[i].fundaClavo = "";
      cuarto[i].clavoYeso = "";
      cuarto[i].fulminantes = "";
      cuarto[i].tornillo_estructura = "";
      cuarto[i].unionLamina = "";
    }
  }
  calcular();
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

// BOTON LIMPIAR TODO
let btn_limpiar = document.getElementById('btn-limpiar');
btn_limpiar.addEventListener('click', limpieza);
function limpieza(no){
  if(no !== 'no'){

    for(i=0; i<ancho_habitacion.length;i++){

      ancho_habitacion[i].value = "";
      largo_habitacion[i].value = "";
      caja_area2_habitacion[i].value = "";
      caja_perimetro_linear[i].value = "";
    }
  }
  for(i=0; i<=ancho_habitacion.length;i++){
    imprimirDato(cajaCeldaA[i], "");
    imprimirDato(cajaCeldaB[i], "");
    imprimirDato(cajaCeldaC[i], "");
    imprimirDato(cajaCeldaD[i], "");
    imprimirDato(cajaCeldaE[i], "");
    imprimirDato(cajaCeldaF[i], "");
    imprimirDato(cajaCeldaG[i], "");
    imprimirDato(cajaCeldaH[i], "");
    imprimirDato(cajaCeldaI[i], "");
  }
  for(i=0;i<ancho_habitacion.length;i++){
    xMal[i].classList.add('noVista');
    cotejoBien[i].classList.add('noVista');
  }
  calculoRealizado= false;
}

