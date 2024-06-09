import React, { useState, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import './../components/estilos.css'
import { Alerta } from '../../components/Alerta'
import theme from '../../../theme'
import { OpcionUnica } from '../../components/OpcionUnica'
import { BotonQuery } from '../../components/BotonQuery'
import { InputsOutputs } from '../components/InputsOutputs'

export const DivisionYeso = () => {
    
  useEffect(()=>{
    document.title = "Caeloss - Division Yeso";
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

  const [qtyCaras, setQtyCaras]=useState(0)


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
      nombre:'Pulgadas',
      opcion: 2,
      select:false,
    },
  ])
  const [arrayOpcionesCaras,setArrayOpcionesCaras]=useState([
    {
      nombre:'1 Cara',
      opcion: 0,
      select:false,
    },
    {
      nombre:'2 Caras',
      opcion: 1,
      select:false
    },
  ])

  const handleOpciones=(e)=>{
    let index=Number(e.target.dataset.id)
    let name=e.target.name

    if(name=='unidadMedida'){
      setQtyPuerta('')
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
          if(index==0||index==1||index==2){
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
          // if(index==2||index==3){
          //   setEntradaMaster(prevState=>
          //     prevState.map((entrada,i)=>{
          //       const entradaParsed=entrada.map((int,iterador)=>{
          //         return{
          //           ...int,
          //           valor:'',
          //           inactivo:iterador==2||iterador==3?false:true,
          //         }
          //       })
          //       return entradaParsed
          //     })
          //   )
          // }
      }
      else if(name=='caras'){
        setArrayOpcionesCaras(prevOpciones=>
            prevOpciones.map((opcion,i)=>({
              ...opcion,
              select: i === index,
            }))
          )

        setRefreshCal(!refreshCal)

        if(index==0){
          setQtyCaras(1)
        }
        if(index==1){
          setQtyCaras(2)
        }
      }
      if(width>550){
        primerInputRef.current.focus()
      }
    }

    // *********************MANEJANDO INPUTS*************************
    const [qtyPuerta, setQtyPuerta]=useState('')

    const handlePuerta=(e)=>{
        setQtyPuerta(e.target.value)
        setRefreshCal(!refreshCal)

    }


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
        codigo:'04001',
        descripcion:'Parales 2 1/2" cal.25',
        qtyTotal:'',
      },
      {
        codigo:'04003',
        descripcion:'Durmientes 2 1/2" cal.25',
        qtyTotal:'',
      },
      {
        codigo:'04367',
        descripcion:"Masilla cubeta 5gl",
        qtyTotal:'',
      },
      {
        codigo:'08006',
        descripcion:'Tornillos de plancha 1 1/4"',
        qtyTotal:'',
      },
      {
        codigo:'08003',
        descripcion:'Tornillos de estructura 7/16"',
        qtyTotal:'',
      },
      {
        codigo:'04025',
        descripcion:"Cinta 250'",
        qtyTotal:'',
      },
      {
        codigo:'04020',
        descripcion:"Lija N°100",
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
      },
      {
        codigo:'04070',
        descripcion:"Madera 1''x2''x7'",
        qtyTotal:'',
        global:true
      },
            {
        codigo:'04009',
        descripcion:"Esquineros",
        qtyTotal:'',
        global:true,
      },
    
    ])

    
    // ********************* FORMULAS MASTER *************************
    const functFormulas=(objeto)=>{
      let plancha=Number((objeto.area/2.98)*qtyCaras)
      console.log(objeto)
      console.log(objeto)

// Previo al 8 junio 2024
      // // let paral212=Number(((objeto.area/objeto.largo)/0.6))
      // if(objeto.largo>3){
      //   paral212=Number(((objeto.area/objeto.largo)/0.6)*(objeto.largo/2.7))
      // }

// Posterior al 8junio 2024

      let paral212=Number((objeto.ancho/0.6))
      if(objeto.largo>3){
        paral212=Number((objeto.ancho/0.6)*(objeto.largo/2.7))
      }
      let durmiente212=Number(((objeto.area/objeto.largo)/3)*2)
      let masilla=Number((Math.ceil(((objeto.area/25)*qtyCaras)*10))/10)
      let tornillosPlancha=((((plancha*30)/260))*10)/10
        if(tornillosPlancha>0&&tornillosPlancha<0.1){
            tornillosPlancha=0.1
        }

      let tornilloEstructura=(paral212*4)/380
      tornilloEstructura=(tornilloEstructura)
      if(tornilloEstructura>0&&tornilloEstructura<0.1){
          tornilloEstructura=0.1
      }
      tornilloEstructura= Number(tornilloEstructura)

      let cinta250=(plancha*12)/250
      if(cinta250>0&&cinta250<0.1){
          cinta250=0.1
      }
      cinta250=Number(cinta250)

      let lija100=Math.ceil((objeto.area/20)*qtyCaras)
      let fulminantes=(Math.ceil(((durmiente212*3)/0.6)))



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
          descripcion:'Parales 2 1/2" cal.25',
          formular:
            paral212>0.1?
            Number(paral212.toFixed(1))
            :
            paral212>0&&paral212<0.1?
            0.1
            :
            paral212
        },
        {
          descripcion:'Durmientes 2 1/2" cal.25',
          formular:
            durmiente212>0.1?
            Number(durmiente212.toFixed(1))
            :
            durmiente212>0&&durmiente212<0.1?
            0.1
            :
            durmiente212
          
        },
        {
          descripcion:"Masilla cubeta 5gl",
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
          descripcion:'Tornillos de plancha 1 1/4"',
          formular:
            tornillosPlancha>0.1?
            Number(tornillosPlancha.toFixed(1))
            :
            tornillosPlancha>0&&tornillosPlancha<0.1?
            0.1
            :
            tornillosPlancha
        },
        {
          descripcion:'Tornillos de estructura 7/16"',
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
          descripcion:"Cinta 250'",
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
          descripcion:"Lija N°100",
          formular:
            lija100>0.1?
            Number(lija100.toFixed(1))
            :
            lija100>0&&lija100<0.1?
            0.1
            :
            lija100
        },
        {
          descripcion:"Fulminantes",
          formular:
            fulminantes>0.1?
            Number(fulminantes.toFixed(1))
            :
            fulminantes>0&&fulminantes<0.1?
            0.1
            :
            fulminantes
        },
        {
          descripcion:"Clavos de yeso",
          formular:
            fulminantes>0.1?
            Number(fulminantes.toFixed(1))
            :
            fulminantes>0&&fulminantes<0.1?
            0.1
            :
            fulminantes
        },
        // {
        //   descripcion:"Madera 1''x2''x7'",
        //   formular:qtyPuerta*3
        // },
        // {
        //   descripcion:"Esquineros",
        //   formular:qtyPuerta*4
        // },
       
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
    let hasCaras=false
    arrayOpcionesCaras.forEach((opc)=>{
      if(opc.select==true){
        hasCaras=true
      }
    })

    if(hasCaras==false){
      if(iniciando==false){
        setMensajeAlerta('Indique 1 Cara / 2 Caras.')
        setTipoAlerta('warning')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);
      }
    }
    else if(hasCaras==true){
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
          // 3-Opcion en Pulgadas
          if(arrayOpcionesUnidadMedida[2].select){
            objeto.ancho=Number(ent[0].valor)*0.0254
            objeto.largo=Number(ent[1].valor)*0.0254
          }
      
              objeto.area=objeto.ancho*objeto.largo
              objeto.perimetro=(objeto.ancho+objeto.largo)*2


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
      else if(mat.descripcion=="Madera 1''x2''x7'"){
        acc=qtyPuerta*2
      }
      else if(mat.descripcion=='Esquineros'){
        acc=qtyPuerta*4

        if(qtyCaras==1){
          acc=acc/2
        }
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
          name='unidadMedida'
          marginRight={true}
          arrayOpciones={arrayOpcionesUnidadMedida}
          handleOpciones={handleOpciones}
          // dosMobil={true}
          />
        <OpcionUnica
          titulo='Qty Caras'
          name='caras'
          arrayOpciones={arrayOpcionesCaras}
          handleOpciones={handleOpciones}
          // dosMobil={true}
        />
      </SeccionParametros>
          <ContenedorPuertas>

        <CajaPuertas>
            <TitutoPuertas>Puertas</TitutoPuertas>
            <p></p>
            <Input 
                type="number" 
                value={qtyPuerta}
                onChange={(e) =>handlePuerta(e)}
            />
        </CajaPuertas>
          </ContenedorPuertas>

      <InputsOutputs
        sumarRestarHab={sumarRestarHab}
        handleInputs={handleInputs}
        entradaMaster={entradaMaster}
        sinAreaCuadrada={true}

        tablaMat={tablaMat}
        tablaResult={tablaResult}
        arrayOpcionesUnidadMedida={arrayOpcionesUnidadMedida}
        copiarPortaPapeles={copiarPortaPapeles}
        primerInputRef={primerInputRef}
        comprimir={true}
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
  //   justify-content: start;
  //   align-items: center;
  //   flex-direction: row;
  //   padding: 15px;
  //   @media screen and (max-width: 500px){
  //     /* flex-direction: column; */
  //     /* border: 1px solid red; */
  //     gap: 5px;
  //     justify-content: start;
  //     align-items: start;
  //   }
  //   @media screen and (max-width: 400px){
  //     flex-direction: column;
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
  /* border: 2px solid yellow; */
  @media screen and (max-width: 900px){

    flex-direction: column;
  }
  @media screen and (max-width: 500px){
    justify-content: start;
    align-items: start;
    /* padding-left: 20px; */
  }
`


const ContenedorPuertas = styled.div`
    border-bottom: 1px solid #fff;
    padding-bottom: 5px;
`
const CajaPuertas=styled.div`
    background-color: ${theme.azulTransparente2};
    /* border-bottom: 1px solid white; */
    width: 90%;
    margin: auto;
    padding: 5px;
    border-radius: 5px;
    

`
const TitutoPuertas=styled.h4`
    color:white;
    font-weight: lighter;
`

const Input = styled.input`
  padding: 3px;
  font-size: 1rem;
  width: 100%;
  margin-right: 5px;
  box-shadow: ${theme.boxShadow};
  color: #fff;
  background-color: transparent;
  outline: none;
  border: none;
  border-radius: 5px;
  border: 1px solid black;
  height: 30px;
  font-weight: lighter;
  &::-webkit-inner-spin-button{
    -webkit-appearance: none; 
    margin: 0
  }
  &::-webkit-outer-spin-button{
    -webkit-appearance: none; 
    margin: 0
  }
  &::placeholder{
  color: #fff
}
`