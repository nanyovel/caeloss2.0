import React, {  useEffect, useState } from 'react'
import styled from 'styled-components'
import imgSupplier from './../img/01-factory.png'
import imgOcean from './../img/02-ship.png'
import imgPort from './../img/03-PuertoEste.png'
import imgWhareHouse from './../img/warehouse.png'
import imgDptoImport from './../img/05-import-department.png'
import imgSuccess from './../img/successImport.png' 
import chechSencillo from './../img/check.png' 
import workProgress from './../img/work-in-progress.png' 
import imgOrdenEnviadaProveedor from './../img/videos/proveedor/proveedor1.png' 
import  './../components/interruptor.css'
import theme from '../../../theme'
import { NavLink, useNavigate } from 'react-router-dom'
import { ControlesTabla } from '../components/ControlesTabla'
import { BotonQuery } from '../../components/BotonQuery'
import { CSSLoader } from '../../components/CSSLoader'
import { Interruptor } from '../../components/Interruptor'
import { Alerta } from '../../components/Alerta'
import imgCiclo1 from './../img/lifeCycle.png'
import imgCiclo2 from './../img/lifeCycle2.png'
import { Seguimientos } from '../page/Seguimientos'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { doc, updateDoc } from 'firebase/firestore'
import db from '../../firebase/firebaseConfig'


export const DetalleFurgon = ({
  furgonMaster,
  setFurgonMaster,
  blMaster,
  docEncontrado,
  dbBillOfLading,
  tablaMatRef,
  setRefresh,
  refresh,
  userMaster,
  
}) => {
    // Alertas
    const [dispatchAlerta, setDispatchAlerta]=useState(false)
    const [mensajeAlerta, setMensajeAlerta]=useState('')
    const [tipoAlerta, setTipoAlerta]=useState('')

    const navegacion=useNavigate()

  const [buscarDocInput,setBuscarDocInput]=useState('')
  const handleInput =(e)=>{
    const valor=e.target.value.replace(' ','')
    let mayus=((valor).toUpperCase())
    setBuscarDocInput(mayus)

  }
  const [menuOpen,setMenuOpen]=useState(false)

  // // ******************  BUSCAR DOC ************************** //
  const buscarDoc=(e)=>{
    let validacion={
      docExiste:false,
      hasNumero:true,
    }
    if(e){
      if(e.key!='Enter'){
        return''
      }
    }

    let todosLosFurgones = dbBillOfLading.flatMap(bl => bl.furgones);
    todosLosFurgones.forEach((furgon,index)=>{
      if(furgon.numeroDoc==buscarDocInput){
        validacion.docExiste=true
        return''
      }
    })
    // Si el input esta vacio
    if(buscarDocInput==''){
      validacion.hasNumero=false
      setMensajeAlerta('Por favor indique numero de contenedor.')
      setTipoAlerta('warning')
      setDispatchAlerta(true)
      setTimeout(() => {
        setDispatchAlerta(false)
      }, 3000);
      return''
      }
     // Si el numero no existe
    if(validacion.docExiste==false){
      setMensajeAlerta('El numero ingresado no existe en la base de datos.')
      setTipoAlerta('warning')
      setDispatchAlerta(true)
      setTimeout(() => {
        setDispatchAlerta(false)
      }, 3000);
      return''
      }
   

      // Si todo esta correcto
      if(
          validacion.docExiste==true&&
          validacion.hasNumero==true
        ){
          setRefresh(!refresh)
        navegacion('/importaciones/maestros/contenedores/'+buscarDocInput)
        setBuscarDocInput('')
    }

    
  }
  // Para obtener el estado del documento; Abierto, Cerrado, Eliminado
    const [estadoDoc, setEstadoDoc]=useState('epty')

    useEffect(()=>{
      // Calcular estado del documento Abierto o Cerrado

      if(blMaster.furgones?.length>0){
        if(blMaster.furgones.every(furgon=>furgon.status<5)==true){
          setEstadoDoc(0)
        }
        else if(blMaster.furgones.every(furgon=>furgon.status>=5)==true){
          setEstadoDoc(1)
        }
        if(blMaster.estadoDoc==2){
          setEstadoDoc(2)
        }
      }
    },[blMaster])



    // ********** ACTIVAR SEGUIMIENTO ************
    const [isFollowing, setIsFollowing]=useState(false)
    useEffect(()=>{
      furgonMaster?.seguimientos?.forEach((segui)=>{
        if(segui.idUser==userMaster.id){
          setIsFollowing(segui.activo)
        }
      })
    },[userMaster,furgonMaster])

    const handleChange = async(e) => {
      let furgonUpdate={...furgonMaster}
      console.log(furgonUpdate)
    const checK=e.target.checked

    let yaExistia=false
    // Si ese seguimiento ya existia
    if(furgonMaster?.seguimientos?.length>0){
      const seguiParsed=furgonMaster.seguimientos.map((segui,index)=>{
        if(segui.idUser==userMaster.id){
          yaExistia=true
          return{
            ...segui,
            activo:checK
          }
        }
        else{
          return segui
        }
      })

      furgonUpdate={
        ...furgonUpdate,
        seguimientos:seguiParsed
      }
    }
    // Si ese seguimiento no existia
    if(yaExistia==false){
      
      // Si este furgon tiene seguimientos pero este en especifico no lo tenia
      
      // Si este furgon no tiene ningun seguimiento 
      let seguimiento=furgonUpdate.seguimientos?furgonUpdate.seguimientos:[]
      seguimiento.push(
        {
          activo:checK,
          idUser:userMaster.id,
          userName:userMaster.userName,
          nota:'',
          fecha:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        }
      )


        furgonUpdate={
          ...furgonUpdate,
          seguimientos:seguimiento     
        }
    }

    const furgonesUpdate=blMaster.furgones.map((furgon,index)=>{
      if(furgon.numeroDoc==furgonMaster.numeroDoc){
        return furgonUpdate
      }
      else{
        return furgon
      }
    })

    const blEditableUp={
      ...blMaster,
      furgones:furgonesUpdate
    }

      const blActualizar = doc(db, "billOfLading", blMaster.id);
      
      try{
        await updateDoc(blActualizar, blEditableUp)
      }catch(error){
        console.error(error)
        setMensajeAlerta('Error con la base de datos.')
        setTipoAlerta('error')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);
      }
  



    };

  return (
    <>
           <CajaMenuHamburg >
            <Img 
              className={menuOpen==false?'rayas':''}
              onClick={()=>setMenuOpen(!menuOpen)}
              src={menuOpen?imgCiclo1:imgCiclo2} 
              />
          </CajaMenuHamburg>
    <CajaEncabezado 
       >

      <CajaDetalles>
      <CajitaDetalle>
          <TituloDetalle>N° Contenedor:</TituloDetalle>
          <DetalleTexto>{furgonMaster.numeroDoc}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Tamaño:</TituloDetalle>
          <DetalleTexto>{furgonMaster.tamannio?furgonMaster.tamannio+" pies":""}</DetalleTexto>
        </CajitaDetalle>

        <CajitaDetalle>
          <TituloDetalle>Proveedor:</TituloDetalle>
          <DetalleTexto title={blMaster.proveedor}>{blMaster.proveedor}</DetalleTexto>
        </CajitaDetalle>

       

        <CajitaDetalle>
          <TituloDetalle>Bill of Lading (BL):</TituloDetalle>
          <DetalleTexto>
          <Enlaces 
              to={`/importaciones/maestros/billoflading/${blMaster.numeroDoc}`}
              target="_blank"
              >
              {blMaster.numeroDoc}
            </Enlaces>
          </DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Naviera:</TituloDetalle>
          <DetalleTexto title={blMaster.naviera}>{blMaster.naviera}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Puerto:</TituloDetalle>
          <DetalleTexto>{blMaster.puerto}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Dias Libres:</TituloDetalle>
          <DetalleTexto>{blMaster.diasLibres}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
        <TituloDetalle
                  className={
                    `${furgonMaster.diasRestantes<2?
                    'negativo'
                    :
                    ''}
                    ${
                      estadoDoc==1?
                      'docCerrado'
                      :
                      ''
                    }
                    `
                  }
                >Dias Restantes:</TituloDetalle>
          <DetalleTexto
            className={
              `${furgonMaster.diasRestantes<2?
              'negativo'
              :
              ''}
              ${
                estadoDoc==1?
                'docCerrado'
                :
                ''
              }
            `}
          >
              {
                estadoDoc==1||estadoDoc==2?
                  'N/A'
                  :
                  furgonMaster.diasRestantes
                  }
            </DetalleTexto>
        </CajitaDetalle>
       
       
    

        <CajitaDetalle>
          <TituloDetalle>Destino:</TituloDetalle>
          <DetalleTexto>{furgonMaster.destino}</DetalleTexto>
        </CajitaDetalle>
        
      
       

      </CajaDetalles>
      <CajaDetalles className='cajaStatus'>
     
        
          <CajaFondoLisaStatus></CajaFondoLisaStatus>
          <TextoStatus>
          {
              furgonMaster.status==1?
              'Transito Maritimo'
              :
              furgonMaster.status==2?
              'En puerto'
              :
              furgonMaster.status==3?
              'En almacen'
              :
              furgonMaster.status==4?
              'Dpto de Importaciones'
              :
              furgonMaster.status==5?
              'Mercancia en SAP'
              :
              ''
            }

          </TextoStatus>

       
        {
           furgonMaster.status==1?
           <TextoFalacia  >Tu producto está en camino hacia Rep. Dom.</TextoFalacia>
           :
           furgonMaster.status==2?
           <TextoFalacia  >Tu producto llego al país y se encuentra en los procesos portuarios.</TextoFalacia>
           :
           furgonMaster.status==3?
           <TextoFalacia  >Tu producto llegó a nuestros almacenes y se encuentra en el proceso de recepción.</TextoFalacia>
           :
           furgonMaster.status==4?
           <TextoFalacia >El proceso de recepción de almacén culminó y la documentación fue enviada al departamento de importaciones. </TextoFalacia>
           :
           furgonMaster.status==5?
           <TextoFalacia >El ciclo de vida termino correctamente y tu producto se encuentra registrado en nuestro ERP (SAP).</TextoFalacia>
:
          ''
        } 
       
      </CajaDetalles>
    </CajaEncabezado>
    <ControlesTabla
    tipo={'detalleFurgon'}
    isEditando={false}
    buscarDoc={buscarDoc}
    handleInput={handleInput}
    buscarDocInput={buscarDocInput}

      docMaster={blMaster}
    />

{
  docEncontrado==false&&
  location.pathname!='/importaciones/maestros/contenedores/'&&
  location.pathname!='/importaciones/maestros/contenedores'
   ?
   <CajaLoader>

      <CSSLoader/>
   </CajaLoader>

   :
    <>
    {/* <BotonQuery
      furgonMaster={furgonMaster}
      isFollowing={isFollowing}
    /> */}
    <CajaTabla>
    <Tabla ref={tablaMatRef} className='ultima'>
      <thead>
        <Filas className='cabeza'>
          <CeldaHead>N°</CeldaHead>
          <CeldaHead>Codigo*</CeldaHead>
          <CeldaHead >Descripcion</CeldaHead>
          <CeldaHead>Qty</CeldaHead>
          <CeldaHead >Comentarios</CeldaHead>
          <CeldaHead>Orden Compra*</CeldaHead>
        </Filas>
      </thead>
      <tbody>
        {
          furgonMaster?.materiales?.map((item,index)=>{
            return(
            <Filas key={index} className='body'>
              <CeldasBody>{index+1}</CeldasBody>
              <CeldasBody>
                <Enlaces 
                  to={`/importaciones/maestros/articulos/${item.codigo}`}
                  target="_blank"
                  >
                  {item.codigo}
                </Enlaces>
                </CeldasBody>
              <CeldasBody className='descripcion'>{item.descripcion}</CeldasBody>
              <CeldasBody>{item.qty}</CeldasBody>
              <CeldasBody>{item.comentarios}</CeldasBody>
              <CeldasBody>
                <Enlaces 
                  to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
                  target="_blank"
                  >
                  {item.ordenCompra}
                </Enlaces>
                </CeldasBody>
            </Filas>
            )
          })
        }
      
      </tbody>
    </Tabla>
    </CajaTabla>
    <CajaEspacio>

    </CajaEspacio>
    </>
}
    
    <SliderStatus className={menuOpen?'abierto':''}>
      <CajaTituloYSeguimiento>
        <CajaEncabezadoStatus>
            <TituloStatus>Ciclo de vida</TituloStatus>
          </CajaEncabezadoStatus>
       <Interruptor 
        texto={'Seguimiento'}
        handleChange={handleChange}
        isFollowing={isFollowing}
        setIsFollowing={setIsFollowing}
        />
        </CajaTituloYSeguimiento>
      <CajaPoints>

        <CajitaImg>
          <CajaCotejo>
            <ImgCheck 
              src={furgonMaster.status==0?workProgress: chechSencillo} 
              className={furgonMaster.status>0?'':'incompleta'}
              />
          </CajaCotejo>
          <CajaDirectaImg>
            <ImagenStatus src={imgSupplier} className={furgonMaster.status>0?'':'incompleta'}/>
          </CajaDirectaImg>
          <CajaTexto>
            <TituloImgStatus>Proveedor -</TituloImgStatus>
            <TextoImgStatus>Cielos Acusticos le envió la orden de compra al proveedor.</TextoImgStatus>
          </CajaTexto>
        </CajitaImg>

        <CajitaImg>
          <CajaCotejo>
            <ImgCheck 
              src={furgonMaster.status==1?workProgress: chechSencillo} 
              className={furgonMaster.status>0?'':'incompleta'}
              />
          </CajaCotejo>
          <CajaDirectaImg>
            <ImagenStatus src={imgOcean} className={furgonMaster.status>0?'':'incompleta'}/>
          </CajaDirectaImg>
          <CajaTexto>
            <TituloImgStatus>Transito Maritimo </TituloImgStatus>
            <TextoImgStatus>El proveedor cargó la mercancia en el contenedor y el barco zarpó hacia Rep. Dom.</TextoImgStatus>
          </CajaTexto>
        </CajitaImg>

        <CajitaImg>
          <CajaCotejo>
            <ImgCheck 
              src={furgonMaster.status==2?workProgress: chechSencillo} 
              className={furgonMaster.status>1?'':'incompleta'}
              />
          </CajaCotejo>
          <CajaDirectaImg>
            <ImagenStatus src={imgPort}  className={furgonMaster.status>1?'':'incompleta'}/>
          </CajaDirectaImg>
          <CajaTexto>
            <TituloImgStatus>
              <p>
              En puerto

              </p>
              <p>
              {
                
                blMaster.llegadaAlPais?
                blMaster.llegadaAlPais.slice(0,10)
                :
                'S/E'
                }

              </p>
              </TituloImgStatus>
            <TextoImgStatus>La mercancia llego al pais.</TextoImgStatus>
          </CajaTexto>
        </CajitaImg>

        <CajitaImg>
        <CajaCotejo>
            <ImgCheck 
              src={furgonMaster.status==3?workProgress: chechSencillo} 
              className={furgonMaster.status>2?'':'incompleta'}
              />
          </CajaCotejo>
          <CajaDirectaImg>
            <ImagenStatus  src={imgWhareHouse} className={furgonMaster.status>2?'':'incompleta'} />
          </CajaDirectaImg>
          <CajaTexto>
            <TituloImgStatus>
              <p>
                Recepcion Almacen
              </p>
              <p>
              {
                furgonMaster.llegadaAlmacen?
                furgonMaster.llegadaAlmacen.slice(0,10)
                :
                'S/E'
              }
              </p>
              </TituloImgStatus>
            <TextoImgStatus>La mercancia llegó a nuestros almacenes donde empieza el proceso de recepcion.</TextoImgStatus>
          </CajaTexto>
        </CajitaImg>

        <CajitaImg>
        <CajaCotejo>
            <ImgCheck 
              src={furgonMaster.status==4?workProgress: chechSencillo} 
              className={furgonMaster.status>3?'':'incompleta'}
              />
          </CajaCotejo>
          <CajaDirectaImg>
            <ImagenStatus src={imgDptoImport} className={furgonMaster.status>3?'':'incompleta'}/>
          </CajaDirectaImg>
          <CajaTexto>
            <TituloImgStatus>
              <p>
                Departamento de importacion
              </p>
              <p>
              {
                furgonMaster.llegadaDptoImport?
                furgonMaster.llegadaDptoImport.slice(0,10)
                :
                'S/E'
              }
              </p>
            </TituloImgStatus>
            <TextoImgStatus>Almacen recibió correctamente y envio la documentacion al dpto. de importaciones.</TextoImgStatus>
          </CajaTexto>
        </CajitaImg>
        <CajitaImg>
        <CajaCotejo>
            <ImgCheck 
              src={chechSencillo} 
              className={furgonMaster.status>4?'':'incompleta'}
              />
          </CajaCotejo>
          <CajaDirectaImg>
            <ImagenStatus src={imgSuccess} className={furgonMaster.status>4?'':'incompleta'}/>
          </CajaDirectaImg>
          <CajaTexto>
            <TituloImgStatus>
              <p>
                Completado
              </p>
              <p>
              {
                furgonMaster.llegadaSap?
                furgonMaster.llegadaSap.slice(0,10)
                :
                'S/E'
              }
              </p>
            </TituloImgStatus>
            <TextoImgStatus>Fin del ciclo, la mercancia esta registrada en SAP.</TextoImgStatus>
          </CajaTexto>
        </CajitaImg>
        </CajaPoints>
    </SliderStatus>
    <Alerta
    estadoAlerta={dispatchAlerta}
    tipo={tipoAlerta}
    mensaje={mensajeAlerta}
  />
    </>
  )
}

const CajaEspacio=styled.div`
  width: 100px;
  height: 1px;
`

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 90%;
  margin: auto;
  /* margin-left: 15px; */
  margin-bottom: 25px;
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

const CajaEncabezado = styled.div`
  width: 100%;
  /* min-height:40px; */
  display: flex;
  justify-content: start;
  margin: 10px 0;
  color: ${theme.azul1};
  &.negativo{
    color: ${theme.danger};
  }

  @media screen and (max-width:780px) {
    flex-direction    : column;
    /* align-items:center; */
  }
`

const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  border:2px solid  #535353;
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;
  margin-bottom: 5px;
  @media screen and (max-width:780px) {
    width: 85%;
  }
  @media screen and (max-width:550px) {
    width: 90%;
  }

  &.cajaStatus{
    flex-direction: column;
    /* border: 1px solid red; */
    background-color: ${theme.azulOscuro1Sbetav2};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width:650px){
    width: 90%;
    margin-bottom: 5px;
    
  }

`
const CajaAcciones =styled(CajaDetalles)`
  padding: 5px 10px;
  overflow: hidden;

`

const CajitaDetalle=styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.azul1};
  display: flex;
  justify-content: space-around;
 
`


const TextoMasterStatus=styled.h2`
  color: ${theme.danger};
  text-decoration: underline;
  font-size: 18px;
  &.sap{
    color: white;
    padding: 5px;
    border-radius: 5px;
    color: ${theme.success};
  }

`
const TextoFalacia=styled.p`

  &.img{
    display: none;
  }
  &.puerto{

    color: white;
    background-color: #565656bc;
  }
  &.almacen{
    color:${theme.azulClaro1Svetav};
  }
  &.importaciones{
    color:${theme.azulClaro1Svetav};
  }
  &.sap{
    color:${theme.azulClaro1Svetav};
  }
`

const TituloDetalle=styled.p`
  width: 49%;
  color: inherit;
  &.negativo{
    color: ${theme.danger};
  }
  &.docCerrado{
    color: inherit;
  }

`
const DetalleTexto= styled.p`
  text-align: end;
  width: 49%;
  white-space: nowrap;
  overflow: hidden;  
  text-overflow: ellipsis;
  color: inherit;
  &.negativo{
    color: ${theme.danger};
  }
  &.docCerrado{
    color: inherit;
  }

`


const SliderStatus=styled.div`
  position: absolute;
  z-index: 2;
  top: 110px;
  right: 5px;
  transform: translate(88%,0);
  width: 400px;
  border: 1px solid ${theme.azulOscuro1Sbetav};
  border-radius: 5px;
  padding: 4px;
  background-color: ${theme.azulOscuro1Sbetav};
  transition: transform ease 0.4s;
  &:hover{
    right: 0;
    transform: translate(0,0);
  }

  @media screen and (max-width:550px){
    width: 98%;
    right: 15px;
    transform: translate(100%,0);
    &.abierto{
      right: 0;
      transform: translate(0,0);
    }
  }

  

  

`
const CajaEncabezadoStatus=styled.div`
  min-height: 25px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`
const TituloStatus = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  border-bottom: 1px solid white;
  @media screen and (max-width:450px){
    font-size: 1rem;
  }
`

const CajaPoints=styled.div`
flex-direction: column;
 display: flex;
justify-content: center;
align-items: center;
gap: 8px;
`
const ImagenStatus = styled.img`
  width: 100%;
  &.enProceso{
    border-radius: 4px;
  }
  &.incompleta{
    filter: grayscale(1)
  }
`

const CajitaImg=styled.div`
  display: flex;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  background-color: ${theme.azulOscuro1Sbetav3};
`
const CajaCotejo=styled.div`
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ImgCheck=styled.img`
  width: 100%;
   &.incompleta{
    filter: grayscale(1)
  } 

`

const CajaDirectaImg =styled.div`
  width: 15%;
`
const CajaTexto=styled.div`
  padding-left: 5px;
  width: 85%;
`
const TituloImgStatus=styled.h2`
  font-size: 1rem;
  color: ${theme.azul2};
  border-bottom: 1px solid ${theme.azul1};
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width:450px){
    font-size: 14px;
  }
`

const TextoImgStatus= styled.p`
  color: ${theme.azul1};
  font-size: 14px;
  @media screen and (max-width:450px){
    font-size: 12px;
  }
`
const CajaTituloYSeguimiento =styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

`
const CajaFondoLisaStatus=styled.div`
  background-color: ${theme.azul1};
`

const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}

`

const CajaLoader=styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`



const CajaTabla=styled.div`
    overflow-x: scroll;
    width: 100%;
    padding: 0 20px;
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


          margin-bottom: 120px;

    @media screen and (max-width:740px) {
      padding: 0 5px;

      display: flex;
      justify-content: start;
      width: 95%;
      
    }



`

const CajaMenuHamburg=styled.div`
  /* background-color: white; */
  display: none;
  width: 50px;
  height: 50px;
  position: fixed;
  right: 70px;
  bottom: 20px;
  justify-content: center;
  align-items: center;
  z-index: 3;
  @media screen and (max-width:550px){
    display: flex;
  }
`
const Img=styled.img`
  height:80px ;
  &.rayas{
    /* height: 45px; */
  }
`

const TextoStatus=styled.h3`
    font-size: 2rem;
    &.sinDocumento{
      color: red;
    }
    &.success{
      color: ${theme.success};
    }
    &.block{
      color: #524a4a;
    }
    &.del{
      color: #8c3d3d;
    }
`