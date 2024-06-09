// Comentado el 6 de abril 2024
// import React, { useEffect, useRef, useState } from 'react'
// import styled from 'styled-components'
// import theme from '../../../theme'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { BtnGeneralButton } from '../../components/BtnGeneralButton'
// import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore'
// import db from '../../firebase/firebaseConfig'
// import { Parametrizadores } from '../../components/Parametrizadores'
// import { TablaListaTodosLosBLs } from '../Tablas/TablaListaTodosLosBLs'
// import { TablaListaTodasLasOC } from '../Tablas/TablaListaTodasLasOC'

// export const QueryListaDocs = () => {
//     const [dbBLs, setDBBLs]=useState('')
//     useEffect(() => {
//         onSnapshot(
//         collection(db, 'billOfLading'),
//         (snapShot)=>{
//             console.log('Se ejecuto snapshop')
//             const aregloOrdenes = snapShot.docs.map((documento)=>{
//             return{...documento.data(), id:documento.id}
//             })
//             setDBBLs(aregloOrdenes)
//             console.log(aregloOrdenes)
//         },
//         (error)=>{
//             console.log(error)
//         }
//         )
//     }, [])

//     const [parametroB, setParametroB]=useState(0)
//     const [vistaQuery, setVistaQuery]=useState('Ordenes Compra')

//     const handleOpciones=(opcion)=>{
//         if(opcion==0){
//           setVistaQuery('Ordenes Compra')
          
//         }
//         else if(opcion==1){
//           setVistaQuery('Bills of Lading')
//         }
//       }
      
//   const opcionesSelecionarTabla=[
//     {
//       nombre:'Ordenes Compra',
//       tecla: 'Tecla Q',
//       // selecionada:true,
//       opcion: 0
//     },
//     {
//       nombre:'Bill of Lading',
//       tecla: 'Tecla W',
//       opcion: 1
//     },
//   ]

//   const shortHandOpciones=[
//     {
//       opcionMetros : useRef(null),
//       opcionPies : useRef(),
//     },
//   ]


//   return (
//     <>
//     <CajaEncabezadoTabla>
//       <Parametrizadores
//             titulo={''}
//             name='grupoB'
//             shortHandOpciones={shortHandOpciones[0]}
//             opcionesParametrizadoras={opcionesSelecionarTabla}
//             parametros={parametroB}
//             setParametros={setParametroB}
//             handleParametroB={handleOpciones}
//             bottomOf={true}
//             />
//       <TituloEncabezado>
//         {
//           vistaQuery=='Ordenes Compra'?
//           'Lista de todas las ordenes de compra'
//           :
//           vistaQuery=='Bills of Lading'?
//           'Lista de todos los Bill of Lading'
//           :
//           ''
//         }
//       </TituloEncabezado>
//     </CajaEncabezadoTabla>

//     {
//       vistaQuery=='Ordenes Compra'?
//       <TablaListaTodasLasOC/>
//       :
//       <TablaListaTodosLosBLs/>


//     }
//     </>
//   )
// }
// const Container=styled.div`
  
// `
// const CajaEncabezado=styled.div`
//   background-color: ${theme.azulOscuro1Sbetav2};
//   padding: 5px;
//   display: flex;
//   justify-content: space-around;
// `
// const Titulo=styled.h2`
//   color: ${theme.azul2};
//   width: 100%;
//   text-align: center;
//   text-decoration: underline;
// `
// const BtnHead=styled(BtnGeneralButton)`
//     width: auto;
//     padding: 10px;
//     white-space: nowrap;
//     margin: 0;
// `
// const Icono=styled(FontAwesomeIcon)`
//     margin-right: 4px;
// `


// const Tabla=styled.table`
//   border: 1px solid ${theme.azul1};
//   color: ${theme.azul1};
//   width: 100%;
//   margin: auto;
// `
// const EncabezadoTabla=styled.thead`
//   border: 1px solid white;
//   background-color: ${theme.azulOscuro1Sbetav3};
//   width: 300px;
// `

// const Filas=styled.tr`
//   width: 300px;
// `

// const CeldasHead=styled.th`
// width: 300px;
// border: 1px solid ${theme.azul1};
// `

// const CeldasBody=styled.td`
//   margin: 0 5px;
//   width: 800px;
//   padding: 5px;
//   text-align: center;
// `
// const TextoStatus=styled.h3`
//     /* background-color: ${theme.azulOscuro1Sbetav3}; */
//     color: white;
//     font-size: 2rem;
// `
// const CajaEncabezadoTabla =styled.div`
//   background-color: ${theme.azulOscuro1Sbetav};
//   padding-left: 15px;
//   text-align: center;
//   display: flex;
// `

// const TituloEncabezado=styled.h2`
//     color: white;
//     font-weight: normal;
// `