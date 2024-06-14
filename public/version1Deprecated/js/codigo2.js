//grupo01
let btn_calcular = document.getElementById('btn-calcular');
btn_calcular.addEventListener("click", calcular);
let ciudad = document.getElementById("ciudad");
let unidad = document.getElementById("unidad");
let caja_texto_otros = document.getElementById("caja_texto_otros");
let dietah = document.getElementById("dietah");
let costoTotalh = document.getElementById("costo-totalh");
let peajesh = document.getElementById("peajesh");
let otrosh = document.getElementById("otrosh");
let imprevistosh = document.getElementById("imprevistosh");
let precioInicialh = document.getElementById("precio-inicial");
let adicional = document.getElementById("adicional");
let descuento = document.getElementById("descuento");
let precioTotalh =document.getElementById("precio-total");
let combustibleh = document.getElementById("combustibleh");
let cajaPeaje = document.getElementById("caja-peaje");
let provincia = document.getElementById("provincia");

//grupo02
let localidad_selecionada;
let distancia_recorrer;
let distanciaTotal;
let tolerancia = 30;
let camion_selecionado;
let kilometrosXgalon;
let precioGasoil = 215;
let dieta = 750.00;
let resultado;
let combustibleGastado;
let costoCombustible;
let costoTotal;
let peajesReal = 1;
let depreciacion;
let imprevistos = 0.05;
let precioInicial = 0;
let precioTotal;
let peajes2;
let llenoCiudad = true;
let llenoUnidad = true;
let llenoOtros = true;
let peajePagar;
let localidad_12;

caja_texto_otros.value = 0;

ciudad.addEventListener("change", deslizarOtros);
function deslizarOtros(){
  if(ciudad.value == "otros"){

    caja_texto_otros.value = "";
    caja_texto_otros.setAttribute("class", "caja_texto_otros mover_otros");
    dieta = 0;

  }
  else if(ciudad.value !== "otros"){
    caja_texto_otros.setAttribute("class", "caja_texto_otros");
    dieta = 750.00;
    caja_texto_otros.value = 0;

  }
}
function calcular(){

  if(ciudad.value == "boca_chica" || ciudad.value == "haina" || ciudad.value == "juan_dolio" || ciudad.value == "pedro_brand" ||ciudad.value == "villa_altagracia" || ciudad.value == "villa_mella" ){
    dieta = 0;
  }

  llenoCiudad = true;
  llenoUnidad = true;
  if(ciudad.value == ""){
    ciudad.setAttribute("class", "llenar");
    llenoCiudad = false;
  }
  if(ciudad.value != ""){
    ciudad.setAttribute("class", "ciudad");
  }

  if(unidad.value == ""){
    unidad.setAttribute("class", "llenar2");
    llenoUnidad = false;
  }
  if(unidad.value != ""){
    unidad.setAttribute("class", "unidad");
  }
  if(caja_texto_otros.value == "" ){
    caja_texto_otros.setAttribute("class", "llenar3 caja_texto_otros mover_otros");
  }
  if(caja_texto_otros.value !== "" && ciudad.value == "otros"){
    caja_texto_otros.setAttribute("class", "caja_texto_otros mover_otros");

  }

  //grupo06
  for(i=0; i<ciudad.length; i++){
    if(ciudad[i].index == ciudad.selectedIndex){

      localidad_selecionada = ciudad[i].value;
      localidad_12 = localidad[i];

      if(llenoCiudad == true && llenoUnidad == true && caja_texto_otros.value !== ""){
        imprimirResultados(provincia,localidad[i].descripcion);
        sacarDistanciaTotal();
      }

    }
    //grupo07
    function sacarDistanciaTotal(){
      if(ciudad.value == "otros" && caja_texto_otros.value !== ""){
        distancia_recorrer = caja_texto_otros.value;
      }

      else if(localidad_selecionada == localidad[i].nombre){
        distancia_recorrer = localidad[i].longitud;

      }

    }
  }
  //grupo08
  selecionarCamion();
}
//grupo09
function selecionarCamion(){
  for(i=0; i<unidad.length; i++){
    if(unidad[i].index == unidad.selectedIndex && caja_texto_otros.value !== ""){
      camion_selecionado = unidad[i].value;
      if(camion_selecionado == "patana"){
        peajePagar = "peajePatana";
      }
      if(camion_selecionado == "rigido"){
        peajePagar = "peajeRigido";
      }
      if(camion_selecionado == "cama_larga"){
        peajePagar = "peajeCamaLarga";
      }
      sacarRendimiento();
    }
  }
}
//grupo09
function sacarRendimiento(){
  if(camion_selecionado == camion[i].nombre){
    kilometrosXgalon = camion[i].kmXg;
    formulaFinal();
  }
}
//grupo10
function formulaFinal(){

  peajesReal = localidad_12[peajePagar];
  parseFloat(adicional.value);
  parseFloat(descuento.value);
  distancia_recorrer = distancia_recorrer * 2;
  distanciaTotal = distancia_recorrer + tolerancia;
  combustibleGastado = distanciaTotal/kilometrosXgalon;
  costoCombustible = precioGasoil * combustibleGastado;
  depreciacion = costoCombustible * 0.4;
  costoTotal = dieta + costoCombustible + peajesReal + depreciacion;

  costoTotal = parseInt(costoTotal);
  costoTotal = costoTotal.toFixed(2);

  precioInicial = (costoTotal-dieta-peajesReal) / 0.75;
  precioInicial += dieta + peajesReal;

  if(adicional.value == "" || descuento.value == ""){
    adicional.value=0;
    descuento.value=0;
  }

  precioTotal = precioInicial + parseFloat(adicional.value) - parseFloat(descuento.value);

  funcionImprimir();
}

function funcionImprimir(){
  if(llenoUnidad == true && llenoCiudad == true && caja_texto_otros.value !== ""){

    precioInicial = precioInicial.toFixed(2);
    precioTotal = precioTotal.toFixed(2);
    costoCombustible = costoCombustible.toFixed(2);
    imprevistos = imprevistos.toFixed(2);
    depreciacion = depreciacion.toFixed(2);
    peajesReal =peajesReal.toFixed(2);
    dieta =dieta.toFixed(2);
    precioInicial = formatNumber.new(precioInicial, "RD$  ");
    precioTotal = formatNumber.new(precioTotal, "RD$  ");
    costoCombustible = formatNumber.new(costoCombustible, "RD$  ");
    peajesReal = formatNumber.new(peajesReal, "RD$  ");
    dieta = formatNumber.new(dieta,"RD$  ");

    imprevistos = formatNumber.new(imprevistos, "RD$  ");
    depreciacion = formatNumber.new(depreciacion, "RD$  ");
    costoTotal = formatNumber.new(costoTotal, "RD$  ");
    imprimirResultados(precioInicialh,precioInicial);
    imprimirResultados(precioTotalh, precioTotal);
    imprimirResultados(combustibleh, costoCombustible);
    imprimirResultados(peajesh, peajesReal);
    imprimirResultados(dietah, dieta);
    imprimirResultados(otrosh, depreciacion);
    imprimirResultados(costoTotalh, costoTotal);
    precioInicial = parseFloat(precioInicial);
    precioTotal = parseFloat(precioTotal);
    costoCombustible = parseFloat(costoCombustible);
    // peajes2 =  parseInt(peajes)
    dieta = parseFloat(dieta);
    imprevistos = parseFloat(imprevistos);
    peajesReal = parseFloat(peajesReal);
    depreciacion = parseFloat(depreciacion);
    costoTotal = parseFloat(costoTotal);
  }

  if(ciudad.value == "otros"){
    dieta = 0;

  }
  else if(ciudad.value !== "otros"){
    dieta = 750.00;

  }

}

function imprimirResultados(cajaTexto,local){
  cajaTexto.value = local;
}

class Destino{
  constructor(nombre, descripcion, longitud, peajePatana, peajeRigido, peajeCamaLarga){
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.longitud = longitud;
    this.peajePatana = peajePatana;
    this.peajeRigido = peajeRigido;
    this.peajeCamaLarga = peajeCamaLarga;
  }
}

const lokju = new Destino("", "", 1);
const azua=new Destino("azua","Azua de Compostela",111,800,600,400);
const bani=new Destino("bani","Peravia: Bani",61,800,600,400);
const barahona=new Destino("barahona","Barahona",185,800,600,400);
const bavaro=new Destino("bavaro","La Altagracia",214,2320,1740,1160);
const boca_chica=new Destino("boca_chica","Boca Chica",42,240,180,120);
const bonao=new Destino("bonao","Bonao",84,240,180,120);
const cap_cana=new Destino("cap_cana","La Altagracia",194,2320,1740,1160);
const cotui=new Destino("cotui","Sánchez Ramírez",107,240,180,120);
const dajabon=new Destino("dajabon","Dajabón",293,800,600,400);
const el_seibo=new Destino("el_seibo","El Seibo",137,240,180,120);
const elias_pina=new Destino("elias_pina","Elías Piña",243,800,600,400);
const haina=new Destino("haina","Haina",15,800,600,400);
const hato_mayor=new Destino("hato_mayor","Hato Mayor",114,240,180,120);
const higuey=new Destino("higuey","La Altagracia",145,1520,1140,760);
const jarabacoa=new Destino("jarabacoa","La Vega",144,240,180,120);
const jimani=new Destino("jimani","Independencia: Jimaní",260,800,600,400);
const juan_dolio=new Destino("juan_dolio","Juan Dolio",65,240,180,120);
const la_romana=new Destino("la_romana","La Romana",107,1040,780,520);
const la_vega=new Destino("la_vega","La Vega",123,240,180,120);
const las_terrenas=new Destino("las_terrenas","Samaná",104,8114,8114,4394);
const mao=new Destino("mao","Valverde: Mao",209,1040,780,520);
const moca=new Destino("moca","Espaillat: Moca",145,240,180,120);
const monte_plata=new Destino("monte_plata","Monte Plata",69,800,600,400);
const montecristi=new Destino("montecristi","Monte Cristi",273,1040,780,520);
const nagua=new Destino("nagua","María Trinidad Sánchez",115,3726,3726,2012);
const neiba=new Destino("neiba","Bahoruco: Neiba",202,800,600,400);
const ocoa=new Destino("ocoa","San José de Ocoa",112,800,600,400);
const pedernales=new Destino("pedernales","Pedernales",307,800,600,400);
const pedro_brand=new Destino("pedro_brand","Pedro Brand",22,240,180,120);
const puerto_plata=new Destino("puerto_plata","Puerto Plata",205,1040,780,520);
const punta_cana=new Destino("punta_cana","La Altagracia",205,2320,1740,1160);
const salcedo=new Destino("salcedo","Hermanas Mirabal",145,240,180,120);
const samana=new Destino("samana","Samaná",120,3726,3726,2012);
const san_cristobal=new Destino("san_cristobal","San Cristóbal",28,800,600,400);
const san_francisco=new Destino("san_francisco","Duarte",134,240,180,120);
const san_juan=new Destino("san_juan","San Juan de Maguana",191,800,600,400);
const san_pedro=new Destino("san_pedro","San Pedro de Macorís",74,240,180,120);
const santiago=new Destino("santiago","Santiago de los Caballeros",150,240,180,120);
const santiago_rodriguez=new Destino("santiago_rodriguez","Santiago Rodríguez",258,240,180,120);
const sosua=new Destino("sosua","Puerto Plata",210,1040,780,520);
const yamasa=new Destino("yamasa","Monte Plata",48,800,600,400);
const villa_altagracia=new Destino("villa_altagracia","Villa Altagracia",37,240,180,120);
const villa_mella=new Destino("villa_mella","Villa Mella",22,0,0,0);
const otros=new Destino("n","Otros",0,0,0,0);

let localidad = [];
localidad.push(lokju);
localidad.push(azua);
localidad.push(bani);
localidad.push(barahona);
localidad.push(bavaro);
localidad.push(boca_chica);
localidad.push(bonao);
localidad.push(cap_cana);
localidad.push(cotui);
localidad.push(dajabon);
localidad.push(el_seibo);
localidad.push(elias_pina);
localidad.push(haina);
localidad.push(hato_mayor);
localidad.push(higuey);
localidad.push(jarabacoa);
localidad.push(jimani);
localidad.push(juan_dolio);
localidad.push(la_romana);
localidad.push(la_vega);
localidad.push(las_terrenas);
localidad.push(mao);
localidad.push(moca);
localidad.push(monte_plata);
localidad.push(montecristi);
localidad.push(nagua);
localidad.push(neiba);
localidad.push(ocoa);
localidad.push(pedernales);
localidad.push(pedro_brand);
localidad.push(puerto_plata);
localidad.push(punta_cana);
localidad.push(salcedo);
localidad.push(samana);
localidad.push(san_cristobal);
localidad.push(san_francisco);
localidad.push(san_juan);
localidad.push(san_pedro);
localidad.push(santiago);
localidad.push(santiago_rodriguez);
localidad.push(sosua);
localidad.push(yamasa);
localidad.push(villa_altagracia);
localidad.push(villa_mella);
localidad.push(otros);

class Vehiculo{
  constructor(nombre, longitud, kmXg){
    this.nombre = nombre;
    this.longitud = longitud;
    this.kmXg = kmXg;
  }
}

const extra = new Vehiculo("asd", "Asdas", 1);
const patana = new Vehiculo("patana", "40'", 9);
const rigido = new Vehiculo("rigido", "24'", 12);
const cama_larga = new Vehiculo("cama_larga", "16'", 25);

let camion = [];
camion.push(extra);
camion.push(patana);
camion.push(rigido);
camion.push(cama_larga);

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

