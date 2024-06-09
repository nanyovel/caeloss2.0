import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { BtnGeneralButton } from '../../components/BtnGeneralButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { NavLink, useNavigate } from 'react-router-dom'
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import db from '../../firebase/firebaseConfig'


export const TablaMultiDespachos = (
  {
    despachoSelect,
    tablaDespachos,
    setHasDespachos,
    setNClases,
  }
) => {
  const [dbBillOfLading, setdbBillOfLading]=useState([])

  useEffect(() => {
    onSnapshot(
      collection(db, 'billOfLading'),
      (snapShot)=>{
        console.log('Se ejecuto snapshop')
        const areglobl = snapShot.docs.map((documento)=>{
          return{...documento.data(), id:documento.id}
        })
        setdbBillOfLading(areglobl)
      },
      (error)=>{
        console.log(error)
      }
    )
}, [])

console.log(despachoSelect)

let newDespacho=despachoSelect
dbBillOfLading.map((bl,indexBL)=>{
 bl.furgones.map((furgon,indexFurgon)=>{
  despachoSelect.map((desp,indexDesp)=>{
    if(desp.furgon==furgon.numeroDoc){
      newDespacho[indexDesp].status=furgon.status
    }
  }) 
 })
})
despachoSelect=newDespacho

const cancelar=()=>{
  setNClases([])
  setHasDespachos(false)
}

  return (
    <>
    <EncabezadoTabla>
      <TituloEncabezadoTabla>
        <BtnNormal 
          type='button'
          className={'borrada'}
          onClick={()=>cancelar()}
          >
            <Icono icon={faXmark}/>
            Cancelar
          </BtnNormal>
        
        {`Entregas del ítem ${despachoSelect[0].codigo} ${despachoSelect[0].descripcion}`}
      </TituloEncabezadoTabla>
    </EncabezadoTabla>
    
    <CajaTabla>
    <Tabla ref={tablaDespachos}>
        <thead>
            <Filas className='cabeza'>
                <CeldaHead >N°</CeldaHead>
                <CeldaHead >Codigo*</CeldaHead>
                <CeldaHead >Descripcion</CeldaHead>
                <CeldaHead >Qty</CeldaHead>
                <CeldaHead >Contenedor*</CeldaHead>
                <CeldaHead >Status</CeldaHead>
            </Filas>
        </thead>
        <tbody>
          {
            despachoSelect.map((desp,index)=>{
              return(
                <Filas key={index} className='body'>
                  <CeldasBody>{index+1}</CeldasBody>
                  <CeldasBody
                  >
                    <Enlaces 
                      to={`/importaciones/maestros/articulos/${desp.codigo}`}
                      target="_blank"
                      >
                      {desp.codigo}
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody className='descripcion'>{desp.descripcion}</CeldasBody>
                  <CeldasBody>{desp.qty}</CeldasBody>
                  <CeldasBody 
                    >
                      <Enlaces 
                      to={`/importaciones/maestros/contenedores/${desp.furgon}`}
                      target="_blank"
                      >
                      {desp.furgon}
                    </Enlaces>

                  </CeldasBody>
                  <CeldasBody>
                    {
                      desp.status==1?
                      'Transito Maritimo'
                      :
                      desp.status==2?
                      'En Almacen'
                      :
                      desp.status==3?
                      'En dpto Importacion'
                      :
                      desp.status==4?
                      'Material en SAP'
                      :
                      ''
                    }
                  </CeldasBody>
                </Filas>
              )
            })
          }
        </tbody>
    </Tabla>
    </CajaTabla>
    </>
  )
}

const CajaTabla=styled.div`
    overflow-x: scroll;
    width: 100%;
    padding: 0 10px;
    /* border: 1px solid red; */
    *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        height: 3px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
     
       
        margin-bottom: 45px;
`



const Tabla = styled.table`

  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border-radius: 5px;
  width: 95%;
  margin: auto;
  margin-bottom: 30px;
  /* background-color: ${theme.azulOscuro1Sbetav3}; */
  border: 1px solid #000;
  `

  
const CeldaHead= styled.th`
padding: 3px 8px;
text-align: center;
font-size: 0.9rem;
border: 1px solid black;

&:nth-child(2) {
 width: 50px;
}
&:nth-child(3) {
 width: 250px;
}
&:nth-child(4) {
 width: 60px;
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

const CeldasBody = styled.td`
border: 1px solid black;
font-size: 0.9rem;
height: 25px;

text-align: center;
&.romo{
 cursor: pointer;
 &:hover{
}}
&.descripcion{
 text-align: start;
 padding-left: 5px;
}
&.clicKeable{
 cursor: pointer;
 &:hover{
      text-decoration: underline;
  }
}

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
const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}

`