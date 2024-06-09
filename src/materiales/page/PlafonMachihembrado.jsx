import React, { useRef, useState, useEffect } from 'react'
import { styled } from 'styled-components'
import { Alerta } from '../../components/Alerta'
import { OpcionUnica } from '../../components/OpcionUnica'
import { InputsOutputsMachihembrado } from '../components/InputsOutputsMachihembrado'
import { BotonQuery } from '../../components/BotonQuery'

export const PlafonMachihembrado = () => {
  useEffect(()=>{
    document.title = "Caeloss - Plafon Machihembrado";
    return () => {
      document.title = "Caeloss"; 
    };
  },[])
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener en el componente desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta]=useState(false)
  const [mensajeAlerta, setMensajeAlerta]=useState('')
  const [tipoAlerta, setTipoAlerta]=useState('')

  const primerInputRef=useRef(null)
  const [refreshCal,setRefreshCal]=useState(false)

  // *********************MANEJANDO ARRAY OPCIONES*************************
  const [nombreUM, setNombreUM]=useState(' Mts')
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
    {
      nombre:'Pulgadas',
      opcion: 2,
      select:false,
    },
  ])
  const [arrayOpcionesLargoPlafon,setArrayOpcionesLargoPlafon]=useState([
    {
      nombre:'',
      valor:5.80,
      opcion: 0,
      select:true,
    },
    {
      nombre:'',
      valor:6.4008,
      opcion: 0,
      select:false,
    },
    {
      nombre:'',
      valor:3.9624,
      opcion: 0,
      select:false,
    },
  
  ])

  // Actualizar unidad de medida
  useEffect(()=>{
    setArrayOpcionesLargoPlafon(prevOpciones => 
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        nombre:
          (arrayOpcionesUnidadMedida[0].select==true?
            (
              ( i==0?
               '5.80'
               :
               i==1?
               '6.40'
               :
               i==2?
               '3.96'
               :
               '')+nombreUM
             )
          :
          arrayOpcionesUnidadMedida[1].select==true?
          (
           ( i==0?
            '19'
            :
            i==1?
            '21'
            :
            i==2?
            '13'
            :
            '')+nombreUM
          )
          :
          arrayOpcionesUnidadMedida[2].select==true?
          (
           ( i==0?
            '228'
            :
            i==1?
            '252'
            :
            i==2?
            '156'
            :
            '')
            + nombreUM
          )
          :
          '')
         

      }))
      );


  },[nombreUM])

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

        if(index==0){
          setNombreUM(' Mts')
        }
        else if(index==1){
          setNombreUM("'")
        }
        else if(index==2){
          setNombreUM('"')
        }

        
       

        setEntradaMaster(prevState=>
            prevState.map((entrada,i)=>{
              const entradaParsed=entrada.map((int,iterador)=>{
                return{
                  ...int,
                  valor:'',
                  dirrCorrecta:null
                }
              })
              return entradaParsed
            })
          )
          }
    else if(name=='largoPlafon'){
      setArrayOpcionesLargoPlafon(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
        );
      }

      if(width>550){
        primerInputRef.current.focus()
      }
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
      inicial:width<550?3:5,
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
          nombre:'dircc.',
          valor:'',
          inactivo:true,
          dirrCorta:true,
          numerador:2
        },
        {
          // nombre:'Area²',
          nombre:'area',
          valor:'',
          inactivo:true,
          numerador:3
        },
        {
          nombre:'perimetro',
          valor:'',
          inactivo:true,
          numerador:4
        }
      ],
    }

    const [entradaMaster, setEntradaMaster]=useState([])

    const [tablaMat, setTablaMat]=useState([
      {
        codigo:'01026',
        descripcion:"Plafon Machihembrado",
        qtyTotal:'',
      },
      {
        codigo:'04004',
        descripcion:"Parales 1 5/8",
        qtyTotal:'',
      },
      {
        codigo:'02045',
        descripcion:"Angular F",
        qtyTotal:'',
      },
      {
        codigo:'02005',
        descripcion:"F. Clavo 100unds",
        qtyTotal:'',
      },
      {
        codigo:'04324',
        descripcion:"Clavos de Yeso",
        qtyTotal:'',
        redondeo:10
      },
      {
        codigo:'02066',
        descripcion:"Fulminantes",
        qtyTotal:'',
        redondeo:10
      },
      {
        codigo:'08003',
        descripcion:"Tornillos Estructura",
        qtyTotal:'',
      },
      {
        codigo:'01165',
        descripcion:"Union Lamina",
        qtyTotal:'',
      },
      {
        codigo:'-',
        descripcion:"Tamaño pedazos",
        qtyTotal:'',
        noSumable:true,
        unidadMedida:'Mts',
        desactivado:true
      },
    ])

     // ********************* FORMULAS MASTER *************************

    
     const functFormulas=(
      objeto,
      entradaMaster,
      itEntrada,
      modoAutomatico,
      calculoCorto,
      )=>{
      const index=Number(itEntrada)
      objeto.area=objeto.ancho*objeto.largo
      objeto.perimetro=(objeto.ancho+objeto.largo)*2

      // 1-Opcion en ML ~ lo normal
      let newAncho=0
      let newLargo=0
     
      // Si la direccion la toma de la entrada master
      if(modoAutomatico==true){
        // Direccion corta
        if(entradaMaster[index][2].dirrCorta==true){
          if(objeto.ancho<=objeto.largo){
            newAncho=objeto.ancho
            newLargo=objeto.largo
          }
         else if(objeto.ancho>objeto.largo){
            newAncho=objeto.largo
            newLargo=objeto.ancho
          }
        }
        // Direccion larga
        else if(entradaMaster[index][2].dirrCorta==false){
          if(objeto.ancho<objeto.largo){
            newAncho=objeto.largo
            newLargo=objeto.ancho
          }
          else if(objeto.ancho>=objeto.largo){
            newAncho=objeto.ancho
            newLargo=objeto.largo
          }
        }
      }
       // Si la direcion la indicamos expresamente, esto para comparar calculo con direcion corta vs direcion larga a mi voluntadad
       if(modoAutomatico==false){
        // Dame direcion planca a lo corto
        if(calculoCorto==true){
          if(objeto.ancho<=objeto.largo){
            newAncho=objeto.ancho
            newLargo=objeto.largo
          }
          else if(objeto.ancho>objeto.largo){
            newAncho=objeto.largo
            newLargo=objeto.ancho
          }
        }
        // Dame direcion planca a lo largo
        else if(calculoCorto==false){
          if(objeto.ancho<objeto.largo){
            newAncho=objeto.largo
            newLargo=objeto.ancho
          }
          else if(objeto.ancho>=objeto.largo){
            newAncho=objeto.ancho
            newLargo=objeto.largo
          }
        }
      }


         // 2-Opcion en PL
         if(arrayOpcionesUnidadMedida[1].select){
          newAncho=newAncho*0.3048
          newLargo=newLargo*0.3048
        }
         // 2-Opcion en Pulgadas
         if(arrayOpcionesUnidadMedida[2].select){
          newAncho=newAncho*0.0254
          newLargo=newLargo*0.0254
        }
  
        let newArea=newAncho*newLargo
        let newPerimetro=(newAncho+newLargo)*2



     

      
      const plafonSelect=arrayOpcionesLargoPlafon.find(plafon=>plafon.select==true)
      let largoPlafon=plafonSelect.valor  


      const anchoPlafon=0.24
      const largoMinimoPlafon=1.20
      const distanciaParales=1.22
      const distanciaClavos=0.6
      const tamannioUnionLamina=2.6
      const totalLineas=Math.ceil(Number(newLargo/anchoPlafon));

      let tamannioPedazos=newAncho
     

      if(newAncho>largoPlafon){
        tamannioPedazos= (newAncho/(Math.ceil(newAncho/largoPlafon)))
      }

      const qtyPedazosXLineas=(newAncho/ tamannioPedazos);
      let qtyPedazosXPlancha=Math.floor(Number(largoPlafon/newAncho))
      if(newAncho>=largoPlafon){
        qtyPedazosXPlancha=1
      }

      const qtyPedazosTotal=(qtyPedazosXLineas*totalLineas)

      let parales=0
      let clavosYeso=0
      let fulminantes=0
      let tornilloEstructura=0

      if(newAncho>largoMinimoPlafon){
        parales=Number(Math.ceil(((newLargo/distanciaParales)/0.95)*qtyPedazosXLineas))
        clavosYeso=parales*3
        fulminantes=clavosYeso
      }

      tornilloEstructura=Number(((((parales/380)*10))/10))
      if(tornilloEstructura>0 && tornilloEstructura<0.1){
        tornilloEstructura=0.1
      }
      tornilloEstructura= Number(tornilloEstructura.toFixed(1))
      let fundaClavo=(Math.ceil(Number(((newPerimetro/distanciaClavos)/100)*10))/10)
      if(fundaClavo>0 && fundaClavo<0.1){
        fundaClavo=0.1
      }
      let angularF = Math.ceil(Number(newPerimetro/largoPlafon))
      let unionLamina=0
      if(newAncho>largoPlafon){
        unionLamina= parseFloat(((newLargo / tamannioUnionLamina)*(Math.floor(newAncho/largoPlafon))).toFixed(2))
      }
      let plafon=(Math.ceil(Number(qtyPedazosTotal/qtyPedazosXPlancha)))


      // console.log(tamannioPedazos)
      let tamannioPedazosMostrar=0

      // Usando lado corto
      if(modoAutomatico==true){
        if(entradaMaster[index][2].dirrCorta==true){
          tamannioPedazosMostrar=objeto.ancho
          if(objeto.ancho>=objeto.largo){
            tamannioPedazosMostrar=objeto.largo
          }
        }
        // Usando lado largo
        else if(entradaMaster[index][2].dirrCorta==false){
          tamannioPedazosMostrar=objeto.largo
          if(objeto.ancho>=objeto.largo){
            tamannioPedazosMostrar=objeto.ancho
          }
        }
      }
      tamannioPedazosMostrar=tamannioPedazosMostrar/qtyPedazosXLineas
      console.log(tamannioPedazosMostrar)
      const formulas=[
        {
          descripcion:"Plafon Machihembrado",
          formular:plafon
        },
        {
          descripcion:"Parales 1 5/8",
          formular:parales,
        },
        {
          descripcion:"Angular F",
          formular:angularF,
        },
        {
          descripcion:"F. Clavo 100unds",
          formular:fundaClavo,
        },
        {
          descripcion:"Clavos de Yeso",
          formular:clavosYeso,
        },
        {
          descripcion:"Fulminantes",
          formular:fulminantes,
        },
        {
          descripcion:"Tornillos Estructura",
          formular:tornilloEstructura,
        },
        {
          descripcion:"Union Lamina",
          formular:unionLamina,
        },
        {
          descripcion:"Tamaño pedazos",
          formular:tamannioPedazosMostrar
          
        },
       
      ]
    
      if(objeto.ancho>0&&objeto.largo>0||objeto.area>0){
        return formulas
      }
      else {
        return[]
      }
     
  }


  
  // *********************USEEFFEC PARA VALORES INICIALES ********************
  const [tablaResult, setTablaResult] = useState([]);
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
       const objeto = { ...fila, dirrCorrecta:null };
       delete objeto.qtyTotal
       // Aquí puedes agregar cualquier lógica para copiar propiedades específicas de tablaMat
       return {...objeto,qty:''};
     });
   });
   setTablaResult(depositResult);
 },[])

   // ********************* IDENTIFICAR DIRRECION CORRECTA ********************
   const precios={
    plancha:611,
    paral:144,
    angularF:231,
    fundaClavo:53,
    clavoYeso: 6.3,
    fulminante: 5.8,
    // alambre: 182,
    tornillo:271.7,
    unionLamina:100
}

   useEffect(()=>{
  
    if(entradaMaster.length>0)
     {setEntradaMaster(entradaMaster.map((ent,index)=>{
       let objeto={
         ancho:Number(ent[0].valor),
         largo:Number(ent[1].valor)
       }
       let montoCorto=0
       let montoLargo=0
       const calculoCorto=functFormulas(objeto,undefined,undefined,false,true)
       const calculoLargo=functFormulas(objeto,undefined,undefined,false,false)
      // return ''
      //  if(calculoCorto.length>0){
      //    console.log('corto',calculoCorto)
      //   }
      //   if(calculoLargo.length>0){
      //     console.log('largo',calculoLargo)
      //   }

       calculoCorto.forEach((cal,index)=>{
        switch (cal.descripcion) {
          case 'Plafon Machihembrado':
            montoCorto+=(cal.formular*precios.plancha)
            break;
          case 'Parales 1 5/8':
            montoCorto+=(cal.formular*precios.paral)
            break;
          case 'Angular F':
            montoCorto+=(cal.formular*precios.angularF)
            break;
          case 'F. Clavo 100unds':
            montoCorto+=(cal.formular*precios.fundaClavo)
            break;
          case 'Clavos de Yeso':
            montoCorto+=(cal.formular*precios.clavoYeso)
            break;
          case 'Fulminantes':
            montoCorto+=(cal.formular*precios.fulminante)
            break;
          case 'Tornillos Estructura':
            montoCorto+=(cal.formular*precios.tornillo)
            break;
          case 'Union Lamina':
            montoCorto+=(cal.formular*precios.unionLamina)
            break;
          default:
            break;
        }
      })

      calculoLargo.forEach((cal,index)=>{
        switch (cal.descripcion) {
          case 'Plafon Machihembrado':
            montoLargo+=(cal.formular*precios.plancha)
            break;
          case 'Parales 1 5/8':
            montoLargo+=(cal.formular*precios.paral)
            break;
          case 'Angular F':
            montoLargo+=(cal.formular*precios.angularF)
            break;
          case 'F. Clavo 100unds':
            montoLargo+=(cal.formular*precios.fundaClavo)
            break;
          case 'Clavos de Yeso':
            montoLargo+=(cal.formular*precios.clavoYeso)
            break;
          case 'Fulminantes':
            montoLargo+=(cal.formular*precios.fulminante)
            break;
          case 'Tornillos Estructura':
            montoLargo+=(cal.formular*precios.tornillo)
            break;
          case 'Union Lamina':
            montoLargo+=(cal.formular*precios.unionLamina)
            break;
          default:
            break;
        }
      })

      const entradaDirrCor=ent.map((entrada,i)=>{
        
        if(montoCorto<montoLargo){
          if(i==2){
            return{
              ...entrada,
              dirrCorrecta:1
            }
          }
          else{
            return entrada
          }
        }
        if(montoCorto>montoLargo){
          if(i==2){
            return{
              ...entrada,
              dirrCorrecta:2
            }
          }
          else{
            return entrada
          }
        }
        else{
          return entrada
        }
        
      })
       return entradaDirrCor

     }))}

   },[refreshCal])



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
            valor:'',
            dirrCorta:true,
            dirrCorrecta:null
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

    useEffect(()=>{
      if(tablaResult.length>0){
        let objeto={}
       const newResult=tablaResult.map((filas)=>{
        const celdas=filas.map((celda,index)=>{
          let probar={
            formular:'op'
          }
          entradaMaster.forEach((ent,itEntrada)=>{

              objeto.ancho=Number(ent[0].valor)
              objeto.largo=Number(ent[1].valor)
            
       

            if(itEntrada==index){
              const raboat=functFormulas(objeto,entradaMaster,itEntrada,true)
              probar=raboat.find((mat)=>{
                if(mat.descripcion==celda.descripcion){
                  return mat
                }
              })
            }
          })

          let resultado=0
          if(probar){
            
            resultado=probar.formular
          }

            resultado=Number(resultado)
          return{
            ...celda,
            qty:resultado,
            unidadMedida:celda.unidadMedida?(
              arrayOpcionesUnidadMedida[0].select==true?
              'Mts'
              :
              arrayOpcionesUnidadMedida[1].select==true?
              "'"
              :
              arrayOpcionesUnidadMedida[2].select==true?
              '"'
              :
              ''

            ):''

          }
        })
        return celdas
       })
       setTablaResult(newResult)



      //  Sumando el total
      setTablaMat((tablaMat.map((mat)=>{
        let acc=0
        newResult.forEach((fila)=>{
          const filaParsed=fila.map((celda)=>{
            if(celda.descripcion==mat.descripcion){
              acc+=celda.qty
            }
          })
          return filaParsed
        })

        // Redondear segun el multiplo deseado
        if(mat.redondeo>0){
          acc=(Math.ceil(acc/mat.redondeo))*mat.redondeo
        }

        return{
          ...mat,
          qtyTotal:mat.noSumable==true?'-':Math.ceil(acc)
        }
      })))
    }
    if(entradaMaster.length>0&&iniciando==true){
      if(width>550){
        primerInputRef.current.focus()
      }
    }
    },[entradaMaster, refreshCal,arrayOpcionesLargoPlafon])


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
      else{
        console.log('❌❌❌❌')
      }
    
    }

    const changeDirection=(e)=>{
      const index=Number(e.target.dataset.id)
      const name=e.target.name

    let raboat=(entradaMaster.map((ent,i)=>{
      const nuevEnt=ent.map((introducir,iterar)=>{


        if(iterar==2){
          return{
            ...introducir,
            dirrCorta:index==i?!introducir.dirrCorta:introducir.dirrCorta
          }
        }
        else{
          return introducir
        }

      })
      return nuevEnt
      }))

      setEntradaMaster(raboat)
      setRefreshCal(!refreshCal)

      
    }

  return (
    <>
    {/* <BotonQuery
    entradaMaster={entradaMaster}
      tablaResult={tablaResult}
      tablaMat={tablaMat}
    /> */}
<SeccionParametros>

    <OpcionUnica
      titulo='Unidad de medida'
      name='unidadMedida'
      marginRight={true}
      arrayOpciones={arrayOpcionesUnidadMedida}
      handleOpciones={handleOpciones}
      />
    <OpcionUnica
      titulo='Largo plafon'
      name='largoPlafon'
      arrayOpciones={arrayOpcionesLargoPlafon}
      handleOpciones={handleOpciones}
      />
      </SeccionParametros>

      <InputsOutputsMachihembrado
        sumarRestarHab={sumarRestarHab}
        handleInputs={handleInputs}
        entradaMaster={entradaMaster}

        tablaMat={tablaMat}
        tablaResult={tablaResult}
        arrayOpcionesUnidadMedida={arrayOpcionesUnidadMedida}
        copiarPortaPapeles={copiarPortaPapeles}
        changeDirection={changeDirection}
        primerInputRef={primerInputRef}
        width={width}

      />





    <Envoltura>
       
       

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
        

    
      
    </Envoltura>
     
</>

  )
}


const SeccionParametros = styled.section`
margin-top: 20px;
display: flex;
justify-content: start;
padding-left: 20px;
align-items: start;
flex-direction: row;
margin-bottom: 5px;
@media screen and (max-width: 900px){

  flex-direction: column;
}
@media screen and (max-width: 500px){
  justify-content: start;
  align-items: start;
  /* padding-left: 20px; */
}
`

const Envoltura=styled.div`
  /* background-color: #00ffaa; */
  position: relative;
  /* height: 100%; */
`
// 1333