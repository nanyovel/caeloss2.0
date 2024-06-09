import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import styled from 'styled-components'
import theme from '../../../theme'
import { DetalleItem } from '../Moldes/DetalleItem'
import CajaNavegacion from '../components/CajaNavegacion'
import { Alerta } from '../../components/Alerta'

export const ListaArticulo = ({
  dbBillOfLading,
  dbOrdenes,
  dbUsuario,
  userMaster,
}) => {
    // Alertas
    const [dispatchAlerta, setDispatchAlerta]=useState(false)
    const [mensajeAlerta, setMensajeAlerta]=useState('')
    const [tipoAlerta, setTipoAlerta]=useState('')

  

// // ******************** SELECIONANDO DOCUMENTO DESEADO ******************** //
const parametro= useParams()
const navegacion=useNavigate()

const [todosItemsBL, setTodosItemsBL]=useState([])
const [todosItemsOC, setTodosItemsOC]=useState([])
const [refresh, setRefresh]=useState(false)

let docUser=parametro.id

  // 0-Sin ejecutar
  // 1-Encontrado
  // 2-NO encontrado
  const [docEncontrado, setDocEncontrado]=useState(0)

useEffect(()=>{
const extraerMat=(tipo)=>{
  if(tipo=='bl'){
    
    return dbBillOfLading.filter(bl=>!bl.eliminated)
    .flatMap(bl => 
      bl.furgones.flatMap(furgon => furgon.materiales.map(item=>({
        ...item,
        status:furgon.status
      }))
        )
      );
  }
  else if(tipo=='oc'){
    return dbOrdenes.filter(orden => !orden.eliminated)
    .flatMap(orden => 
      orden.materiales.map((item) => {
        let cantidadPendiente=0
        let cantidadDespachada=0

        if(item.despachos.length>0){
          item.despachos.forEach(desp=>{
            cantidadDespachada+=desp.qty
          })
        }
        cantidadPendiente=item.qty-cantidadDespachada

        return{
          ...item,
          ordenCompra: orden.numeroDoc,
          qtyPendiente:cantidadPendiente,
          qtyDespachada:cantidadDespachada
        }
      })
    );
  }
}
    if(
      location.pathname=='/importaciones/maestros/articulos/'||
      location.pathname=='/importaciones/maestros/articulos')
      {
      setDocEncontrado(1)
      setTodosItemsBL([])
      setTodosItemsOC([])
    }
    else{
      if(dbBillOfLading.length>0||dbOrdenes.length>0){

        let aji=extraerMat('bl').filter(item=>item.codigo==docUser)
        let aji2=extraerMat('oc').filter(item=>item.codigo==docUser)
        console.log(aji)
        console.log(aji2)
        if(aji.length>0||aji2.length>0){
          setDocEncontrado(1)
        }
        else{
          setDocEncontrado(2)
        }
        setTodosItemsBL(aji)
        setTodosItemsOC(aji2)
      }
    }

  },[dbBillOfLading,refresh,dbOrdenes])

  useEffect(()=>{
    if(docEncontrado==2){
      setMensajeAlerta('Producto no encontrado.')
      setTipoAlerta('warning')
      setDispatchAlerta(true)
      setTimeout(() => {
        setDispatchAlerta(false)
      }, 3000);
    }
},[docEncontrado])

    return(
      <>
            <Contenedor>
              <Header titulo='Sistema gestion de importaciones' subTitulo='Status articulo'/>
              <CajaNavegacion
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />

              {
      
                <DetalleItem 
                todosItemsBL={todosItemsBL}
                setTodosItemsBL={setTodosItemsBL}
                todosItemsOC={todosItemsOC}
                dbBillOfLading ={dbBillOfLading }
                dbOrdenes ={dbOrdenes }
                setRefresh={setRefresh}
                refresh={refresh}
                docEncontrado={docEncontrado }
                userMaster={userMaster}
                  
                />
              
              }


              
            </Contenedor>
            <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
            </>
        )
}

const Contenedor=styled.div`
  /* position: relative; */
  /* height: <audio src=""></audio>%; */
  height: auto;
  /* padding: 10px; */
  /* background-color: red; */
`

const CajaMensaje=styled.div`
  width: 100%;
  min-height: 200px;
  /* border: 1px solid red; */
  background-color: ${theme.warning};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 80%;
  margin: auto;
  margin-top: 100px;
  /* color: white; */
  opacity: 0.4;
  /* transition: all linear ease 0.1s; */


`

const EnlacePrincipal = styled(Link)`
  margin: 8px;
  margin-left: 15px;
  padding: 7px;
  width: auto;
  cursor: pointer; 
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: ${theme.azul3} ;
  color: white;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  display: inline-block;
    

    &:focus{
      background-color: ${theme.azul3} ;
      color: #fff;
    }

    &:hover{
      background-color: #fff ;
    color: #0074d9;
    }
    &:active{
      background-color:  #135c9d;
      color: #fff;
    }
`

