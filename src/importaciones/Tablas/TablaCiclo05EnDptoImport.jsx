import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { NavLink } from 'react-router-dom'
import { CSSLoader } from '../../components/CSSLoader'
import { Alerta } from '../../components/Alerta'
import { addDoc, collection, doc, onSnapshot,  writeBatch } from 'firebase/firestore'
import db from '../../firebase/firebaseConfig'
import { ControlesTablasMain } from '../components/ControlesTablasMain'
import { BotonQuery } from '../../components/BotonQuery'
import FuncionStatus from '../components/FuncionStatus'
import { BtnGeneralButton } from '../../components/BtnGeneralButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import FuncionUpWayDate from '../components/FuncionUpWayDate'
import { getAuth } from 'firebase/auth'

export const TablaCiclo05EnDptoImport = ({
    dbBillOfLading,
    userMaster,
}) => {
   
  const auth=getAuth()
  const usuario=auth.currentUser

  const [accesoFullIMS, setAccesoFullIMS]=useState(false)
  useEffect(()=>{
 
        if(userMaster){
          userMaster.privilegios.forEach((pri)=>{
            if (pri.code === "fullAccessIMS" && pri.valor === true) {
              setAccesoFullIMS(true)
            }
          })
      }
    
  },[usuario,userMaster])

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
  // BL con furgones en dptoImport
  const [blFurgonImport, setBLFurgonImport]=useState([])
  const [initialBLFurgonImport,setInitialBLFurgonImport]=useState([])

  // Furgones en status en dptoImport (EDITABLE)
  const [furgonesEditables, setFurgonesEditables]=useState([])
  const [initialValueEditable, setInitialValueEditable]=useState([])

  // Furgones en status dptoImport (CONSUMIBLE)
  const [initialValueFurgones,setInitialValueFurgones]=useState([])
  const [listaFurgonesMaster,setListaFurgonesMaster]=useState([])

    // Lista de material en status dptoImport
  const [initialValueMat,setInitialValueMat]=useState([])
  const [listaMat,setListaMat]=useState([])

  useEffect(()=>{
       // ***** BILL OF LADING *****
    // No mostrar bl eliminados
    const blsSinEliminados=dbBillOfLading.filter((bl,index)=>{
      return bl.estadoDoc!=2
    })

    // Dame solo los BL con furgones en dptoImport
    const blsFiltradosDptoImport=(blsSinEliminados.filter((bl)=>{
      let transito=false
      if(bl.furgones.some(furgon=>furgon.status==4)==true){
        transito=true
      }
      if(transito==true){
        return bl
      }
    }))

    setBLFurgonImport(blsFiltradosDptoImport)
    setInitialBLFurgonImport(blsFiltradosDptoImport)

    // ***** CONTENEDORES *****
    let furgones = [];
    for (const bill of dbBillOfLading) {
      if(bill.estadoDoc!=2){
        for (const furgon of bill.furgones) {

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

    // **** Todos los furgones en status dptoImport (consumible) ****
    const furgonesConsumibles=furgones.filter((furgon)=>{
      return furgon.status==4
    })
    setInitialValueFurgones(furgonesConsumibles)
    setListaFurgonesMaster(furgonesConsumibles)

    // ***** Todos los furgones en status dptoImport (editable)****
    const furgonesEditables=furgones.filter((furgon)=>{
    return furgon.status==4
  })

  setFurgonesEditables(furgonesEditables)
  setInitialValueEditable(furgonesEditables)

    // ***** MATERIALES *****
    let materialesBL = [];
      for (const bill of dbBillOfLading) {
        if(bill.estadoDoc!=2){
          for (const furgon of bill.furgones) {
            if(furgon.status==4){
              for (const material of furgon.materiales) {
                materialesBL=[
                  ...materialesBL,
                  {
                    ...material,
                    furgon:furgon.numeroDoc,
                    proveedor:bill.proveedor ,
                    llegadaAlPais:furgon.llegadaAlPais,
                    blPadre:bill.numeroDoc
                  }
                ]
              }
            }
          }
        }
      }
      setInitialValueMat(materialesBL)
      setListaMat(materialesBL)

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
              furgon.destino.toLowerCase().includes(entradaMaster)||
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

    const handleOpciones=(e)=>{
      setBuscarDocInput('')
      setModoAvanzar(false)
      setHabilitar({
        ...habilitar,
        search:true
      })
      let index=Number(e.target.dataset.id)

      setArrayOpciones(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );

      setFurgonesEditables(prevState=>
          prevState.map((furgon,i)=>{
            return {
              ...furgon,
              fijado:false
            }
          })
        )
    }

      // ************************** CODIGO AVANZAR ********************************* //
      const [modoAvanzar, setModoAvanzar]=useState(false)

      const avanzar=()=>{
        setModoAvanzar(true)
        setHabilitar({
          ...habilitar,
          search:false,
        })
  
        setArrayOpciones(prevOpciones => 
          prevOpciones.map((opcion, i) => ({
            ...opcion,
            select: false,
          }))
        );
      }

      const fijarFurgon=(e)=>{
        let noFurgon=e.target.dataset.furgon
        let index=Number(e.target.dataset.id)

      const fechaActual=new Date()
      const annio=fechaActual.getFullYear()
      const mes=fechaActual.getMonth()+1
      const dia=fechaActual.getDate()

      const { llegadaAlmacen,llegadaDptoImport,llegadaSap}=FuncionUpWayDate(annio,mes,dia,5,true)

      setFurgonesEditables(prevState=>
          prevState.map((furgon,i)=>{
            return{
              ...furgon,
              fijado:
                index===i&&noFurgon==furgon.numeroDoc?
                (furgon.fijado==true?
                false
                :
                true)
                :
                furgon.fijado,
            llegadaSap:llegadaSap,
            status:index===i&&noFurgon==furgon.numeroDoc?5:furgon.status
            }

          })
        )
        
      }

      const guardarCambios=async()=>{
        const validacion={
          hasFijados:false,
        }

      // Si el usuario no ha fijado ninguna fecha
      furgonesEditables.forEach((furgon)=>{
        if(furgon.fijado==true){
          validacion.hasFijados=true
        }
      })

      if(validacion.hasFijados==false){
        setMensajeAlerta('Aun no fija fecha a ningun contenedor.')
          setTipoAlerta('warning')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
      }

      if(validacion.hasFijados==true){
        setIsLoading(true)

        // BLFurgonAlmacen es el estado que guarda los BL con furgones en status almacen
        // furgonesEditable es el estado de los furgones que el usuario esta modificando para alimentar la base de datos
        const blsUp=initialBLFurgonImport.map((bl)=>{
          const furgones= bl.furgones.map((furgon)=>{
            const furgonUp=furgonesEditables.find((container)=>furgon.numeroDoc===container.numeroDoc)
            return furgonUp?furgonUp:furgon
          })
          return{
            ...bl,
            furgones:furgones
          }
        })

         // Ahora dame un array solamente con los BL que tengan algun furgon que el usuario halla fijado
         const blFijados=blsUp.filter((bl)=>{
          const hasFijado=bl.furgones.some((furgon)=>{
            if(furgon.fijado==true){
              return furgon
            }
          })
          if(hasFijado){
            return bl
          }
        })

        // Ahora a esos furgones ponlo en fijado modo null
        const blParsed=blFijados.map((bl)=>{
          const furgonesParsed=bl.furgones.map((furgon)=>{
            return{
              ...furgon,
              fijado:null,
              bl:null
            }
          })
          return{
            ...bl,
            furgones:furgonesParsed
          }
        })

        const batch = writeBatch(db);
        try{
          blParsed.forEach((bl)=>{
            const blId=bl.id
              const blActualizar= doc(db, "billOfLading", blId);
              batch.update(blActualizar, {
                
                "furgones": bl.furgones,
                "bl":'',
              });
          })
           await batch.commit();

          setArrayOpciones(prevOpciones => 
            prevOpciones.map((opcion, i) => ({
              ...opcion,
              select: i === 0?true:false,
            }))
          );

         setModoAvanzar(false)
        setIsLoading(false)
        setMensajeAlerta('Guardado correctamente.')
        setTipoAlerta('success')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);

        }
        catch(error){
          console.log('Error al realizar la transacción:', error);
          setIsLoading(false)
          setMensajeAlerta('Error con la base de datos.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 7000);
        }


      }

      }
  


    return (
    <>
    {/* <BotonQuery
    arrayOpciones={arrayOpciones}
    /> */}
        <TituloEncabezadoTabla className='descripcionEtapa'>
        <Resaltar>En Dpto. Import.:</Resaltar> Es la quinta fase del ciclo y empieza cuando almacen envía la documentacion al departamento de importaciones y finaliza cuando la mercancia es registrada en el ERP de la empresa (SAP).
        </TituloEncabezadoTabla>
    <CabeceraListaAll>
      <EncabezadoTabla>
        <TituloEncabezadoTabla>
          Lista de contenedores en proceso de registro y sus respectivos materiales.
        </TituloEncabezadoTabla>
      </EncabezadoTabla>

      <CajaControles>
        <CajaBtnAvanzar>
      {
          accesoFullIMS&&
          (modoAvanzar==false?
          <BtnSimple
            onClick={()=>avanzar()}
            className={`avanzar ${modoAvanzar?'modoAvanzar':''}`}
          >
            <Icono icon={faAnglesRight} />
            Avanzar</BtnSimple>
          :
          <BtnSimple
            onClick={()=>guardarCambios()}
          >
            <Icono icon={faFloppyDisk}/>
            Guardar
            </BtnSimple>)
        }
        </CajaBtnAvanzar>
        
        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          handleOpciones={handleOpciones}
          arrayOpciones={arrayOpciones}
          buscarDocInput={buscarDocInput}
          tipo={'import'}
        />
      </CajaControles>

      </CabeceraListaAll>
    
     <>
     {
        arrayOpciones[0].select==true?
          <CajaTabla>
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
            <CeldaHead>Destino</CeldaHead>
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
              
                
                <CeldasBody
                  >
                  {furgon.destino}
                </CeldasBody>
              </Filas>
            )
          })
        }
             </tbody>
          
          
          </Tabla>
          </CajaTabla>

          :
          arrayOpciones[1].select==true?
          <CajaTabla>
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
            </CajaTabla>
          :
          ''
              

      }
      {
        modoAvanzar?
        <CajaTabla>
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
              <CeldaHead>Listo✅</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {
              furgonesEditables.map((furgon,index)=>{
                return(
                  <Filas
                    key={index}
                    className={`body  ${furgon.fijado?'fijado':''}`}
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
                  >
                    {furgon.naviera}
                  </CeldasBody>
                <CeldasBody
                  className='puerto'
                  title={furgon.puerto}
                >
                  {furgon.puerto}
                </CeldasBody>
                <CeldasBody className='celdaBtn'>
                {
                        furgon.fijado?
                        <BtnSimple
                          data-furgon={furgon.numeroDoc}
                          data-bl={furgon.bl}
                          data-id={index}
                          onClick={(e)=>fijarFurgon(e)}
                          name='btnQuitarFijado'
                          className='docEnviado'
                        >Quitar </BtnSimple>
                        :
                        <BtnSimple
                          data-furgon={furgon.numeroDoc}
                          data-bl={furgon.bl}
                          data-id={index}
                          onClick={(e)=>fijarFurgon(e)}
                          name='btnListoSap'
                          className='docEnviado'
                        >Listo</BtnSimple>
                        

                      }
               
              </CeldasBody>
              </Filas>
                )
              })
            }
          </tbody>
        </Tabla>
        </CajaTabla>
        :
        ''
      }
     </>
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
  }
  &.cabeza{
    background-color: ${theme.azulOscuro1Sbetav};
  }
  color: ${theme.azul1};
  &:hover{
    background-color: ${theme.azulOscuro1Sbetav};
  }
  &.fijado{
    background-color: ${theme.fondo};
    color: ${theme.fondoEdTeam};
    &.negativo{
      color: #441818;

    }
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
    }
  }
  
`
const Resaltar =styled.span`
  text-decoration: underline;
  font-weight: bold;
`



const CajaControles=styled.div`
  display: flex;
  align-items: center;
  padding-left: 25px;
  /* justify-content: center; */
  @media screen and (max-width:850px) {
    flex-direction: column;
    justify-content: start;
    
  }
`
const CajaBtnAvanzar=styled.div`
  min-width:220px;
  @media screen and (max-width:850px) {
    width: 100%;
  }

  
  
`

const BtnSimple=styled(BtnGeneralButton)`
  height: 30px;
  margin: 0;
  &.confirmar{
    margin-right: 4px;
    width: auto;
  }
  &.avanzar{

  background-color: ${theme.warning};
  color: black;

  &.modoAvanzar{

    background-color:  #a79d9d;
      color: #383e44;
    
  }
  &:focus{
    /* background-color:  #a79d9d; */
    color: #383e44;

  }
    &:hover{
      background-color: white ;
    /* color: ${theme.warning}; */
    }
    &:active{
      background-color:  #0074d9;
      color: white;
    }
}
&.docEnviado{
  font-size: 0.8rem;
}

`

const IconoREDES =styled.p`
  cursor: pointer;
`
const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion{
    cursor: pointer;
  }
`