import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { NavLink } from 'react-router-dom'
import { CSSLoader } from '../../components/CSSLoader'
import { BtnGeneralButton } from '../../components/BtnGeneralButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ControlesTablasMain } from '../components/ControlesTablasMain'
import { Alerta } from '../../components/Alerta'

export const TablaListaTodasLasOC = ({
  dbOrdenes,
}) => {
    // // ******************** RECURSOS GENERALES ******************** //
    const [dispatchAlerta, setDispatchAlerta]=useState(false)
    const [mensajeAlerta, setMensajeAlerta]=useState('')
    const [tipoAlerta, setTipoAlerta]=useState('')

    const [habilitar,setHabilitar]=useState({
      search:true,
      // status:true,
      // destino:true
    })
  
    // // ************************** CODIGO LOADING ************************** //
    const [isLoading,setIsLoading]=useState(false)
    useEffect(()=>{
      if(dbOrdenes.length>0){
        setIsLoading(false)
      }
      if(dbOrdenes.length==0){
            setIsLoading(true)
          }
    },[dbOrdenes])

    const [initialValueOrden,setInitialValueOrden]=useState([])
    // // ************************* CONSOLIDACION ************************* //

    const [listaOrdenes,setListaOrdenes]=useState([])
    useEffect(()=>{

      // Quitar eliminadas
      const ordenesSinEliminadas=dbOrdenes.filter((orden,index)=>{
        return orden.estadoDoc!=2})
        // ordenar orden
      const ordenesSort =(ordenesSinEliminadas.sort((x, y) => x.numeroDoc - y.numeroDoc));
      // Calcular y filtrar estado orden, abierta o cerrada
      const ordensFiltradas=(ordenesSort.filter((orden)=>{
        let matSombra=orden.materiales;
        let estadoDoc=0
        for(let i=0;i<orden.materiales.length;i++){
          let item =orden.materiales[i]
          let cantidadDespachada=0
      
          if(item.despachos.length>0){
            item.despachos.forEach((desp,index)=>{
              cantidadDespachada+=desp.qty
            })
            if(cantidadDespachada<item.qty){
              // Articulo abierto
              matSombra[i].cerrado=0
            }
            else if(cantidadDespachada==item.qty){
              // Articulo cerrado
              matSombra[i].cerrado=1
            }
            else if(cantidadDespachada>item.qty){
              // Articulo con negativo
              matSombra[i].cerrado=2
            }
          }
        }  

        // CERRADA
        // Si todos sus articulos estan despachos al 100%, 
        if(matSombra.every((articulo)=> {return articulo.cerrado==1})){
          estadoDoc =1
        }
        // ABIERTA
        // Si alguno de sus items tiene cantidad pendiente
        else if(matSombra.some((articulo)=> {return articulo.cerrado==0})){
          estadoDoc=0
        }
        // CON NEGATIVOS
        // Si alguno de sus items tiene cantidad despachada mayor a cantidad disponible
        else if(matSombra.some((articulo)=> {return articulo.cerrado==2})){
          estadoDoc=3
        }
      

        if(estadoDoc!=1){
          return orden
        }

      }))


      setInitialValueOrden(ordensFiltradas)
      setListaOrdenes(ordensFiltradas)
    },[dbOrdenes])

    // // ******************** MANEJANDO EL INPUT SEARCH ******************** //


    const [buscarDocInput, setBuscarDocInput]=useState('')

    const handleSearch=(e)=>{
      let entrada=e.target.value
      setBuscarDocInput(entrada)
      const textoMin=entrada.toLowerCase()

      setListaOrdenes(initialValueOrden.filter((orden)=>{
        if( 
          orden.numeroDoc.toLowerCase().includes(textoMin)||
          orden.proveedor.toLowerCase().includes(textoMin)||
          orden.comentarios.toLowerCase().includes(textoMin)
          
        ){
          return orden
        }}))

        if(e.target.value==''){
          setListaOrdenes(initialValueOrden)
        }

    }
  

  return (
    
  <>
    
    <CabeceraListaAll>
    <EncabezadoTabla>
      <TituloEncabezadoTabla>
        Lista de todas las ordenes de compras abiertas.
      </TituloEncabezadoTabla>
    </EncabezadoTabla>
    
    <ControlesTablasMain
      habilitar={habilitar}
      handleSearch={handleSearch}
      buscarDocInput={buscarDocInput}
    />
  </CabeceraListaAll>
  <CajaTabla>
    <Tabla >
      <thead>
        <Filas className='cabeza'>
          <CeldaHead>N°</CeldaHead>
          <CeldaHead>Numero*</CeldaHead>
          <CeldaHead>Proveedor</CeldaHead>
          <CeldaHead>Comentarios</CeldaHead>
        </Filas>
      </thead>
      <tbody>
        {
            listaOrdenes?.map((orden, index)=>{
                return(
                    <Filas 
                      key={index} 
                      className={'body '}
                      >
                        <CeldasBody>{index+1}</CeldasBody>
                        <CeldasBody>
                              <Enlaces 
                                to={`/importaciones/maestros/ordenescompra/${orden.numeroDoc}`}
                                target="_blank"
                                >
                                {orden.numeroDoc}

                              </Enlaces>
                        </CeldasBody>
                        <CeldasBody className='proveedor'>{orden.proveedor}</CeldasBody>
                        <CeldasBody>{orden.comentarios}</CeldasBody>
                    </Filas>
                )
            })
        }
      </tbody>
    </Tabla>
    </CajaTabla>

    {
          isLoading?
          <CajaLoader>
            <CSSLoader/>
          </CajaLoader>

            :
            ''
        }
    
    <Alerta
      estadoAlerta={dispatchAlerta}
      tipo={tipoAlerta}
      mensaje={mensajeAlerta}
    />

    </>
  )
}
const CabeceraListaAll=styled.div`
    background-color: ${theme.azulOscuro1Sbetav};
`


const CajaLoader=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const CajaTabla=styled.div`
    overflow-x: scroll;
    padding: 0 10px;
    /* border: 1px solid red; */
    *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        height: 8px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 

`
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
  @media screen and (max-width:650px){
    margin-bottom: 200px;
    
  }
  @media screen and (max-width:380px){
    /* overflow: scroll; */
    margin-bottom: 130px;
    
  }
  `

const Filas =styled.tr`
  &.body{
    
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${theme.azul5Osc};
  
  }
  &.descripcion{
    text-align: start;
  }

  &.filaSelected{
    background-color: ${theme.azulOscuro1Sbetav};
    border: 1px solid red;
  }
  &.cabeza{
    background-color: ${theme.azulOscuro1Sbetav};
  }
  color: ${theme.azul1};
`

const CeldaHead= styled.th`
   border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  
  
  font-size: 0.9rem;
  &.qty{
    width: 300px;
  }


`
  const CeldasBody = styled.td`
    font-size: 0.9rem;
    border: 1px solid black;
    height: 25px;
    &.clicKeable{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
   
    text-align: center;
   
  &.proveedor{
    text-align: start;
    padding-left: 5px;
  }


`
const IconoREDES =styled.p`
  cursor: pointer;

`

const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}

`

const BtnNormal=styled(BtnGeneralButton)`
&.borrada{
  background-color: red;
  color: white;
  &:hover{
    color: red;
    background-color: white;
    }
}
&.eliminadaRealizado{
  background-color: #eaa5a5;
  &:hover{
    cursor: default;
    color: white;

  }
}
  &.editaEliminada{
    background-color: #407aadb5;
    cursor: default;
    color: white;
  }
  &.buscar{
    margin: 0;
    /* height: 30px; */
  }
`
const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
  `

  
const EncabezadoTabla =styled.div`
  margin-top: 20px;
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;

  display: flex;
  justify-content: start;
  align-items: center;
`
const TituloEncabezadoTabla=styled.h2`
  color: #757575;
  font-size: 1.2rem;
  font-weight: normal;
  padding-left: 20px;
  &.subTitulo{
    font-size: 1rem;
  }
`