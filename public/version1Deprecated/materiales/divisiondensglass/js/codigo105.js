// Menu hamburguesa
let botonMenu = document.getElementById("botonMenu");
let menuM = document.getElementById("menuM");
let chimi = document.getElementById("chimi");
let equis = document.getElementById("equis")

botonMenu.addEventListener("click", mostrar);

function mostrar(){
    menuM.classList.toggle("moverDerecha")
    chimi.classList.toggle("noVisible");
    equis.classList.toggle("noVisible")
}

// Inputs solo aceten numeros literalmente que solo acepten 0123456789. y recordar el punto
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------
function alpha(e) {
    var k;
    document ? k = e.keyCode : k = e.which;
    return ( (k >= 46 && k <= 57))
}

// Shorthands
document.addEventListener('keydown', selecionarRadioTecla);
function selecionarRadioTecla(e){
    if(e.key == "a" || e.key =="A"){
        tamano[0].click();
        ancho_habitacion[0].focus();
       }
       else if(e.key == "s" || e.key =="S"){
        tamano[1].click();
        ancho_habitacion[0].focus();
       }

       if(e.key == "m" || e.key =="M"){
        copiarTabla()
       }
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
       else if(e.key == "e"  || e.key =="E"){
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
            limpieza()
    }
}

// Modalidad ML, PL, M2, P2 y el algoritmo para que se ejecuten correctamente--------------------------------------------------------------------------
let modo = document.getElementsByName("modo");
let caja_area2_habitacion = document.getElementsByName('caja_area2_habitacion');
let caja_perimetro_linear = document.getElementsByName('caja_perimetro_linear'); 
let ancho_habitacion = document.getElementsByName('ancho_habitacion');
let largo_habitacion = document.getElementsByName('largo_habitacion');

for(i=0;i<modo.length; i++){
    modo[i].addEventListener("click", alternarModalidad)
}
function alternarModalidad(){
    limpiarDatos()
    limpieza()
    caja_error_perimetroLineal.classList.remove('mostrarError');

    for(i=0; i<padreInput.childElementCount-2; i++){

        if (modo[0].checked == true || modo[1].checked == true){ //1 Inicio // Metros lineales / Pies Lineales
            caja_area2_habitacion[i].setAttribute('type', 'text')
            caja_perimetro_linear[i].setAttribute('type', 'text')
            // caja_area2_habitacion[i].setAttribute('placeholder', 'Area 2')
            // caja_perimetro_linear[i].setAttribute('placeholder', 'Perimetro L')
            caja_area2_habitacion[i].disabled = true;
            caja_perimetro_linear[i].disabled = true;
            ancho_habitacion[i].disabled = false;
            largo_habitacion[i].disabled = false;

            caja_area2_habitacion[i].classList.add("cajaInactiva")
            caja_perimetro_linear[i].classList.add("cajaInactiva")
            caja_area2_habitacion[i].classList.remove("cajaActiva")
            caja_perimetro_linear[i].classList.remove("cajaActiva")

            ancho_habitacion[i].classList.add("cajaActiva")
            largo_habitacion[i].classList.add("cajaActiva")
            ancho_habitacion[i].classList.remove("cajaInactiva")
            largo_habitacion[i].classList.remove("cajaInactiva")
        }

        
        else if(modo[2].checked == true){ //3 Metros cuadrados
            console.log(8779979)
            caja_area2_habitacion[i].setAttribute('type', 'number');
            caja_perimetro_linear[i].setAttribute('type', 'number');
            // caja_area2_habitacion[i].setAttribute('placeholder', 'Ingrese M2')
            // caja_perimetro_linear[i].setAttribute('placeholder', 'Ingrese ML');
           
            caja_area2_habitacion[i].disabled = false;
            caja_perimetro_linear[i].disabled = true;
            caja_area2_habitacion[i].classList.remove("cajaInactiva")
            caja_area2_habitacion[i].classList.add("cajaActiva")
            caja_perimetro_linear[i].classList.add("cajaInactiva")
            caja_perimetro_linear[i].classList.remove("cajaActiva")
            ancho_habitacion[i].disabled = true;
            ancho_habitacion[i].classList.remove("cajaActiva")
            ancho_habitacion[i].classList.add("cajaInactiva")
            largo_habitacion[i].disabled = false;
            largo_habitacion[i].classList.add("cajaActiva")
            largo_habitacion[i].classList.remove("cajaInactiva")
        }
        else if(modo[3].checked == true){  //4 Pies cuadrados 
            
            caja_area2_habitacion[i].setAttribute('type', 'number')
            caja_perimetro_linear[i].setAttribute('type', 'number')
            // caja_area2_habitacion[i].setAttribute('placeholder', 'Ingrese P2')
            // caja_perimetro_linear[i].setAttribute('placeholder', 'Ingrese PL');
        
            caja_area2_habitacion[i].disabled = false;
            caja_perimetro_linear[i].disabled = true;
            largo_habitacion[i].disabled = false;
            ancho_habitacion[i].disabled = true;

            caja_area2_habitacion[i].classList.remove("cajaInactiva");
            caja_perimetro_linear[i].classList.add("cajaInactiva");
            caja_area2_habitacion[i].classList.add("cajaActiva");
            caja_perimetro_linear[i].classList.remove("cajaActiva");

            ancho_habitacion[i].classList.remove("cajaActiva");
            largo_habitacion[i].classList.add("cajaActiva");
            ancho_habitacion[i].classList.add("cajaInactiva");
            largo_habitacion[i].classList.remove("cajaInactiva");
        }
    }
    
}

// Tipo de muro, una cara/dos caras y su respectiva funcionalidad -------------------------------------------------------------------------------------
let na = "N/A"
let radioSelecionado = false;
let cara = 1;

let tamano = document.getElementsByName('tamano');
for(let i = 0; i<tamano.length; i++){
    tamano[i].addEventListener("click", fijarRadio)
}

function fijarRadio(){ 
    radioSelecionado = true;
    reiniciarRadios();
    for(i=0; i<padre_encabezado.childElementCount-2; i++){
        if(tamano[0].checked == true ){
            cara = 1;
            // cajaCeldaB[i].innerHTML = na;
            // padre_celdaB.classList.add("desactivar");
            // cajaCeldaC[i].innerHTML = na;
            // padre_celdaC.classList.add("desactivar");
            calcular()
        
            }
        else if(tamano[1].checked == true ){
            cara=2;
            // cajaCeldaB[i].innerHTML = na;
            // padre_celdaB.classList.add("desactivar");
            calcular()
        }
        // else if(tamano[2].checked == true ){
        //     cajaCeldaA[i].innerHTML = na;
        //     padre_celdaA.classList.add("desactivar");
        // }
    } 
    }

function reiniciarRadios(){
    for(i=0; i<cajaCeldaA.length; i++){
        // cajaCeldaC[i].innerHTML  = null;
        // padre_celdaC.classList.remove("desactivar");
        // cajaCeldaB[i].innerHTML = null;
        // padre_celdaB.classList.remove("desactivar");
        // cajaCeldaA[i].innerHTML = null;
        // padre_celdaA.classList.remove("desactivar");
    }
    calcular();
}

function fijarRadio2(){ 
    for(i=0; i<padre_encabezado.childElementCount-2; i++){
       
        if(tamano[0].checked == true ){
            // cajaCeldaB[i].innerHTML = na;
            // padre_celdaB.classList.add("desactivar");
            // cajaCeldaC[i].innerHTML = na;
            // padre_celdaC.classList.add("desactivar");
        
            }
        else if(tamano[1].checked == true ){
            // cajaCeldaB[i].innerHTML = na;
            // padre_celdaB.classList.add("desactivar");
        }
        // else if(tamano[2].checked == true ){
        //     cajaCeldaA[i].innerHTML = na;
        //     padre_celdaA.classList.add("desactivar");
        // }
    } 
    }




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
let copiaCeldaG;
let copiaCeldaH;
let copiaCeldaI;
let copiaCeldaJ;
let copiaCeldaK;
// let copiaCeldaL;

let padre_celdaA = document.getElementById("padre_celdaA");
let padre_celdaB = document.getElementById("padre_celdaB");
let padre_celdaC = document.getElementById("padre_celdaC");
let padre_celdaD = document.getElementById("padre_celdaD");
let padre_celdaE = document.getElementById("padre_celdaE");
let padre_celdaF = document.getElementById("padre_celdaF");
let padre_celdaG = document.getElementById("padre_celdaG");
let padre_celdaH = document.getElementById("padre_celdaH");
let padre_celdaI = document.getElementById("padre_celdaI");
let padre_celdaJ = document.getElementById("padre_celdaJ");
let padre_celdaK = document.getElementById("padre_celdaK");
// let padre_celdaL = document.getElementById("padre_celdaL");

let padre_encabezado = document.getElementById('padre_encabezado');

let padreInput = document.getElementById('container-calcuar');
let caja_copiar = document.getElementById('caja_copiar');
let cajaUltimaInput =document.getElementById('cajaUltimaInput');

let btn_mas = document.getElementById('btn_mas');
btn_mas.addEventListener('click', agrearHabitacion);
let btn_menos = document.getElementById("btn_menos");
btn_menos.addEventListener('click', eliminarHabitacion);

let cantidadPuertas = document.getElementById('cantidadPuertas');

let maxHab=20;
let anchoPermitido=3;


if(window.screen.width>600){
    maxHab =26;
    anchoPermitido=15;
}

let encabezadoCopiar =document.getElementById('encabezadoCopiar');
function agrearHabitacion(){
    while(cuarto.length<ancho_habitacion.length){
        cuarto.push(new Habitaciones)
    }
    if(ancho_habitacion.length >anchoPermitido){
        document.querySelector('.seccion_tabla').style.overflowX = 'scroll';
    }
    else if(ancho_habitacion.length<anchoPermitido){
        console.log('58')
        document.querySelector('.seccion_tabla').style.overflowX = '';
    }


    nombreSiguienteHabitacion = "habitacion";
    if(padreInput.childElementCount <=maxHab ){
        siguienteHab = padre_encabezado.childElementCount -2;
        nombreSiguienteHabitacion = nombreSiguienteHabitacion.concat(siguienteHab);
        nodoNuevoCopia = caja_copiar.cloneNode(true);
        borrarDatos(nodoNuevoCopia);
        padreInput.insertBefore(nodoNuevoCopia, cajaUltimaInput)        
        const habitacion3 = new Habitaciones(0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        crearHabitacion(copia_encabezado, encabezadoCopiar, padre_encabezado)
        padre_encabezado.lastElementChild.innerHTML = medidaN.concat(siguienteHab);

        crearHabitacion(copiaCeldaA,cajaCeldaA[1],padre_celdaA);
        crearHabitacion(copiaCeldaB,cajaCeldaB[1],padre_celdaB);
        crearHabitacion(copiaCeldaC,cajaCeldaC[1],padre_celdaC);
        crearHabitacion(copiaCeldaD,cajaCeldaD[1],padre_celdaD);
        crearHabitacion(copiaCeldaE,cajaCeldaE[1],padre_celdaE);
        crearHabitacion(copiaCeldaF,cajaCeldaF[1],padre_celdaF);
        crearHabitacion(copiaCeldaG,cajaCeldaG[1],padre_celdaG);
        crearHabitacion(copiaCeldaH,cajaCeldaH[1],padre_celdaH);
        crearHabitacion(copiaCeldaI,cajaCeldaI[1],padre_celdaI);
        crearHabitacion(copiaCeldaJ,cajaCeldaJ[1],padre_celdaJ);
        crearHabitacion(copiaCeldaK,cajaCeldaK[1],padre_celdaK);
        // crearHabitacion(copiaCeldaL,cajaCeldaL[1],padre_celdaL);

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
            elemento.children[i].value = null
        }
    }
    fijarRadio2()
}

function eliminarHabitacion(){
    if(ancho_habitacion.length >anchoPermitido){
        document.querySelector('.seccion_tabla').style.overflowX = 'scroll';
    }
    else if(ancho_habitacion.length<anchoPermitido){
        console.log('58')
        document.querySelector('.seccion_tabla').style.overflowX = '';
    }
    nombreSiguienteHabitacion = "habitacion";
    if(padreInput.childElementCount >4){
        padreInput.removeChild(padreInput.children[padreInput.childElementCount-2])

        padre_encabezado.removeChild(padre_encabezado.children[padre_encabezado.childElementCount-1])
        padre_celdaA.removeChild(padre_celdaA.children[padre_celdaA.childElementCount-1])
        padre_celdaB.removeChild(padre_celdaB.children[padre_celdaB.childElementCount-1])
        padre_celdaC.removeChild(padre_celdaC.children[padre_celdaC.childElementCount-1])
        padre_celdaD.removeChild(padre_celdaD.children[padre_celdaD.childElementCount-1])
        padre_celdaE.removeChild(padre_celdaE.children[padre_celdaE.childElementCount-1])
        padre_celdaF.removeChild(padre_celdaF.children[padre_celdaF.childElementCount-1])
        padre_celdaG.removeChild(padre_celdaG.children[padre_celdaG.childElementCount-1])
        padre_celdaH.removeChild(padre_celdaH.children[padre_celdaH.childElementCount-1])
        padre_celdaI.removeChild(padre_celdaI.children[padre_celdaI.childElementCount-1])
        padre_celdaJ.removeChild(padre_celdaJ.children[padre_celdaJ.childElementCount-1])
        padre_celdaK.removeChild(padre_celdaK.children[padre_celdaK.childElementCount-1])
        // padre_celdaL.removeChild(padre_celdaL.children[padre_celdaL.childElementCount-1])

    
    }
limpiarDatos()
if(radioSelecionado == true){
    calcular()
    
}
fijarRadio2()
}


//Tenemos dos cosas por un lado cada celda o caja es un objeto donde el total esta en la posicion 0, pero por el otro tenemos el dato que vamos introducir en esa celda, donde el total no es parte del objeto y la posicion 0 corresponde a la primera hab, se hizo de esta manera porque de otra forma cuando sumemos el algoritmo tambien sumaria el total y el total debe estar aparte

let cajaCeldaA = document.getElementsByName('celdaA');
let cajaCeldaB = document.getElementsByName('celdaB');
let cajaCeldaC = document.getElementsByName('celdaC');
let cajaCeldaD = document.getElementsByName('celdaD');
let cajaCeldaE = document.getElementsByName('celdaE');
let cajaCeldaF = document.getElementsByName('celdaF');
let cajaCeldaG = document.getElementsByName('celdaG');
let cajaCeldaH = document.getElementsByName('celdaH');
let cajaCeldaI = document.getElementsByName('celdaI');
let cajaCeldaJ = document.getElementsByName('celdaJ');
let cajaCeldaK = document.getElementsByName('celdaK');
// let cajaCeldaL = document.getElementsByName('celdaL');



class Habitaciones{
    constructor(plancha4x8,parales,durmientes,esquineros,keraflor, tornilloPlancha, tornilloEstructura,cinta300,fulminantes,clavoYeso,madera,ancho,largo){
        this.plancha4x8 = plancha4x8;
        this.parales = parales;
        this.durmientes = durmientes;
        this.esquineros = esquineros;
        this.keraflor = keraflor;
        this.tornilloPlancha = tornilloPlancha;
        this.tornilloEstructura = tornilloEstructura;
        this.cinta300 = cinta300;
        this.fulminantes = fulminantes;
        this.clavoYeso = clavoYeso;
        this.madera = madera;
        this.ancho = ancho;
        this.largo = largo
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
let metros2 = 0;
let metrosL = 0;
let caja_error_perimetroLineal = document.getElementById('caja_error_perimetroLineal');
let contadorParaMensajeErrorPerimetroLineal =0;

let boton_habitacion = document.getElementById('boton_habitacion');
boton_habitacion.addEventListener('click', calcular);

let calculoRealizado=false;

function calcular(){  
    limpieza('no')
    while(cuarto.length<ancho_habitacion.length){
        cuarto.push(new Habitaciones)

    }
    let contadorParaMensajeErrorPerimetroLineal = 0;

    // Si el usuario no selecionó ninguna distancia paral (60cm o 40cm), entonces que salga un error.
    if(radioSelecionado == false){
        caja_titulo_tamano.classList.add("mostrarError");
        window.scrollTo(0, 0);
    }
    // Si el usuario selecionó un tamaño entonces quita el mensaje y calcula
    else if(radioSelecionado == true){
        caja_titulo_tamano.classList.remove("mostrarError")
        
        for(i=0;i<ancho_habitacion.length;i++){ 
            o=i+1;
            if(modo[0].checked == true){  //1 Inicio // Metros lineales
                caja_area2_habitacion[i].value = ""
                caja_perimetro_linear[i].value = ""
                cuarto[i].ancho = ancho_habitacion[i].value;
                cuarto[i].largo = largo_habitacion[i].value;
                metros2 = cuarto[i].ancho *cuarto[i].largo; 
                metrosL = parseFloat(cuarto[i].ancho) + parseFloat(cuarto[i].largo)
                metrosL = metrosL *2;
                
                if(cuarto[i].ancho == "" || cuarto[i].largo == ""){
                    continue
                }
            }

           else if(modo[1].checked == true){ //2 Pies lineales
                caja_area2_habitacion[i].value = ""
                caja_perimetro_linear[i].value = ""
                cuarto[i].ancho = ancho_habitacion[i].value * 0.3048;
                cuarto[i].largo = largo_habitacion[i].value * 0.3048;
                metros2 = cuarto[i].ancho *cuarto[i].largo; 
                metrosL = parseFloat(cuarto[i].ancho) + parseFloat(cuarto[i].largo)
                metrosL = metrosL *2;
                
                    if(cuarto[i].ancho == "" || cuarto[i].largo == ""){
                        continue
                    }
                }
                else if(modo[2].checked == true){ //3 Metros cuadrados
                    metros2 = 0;
                    metros2 = caja_area2_habitacion[i].value;
                    
                    if(caja_area2_habitacion[i].value == '' || caja_area2_habitacion[i].value == 0  ){
                            metros2 = 9999999999999999999999999999999999999999999999999999999999999;
                            continue
                        }
                    else{
                        metros2 = caja_area2_habitacion[i].value;
                        }
                        
                    if( largo_habitacion[i].value=='' || largo_habitacion[i].value==0){
                        metrosL = 0;
                        contadorParaMensajeErrorPerimetroLineal +=1
                        if(contadorParaMensajeErrorPerimetroLineal > 0 ){
    
                            caja_error_perimetroLineal.classList.add('mostrarError');
                        }
                    }
                    else{
                        cuarto[i].largo = largo_habitacion[i].value;
                    }
                    // "este es JJ"
                    if(contadorParaMensajeErrorPerimetroLineal == 0){
                        console.log("asd")
                        caja_error_perimetroLineal.classList.remove('mostrarError');
                    }
                    if( largo_habitacion[i].value=='' || largo_habitacion[i].value==0){
                        continue
                    }
                    }
                else if(modo[3].checked == true){ //4 Pies cuadrados 
                    metros2 = 0;
                    metros2 = caja_area2_habitacion[i].value;
                    
                    if(caja_area2_habitacion[i].value == '' || caja_area2_habitacion[i].value == 0  ){
                            metros2 = 9999999999999999999999999999999999999999999999999999999999999;
                            continue
                        }
                    else{
                        metros2 = caja_area2_habitacion[i].value*0.0929;
                        }
                        
                    if( largo_habitacion[i].value=='' || largo_habitacion[i].value==0){
                        metrosL = 0;
                        contadorParaMensajeErrorPerimetroLineal +=1
                        if(contadorParaMensajeErrorPerimetroLineal > 0 ){
    
                            caja_error_perimetroLineal.classList.add('mostrarError');
                        }
                    }
                    else{
                        cuarto[i].largo = largo_habitacion[i].value;
                    }
                    // "este es JJ"
                    if(contadorParaMensajeErrorPerimetroLineal == 0){
                        console.log("asd")
                        caja_error_perimetroLineal.classList.remove('mostrarError');
                    }
                    if( largo_habitacion[i].value=='' || largo_habitacion[i].value==0){
                        continue
                    }
    
    
                    
    
                    // metros2 = 0;
                    // metros2 = caja_area2_habitacion[i].value;
                    // if(caja_area2_habitacion[i].value == ''){
                    //     metros2 = 9999999999999999999999999999999999999999999999999999999999999;
                    //     continue
                    //  }
                    // else{
                    //     metros2 = caja_area2_habitacion[i].value * 0.0929;
                    // }
                    // if(cuarto[i].largo == ''){
                    //     metrosL = 0;
                    //     contadorParaMensajeErrorPerimetroLineal +=1
                    //     if(contadorParaMensajeErrorPerimetroLineal > 0){
    
                    //         // caja_error_perimetroLineal.classList.add('mostrarError');
                    //     }
                    // }
                    // else{
                    //     metrosL = caja_perimetro_linear[i].value * 0.3048;      
                    // }
                    // if(contadorParaMensajeErrorPerimetroLineal == 0){
                    //     console.log("asd")
                    //     caja_error_perimetroLineal.classList.remove('mostrarError');
                    // }
                    }

       
        cuarto[i].ancho = parseFloat(cuarto[i].ancho);
        cuarto[i].largo = parseFloat(cuarto[i].largo);

        cuarto[i].plancha4x8 = (metros2 / 2.98)*cara;
        // cuarto[i].plancha4x8 = Math.ceil(cuarto[i].plancha4x8);
        cuarto[i].plancha4x8 = cuarto[i].plancha4x8.toFixed(2);
        cuarto[i].plancha4x8 = parseFloat(cuarto[i].plancha4x8)
        
        cuarto[i].parales = (metros2/ cuarto[i].largo)/0.4;
        if(cuarto[i].largo>3){
            cuarto[i].parales = ((metros2/ cuarto[i].largo)/0.4)*(cuarto[i].largo/3);

        }
        cuarto[i].parales = cuarto[i].parales.toFixed(2);
        cuarto[i].parales = parseFloat(cuarto[i].parales)
        // cuarto[i].parales = Math.ceil(cuarto[i].parales);
        console.log(cuarto[i].ancho)
        
        cuarto[i].durmientes = ((metros2/ cuarto[i].largo)/3) * 2;
        cuarto[i].durmientes = cuarto[i].durmientes.toFixed(2);
        cuarto[i].durmientes = parseFloat(cuarto[i].durmientes)
        // cuarto[i].durmientes = Math.ceil(cuarto[i].durmientes);
        
        cuarto[i].esquineros =0


        // cuarto[i].durmientes = metrosL / 3;
        // cuarto[i].durmientes = Math.ceil(cuarto[i].durmientes);

        cuarto[i].keraflor = (metros2 /9)*cara;

        cuarto[i].keraflor = parseFloat(cuarto[i].keraflor);
        cuarto[i].keraflor = cuarto[i].keraflor * 10;
        cuarto[i].keraflor = Math.ceil(cuarto[i].keraflor)/10;
        cuarto[i].keraflor = cuarto[i].keraflor.toFixed(1);
        cuarto[i].keraflor = parseFloat(cuarto[i].keraflor);

        cuarto[i].tornilloPlancha = (cuarto[i].plancha4x8 *30)/260;
        cuarto[i].tornilloPlancha = cuarto[i].tornilloPlancha.toFixed(1);
        cuarto[i].tornilloPlancha = parseFloat(cuarto[i].tornilloPlancha);
        cuarto[i].tornilloPlancha = cuarto[i].tornilloPlancha * 10;
        cuarto[i].tornilloPlancha = Math.ceil(cuarto[i].tornilloPlancha)/10;
        cuarto[i].tornilloPlancha = cuarto[i].tornilloPlancha.toFixed(1);
        cuarto[i].tornilloPlancha = parseFloat(cuarto[i].tornilloPlancha);
        

        cuarto[i].tornilloEstructura = (cuarto[i].parales * 4 )/380;
        console.log(cuarto[i].tornilloEstructura)
        
        if(cuarto[i].tornilloPlancha < 0.1){
            cuarto[i].tornilloPlancha = 0.1
        }

        cuarto[i].tornilloEstructura = cuarto[i].tornilloEstructura.toFixed(1);
        cuarto[i].tornilloEstructura = parseFloat(cuarto[i].tornilloEstructura);
        cuarto[i].tornilloEstructura = cuarto[i].tornilloEstructura * 10;
        cuarto[i].tornilloEstructura = Math.ceil(cuarto[i].tornilloEstructura)/10;
        cuarto[i].tornilloEstructura = cuarto[i].tornilloEstructura.toFixed(1);
        cuarto[i].tornilloEstructura = parseFloat(cuarto[i].tornilloEstructura);

        if(cuarto[i].tornilloEstructura < 0.1){
            cuarto[i].tornilloEstructura = 0.1
        }

        cuarto[i].cinta300 = ((cuarto[i].plancha4x8 * 12)/300);
        cuarto[i].cinta300 = cuarto[i].cinta300.toFixed(1);
        cuarto[i].cinta300 = parseFloat(cuarto[i].cinta300);
        cuarto[i].cinta300 = cuarto[i].cinta300 * 10;
        cuarto[i].cinta300 = Math.ceil(cuarto[i].cinta300)/10;
        cuarto[i].cinta300 = cuarto[i].cinta300.toFixed(1);
        cuarto[i].cinta300 = parseFloat(cuarto[i].cinta300);

        if(cuarto[i].cinta300 < 0.1){
            cuarto[i].cinta300 = 0.1
        }

    
        
        cuarto[i].fulminantes = (cuarto[i].durmientes * 3) /0.6;
        cuarto[i].fulminantes = Math.ceil(cuarto[i].fulminantes  / 10) * 10
        cuarto[i].fulminantes = Math.ceil(cuarto[i].fulminantes)
        
        cuarto[i].clavoYeso =cuarto[i].fulminantes ;
        cuarto[i].clavoYeso = Math.ceil(cuarto[i].clavoYeso);

       cuarto[i].madera = 0;


        imprimirDato(cajaCeldaA[o], cuarto[i].plancha4x8);
        imprimirDato(cajaCeldaB[o], cuarto[i].parales);
        imprimirDato(cajaCeldaC[o], cuarto[i].durmientes);
        imprimirDato(cajaCeldaD[o], cuarto[i].esquineros);
        imprimirDato(cajaCeldaE[o], cuarto[i].keraflor);
        imprimirDato(cajaCeldaF[o], cuarto[i].tornilloPlancha);
        imprimirDato(cajaCeldaG[o], cuarto[i].tornilloEstructura);
        imprimirDato(cajaCeldaH[o], cuarto[i].cinta300);
        imprimirDato(cajaCeldaI[o], cuarto[i].fulminantes);
        imprimirDato(cajaCeldaJ[o], cuarto[i].clavoYeso);  
        imprimirDato(cajaCeldaK[o], cuarto[i].madera);  
        
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
        console.log(typeof(var_area2))
        
        var_area2 = formatNumber.new(var_area2, " P²");
        
        var_perimetroL = (anchoArea + largoArea) *2;
        var_perimetroL = var_perimetroL.toFixed(2);
        var_perimetroL = formatNumber.new(var_perimetroL, " PL");
        imprimirDato(caja_area2_habitacion[i], var_area2);  
        imprimirDato(caja_perimetro_linear[i], var_perimetroL);  
    }
    calculoRealizado = true;
}
sumarHabitaciones()     

    function sumarHabitaciones(){
            totalHab.plancha4x8 =0;
            totalHab.parales =0;
            totalHab.durmientes=0;
            totalHab.esquineros =0;
            totalHab.keraflor =0;
            totalHab.tornilloPlancha =0;
            totalHab.tornilloEstructura =0;
            totalHab.cinta300 =0;
            totalHab.fulminantes =0;
            totalHab.clavoYeso =0;
            totalHab.madera =0;
            
            
        for(i=0; i<ancho_habitacion.length; i++){
            if(modo[0].checked ==true || modo[1].checked == true){

                
                if(cuarto[i].largo == 0 || cuarto[i].ancho ==0){
                    continue
                }
            }
            else if(modo[2].checked == true || modo[3].checked == true ){
                if(caja_area2_habitacion[i].value == 0 || caja_area2_habitacion[i].value == ''|| cuarto[i].plancha4x8==undefined){
                    continue
                }
            }
            totalHab.plancha4x8 += cuarto[i].plancha4x8;
            totalHab.parales += cuarto[i].parales;
            totalHab.durmientes+= cuarto[i].durmientes;
            totalHab.esquineros += cuarto[i].esquineros;
            totalHab.keraflor += cuarto[i].keraflor;
            totalHab.tornilloPlancha += cuarto[i].tornilloPlancha;
            totalHab.tornilloEstructura += cuarto[i].tornilloEstructura;
            totalHab.cinta300 += cuarto[i].cinta300;
            totalHab.lija100 += cuarto[i].lija100;
            totalHab.fulminantes += cuarto[i].fulminantes;
            totalHab.clavoYeso += cuarto[i].clavoYeso;
            
            
            
        }

        totalHab.parales = Math.ceil(totalHab.parales);
        totalHab.durmientes=Math.ceil(totalHab.durmientes);
        totalHab.plancha4x8 = Math.ceil(totalHab.plancha4x8);
        totalHab.madera = cantidadPuertas.value*3;
        totalHab.esquineros = cantidadPuertas.value*4;
        totalHab.keraflor =Math.ceil(totalHab.keraflor);
        totalHab.tornilloPlancha =Math.ceil(totalHab.tornilloPlancha);
        totalHab.tornilloEstructura =Math.ceil(totalHab.tornilloEstructura);
        totalHab.cinta300 =Math.ceil(totalHab.cinta300);
        for(i=0;i<ancho_habitacion.length;i++){
            if(modo[0].checked==true|| modo[1].checked==true){

                if(cuarto[i].largo == 0 || cuarto[i].ancho ==0 ||cuarto[i].largo == '' ||cuarto[i].ancho ==''){
                    continue
                }
            }
            else if(modo[2].checked==true|| modo[3].checked==true){

                if(caja_area2_habitacion[i].value == 0 || largo_habitacion[i].value==''){
                    continue
                }
            }
        imprimirDato(cajaCeldaA[0], totalHab.plancha4x8);
        imprimirDato(cajaCeldaB[0], totalHab.parales);
        imprimirDato(cajaCeldaC[0], totalHab.durmientes);
        imprimirDato(cajaCeldaD[0], totalHab.esquineros);
        imprimirDato(cajaCeldaE[0], totalHab.keraflor);
        imprimirDato(cajaCeldaF[0], totalHab.tornilloPlancha);
        imprimirDato(cajaCeldaG[0], totalHab.tornilloEstructura);
        imprimirDato(cajaCeldaH[0], totalHab.cinta300);
        imprimirDato(cajaCeldaI[0], totalHab.fulminantes);
        imprimirDato(cajaCeldaJ[0], totalHab.clavoYeso);
        imprimirDato(cajaCeldaK[0], totalHab.madera);
        // imprimirDato(cajaCeldaL[0], totalHab.madera);
        }

        fijarRadio2()
    }
}
if(calculoRealizado==true){
    copiarTabla()
}
}



let seccion_tabla = document.getElementById('seccion_tabla');
seccion_tabla.addEventListener('click', copiarTabla)

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
            
        columnaCodigo.push('07180')
        columnaCodigo.push(padre_celdaB.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaC.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaD.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaE.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaF.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaG.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaH.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaI.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaJ.firstElementChild.textContent)
        columnaCodigo.push(padre_celdaK.firstElementChild.textContent)

        columnaQty.push(totalHab.plancha4x8)
        columnaQty.push(totalHab.parales)
        columnaQty.push(totalHab.durmientes)
        columnaQty.push(totalHab.esquineros)
        columnaQty.push(totalHab.keraflor)
        columnaQty.push(totalHab.tornilloPlancha)
        columnaQty.push(totalHab.tornilloEstructura)
        columnaQty.push(totalHab.cinta300)
        columnaQty.push(totalHab.fulminantes)
        columnaQty.push(totalHab.clavoYeso)
        columnaQty.push(totalHab.madera)
        
        for(i=0;i<columnaQty.length && i<columnaCodigo.length;i++){
            if(columnaQty[i]!=0){
            
                    console.log('as			a   s   a')

                    strPorta += columnaCodigo[i] +'	'+columnaQty[i]+'\n'
            
            }
        }
        navigator.clipboard.writeText(strPorta)
        cajaTextoNoCopiado.classList.add('ocultar')

        cajaTextoCopiado.classList.remove('ocultar')

        setTimeout(()=>{cajaTextoCopiado.classList.add('ocultar')},2500)
        console.log('po')

    }
  
    else if(calculoRealizado==false && window.screen.width>600){
        cajaTextoCopiado.classList.add('ocultar')
        cajaTextoNoCopiado.classList.remove('ocultar')

        cajaTextoNoCopiado.classList.remove('ocultar')
        setTimeout(()=>{cajaTextoNoCopiado.classList.add('ocultar')},2500)
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
   }


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
        for(i=0; i<cajaCeldaA.length;i++){
            imprimirDato(cajaCeldaA[i], "")
            imprimirDato(cajaCeldaB[i], "")
            imprimirDato(cajaCeldaC[i], "")
            imprimirDato(cajaCeldaD[i], "")
            imprimirDato(cajaCeldaE[i], "")
            imprimirDato(cajaCeldaF[i], "")
            imprimirDato(cajaCeldaG[i], "")
            imprimirDato(cajaCeldaH[i], "")
            imprimirDato(cajaCeldaI[i], "")
            imprimirDato(cajaCeldaJ[i], "")
            imprimirDato(cajaCeldaK[i], "")
            // imprimirDato(cajaCeldaL[i], "")
        }
        
calculoRealizado= false;
   }

// limpiarDatos()

   function limpiarDatos(){
       console.log("joseantonio")
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