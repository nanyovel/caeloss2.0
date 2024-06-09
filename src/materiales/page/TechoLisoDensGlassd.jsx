import React, { useState, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import './../components/estilos.css'
import { EntradaDatos } from '../components/EntradaDatos'
import { SalidaDatos } from '../components/SalidaDatos'
import { Alerta } from '../../components/Alerta'
import { OpcionUnica } from '../../components/OpcionUnica'
import { BotonQuery } from '../../components/BotonQuery'
import { InputsOutputs } from '../components/InputsOutputs'

export const TechoLisoDensGlass
 = () => {
  useEffect(()=>{
    document.title = "Caeloss - Techo Densglass";
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
  const inputAreaRef=useRef(null)

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
      {
        nombre:'Metros²',
        opcion: 2,
        select:false,
      },
        {nombre:'Pies²',
        opcion: 3,
        select:false,
      },
        {nombre:'Pulgadas',
        opcion: 4,
        select:false,
      }
    ])
    const [arrayOpcionesDistancia,setArrayOpcionesDistancia]=useState([
      {
        nombre:'A 60cm',
        opcion: 0,
        select:false,
      },
      {
        nombre:'A 40cm',
        opcion: 1,
        select:false
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
            if(index==0||index==1||index==4){
              setTimeout(() => {
                if(width>550){
                  primerInputRef.current.focus()
                }
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
              setTimeout(() => {
                if(width>550){
                  inputAreaRef.current.focus()
                }
          
              }, 100);
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
        else if(name==='distanciaParales'){
          
          setArrayOpcionesDistancia(prevOpciones => 
            prevOpciones.map((opcion, i) => ({
              ...opcion,
              select: i === index,
            }))
            );
  
          let desactivar=[]
          if(index==0){
            desactivar=[
              2
            ]
          }
          else if(index==1){
            desactivar=[
              1
            ]
          }
         
          setTablaMat(tablaMat.map((mat,i)=>{
              return{
                ...mat,
                desactivado:desactivar.includes(i)
              }
          }))
  
          const newResult=(tablaResult.map((mat,i)=>{
            const matParsed=mat.map((item,ite)=>{
              return{
                ...item,
                desactivado:desactivar.includes(i)
              }
            })
            return matParsed
            
          }))
  
  
          setTablaResult(newResult)
          setRefreshCal(!refreshCal)
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
          descripcion:"Plancha 4'x8'",
          qtyTotal:'',
        },
        {
          codigo:'04044',
          descripcion:"Parales 1 5/8 | 60cm",
          qtyTotal:'',
        },
        {
          codigo:'04044',
          descripcion:"Parales 1 5/8 | 40cm'",
          qtyTotal:'',
        },
        {
          codigo:'04041',
          descripcion:"Durmientes 1 5/8",
          qtyTotal:'',
        },
        {
          codigo:'04024',
          descripcion:"Masilla Keraflor 50lb",
          qtyTotal:'',
        },
        {
          codigo:'08008',
          descripcion:'Tornillos aut. Barr. plancha 1 1/4"',
          qtyTotal:'',
        },
        {
          codigo:'08019',
          descripcion:"Tornillos aut. Barr. de estructura 7/16",
          qtyTotal:'',
        },
        {
          codigo:'04029',
          descripcion:"Cinta de fibra 300'",
          qtyTotal:'',
        },
        {
          codigo:'02066',
          descripcion:"Fulminantes",
          qtyTotal:'',
        },
        {
          codigo:'04324',
          descripcion:"Clavos de yeso",
          qtyTotal:'',
        }
      ])

      const functFormulas=(objeto)=>{
        let plancha=Number((objeto.area/2.98))
        let paral158a40=((plancha*3)+((objeto.area*1.345)/5))+( (((objeto.area * 1.345)/5)*2.5)/3)
        let paral158a60=(((plancha*2) + ((objeto.area*1.345)/5)) + ((((objeto.area*1.345)/5)*2.5)/3))
        let masilla=Number(((objeto.area/9)*10))/10
        let tornilloPlancha=Number(((plancha/6)*10)/10)
        let tornilloEstructura=Number(((((paral158a40*4)/380)*10)/10))
        let cinta250=Number(Math.ceil((((plancha*12)/300)*10))/10)
  
        let durmientes158=(objeto.perimetro / 3)
        let fulminantes=Math.ceil((durmientes158*3)/0.6)
        

  
        const formulas=[
          {
            descripcion:"Plancha 4'x8'",
            formular:
              plancha>0.1?
              Number(plancha.toFixed(1))
              :
              plancha>0&&plancha<0.1?
              0.1
              :
              plancha
          },
          {
            descripcion:"Parales 1 5/8 | 60cm",
            formular:
             paral158a60>0.1?
              Number(paral158a60.toFixed(1))
              :
              paral158a60>0&&paral158a60<0.1?
              0.1
              :
              paral158a60
          },
          {
            descripcion:"Parales 1 5/8 | 40cm'",
            formular:
             paral158a40>0.1?
              Number(paral158a40.toFixed(1))
              :
              paral158a40>0&&paral158a40<0.1?
              0.1
              :
              paral158a40
          },
          {
            descripcion:"Durmientes 1 5/8",
            formular:
            durmientes158>0.1?
              Number(durmientes158.toFixed(1))
              :
              durmientes158>0&&durmientes158<0.1?
              0.1
              :
              durmientes158
          },
          {
            descripcion:"Masilla Keraflor 50lb",
            formular:
             masilla>0.1?
              Number(masilla.toFixed(1))
              :
              masilla>0&&masilla<0.1?
              0.1
              :
              masilla
            
          },
          {
            descripcion:'Tornillos aut. Barr. plancha 1 1/4"',
            formular: 
               tornilloPlancha>0.1?
              Number(tornilloPlancha.toFixed(1))
              :
              tornilloPlancha>0&&tornilloPlancha<0.1?
              0.1
              :
              tornilloPlancha
          },
          {
            descripcion:"Tornillos aut. Barr. de estructura 7/16",
            formular:
            tornilloEstructura>0.1?
              Number(tornilloEstructura.toFixed(1))
              :
              tornilloEstructura>0&&tornilloEstructura<0.1?
              0.1
              :
              tornilloEstructura
          },
          {
            descripcion:"Cinta de fibra 300'",
            formular:
            cinta250>0.1?
              Number(cinta250.toFixed(1))
              :
              cinta250>0&&cinta250<0.1?
              0.1
              :
              cinta250
          },
          {
            descripcion:"Fulminantes",
            formular:fulminantes,
          },
          {
            descripcion:"Clavos de yeso",
            formular:fulminantes,
          }
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
   let hasDistancia=false
   arrayOpcionesDistancia.forEach((opc)=>{
     if(opc.select==true){
      hasDistancia=true
     }
   })

   if(hasDistancia==false){
     if(iniciando==false){
       setMensajeAlerta('Selecione distancia parales.')
       setTipoAlerta('warning')
       setDispatchAlerta(true)
       setTimeout(() => {
         setDispatchAlerta(false)
       }, 3000);
     }
   }
   else if(hasDistancia==true){
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

        // 5-Opcion en Pulgadas
        if(arrayOpcionesUnidadMedida[4].select){
          objeto.ancho=Number(ent[0].valor)*0.0254
          objeto.largo=Number(ent[1].valor)*0.0254
        }

         if(
             arrayOpcionesUnidadMedida[0].select==true||
             arrayOpcionesUnidadMedida[1].select==true||
             arrayOpcionesUnidadMedida[4].select==true
           ){
             objeto.area=objeto.ancho*objeto.largo
             objeto.perimetro=(objeto.ancho+objeto.largo)*2
           }

         // 3-Opcion M²
         if(arrayOpcionesUnidadMedida[2].select){
           objeto.area=Number(ent[2].valor)
           objeto.perimetro=Number(ent[3].valor)
         }
         
         // 4-Opcion P²
         if(arrayOpcionesUnidadMedida[3].select){
           objeto.area=Number(ent[2].valor)*0.0929
           objeto.perimetro=Number(ent[3].valor)*0.3048
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
     if(mat.descripcion=='Fulminantes'||mat.descripcion=="Clavos de yeso"){
      acc=(Math.ceil(acc/10))*10
    }
     return{
       ...mat,
       qtyTotal:Math.ceil(acc)
     }
   })))
 }
 if(entradaMaster.length>0&&iniciando==true){
  if(width>550){
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

  return (
    <>
        <SeccionParametros>
      <OpcionUnica
          titulo='Unidad de medida'
          marginRight={true}
          name='unidadMedida'
          arrayOpciones={arrayOpcionesUnidadMedida}
          handleOpciones={handleOpciones}
        />
        <OpcionUnica
          titulo='Distancia Parales'
          name='distanciaParales'
          arrayOpciones={arrayOpcionesDistancia}
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
        inputAreaRef={inputAreaRef}
        width={width}
      />


       
       <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />

    

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



