import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { BtnGeneralButton } from '../../components/BtnGeneralButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { NavLink, useNavigate } from 'react-router-dom'
import { TablaMultiFurgon } from './TablaMultiFurgon'

export const TablaMultiBL = ({
    tablaFurgon,
    blSelect,
    setHasBL,
}) => {

  const navegacion = useNavigate()

  const [furgonSelect, setFurgonSelect]=useState([])
  const [hasItem, setHasItem]=useState(false)
  const tablaItemRef=useRef(null)
  const [nClases, setNClases]=useState([])

  useEffect(() => {
    if(hasItem==false){
      setNClases([])
    }
  }, [hasItem])

  useEffect(() => {
    setHasItem(false)
    setNClases([])
  }, [blSelect])

  const mostrarFechas=(e)=>{
    let index=Number(e.target.dataset.id)
    console.log(blSelect)
  }
  const mostrarItem=(e)=>{
    let index=Number(e.target.dataset.id)
    setFurgonSelect(blSelect.furgones[index])
    setHasItem(true)

    let newNClases=[]
    newNClases[index]='filaSelected'
    setNClases(newNClases)
    setTimeout(() => {
      tablaItemRef.current.scrollIntoView({behavior: 'smooth'})
    }, 100);
  }


  
  return (
    <>
      <EncabezadoTabla>
      <TituloEncabezadoTabla>
        <BtnNormal 
          type='button'
          className={'borrada'}
          onClick={()=>setHasBL(false)}
          >
            <Icono icon={faXmark}/>
            Cancelar
        </BtnNormal>
        {/* <BtnNormal 
          type='button'
          className={'standar'}
          onClick={()=>setHasBL(false)}
          >
            <ImgIcono  src={imgCycleLifeFurgon} />
            Life cicle
        </BtnNormal> */}
     

        Contenedores del BL: {blSelect.numeroDoc}
        </TituloEncabezadoTabla>

       
    </EncabezadoTabla>
    <Tabla ref={tablaFurgon}>
        <thead>
            <Filas className='cabeza'>
                <CeldaHead >N°</CeldaHead>
                <CeldaHead >Contenedor*</CeldaHead>
                <CeldaHead >Tamaño</CeldaHead>
                <CeldaHead >Destino</CeldaHead>
                <CeldaHead >Status</CeldaHead>
                <CeldaHead >
                  Disponible en SAP
                
                </CeldaHead>
                <CeldaHead >Comentarios</CeldaHead>
                <CeldaHead >Materiales</CeldaHead>
            </Filas>
        </thead>
        <tbody>
            {
                blSelect.furgones?.map((furgon,index)=>{
                    return(
                        <Filas key={index} className={'body '+nClases[index]}>
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody 
                                className='clicKeable'
                                >
                                  <Enlaces 
                                to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                target="_blank"
                                >
                                {furgon.numeroDoc}

                              </Enlaces>
                                
                                </CeldasBody>
                            <CeldasBody>{furgon.tamannio}</CeldasBody>
                            <CeldasBody>{furgon.destino}</CeldasBody>
                            <CeldasBody>
                                {
                                    furgon.status==1?
                                    'Transito Maritimo'
                                    :
                                    furgon.status==2?
                                    'En Almacen'
                                    :
                                    furgon.status==3?
                                    'En dpto Importaciones'
                                    :
                                    furgon.status==4?
                                    'Materiales en SAP✅'
                                    :
                                    ''
                                    }
                            </CeldasBody>
                            <CeldasBody>
                            {
                             
                                furgon.llegadaSap?
                                furgon.llegadaSap.slice(0,10)
                                :
                                ''
                            }
                            </CeldasBody>
                            <CeldasBody>{furgon.comentarios}</CeldasBody>
                            <CeldasBody>
                              <IconoREDES
                              data-id={index}
                              onClick={(e)=>mostrarItem(e)}
                              >
                                👁️
                              </IconoREDES>
                              </CeldasBody>
                        </Filas>
                    )
                })
            }
            
        </tbody>
    </Tabla>
    {
      hasItem?
      <TablaMultiFurgon
      furgonSelect={furgonSelect}
      setHasItem={setHasItem}
      tablaItemRef={tablaItemRef}
        />
      :
      ''
    }

    </>
  )
}

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
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  height: auto;
`
const TituloEncabezadoTabla=styled.h2`
  color: ${theme.textoNoBlanco};
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
  &.standar{
    height: 25px;
  }
`

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
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