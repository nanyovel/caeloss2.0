import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { NavLink } from 'react-router-dom'
import { CSSLoader } from '../../components/CSSLoader'
import { Alerta } from '../../components/Alerta'
import { ControlesTablasMain } from '../components/ControlesTablasMain'
import { BotonQuery } from '../../components/BotonQuery'
import FuncionStatus from '../components/FuncionStatus'
import { ModalLoading } from '../../components/ModalLoading'

export const TablaCiclo06ListoSAP = ({
    dbBillOfLading
}) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta]=useState(false)
  const [mensajeAlerta, setMensajeAlerta]=useState('')
  const [tipoAlerta, setTipoAlerta]=useState('')

  const [habilitar,setHabilitar]=useState({
    search:true,
    // status:true,
    opcionesUnicas:true
  })

  const [isLoading,setIsLoading]=useState(false)
  useEffect(()=>{
    if(dbBillOfLading.length>0){
      setIsLoading(false)
    }
    if(dbBillOfLading.length==0){
          setIsLoading(true)
        }
  },[dbBillOfLading])

  // // ******************** CONSOLIDACION ******************** //
    // Furgones en status dptoImport (CONSUMIBLE)
    const [initialValueFurgones,setInitialValueFurgones]=useState([])
    const [listaFurgonesMaster,setListaFurgonesMaster]=useState([])

    // Lista de material en status dptoImport
    const [initialValueMat,setInitialValueMat]=useState([])
    const [listaMat,setListaMat]=useState([])

  useEffect(()=>{
    // ***** CONTENEDORES *****
    let furgones = [];
    for (const bill of dbBillOfLading) {
      if(bill.estadoDoc!=2){
        for (const furgon of bill.furgones) {

          if(furgon.status==5){
            furgones=[
              ...furgones,
              {
                ...furgon,
                proveedor:bill.proveedor,
                bl:bill.numeroDoc,
                puerto:bill.puerto,
                naviera:bill.naviera,
              }
            ]
          }
        }
      }
    }

    // Dame solamente los que digan fecha de llegada sap confirmada
    const furgonesConfirmada=furgones.filter((furgon)=>{
      if(furgon.llegadaSap.includes('confirmada')){
        return furgon
      }
    })

    // Ahora dame solo los furgones con 30 dias o menos de ingreso a SAP
    const furgon30=furgonesConfirmada.filter((furgon)=>{
      let fechaActual= new Date()

      let annio=furgon.llegadaSap.slice(6,10)
      let mes=furgon.llegadaSap.slice(3,5)
      let dia=furgon.llegadaSap.slice(0,2)

      let llegadaSapES6=
      new Date(
        Number(annio),
        Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
        Number(dia),
      )

      const fechaHace30Dias = new Date();
      fechaHace30Dias.setDate(fechaActual.getDate() - 30);

       // Compara las dos fechas
       if (llegadaSapES6 <= fechaActual && llegadaSapES6 >= fechaHace30Dias){
        return furgon
      }
    })


    setInitialValueFurgones(furgon30)
    setListaFurgonesMaster(furgon30)

    // ***** MATERIALES *****
    let materialesBL = [];
      for (const bill of dbBillOfLading) {
        if(bill.estadoDoc!=2){
          for (const furgon of bill.furgones) {
            if(furgon.status==5){
              for (const material of furgon.materiales) {
                materialesBL=[
                  ...materialesBL,
                  {
                    ...material,
                    furgon:furgon.numeroDoc,
                    proveedor:bill.proveedor ,
                    llegadaSap:furgon.llegadaSap,
                    blPadre:bill.numeroDoc

                  }
                ]
              }
            }
          }
        }
      }

    // Dame solamente los que digan fecha de llegada sap confirmada
    const itemConfirmada=materialesBL.filter((item)=>{
      if(item.llegadaSap.includes('confirmada')){
        return item
      }
    })

    // Ahora dame solo los materiales con 30 dias o menos de llegada a SAP
    const item30=itemConfirmada.filter((item)=>{
      let fechaActual= new Date()

      let annio=item.llegadaSap.slice(6,10)
      let mes=item.llegadaSap.slice(3,5)
      let dia=item.llegadaSap.slice(0,2)

      let llegadaSapES6=
      new Date(
        Number(annio),
        Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
        Number(dia),
      )

      const fechaHace30Dias = new Date();
      fechaHace30Dias.setDate(fechaActual.getDate() - 30);
  
      // Compara las dos fechas
      if (llegadaSapES6 <= fechaActual && llegadaSapES6 >= fechaHace30Dias){
        return item
      }


    })



      setInitialValueMat(item30)
      setListaMat(item30)


  }, [dbBillOfLading])
     
  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput]=useState('')

  const handleSearch=(e)=>{
    let entradaMaster=e.target.value.toLowerCase()
      setBuscarDocInput(entradaMaster)

    if(arrayOpciones[0].select==true){
        if(e.target.name=='inputBuscar'){
          setListaFurgonesMaster(initialValueFurgones.filter((furgon)=>{
            if(
              furgon.numeroDoc.toLowerCase().includes(entradaMaster)||
              furgon.proveedor.toLowerCase().includes(entradaMaster)||
              furgon.bl.toLowerCase().includes(entradaMaster)||
              furgon.naviera.toLowerCase().includes(entradaMaster)||
              furgon.puerto.toLowerCase().includes(entradaMaster)
            ){
              return furgon
            }
          }))
        }
      }
      else if(arrayOpciones[1].select==true){
        if(e.target.name=='inputBuscar'){
          setListaMat(initialValueMat.filter((item)=>{
            if( 
              item.codigo.toLowerCase().includes(entradaMaster)||
              item.descripcion.toLowerCase().includes(entradaMaster)||
              item.qty.toString().includes(entradaMaster)||
              item.furgon.toLowerCase().includes(entradaMaster)||
              item.blPadre.toLowerCase().includes(entradaMaster)||
              item.proveedor.toLowerCase().includes(entradaMaster)||
              item.ordenCompra.toLowerCase().includes(entradaMaster)||
              item.comentarios.toLowerCase().includes(entradaMaster)
              ){
                return item
              }
          }))
        }
      }
      


    if(e.target.value==''&&buscarDocInput==''){
      setListaFurgonesMaster(initialValueFurgones)
      setListaMat(initialValueMat)
    }
  }

  const [arrayOpciones, setArrayOpciones]=useState([
        {
          nombre:'Contenedores',
          opcion:0,
          select: true
        },
        {
          nombre:'Materiales',
          opcion:1,
          select: false
        },
    ])

    const handleOpciones=(opcion)=>{
      setBuscarDocInput('')
      let index=Number(event.target.dataset.id)

      setArrayOpciones(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );
    }
  


    return (
    <>
    {/* <BotonQuery
      arrayOpciones={arrayOpciones}


    /> */}
        <TituloEncabezadoTabla className='descripcionEtapa'>
        <Resaltar>Listo en SAP✅:</Resaltar> Es la ultima fase del ciclo y ocurre cuando la mercancia queda registrada en nuestro ERP (SAP).
        </TituloEncabezadoTabla>
    <CabeceraListaAll>
      <EncabezadoTabla>
        <TituloEncabezadoTabla>
          Contenedores registrados en SAP, ultimos 30 dias.
        </TituloEncabezadoTabla>
      </EncabezadoTabla>

      <ControlesTablasMain
        habilitar={habilitar}
        handleSearch={handleSearch}
        handleOpciones={handleOpciones}
        arrayOpciones={arrayOpciones}
        buscarDocInput={buscarDocInput}
      />
    </CabeceraListaAll>
    
     <>
     {
        
        arrayOpciones[0].select==true?
        <Tabla>
          <thead>
          <Filas className='cabeza'>
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Numero*</CeldaHead>
            <CeldaHead>T</CeldaHead>
            <CeldaHead>Proveedor</CeldaHead>
            <CeldaHead>BL*</CeldaHead>
            <CeldaHead>Naviera</CeldaHead>
            <CeldaHead>Puerto</CeldaHead>
            <CeldaHead title='Fecha en que el producto fue registrado en SAP'>Fecha SAP✅</CeldaHead>
          </Filas>
          </thead>
          <tbody>
          {
          listaFurgonesMaster.map((furgon,index)=>{
            return(
              <Filas
                key={index}
                className='body'
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
                  {furgon.llegadaSap.slice(0,10)}
                </CeldasBody>
              </Filas>
            )
          })
        }
             </tbody>
          
          
          </Tabla>

          :
          arrayOpciones[1].select==true?
            <Tabla>
            <thead>
              <Filas className='cabeza'>
                <CeldaHead>N°</CeldaHead>
                <CeldaHead>Codigo*</CeldaHead>
                <CeldaHead>Descripcion</CeldaHead>
                <CeldaHead>Qty</CeldaHead>
                <CeldaHead>Contenedor</CeldaHead>
                <CeldaHead>BL</CeldaHead>
                <CeldaHead>Proveedor</CeldaHead>
                <CeldaHead>O/C*</CeldaHead>
                <CeldaHead>Fecha SAP✅</CeldaHead>
                <CeldaHead>Comentarios</CeldaHead>
               
              </Filas>
            </thead>
            <tbody>
              {
                 listaMat.map((item,index)=>{
                  return(
                    <Filas
                      key={index}
                      className='body'
                    >
                      <CeldasBody className='index'>{index+1}</CeldasBody>
                      <CeldasBody>
                        <Enlaces 
                          to={`/importaciones/maestros/articulos/${item.codigo}`}
                          target="_blank"
                          >
                          {item.codigo}
                        </Enlaces>
                      </CeldasBody>
                      <CeldasBody 
                        title={item.descripcion}
                        className='descripcion'>
                          {item.descripcion}
                        </CeldasBody>
                      <CeldasBody>{item.qty}</CeldasBody>
                      <CeldasBody>
                        <Enlaces 
                          to={`/importaciones/maestros/contenedores/${item.furgon}`}
                          target="_blank"
                          >
                          {item.furgon}
                        </Enlaces>
                      </CeldasBody>
                      <CeldasBody>
                      <Enlaces 
                          to={`/importaciones/maestros/billoflading/${item.blPadre}`}
                          target="_blank"
                          >
                          {item.blPadre}
                        </Enlaces>
                      </CeldasBody>
                      
                      <CeldasBody
                        title={item.proveedor}
                        className='proveedor'>
                        {item.proveedor}
                      </CeldasBody>
                      <CeldasBody>
                        <Enlaces 
                          to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
                          target="_blank"
                          >
                          {item.ordenCompra}
                        </Enlaces>
                      </CeldasBody>
                      <CeldasBody>
                        {item.llegadaSap.slice(0,10)}
                      </CeldasBody>
                      <CeldasBody 
                        title={item.comentarios}
                        className='comentarios'>
                        {item.comentarios}</CeldasBody>
                    </Filas>
                  )
                })
              }
            </tbody>
            </Tabla>
          :
          ''
              

      }
     </>
    {
          isLoading?
          <ModalLoading/>
      

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
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
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
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
  &.qty{
    width: 300px;
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
    &.index{
      /* max-width: 5px; */
      /* background-color: red; */
    }
   
    &.descripcion{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 150px;
    }
    &.proveedor{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 100px;
    }
    &.comentarios{
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;   
      text-overflow: ellipsis;
    }
    &.status{
    max-width: 80px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;    
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
  /* margin-top: 20px; */
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
  padding:0 15px;
  @media screen and (max-width:500px){
    font-size: 16px;

  }
  @media screen and (max-width:420px){
    font-size: 14px;

  }
  &.descripcionEtapa{
    font-size: 0.9rem;
    margin: 0;
    @media screen and (max-width:480px){
      font-size: 12px;
      /* border: 1px solid red; */
    }
  }
  
`
const Resaltar =styled.span`
  text-decoration: underline;
  font-weight: bold;
`