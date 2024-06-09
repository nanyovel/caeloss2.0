import React, { useState, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import './../components/estilos.css'
import { EntradaDatos } from '../components/EntradaDatos'
import { SalidaDatos } from '../components/SalidaDatos'
import { Alerta } from '../../components/Alerta'
import { OpcionUnica } from '../../components/OpcionUnica'
import { BotonQuery } from '../../components/BotonQuery'
import { InputsOutputs } from '../components/InputsOutputs'

export const Macrolux = () => {
    // // ******************** RECURSOS GENERALES ******************** //
    const [dispatchAlerta, setDispatchAlerta]=useState(false)
    const [mensajeAlerta, setMensajeAlerta]=useState('')
    const [tipoAlerta, setTipoAlerta]=useState('')
  
    const primerInputRef=useRef(null)

     // *********************MANEJANDO ARRAY OPCIONES*************************
  const [arrayOpcionesUnidadMedida,setArrayOpcionesUnidadMedida]=useState([
    {
      nombre:'Metros',
      opcion: 0,
      select:true,
    },
    {
      nombre:'Pies',
      opcion: 1,
      select:false,
    },
  ])

  const handleOpciones=(e)=>{
    let index=Number(e.target.dataset.id)
    let name=e.target.name

    if(name=='unidadMedida'){
      setArrayOpcionesUnidadMedida(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
        );

        setEntradaMaster(prevState=>
            prevState.map((entrada,i)=>{
              const entradaParsed=entrada.map((int,iterador)=>{
                return{
                  ...int,
                  valor:''
                }
              })
              return entradaParsed
            })
          )

          // Opcion Lineal Metros/Pies - activa ancho y largo
          if(index==0||index==1){
            setTimeout(() => {
          
              primerInputRef.current.focus()
            }, 100);
            setEntradaMaster(prevState=>
              prevState.map((entrada,i)=>{
                const entradaParsed=entrada.map((int,iterador)=>{
                  return{
                    ...int,
                    valor:'',
                    inactivo:iterador==0||iterador==1?false:true,
                  }
                })
                return entradaParsed
              })
              )
              
            }
          // Opcion Areaa Metros²/Pies² - activa area² y perimetro
          if(index==2||index==3){
          
            setEntradaMaster(prevState=>
              prevState.map((entrada,i)=>{
                const entradaParsed=entrada.map((int,iterador)=>{
                  return{
                    ...int,
                    valor:'',
                    inactivo:iterador==2||iterador==3?false:true,
                  }
                })
                return entradaParsed
              })
            )

          }

      }
      
      primerInputRef.current.focus()

    }

    // *********************MANEJANDO INPUTS*************************
    const [iniciando, setIniciando]=useState(true)
    const handleInputs=(e)=>{
      setIniciando(false)
      const {name,value}=e.target
      const index=Number(e.target.dataset.id)
      const numerador=Number(e.target.dataset.numerador)

      setEntradaMaster(prevState=>
          prevState.map((entrada,i)=>{
            const parsedIn=entrada.map((ent,iterador)=>{
              return{
                ...ent,
                valor:i==index&&iterador==numerador?value:ent.valor
              }
            })
            return parsedIn
          })
        )
      setRefreshCal(!refreshCal)
    }

     // *********************DEFINIENDO VALORES INICIALES*************************
    // cantidad de habitaciones, iniciales, min, max etc
    const [qtyHab, setQtyHab]=useState({
      inicial:5,
      min:2,
      max:15,
      qty:0
    })

    // Initial value entrada master
    const initialEntrada={
        inPuts:[
          {
            nombre:'ancho',
            valor:'',
            inactivo:false,
            numerador:0
          }, 
          {
            nombre:'largo',
            valor:'',
            inactivo:false,
            numerador:1
          },
          {
            // nombre:'Area²',
            nombre:'area',
            valor:'',
            inactivo:true,
            numerador:2
          },
          {
            nombre:'perimetro',
            valor:'',
            inactivo:true,
            numerador:3
          }
        ],
      }

    const [entradaMaster, setEntradaMaster]=useState([])
    
    const [tablaMat, setTablaMat]=useState([
      {
        codigo:'-',
        descripcion:"Plancha 2.10 x 12mts",
        qtyTotal:'',
      },
      {
        codigo:'15021',
        descripcion:"Perfil H",
        qtyTotal:'',
      },
      {
        codigo:'15022',
        descripcion:"Remate U",
        qtyTotal:'',
      },
      {
        codigo:'08030',
        descripcion:"Tornillo neopreno",
        qtyTotal:'',
      },
      {
        codigo:'16031',
        descripcion:"Silicon Clear",
        qtyTotal:'',
      },
      {
        codigo:'15048',
        descripcion:"Botones Macrolux",
        qtyTotal:'',
      },
      {
        codigo:'15034',
        descripcion:"Cinta Aluminio",
        qtyTotal:'',
      },
      {
        codigo:'15023',
        descripcion:"Cinta Ventana",
        qtyTotal:'',
      },
    ])

    

    const [tablaResult, setTablaResult] = useState([]);

    // *********************USEEFFEC PARA VALORES INICIALES ********************
    useEffect(()=>{
       // Qyu Hab
       setQtyHab(
        {
          ...qtyHab,
          qty:qtyHab.inicial
        }
      )

      // Agregar entradas iniciales
      let newInputs=[]
      let count=0
      while(count<qtyHab.inicial){
        newInputs=([
          ...newInputs,
          initialEntrada.inPuts
        ])
       
        count++
      }
      setEntradaMaster(newInputs)

      // Agregar cantidad de hab iniciales para matriz de salida
      const depositResult = tablaMat.map((fila, index) => {
        // Array.from es para crear array a partir de algo, en este caso se usa la palabra length para indicar la cantidad de array que queremos
        return Array.from({ length: qtyHab.inicial }, (_, columnIndex) => {
          // Creamos un nuevo objeto copiando las propiedades de la fila correspondiente de tablaMat
          const objeto = { ...fila };
          delete objeto.qtyTotal
          // Aquí puedes agregar cualquier lógica para copiar propiedades específicas de tablaMat
          return {...objeto,qty:''};
        });
      });
      setTablaResult(depositResult);
    },[])

    
    // ********************* FUNCION SUMAR / RESTA HAB ********************
    const sumarRestarHab=(e)=>{
      const name=e.target.name
      if(name=='sumar'){
        if(entradaMaster.length<qtyHab.max){
          // Sumar hab
          setQtyHab({
            ...qtyHab,
            qty:qtyHab.qty+1
          })

          // Sumar entrada
          const arrayAdd=entradaMaster[0].map((ent,index)=>{
            return{
              ...ent,
              valor:''
            }
          })

          setEntradaMaster([
            ...entradaMaster,
            arrayAdd
          ])

          // Sumar a la tabla de resultados
          setTablaResult(prevTablaResult => {
            const newTablaResult = prevTablaResult.map((row) => { 
            let objetoAdd={...row[0]}

              return([...row, {...objetoAdd,qty:''}])
            });
            return newTablaResult;
          });
        }
      }
      else if(name=='restar'){
        if(entradaMaster.length>2){
          // Restar hab
          setQtyHab({
            ...qtyHab,
            qty:qtyHab.qty-1
          })

          // Restar entrada
          setEntradaMaster(entradaMaster.slice(0, -1));

          // Restar a la tabla de resultados
          setTablaResult(prevTablaResult => {
            const newTablaResult = prevTablaResult.map(row => {
              const newRow = [...row]; // Copiamos la fila actual
              newRow.pop(); // Eliminamos la última columna
              return newRow;
            });
            return newTablaResult;
          });
        }
      }
    }

    
    // ********************* CALCULANDO *************************
    const [refreshCal,setRefreshCal]=useState(false)
    useEffect(()=>{
      // Calculando materiales al detalle
     
      if(tablaResult.length>0){
        let objeto={}
       const newResult=tablaResult.map((filas)=>{
        const celdas=filas.map((celda,index)=>{
          let probar={
            formular:'op'
          }
          entradaMaster.forEach((ent,itEntrada)=>{
           

            // 1-Opcion en ML
            if(arrayOpcionesUnidadMedida[0].select){
              objeto.ancho=Number(ent[0].valor)
              objeto.largo=Number(ent[1].valor)
            }
            
            // 2-Opcion en PL
            if(arrayOpcionesUnidadMedida[1].select){
              objeto.ancho=Number(ent[0].valor)*0.3048
              objeto.largo=Number(ent[1].valor)*0.3048
            }

            if(
                arrayOpcionesUnidadMedida[0].select==true||
                arrayOpcionesUnidadMedida[1].select==true
              ){
                objeto.area=objeto.ancho*objeto.largo
                objeto.perimetro=(objeto.ancho+objeto.largo)*2
              }

            if(itEntrada==index){
              const raboat=functFormulas(objeto)
              probar=raboat.find((mat)=>{
                if(mat.descripcion==celda.descripcion){
                  return mat
                }
              })
            }
          })
          let resultado=''
          if(probar){
            resultado=probar.formular
          }
          return{
            ...celda,
            qty:Number(resultado)
          }
        })
        return celdas
       })

       setTablaResult(newResult)
      
      //  Sumando el total
      setTablaMat((tablaMat.map((mat,index)=>{
        let acc=0
        newResult.forEach((fila)=>{
          const filaParsed=fila.map((celda,index)=>{
            if(celda.descripcion==mat.descripcion){
              acc+=celda.qty
            }
          })
        })
        if(mat.descripcion=='Fulminantes'||mat.descripcion=="Clavo de plafon"){
          acc=(Math.ceil(acc/10))*10
        }
        return{
          ...mat,
          qtyTotal:Math.ceil(acc)
        }
      })))
    
    if(entradaMaster.length>0&&iniciando==true){
      primerInputRef.current.focus()
    }
  }
    },[entradaMaster, refreshCal])


  const copiarPortaPapeles=()=>{
    let tablaCopiada=false;

        let columnaQty=[]
        let columnaCodigo=[]
        let encabezado='Codigo	Cantidad\n'
        let strPorta = encabezado;
        tablaMat.forEach((item, indexMat)=>{
          if(item.desactivado!=true){
            if(item.codigo=='-'){
              columnaCodigo[indexMat]='07180'
            }else{
              columnaCodigo[indexMat]=item.codigo
            }
            columnaQty[indexMat]=item.qtyTotal
            if(columnaQty[indexMat]!=0){
              strPorta +=columnaCodigo[indexMat]+'	'+columnaQty[indexMat]+'\n'
            }
          }
        })
        navigator.clipboard.writeText(strPorta)

        if(strPorta==encabezado){
          setMensajeAlerta('Llene los campos necesarios.')
          setTipoAlerta('warning')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
        }
        else{
          tablaCopiada=true
        }

    if(tablaCopiada){
      setMensajeAlerta('Tabla copiada.')
      setTipoAlerta('success')
      setDispatchAlerta(true)
      setTimeout(() => {
        setDispatchAlerta(false)
      }, 3000);
    }
  }



     // ********************* FORMULAS MASTER *************************
     const functFormulas=(objeto)=>{
      let qtyPedazosTotal=Math.floor(objeto.ancho/2.10)
      if(qtyPedazosTotal<1){
        qtyPedazosTotal=1
      }

      let chasoAncho=objeto.ancho-(qtyPedazosTotal*2.10)
      chasoAncho=Number((chasoAncho).toFixed(2))
      let qtyChaso=0
      if(chasoAncho>0){
        qtyChaso=1
      }else{
        qtyChaso=0
      }

      let cantidadUniones=(qtyPedazosTotal+ qtyChaso)-1;
      let qtyPedazosXPlancha=Math.floor(12/objeto.largo)

      let plancha210x12=Number((qtyPedazosTotal/qtyPedazosXPlancha).toFixed(2))
      plancha210x12+=Number((1/qtyPedazosXPlancha))
      plancha210x12=Number(plancha210x12.toFixed(2))

      let perfilH=(((qtyPedazosTotal+qtyChaso)-1)*objeto.largo)/(12/2)
      perfilH=Math.ceil(perfilH*100 )
      perfilH=perfilH/100

      let remateU=Number((objeto.perimetro/3.1).toFixed(2))
      let tornillosNeopreno=((objeto.perimetro/0.4)+((cantidadUniones*objeto.largo)*2)/0.4)
      tornillosNeopreno=Math.ceil(objeto.tornillosNeopreno)
      let silicon=Math.ceil(((objeto.perimetro/20)+((cantidadUniones * objeto.largo)*2)/10))
      let botones=tornillosNeopreno
      let cintaAluminio= Number(((Math.ceil((objeto.ancho/45)*100))/100).toFixed(2))
      let cintaVentana= Number(((Math.ceil((objeto.ancho/45)*100))/100).toFixed(2))

      const formulas=[
        {
          descripcion:"Plancha 2.10 x 12mts",
          formular:plancha210x12
        },
        {
          descripcion:"Perfil H",
          formular:perfilH
        },
        {
          descripcion:"Remate U",
          formular:remateU
          
        },
        {
          descripcion:"Tornillo neopreno",
          formular:tornillosNeopreno
        },
        {
          descripcion:"Silicon Clear",
          formular:silicon
          
        },
        {
          descripcion:"Botones Macrolux",
          formular:botones,
        },
        {
          descripcion:"Cinta Aluminio",
          formular:cintaAluminio,
        },
        {
          descripcion:"Cinta Ventana",
          formular:cintaVentana
        },
      ]

      if(objeto.ancho>0&&objeto.largo>0||objeto.area>0){
        return formulas
      }
      else {
        return[]
      }
  }

    // -------------------
    // -------------------
    // -------------------
    // -------------------
    // -------------------
    // -------------------
    // -------------------
    // -------------------
    // -------------------
    // -------------------
    // -------------------



  let casiCero=0.0000000001
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
  const [alertaFaltaPerimetro, setAlertaFaltaPerimetro]=useState(false)

  // 1-Estados de parametrizadores, al selecionar una de las opciones parametrizadoras se afectaran estos estados y de ahi la calculadora podra comportarse de una u otra manera, en este caso son dos estados pues Plafon Comercial depende de dos grupos de parametrizaciones que son Unidad de medida y Tamaño de plafon
  const [parametroA, setParametroA]=useState(0)
  const [parametroB, setParametroB]=useState(true)

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
    
    ]

    

  // 3-Funcion a ejecutar cuando hacemos algun cambio en parametro B, es decir Tamaño de Plafon, o mejor dicho cuando selecionamos alguna opcion, la funcion lo unico que hace es desactivar X material, para ello dentro del estado totalSumatoria desabilita el articulo deseado.

  // Observacion: La funcion a ejecutar cuando el usuario seleciona alguna opcion del grupo parametrizador A (Unidad de medida), se ejecuta dentro del componente EntradaDatos pues es un simple calculo para cambiar la unidad de medida

  // 4-Esto son todos los elementos LABEL parametrizadores, lo estamos llamando especificamente para usar los shortHands del teclado
  // Mas abajo llamamos todos lo radios esto para decirle a React, cuando X radio este checked vas hacer X cosa, 
  // Debe ser coherente con el bloque proximo 
  const shortHandOpciones=[
    {
      opcionMetros : useRef(null),
      opcionPies : useRef(),
    },
   
  ]
  
 // 5-Esto son todos los elementos RADIOS de los parametrizadores, mas arriba llamamos los Label esto para otra funcion, aqui llamamos todos los radios para poder reconocer cuando uno este en su estado checked y de ahi la calculadora puede decidir como actuar
 const[grupoRadios, setGrupoRadios]=useState([
  {
    opcionMetros : useRef(),
    opcionPies : useRef(),
  },

])

  // 6-Funcion nucleo, esta funcion ejecuta todas las formulas bases de cada material

// Objeto Original, este objeto debe ser coherente con la funcion nucleo
const objetoOriginal={
  ancho:0,
  largo:0,
  area:0,
  perimetro:0,

  totalLineas:0,
  qtyPedazosXPlancha:0,
  qtyPedazosTotal:0,
  tamanoPedazo:0,
  chasoAncho:0,
  chasoQty:0,

  plancha210x12:0,
  perfilH:0,
  remateU:0,
  tornillosNeopreno:0,
  silicon:0,
  botones:0,
  cintaAluminio:0,
  cintaVentana:0,
}

// 07-Esto es un estado que inicialmente tiene dos objetos cada uno para las dos habitaciones que tiene la pagina al cargar, estos son objetos son instacia del objeto nucleo, debe ser coherente a la cantidad de hab
const [datos, setDatos]=useState([
  objetoOriginal,
  // objetoOriginal,
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
        objeto.qtyPedazosTotal=Math.floor(objeto.ancho/2.10)
      if(objeto.qtyPedazosTotal<1){
        objeto.qtyPedazosTotal=1
      }
      objeto.chasoAncho=objeto.ancho-(objeto.qtyPedazosTotal*2.10)
      objeto.chasoAncho=Number((objeto.chasoAncho).toFixed(2))
      if(objeto.chasoAncho>0){
        objeto.chasoQty=1
      }else{
        objeto.chasoQty=0
      }

      let cantidadUniones=(objeto.qtyPedazosTotal+ objeto.chasoQty)-1;

      objeto.qtyPedazosXPlancha=Math.floor(12/objeto.largo)
      objeto.plancha210x12=Number((objeto.qtyPedazosTotal/objeto.qtyPedazosXPlancha).toFixed(2))
      objeto.plancha210x12+=Number((1/objeto.qtyPedazosXPlancha))
      objeto.plancha210x12=Number(objeto.plancha210x12.toFixed(2))

      objeto.perfilH=(((objeto.qtyPedazosTotal+objeto.chasoQty)-1)*objeto.largo)/(12/2)
      objeto.perfilH=Math.ceil(objeto.perfilH*100 )
      objeto.perfilH=objeto.perfilH/100
      if(objeto.ancho<=2.1){
        objeto.perfilH=casiCero
      }
      objeto.remateU=Number((objeto.perimetro/3.1).toFixed(2))
      objeto.tornillosNeopreno=((objeto.perimetro/0.4)+((cantidadUniones*objeto.largo)*2)/0.4)
      objeto.tornillosNeopreno=Math.ceil(objeto.tornillosNeopreno)
      objeto.silicon=Math.ceil(((objeto.perimetro/20)+((cantidadUniones * objeto.largo)*2)/10))
      objeto.botones=objeto.tornillosNeopreno
      objeto.cintaAluminio= Number(((Math.ceil((objeto.ancho/45)*100))/100).toFixed(2))
      objeto.cintaVentana= Number(((Math.ceil((objeto.ancho/45)*100))/100).toFixed(2))
    }
    else{
      objeto.plancha210x12=0;
      objeto.perfilH=0;
      objeto.remateU=0;
      objeto.tornillosNeopreno=0;
      objeto.silicon=0;
      objeto.botones=0;
      objeto.cintaAluminio=0;
      objeto.cintaVentana=0;
  
      
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
        codigo: '-',
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
        nombre:"Total Lineas",
        deshabilitado:false,
        material: false,
        total:null
      },
      {
        codigo: '?',
        nombre:"Cantidad Pedazos por plancha",
        deshabilitado:false,
        material: false,
        total:null
      },
      {
        codigo: '?',
        nombre:"Cantidad pedazos total",
        deshabilitado:false,
        material: false,
        total:null
      },
      {
        codigo: '?',
        nombre:"Tamaño pedazos",
        deshabilitado:false,
        material: false,
        total:null
      },
      {
        codigo: '?',
        nombre:"Chasos Ancho",
        deshabilitado:false,
        material: false,
        total:null
      },
      {
        codigo: '?',
        nombre:"Chasos Qty",
        deshabilitado:false,
        material: false,
        total:null
      },
      {
        codigo: '-',
        nombre:"Plancha 2.10 x 12mts",
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
            totalSumando += dato.plancha210x12
          })
          depositTotalSumando=totalSumando
          totalSumando=0
          return(Math.ceil(depositTotalSumando))
        }
      },
      
      {
        codigo: '15021',
        nombre:"Perfil H",
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
          if(dato.perfilH==casiCero){
            totalSumando+=0
          }else{
            totalSumando += dato.perfilH

          }
          })
          depositTotalSumando=totalSumando
          totalSumando=0
          return(Math.ceil(depositTotalSumando))
      }
      },
      {
        codigo: '15022',
        nombre:"Remate U",
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
            totalSumando += dato.remateU
          })
          depositTotalSumando=totalSumando
          totalSumando=0
          return(Math.ceil(depositTotalSumando))
      }
      },
      {
        codigo: '08030',
        nombre:"Tornillo neopreno",
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
            totalSumando += dato.tornillosNeopreno
          })
          depositTotalSumando=totalSumando
          totalSumando=0
          return(Math.ceil(depositTotalSumando))
      }
      },
      {
        codigo: '16031',
        nombre:"Silicon Clear",
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
            totalSumando += dato.silicon
          })
          depositTotalSumando=totalSumando
          totalSumando=0
          return(Math.ceil(depositTotalSumando))
      }
      },
      {
        codigo: '15048',
        nombre:"Botones Macrolux",
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
            totalSumando += dato.botones
          })
          depositTotalSumando=totalSumando
          totalSumando=0
          return(Math.ceil(depositTotalSumando))
      }
      },
      {
        codigo: '15034',
        nombre:'Cinta Aluminio',
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
            totalSumando += dato.cintaAluminio
          })
          depositTotalSumando=totalSumando
          totalSumando=0
          return(Math.ceil(depositTotalSumando))
      }
      },
      {
        codigo: '15023',
        nombre:"Cinta Ventana",
        deshabilitado:false,
        material: true,
        total: (datos)=>{datos.map((dato)=>{
            totalSumando += dato.cintaVentana
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

  
  return (
    <>
    <BotonQuery
      tablaMat={tablaMat}
      tablaResult={tablaResult}
    />
      <SeccionParametros>
      <OpcionUnica
          titulo='Unidad de medida'
          name='unidadMedida'
          arrayOpciones={arrayOpcionesUnidadMedida}
          handleOpciones={handleOpciones}
        />
          
         
      </SeccionParametros>

      <InputsOutputs
        sumarRestarHab={sumarRestarHab}
        handleInputs={handleInputs}
        entradaMaster={entradaMaster}

        tablaMat={tablaMat}
        tablaResult={tablaResult}
        arrayOpcionesUnidadMedida={arrayOpcionesUnidadMedida}
        copiarPortaPapeles={copiarPortaPapeles}
        primerInputRef={primerInputRef}


      />
       <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />



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
            setAlertaFaltaPerimetro={setAlertaFaltaPerimetro}
            casiCero={casiCero}
            
            />
       </SeccionTabla>

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


// 584