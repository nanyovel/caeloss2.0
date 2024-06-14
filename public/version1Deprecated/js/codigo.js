//grupo01
let precioGasoilh = document.getElementById('precioGasoilh');
precioGasoilh.value = 225;

let truco = document.getElementById('truco');
truco.addEventListener('click', activarCosto);
let costo_container = document.getElementById('costo-container');

function activarCosto(){
  console.log("arrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
  if(truco.checked == true){
    costo_container.classList.add('encajarCosto');
  }
  else if(truco.checked == false){
    costo_container.classList.remove('encajarCosto');
  }
}

let ciudad = document.getElementById("ciudad");
let unidad = document.getElementById("unidad");
let btn_calcular = document.getElementById('btn-calcular');
btn_calcular.addEventListener("click", validar);

let provincia = document.getElementById("provincia");
let precioInicialh = document.getElementById("precio-inicial");
let adicional = document.getElementById("adicional");
let descuento = document.getElementById("descuento");
let precioTotalh =document.getElementById("precio-total");

let combustibleh = document.getElementById("combustibleh");
let peajesh = document.getElementById("peajesh");
let dietah = document.getElementById("dietah");
let depreciacionh = document.getElementById("depreciacionh");
let costoTotalh = document.getElementById("costo-totalh");

let caja_texto_otrosh = document.getElementById("caja_texto_otrosh");
let sub_caja_localmente2 = document.getElementById("sub_caja_localmente2");
let radioAnillo = document.getElementsByName("anillo");
let mensajeOtros = document.getElementById("mensajeOtros");
let atg = document.getElementById("atg");

//grupo02
let localidad_selecionada;
let distanciaIda;
let distanciaIdaDoble;
let distanciaTotal;
let tolerancia = 30;
let camion_selecionado;
let kilometrosXgalon;
let dieta = 750.00;
let resultado;
let combustibleGastado;
let costoCombustible;
let costoTotal;
let peajesReal = 1;
let depreciacion;
let precioInicial = 0;
let precioTotal;
let llenoCiudad = true;
let llenoUnidad = true;
let llenoOtros = true;
let peajePagar;
//se menciona en el grupo03 y grupo06
caja_texto_otrosh.value = "";
let camionOk =false;
let otrosOk = false;
let gasoilOk =false;
//Duarte
let anillo = 0;
let anillo1 = 6;
let anillo2 = 10;
let anillo3 = 15;
let anillo4 = 20;
let radioSelecionado = false;
let numeroIenRadio;
let costoCadaKilometro = 0;

//grupo03
ciudad.addEventListener("change", deslizarOtros);
function deslizarOtros(){
  if(ciudad.value == "local"){
    sub_caja_localmente2.classList.add("aparecer_mover_otros");
    sub_caja_localmente2.classList.remove("quitar_mover_otros");
    dieta = 0;
    limpieza();

  }
  else if(ciudad.value !== "local"){
    sub_caja_localmente2.classList.add("quitar_mover_otros");
    sub_caja_localmente2.classList.remove("aparecer_mover_otros");
    dieta = 750.00;
    caja_texto_otrosh.value = "";
    validar();
  }
}

unidad.addEventListener("change", validar);
// function paraCarcular(){
//     if(ciudad.value !== "local"){
//         validar()
//     }
//     else(ciudad.value == "local"){

//     }
// }

for(i=0; i<radioAnillo.length; i++){
  radioAnillo[i].addEventListener("click", cambiosRadio);
  numeroIenRadio = i;
}
function cambiosRadio(){
  radioAnillo[numeroIenRadio].classList.add("borderP");
  atg.classList.remove("atg");

  caja_texto_otrosh.value = "";
  radioSelecionado = true;
  caja_texto_otrosh.classList.remove("llenar");
  mensajeOtros.classList.remove("mensajeOtrosAparecer");
  validar();
}

document.addEventListener('keydown', selecionarRadioTecla);
function selecionarRadioTecla(e){
  if(e.keyCode == 13){
    validar();
  }

}

function validar(){
  //grupo04
  //Este if es para aquellas localidades que no requieren dieta
  if(ciudad.value == "boca_chica" || ciudad.value == "haina" || ciudad.value == "juan_dolio" || ciudad.value == "pedro_brand" || ciudad.value == "villa_mella" || ciudad.value == "aeropuertoLasAmericas" || ciudad.value == "local"){
    dieta = 0;
  }

  // grupo05

  llenoCiudad = true;
  llenoUnidad = true;
  if(ciudad.value == "local" && caja_texto_otrosh.value == "" && radioSelecionado == false){
    caja_texto_otrosh.classList.add("llenar");
    atg.classList.add("atg");
    llenoCiudad = false;
  }
  else if(ciudad.value == "local" && caja_texto_otrosh.value > 0 && caja_texto_otrosh.value <= 15){
    caja_texto_otrosh.classList.remove("llenar");
    atg.classList.remove("atg");
    mensajeOtros.classList.remove("mensajeOtrosAparecer");
    llenoCiudad = true;
  }
  else if(ciudad.value == "local" && caja_texto_otrosh.value == "" && radioSelecionado == true){
    llenoCiudad = true;
  }
  else if(caja_texto_otrosh.value > 15 || caja_texto_otrosh.value < 0){
    caja_texto_otrosh.classList.add("llenar");
    mensajeOtros.classList.add("mensajeOtrosAparecer");
    llenoCiudad = false;
  }

  if(precioGasoilh.value == "" ){
    precioGasoilh.classList.add("llenar3");
  }
  if(precioGasoilh.value !== "" ){
    precioGasoilh.classList.remove("llenar3");
    gasoilOk = true;
  }

  if(llenoCiudad == true && gasoilOk == true){

    identificarDestino();
  }

}

function identificarDestino(){

  //grupo06
  for(i=0; i<ciudad.length; i++){
    if(ciudad[i].index == ciudad.selectedIndex){
      localidad_selecionada = ciudad[i].value;
      if(llenoCiudad == true && precioGasoilh.value !== ""){

      }
    }

  }
  sacarDistancia();
}
//grupo07
function sacarDistancia(){
  for(i=0; i<ciudad.length; i++){
    if(ciudad.value == "local" && caja_texto_otrosh.value !== ""){
      distanciaIda = caja_texto_otrosh.value;
    }

    //aqui sucede algo que no pude determinar porque pasa, resulta que localidad[i] no deberia funcionar aqui porque localidad[] todavia no existe, sino que este array lo declaro mucho mas para abajo, hice la prueba con un archivo simple y no funcionaba, pero aqui no logre entender porque rayos si funciona,
    else if(ciudad.value !== "local" ){
      distanciaIda = localidad[localidad_selecionada].longitud;
      console.log(ciudad.length);
      // console.log(distanciaIda)
    }
  }
  if(distanciaIda<=10){
    tolerancia = 5;
  }
  else if(distanciaIda > 10 && distanciaIda<=20){
    tolerancia = 10;
  }
  else if(distanciaIda > 20 && distanciaIda<=30){
    tolerancia = 20;
  }
  else if(distanciaIda > 30 && distanciaIda<=40){
    tolerancia = 30;
  }
  else if(distanciaIda >40){
    tolerancia = 40;
  }
  selecionarCamion();

}

//grupo08

function selecionarCamion(){
  for(i=0; i<unidad.length; i++){
    if(unidad[i].index == unidad.selectedIndex-1){
      camion_selecionado = unidad[i+1].value;
      if(camion_selecionado == "patana"){
        peajePagar = "peajePatana";
      }
      else if(camion_selecionado == "rigido"){
        peajePagar = "peajeRigido";
      }
      else if(camion_selecionado == "cama_larga"){
        peajePagar = "peajeCamaLarga";
      }
      else if(camion_selecionado == "camion_pequeno"){
        peajePagar = "peajeCamionPequeno";

      }
      else if(camion_selecionado == "platanera"){
        console;
        peajePagar = "peajePlatanera";

      }
    }
  }
  kilometrosXgalon = camion[camion_selecionado].kmXg;

  formulaFinal();
}

//grupo10
function formulaFinal(){

  if(localidad_selecionada == "local"){
    costoTotal = 0;
    precioInicial = 0;
    peajesReal = 0;
    depreciacion = 0;

    costoCombustible = 0;

    distanciaIda = caja_texto_otrosh.value;
    if(distanciaIda >0 && distanciaIda<= 5){
      radioAnillo[0].checked = true;
    }
    else if(distanciaIda >5 && distanciaIda <= 10 ){
      radioAnillo[1].checked = true;
    }
    else if(distanciaIda > 10 && distanciaIda <= 15 ){
      radioAnillo[2].checked = true;
    }
    // else if(distanciaIda > 15 && distanciaIda <= 20 ){
    //     radioAnillo[3].checked = true
    // }
    else if(distanciaIda > 15 || distanciaIda < 0 ){
      for(i=0; i<radioAnillo.length; i++){
        radioAnillo[i].checked = false;
      }

    }

    if(radioAnillo[0].checked == true){
      precioInicial = camion[camion_selecionado].montoAnillo1;
      costoTotal = camion[camion_selecionado].costoAnillo1;
    }
    else if(radioAnillo[1].checked == true){
      precioInicial = camion[camion_selecionado].montoAnillo2;
      costoTotal = camion[camion_selecionado].costoAnillo2;
    }
    else if(radioAnillo[2].checked == true){
      precioInicial = camion[camion_selecionado].montoAnillo3;
      costoTotal = camion[camion_selecionado].costoAnillo3;
    }
    // else if(radioAnillo[3].checked == true){
    //     precioInicial = camion[camion_selecionado].montoAnillo4;
    //     costoTotal = camion[camion_selecionado].costoAnillo4;
    // }

    if(adicional.value == "" || descuento.value == ""){
      adicional.value=0;
      descuento.value=0;
    }

    precioTotal = precioInicial + parseFloat(adicional.value) - parseFloat(descuento.value);

  }

  else{
    costoTotal = 0;
    precioInicial = 0;
    peajesReal = 0;
    depreciacion = 0;

    costoCombustible = 0;

    peajesReal = localidad[localidad_selecionada][peajePagar];
    distanciaIdaDoble = distanciaIda * 2;
    distanciaTotal = distanciaIdaDoble + tolerancia;
    combustibleGastado = distanciaTotal/kilometrosXgalon;
    costoCombustible = precioGasoilh.value * combustibleGastado;

    depreciacion = costoCombustible * 0.4;

    costoTotal = dieta + costoCombustible + peajesReal + depreciacion;

    if(camion_selecionado == "camion_pequeno"){
      depreciacion = 0;
      dieta =0;
      costoCombustible = 0;

      if(distanciaIda <= 45){
        costoCadaKilometro = 50;

      }
      else if(distanciaIda > 45 && distanciaIda <= 60){
        costoCadaKilometro = 47;

      }
      else if(distanciaIda > 60 && distanciaIda <= 80){
        costoCadaKilometro = 44;

      }
      else if(distanciaIda >80 && distanciaIda <= 120 ){
        costoCadaKilometro = 41;
      }
      else if(distanciaIda >120 && distanciaIda <= 160 ){
        costoCadaKilometro = 38;
      }
      else if(distanciaIda >160 && distanciaIda <= 200 ){
        costoCadaKilometro = 34;
      }
      else if(distanciaIda >200 && distanciaIda ){
        costoCadaKilometro = 30;
      }

      console.log(costoCadaKilometro);

      costoTotal = costoCadaKilometro * distanciaIda;
      // costoCombustible = 0
    }
    else if(camion_selecionado == "platanera"){
      depreciacion = 0;
      dieta =0;
      costoCombustible = 0;

      if(distanciaIda <= 45){
        costoCadaKilometro = 40;

      }
      else if(distanciaIda > 45 && distanciaIda <= 60){
        costoCadaKilometro = 47;

      }
      else if(distanciaIda > 60 && distanciaIda <= 80){
        costoCadaKilometro = 44;

      }
      else if(distanciaIda >80 && distanciaIda <= 120 ){
        costoCadaKilometro = 41;
      }
      else if(distanciaIda >120 && distanciaIda <= 160 ){
        costoCadaKilometro = 38;
      }
      else if(distanciaIda >160 && distanciaIda <= 200 ){
        costoCadaKilometro = 34;
      }
      else if(distanciaIda >200 && distanciaIda ){
        costoCadaKilometro = 20;
      }

      console.log(costoCadaKilometro);

      costoTotal = costoCadaKilometro * distanciaIda;
      // costoCombustible = 0
    }

    // costoTotal = parseInt(costoTotal);
    // costoTotal = costoTotal.toFixed(2);
    //se colocó asi para que el algoritmo no le sume el 0.75 a dieta y peaje, esto porque si por ejemplo cuando el usuario selecione local en destino, aunque coloque la misma distancia de alguna localidad ejemplo azua que son 111km que tiene el algoritmo. sencillo; el usuario coloca azua da X precio pero el usuario colo 111 km en la caja de texto otros, entonces no da el mismo precio, y se debe a que el cuando el usuario coloca azua el algoritmo le suma el 0.75 a la dieta y el peaje y cuando el usuario coloca otros y pone 111 cuando el usuario le añada 1550 (de dieta y peaje si es patana), no dara igual, el usuario tendria que dividi 1550 / 0.75 y sumarlo entonces daria igual, para evitar este problema a la dieta y peaje no se le suma el 0.75

    precioInicial = (costoTotal-dieta-peajesReal) / 0.75;
    precioInicial += dieta + peajesReal;

    if(adicional.value == "" || descuento.value == ""){
      adicional.value=0;
      descuento.value=0;
    }

    precioTotal = precioInicial + parseFloat(adicional.value) - parseFloat(descuento.value);
  }
  funcionImprimir();
}

function funcionImprimir(){

  precioInicial = precioInicial.toFixed(2);
  precioTotal = precioTotal.toFixed(2);
  costoCombustible = costoCombustible.toFixed(2);
  depreciacion = depreciacion.toFixed(2);
  peajesReal =peajesReal.toFixed(2);
  console.log(peajesReal);
  dieta =dieta.toFixed(2);
  console.log(peajesReal);
  costoTotal = costoTotal.toFixed(2);
  precioInicial = formatNumber.new(precioInicial, "RD$  ");
  precioTotal = formatNumber.new(precioTotal, "RD$  ");
  costoCombustible = formatNumber.new(costoCombustible, "RD$  ");
  peajesReal = formatNumber.new(peajesReal, "RD$  ");
  dieta = formatNumber.new(dieta,"RD$  ");
  depreciacion = formatNumber.new(depreciacion, "RD$  ");
  costoTotal = formatNumber.new(costoTotal, "RD$  ");

  imprimirResultados(provincia,localidad[localidad_selecionada].descripcion);
  imprimirResultados(precioInicialh,precioInicial);
  imprimirResultados(precioTotalh, precioTotal);
  imprimirResultados(combustibleh, costoCombustible);
  imprimirResultados(peajesh, peajesReal);
  imprimirResultados(dietah, dieta);
  imprimirResultados(depreciacionh, depreciacion);
  imprimirResultados(costoTotalh, costoTotal);

  precioInicial = parseFloat(precioInicial);
  precioTotal = parseFloat(precioTotal);
  costoCombustible = parseFloat(costoCombustible);
  dieta = parseFloat(dieta);
  peajesReal = parseFloat(peajesReal);
  depreciacion = parseFloat(depreciacion);
  costoTotal = parseFloat(costoTotal);

  //Estos dos if son para reiniciar dieta y que valga 750 cuando corresponda
  if(ciudad.value == "local"){
    dieta = 0;

  }
  else if(ciudad.value !== "local"){
    dieta = 750.00;

  }

}

function imprimirResultados(cajaTexto,resultado){
  cajaTexto.value = resultado;
}

class Destino{
  constructor(nombre, descripcion, longitud, peajePatana, peajeRigido, peajeCamaLarga, peajeCamionPequeno, peajePlatanera){
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.longitud = longitud;
    this.peajePatana = peajePatana;
    this.peajeRigido = peajeRigido;
    this.peajeCamaLarga = peajeCamaLarga;
    this.peajeCamionPequeno = peajeCamionPequeno;
    this.peajePlatanera = peajePlatanera;
  }
}

const local = new Destino("local", "Santo Domingo", caja_texto_otrosh.value, 0,0,0,0,0);
const aeropuertoLasAmericas = new Destino("aeropuertoLasAmericas", "Las Americas Ruta 66", 36, 240,180,120,0,0);
const azua=new Destino("azua","Azua de Compostela",125,800,600,400,0,0);
const bani=new Destino("bani","Peravia: Bani",75,800,600,400,0,0);
const barahona=new Destino("barahona","Barahona",200,800,600,400,0,0);
const bavaro=new Destino("bavaro","La Altagracia",214,2320,1740,1160,0,0);
const boca_chica=new Destino("boca_chica","Boca Chica",59,240,180,120,0,0);
const bonao=new Destino("bonao","Bonao",84,240,180,120,0,0);
const cap_cana=new Destino("cap_cana","La Altagracia",194,2320,1740,1160,0,0);
const cotui=new Destino("cotui","Sánchez Ramírez",107,240,180,120,0,0);
const dajabon=new Destino("dajabon","Dajabón",308,800,600,400,0,0);
const el_seibo=new Destino("el_seibo","El Seibo",137,240,180,120,0,0);
const elias_pina=new Destino("elias_pina","Elías Piña",260,800,600,400,0,0);
// const haina=new Destino("haina","Haina",15,800,600,400,0,0)
const hato_mayor=new Destino("hato_mayor","Hato Mayor",114,240,180,120,0,0);
const higuey=new Destino("higuey","La Altagracia",145,1520,1140,760,0,0);
const jarabacoa=new Destino("jarabacoa","La Vega",144,240,180,120,0,0);
const jimani=new Destino("jimani","Independencia: Jimaní",275,800,600,400,0,0);
const juan_dolio=new Destino("juan_dolio","Juan Dolio",65,240,180,120,0,0);
const la_romana=new Destino("la_romana","La Romana",107,1040,780,520,0,0);
const la_vega=new Destino("la_vega","La Vega",123,240,180,120,0,0);
const las_terrenas=new Destino("las_terrenas","Samaná",104,8114,8114,4394,0,0);
const mao=new Destino("mao","Valverde: Mao",209,1040,780,520,0,0);
const moca=new Destino("moca","Espaillat: Moca",145,240,180,120,0,0);
const monte_plata=new Destino("monte_plata","Monte Plata",69,800,600,400,0,0);
const montecristi=new Destino("montecristi","Monte Cristi",273,1040,780,520,0,0);
const nagua=new Destino("nagua","María Trinidad Sánchez",115,3726,3726,2012,0,0);
const neiba=new Destino("neiba","Bahoruco: Neiba",215,800,600,400,0,0);
const ocoa=new Destino("ocoa","San José de Ocoa",128,800,600,400,0,0);
const pedernales=new Destino("pedernales","Pedernales",320,800,600,400,0,0);
// const pedro_brand=new Destino("pedro_brand","Pedro Brand",22,240,180,120,0,0)
const puerto_plata=new Destino("puerto_plata","Puerto Plata",205,1040,780,520,0,0);
const punta_cana=new Destino("punta_cana","La Altagracia",205,2320,1740,1160,0,0);
const salcedo=new Destino("salcedo","Hermanas Mirabal",145,240,180,120,0,0);
const samana=new Destino("samana","Samaná",120,3726,3726,2012,0,0);
// const san_cristobal=new Destino("san_cristobal","San Cristóbal",28,800,600,400,0,0)
const san_francisco=new Destino("san_francisco","Duarte",134,240,180,120,0,0);
const san_juan=new Destino("san_juan","San Juan de Maguana",205,800,600,400,0,0);
const san_pedro=new Destino("san_pedro","San Pedro de Macorís",74,240,180,120,0,0);
const santiago=new Destino("santiago","Santiago",150,240,180,120,0,0);
const santiago_rodriguez=new Destino("santiago_rodriguez","Santiago Rodríguez",258,240,180,120,0,0);
const sosua=new Destino("sosua","Puerto Plata",210,1040,780,520,0,0);
const yamasa=new Destino("yamasa","Monte Plata",48,800,600,400,0,0);
const villa_altagracia=new Destino("villa_altagracia","Villa Altagracia",37,240,180,120,0,0);
// const villa_mella=new Destino("villa_mella","Villa Mella",22,0,0,0,0,0)

let localidad = [];
localidad.local=local;
localidad.aeropuertoLasAmericas=aeropuertoLasAmericas;
localidad.azua=azua;
localidad.bani=bani;
localidad.barahona=barahona;
localidad.bavaro=bavaro;
localidad.boca_chica=boca_chica;
localidad.bonao=bonao;
localidad.cap_cana=cap_cana;
localidad.cotui=cotui;
localidad.dajabon=dajabon;
localidad.el_seibo=el_seibo;
localidad.elias_pina=elias_pina;
// localidad.haina=haina
localidad.hato_mayor=hato_mayor;
localidad.higuey=higuey;
localidad.jarabacoa=jarabacoa;
localidad.jimani=jimani;
localidad.juan_dolio=juan_dolio;
localidad.la_romana=la_romana;
localidad.la_vega=la_vega;
localidad.las_terrenas=las_terrenas;
localidad.mao=mao;
localidad.moca=moca;
localidad.monte_plata=monte_plata;
localidad.montecristi=montecristi;
localidad.nagua=nagua;
localidad.neiba=neiba;
localidad.ocoa=ocoa;
localidad.pedernales=pedernales;
// localidad.pedro_brand=pedro_brand
localidad.puerto_plata=puerto_plata;
localidad.punta_cana=punta_cana;
localidad.salcedo=salcedo;
localidad.samana=samana;
// localidad.san_cristobal=san_cristobal
localidad.san_francisco=san_francisco;
localidad.san_juan=san_juan;
localidad.san_pedro=san_pedro;
localidad.santiago=santiago;
localidad.santiago_rodriguez=santiago_rodriguez;
localidad.sosua=sosua;
localidad.yamasa=yamasa;
localidad.villa_altagracia=villa_altagracia;
// localidad.villa_mella=villa_mella

class Vehiculo{
  constructor(nombre, longitud, kmXg, montoAnillo1, montoAnillo2, montoAnillo3, montoAnillo4, costoAnillo1, costoAnillo2, costoAnillo3, costoAnillo4){
    this.nombre = nombre;
    this.longitud = longitud;
    this.kmXg = kmXg;
    this.montoAnillo1 = montoAnillo1;
    this.montoAnillo2 = montoAnillo2;
    this.montoAnillo3 = montoAnillo3;
    this.montoAnillo4 = montoAnillo4;
    this.costoAnillo1 = costoAnillo1;
    this.costoAnillo2 = costoAnillo2;
    this.costoAnillo3 = costoAnillo3;
    this.costoAnillo4 = costoAnillo4;
  }
}

const patana = new Vehiculo("patana", "40'", 9, 2400, 2800, 3800, 4500, 0,0,0,0);
//en el reporte que me paso Eduar que a su vez le paso Jesus, dice que el rigido rinde uno 7 km y el otro 14, en realidad tenemos estipulado que son 12 y es lo mas logico, posteriormente lo estaremos dicutien,
const rigido = new Vehiculo("rigido", "24'", 12, 1800, 2300, 3000, 4000, 0,0,0,0);
const cama_larga = new Vehiculo("cama_larga", "16'", 22, 1500, 1900, 2500, 3500, 0,0,0,0);
const camion_pequeno = new Vehiculo("camion_pequeno", "10'", 35, 1350, 1700, 2300, 3200, 1050, 1350, 1800, 2300);
const platanera = new Vehiculo("platanera", "6'", 50, 950, 1150, 1700, 2300, 750, 900, 1300, 1800);

let camion = [];
camion.patana = patana;
camion.rigido = rigido;
camion.cama_larga = cama_larga;
camion.camion_pequeno = camion_pequeno;
camion.platanera = platanera;

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
  new:function(num, simbol){
    this.simbol = simbol ||'';
    return this.formatear(num);
  }
};

function limpieza(){
  provincia.value = "";
  precioInicialh.value = "";
  adicional.value = 0;
  descuento.value = 0;
  precioTotalh.value = "";
  combustibleh.value = "";
  peajesh.value = "";
  dietah.value = "";
  depreciacionh.value = "";
  costoTotalh.value = "";
}