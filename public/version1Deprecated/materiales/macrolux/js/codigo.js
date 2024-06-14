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

// Inputs solo aceten numeros literalmente que solo acepten 0123456789. y recordar el punto //que solo acepten 4 caraceres
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------
function alpha(e) {
  var k;
  document ? k = e.keyCode : k = e.which;
  return ( (k >= 46 && k <= 57));
}

let limitarCaracteresAlto=document.getElementById('alto_habitacion');
limitarCaracteresAlto.addEventListener('input',function(){
  if (this.value.length > 5)
    this.value = this.value.slice(0,4);
});

let limitarCaracteresAncho=document.getElementById('ancho_habitacion');
limitarCaracteresAncho.addEventListener('input',function(){
  if (this.value.length > 5)
    this.value = this.value.slice(0,4);
});

// Shorthands-------------------------------------------------------------------
document.addEventListener('keydown', selecionarRadioTecla);
function selecionarRadioTecla(e){
  if (e.keyCode == 13) {
    e.path[3].scrollY = 0;
    modalidades();
  }
  if(e.key == "q" || e.key =="Q"){
    modo[0].click();
    ancho_habitacion.focus();
  }
  else if(e.key == "w" || e.key =="W"){
    modo[1].click();
    ancho_habitacion.focus();
  }
  if(e.key == "Delete"){
    limpieza();
  }
}

// Lamar canvas y generar recuadro basico
// -------------------------------------------------------------------------------------------------------------
let d = document.getElementById("canvas");
var lienzo = d.getContext("2d");
let flechas = document.getElementsByName('flechas');

if(window.screen.width<550){
  d.width = (window.screen.width * 0.54);
  d.height = (d.width * 0.625);
  flechas[0].width = d.width;
  flechas[1].height = d.height;
}

let anchoLineaInterna = 2;
let anchoLineaMarco = 8;
let colorCuadricula = '#000';
let colorRellenoPedazos = '#075CF8';
let colorRellenoChasos = '#535353';

lienzo.strokeStyle= colorCuadricula;
lienzo.lineWidth=anchoLineaMarco;
lienzo.strokeRect(0,0,d.width,d.height);

// Objetos y variables globales-
// ---------------------------------------------------------------------------------------------------------------
let cuarto = {
  plancha:0,
  perfilH:0,
  remateU:0,
  cintaAluminio:0,
  cintaVentana:0,
  neoprenos:0,
  botones:0,
  silicon:0,
  alto:0,
  ancho:0,
  perimetroL:0,
  metros2:0
};

let macrolux ={
  alto: 12,
  ancho: 2.10
};

let cinta ={
  largo:45
};

let remateu={
  largo:3.10
};

let tornillo ={
  distancia:0.4
};

let pedazosMacrolux = {
  alto:0,
  ancho:0,
  cantidad:0,
  anchoCanvaPor100to:0,
  altoCanvaPor100to:0,
  anchoCanvaLiteral:0,
  altoCanvaLiteral:0,
};

let chasoLateral = {
  alto:0,
  ancho:0,
  cantidad:0,
  anchoCanvaPor100to:0,
  altoCanvaPor100to:0,
  anchoCanvaLiteral:0,
  altoCanvaLiteral:0
};

let grilla = {
  // filaPedazos:0,
  columnaPedazos:0,
  totalPedazos:0,
  // filaCompleta:0,
  columnaCompleta:0
};

let pedazosXplancha =0;
let pedazosXplanchaChaso=0;
let cantidadUniones=0;
let at;
let contadorchasoLateral=0;
let pies = 3.28084;

let imprimirPies = {
  anchoPedazos:0,
  altoPedazos:0,
  cantidadPedazos:0,
  anchoChaso:0,
  altoChaso:0,
  cantidadChasos:0,

};

let deperdicioss = document.getElementById('deperdicioss');
// let sobrantess = {
//     cantidadPedazos:0,
//     cantidadChasos:0,
//     largoPedazos:0,
//     anchoPedazos:0,
//     largoChasos:0,
//     anchoChasos:0,
// }

let celdaA = document.getElementsByName("celdaA");
let celdaB = document.getElementsByName("celdaB");
let celdaC = document.getElementsByName("celdaC");
let celdaD = document.getElementsByName("celdaD");
let celdaE = document.getElementsByName("celdaE");
let celdaF = document.getElementsByName("celdaF");
let celdaG = document.getElementsByName("celdaG");
let celdaH = document.getElementsByName("celdaH");

// Ejecutar Calculos 1 modalidad 2 run calculos
// ------------------------------------------------------------------------------------------------------------
let modo = document.getElementsByName("modo");
let caja_area2_habitacion = document.getElementById('caja_area2_habitacion');
let caja_perimetro_linear = document.getElementById('caja_perimetro_linear');
let alto_habitacion = document.getElementById('alto_habitacion');
let ancho_habitacion = document.getElementById('ancho_habitacion');

let boton_habitacion = document.getElementById("boton_habitacion");
boton_habitacion.addEventListener('click', modalidades);

modo[0].addEventListener('click', alternalModalidad);
modo[1].addEventListener('click', alternalModalidad);

alto_habitacion.addEventListener('keyup', modalidades);
ancho_habitacion.addEventListener('keyup', modalidades);

let errorMayor12 = document.getElementById('errorMayor12');
let textoErrorMayor12 = document.getElementById('textoErrorMayor12');

let posfijoUM = document.getElementsByName('posfijoUM');

let unidadMedida = ' Mts';
let area2Posfijo = " M²";
let perimetroLPosfijo = " ML";
let uMParrafo = 'mts';

let parrafoLateral = document.getElementsByName('parrafoLateral');

function alternalModalidad(){

  limpieza();
  modalidades();
}

function modalidades(){
  if(modo[0].checked == true){
    textoErrorMayor12.innerText = "El alto no puede ser mayor a 12mts'";

    unidadMedida = ' Mts';
    area2Posfijo = ' M²';
    perimetroLPosfijo = ' ML';
    uMParrafo = 'mts';

    macrolux={
      alto:12,
      ancho:2.10
    };
    cinta.largo = 45;
    remateu.laro=3.10;

    tornillo.distancia = 0.4;

  }

  else if(modo[1].checked==true){
    textoErrorMayor12.innerText = "El alto no puede ser mayor a 39.37'";
    unidadMedida = ' Pies';
    area2Posfijo = ' P²';
    perimetroLPosfijo = ' PL';
    uMParrafo = 'Pies';
    macrolux={
      alto:39.37,
      ancho:6.89
    };
    cinta.largo = 147.638;
    remateu.largo = 10.17;
    tornillo.distancia = 1.31234;
  }
  posfijoUM[0].innerText = unidadMedida;
  posfijoUM[1].innerText = unidadMedida;

  cuarto.alto = alto_habitacion.value;
  cuarto.ancho = ancho_habitacion.value;

  if(alto_habitacion.value >macrolux.alto){
    errorMayor12.classList.add('mostrarError');
    limpieza();
    alto_habitacion.value = cuarto.alto;
    ancho_habitacion.value = cuarto.ancho;
  }

  else if(alto_habitacion.value <=macrolux.alto &&alto_habitacion.value >0){
    errorMayor12.classList.remove('mostrarError');

    posfijoUM[0].innerText = unidadMedida;
    posfijoUM[1].innerText = unidadMedida;

    cuarto.alto = parseFloat(cuarto.alto);
    cuarto.ancho = parseFloat(cuarto.ancho);

    cuarto.metros2 = cuarto.alto*cuarto.ancho;
    cuarto.perimetroL = (cuarto.alto+cuarto.ancho)*2;

    calcular();
  }

}

function calcular(){
  anchoperfectillo = false;

  if(ancho_habitacion.value !== "" && alto_habitacion.value !== "" && ancho_habitacion.value !== 0 && alto_habitacion.value !== 0 && ancho_habitacion.value !== '0' && alto_habitacion.value !== '0'){

    pedazosMacrolux.alto = cuarto.alto;

    pedazosMacrolux.ancho = macrolux.ancho;
    if(cuarto.alto>macrolux.alto){
      pedazosMacrolux.alto = macrolux.alto;
      pedazosMacrolux.alto = parseFloat(pedazosMacrolux.alto);
    }

    if(cuarto.ancho < macrolux.ancho){
      pedazosMacrolux.ancho = cuarto.ancho;
    }

    pedazosMacrolux.alto = parseFloat(pedazosMacrolux.alto);
    grilla.columnaPedazos = Math.floor(cuarto.ancho / macrolux.ancho);
    grilla.columnaPedazos = Math.round(grilla.columnaPedazos);
    // grilla.filaPedazos = 1;

    if(modo[0].checked==true){

      switch (cuarto.ancho) {
      case 14.7:
        console.log(8997979797);
        grilla.columnaPedazos = 7;
        break;
      case 18.9:
        grilla.columnaPedazos = 9;
        break;
      case 29.4:
        grilla.columnaPedazos = 14;
        break;
      case 37.8:
        grilla.columnaPedazos = 18;
        break;
      case 48.3:
        grilla.columnaPedazos = 26;
        break;
      case 58.8:
        grilla.columnaPedazos = 28;
        break;
      case 60.9:
        grilla.columnaPedazos = 29;
        break;

      default:
        break;
      }

    }
    if(grilla.columnaPedazos<1){
      grilla.columnaPedazos =1;
    }

    // pedazosMacrolux.cantidad = 7 * 1 ;
    pedazosMacrolux.cantidad = grilla.columnaPedazos * 1 ;

    pedazosXplancha = macrolux.alto / pedazosMacrolux.alto;
    pedazosXplancha = Math.floor(pedazosXplancha);

    chasoLateral.alto = pedazosMacrolux.alto;

    pedazosXplanchaChaso = macrolux.alto / chasoLateral.alto;
    pedazosXplanchaChaso = Math.floor(pedazosXplanchaChaso);

    chasoLateral.ancho = cuarto.ancho - (grilla.columnaPedazos * pedazosMacrolux.ancho);
    chasoLateral.ancho = chasoLateral.ancho.toFixed(4);
    chasoLateral.ancho = parseFloat(chasoLateral.ancho);

    if(chasoLateral.ancho >0){
      chasoLateral.cantidad = 1 ;

    }
    else{
      chasoLateral.cantidad=0;
    }

    cantidadUniones=(pedazosMacrolux.cantidad + chasoLateral.cantidad)-1;

    pedazosMacrolux.anchoCanvaPor100to = pedazosMacrolux.ancho / cuarto.ancho;

    pedazosMacrolux.altoCanvaPor100to = pedazosMacrolux.alto / pedazosMacrolux.alto;
    pedazosMacrolux.anchoCanvaLiteral = (pedazosMacrolux.anchoCanvaPor100to) * (d.width);
    pedazosMacrolux.altoCanvaLiteral = (pedazosMacrolux.altoCanvaPor100to) * (d.height);

    chasoLateral.anchoCanvaPor100to = chasoLateral.ancho / cuarto.ancho;
    chasoLateral.altoCanvaPor100to = chasoLateral.alto / chasoLateral.alto;
    chasoLateral.anchoCanvaLiteral = (chasoLateral.anchoCanvaPor100to) * (d.width);
    chasoLateral.altoCanvaLiteral = (chasoLateral.altoCanvaPor100to) * (d.height);

    if(cuarto.alto>macrolux.alto){
      pedazosMacrolux.altoCanvaPor100to = macrolux.alto / cuarto.alto;
      pedazosMacrolux.altoCanvaLiteral = pedazosMacrolux.altoCanvaPor100to * d.height;
      chasoLateral.altoCanvaPor100to = macrolux.alto / cuarto.alto;
      chasoLateral.altoCanvaLiteral = chasoLateral.altoCanvaPor100to * d.height;

    }
    // formula pasada por navill, yo utilizare una formula creada por mi mismo que me parece mas simple
    // cuarto.plancha = (pedazosMacrolux.cantidad / pedazosXplancha) + ((chasoLateral.ancho*chasoLateral.alto)/(macrolux.ancho*macrolux.alto));
    // cuarto.plancha = cuarto.plancha.toFixed(4);
    // cuarto.plancha = cuarto.plancha*100;
    // cuarto.plancha = Math.ceil(cuarto.plancha)
    // cuarto.plancha = cuarto.plancha/100;
    // cuarto.plancha = (Math.ceil(cuarto.plancha/0.5))*0.5;

    // aqui contamos las planchas para los pedazos, luego ahi que sumarle las planchas para los chasos o completivos que sera siempre 1und o 0.5
    cuarto.plancha = pedazosMacrolux.cantidad / pedazosXplancha;
    // sumarle las planchas para los chasso
    cuarto.plancha += (chasoLateral.cantidad / pedazosXplanchaChaso);
    // cuarto.plancha = (Math.ceil(cuarto.plancha/0.5))*0.5;
    cuarto.plancha = cuarto.plancha.toFixed(2);
    cuarto.plancha = parseFloat(cuarto.plancha);

    cuarto.perfilH = (((pedazosMacrolux.cantidad + chasoLateral.cantidad)-1) * pedazosMacrolux.alto) / (macrolux.alto/2);
    cuarto.perfilH = cuarto.perfilH*100;
    cuarto.perfilH = Math.ceil(cuarto.perfilH);
    cuarto.perfilH = cuarto.perfilH/100;
    cuarto.perfilH = cuarto.perfilH.toFixed(4);
    cuarto.perfilH = parseFloat(cuarto.perfilH);
    cuarto.perfilH = Math.ceil(cuarto.perfilH);

    cuarto.remateU = cuarto.perimetroL / remateu.largo;
    cuarto.remateU = Math.ceil(cuarto.remateU);

    // cuarto.neoprenos = ((cuarto.perimetroL/0.4) + (cuarto.ancho/0.4)*cantidadUniones);
    cuarto.neoprenos = (((cuarto.perimetroL/tornillo.distancia) + ((cantidadUniones*cuarto.alto)*2)/tornillo.distancia));
    cuarto.neoprenos = Math.ceil(cuarto.neoprenos);
    cuarto.neoprenos = parseInt(cuarto.neoprenos);

    cuarto.silicon = (((cuarto.perimetroL/20) + ((cantidadUniones*cuarto.alto)*2)/10));
    cuarto.silicon = Math.ceil(cuarto.silicon);
    cuarto.silicon = parseInt(cuarto.silicon);

    cuarto.botones = cuarto.neoprenos;

    cuarto.cintaAluminio = cuarto.ancho / 45;

    cuarto.cintaAluminio = cuarto.cintaAluminio*100;
    cuarto.cintaAluminio = Math.ceil(cuarto.cintaAluminio);
    cuarto.cintaAluminio = cuarto.cintaAluminio/100;
    cuarto.cintaAluminio = cuarto.cintaAluminio.toFixed(2);
    cuarto.cintaAluminio = parseFloat(cuarto.cintaAluminio);

    cuarto.cintaVentana = cuarto.ancho /45;

    cuarto.cintaVentana = cuarto.cintaVentana*100;
    cuarto.cintaVentana = Math.ceil(cuarto.cintaVentana);
    cuarto.cintaVentana = cuarto.cintaVentana/100;
    cuarto.cintaVentana = cuarto.cintaVentana.toFixed(2);
    cuarto.cintaVentana = parseFloat(cuarto.cintaVentana);

    pedazosMacrolux.ancho = parseFloat(pedazosMacrolux.ancho);
    pedazosMacrolux.alto = parseFloat(pedazosMacrolux.alto);

    if(modo[1].checked==true){
      cuarto.silicon = (((cuarto.perimetroL/16.40) + ((cantidadUniones*cuarto.alto)*2)/32.80));
      cuarto.silicon = Math.ceil(cuarto.silicon);
      cuarto.silicon = parseInt(cuarto.silicon);

      cuarto.cintaAluminio = cuarto.ancho / 147.638;

      cuarto.cintaAluminio = cuarto.ancho / 147.638;
      cuarto.cintaAluminio = cuarto.cintaAluminio*100;
      cuarto.cintaAluminio = Math.ceil(cuarto.cintaAluminio);
      cuarto.cintaAluminio = cuarto.cintaAluminio/100;
      cuarto.cintaAluminio = cuarto.cintaAluminio.toFixed(2);
      cuarto.cintaAluminio = parseFloat(cuarto.cintaAluminio);

      cuarto.cintaVentana = cuarto.ancho /147.638;
      cuarto.cintaVentana = cuarto.cintaVentana*100;
      cuarto.cintaVentana = Math.ceil(cuarto.cintaVentana);
      cuarto.cintaVentana = cuarto.cintaVentana/100;
      cuarto.cintaVentana = cuarto.cintaVentana.toFixed(2);
      cuarto.cintaVentana = parseFloat(cuarto.cintaVentana);

    }
    imprimirDato(celdaA[0], cuarto.plancha);
    imprimirDato(celdaB[0], cuarto.perfilH);
    imprimirDato(celdaC[0], cuarto.remateU);
    imprimirDato(celdaD[0], cuarto.neoprenos);
    imprimirDato(celdaE[0], cuarto.silicon);
    imprimirDato(celdaF[0], cuarto.botones);
    imprimirDato(celdaG[0], cuarto.cintaAluminio);
    imprimirDato(celdaH[0], cuarto.cintaVentana);
    cuarto.metros2 = cuarto.metros2.toFixed(2);
    cuarto.metros2 = formatNumber.new(cuarto.metros2, area2Posfijo);

    cuarto.perimetroL = cuarto.perimetroL.toFixed(2);
    cuarto.perimetroL = formatNumber.new(cuarto.perimetroL, perimetroLPosfijo);

    imprimirDato(caja_area2_habitacion, cuarto.metros2);
    imprimirDato(caja_perimetro_linear, cuarto.perimetroL);

    pedazosMacrolux.anchoCanvaLiteral = pedazosMacrolux.anchoCanvaPor100to * d.width;
  }

  if(ancho_habitacion.value !== "" && alto_habitacion.value !== "" && ancho_habitacion.value !== 0 && alto_habitacion.value !== 0 && ancho_habitacion.value !== '0' && alto_habitacion.value !== '0'){

    generarCanvas();
  }

}

function generarCanvas(){
  // if(modo[0].checked==true){

  lienzo.lineWidth=anchoLineaInterna;
  lienzo.clearRect(0,0,d.width,d.height);

  // dibujar pedazos canvas
  for(let o=0; o<1; o++){

    for(i=0;i<grilla.columnaPedazos; i++){
      lienzo.fillStyle = colorRellenoPedazos;
      lienzo.fillRect(pedazosMacrolux.anchoCanvaLiteral*i,pedazosMacrolux.altoCanvaLiteral*o,pedazosMacrolux.anchoCanvaLiteral,pedazosMacrolux.altoCanvaLiteral);
      lienzo.strokeRect(pedazosMacrolux.anchoCanvaLiteral*i,pedazosMacrolux.altoCanvaLiteral*o,pedazosMacrolux.anchoCanvaLiteral,pedazosMacrolux.altoCanvaLiteral);
      contadorchasoLateral = i;
    }
    // }

    //    Dibujar chasos canvas
    lienzo.lineWidth= anchoLineaInterna;
    lienzo.fillStyle= colorRellenoChasos;
    lienzo.strokeRect(0,0,d.width,d.height);
    for(i=0;i<1;i++){
      lienzo.fillRect(pedazosMacrolux.anchoCanvaLiteral*grilla.columnaPedazos,pedazosMacrolux.altoCanvaLiteral* i,chasoLateral.anchoCanvaLiteral,chasoLateral.altoCanvaLiteral);
      lienzo.strokeRect(pedazosMacrolux.anchoCanvaLiteral*grilla.columnaPedazos,pedazosMacrolux.altoCanvaLiteral* i,chasoLateral.anchoCanvaLiteral,chasoLateral.altoCanvaLiteral);
    }

    lienzo.lineWidth=anchoLineaMarco;
    lienzo.strokeRect(0,0,d.width,d.height);
  }

  escribirDibujo();
}

// ****************************************************************************************************************************************************

// escribirDibujo();
function escribirDibujo(){

  pedazosMacrolux.ancho = parseFloat(pedazosMacrolux.ancho);
  pedazosMacrolux.ancho = pedazosMacrolux.ancho.toFixed(2);
  chasoLateral.ancho = parseFloat(chasoLateral.ancho);
  chasoLateral.ancho =chasoLateral.ancho.toFixed(2);

  parrafoLateral[0].innerText = pedazosMacrolux.cantidad + ' pedazos de ' + pedazosMacrolux.ancho + ' x ' + pedazosMacrolux.alto + uMParrafo;
  parrafoLateral[1].innerText = chasoLateral.cantidad + ' completivo de ' + chasoLateral.ancho + ' x ' + chasoLateral.alto + uMParrafo;

  if(pedazosMacrolux.alto == macrolux.alto && pedazosMacrolux.ancho ==macrolux.ancho){
    parrafoLateral[0].innerText = pedazosMacrolux.cantidad + ' planchas completas ';
  }

  if(chasoLateral.cantidad ==0){
    parrafoLateral[1].innerText = 'No se necesita completivo';
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

let btn_limpiar = document.getElementById('btn-limpiar');
btn_limpiar.addEventListener('click', limpieza);

function limpieza(){
  for(i=0; i<parrafoLateral.length;i++){

    parrafoLateral[i].innerText = '';
  }

  lienzo.clearRect(0,0,d.width,d.height);
  lienzo.lineWidth= anchoLineaMarco;
  lienzo.strokeRect(0,0,d.width,d.height);
  ancho_habitacion.value = "";
  alto_habitacion.value = "";
  caja_area2_habitacion.value ='';
  caja_perimetro_linear.value = '';

  imprimirDato(celdaA[0], "");
  imprimirDato(celdaB[0], "");
  imprimirDato(celdaC[0], "");
  imprimirDato(celdaD[0], "");
  imprimirDato(celdaE[0], "");
  imprimirDato(celdaF[0], "");
  imprimirDato(celdaG[0], "");
  imprimirDato(celdaH[0], "");
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

let quince = 15;

function arroz(quince){

  for(i=0; i <d.width; i++){
    dibujarLinea('blue', 0.5, i*quince,0, i*quince,d.height);}

  function dibujarLinea(color, ancho, xi,yi, xf,yf)
  {
    lienzo.beginPath();
    lienzo.strokeStyle=color;
    lienzo.lineWidth=ancho;
    lienzo.moveTo(xi,yi);
    lienzo.lineTo(xf,yf);
    lienzo.stroke();
    lienzo.closePath();
  }
}