import React, { useState,useEffect } from 'react'
import { Header } from '../components/Header'
import styled from 'styled-components'
import ImagenCardTransportes from './../../public/img/buildApp.svg'
// import ImagenBuildWeb from './../../public/buildWeb.png'
import ImagenBuildWeb from './../../public/img/buildWeb.svg'
import theme from '../../theme'
import funcionConsumible from '../../consumible'
import { BotonQuery } from '../components/BotonQuery'

export const Transportes = () => {
 
  const [hijosBarra,setHijosBarra]=useState([])
  const [porcentaje,setPorcentaje]=useState('')

  useEffect(()=>{
    let newHijo=[]
    setPorcentaje(100-funcionConsumible('transporte').valorNumber)
    for(let i=0;i<porcentaje;i++){
      newHijo.push('')
    
    }
    setHijosBarra(newHijo)
  },[porcentaje])

  return (
    <>
        <Header titulo={'Sistema de gestion de transporte (TMS)'}/>
        <CajaBuild>
          <Texto>En construccion...</Texto>
          <SubTexto>Fecha estimada: 30/5/2024</SubTexto>
         
          <BarraProgres>
          <NumberPor>
            {porcentaje+'%'}
          </NumberPor>
            {
             hijosBarra.map((hijo,index)=>{
              return <HijosBarra key={index}>{}</HijosBarra>
             })
              
            }
          </BarraProgres>
          <CajaVentajas>
            <TituloLista>En este sistema de gestion de trasporte podrás:</TituloLista>
            <ListaDesordenada>
            <ElementoLista>Realizar solicitudes de transporte</ElementoLista>
              <ElementoLista>Ver en tiempo real status de tu solicitud</ElementoLista>
              <ElementoLista>El cliente podrá calificar el servicio y dejar su reseña</ElementoLista>
              <ElementoLista>Podrás calificar o dejar una reseña sobre la solicitud de transporte realizada, esto servirá para medir al chofer y tomar decisiones positivas y negativas</ElementoLista>
              <ElementoLista>Podrás consultar un histórico de todas las solicitudes, para organizarla o filtrarla por proyecto, sucursal, cliente etc</ElementoLista>
              <ElementoLista>Podrás ver en tiempo en real cuales vehículos tenemos disponibles en las diferentes localidades de la empresa y hacia donde se dirigen</ElementoLista>
              <ElementoLista>Podrás programar solicitudes de transporte</ElementoLista>
              <ElementoLista>Podrás ver cuál es la planificación del dia siguiente</ElementoLista>
              <ElementoLista>Podrás ver cuando está programado abastecer una sucursal</ElementoLista>
              <ElementoLista>Podrás incluir hacia el abastecimiento de X sucursal</ElementoLista>
              <ElementoLista>Podrás indicar nivel de prioridad de cada solicitud</ElementoLista>
              <ElementoLista>Y muchas cosas mas...</ElementoLista>

            </ListaDesordenada>
          </CajaVentajas>

          <CajaImg>
            <Img src={ImagenBuildWeb}/>
          </CajaImg>
        </CajaBuild>
    </>
  )
}

const CajaBuild=styled.div`
  
  width: 100%;
  /* height:90vh; */
  padding: 0.1px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

`
const Texto=styled.h2`
color: ${theme.azul2};
font-size:2rem;
  
`
const SubTexto=styled.h3`
  color:${theme.azul1};
`
const NumberPor=styled.h2`
    color: ${theme.success};
    font-size: 2.5rem;
    position: absolute;
    right: 45%;
`
const CajaImg=styled.div`
  width: 90%;
  height: 500px;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
  border: 4px solid ${theme.warning};
  /* border-bottom: 5px solid ${theme.warning}; */
  border-radius: 15px 0 15px 0;
  background-color: ${theme.fondoEdTeam};
  box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  /* -webkit-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75); */
  /* -moz-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75); */
`
const Img=styled.img`
  width: 50%;
  object-fit: contain;
  
  
`
const BarraProgres=styled.div`
  display: flex;
  background-color: ${theme.azulOscuro1Sbetav};
  border: 1px solid ${theme.azul2};
  width: 100%;
  height: 50px;
  justify-content: start;
`
const HijosBarra=styled.div`
  background-color: ${theme.azul2};
  width: 1%;
`

const CajaVentajas=styled.div`
/* border: 1px solid red; */
padding: 30px;
  
`
const TituloLista=styled.h2`
  color: ${theme.azul2};
  margin-bottom: 10px;
`
const ListaDesordenada=styled.ul`
  color: ${theme.azul1};
`

const ElementoLista=styled.li`
  
`