import React, { useEffect, useRef, useState } from 'react'
import {  NavLink, useLocation, useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import styled from 'styled-components'
import theme from '../../../theme'
import CajaNavegacion from '../components/CajaNavegacion'
import { DetalleFurgon } from '../Moldes/DetalleFurgon'
import { Alerta } from '../../components/Alerta'
import { BotonQuery } from '../../components/BotonQuery'

export const ListaFurgon = ({dbBillOfLading, dbUsuario,userMaster}) => {
  // // ******************** RECURSOS GENERALES ******************** //
    // Alertas
    const [dispatchAlerta, setDispatchAlerta]=useState(false)
    const [mensajeAlerta, setMensajeAlerta]=useState('')
    const [tipoAlerta, setTipoAlerta]=useState('')

    // Variables varias necesarias
    let location = useLocation();
    const parametro= useParams()
    let docUser = parametro.id

    const [numeroDocNoExiste, setNumeroDocNoExiste]=useState(false)

    

  // // ******************** SELECIONANDO DOCUMENTO DESEADO ******************** //
  const tablaMatRef=useRef(null)

  const [blMaster, setBLMaster]=useState({})

  const initilValueFurgon={none:true,materiales:[],}
  const [furgonMaster, setFurgonMaster]=useState({})
  const [docEncontrado, setDocEncontrado]=useState(0)

  const [refresh, setRefresh]=useState(false)

  const [arrayFurgones, setArrayFurgones]=useState([])
  const [arrayBLs, setArrayBLs]=useState([])
  useEffect(()=>{
    setArrayFurgones([])

    function extraerDoc(baseDatos, docUser){
      let newFurgones=[]
      let newBLs=[]
      let blSelect={}
      let furgonSelect={}

      let encontrado=false
      baseDatos.forEach((bl,index)=>{
        if(bl.estadoDoc!==2){
        // Agregando propiedades
        // Agregar propiedad dias restantes
        let diasLibres=bl.diasLibres;
        let annio=bl.llegadaAlPais.slice(6,10)
        let mes=bl.llegadaAlPais.slice(3,5)
        let dia=bl.llegadaAlPais.slice(0,2)

        let fechaActual= new Date()

        let llegadaAlPaisPlana=
        new Date(
          Number(annio),
          Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
          Number(dia),
        )

        let diasLibresEnMiliSegundos = diasLibres * 24 * 60 * 60 * 1000;
        let diferenciaMilisegundos = llegadaAlPaisPlana - fechaActual + diasLibresEnMiliSegundos;
        let diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
        
          
        bl.furgones.forEach((furgon)=>{
          if(furgon.numeroDoc==docUser){
            encontrado=true
            blSelect=bl
            furgonSelect={
              ...furgon,
              diasLibres:bl.diasLibres,
              diasRestantes:diasRestantes
            }

            // Codigo para cuando el furgon ha venido varias veces
            newBLs=[
              ...newBLs,
              bl
            ]
            newFurgones=[
              ...newFurgones,
              {
                ...furgon,
                blPadre:bl.numeroDoc,
                naviera:bl.naviera,
                proveedor:bl.proveedor,
                diasLibres:bl.diasLibres,
                diasRestantes:diasRestantes
              }
            ]
          }
        })
      }

      if(encontrado==true){
        setDocEncontrado(1)
      }
      else if(encontrado==false){
        setDocEncontrado(2)
      }
      
      }) 
      if(newFurgones.length>1){
        setArrayBLs(newBLs)
        setArrayFurgones(newFurgones)
      }
      else{
        setNClases([])
        setBLMaster(blSelect)
        setFurgonMaster(furgonSelect)
      }
    }
    if(
      location.pathname=='/importaciones/maestros/contenedores/'||
      location.pathname=='/importaciones/maestros/contenedores')
    {
      setBLMaster(initilValueFurgon)
    }
    else{
      extraerDoc(dbBillOfLading, docUser)
    }


  }, [dbBillOfLading,refresh])

  useEffect(()=>{
    if(docEncontrado==2){
      setMensajeAlerta('Contenedor no encontrado.')
      setTipoAlerta('warning')
      setDispatchAlerta(true)
      setTimeout(() => {
        setDispatchAlerta(false)
      }, 3000);
    }
},[docEncontrado])



  const [nClases,setNClases]=useState([])

  const selecionarFurgon=(e)=>{
    let index=Number(e.target.dataset.id)
    let newNClases=[]
    newNClases[index]='filaSelected'
    setNClases(newNClases)
    setRefresh(!refresh)
    setBLMaster({...arrayBLs[index]})
    setFurgonMaster(arrayFurgones[index])
    setTimeout(() => {
      tablaMatRef.current.scrollIntoView({behavior: 'smooth'})
    }, 100);
  }



  return(
    <>
     
      <Contenedor>
        <Header titulo='Sistema gestion de importaciones' subTitulo='Status de contenedor'/>
        <CajaNavegacion 
          dbUsuario={dbUsuario}
          userMaster={userMaster}
          />

        {
          arrayFurgones.length>1?
          <>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
          
          Existen varias importaciones de este contenedor, a continuacion una lista de las mismas. Por favor selecione la importacion deseada.
          </TituloEncabezadoTabla>
        </EncabezadoTabla>
         {/* <BotonQuery
          arrayFurgones={arrayFurgones}
        />  */}
    

        <Tabla >
      <thead>
        <Filas className='cabeza'>
          <CeldaHead>N°</CeldaHead>
          <CeldaHead>Contenedor</CeldaHead>
          <CeldaHead >Tamaño</CeldaHead>
          <CeldaHead >BL*</CeldaHead>
          <CeldaHead >Proveedor</CeldaHead>
          <CeldaHead>Destino</CeldaHead>
          <CeldaHead>Status</CeldaHead>
          <CeldaHead>LLegada almacen</CeldaHead>
          <CeldaHead>Detalles</CeldaHead>
        </Filas>
      </thead>
      <tbody>
        {
          arrayFurgones.length>0&&
          arrayFurgones.map((furgon,index)=>{
            return(
              <Filas key={index} className={nClases[index]}>
                <CeldasBody>{index+1}</CeldasBody>
                <CeldasBody>{furgon.numeroDoc}</CeldasBody>
                <CeldasBody>{furgon.tamannio}</CeldasBody>
                <CeldasBody 
                    className='clicKeable'
                    data-id={index}
                    >
                      <Enlaces 
                        to={`/importaciones/maestros/billoflading/${furgon.blPadre}`}
                        target="_blank"
                        >
                        {
                          furgon.blPadre
                          }
                      </Enlaces>
                </CeldasBody>
                <CeldasBody>{furgon.proveedor}</CeldasBody>
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
                    furgon.llegadaAlmacen.slice(0,10)
                  }
                  </CeldasBody>
                <CeldasBody>
                  <IconoREDES
                    data-id={index}
                    onClick={(e)=>selecionarFurgon(e)}
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
   </>
    :
    ''
      }
        <DetalleFurgon
        // usuario
          userMaster={userMaster}
        // Datos BL
          blMaster={blMaster}
          setBLMaster={setBLMaster}
          dbBillOfLading={dbBillOfLading}
          docEncontrado={docEncontrado}
          numeroDocNoExiste={numeroDocNoExiste}

        // Datos furgon
        furgonMaster={furgonMaster}
        setFurgonMaster={setFurgonMaster}
        arrayFurgones={arrayFurgones}
        tablaMatRef={tablaMatRef}
        refresh={refresh}
        setRefresh={setRefresh}
        />
         
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
  height: 97%;
  padding: 1px;
`


const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 92%;
  margin-left: 5px;
  /* margin: auto; */
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
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty{
    width: 300px;
  }

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
  /* margin-bottom: 5px; */
  padding-bottom: 10px;
`
const TituloEncabezadoTabla=styled.h2`
  color: #757575;
  color: ${theme.warning};
  font-size: 1.2rem;
  font-weight: normal;
  width: 90%;

`

const IconoREDES =styled.p`
  cursor: pointer;

`
const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
padding: 5px;
&:hover{
  text-decoration: underline;
}

`