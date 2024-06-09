import React, { useState, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import './../components/estilos.css'
import { Parametrizadores } from '../../components/Parametrizadores'
import { EntradaDatos } from '../components/EntradaDatos'
import { SalidaDatos } from '../components/SalidaDatos'
import { Alerta } from '../../components/Alerta'
import { Footer2 } from '../../components/Footer'

export const Poliacryl = () => {
  // Esto debe estar en el componente padre para que funcione tanto cuando presionen una tecla como cuando den click con el mouse, pues uno se hace de Parametrizadores y otro desde EntradaDatos
  const inputFocusAncho= useRef(null)
  const inputFocusArea= useRef(null)

  useEffect(() => {
    inputFocusAncho.current.focus()
  }, [])
  

  // Estados de alertas
  const [alertaTamanoPlafon, setAlertaTamanoPlafon]=useState(false)
  const [alertaTablaCopiada, setAlertaTablaCopiada]=useState(false)
  const [alertaTablaNoCopiada, setAlertaTablaNoCopiada]=useState(false)
  // const [alertaFaltaPerimetro, setAlertaFaltaPerimetro]=useState(false)
  
  const [anchoPlancha, setAnchoPlancha]=useState()

  // 1-Estados de parametrizadores, al selecionar una de las opciones parametrizadoras se afectaran estos estados y de ahi la calculadora podra comportarse de una u otra manera, en este caso son dos estados pues Plafon Comercial depende de dos grupos de parametrizaciones que son Unidad de medida y Tamaño de plafon
  const [parametroA, setParametroA]=useState(0)
  const [parametroB, setParametroB]=useState()

  // 2-Array de los parametrizadores, aqui se encuentra toda la info relevante a los mismos y de aqui se toman todas las referencias necesarias, en este caso son dos array pues Plafon Comercial tiene dos grupo parametrizador Unidad de Medida y Tamaño de Plafon
  const opcionesUnidadMedida=[
      {
        nombre:'Metros',
        tecla: 'Tecla Q',
        name:'unidadMedida',
        // selecionada:true,
        opcion: 0
      },
      {
        nombre:'Pies',
        tecla: 'Tecla W',
        name:'unidadMedida',
        opcion: 1
      },
      {
        nombre:'Metros²',
        tecla: 'Tecla E',
        name:'unidadMedida',
        opcion: 2
      },
        {nombre:'Pies²',
        tecla: 'Tecla R',
        name:'unidadMedida',
        opcion: 3
      }
    ]

    const [opcionesGrupoB, setOpcionesGrupoB]=useState(
      [
        {
          nombre:'1 Metro',
          tecla: 'Tecla A',
          name:'grupoB',
          // selecionada:true
          opcion: 0
        },
        {
          nombre:'1.10 Metros',
          tecla: 'Tecla S',
          name:'grupoB',
          opcion: 1
        },
      ]
      )

  // 3-Funcion a ejecutar cuando hacemos algun cambio en parametro B, es decir Tamaño de Plafon, o mejor dicho cuando selecionamos alguna opcion, la funcion lo unico que hace es desactivar X material, para ello dentro del estado totalSumatoria desabilita el articulo deseado.
  // Observacion: La funcion a ejecutar cuando el usuario seleciona alguna opcion del grupo parametrizador A (Unidad de medida), se ejecuta dentro del componente EntradaDatos pues es un simple calculo para cambiar la unidad de medida
const handleParametroB=(e)=>{
  
  
    if(e.target.value==0){
      setAnchoPlancha(1)
    }else if(e.target.value==1){
      setAnchoPlancha(1.1)
    }
  console.log(anchoPlancha)
}
  // 4-Esto son todos los elementos LABEL parametrizadores, lo estamos llamando especificamente para usar los shortHands del teclado
  // Mas abajo llamamos todos lo radios esto para decirle a React, cuando X radio este checked vas hacer X cosa, 
  // Debe ser coherente con el bloque proximo 
  const shortHandOpciones=[
    {
      opcionMetros : useRef(null),
      opcionPies : useRef(),
      opcionMetros2 : useRef(),
      opcionPies2 : useRef()
    },
    {
      opcion2x4 : useRef(),
      opcion2x4a2x2 : useRef(),
    }
  ]
  
 // 5-Esto son todos los elementos RADIOS de los parametrizadores, mas arriba llamamos los Label esto para otra funcion, aqui llamamos todos los radios para poder reconocer cuando uno este en su estado checked y de ahi la calculadora puede decidir como actuar
 const[grupoRadios, setGrupoRadios]=useState([
  {
    opcionMetros : useRef(),
    opcionPies : useRef(),
    opcionMetros2 : useRef(),
    opcionPies2 : useRef()
  },
  {
    opcion2x4 : useRef(),
    opcion2x4a2x2 : useRef(),
  }
])

  // 6-Funcion nucleo, esta funcion ejecuta todas las formulas bases de cada material

// Objeto Original, este objeto debe ser coherente con la funcion nucleo
  const objetoOriginal={
    ancho:0,
    largo:0,
    area:0,
    perimetro:0,

    poliacryl:0,
    neopreno:0,
       
  }

// 07-Esto es un estado que inicialmente tiene dos objetos cada uno para las dos habitaciones que tiene la pagina al cargar, estos son objetos son instacia del objeto nucleo, debe ser coherente a la cantidad de hab
const [datos, setDatos]=useState([
  objetoOriginal,
  ])

  //10- --DATOS ENTRADA-- Hab es la cantidad de habitaciones que el usuario valla agregando su valor inicial es dos hab que sale por defecto al cargar la pagina, debe ser coherente con el estado de datos en cantidad
  const [hab, setHab] = useState([
    {
      ancho: '',
      largo: '',
      area: '',
      perimetro: '',
    },
   
    
  ])


  const functPrincipal=(objeto)=>{ 
    objeto.ancho=parseFloat(objeto.ancho)
    objeto.largo=parseFloat(objeto.largo)

  if(parametroA===0||parametroA===1){
    objeto.area=objeto.ancho*objeto.largo
    objeto.perimetro=((objeto.ancho+objeto.largo)*2)

  }
    if(objeto.ancho>0&&objeto.largo>0||objeto.area>0){
      objeto.poliacryl = Number(((objeto.area/ ((anchoPlancha-0.10)*3.66))).toFixed(2))
      console.log(objeto.area)
      console.log(anchoPlancha)
      // console.log(objeto.area)
      objeto.neopreno=Math.ceil(objeto.poliacryl*8)
    }
    else{
      objeto.poliacryl=0;
      objeto.neopreno=0;
      
    }
  
      
   
  return objeto
}
// totalSumatoria, este es un array de objeto envuelto en un estado y realiza varias funciones:
      // 1-Contiene toda la informacion relevante para imprimir en Pantalla, codigo, descripcion, total, materiales habilitados etc
      // 2-Formulas para sumar el total de los materiales

let totalSumando=0;
let depositTotalSumando=0;
const  [totalSumatoria, setTotalSumatoria]=useState(
[
    {
      codigo: '?',
      nombre:"Ancho",
      deshabilitado:false,
      material: false,
      total: (datos)=>{datos.map((dato)=>{
          totalSumando += dato.ancho
        })
        depositTotalSumando=totalSumando
        totalSumando=0
        return(depositTotalSumando)
      }
    },
    {
      codigo: '?',
      nombre:"Largo",
      deshabilitado:false,
      material: false,
      total: (datos)=>{datos.map((dato)=>{
          totalSumando += dato.largo
        })
        depositTotalSumando=totalSumando
        totalSumando=0
        return(depositTotalSumando)
      }
    },
    {
      codigo: '?',
      nombre:"Area",
      deshabilitado:false,
      material: false,
      total: (datos)=>{datos.map((dato)=>{
          totalSumando += dato.area
        })
        depositTotalSumando=totalSumando
        totalSumando=0
        return(depositTotalSumando)
      }
    },
    {
      codigo: '?',
      nombre:"Perimetro",
      deshabilitado:false,
      material: false,
      total: (datos)=>{datos.map((dato)=>{
          totalSumando += dato.perimetro
        })
        depositTotalSumando=totalSumando
        totalSumando=0
        return(depositTotalSumando)
      }
    },
    {
      codigo: '?',
      nombre:"Poliacryl 3.66mts | 12",
      deshabilitado:false,
      material: true,
      total: (datos)=>{datos.map((dato)=>{
          totalSumando += dato.poliacryl
        })
        depositTotalSumando=totalSumando
        totalSumando=0
        return(Math.ceil(depositTotalSumando))
      }
    },
    
    {
      codigo: '08030',
      nombre:"Tornillos neoprenos",
      deshabilitado:false,
      material: true,
      total: (datos)=>{datos.map((dato)=>{
          totalSumando += dato.neopreno
        })
        depositTotalSumando=totalSumando
        totalSumando=0
        return(Math.ceil(depositTotalSumando))
    }
    },
    
  
  ])

  // Esto sirve para returnar la clase deshabilitado y su funcion es colocarlar esta funcion en el className para que las filas tomen los estilos
  const hasDisableItem=(material,datos)=>{
    let objetoDeposit
    let materialDesh
    for(let i=0;i<totalSumatoria.length;i++){
      objetoDeposit = Object.values(totalSumatoria[i])
      let desactivado=objetoDeposit[2]
      if(desactivado===true){
        materialDesh=totalSumatoria[i].nombre
      }
      if(material.nombre===materialDesh){
        return('desabilitado')
      }
    }

  }

  const copiarPortaPapeles=()=>{
    let tablaCopiada=false;
    hab.map((objeto, index)=>{
      if(objeto.ancho>0&&objeto.largo>0 || objeto.area>0){
        let columnaQty=[]
        let columnaCodigo=[]
        let strPorta = 'Codigo	Cantidad\n';
        totalSumatoria.map((item, indexMat)=>{
          if(item.codigo=='?'){
            columnaCodigo[indexMat]='07180'
          }else{
          columnaCodigo.push(item.codigo)
          }
          columnaQty.push(item.total(datos))
          if(item.material==true &&columnaCodigo[indexMat]!='-'&&columnaQty[indexMat]!=0){
            strPorta +=columnaCodigo[indexMat]+'	'+columnaQty[indexMat]+'\n'
          }
        })
        navigator.clipboard.writeText(strPorta)
        tablaCopiada=true
      }
    })
    if(tablaCopiada){
      setAlertaTablaCopiada(true)
      setTimeout(() => {
        setAlertaTablaCopiada(false)
      }, 3000);
    }
    else if(tablaCopiada==false){
      setAlertaTablaNoCopiada(true)
      setTimeout(() => {
        setAlertaTablaNoCopiada(false)
      }, 3000);
    }
  }

  return (
    <>
      <SeccionParametros>
          <Parametrizadores
            titulo='Unidad de medida' 
            name='unidadDeMedida'
            shortHandOpciones={shortHandOpciones[0]}
            grupoRadios={grupoRadios[0]}
            opcionesParametrizadoras={opcionesUnidadMedida}
            parametros={parametroA}
            setParametros={setParametroA}

            hab={hab} 
            setHab={setHab} 
            datos={datos}
            setDatos={setDatos}
            inputFocusAncho={inputFocusAncho}
            inputFocusArea={inputFocusArea}
            />
          <Parametrizadores 
            titulo='Ancho Plancha' 
            name='grupoB' 
            shortHandOpciones={shortHandOpciones[1]}
            grupoRadios={grupoRadios[1]}
            opcionesParametrizadoras={opcionesGrupoB}
            parametros={parametroB}
            setParametros={setParametroB}

            handleParametroB={handleParametroB}
            estadoAlerta={alertaTamanoPlafon}
            totalSumatoria={totalSumatoria}
            setTotalSumatoria={setTotalSumatoria}
          />
      </SeccionParametros>
      <EntradaDatos  
        hab={hab} 
        setHab={setHab} 
        datos={datos}
        setDatos={setDatos}
        objetoOriginal={objetoOriginal}
        parametroA={parametroA}
        parametroB={parametroB}
        alertaTamanoPlafon={alertaTamanoPlafon}
        setAlertaTamanoPlafon={setAlertaTamanoPlafon}
        shortHandOpciones={shortHandOpciones}
        totalSumatoria={totalSumatoria}
        copiarPortaPapeles={copiarPortaPapeles}
        inputFocusAncho={inputFocusAncho}
        inputFocusArea={inputFocusArea}
        perimetroInputIsDisabled={true}
        
        />
       
       <SeccionTabla>
          <SalidaDatos 
            hab={hab} 
            setHab={setHab} 
            totalSumatoria={totalSumatoria}
            setTotalSumatoria={setTotalSumatoria}
            datos={datos}
            setDatos={setDatos}
            functPrincipal={functPrincipal}
            hasDisableItem={hasDisableItem}
            parametroA={parametroA}
            
            // setAlertaFaltaPerimetro={setAlertaFaltaPerimetro}
            
            />
       </SeccionTabla>
    <Alerta
      estadoAlerta={alertaTamanoPlafon}
      tipo={'error'}
      mensaje={'Selecione ancho de la plancha'}/>

   <Alerta
      estadoAlerta={alertaTablaCopiada}
      tipo={'success'}
      mensaje={'Tabla copiada, puedes pegar en SAP.'}/>

   <Alerta
      estadoAlerta={alertaTablaNoCopiada}
      tipo={'warning'}
      mensaje={'Primero rellene los campos necesarios.'}/>

   
  
    <Footer2/>

    </>
  )
  }

  const SeccionParametros = styled.section`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  `

  const SeccionTabla = styled.section`
  margin-bottom: 25px;
  overflow-x: scroll;

  &::-webkit-scrollbar{
    width: 3px;
    height: 3px;
}
&::-webkit-scrollbar-thumb{
    background-color: #19b4ef;
    border-radius: 7px;
}
`


