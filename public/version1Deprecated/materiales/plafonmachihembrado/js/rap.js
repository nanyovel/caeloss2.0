if(e.key == "m" || e.key =="M"){
  copiarTabla();
}

let calculoRealizado=false;

calculoRealizado = true;

if(calculoRealizado==true){
  copiarTabla();
}

calculoRealizado= false;

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

        console.log('as			a   s   a');

        strPorta += columnaCodigo[i] +'	'+columnaQty[i]+'\n';

      }
    }
    navigator.clipboard.writeText(strPorta);

    cajaTextoCopiado.classList.remove('ocultar');

    cajaTextoCopiado.classList.remove('ocultar');
    setTimeout(()=>{cajaTextoCopiado.classList.add('ocultar');},2500);

    console.log(strPorta);
  }

  else if(calculoRealizado==false && window.screen.width>600){
    cajaTextoNoCopiado.classList.remove('ocultar');

    cajaTextoNoCopiado.classList.remove('ocultar');
    setTimeout(()=>{cajaTextoNoCopiado.classList.add('ocultar');},2500);
  }
}

