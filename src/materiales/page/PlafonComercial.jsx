import React, { useState, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import './../components/estilos.css'
import { Alerta } from '../../components/Alerta'
import { OpcionUnica } from '../../components/OpcionUnica'
import { BotonQuery } from '../../components/BotonQuery'
import { InputsOutputs } from '../components/InputsOutputs'

export const PlafonComercial = () => {
  useEffect(()=>{
    document.title = "Caeloss - Plafon Comercial";
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
  // Codigo optimizado 10/3/2024
  
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
    {nombre:'Pulg.',
    opcion: 4,
    select:false,
    }
  ])
  const [arrayOpcionesTamannio,setArrayOpcionesTamannio]=useState([
    {
      nombre:'2x4',
      opcion: 0,
      select:false,
    },
    {
      nombre:'2x4 cortar a 2x2',
      opcion: 1,
      select:false
    },
    {
      nombre:'2x2',
      opcion: 2,
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

          console.log(index)
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
                    inactivo:
                      iterador==0||
                      iterador==1?
                      false
                      :
                      true,
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
                    inactivo:
                      iterador==2||
                      iterador==3?
                      false
                      :
                      true,
                  }
                })
                return entradaParsed
              })
            )

          }

      }
      else if(name==='tamannio'){
        setArrayOpcionesTamannio(prevOpciones => 
          prevOpciones.map((opcion, i) => ({
            ...opcion,
            select: i === index,
          }))
          );

        let desactivar=[]
        if(index==0){
          desactivar=[
            1,2
          ]
        }
        else if(index==1){
          desactivar=[
            1
          ]
        }
        else if(index==2){
          desactivar=[
            0
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

    // ----------------
    // ----------------
    // ----------------

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
          },
        ],
      }

    const [entradaMaster, setEntradaMaster]=useState([])
    
    const [tablaMat, setTablaMat]=useState([
      {
        codigo:'-',
        descripcion:"Plafon 2'x4'",
        qtyTotal:'',
      },
      {
        codigo:'-',
        descripcion:"Plafon 2'x2'",
        qtyTotal:'',
      },
      {
        codigo:'02027',
        descripcion:"Crosstee 2'",
        qtyTotal:'',
      },
      {
        codigo:'02026',
        descripcion:"Crosstee 4'",
        qtyTotal:'',
      },
      {
        codigo:'02028',
        descripcion:"Main tee 12'",
        qtyTotal:'',
      },
      {
        codigo:'02016',
        descripcion:"Angular 10'",
        qtyTotal:'',
      },
      {
        codigo:'02005',
        descripcion:"F. Clavo 100unds	",
        qtyTotal:'',
      },
      {
        codigo:'02066',
        descripcion:"Fulminantes",
        qtyTotal:'',
      },
      {
        codigo:'02163',
        descripcion:"Clavo de plafon",
        qtyTotal:'',
      },
      {
        codigo:'02010',
        descripcion:"Alambres 100'",
        qtyTotal:'',
      }
    ])


    // ********************* FORMULAS MASTER *************************
    const functFormulas=(objeto)=>{
      let mainT=(Math.ceil((((Number(objeto.area))/0.747))/6))

      // console.log(objeto.area)
      const formulas=[
        {
          descripcion:"Plafon 2'x4'",
          formular:(Math.ceil((Number(objeto.area))/0.747)),
        },
        {
          descripcion:"Plafon 2'x2'",
          formular:(Math.ceil((Number(objeto.area))/0.37)),
        },
        {
          descripcion:"Crosstee 2'",
          formular:(Math.ceil((Number(objeto.area))/0.747))
          
        },
        {
          descripcion:"Crosstee 4'",
          formular:(Math.ceil((Number(objeto.area))/0.747))
        },
        {
          descripcion:"Main tee 12'",
          formular:mainT
          
        },
        {
          descripcion:"Angular 10'",
          formular:Math.ceil(objeto.perimetro/3.05),
        },
        {
          descripcion:"F. Clavo 100unds	",
          formular:(parseFloat((((Number(objeto.perimetro))/0.6)/100)))<0.01&&(parseFloat((((Number(objeto.perimetro))/0.6)/100)))>0?0.1:(parseFloat((((((Number(objeto.perimetro))/0.6)/100))).toFixed(2))),
        },
        {
          descripcion:"Fulminantes",
          formular:mainT*3
        },
        {
          descripcion:"Clavo de plafon",
          formular:mainT*3
        },
        {
          descripcion:"Alambres 100'",
          formular:(parseFloat(((Number(objeto.area))/25)))<0.1&&(parseFloat(((Number(objeto.area))/25)))>0?0.1:(parseFloat(((Number(objeto.area))/25).toFixed(2))),
        }
      ]

      if(objeto.ancho>0&&objeto.largo>0||objeto.area>0){
        return formulas
      }
      else {
        return[]
      }
  }




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
      let hasTamannio=false
      arrayOpcionesTamannio.forEach((opc)=>{
        if(opc.select==true){
          hasTamannio=true
        }
      })


      if(hasTamannio==false){
        if(iniciando==false){

          setMensajeAlerta('Selecione tamaño plafon.')
          setTipoAlerta('warning')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
        }
      }
      else if(hasTamannio==true){
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


            // Sacar Area² y Perimetro Lineal
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
        if(mat.descripcion=='Fulminantes'||mat.descripcion=="Clavo de plafon"){
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
          titulo='Tamaño Plafon'
          name='tamannio'
          arrayOpciones={arrayOpcionesTamannio}
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

  // const SeccionParametros = styled.section`
  //   margin-top: 10px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   flex-direction: row;
  //   margin-bottom: 20px;
  //   @media screen and (max-width: 1065px){
  //     flex-direction: column;

  //   }
  //   @media screen and (max-width: 500px){
  //     justify-content: start;
  //     align-items: start;
  //     padding-left: 20px;
  //   }
  //   @media screen and (max-width: 380px){
  //     padding-left: 5px;
  //   }
  // `
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

  // 979