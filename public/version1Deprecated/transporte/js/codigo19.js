
class Destino{
  constructor(nombre, descripcion,distancia,tipo, kmMin, kmMax,mapa){
    this.nombre=nombre;
    this.descripcion=descripcion;
    this.distancia=distancia;
    this.tipo=tipo;
    this.kmMin=kmMin;
    this.kmMax=kmMax;
    this.mapa=mapa;
  }
}

class Unidad{
  constructor(descripcion,cuota,radio1_0a2, radio2_2a4, radio3_4a6, radio4_6a9,radio5_9a15,radio6_15a20,radio7_20a30){
    this.descripcion=descripcion;
    this.cuota=cuota;
    this.radio1_0a2=radio1_0a2;
    this.radio2_2a4=radio2_2a4;
    this.radio3_4a6=radio3_4a6;
    this.radio4_6a9=radio4_6a9;
    this.radio5_9a15=radio5_9a15;
    this.radio6_15a20=radio6_15a20;
    this.radio7_20a30=radio7_20a30;
  }
}

let destinoArray = [];
let anilloArray=[];

let anillo1;
let anillo2;
let anillo3;
let anillo4;
let anillo5;
let anillo6;
let anillo7;

let azua;
let bahoruco;
let barahona;
let dajabon;
let duarte;
let el_seibo;
let elias_pina;
let espaillat;
let hato_mayor;
let hermanas_mirabal;
let independencia;
let la_altagracia;
let la_romana;
let la_vega;
let maria_trinidad_sanchez;
let monsenor_nouel;
let monte_plata;
let montecristi;
let pedernales;
let peravia;
let puerto_plata;
let samana;
let san_cristobal;
let san_jose_de_ocoa;
let san_juan;
let san_pedro_de_macoris;
let sanchez_ramirez;
let santiago;
let santiago_rodriguez;
let santo_domingo;
let valverde;

let platanera = new Unidad('platanera', 500,450, 750,900,1350,1500,1700,2000,);
let camion_pequeno = new Unidad('camionPequeno',600,750,900,1350,1500,1700,2000,2400);
let camionCamaLarga = new Unidad('camionCamaLarga',600,900,1500,2250,2500,2800,3300,4100);
let rigido = new Unidad('rigido',700,1800,3000,4500,5000,5600,6600,8200);
let patana = new Unidad('patana',800,3000,5000,7500,8300,9500,11000,14000);

let unidadArray = [];
unidadArray['platanera'] = platanera;
unidadArray['camionPequeno'] = camion_pequeno;
unidadArray['camionCamaLarga'] = camionCamaLarga;
unidadArray['rigido'] = rigido;
unidadArray['patana'] = patana;

document.addEventListener('keydown', teclas);
function teclas(e){
  if(e.key == "q" || e.key =="Q"){
    tipoCalculo[0].click();
  }
  else if(e.key == "w" || e.key =="W"){
    tipoCalculo[1].click();
  }
  else if(e.key == "a" || e.key =="A"){
    puntoPartida[0].click();
  }

  if(e.key == "s" || e.key =="S"){
    puntoPartida[1].click();
  }
  else if(e.key == "d" || e.key =="D"){
    puntoPartida[2].click();
  }
  else if(e.key == "f" || e.key =="F"){
    puntoPartida[3].click();
  }
  else if(e.key == "g" || e.key =="G"){
    puntoPartida[4].click();
  }
  else if(e.key == "r" || e.key =="R"){
    modo[3].click();
    ancho_habitacion[0].focus();
  }
  if (e.keyCode == 13) {
    calcular();
  }
  if(e.key == "Delete"){
    limpieza();
  }
}

let destinoSelect = document.getElementById('destinoSelect');
let vehiculoSelect = document.getElementById('vehiculoSelect');
destinoSelect.addEventListener('change', pintarMapaDirecto);
vehiculoSelect.addEventListener('change', calcular);

let tipoCalculo = document.getElementsByName('tipoCalculo');
for(let i=0;i<tipoCalculo.length;i++){
  tipoCalculo[i].addEventListener('click', indicarTipoCalculo);
}

function indicarTipoCalculo(){
  if(tipoCalculo[0].checked===true){
    destinoSelect.classList.remove('deslizarIzquierda');
    inputKmManual.classList.remove('deslizarDerecha');
    inputKmManual.disabled = true;
    inputKmManual.value='';
  }else if(tipoCalculo[1].checked===true){
    destinoSelect.classList.add('deslizarIzquierda');
    inputKmManual.classList.add('deslizarDerecha');
    inputKmManual.disabled = false;
  }
  limpieza();
}

let puntoPartida = document.getElementsByName('puntoPartida');
for(let i=0; i<puntoPartida.length;i++){
  puntoPartida[i].addEventListener('click', pintarMapaDirecto);
}

function pintarMapaDirecto(){
  // actualizarDB()
  calcular();
  pintarMapa();
}

let localidadSelecionada='sinUsar';
let vehiculoSelecionado;
let costo ;
let precio;
let precioMinimo;
const totalAnillos=20;
let distanciaKmManualmente;
let anilloSelecionado;
let inputKmManual = document.getElementById('inputKmManual');
const distanciaHorgura=15;

let btnCalcular = document.getElementById('btnCalcular');
btnCalcular.addEventListener('click', calcular);
function calcular(){
  actualizarDB();

  for(let i=0;i<vehiculoSelect.length;i++){
    if(vehiculoSelect[i].index== vehiculoSelect.selectedIndex){
      vehiculoSelecionado=vehiculoSelect.value;
      // platanera
    }

  }
  if(tipoCalculo[0].checked === true){
    for(let i=0;i<destinoSelect.length;i++){
      if(destinoSelect[i].index === destinoSelect.selectedIndex){
        if(destinoSelect.value!=''){
          localidadSelecionada= destinoSelect.value;
        }
        // dajabon
      }
    }
    console.log(localidadSelecionada);
    if(localidadSelecionada!='sinUsar'){

      if(destinoArray[localidadSelecionada].tipo==='anillo'){
        costo = unidadArray[vehiculoSelecionado][localidadSelecionada];
      }else if(destinoArray[localidadSelecionada].tipo==='provincia'){
        costo=destinoArray[localidadSelecionada].distancia-totalAnillos;
        costo=costo+distanciaHorgura;
        costo=Math.floor(costo/10);
        costo = costo * unidadArray[vehiculoSelecionado].cuota;
        costo = costo + unidadArray[vehiculoSelecionado].radio7_20a30;
      }
    }

  }
  else if(tipoCalculo[1].checked===true){
    distanciaKmManualmente = inputKmManual.value;

    if(inputKmManual.value>29.9){
      costo=inputKmManual.value-totalAnillos;
      costo=Math.floor(costo/10);
      costo = costo * unidadArray[vehiculoSelecionado].cuota;
      costo = costo + unidadArray[vehiculoSelecionado].radio7_20a30;
      localidadSelecionada='N/A';
    }
    for(let i=0;i<anilloArray.length;i++){
      if(anilloArray[i].kmMin<=distanciaKmManualmente&&anilloArray[i].kmMax>=distanciaKmManualmente){
        anilloSelecionado = anilloArray[i].nombre;
        costo = unidadArray[vehiculoSelecionado][anilloSelecionado];
        localidadSelecionada= anilloArray[i].nombre;

      }
    }

  }
  precio = costo/0.75;
  precioMinimo = costo/0.85;
  if(localidadSelecionada!='sinUsar'){

    imprimirResultados();
  }

}

let distanciaInput = document.getElementById('distanciaInput');
let destinoInput = document.getElementById('destinoInput');
// let precioInput = document.getElementById('precioInput')
let precioMinimoInput = document.getElementById('precioMinimoInput');
let costoInput = document.getElementById('costoInput');

function imprimirResultados(){
  precio=precio.toFixed(2);
  precio=formatNumber.new(precio, "RD$  ");
  precioMinimo=precioMinimo.toFixed(2);
  precioMinimo=formatNumber.new(precioMinimo, "RD$  ");
  console.log(costo);
  costo=costo.toFixed(2);
  costo=formatNumber.new(costo, "RD$  ");

  if(tipoCalculo[0].checked==true){
    if(destinoArray[localidadSelecionada].tipo!=='anillo'){
      destinoArray[localidadSelecionada].distancia = destinoArray[localidadSelecionada].distancia + ' km';
    }
    distanciaInput.value=destinoArray[localidadSelecionada].distancia;
    if(localidadSelecionada!='N/A'){

      destinoInput.value = destinoArray[localidadSelecionada].descripcion;
    }else if(localidadSelecionada=='N/A'){
      destinoInput.value='N/A';
    }

  }
  else if(tipoCalculo[1].checked==true){
    destinoInput.value='N/A';
    distanciaInput.value=inputKmManual.value +' km';
  }
  // precioInput.value=precio
  precioMinimoInput.value = precioMinimo;
  costoInput.value = costo;
}

let containerMapa = document.getElementById('containerMapa');
let googleMaps= document.createElement('iframe');
googleMaps.width='900';
googleMaps.height='400';
googleMaps.style='border:0';
googleMaps.allowfullscreen='';
googleMaps.loading='lazy';
googleMaps.referrerpolicy='no-referrer-when-downgrade';

function pintarMapa(){
  actualizarDB();
  if(tipoCalculo[0].checked==true){

    if(destinoSelect[0].selected!=true){

      containerMapa.removeChild(containerMapa.children[0]);
      googleMaps.src=destinoArray[localidadSelecionada].mapa;
    }
    else if(destinoSelect[0].selected==true){
      containerMapa.removeChild(containerMapa.children[0]);
      googleMaps.src=anillo1.mapa;

    }
  }
  else if(tipoCalculo[1].checked==true){
    containerMapa.removeChild(containerMapa.children[0]);
    googleMaps.src=anillo1.mapa;
  }
  containerMapa.appendChild(googleMaps);
}

function limpieza(){
  destinoInput.value='';
  // precioInput.value=''
  precioMinimoInput.value='';
  costoInput.value='';
  distanciaInput.value='';
  costo=0;
  distanciaKmManualmente=0;
  precio=0;
  distancia=0;
  precioMinimo=0;

  destinoSelect[0].selected=true;
  pintarMapa();

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
  new:function(num, simbol){
    this.simbol = simbol ||'';
    return this.formatear(num);
  }
};
let ciudadExiste={
  santoDomingo:false,
  santiago:false,
  zonaOriental:false,
  bavaro:false

};
function actualizarDB(){
  if(puntoPartida[0].checked==true){

    for(let i =0;i<destinoSelect.length;i++){
      if(destinoSelect[i].value=='santo_domingo'){
        destinoSelect[i].disabled = true;
      }
      if(destinoSelect[i].value== 'santiago' || destinoSelect[i].value=='la_altagracia'){
        destinoSelect[i].disabled=false;
      }
    }

    anillo1 = new Destino('radio1_0a2', 'Radio de 0 a 2km', 'De 0 a 2km','anillo', 0,1.99, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27163.596309812096!2d-69.96567283984031!3d18.470657695742048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676346584310!5m2!1sen!2sdo');
    anillo2 = new Destino('radio2_2a4','Radio de 2 a 4km', 'De 2 a 4km','anillo', 2,3.99, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25694.147209329814!2d-69.96503560778133!3d18.480196320721085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676349081520!5m2!1sen!2sdo');
    anillo3 = new Destino('radio3_4a6', 'Radio de 4 a 6km', 'De 4 a 6km','anillo',4,5.99, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40968.46987216528!2d-69.96776401815855!3d18.482332199459687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676349038688!5m2!1sen!2sdo');
    anillo4 = new Destino('radio4_6a9', 'Radio de 6 a 9km', 'De 6 a 9km','anillo',6,8.99, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77860.19819218805!2d-69.9710994817809!3d18.476408916278547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676349125361!5m2!1sen!2sdo');
    anillo5 = new Destino('radio5_9a15', 'Radio de 9 a 15km', 'De 9 a 15km','anillo',9,14.99, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108743.6693159185!2d-69.98221961373757!3d18.47607672896961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676349160452!5m2!1sen!2sdo');
    anillo6 = new Destino('radio6_15a20', 'Radio de 15 a 20km', 'De 15 a 20km','anillo',15,19.99, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108743.6693159185!2d-69.98221961373757!3d18.47607672896961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676349160452!5m2!1sen!2sdo');
    anillo7 = new Destino('radio7_20a30', 'Radio de 20 a 30km', 'De 20 a 30km','anillo',20,29.99, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108743.6693159185!2d-69.98221961373757!3d18.47607672896961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676349160452!5m2!1sen!2sdo');
    azua = new Destino("azua","Azua",109,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484682.79812937253!2d-70.62516834679883!3d18.366237018958532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8ebaa3e331114e5f%3A0x5d27855c0b125837!2sAzua!3m2!1d18.4531742!2d-70.73468869999999!5e0!3m2!1sen!2sdo!4v1676741580581!5m2!1sen!2sdo");
    bahoruco = new Destino("bahoruco","Bahoruco",201,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d969291.7904909919!2d-71.24694478100987!3d18.3793721843427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eba70f875da17bb%3A0x197457425521e956!2sBahoruco!3m2!1d18.487989799999998!2d-71.4182249!5e0!3m2!1sen!2sdo!4v1676808307278!5m2!1sen!2sdo");
    barahona = new Destino("barahona","Barahona",183,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1938971.6462807765!2d-71.68287022904322!3d18.344820874245723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8ebaf4a722a12925%3A0x66ea9bf624b43bfe!2sBarahona!3m2!1d18.212080699999998!2d-71.10240759999999!5e0!3m2!1sen!2sdo!4v1677815207695!5m2!1sen!2sdo");
    dajabon = new Destino("dajabon","Dajabón",305,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964805.2916849259!2d-71.39215700830779!3d19.161513214676315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb124dc9e1e1d27%3A0x29098fe5a1031b4b!2sDajabon!3m2!1d19.5499241!2d-71.7086514!5e0!3m2!1sen!2sdo!4v1676689709677!5m2!1sen!2sdo");
    duarte = new Destino("duarte","Duarte",162,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483209.44011742325!2d-70.37176789727813!3d18.883809092803133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eae2dee3ffb7057%3A0xd95e284daea547d0!2sDuarte%20Province!3m2!1d19.2090823!2d-70.02700039999999!5e0!3m2!1sen!2sdo!4v1676689737016!5m2!1sen!2sdo");
    el_seibo = new Destino("el_seibo","El Seibo",140,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484050.55067419127!2d-69.73550543262968!3d18.590040080539193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eaf365985be47ef%3A0x2e08729a0a7da94c!2sEl%20Seibo!3m2!1d18.7653036!2d-69.0389048!5e0!3m2!1sen!2sdo!4v1676689757442!5m2!1sen!2sdo");
    elias_pina = new Destino("elias_pina","Elías Piña",241,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968189.4388306566!2d-71.39004277963096!3d18.57448977462621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb0bb070f953767%3A0xb14c33e611e79982!2sElias%20Pina!3m2!1d18.8766964!2d-71.7044138!5e0!3m2!1sen!2sdo!4v1676689787258!5m2!1sen!2sdo");
    espaillat = new Destino("espaillat","Espaillat",181,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d851458.1223781836!2d-70.6707655147536!3d19.112773937978364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eae1497f201bbcb%3A0xddb4a3350ed35157!2sEspaillat%20Province!3m2!1d19.6277658!2d-70.2786775!5e0!3m2!1sen!2sdo!4v1676808504279!5m2!1sen!2sdo");
    hato_mayor = new Destino("hato_mayor","Hato Mayor",117,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484067.42429287825!2d-69.87899318434211!3d18.58410093712454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eaf14741a9332ad%3A0x72d454e8f7e0588d!2sHato%20Mayor%20Province!3m2!1d18.7635799!2d-69.2557637!5e0!3m2!1sen!2sdo!4v1676689836721!5m2!1sen!2sdo");
    hermanas_mirabal = new Destino("hermanas_mirabal","Hermanas Mirabal",139,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966117.4323912446!2d-70.80941470730363!3d18.93598720568571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eae28a6dfa8ee83%3A0x6ac685def5196033!2sHermanas%20Mirabal%20Province!3m2!1d19.3747559!2d-70.35132349999999!5e0!3m2!1sen!2sdo!4v1676689861391!5m2!1sen!2sdo");
    independencia = new Destino("independencia","Independencia",217,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d969384.3124656952!2d-71.29947605211134!3d18.362904665674442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eba12f367b8b02b%3A0x16db87f341dc1241!2sIndependencia%20Province!3m2!1d18.3785651!2d-71.5232874!5e0!3m2!1sen!2sdo!4v1676689900207!5m2!1sen!2sdo");
    la_altagracia = new Destino("la_altagracia","La Altagracia",203,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d145619.6161582028!2d-68.5805616349752!3d18.555903707091755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m3!3m2!1d18.5990777!2d-68.47323209999999!5e0!3m2!1sen!2sdo!4v1676809507936!5m2!1sen!2sdo");
    la_romana = new Destino("la_romana","La Romana",126,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484402.2925067805!2d-69.74249251832799!3d18.465853515578992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eaf5468f250cc2b%3A0x174be55fc8eb99d9!2sLa%20Romana!3m2!1d18.4338645!2d-68.9658817!5e0!3m2!1sen!2sdo!4v1676689952470!5m2!1sen!2sdo");
    la_vega = new Destino("la_vega","La Vega",115,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483310.4695786103!2d-70.51949325752915!3d18.848756474283018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb02b63a789839f%3A0xc6e5e3cbe8b2f96!2sLa%20Vega!3m2!1d19.218854699999998!2d-70.5238948!5e0!3m2!1sen!2sdo!4v1676690038369!5m2!1sen!2sdo");
    maria_trinidad_sanchez = new Destino("maria_trinidad_sanchez","María Trinidad Sánchez",148,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483117.3820628395!2d-70.13078533793762!3d18.915694541546905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eae469a760ea1c3%3A0xde270504a6ff4531!2sMaria%20Trinidad%20Sanchez!3m2!1d19.373459699999998!2d-69.85144389999999!5e0!3m2!1sen!2sdo!4v1676690015135!5m2!1sen!2sdo");
    monsenor_nouel = new Destino("monsenor_nouel","Monseñor Nouel",75.4,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d241869.4748005945!2d-70.30955984378372!3d18.699389743625677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eafde3435e95489%3A0x5a72182177f9a7b7!2sMonse%C3%B1or%20Nouel%20Province!3m2!1d18.921523399999998!2d-70.3836815!5e0!3m2!1sen!2sdo!4v1676690073053!5m2!1sen!2sdo");
    monte_plata = new Destino("monte_plata","Monte Plata",70.4,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d241963.93390232432!2d-69.99067674828146!3d18.63316685100754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eaf98a11d0c8123%3A0x18fb4bd03d6f498a!2sMonte%20Plata%20Province!3m2!1d18.8080878!2d-69.7869146!5e0!3m2!1sen!2sdo!4v1676690101985!5m2!1sen!2sdo");
    montecristi = new Destino("montecristi","Montecristi",270,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964805.2916849259!2d-71.35815050830776!3d19.161513214676315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb143e98a5e0a53%3A0x7cec19fc8b92807e!2sMonte%20Cristi!3m2!1d19.8473452!2d-71.6406361!5e0!3m2!1sen!2sdo!4v1676808177197!5m2!1sen!2sdo");
    pedernales = new Destino("pedernales","Pedernales",305,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d970632.680391257!2d-71.41082098686968!3d18.139302764860634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eba31c0325eee77%3A0xe914a9533c22d29a!2sPedernales!3m2!1d18.0368683!2d-71.7454674!5e0!3m2!1sen!2sdo!4v1676690153165!5m2!1sen!2sdo");
    peravia = new Destino("peravia","Peravia",55.6,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242341.1832741195!2d-70.28435201624586!3d18.36639068781172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8ea54e7e1f15ff13%3A0x559273a9339c6271!2sPeravia%20Province!3m2!1d18.2786594!2d-70.33358869999999!5e0!3m2!1sen!2sdo!4v1676690185305!5m2!1sen!2sdo");
    puerto_plata = new Destino("puerto_plata","Puerto Plata",206,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964995.9823558376!2d-70.88148545175466!3d19.128896989422934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb1ee3f0046fa75%3A0x10c1300286d97467!2sPuerto%20Plata!3m2!1d19.7807686!2d-70.6871091!5e0!3m2!1sen!2sdo!4v1676690214435!5m2!1sen!2sdo");
    samana = new Destino("samana","Samaná",180,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483260.7988051485!2d-69.93929505248924!3d18.86599781119871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eaee72b27c60421%3A0xde564e1f6d9013!2sSamana!3m2!1d19.2030757!2d-69.3387664!5e0!3m2!1sen!2sdo!4v1676743515318!5m2!1sen!2sdo");
    san_cristobal = new Destino("san_cristobal","San Cristóbal",20.9,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d60557.130505125126!2d-70.0732562460729!3d18.446450287646496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8ea55ef2a2764f53%3A0xe5e76058f4325896!2sSan%20Crist%C3%B3bal!3m2!1d18.4169111!2d-70.1072502!5e0!3m2!1sen!2sdo!4v1676719680396!5m2!1sen!2sdo");
    san_jose_de_ocoa = new Destino("san_jose_de_ocoa","San José de Ocoa",100,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242293.21192556707!2d-70.37364786396137!3d18.40052130609181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb000eab15607e1%3A0xdbc41b6c29ec2e75!2sSan%20Jose%20de%20Ocoa!3m2!1d18.543858!2d-70.5041816!5e0!3m2!1sen!2sdo!4v1676719703838!5m2!1sen!2sdo");
    san_juan = new Destino("san_juan","San Juan",188,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484202.43736825464!2d-70.87360189804423!3d18.536513190839166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb088427d7e2c7f%3A0xaab559e428da2932!2sSan%20Juan%20de%20la%20Maguana!3m2!1d18.8096268!2d-71.2309935!5e0!3m2!1sen!2sdo!4v1676719725781!5m2!1sen!2sdo");
    san_pedro_de_macoris = new Destino("san_pedro_de_macoris","San Pedro de Macorís",78.1,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242229.86212828464!2d-69.77202826094458!3d18.445499948509354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eaf609388bba20d%3A0x5a0142fce45d04c4!2sSan%20Pedro%20De%20Macoris!3m2!1d18.46266!2d-69.3051234!5e0!3m2!1sen!2sdo!4v1676719745732!5m2!1sen!2sdo");
    sanchez_ramirez = new Destino("sanchez_ramirez","Sánchez Ramírez",104,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483553.92023968237!2d-70.41753518223197!3d18.764030976795755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eafc60e3306e8c3%3A0x4c64eeb1faf6d3c5!2sSanchez%20Ramirez!3m2!1d19.052706!2d-70.1492264!5e0!3m2!1sen!2sdo!4v1676719765446!5m2!1sen!2sdo");
    santiago = new Destino("santiago","Santiago",153,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965878.773746676!2d-70.88770575291416!3d18.977199000157814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb1c5c838e5899f%3A0x75d4b059b8768429!2sSantiago%20De%20Los%20Caballeros!3m2!1d19.479196299999998!2d-70.6930568!5e0!3m2!1sen!2sdo!4v1676719787090!5m2!1sen!2sdo");
    santiago_rodriguez = new Destino("santiago_rodriguez","Santiago Rodríguez",256,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965511.9754177683!2d-71.21674091932785!3d19.040370569154202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb104fa2c41f3ff%3A0x967ee3cf50117836!2sSantiago%20Rodr%C3%ADguez!3m2!1d19.471318099999998!2d-71.33958009999999!5e0!3m2!1sen!2sdo!4v1676719804445!5m2!1sen!2sdo");
    santo_domingo = new Destino("santo_domingo", "Santo Domingo",0,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25694.147209329814!2d-69.96503560778133!3d18.480196320721085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1676349081520!5m2!1sen!2sdo");
    valverde = new Destino("valverde","Valverde",194,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965511.9754177683!2d-71.02840841932786!3d19.040370569154202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf89f80afaa363%3A0xce02965b039cab32!2sCielos%20Ac%C3%BAsticos%2C%20Av.%20Charles%20Summer%20%2335%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana!3m2!1d18.4761319!2d-69.9547096!4m5!1s0x8eb1a30092515e67%3A0xfc0da5a2c1231d1f!2sValverde%20Province!3m2!1d19.5881221!2d-70.98033099999999!5e0!3m2!1sen!2sdo!4v1676719827740!5m2!1sen!2sdo");

  }
  else if(puntoPartida[1].checked==true){
    for(let i =0;i<destinoSelect.length;i++){
      if(destinoSelect[i].value=='santo_domingo'){
        destinoSelect[i].disabled = true;
      }
      if(destinoSelect[i].value== 'santiago' || destinoSelect[i].value=='la_altagracia'){
        destinoSelect[i].disabled=false;
      }
    }

    anillo1 = new Destino("radio1_0a2","Radio de 0 a 2km","De 0 a 2km","anillo",0,1.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7607.098948932349!2d-69.89771320745126!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865438956!5m2!1sen!2sdo");
    anillo2 = new Destino("radio2_2a4","Radio de 2 a 4km","De 2 a 4km","anillo",2,3.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15214.197897864698!2d-69.90211348221091!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865465765!5m2!1sen!2sdo");
    anillo3 = new Destino("radio3_4a6","Radio de 4 a 6km","De 4 a 6km","anillo",4,5.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30428.395795729397!2d-69.91091403173019!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865480730!5m2!1sen!2sdo");
    anillo4 = new Destino("radio4_6a9","Radio de 6 a 9km","De 6 a 9km","anillo",6,8.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30428.395795729397!2d-69.91091403173019!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865480730!5m2!1sen!2sdo");
    anillo5 = new Destino("radio5_9a15","Radio de 9 a 15km","De 9 a 15km","anillo",9,14.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60856.791591458794!2d-69.92851513076874!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865495166!5m2!1sen!2sdo");
    anillo6 = new Destino("radio6_15a20","Radio de 15 a 20km","De 15 a 20km","anillo",15,19.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121713.58318291759!2d-69.96371732884583!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865516133!5m2!1sen!2sdo");
    anillo7 = new Destino("radio7_20a30","Radio de 20 a 30km","De 20 a 30km","anillo",20,29.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121713.58318291759!2d-69.96371732884583!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865516133!5m2!1sen!2sdo");

    azua = new Destino("azua","Azua",116,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484216.0981105487!2d-70.56353554185088!3d18.5316916526794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eba97d23fd11607%3A0x559ad671c7feaa7b!2sAzua%20Province!3m2!1d18.4552709!2d-70.73809279999999!5e0!3m2!1sen!2sdo!4v1676863781883!5m2!1sen!2sdo");
    bahoruco = new Destino("bahoruco","Bahoruco",208,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d969291.7904909919!2d-71.21410033100986!3d18.3793721843427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eba70f875da17bb%3A0x197457425521e956!2sBahoruco!3m2!1d18.487989799999998!2d-71.4182249!5e0!3m2!1sen!2sdo!4v1676863818948!5m2!1sen!2sdo");
    barahona = new Destino("barahona","Barahona",190,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484723.42426382954!2d-70.80957175092252!3d18.351766107658765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8ebaf4a722a12925%3A0x66ea9bf624b43bfe!2sBarahona!3m2!1d18.212080699999998!2d-71.10240759999999!5e0!3m2!1sen!2sdo!4v1676863848093!5m2!1sen!2sdo");
    dajabon = new Destino("dajabon","Dajabón",312,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964795.8827830742!2d-71.36167035616413!3d19.16312115432632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb124dc9e1e1d27%3A0x29098fe5a1031b4b!2sDajabon!3m2!1d19.5499241!2d-71.7086514!5e0!3m2!1sen!2sdo!4v1676863877222!5m2!1sen!2sdo");
    duarte = new Destino("duarte","Duarte",138,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483234.5662641445!2d-70.37015814982746!3d18.875097325157835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eae2dee3ffb7057%3A0xd95e284daea547d0!2sDuarte%20Province!3m2!1d19.2090823!2d-70.02700039999999!5e0!3m2!1sen!2sdo!4v1676863901159!5m2!1sen!2sdo");
    el_seibo = new Destino("el_seibo","El Seibo",131,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484050.55067419127!2d-69.70362863262963!3d18.590040080539193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eaf365985be47ef%3A0x2e08729a0a7da94c!2sEl%20Seibo!3m2!1d18.7653036!2d-69.0389048!5e0!3m2!1sen!2sdo!4v1676863926620!5m2!1sen!2sdo");
    elias_pina = new Destino("elias_pina","Elías Piña",249,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968189.4388306567!2d-71.35719832963096!3d18.574489774626183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb0bb070f953767%3A0xb14c33e611e79982!2sElias%20Pina!3m2!1d18.8766964!2d-71.7044138!5e0!3m2!1sen!2sdo!4v1676863971347!5m2!1sen!2sdo");

    espaillat = new Destino("espaillat","Espaillat",188,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965358.6119190314!2d-70.72116563438131!3d19.066723727090874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eae1497f201bbcb%3A0xddb4a3350ed35157!2sEspaillat%20Province!3m2!1d19.6277658!2d-70.2786775!5e0!3m2!1sen!2sdo!4v1677813650917!5m2!1sen!2sdo");
    hato_mayor = new Destino("hato_mayor","Hato Mayor",109,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484066.98333640356!2d-69.84708337261735!3d18.584256167424066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eaf14741a9332ad%3A0x72d454e8f7e0588d!2sHato%20Mayor%20Province!3m2!1d18.7635799!2d-69.2557637!5e0!3m2!1sen!2sdo!4v1676864035974!5m2!1sen!2sdo");
    hermanas_mirabal = new Destino("hermanas_mirabal","Hermanas Mirabal",145,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966159.8093992785!2d-70.75636842618269!3d18.928660469118228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eae28a6dfa8ee83%3A0x6ac685def5196033!2sHermanas%20Mirabal%20Province!3m2!1d19.3747559!2d-70.35132349999999!5e0!3m2!1sen!2sdo!4v1676864071461!5m2!1sen!2sdo");
    independencia = new Destino("independencia","Independencia",224,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d969345.3018862685!2d-71.26663159321413!3d18.36984969938268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eba12f367b8b02b%3A0x16db87f341dc1241!2sIndependencia%20Province!3m2!1d18.3785651!2d-71.5232874!5e0!3m2!1sen!2sdo!4v1676864097522!5m2!1sen!2sdo");
    la_altagracia = new Destino("la_altagracia","La Altagracia",195,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d780879.3022867908!2d-69.49821728718833!3d18.520601852085512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m3!3m2!1d18.60166!2d-68.4774394!5e0!3m2!1sen!2sdo!4v1676864184313!5m2!1sen!2sdo");
    la_romana = new Destino("la_romana","La Romana",117,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484402.2925067805!2d-69.71061571832799!3d18.465853515578992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eaf5468f250cc2b%3A0x174be55fc8eb99d9!2sLa%20Romana!3m2!1d18.4338645!2d-68.9658817!5e0!3m2!1sen!2sdo!4v1676864218918!5m2!1sen!2sdo");
    la_vega = new Destino("la_vega","La Vega",121,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483310.5349458457!2d-70.48900660753579!3d18.848733774497788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb02b63a789839f%3A0xc6e5e3cbe8b2f96!2sLa%20Vega!3m2!1d19.218854699999998!2d-70.5238948!5e0!3m2!1sen!2sdo!4v1676864249146!5m2!1sen!2sdo");
    maria_trinidad_sanchez = new Destino("maria_trinidad_sanchez","María Trinidad Sánchez",140,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966234.764125679!2d-70.36872362998527!3d18.915694541546916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eae469a760ea1c3%3A0xde270504a6ff4531!2sMaria%20Trinidad%20Sanchez!3m2!1d19.373459699999998!2d-69.85144389999999!5e0!3m2!1sen!2sdo!4v1676864283897!5m2!1sen!2sdo");
    monsenor_nouel = new Destino("monsenor_nouel","Monseñor Nouel",82,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483734.35433234856!2d-70.41914886469816!3d18.70099773980766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eafde3435e95489%3A0x5a72182177f9a7b7!2sMonse%C3%B1or%20Nouel%20Province!3m2!1d18.921523399999998!2d-70.3836815!5e0!3m2!1sen!2sdo!4v1676864320098!5m2!1sen!2sdo");
    monte_plata = new Destino("monte_plata","Monte Plata",63.2,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d241963.93390232432!2d-69.9484636982815!3d18.63316685100754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eaf98a11d0c8123%3A0x18fb4bd03d6f498a!2sMonte%20Plata%20Province!3m2!1d18.8080878!2d-69.7869146!5e0!3m2!1sen!2sdo!4v1676864351161!5m2!1sen!2sdo");
    montecristi = new Destino("montecristi","Montecristi",277,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964795.8827830742!2d-71.32766385616414!3d19.16312115432632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb143e98a5e0a53%3A0x7cec19fc8b92807e!2sMonte%20Cristi!3m2!1d19.8473452!2d-71.6406361!5e0!3m2!1sen!2sdo!4v1676864393282!5m2!1sen!2sdo");
    pedernales = new Destino("pedernales","Pedernales",312,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d970594.1286717306!2d-71.37797652807463!3d18.146247797024852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eba31c0325eee77%3A0xe914a9533c22d29a!2sPedernales!3m2!1d18.0368683!2d-71.7454674!5e0!3m2!1sen!2sdo!4v1676864428653!5m2!1sen!2sdo");
    peravia = new Destino("peravia","Peravia",62.7,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242279.61871870668!2d-70.25150756331405!3d18.41018148297536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8ea54e7e1f15ff13%3A0x559273a9339c6271!2sPeravia%20Province!3m2!1d18.2786594!2d-70.33358869999999!5e0!3m2!1sen!2sdo!4v1676864459042!5m2!1sen!2sdo");
    puerto_plata = new Destino("puerto_plata","Puerto Plata",212,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964986.5888691319!2d-70.8509987996144!3d19.130504929018638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb1ee3f0046fa75%3A0x10c1300286d97467!2sPuerto%20Plata!3m2!1d19.7807686!2d-70.6871091!5e0!3m2!1sen!2sdo!4v1676864486701!5m2!1sen!2sdo");
    samana = new Destino("samana","Samaná",173,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483285.9021101846!2d-69.89708200503635!3d18.857286043593067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eaee72b27c60421%3A0xde564e1f6d9013!2sSamana!3m2!1d19.2030757!2d-69.3387664!5e0!3m2!1sen!2sdo!4v1676864521953!5m2!1sen!2sdo");
    san_cristobal = new Destino("san_cristobal","San Cristóbal",30.5,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d121107.82637343464!2d-70.07543274855347!3d18.455574144631527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8ea55ef2a2764f53%3A0xe5e76058f4325896!2sSan%20Crist%C3%B3bal!3m2!1d18.4169111!2d-70.1072502!5e0!3m2!1sen!2sdo!4v1676864551937!5m2!1sen!2sdo");
    san_jose_de_ocoa = new Destino("san_jose_de_ocoa","San José de Ocoa",107,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242293.2119255671!2d-70.34080341396135!3d18.400521306091797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb000eab15607e1%3A0xdbc41b6c29ec2e75!2sSan%20Jose%20de%20Ocoa!3m2!1d18.543858!2d-70.5041816!5e0!3m2!1sen!2sdo!4v1676864581781!5m2!1sen!2sdo");
    san_juan = new Destino("san_juan","San Juan",195,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968367.9740067782!2d-71.10992246196685!3d18.54302329879722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb088427d7e2c7f%3A0xaab559e428da2932!2sSan%20Juan%20de%20la%20Maguana!3m2!1d18.8096268!2d-71.2309935!5e0!3m2!1sen!2sdo!4v1676864624134!5m2!1sen!2sdo");
    san_pedro_de_macoris = new Destino("san_pedro_de_macoris","San Pedro de Macorís",69.8,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242224.3026668252!2d-69.7401514606799!3d18.449442139086244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eaf609388bba20d%3A0x5a0142fce45d04c4!2sSan%20Pedro%20De%20Macoris!3m2!1d18.46266!2d-69.3051234!5e0!3m2!1sen!2sdo!4v1676864652882!5m2!1sen!2sdo");
    sanchez_ramirez = new Destino("sanchez_ramirez","Sánchez Ramírez",111,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483549.30969008413!2d-70.38704853176411!3d18.765638961548046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eafc60e3306e8c3%3A0x4c64eeb1faf6d3c5!2sS%C3%A1nchez%20Ram%C3%ADrez%20Province%2C%2043000!3m2!1d19.052706!2d-70.1492264!5e0!3m2!1sen!2sdo!4v1676864821511!5m2!1sen!2sdo");
    santiago = new Destino("santiago","Santiago",159,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965869.4519956749!2d-70.85721910078986!3d18.97880693950195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb1c5c838e5899f%3A0x75d4b059b8768429!2sSantiago%20De%20Los%20Caballeros!3m2!1d19.479196299999998!2d-70.6930568!5e0!3m2!1sen!2sdo!4v1676864847706!5m2!1sen!2sdo");
    santiago_rodriguez = new Destino("santiago_rodriguez","Santiago Rodríguez",263,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965502.623785914!2d-71.1862542671969!3d19.041978508602888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb104fa2c41f3ff%3A0x967ee3cf50117836!2sSantiago%20Rodr%C3%ADguez!3m2!1d19.471318099999998!2d-71.33958009999999!5e0!3m2!1sen!2sdo!4v1676864878089!5m2!1sen!2sdo");
    santo_domingo = new Destino("santo_domingo", "Santo Domingo",0,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15214.197897864698!2d-69.90211348221091!3d18.495148085860873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl!5e0!3m2!1sen!2sdo!4v1676865465765!5m2!1sen!2sdo");
    valverde = new Destino("valverde","Valverde",200,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965502.623785914!2d-70.99792176719691!3d19.041978508602888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf884535825449%3A0x9bbf0c5fa608b988!2sPyL%20Decoraciones%2C%20Srl%2C%20Calle%20Josefa%20Brea%2C%20Santo%20Domingo!3m2!1d18.4944079!2d-69.8950073!4m5!1s0x8eb1a30092515e67%3A0xfc0da5a2c1231d1f!2sValverde%20Province!3m2!1d19.5881221!2d-70.98033099999999!5e0!3m2!1sen!2sdo!4v1676864904936!5m2!1sen!2sdo");
  }

  else if(puntoPartida[2].checked==true){
    for(let i =0;i<destinoSelect.length;i++){
      if(destinoSelect[i].value=='santiago'){
        destinoSelect[i].disabled = true;
      }
      if(destinoSelect[i].value== 'santo_domingo' || destinoSelect[i].value=='la_altagracia'){
        destinoSelect[i].disabled=false;
      }
    }

    // while (destinoSelect.firstChild) {
    //     destinoSelect.removeChild(destinoSelect.firstChild);
    //   }

    anillo1 = new Destino("radio1_0a2","Radio de 0 a 2km","De 0 a 2km","anillo",0,1.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34541.765719212606!2d-70.7475396267562!3d19.476689581541407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417390351!5m2!1sen!2sdo");
    anillo2 = new Destino("radio2_2a4","Radio de 2 a 4km","De 2 a 4km","anillo",2,3.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79808.0260252308!2d-70.74894125572536!3d19.49533899157349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417468782!5m2!1sen!2sdo");
    anillo3 = new Destino("radio3_4a6","Radio de 4 a 6km","De 4 a 6km","anillo",4,5.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79808.0260252308!2d-70.74894125572536!3d19.49533899157349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417468782!5m2!1sen!2sdo");
    anillo4 = new Destino("radio4_6a9","Radio de 6 a 9km","De 6 a 9km","anillo",6,8.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d148455.27204471338!2d-70.76225925125348!3d19.50678529809528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417492055!5m2!1sen!2sdo");
    anillo5 = new Destino("radio5_9a15","Radio de 9 a 15km","De 9 a 15km","anillo",9,14.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102684.51329842287!2d-70.75337723357242!3d19.49976071342101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417554050!5m2!1sen!2sdo");
    anillo6 = new Destino("radio6_15a20","Radio de 15 a 20km","De 15 a 20km","anillo",15,19.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d197068.94449739257!2d-70.77613011670816!3d19.513584002192093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417518005!5m2!1sen!2sdo");
    anillo7 = new Destino("radio7_20a30","Radio de 20 a 30km","De 20 a 30km","anillo",20,29.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d197068.94449739257!2d-70.77613011670816!3d19.513584002192093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417518005!5m2!1sen!2sdo");

    azua = new Destino("azua","Azua",250,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966515.6817707429!2d-70.95033714806989!3d18.867024062576583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8ebaa3e331114e5f%3A0x5d27855c0b125837!2sAzua!3m2!1d18.4531742!2d-70.73468869999999!5e0!3m2!1sen!2sdo!4v1677416299397!5m2!1sen!2sdo");
    bahoruco = new Destino("bahoruco","Bahoruco",342,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966515.6817707429!2d-71.29186634806989!3d18.867024062576583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eba70f875da17bb%3A0x197457425521e956!2sBahoruco!3m2!1d18.487989799999998!2d-71.4182249!5e0!3m2!1sen!2sdo!4v1677294393606!5m2!1sen!2sdo");
    barahona = new Destino("barahona","Barahona",324,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966651.6669068398!2d-71.16762412906459!3d18.84342040594167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8ebaf4a722a12925%3A0x66ea9bf624b43bfe!2sBarahona!3m2!1d18.212080699999998!2d-71.10240759999999!5e0!3m2!1sen!2sdo!4v1677294420085!5m2!1sen!2sdo");
    dajabon = new Destino("dajabon","Dajabón",147,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d481019.7336808518!2d-71.49584232516392!3d19.62872267349815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb124dc9e1e1d27%3A0x29098fe5a1031b4b!2sDajabon!3m2!1d19.5499241!2d-71.7086514!5e0!3m2!1sen!2sdo!4v1677294442411!5m2!1sen!2sdo");
    duarte = new Destino("duarte","Duarte",115,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d373587.9521792954!2d-70.50676827762902!3d19.360358321527777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eae2dee3ffb7057%3A0xd95e284daea547d0!2sDuarte%20Province!3m2!1d19.2090823!2d-70.02700039999999!5e0!3m2!1sen!2sdo!4v1677294472238!5m2!1sen!2sdo");
    el_seibo = new Destino("el_seibo","El Seibo",299,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966088.7804087471!2d-70.44140225077382!3d18.940939418673615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eaf365985be47ef%3A0x2e08729a0a7da94c!2sEl%20Seibo!3m2!1d18.7653036!2d-69.0389048!5e0!3m2!1sen!2sdo!4v1677294499216!5m2!1sen!2sdo");
    elias_pina = new Destino("elias_pina","Elías Piña",382,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966515.6817707429!2d-71.43496459806988!3d18.867024062576583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb0bb070f953767%3A0xb14c33e611e79982!2sElias%20Pina!3m2!1d18.8766964!2d-71.7044138!5e0!3m2!1sen!2sdo!4v1677294580704!5m2!1sen!2sdo");
    espaillat = new Destino("espaillat","Espaillat",86.2,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d240638.38685018342!2d-70.64104718517443!3d19.542695664059565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eae1497f201bbcb%3A0xddb4a3350ed35157!2sEspaillat%20Province!3m2!1d19.6277658!2d-70.2786775!5e0!3m2!1sen!2sdo!4v1677294611037!5m2!1sen!2sdo");
    hato_mayor = new Destino("hato_mayor","Hato Mayor",276,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966088.7804087473!2d-70.54136735077383!3d18.94093941867359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eaf14741a9332ad%3A0x72d454e8f7e0588d!2sHato%20Mayor%20Province!3m2!1d18.7635799!2d-69.2557637!5e0!3m2!1sen!2sdo!4v1677294636592!5m2!1sen!2sdo");
    hermanas_mirabal = new Destino("hermanas_mirabal","Hermanas Mirabal",52.3,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d298543.74830036773!2d-70.6395295136498!3d19.42878375464391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eae28a6dfa8ee83%3A0x6ac685def5196033!2sHermanas%20Mirabal%20Province!3m2!1d19.3747559!2d-70.35132349999999!5e0!3m2!1sen!2sdo!4v1677294707402!5m2!1sen!2sdo");
    independencia = new Destino("independencia","Independencia",358,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966543.9571596187!2d-71.34439760451455!3d18.862118498198384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eba12f367b8b02b%3A0x16db87f341dc1241!2sIndependencia%20Province!3m2!1d18.3785651!2d-71.5232874!5e0!3m2!1sen!2sdo!4v1677294734929!5m2!1sen!2sdo");
    la_altagracia = new Destino("la_altagracia","La Altagracia",364,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d957970.511080335!2d-70.13431403260839!3d18.802286135288654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m3!3m2!1d18.6082857!2d-68.4895706!5e0!3m2!1sen!2sdo!4v1677416470695!5m2!1sen!2sdo");
    la_romana = new Destino("la_romana","La Romana",285,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966088.7804087473!2d-70.40486665077377!3d18.94093941867359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eaf5468f250cc2b%3A0x174be55fc8eb99d9!2sLa%20Romana!3m2!1d18.4338645!2d-68.9658817!5e0!3m2!1sen!2sdo!4v1677294878233!5m2!1sen!2sdo");
    la_vega = new Destino("la_vega","La Vega",40,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d240900.36493883168!2d-70.76284459764497!3d19.366199324550557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb02b63a789839f%3A0xc6e5e3cbe8b2f96!2sLa%20Vega%2C%2041000!3m2!1d19.218854699999998!2d-70.5238948!5e0!3m2!1sen!2sdo!4v1677294916614!5m2!1sen!2sdo");
    maria_trinidad_sanchez = new Destino("maria_trinidad_sanchez","María Trinidad Sánchez",151,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d481982.30132139294!2d-70.56722227278726!3d19.304674487506407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eae469a760ea1c3%3A0xde270504a6ff4531!2sMaria%20Trinidad%20Sanchez!3m2!1d19.373459699999998!2d-69.85144389999999!5e0!3m2!1sen!2sdo!4v1677294986414!5m2!1sen!2sdo");
    monsenor_nouel = new Destino("monsenor_nouel","Monseñor Nouel",80.2,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d482289.6631886005!2d-70.8334394539649!3d19.20009386608031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eafde3435e95489%3A0x5a72182177f9a7b7!2sMonse%C3%B1or%20Nouel%20Province!3m2!1d18.921523399999998!2d-70.3836815!5e0!3m2!1sen!2sdo!4v1677295022729!5m2!1sen!2sdo");
    monte_plata = new Destino("monte_plata","Monte Plata",206,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965638.7199190273!2d-70.78443299820967!3d19.018564940567252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eaf98a11d0c8123%3A0xef4e71a6a5c3398d!2sMonte%20Plata!3m2!1d18.8069496!2d-69.7852843!5e0!3m2!1sen!2sdo!4v1677416556350!5m2!1sen!2sdo");
    montecristi = new Destino("montecristi","Montecristi",112,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d480916.3741389462!2d-71.46183581468259!3d19.663213454322396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb143e98a5e0a53%3A0x7cec19fc8b92807e!2sMonte%20Cristi!3m2!1d19.8473452!2d-71.6406361!5e0!3m2!1sen!2sdo!4v1677416575277!5m2!1sen!2sdo");
    pedernales = new Destino("pedernales","Pedernales",446,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d967825.2611333044!2d-71.4557425465982!3d18.638516485119023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eba31c0325eee77%3A0xe914a9533c22d29a!2sPedernales!3m2!1d18.0368683!2d-71.7454674!5e0!3m2!1sen!2sdo!4v1677416601938!5m2!1sen!2sdo");
    peravia = new Destino("peravia","Peravia",197,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966515.6817707429!2d-70.94422284806986!3d18.867024062576583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8ea54e7e1f15ff13%3A0x559273a9339c6271!2sPeravia%20Province!3m2!1d18.2786594!2d-70.33358869999999!5e0!3m2!1sen!2sdo!4v1677416656654!5m2!1sen!2sdo");
    puerto_plata = new Destino("puerto_plata","Puerto Plata",70.6,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d240471.8978025961!2d-70.86273207724982!3d19.65406865608452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb1ee3f0046fa75%3A0x10c1300286d97467!2sPuerto%20Plata!3m2!1d19.7807686!2d-70.6871091!5e0!3m2!1sen!2sdo!4v1677416685178!5m2!1sen!2sdo");
    samana = new Destino("samana","Samaná",200,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d481982.30132139294!2d-70.31104717278733!3d19.304674487506407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eaee72b27c60421%3A0xde564e1f6d9013!2zU2FtYW7DoQ!3m2!1d19.2030757!2d-69.3387664!5e0!3m2!1sen!2sdo!4v1677416710404!5m2!1sen!2sdo");
    san_cristobal = new Destino("san_cristobal","San Cristóbal",162,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966053.1002711419!2d-70.94227859264228!3d18.947104635889588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8ea55ef2a2764f53%3A0xe5e76058f4325896!2sSan%20Crist%C3%B3bal!3m2!1d18.4169111!2d-70.1072502!5e0!3m2!1sen!2sdo!4v1677416008168!5m2!1sen!2sdo");
    san_jose_de_ocoa = new Destino("san_jose_de_ocoa","San José de Ocoa",150,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d678059.4668266907!2d-70.81751795127578!3d19.020906143116406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb000eab15607e1%3A0xdbc41b6c29ec2e75!2sSan%20Jose%20de%20Ocoa!3m2!1d18.543858!2d-70.5041816!5e0!3m2!1sen!2sdo!4v1677416034946!5m2!1sen!2sdo");
    san_juan = new Destino("san_juan","San Juan",329,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966515.681770743!2d-71.19825154806996!3d18.867024062576572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb088427d7e2c7f%3A0xaab559e428da2932!2sSan%20Juan%20de%20la%20Maguana!3m2!1d18.8096268!2d-71.2309935!5e0!3m2!1sen!2sdo!4v1677416054971!5m2!1sen!2sdo");
    san_pedro_de_macoris = new Destino("san_pedro_de_macoris","San Pedro de Macorís",237,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966088.7804087471!2d-70.57451110077382!3d18.940939418673615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eaf609388bba20d%3A0x5a0142fce45d04c4!2sSan%20Pedro%20De%20Macoris!3m2!1d18.46266!2d-69.3051234!5e0!3m2!1sen!2sdo!4v1677416134824!5m2!1sen!2sdo");
    sanchez_ramirez = new Destino("sanchez_ramirez","Sánchez Ramírez",97.6,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d482403.04602720257!2d-70.70448466546658!3d19.161376429084306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eafc60e3306e8c3%3A0x4c64eeb1faf6d3c5!2sSanchez%20Ramirez!3m2!1d19.052706!2d-70.1492264!5e0!3m2!1sen!2sdo!4v1677416152496!5m2!1sen!2sdo");
    santiago = new Destino("santiago","Santiago",0,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79808.0260252308!2d-70.74894125572536!3d19.49533899157349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos!5e0!3m2!1sen!2sdo!4v1677417468782!5m2!1sen!2sdo");
    santiago_rodriguez = new Destino("santiago_rodriguez","Santiago Rodríguez",97.7,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d240580.47671274305!2d-71.20918593241802!3d19.58150372407501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb104fa2c41f3ff%3A0x967ee3cf50117836!2sSantiago%20Rodr%C3%ADguez!3m2!1d19.471318099999998!2d-71.33958009999999!5e0!3m2!1sen!2sdo!4v1677416225326!5m2!1sen!2sdo");
    santo_domingo = new Destino ("santo_domingo", "Santo Domingo",158, "provincia",null, null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d86850.079373729!2d-70.02230164643545!3d18.457163099377386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eaf89f1107ea5ab%3A0xd6c587b82715c164!2sSanto%20Domingo!3m2!1d18.486057499999998!2d-69.93121169999999!5e0!3m2!1sen!2sdo!4v1677417975413!5m2!1sen!2sdo");
    valverde = new Destino("valverde","Valverde",35.4,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d120319.51081934801!2d-70.92193918040167!3d19.542269854828874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eb1c57f4648eed1%3A0xcb796fb2340ace6c!2sCielos%20Acusticos%2C%20C-11%2C%20Santiago%20De%20Los%20Caballeros!3m2!1d19.479089899999998!2d-70.722788!4m5!1s0x8eb1a30092515e67%3A0xfc0da5a2c1231d1f!2sValverde%20Province!3m2!1d19.5881221!2d-70.98033099999999!5e0!3m2!1sen!2sdo!4v1677416245276!5m2!1sen!2sdo");

  }
  else if(puntoPartida[3].checked==true){
    for(let i =0;i<destinoSelect.length;i++){
      if(destinoSelect[i].value=='santo_domingo'){
        destinoSelect[i].disabled = true;
      }
      if(destinoSelect[i].value== 'santiago' || destinoSelect[i].value=='la_altagracia'){
        destinoSelect[i].disabled=false;
      }
    }

    anillo1= new Destino("radio1_0a2","Radio de 0 a 2km","De 0 a 2km","anillo",0,1.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5852.127533424505!2d-69.849980609015!3d18.534704427323213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677443912790!5m2!1sen!2sdo");
    anillo2= new Destino("radio2_2a4","Radio de 2 a 4km","De 2 a 4km","anillo",2,3.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10863.018346660812!2d-69.85231133035893!3d18.534812223874066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677443943749!5m2!1sen!2sdo");
    anillo3= new Destino("radio3_4a6","Radio de 4 a 6km","De 4 a 6km","anillo",4,5.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17023.370642405098!2d-69.85470498917745!3d18.535507982056014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677443965813!5m2!1sen!2sdo");
    anillo4= new Destino("radio4_6a9","Radio de 6 a 9km","De 6 a 9km","anillo",6,8.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23865.626365694978!2d-69.8577129375267!3d18.536225559598307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677443991689!5m2!1sen!2sdo");
    anillo5= new Destino("radio5_9a15","Radio de 9 a 15km","De 9 a 15km","anillo",9,14.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44963.07701464212!2d-69.86638934395523!3d18.537530415956436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677444016347!5m2!1sen!2sdo");
    anillo6= new Destino("radio6_15a20","Radio de 15 a 20km","De 15 a 20km","anillo",15,19.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90374.74768871765!2d-69.87901223672539!3d18.542903702375384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677444038858!5m2!1sen!2sdo");
    anillo7= new Destino("radio7_20a30","Radio de 20 a 30km","De 20 a 30km","anillo",20,29.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113424.8141797609!2d-69.88672668062415!3d18.544327529258027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677444066850!5m2!1sen!2sdo");

    azua= new Destino("azua","Azua",147,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484516.33092329616!2d-70.5595475799025!3d18.4254175522718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8ebaa3e331114e5f%3A0x5d27855c0b125837!2sAzua!3m2!1d18.4531742!2d-70.73468869999999!5e0!3m2!1sen!2sdo!4v1677442536083!5m2!1sen!2sdo");
    bahoruco= new Destino("bahoruco","Bahoruco",222,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d969205.0976210618!2d-71.18136311123826!3d18.394789293527342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eba70f875da17bb%3A0x197457425521e956!2sBahoruco!3m2!1d18.487989799999998!2d-71.4182249!5e0!3m2!1sen!2sdo!4v1677442558254!5m2!1sen!2sdo");
    barahona= new Destino("barahona","Barahona",204,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484667.1701870424!2d-70.77683454521255!3d18.371800715645737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8ebaf4a722a12925%3A0x66ea9bf624b43bfe!2sBarahona!3m2!1d18.212080699999998!2d-71.10240759999999!5e0!3m2!1sen!2sdo!4v1677442585944!5m2!1sen!2sdo");
    dajabon= new Destino("dajabon","Dajabón",322,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964634.197064545!2d-71.33684636932722!3d19.190732268430388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb124dc9e1e1d27%3A0x29098fe5a1031b4b!2sDajabon!3m2!1d19.5499241!2d-71.7086514!5e0!3m2!1sen!2sdo!4v1677442611369!5m2!1sen!2sdo");
    duarte= new Destino("duarte","Duarte",128,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483253.0480173053!2d-70.30104145170279!3d18.868686835770326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eae2dee3ffb7057%3A0xd95e284daea547d0!2sDuarte%20Province!3m2!1d19.2090823!2d-70.02700039999999!5e0!3m2!1sen!2sdo!4v1677442642988!5m2!1sen!2sdo");
    el_seibo= new Destino("el_seibo","El Seibo",132,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484050.5506741912!2d-69.72323928262965!3d18.590040080539207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eaf365985be47ef%3A0x2e08729a0a7da94c!2sEl%20Seibo!3m2!1d18.7653036!2d-69.0389048!5e0!3m2!1sen!2sdo!4v1677442666414!5m2!1sen!2sdo");
    elias_pina= new Destino("elias_pina","Elías Piña",262,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968189.4388306567!2d-71.32446112963093!3d18.574489774626194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb0bb070f953767%3A0xb14c33e611e79982!2sElias%20Pina!3m2!1d18.8766964!2d-71.7044138!5e0!3m2!1sen!2sdo!4v1677442699907!5m2!1sen!2sdo");
    espaillat= new Destino("espaillat","Espaillat",198,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965137.5145779946!2d-70.65205343400253!3d19.104654300454662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eae1497f201bbcb%3A0xddb4a3350ed35157!2sEspaillat%20Province!3m2!1d19.6277658!2d-70.2786775!5e0!3m2!1sen!2sdo!4v1677442722460!5m2!1sen!2sdo");
    hato_mayor= new Destino("hato_mayor","Hato Mayor",109,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242033.49166820178!2d-69.68309570159361!3d18.58425616742408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eaf14741a9332ad%3A0x72d454e8f7e0588d!2sHato%20Mayor%20Province!3m2!1d18.7635799!2d-69.2557637!5e0!3m2!1sen!2sdo!4v1677442751446!5m2!1sen!2sdo");
    hermanas_mirabal= new Destino("hermanas_mirabal","Hermanas Mirabal",155,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d786892.0063116568!2d-70.57041621614115!3d18.96939548164757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eae28a6dfa8ee83%3A0x6ac685def5196033!2sHermanas%20Mirabal%20Province!3m2!1d19.3747559!2d-70.35132349999999!5e0!3m2!1sen!2sdo!4v1677442786596!5m2!1sen!2sdo");
    independencia= new Destino("independencia","Independencia",238,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d969232.6899929623!2d-71.23389436753105!3d18.389883731492766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eba12f367b8b02b%3A0x16db87f341dc1241!2sIndependencia%20Province!3m2!1d18.3785651!2d-71.5232874!5e0!3m2!1sen!2sdo!4v1677442808661!5m2!1sen!2sdo");
    la_altagracia= new Destino("la_altagracia","La Altagracia",195,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d121019.44474877165!2d-68.55171309868295!3d18.580455402484635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m3!3m2!1d18.5990777!2d-68.47323209999999!5e0!3m2!1sen!2sdo!4v1677442867273!5m2!1sen!2sdo");
    la_romana= new Destino("la_romana","La Romana",118,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484392.4980105243!2d-69.68670371733387!3d18.46932248242404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eaf5468f250cc2b%3A0x174be55fc8eb99d9!2sLa%20Romana!3m2!1d18.4338645!2d-68.9658817!5e0!3m2!1sen!2sdo!4v1677442892160!5m2!1sen!2sdo");
    la_vega= new Destino("la_vega","La Vega",132,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483226.2639327794!2d-70.46543989898507!3d18.877976347939498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb02b63a789839f%3A0xc6e5e3cbe8b2f96!2sLa%20Vega!3m2!1d19.218854699999998!2d-70.5238948!5e0!3m2!1sen!2sdo!4v1677442913771!5m2!1sen!2sdo");
    maria_trinidad_sanchez= new Destino("maria_trinidad_sanchez","María Trinidad Sánchez",130,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d582892.2775301711!2d-70.1823151926868!3d18.927794849791923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eae469a760ea1c3%3A0xde270504a6ff4531!2sMaria%20Trinidad%20Sanchez!3m2!1d19.373459699999998!2d-69.85144389999999!5e0!3m2!1sen!2sdo!4v1677442944244!5m2!1sen!2sdo");
    monsenor_nouel= new Destino("monsenor_nouel","Monseñor Nouel",92.2,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d377691.10704885755!2d-70.28906942234971!3d18.73022828633258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eafde3435e95489%3A0x5a72182177f9a7b7!2sMonse%C3%B1or%20Nouel%20Province!3m2!1d18.921523399999998!2d-70.3836815!5e0!3m2!1sen!2sdo!4v1677442969028!5m2!1sen!2sdo");
    monte_plata= new Destino("monte_plata","Monte Plata",47.4,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d241920.6526406619!2d-69.94200189622057!3d18.66353837879371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eaf98a11d0c8123%3A0x18fb4bd03d6f498a!2sMonte%20Plata%20Province!3m2!1d18.8080878!2d-69.7869146!5e0!3m2!1sen!2sdo!4v1677442992434!5m2!1sen!2sdo");
    montecristi= new Destino("montecristi","Montecristi",262,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d964953.5408906051!2d-71.20574449208465!3d19.13616091656549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb143e98a5e0a53%3A0xb9b42292b2923a9f!2sMonte%20Cristi%20Province!3m2!1d19.7396899!2d-71.44339839999999!5e0!3m2!1sen!2sdo!4v1677443017151!5m2!1sen!2sdo");
    pedernales= new Destino("pedernales","Pedernales",326,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d970482.8403285389!2d-71.3452393026862!3d18.16628182467824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eba31c0325eee77%3A0xe914a9533c22d29a!2sPedernales!3m2!1d18.0368683!2d-71.7454674!5e0!3m2!1sen!2sdo!4v1677443042533!5m2!1sen!2sdo");
    peravia= new Destino("peravia","Peravia",76.6,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242257.948401133!2d-70.21877036228204!3d18.42557164615937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8ea54e7e1f15ff13%3A0x559273a9339c6271!2sPeravia%20Province!3m2!1d18.2786594!2d-70.33358869999999!5e0!3m2!1sen!2sdo!4v1677443072402!5m2!1sen!2sdo");
    puerto_plata= new Destino("puerto_plata","Puerto Plata",223,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d808070.929113511!2d-70.74840483460086!3d19.140401429582216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb1ee3f0046fa75%3A0x10c1300286d97467!2sPuerto%20Plata!3m2!1d19.7807686!2d-70.6871091!5e0!3m2!1sen!2sdo!4v1677443098871!5m2!1sen!2sdo");
    samana= new Destino("samana","Samaná",163,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483198.33754550066!2d-69.8803282461516!3d18.887657356430633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eaee72b27c60421%3A0xde564e1f6d9013!2sSamana!3m2!1d19.2030757!2d-69.3387664!5e0!3m2!1sen!2sdo!4v1677443122228!5m2!1sen!2sdo");
    san_cristobal= new Destino("san_cristobal","San Cristóbal",44,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d121072.47550269667!2d-70.04269554773937!3d18.505621714752078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8ea55ef2a2764f53%3A0xe5e76058f4325896!2sSan%20Crist%C3%B3bal!3m2!1d18.4169111!2d-70.1072502!5e0!3m2!1sen!2sdo!4v1677443146130!5m2!1sen!2sdo");
    san_jose_de_ocoa= new Destino("san_jose_de_ocoa","San José de Ocoa",135,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484168.1700264298!2d-70.44817489456649!3d18.548602475522564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb000eab15607e1%3A0xdbc41b6c29ec2e75!2sSan%20Jose%20de%20Ocoa!3m2!1d18.543858!2d-70.5041816!5e0!3m2!1sen!2sdo!4v1677443168896!5m2!1sen!2sdo");
    san_juan= new Destino("san_juan","San Juan",209,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d610684.1513155015!2d-70.91390635802976!3d18.58853644209303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb088427d7e2c7f%3A0xaab559e428da2932!2sSan%20Juan%20de%20la%20Maguana!3m2!1d18.8096268!2d-71.2309935!5e0!3m2!1sen!2sdo!4v1677443197783!5m2!1sen!2sdo");
    san_pedro_de_macoris= new Destino("san_pedro_de_macoris","San Pedro de Macorís",70.2,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242196.03100094743!2d-69.71623945933358!3d18.469476891211723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eaf609388bba20d%3A0x5a0142fce45d04c4!2sSan%20Pedro%20De%20Macoris!3m2!1d18.46266!2d-69.3051234!5e0!3m2!1sen!2sdo!4v1677443222065!5m2!1sen!2sdo");
    sanchez_ramirez= new Destino("sanchez_ramirez","Sánchez Ramírez",121,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483549.15972613683!2d-70.36059833174893!3d18.76569126105212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eafc60e3306e8c3%3A0x4c64eeb1faf6d3c5!2sSanchez%20Ramirez!3m2!1d19.052706!2d-70.1492264!5e0!3m2!1sen!2sdo!4v1677443248866!5m2!1sen!2sdo");
    santiago= new Destino("santiago","Santiago",170,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965709.2626765777!2d-70.83365236428496!3d19.00641804835028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb1c5c838e5899f%3A0x75d4b059b8768429!2sSantiago%20De%20Los%20Caballeros!3m2!1d19.479196299999998!2d-70.6930568!5e0!3m2!1sen!2sdo!4v1677443273732!5m2!1sen!2sdo");
    santiago_rodriguez= new Destino("santiago_rodriguez","Santiago Rodríguez",273,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965341.9214057858!2d-71.1614302805781!3d19.06958961924771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb104fa2c41f3ff%3A0x967ee3cf50117836!2sSantiago%20Rodr%C3%ADguez!3m2!1d19.471318099999998!2d-71.33958009999999!5e0!3m2!1sen!2sdo!4v1677443301398!5m2!1sen!2sdo");
    santo_domingo= new Destino("santo_domingo","Santo Domingo",0,"provincia",null,null,"");
    valverde= new Destino("valverde","Valverde",211,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965341.9214057858!2d-70.97435503057814!3d19.06958961924771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8eaf87715d398d5d%3A0xa0cad7617b11354!2sCielos%20Ac%C3%BAsticos%2C%20la%20iverica%20ferreteria%2C%20Avenida%20Charles%20de%20Gaulle%2C%20Santo%20Domingo%20Este!3m2!1d18.5343205!2d-69.8465947!4m5!1s0x8eb1a30092515e67%3A0xfc0da5a2c1231d1f!2sValverde%20Province!3m2!1d19.5881221!2d-70.98033099999999!5e0!3m2!1sen!2sdo!4v1677443345449!5m2!1sen!2sdo");

  }

  else if(puntoPartida[4].checked==true){
    for(let i =0;i<destinoSelect.length;i++){
      if(destinoSelect[i].value=='la_altagracia'){
        destinoSelect[i].disabled = true;
      }
      if(destinoSelect[i].value== 'santiago' || destinoSelect[i].value=='santo_domingo'){
        destinoSelect[i].disabled=false;
      }
    }

    anillo1= new Destino("radio1_0a2","Radio de 0 a 2km","De 0 a 2km","anillo",0,1.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18851.649194220972!2d-68.42208027663028!3d18.641681738808174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677447389088!5m2!1sen!2sdo");
    anillo2= new Destino("radio2_2a4","Radio de 2 a 4km","De 2 a 4km","anillo",2,3.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32030.78956979368!2d-68.42649365563346!3d18.641433663591354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677447413126!5m2!1sen!2sdo");
    anillo3= new Destino("radio3_4a6","Radio de 4 a 6km","De 4 a 6km","anillo",4,5.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43571.17089658143!2d-68.43068568948918!3d18.64056476239794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677447431025!5m2!1sen!2sdo");
    anillo4= new Destino("radio4_6a9","Radio de 6 a 9km","De 6 a 9km","anillo",6,8.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59501.872229258355!2d-68.43611075637521!3d18.63932247494615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677447449075!5m2!1sen!2sdo");
    anillo5= new Destino("radio5_9a15","Radio de 9 a 15km","De 9 a 15km","anillo",9,14.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d97320.76579693853!2d-68.46476252653262!3d18.638975360450942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677447468668!5m2!1sen!2sdo");
    anillo6= new Destino("radio6_15a20","Radio de 15 a 20km","De 15 a 20km","anillo",15,19.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214111.18131305758!2d-68.52839369062805!3d18.63143846935641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677447485192!5m2!1sen!2sdo");
    anillo7= new Destino("radio7_20a30","Radio de 20 a 30km","De 20 a 30km","anillo",20,29.99,"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d459883.44092855445!2d-68.6573864246167!3d18.606990181078032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos!5e0!3m2!1sen!2sdo!4v1677447503510!5m2!1sen!2sdo");

    azua= new Destino("azua","Azua",328,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968880.3506629618!2d-70.1199141871783!3d18.452430436708884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8ebaa3e331114e5f%3A0x5d27855c0b125837!2sAzua!3m2!1d18.4531742!2d-70.73468869999999!5e0!3m2!1sen!2sdo!4v1677446290773!5m2!1sen!2sdo");
    bahoruco= new Destino("bahoruco","Bahoruco",406,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1937788.5908280709!2d-71.02230806194038!3d18.449958877245194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eba70f875da17bb%3A0x197457425521e956!2sBahoruco!3m2!1d18.487989799999998!2d-71.4182249!5e0!3m2!1sen!2sdo!4v1677446313804!5m2!1sen!2sdo");
    barahona= new Destino("barahona","Barahona",389,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d969013.4508576841!2d-70.33720116753169!3d18.428826789983056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8ebaf4a722a12925%3A0x66ea9bf624b43bfe!2sBarahona!3m2!1d18.212080699999998!2d-71.10240759999999!5e0!3m2!1sen!2sdo!4v1677446337184!5m2!1sen!2sdo");
    dajabon= new Destino("dajabon","Dajabón",503,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1929941.0883725148!2d-71.16751694718339!3d19.133251093026516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb124dc9e1e1d27%3A0x29098fe5a1031b4b!2sDajabon!3m2!1d19.5499241!2d-71.7086514!5e0!3m2!1sen!2sdo!4v1677446360044!5m2!1sen!2sdo");
    duarte= new Destino("duarte","Duarte",286,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966807.3917368149!2d-69.76585526455965!3d18.816355381015175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eae2dee3ffb7057%3A0xd95e284daea547d0!2sDuarte%20Province!3m2!1d19.2090823!2d-70.02700039999999!5e0!3m2!1sen!2sdo!4v1677446381476!5m2!1sen!2sdo");
    el_seibo= new Destino("el_seibo","El Seibo",101,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242018.55024084894!2d-68.85139660088214!3d18.59477294237945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eaf365985be47ef%3A0x2e08729a0a7da94c!2sEl%20Seibo!3m2!1d18.7653036!2d-69.0389048!5e0!3m2!1sen!2sdo!4v1677446406624!5m2!1sen!2sdo");
    elias_pina= new Destino("elias_pina","Elías Piña",447,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1936407.104113424!2d-71.16540554309576!3d18.57200421841286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb0bb070f953767%3A0xb14c33e611e79982!2sElias%20Pina!3m2!1d18.8766964!2d-71.7044138!5e0!3m2!1sen!2sdo!4v1677446443709!5m2!1sen!2sdo");
    espaillat= new Destino("espaillat","Espaillat",372,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965457.5749675154!2d-69.98141965693164!3d19.049722467020494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eae1497f201bbcb%3A0xddb4a3350ed35157!2sEspaillat%20Province!3m2!1d19.6277658!2d-70.2786775!5e0!3m2!1sen!2sdo!4v1677446470011!5m2!1sen!2sdo");
    hato_mayor= new Destino("hato_mayor","Hato Mayor",158,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483726.41140514944!2d-69.12431174973553!3d18.703776848629012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eaf3f917088f2c7%3A0xc50a551e2ccaa7e1!2sHato%20Mayor%20del%20Rey!3m2!1d18.7635428!2d-69.2549736!5e0!3m2!1sen!2sdo!4v1677446501320!5m2!1sen!2sdo");
    hermanas_mirabal= new Destino("hermanas_mirabal","Hermanas Mirabal",337,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966332.6277045904!2d-69.98141985634847!3d18.8987528625842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eae28a6dfa8ee83%3A0x6ac685def5196033!2sHermanas%20Mirabal%20Province!3m2!1d19.3747559!2d-70.35132349999999!5e0!3m2!1sen!2sdo!4v1677446519431!5m2!1sen!2sdo");
    independencia= new Destino("independencia","Independencia",423,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1937843.9289999504!2d-71.07483934274212!3d18.44505387839724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eba12f367b8b02b%3A0x16db87f341dc1241!2sIndependencia%20Province!3m2!1d18.3785651!2d-71.5232874!5e0!3m2!1sen!2sdo!4v1677446540722!5m2!1sen!2sdo");
    la_altagracia= new Destino("la_altagracia","La Altagracia",0,"provincia",null,null,"");
    la_romana= new Destino("la_romana","La Romana",88.8,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d242100.44843714996!2d-68.81895755478202!3d18.537056829910266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eaf5468f250cc2b%3A0x174be55fc8eb99d9!2sLa%20Romana!3m2!1d18.4338645!2d-68.9658817!5e0!3m2!1sen!2sdo!4v1677446600599!5m2!1sen!2sdo");
    la_vega= new Destino("la_vega","La Vega",313,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966838.5972646109!2d-70.01427787167263!3d18.81092733668949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb02b63a789839f%3A0xc6e5e3cbe8b2f96!2sLa%20Vega!3m2!1d19.218854699999998!2d-70.5238948!5e0!3m2!1sen!2sdo!4v1677446621857!5m2!1sen!2sdo");
    maria_trinidad_sanchez= new Destino("maria_trinidad_sanchez","María Trinidad Sánchez",288,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966336.6127019731!2d-69.67805230725669!3d18.8980626886758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eae469a760ea1c3%3A0xde270504a6ff4531!2sMaria%20Trinidad%20Sanchez!3m2!1d19.373459699999998!2d-69.85144389999999!5e0!3m2!1sen!2sdo!4v1677446667834!5m2!1sen!2sdo");
    monsenor_nouel= new Destino("monsenor_nouel","Monseñor Nouel",274,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d967685.4567635475!2d-69.94445326472449!3d18.663039451858047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eafde3435e95489%3A0x5a72182177f9a7b7!2sMonse%C3%B1or%20Nouel%20Province!3m2!1d18.921523399999998!2d-70.3836815!5e0!3m2!1sen!2sdo!4v1677446767145!5m2!1sen!2sdo");
    monte_plata= new Destino("monte_plata","Monte Plata",210,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d483976.8983391636!2d-69.36468677515508!3d18.61594268385551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eaf98a11d0c8123%3A0xef4e71a6a5c3398d!2sMonte%20Plata!3m2!1d18.8069496!2d-69.7852843!5e0!3m2!1sen!2sdo!4v1677446828261!5m2!1sen!2sdo");
    montecristi= new Destino("montecristi","Montecristi",468,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1929941.0883725148!2d-71.13351044718345!3d19.133251093026516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb143e98a5e0a53%3A0x7cec19fc8b92807e!2sMonte%20Cristi!3m2!1d19.8473452!2d-71.6406361!5e0!3m2!1sen!2sdo!4v1677446850959!5m2!1sen!2sdo");
    pedernales= new Destino("pedernales","Pedernales",511,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1940351.2305484933!2d-71.18618538866444!3d18.221477719195637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eba31c0325eee77%3A0xe914a9533c22d29a!2sPedernales!3m2!1d18.0368683!2d-71.7454674!5e0!3m2!1sen!2sdo!4v1677446870613!5m2!1sen!2sdo");
    peravia= new Destino("peravia","Peravia",275,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968880.3506629618!2d-69.91924568717825!3d18.452430436708884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8ea54e7e1f15ff13%3A0x559273a9339c6271!2sPeravia%20Province!3m2!1d18.2786594!2d-70.33358869999999!5e0!3m2!1sen!2sdo!4v1677446895929!5m2!1sen!2sdo");
    puerto_plata= new Destino("puerto_plata","Puerto Plata",404,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965146.09164114!2d-70.0959841859568!3d19.103184205719856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb1ee3f0046fa75%3A0x10c1300286d97467!2sPuerto%20Plata!3m2!1d19.7807686!2d-70.6871091!5e0!3m2!1sen!2sdo!4v1677446921216!5m2!1sen!2sdo");
    samana= new Destino("samana","Samaná",321,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966673.3400670099!2d-69.67004508400457!3d18.839655848477495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eaee72b27c60421%3A0xde564e1f6d9013!2sSamana!3m2!1d19.2030757!2d-69.3387664!5e0!3m2!1sen!2sdo!4v1677446943365!5m2!1sen!2sdo");
    san_cristobal= new Destino("san_cristobal","San Cristóbal",241,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968462.031516703!2d-69.81321679178676!3d18.526425108676477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8ea55ef2a2764f53%3A0xe5e76058f4325896!2sSan%20Crist%C3%B3bal!3m2!1d18.4169111!2d-70.1072502!5e0!3m2!1sen!2sdo!4v1677446964701!5m2!1sen!2sdo");
    san_jose_de_ocoa= new Destino("san_jose_de_ocoa","San José de Ocoa",319,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968880.3506629618!2d-70.0085415371783!3d18.452430436708873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb000eab15607e1%3A0xdbc41b6c29ec2e75!2sSan%20Jose%20de%20Ocoa!3m2!1d18.543858!2d-70.5041816!5e0!3m2!1sen!2sdo!4v1677446984882!5m2!1sen!2sdo");
    san_juan= new Destino("san_juan","San Juan",394,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1936850.0802989474!2d-70.92869273960541!3d18.532954631950563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb088427d7e2c7f%3A0xaab559e428da2932!2sSan%20Juan%20de%20la%20Maguana!3m2!1d18.8096268!2d-71.2309935!5e0!3m2!1sen!2sdo!4v1677447004739!5m2!1sen!2sdo");
    san_pedro_de_macoris= new Destino("san_pedro_de_macoris","San Pedro de Macorís",125,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d484201.33579382906!2d-69.12460634793244!3d18.53690193713044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eaf609388bba20d%3A0x5a0142fce45d04c4!2sSan%20Pedro%20De%20Macoris!3m2!1d18.46266!2d-69.3051234!5e0!3m2!1sen!2sdo!4v1677447026093!5m2!1sen!2sdo");
    sanchez_ramirez= new Destino("sanchez_ramirez","Sánchez Ramírez",302,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d967315.2078641305!2d-69.9106936303172!3d18.727834888897455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eafc60e3306e8c3%3A0x4c64eeb1faf6d3c5!2sSanchez%20Ramirez!3m2!1d19.052706!2d-70.1492264!5e0!3m2!1sen!2sdo!4v1677447045926!5m2!1sen!2sdo");
    santiago= new Destino("santiago","Santiago",351,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d966027.7358020445!2d-70.10220448686174!3d18.951486220475033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb1c5c838e5899f%3A0x75d4b059b8768429!2sSantiago%20De%20Los%20Caballeros!3m2!1d19.479196299999998!2d-70.6930568!5e0!3m2!1sen!2sdo!4v1677447068382!5m2!1sen!2sdo");
    santiago_rodriguez= new Destino("santiago_rodriguez","Santiago Rodríguez",454,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1931352.2835098752!2d-70.99210148161202!3d19.0121221338779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb104fa2c41f3ff%3A0x967ee3cf50117836!2sSantiago%20Rodr%C3%ADguez!3m2!1d19.471318099999998!2d-71.33958009999999!5e0!3m2!1sen!2sdo!4v1677447089634!5m2!1sen!2sdo");
    santo_domingo= new Destino("santo_domingo","Santo Domingo",205,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d968462.031516703!2d-69.71793669178679!3d18.526425108676477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eaf89f1107ea5ab%3A0xd6c587b82715c164!2sSanto%20Domingo!3m2!1d18.486057499999998!2d-69.93121169999999!5e0!3m2!1sen!2sdo!4v1677447110135!5m2!1sen!2sdo");
    valverde= new Destino("valverde","Valverde",392,"provincia",null,null,"https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d965661.4153411903!2d-70.24290715338144!3d19.014657787800537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8ea893a3f39a1cf3%3A0x144f3270e6c1b2c8!2sCielos%20Ac%C3%BAsticos%2C%20B%C3%A1varo%2C%20Punta%20Cana!3m2!1d18.642654399999998!2d-68.4154434!4m5!1s0x8eb1a30092515e67%3A0xfc0da5a2c1231d1f!2sValverde!3m2!1d19.5881221!2d-70.98033099999999!5e0!3m2!1sen!2sdo!4v1677447132710!5m2!1sen!2sdo");

  }

  anilloArray.push(anillo1);
  anilloArray.push(anillo2);
  anilloArray.push(anillo3);
  anilloArray.push(anillo4);
  anilloArray.push(anillo5);
  anilloArray.push(anillo6);
  anilloArray.push(anillo7);

  destinoArray['radio1_0a2']=anillo1;
  destinoArray['radio2_2a4']=anillo2;
  destinoArray['radio3_4a6']=anillo3;
  destinoArray['radio4_6a9']=anillo4;
  destinoArray['radio5_9a15']=anillo5;
  destinoArray['radio6_15a20']=anillo6;
  destinoArray['radio7_20a30']=anillo7;
  destinoArray["azua"]=azua;
  destinoArray["bahoruco"]=bahoruco;
  destinoArray["barahona"]=barahona;
  destinoArray["dajabon"]=dajabon;
  destinoArray["duarte"]=duarte;
  destinoArray["el_seibo"]=el_seibo;
  destinoArray["elias_pina"]=elias_pina;
  destinoArray["espaillat"]=espaillat;
  destinoArray["hato_mayor"]=hato_mayor;
  destinoArray["hermanas_mirabal"]=hermanas_mirabal;
  destinoArray["independencia"]=independencia;
  destinoArray["la_altagracia"]=la_altagracia;
  destinoArray["la_romana"]=la_romana;
  destinoArray["la_vega"]=la_vega;
  destinoArray["maria_trinidad_sanchez"]=maria_trinidad_sanchez;
  destinoArray["monsenor_nouel"]=monsenor_nouel;
  destinoArray["monte_plata"]=monte_plata;
  destinoArray["montecristi"]=montecristi;
  destinoArray["pedernales"]=pedernales;
  destinoArray["peravia"]=peravia;
  destinoArray["puerto_plata"]=puerto_plata;
  destinoArray["samana"]=samana;
  destinoArray["san_cristobal"]=san_cristobal;
  destinoArray["san_jose_de_ocoa"]=san_jose_de_ocoa;
  destinoArray["san_juan"]=san_juan;
  destinoArray["san_pedro_de_macoris"]=san_pedro_de_macoris;
  destinoArray["sanchez_ramirez"]=sanchez_ramirez;
  destinoArray["santiago"]=santiago;
  destinoArray["santiago_rodriguez"]=santiago_rodriguez;
  destinoArray["santo_domingo"]=santo_domingo;
  destinoArray["valverde"]=valverde;
}