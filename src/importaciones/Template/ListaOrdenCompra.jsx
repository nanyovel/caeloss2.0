import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
// import theme from '../../../theme'
import { Header } from '../../components/Header'
import CajaNavegacion from '../components/CajaNavegacion'
// import { useLocation, useParams } from 'react-router-dom'
// import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore'
// import db from '../../firebase/firebaseConfig'
import { DetalleOrden } from '../Moldes/DetalleOrden'

export const ListaOrdenCompra = ({dbOrdenes,dbUsuario,userMaster,usuario}) => {
  // const parametro= useParams()
  // let docUser = parametro.id

  // let location = useLocation();
  
  // const [dbOrdenes,setDBOrdenes]=useState([])

    // let objetoMaster={}
    // let isOrdenCompra=false
    
  //   function extraerYGeneral(baseDatos, objeto,id){
  //         let arrayInterno=[]
  //     baseDatos.map((orden,index)=>{
  //       if(orden.numeroOrden==id){
  //         objeto=orden;
  //         orden.materiales.map((item)=>{
  //           let cantidadDespachada=0
  //           if(item.despachos.length>0){
  //             item.despachos.map((articulo,index)=>{
  //               cantidadDespachada=cantidadDespachada+articulo.qty
  //             })
  //           }
  //               isOrdenCompra=true
                
  //               let filas={
  //                 codigo:item.codigo,
  //                 descripcion:item.descripcion,
  //                 qty:item.qty,
  //                 comentarios:item.comentarios,
  //                 qtyDisponible:item.qty-cantidadDespachada,
  //                 qtyTotalDespachada:cantidadDespachada,
  //                 despachos:item.despachos,
  //               }
  //             arrayInterno.push(filas)
  //         })
  //       }
  //     })
  //     objeto.materiales=arrayInterno
  //     return objeto
  //   }
  //   let nuevoDato={}
  //   // console.log(location.pathname)
  //   // if(location.pathname=='/importaciones/consultas/ordenescompra'){
  //   if(location.pathname=='/importaciones/consultas/ordenescompra/'||
  //   location.pathname=='/importaciones/consultas/ordenescompra'){
     
  //     nuevoDato={
  //       none:true,
  //       materiales:[]
  //     }
  //   }
  //   else{
  //     nuevoDato=extraerYGeneral(dbOrdenes,objetoMaster, id)

  //   }
    
 
  //   useEffect(() => {
  //     onSnapshot(
  //       collection(db, 'ordenesCompra'),
  //       (snapShot)=>{
  //         // console.log('Se ejecuto snapshop')
  //         const aregloOrdenes = snapShot.docs.map((documento)=>{
  //           return{...documento.data(), id:documento.id}
  //         })
  //         setDBOrdenes(aregloOrdenes)
         
  //       },
  //       (error)=>{
  //         console.log(error)
  //       }
  
  //     )
  
  // }, [])

  return (
    <>
      <Header titulo='Sistema gestion de importaciones' subTitulo='Status de O/C'/>
      <CajaNavegacion
        dbUsuario={dbUsuario}
        userMaster={userMaster}
        />
        <DetalleOrden
          dbOrdenes={dbOrdenes}
          userMaster={userMaster}
          usuario={usuario}
          
          // nuevoDato={nuevoDato}
        />
        {/* <CajaMensaje>
          <h2>El numero orden de compra no existe o esta cerrada</h2>
        </CajaMensaje> */}
    </>
  )
}

const Container=styled.div`
  
`