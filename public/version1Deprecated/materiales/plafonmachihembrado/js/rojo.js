let calculoRealizado=false;
calculoRealizado = true;

// ----------------------------------------------------

calculoRealizado= false;

// ------------------------------------------------

let columnaNo = document.getElementById('noEncabezado');
columnaNo.addEventListener('click', copiarColunma);
let totalEncabezado = document.getElementById('totalEncabezado');
totalEncabezado.addEventListener('click', copiarColunma);

let arrayTotal2=[];
let arrayLetras=[];
let strPorta='';
let cajaTextoCopiado = document.getElementById('cajaTextoCopiado');
let cajaTextoNoCopiado = document.getElementById('cajaTextoNoCopiado');

function copiarColunma(e){
  if(calculoRealizado==true){

    arrayTotal2.length=0;
    arrayLetras.length =0;
    strPorta = '';

    arrayTotal2.push(totalHab.machihembrado);
    arrayTotal2.push(totalHab.maintee);
    arrayTotal2.push(totalHab.angularF);
    arrayTotal2.push(totalHab.fundaClavo);
    arrayTotal2.push(totalHab.clavoYeso);
    arrayTotal2.push(totalHab.fulminantes);
    arrayTotal2.push(totalHab.tornillo_estructura);
    arrayTotal2.push(totalHab.unionLamina);

    arrayLetras.push(padre_celdaA.firstElementChild.textContent);
    arrayLetras.push(padre_celdaB.firstElementChild.textContent);
    arrayLetras.push(padre_celdaC.firstElementChild.textContent);
    arrayLetras.push(padre_celdaD.firstElementChild.textContent);
    arrayLetras.push(padre_celdaE.firstElementChild.textContent);
    arrayLetras.push(padre_celdaF.firstElementChild.textContent);
    arrayLetras.push(padre_celdaG.firstElementChild.textContent);
    arrayLetras.push(padre_celdaH.firstElementChild.textContent);

    // console.log(arrayTotal2)

    for(i=0;i<arrayTotal2.length;i++){
      if(arrayTotal2[i]!=0){
        if(e.target.id=="noEncabezado"){

          strPorta += arrayLetras[i] +'\n';
        }
        else if(e.target.id=='totalEncabezado'){
          strPorta += arrayTotal2[i] +'\n';
        }

      }
    }
    navigator.clipboard.writeText(strPorta);

    cajaTextoCopiado.classList.remove('ocultar');

    cajaTextoCopiado.classList.remove('ocultar');
    setTimeout(()=>{cajaTextoCopiado.classList.add('ocultar');},2000);

  }

  else if(calculoRealizado==false){
    cajaTextoNoCopiado.classList.remove('ocultar');

    cajaTextoNoCopiado.classList.remove('ocultar');
    setTimeout(()=>{cajaTextoNoCopiado.classList.add('ocultar');},3000);
  }

}