import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { NavLink, useNavigate } from 'react-router-dom'
import { CSSLoader } from '../../components/CSSLoader'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ModalLoading } from '../../components/ModalLoading'
import { Alerta } from '../../components/Alerta'
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import db from '../../firebase/firebaseConfig'
import { ControlesTablasMain } from '../components/ControlesTablasMain'
import { BotonQuery } from '../../components/BotonQuery'

export const TablaListaTodosLosFurgones = ({
  dbBillOfLading,
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [hasModal, setHasModal]=useState(true)

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

  const [habilitar,setHabilitar]=useState({
    search:true,
    status:true,
    destino:true
  })

  // // ************************** CODIGO LOADING ************************** //
  const [isLoading,setIsLoading]=useState(false)
  useEffect(()=>{
    if(dbBillOfLading.length>0){
      setIsLoading(false)
    }
    if(dbBillOfLading.length==0){
          setIsLoading(true)
        }
  },[dbBillOfLading])

    // // ************************* CONSOLIDACION ************************* //
    const [initialValueArrayFurgones,setInitialValueArrayFurgones]=useState([])
    const [arrayFurgones,setArrayFurgones]=useState([])
    const [listDestinos, setListDestinos]=useState([])

    useEffect(() => {
      let furgones = [];
      for (const bill of dbBillOfLading) {
        if(bill.estadoDoc!=2){
          for (const furgon of bill.furgones) {
            // Agregar propiedad dias restantes
            let diasLibres=bill.diasLibres;
            let annio=bill.llegadaAlPais.slice(6,10)
            let mes=bill.llegadaAlPais.slice(3,5)
            let dia=bill.llegadaAlPais.slice(0,2)

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
            

            if(furgon.status!=5){
              furgones=[
                ...furgones,
                {
                  ...furgon,
                  proveedor:bill.proveedor,
                  bl:bill.numeroDoc,
                  puerto:bill.puerto,
                  naviera:bill.naviera,
                  diasLibres:bill.diasLibres,
                  diasRestantes:diasRestantes,
                  llegadaAlPais:bill.llegadaAlPais
                }
              ]
            }
          }
        }
      }
      // Ordenar por dias restantes
      const sortFurgones=furgones.sort( (a, b)=> {
        return a.diasRestantes - b.diasRestantes;
      });

      setInitialValueArrayFurgones(sortFurgones)
      setArrayFurgones(sortFurgones)

      // Obtener listado de destinos para crear el menu desplegable
      let destinos=new Set()
      if(furgones.length>0){
        furgones.forEach((furgon)=>{
          if(destinos.has(furgon.destino)==false){
            destinos.add(furgon.destino)
          }
        })
      }
    
      setListDestinos(Array.from(destinos))
    }, [dbBillOfLading])


  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput,setBuscarDocInput]=useState('')
  const [statusDocInput,setStatusDocInput]=useState('')
  const [destinoDocInput,setDestinoDocInput]=useState('')

  const handleSearch=(e)=>{
    let shadowArray=arrayFurgones;
    let entradaMaster=e.target.value.toLowerCase()
    let entradaSlave1=''
    let entradaSlave2=''

    if(e.target.name=='inputBuscar'){
      setBuscarDocInput(entradaMaster)
      entradaSlave1=statusDocInput.toLowerCase()
      entradaSlave2=destinoDocInput.toLowerCase()
    }
    else if(e.target.name=='cicloVida'){
      setStatusDocInput(entradaMaster)
      entradaSlave1=buscarDocInput.toLowerCase()
      entradaSlave2=destinoDocInput.toLowerCase()
    }
    else if(e.target.name=='destino'){
      setDestinoDocInput(entradaMaster)
      entradaSlave1=buscarDocInput.toLowerCase()
      entradaSlave2=statusDocInput.toLowerCase()
    }

    if(e.target.name=='inputBuscar'){
      // 1er filtrado - Search siendo  Master
      shadowArray=(initialValueArrayFurgones.filter((furgon)=>{
        if(
          furgon.numeroDoc.toLowerCase().includes(entradaMaster)||
          furgon.proveedor.toLowerCase().includes(entradaMaster)||
          furgon.bl.toLowerCase().includes(entradaMaster)||
          furgon.puerto.toLowerCase().includes(entradaMaster)||
          furgon.naviera.toLowerCase().includes(entradaMaster)||
          furgon.proveedor.toLowerCase().includes(entradaMaster)
          ){
            return furgon
          }
        }))

        // 2do filtrado - Status siendo Slave1
        if(statusDocInput!=''){
          shadowArray=(shadowArray.filter((furgon)=>{
            if(furgon.status==entradaSlave1){
              return furgon
            }
          }))
        }

        // 3er filtrado - Destinos siendo Slave2
        if(destinoDocInput!=''){
          shadowArray=(shadowArray.filter((furgon)=>{
            if(furgon.destino.toLowerCase()==entradaSlave2){
              return furgon
            }
          }))
        }


      }
    else if(e.target.name=='cicloVida'){
      // 1er filtrado - Status siendo Master
      if(entradaMaster!=''){
      shadowArray=(initialValueArrayFurgones.filter((furgon)=>{
        if(furgon.status==entradaMaster){
          return furgon
        }
      }))
      }
      else if(entradaMaster==''){
        shadowArray=initialValueArrayFurgones
      }

      console.log(shadowArray)

      // 2do filtrado - Search siendo Slave1
      if(buscarDocInput!=''){
        shadowArray=(shadowArray.filter((furgon)=>{
          if(
            furgon.numeroDoc.toLowerCase().includes(entradaSlave1)||
            furgon.proveedor.toLowerCase().includes(entradaSlave1)||
            furgon.bl.toLowerCase().includes(entradaSlave1)||
            furgon.puerto.toLowerCase().includes(entradaSlave1)||
            furgon.naviera.toLowerCase().includes(entradaSlave1)||
            furgon.proveedor.toLowerCase().includes(entradaSlave1)
            ){
              return furgon
            }
          }))
      }

      // 3er filtrado - Destinos siendo Slave2
      if(destinoDocInput!=''){
        shadowArray=(shadowArray.filter((furgon)=>{
          if(furgon.destino.toLowerCase()==entradaSlave2){
            return furgon
          }
        }))
      }
      
      
    }
    
    else if(e.target.name=='destino'){
      // 1er filtrado - Destinos siendo Master
      if(entradaMaster!=''){
        shadowArray=(initialValueArrayFurgones.filter((furgon)=>{
          if(furgon.destino.toLowerCase()==entradaMaster){
            return furgon
          }
        }))
      } 
      else if(entradaMaster==''){
        shadowArray=initialValueArrayFurgones
      }
      

       // 2do filtrado - Search siendo Slave1
       if(buscarDocInput!=''){
        shadowArray=(shadowArray.filter((furgon)=>{
          if(
            furgon.numeroDoc.toLowerCase().includes(entradaSlave1)||
            furgon.proveedor.toLowerCase().includes(entradaSlave1)||
            furgon.bl.toLowerCase().includes(entradaSlave1)||
            furgon.puerto.toLowerCase().includes(entradaSlave1)||
            furgon.naviera.toLowerCase().includes(entradaSlave1)||
            furgon.proveedor.toLowerCase().includes(entradaSlave1)
            ){
              return furgon
            }
          }))
      }

       // 2do filtrado - Status siendo Slave2
       if(statusDocInput!=''){
        shadowArray=(shadowArray.filter((furgon)=>{
          if(furgon.status==entradaSlave2){
            return furgon
          }
        }))
      }


    }

    setArrayFurgones(shadowArray)

    if(entradaMaster==''&&entradaSlave1==''&&entradaSlave2==''){
      setArrayFurgones(initialValueArrayFurgones)
    }
    }
    
    return (
    <>
    {/* <BotonQuery
      buscarDocInput={buscarDocInput}
      statusDocInput={statusDocInput}
      destinoDocInput={destinoDocInput}
    /> */}
    <CabeceraListaAll>
      <EncabezadoTabla>
      <TituloEncabezadoTabla>
       
        Lista de todos los contenedores en proceso de importacion 
        {width>1000?', (antiguo Reporte de contenedores), ordenados por dias restantes (DR)':''}.
      </TituloEncabezadoTabla>
    </EncabezadoTabla>
    <ControlesTablasMain
      habilitar={habilitar}
      handleSearch={handleSearch}
      buscarDocInput={buscarDocInput}
      statusDocInput={statusDocInput}
      destinoDocInput={destinoDocInput}
      listDestinos={listDestinos}
      tipo={'contenedores'}
    />
    </CabeceraListaAll>
    <CajaTabla>
    <Tabla>
      <thead>
        <Filas className='cabeza'>
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Numero*</CeldaHead>
            <CeldaHead title='Tamaño'>T</CeldaHead>
            <CeldaHead>Proveedor</CeldaHead>
            <CeldaHead>Status</CeldaHead>
            <CeldaHead>BL*</CeldaHead>
            <CeldaHead>Naviera</CeldaHead>
            <CeldaHead>Puerto</CeldaHead>
            <CeldaHead title='Dias Libres'>DL</CeldaHead>
            <CeldaHead title='Dias Restantes'>DR</CeldaHead>
            <CeldaHead title='Fecha en que los materiales estaran disponible en SAP'>
              En SAP
              </CeldaHead>
            <CeldaHead>Destino</CeldaHead>
          </Filas>
      </thead>
      <tbody>
        {
          arrayFurgones.map((furgon,index)=>{
            return(
              <Filas 
                key={index} 
                className={`body ${furgon.diasRestantes<2?'negativo':''}`}
                >
                <CeldasBody>{index+1}</CeldasBody>
                <CeldasBody>
                  <Enlaces 
                    to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                    target="_blank"
                    >
                    {furgon.numeroDoc}
                  </Enlaces>
                </CeldasBody>
                <CeldasBody>
                  {furgon.tamannio}
                </CeldasBody>

                <CeldasBody
                  title={furgon.proveedor}
                  className='proveedor'>
                  {furgon.proveedor}
                </CeldasBody>
                <CeldasBody
                  className='status'
                >
                  {
                    furgon.status==1?
                    'Transito Maritimo'
                    :
                    furgon.status==2?
                    'En puerto'
                    :
                    furgon.status==3?
                    'Recep. almacen'
                    :
                    furgon.status==4?
                    'Dpto Import'
                    :
                    furgon.status==5?
                    'Listo en SAP✅'
                    : 
                    ''
                  }
                </CeldasBody>

                <CeldasBody>
                  <Enlaces 
                    to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                    target="_blank"
                    >
                    {furgon.bl}
                  </Enlaces>
                </CeldasBody>
                <CeldasBody
                  className='naviera'
                  title={furgon.naviera}
                  >{furgon.naviera}
                </CeldasBody>
                <CeldasBody
                  className='puerto'
                  title={furgon.puerto}
                >
                    {furgon.puerto}
                </CeldasBody>
              
                
                <CeldasBody>
                    {furgon.diasLibres}
                </CeldasBody>
                <CeldasBody>
                    {furgon.diasRestantes}
                </CeldasBody>
                <CeldasBody
                  >
                  {furgon.llegadaSap.slice(0,10)}
                </CeldasBody>
                <CeldasBody>
                    {furgon.destino}
                </CeldasBody>
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
  padding: 0 10px;
    overflow-x: scroll;
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
  &:hover{
    background-color: ${theme.azulOscuro1Sbetav};
  }

  &.negativo{
    color: ${theme.danger}
  }
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
  &.descripcion{
    max-width: 30px;
  }
  &.comentarios{
    max-width: 200px;
  }


`
  const CeldasBody = styled.td`
    font-size: 0.9rem;
    border: 1px solid black;
    height: 25px;
    padding-left: 5px;
    padding-right: 5px;

    &.clicKeable{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
      }
   
    text-align: center;
   
  &.descripcion{
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;    
    text-overflow: ellipsis;
    max-width: 200px;
  }
  &.proveedor{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 100px;
    }
 
  &.status{
    white-space: nowrap;
  }
  &.puerto{
    max-width: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;    
  }
  &.naviera{
    max-width: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;    
  }
  &.comentarios{
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;   
    text-overflow: ellipsis;

  }
 


`
const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
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
  padding-left: 20px;
  &.subTitulo{
    font-size: 1rem;
  }

`

const IconoREDES =styled.p`
  cursor: pointer;
`
