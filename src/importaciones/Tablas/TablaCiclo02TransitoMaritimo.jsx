import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { NavLink, } from 'react-router-dom'
import { CSSLoader } from '../../components/CSSLoader'
import { Alerta } from '../../components/Alerta'
import {  collection, doc, onSnapshot, updateDoc,writeBatch } from 'firebase/firestore'
import { es } from "date-fns/locale";
import imgTransito from './../../importaciones/img/02-ship.png'
import db from '../../firebase/firebaseConfig'
import { ControlesTablasMain } from '../components/ControlesTablasMain'
import { BotonQuery } from '../../components/BotonQuery'
import { BtnGeneralButton } from '../../components/BtnGeneralButton'
import { format } from 'date-fns'
import { ModalLoading } from '../../components/ModalLoading'
import FuncionUpWayDate from '../components/FuncionUpWayDate'
import { faAnglesRight, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getAuth } from 'firebase/auth'

export const TablaCiclo02TransitoMaritimo = ({
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
    const [listaBLsMaster, setListaBLsMaster]=useState([])
    const [initialValueBLs,setInitialValueBLs]=useState([])

    const [initialValueFurgones,setInitialValueFurgones]=useState([])
    const [listaFurgonesMaster,setListaFurgonesMaster]=useState([])

    const [initialValueMat,setInitialValueMat]=useState([])
    const [listaMat,setListaMat]=useState([])

    const [cargaComplete, setCargaComplete]=useState(false)

  useEffect(()=>{
    // ***** BILL OF LADING *****
    // No mostrar bl eliminados
    const blsSinEliminados=dbBillOfLading.filter((bl,index)=>{
      return bl.estadoDoc!=2
    })
    
    // Calcular y filtrar estado del documento Abierto o Cerrado
    // Dame solo los BL con sus furgones en transito maritimo
    const blsFiltrados=(blsSinEliminados.filter((bl)=>{
      let estadoDoc=0
      // Abierto
      if(bl.furgones.every(furgon=>furgon.status<5)==true){
        estadoDoc=0
      }
      // Cerrado
      else if(bl.furgones.every(furgon=>furgon.status==5)==true){
        estadoDoc=1
      }
      // Eliminado
      if(bl.estadoDoc==2){
        estadoDoc=2
      }

      let transito=false
      // Transito Maritimo
      if(bl.furgones.every(furgon=>furgon.status==1)==true){
        transito=true
      }

      if(transito==true){
        return bl
      }
    }))
    
    //Agregar propiedad de dias restantes
    const blParsed=blsFiltrados.map((bill)=>{
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
      

      return{
        ...bill,
        diasRestantes:diasRestantes
      }
    })

    // Ordenar por dias libres
    const blsOrdenados = blParsed.sort((a, b)=> {
      return a.diasRestantes - b.diasRestantes;
    });
    setInitialValueBLs(blsOrdenados)
    setListaBLsMaster(blsOrdenados)


    // ***** CONTENEDORES *****
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
          

          if(furgon.status==1){
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

    setInitialValueFurgones(sortFurgones)
    setListaFurgonesMaster(sortFurgones)

    // ***** MATERIALES *****
    let materialesBL = [];
      for (const bill of dbBillOfLading) {
        if(bill.estadoDoc!=2){
          for (const furgon of bill.furgones) {
            if(furgon.status==1){
              for (const material of furgon.materiales) {
                materialesBL=[
                  ...materialesBL,
                  {
                    ...material,
                    furgon:furgon.numeroDoc,
                    proveedor:bill.proveedor ,
                    llegadaAlPais:bill.llegadaAlPais,
                    bl:bill.numeroDoc
                  }
                ]
              }
            }
          }
        }
      }
      setInitialValueMat(materialesBL)
      setListaMat(materialesBL)
      
      setCargaComplete(true)

  }, [dbBillOfLading])
     
  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput]=useState('')

  const handleSearch=(e)=>{
    let entradaMaster=e.target.value.toLowerCase()
      setBuscarDocInput(entradaMaster)

      if(arrayOpciones[0].select==true){
        if(e.target.name=='inputBuscar'){
          setListaBLsMaster(initialValueBLs.filter((bl)=>{
            if( 
              bl.numeroDoc.toLowerCase().includes(entradaMaster)||
              bl.proveedor.toLowerCase().includes(entradaMaster)||
              bl.naviera.toLowerCase().includes(entradaMaster)||
              bl.puerto.toLowerCase().includes(entradaMaster)
              ){
                return bl
              }
          }))
        }
      }
      else if(arrayOpciones[1].select==true){
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
      else if(arrayOpciones[2].select==true){
        if(e.target.name=='inputBuscar'){
          setListaMat(initialValueMat.filter((item)=>{
            if( 
              item.codigo.toLowerCase().includes(entradaMaster)||
              item.descripcion.toLowerCase().includes(entradaMaster)||
              item.qty.toString().includes(entradaMaster)||
              item.furgon.toLowerCase().includes(entradaMaster)||
              item.bl.toLowerCase().includes(entradaMaster)||
              item.proveedor.toLowerCase().includes(entradaMaster)||
              item.ordenCompra.toLowerCase().includes(entradaMaster)||
              item.comentarios.toLowerCase().includes(entradaMaster)
              ){
                return item
              }
          }))
        }
      }

      else if(modoAvanzar){
        if(e.target.name=='inputBuscar'){
          setListaBLsEditable(initialValueEditable.filter((bill)=>{
            if( 
              bill.numeroDoc.toLowerCase().includes(entradaMaster)||
              bill.proveedor.toLowerCase().includes(entradaMaster)||
              bill.naviera.toLowerCase().includes(entradaMaster)||
              bill.puerto.toLowerCase().includes(entradaMaster)
              ){
                return bill
              }
          }))
        }

      }
      


    if(e.target.value==''&&buscarDocInput==''){
      setListaBLsMaster(initialValueBLs)
      setListaFurgonesMaster(initialValueFurgones)
      setListaMat(initialValueMat)
      setListaBLsEditable(initialValueEditable)
    }
  }

  const [arrayOpciones, setArrayOpciones]=useState([
        {
          nombre:'BLs',
          opcion:0,
          select: true
        },
        {
          nombre:'Contenedores',
          opcion:1,
          select: false
        },
        {
          nombre:'Articulos',
          opcion:2,
          select: false
        },
    ])

    const handleOpciones=(opcion)=>{
      setModoAvanzar(false)
      setBuscarDocInput('')
      setListaBLsEditable([])
      let index=Number(event.target.dataset.id)

        setHabilitar({
          ...habilitar,
          search:true,
          // destino:false,
        })

      setArrayOpciones(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );
    }

    // **************************** CODIGO AVANZAR ****************************
    const [listaBLsEditable,setListaBLsEditable]=useState([])
    const [initialValueEditable,setInitialValueEditable]=useState([])
    const [modoAvanzar, setModoAvanzar]=useState(false)
    const [refreshBLEditable, setRefreshBLEditable]=useState(false)
    

useEffect(()=>{
  const editable=(prevState => 
    initialValueBLs.map((bl, i) => ({
      ...bl,
      initialValueLlegadaAlPais:bl.llegadaAlPais,
      llegadaAlPaisMostrar:'',
      fijado:false,

    }))
  );
  setListaBLsEditable(editable)
  setInitialValueEditable(editable)
},[initialValueBLs,refreshBLEditable])

    const avanzar=()=>{
      setRefreshBLEditable(!refreshBLEditable)
      setModoAvanzar(true)
      // setHabilitar({
      //   ...habilitar,
      //   search:false,
      // })
      setArrayOpciones(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: false,
        }))
      );
    }

    const handleInputsTabla=(e)=>{
      let index=Number(e.target.dataset.id)
      const { name, value } = e.target;

      
      setListaBLsEditable(prevState => 
        prevState.map((bl, i) => ({
          ...bl,
          llegadaAlPaisMostrar:
          i==index&&name=='llegadaAlPais'?
          value
          :
          bl.llegadaAlPaisMostrar

        }))
      );

    }

    const fijar=(e)=>{
      let index=Number(e.target.dataset.id)
      let noBL=e.target.dataset.nobl
      const { name, value } = e.target;
      let validacion={
        fechaIndicada:true,
        fechaAnterior:true,
      }

      // Si aun no se indica fecha
      if(listaBLsEditable[index].llegadaAlPaisMostrar==''){
        validacion.fechaIndicada=false
        setMensajeAlerta('Debe indicar fecha.')
        setTipoAlerta('warning')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);
      }


      let fechaActual=new Date()
      const annio=listaBLsEditable[index].llegadaAlPaisMostrar.slice(0,4)
      const mes=(listaBLsEditable[index].llegadaAlPaisMostrar.slice(5,7)-1)
      const mesSinRebajar=(listaBLsEditable[index].llegadaAlPaisMostrar.slice(5,7))
      const dia=listaBLsEditable[index].llegadaAlPaisMostrar.slice(8,10)

      let llegadaAlPaisBLES6 = new Date(annio,mes,dia);

       // 1-Primero verifica que el dia indicando por el usuario no es el dia de hoy, obviando las horas y minutos super importante
      if(
        llegadaAlPaisBLES6.getFullYear()!==fechaActual.getFullYear() ||
        llegadaAlPaisBLES6.getMonth()!==fechaActual.getMonth() ||
        llegadaAlPaisBLES6.getDate()!==fechaActual.getDate() 
      ){
        // 2-Una vez que sabemos que no estamos trantando el mismo dia, verifica si llegada al pais es anterior o posterior al dia de hoy
        if(llegadaAlPaisBLES6>fechaActual){
          validacion.fechaAnterior=false
          setMensajeAlerta('La fecha indicada es posterior a la fecha actual.')
          setTipoAlerta('warning')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
        }
      }
      
      if(
        validacion.fechaAnterior==true&&
        validacion.fechaIndicada==true
      ){
        const { llegadaAlPais}=FuncionUpWayDate(annio,mesSinRebajar,dia,2,true)
        const { llegadaAlmacen,llegadaDptoImport,llegadaSap}=FuncionUpWayDate(annio,mesSinRebajar,dia,2)


        setListaBLsEditable(listaBLsEditable.map((bl, i) => {
          if(bl.numeroDoc==noBL){
            return{
              ...bl,
              fijado:true,
              llegadaAlPais:llegadaAlPais,
              furgones:bl.furgones.map((furgon)=>{
                return{
                  ...furgon,
                  llegadaAlmacen:llegadaAlmacen,
                  llegadaDptoImport:llegadaDptoImport,
                  llegadaSap:llegadaSap
                }
              }),
            }
          }
          else{
            return bl
          }
      }))

          setInitialValueEditable(initialValueEditable.map((bl,i)=>{
            if(bl.numeroDoc==noBL){
              return{
                ...bl,
                fijado:true,
                llegadaAlPais:llegadaAlPais,
                llegadaAlPaisMostrar:listaBLsEditable[index].llegadaAlPaisMostrar,
                furgones:bl.furgones.map((furgon)=>{
                  return{
                    ...furgon,
                    llegadaAlmacen:llegadaAlmacen,
                    llegadaDptoImport:llegadaDptoImport,
                    llegadaSap:llegadaSap
                  }
                }),


              }
            }
            else{
              return bl
            }
          }))


          }

    }

    const editar=(e)=>{
      let index=Number(e.target.dataset.id)
      const { name, value } = e.target;
      setListaBLsEditable(prevState => 
        prevState.map((bl, i) => ({
          ...bl,
          fijado:
          i==index?
          false
          :
          bl.fijado

        }))
      );
      setInitialValueEditable(prevState => 
        prevState.map((bl, i) => ({
          ...bl,
          fijado:
          i==index?
          false
          :
          bl.fijado

        }))
      );
    }


    const guardarDatos=async(e)=>{
      let validacionFechasFija=false

      // Si el usuario no ha fijado ninguna fecha
      listaBLsEditable.forEach((bl)=>{
        if(bl.fijado==true){
          validacionFechasFija=true
        }
      })

      if(validacionFechasFija==false){
        setMensajeAlerta('Aun no fija fecha a ningun BL.')
          setTipoAlerta('warning')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
      }

      if(validacionFechasFija==true){
        setIsLoading(true)

        const batch = writeBatch(db);
        try {
          // Actualizar documentos en dbOrdenes dentro del lote
          initialValueEditable.forEach((bl)=>{
            const blId=bl.id
            const fechaLlego=bl.llegadaAlPais
            const furgones=bl.furgones.map((furgon)=>{
              return{
                ...furgon,
                status:2,
                bl:null
              }
            })
            
            if(bl.fijado==true){
              const blActualizar= doc(db, "billOfLading", blId);
              batch.update(blActualizar, {
                "llegadaAlPais": fechaLlego,
                "furgones":furgones,
                "diasRestantes":null
              });
            }
          })
          
          await batch.commit();
            setIsLoading(false)
            setMensajeAlerta('BL actualizado correctamente.')
            setTipoAlerta('success')
            setDispatchAlerta(true)
            setTimeout(() => {
              setDispatchAlerta(false)
            }, 3000);

            setModoAvanzar(false)
            setArrayOpciones(prevOpciones => 
              prevOpciones.map((opcion, i) => ({
                ...opcion,
                select: i === 0?true:false,
              }))
            );

            } 
            catch (error) {
              console.error('Error al realizar la transacción:', error);
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
      listaBLsEditable={listaBLsEditable}
      initialValueEditable={initialValueEditable}
    
    />  */}
        <TituloEncabezadoTabla className='descripcionEtapa'>
        <Resaltar>Transito Marítimo</Resaltar>: Es la segunda etapa del ciclo, inicia cuando el proveedor carga el contenedor y lo envía hacia Rep. Dominicana y finaliza cuando el contenedor llega al país.
        </TituloEncabezadoTabla>
    <CabeceraListaAll>
      <EncabezadoTabla>
        <TituloEncabezadoTabla>
          Lista de Bill of Lading rumbo a Rep. Dom. y sus respectivos contenedores y materiales.
        </TituloEncabezadoTabla>
      </EncabezadoTabla>

      <CajaControles>
        {
          accesoFullIMS&&
        <CajaBtnAvanzar>

          {modoAvanzar==false?
          <BtnAvanzar
            onClick={()=>avanzar()}
            className={`avanzar ${modoAvanzar?'modoAvanzar':''}`}
          >
            <Icono icon={faAnglesRight} />
            Avanzar</BtnAvanzar>


          :
          <BtnAvanzar
            onClick={()=>guardarDatos()}
          >
            <Icono icon={faFloppyDisk} />
            Guardar</BtnAvanzar>
     
        }

        </CajaBtnAvanzar>
        }

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          handleOpciones={handleOpciones}
          arrayOpciones={arrayOpciones}
          buscarDocInput={buscarDocInput}
          tipo={'transito'}
          />
      </CajaControles>


    </CabeceraListaAll>
    
     <>
     {
        arrayOpciones[0].select==true?
        <>
        <CajaTabla>
        <Tabla>
          <thead>
          <Filas className='cabeza'>
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Numero*</CeldaHead>
            <CeldaHead >Proveedor</CeldaHead>
            <CeldaHead>Naviera</CeldaHead>
            <CeldaHead>Puerto</CeldaHead>
            <CeldaHead>DL</CeldaHead>
            <CeldaHead>DR</CeldaHead>
            <CeldaHead>En el pais</CeldaHead>
          </Filas>
          </thead>
          <tbody>
            {
            listaBLsMaster.map((bl, index)=>{
              return(
                      <Filas 
                        key={index} 
                        className={`body ${bl.diasRestantes<2?'negativo':''}`}
                        >
                          <CeldasBody>{index+1}</CeldasBody>
                          <CeldasBody 
                              data-id={index}
                              >
                                <Enlaces 
                                  to={`/importaciones/maestros/billoflading/${bl.numeroDoc}`}
                                  target="_blank"
                                  >
                                  {bl.numeroDoc}
  
                                </Enlaces>
                              </CeldasBody>
                          <CeldasBody 
                            title={bl.proveedor}
                            className='proveedor'>{bl.proveedor}</CeldasBody>
                          <CeldasBody>{bl.naviera}</CeldasBody>
                          <CeldasBody>{bl.puerto}</CeldasBody>
                          <CeldasBody>{bl.diasLibres}</CeldasBody>
                          <CeldasBody>{bl.diasRestantes}</CeldasBody>
                          
                          <CeldasBody>{bl.llegadaAlPais.slice(0,10)}</CeldasBody>
                          {/* <CeldasBody>
                            <IconoREDES
                              data-id={index}
                              onClick={(e)=>mostrarFurgones(e)}
                            >
                              👁️
                            </IconoREDES>
                          </CeldasBody> */}
                      </Filas>
                  )
              })
          }
          </tbody>
        </Tabla>
        </CajaTabla>
        {
          listaBLsMaster.length==0&&
          cargaComplete==true
          ?
          <CajaSinFurgones>
            <TextoSinFurgones>
              ~ No existen BLs en status Transito Maritimo ~
            </TextoSinFurgones>
            <CajaImagen>
              <Imagen
                src={imgTransito}
                />
              <Xmark>
                ❌
              </Xmark>
              
            </CajaImagen>
          </CajaSinFurgones>
          :
          ''
        }
        </>
        :
        arrayOpciones[1].select==true?
        <>
        <CajaTabla>
        <Tabla>
          <thead>
          <Filas className='cabeza'>
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Numero*</CeldaHead>
            <CeldaHead title='Tamaño'>T</CeldaHead>
            <CeldaHead>Proveedor</CeldaHead>
            <CeldaHead>BL*</CeldaHead>
            <CeldaHead>Naviera</CeldaHead>
            <CeldaHead>Puerto</CeldaHead>
            <CeldaHead title='Dias Libres'>DL</CeldaHead>
            <CeldaHead title='Dias Restantes'>DR</CeldaHead>
            <CeldaHead title='Fecha de llegada al pais'>En el pais</CeldaHead>
          </Filas>
          </thead>
          <tbody>
          {
          listaFurgonesMaster.map((furgon,index)=>{
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
                  title={`Llegada Almacen: ${furgon.llegadaAlmacen?.slice(0,10)}`}
                  >
                  {furgon.llegadaAlPais?.slice(0,10)}
                </CeldasBody>
              </Filas>
            )
          })
        }
             </tbody>
          
          
          </Tabla>
          </CajaTabla>
            {
              listaFurgonesMaster.length==0&&
              cargaComplete==true?
              <CajaSinFurgones>
                <TextoSinFurgones>
                  ~ No existen contenedores en status Transito Maritimo ~
                </TextoSinFurgones>
                <CajaImagen>
                  <Imagen
                    src={imgTransito}
                    />
                  <Xmark>
                    ❌
                  </Xmark>
                  
                </CajaImagen>
              </CajaSinFurgones>
              :
              ''
            }
            </>

          :
          arrayOpciones[2].select==true?
          <>
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
                <CeldaHead>En el pais</CeldaHead>
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
                          to={`/importaciones/maestros/billoflading/${item.bl}`}
                          target="_blank"
                          >
                           {item.bl}
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
                        title={`Listo en SAP: ${item.llegadaAlPais?.slice(0,10)}`}
                        >
                        {item.llegadaAlPais?.slice(0,10)}
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
            {
              listaMat.length==0?
              <CajaSinFurgones>
                <TextoSinFurgones>
                  ~ No existen materiales en status Transito Maritimo ~
                </TextoSinFurgones>
                <CajaImagen>
                  <Imagen
                    src={imgTransito}
                    />
                  <Xmark>
                    ❌
                  </Xmark>
                  
                </CajaImagen>
              </CajaSinFurgones>
              :
              ''
            }
            </>
          :
          ''
              

      }
      {
        modoAvanzar?
        <>
        <CajaTabla>
        <Tabla>
        <thead>
        <Filas className='cabeza'>
          <CeldaHead>N°</CeldaHead>
          <CeldaHead>Numero*</CeldaHead>
          <CeldaHead >Proveedor</CeldaHead>
          <CeldaHead>Naviera</CeldaHead>
          <CeldaHead>Puerto</CeldaHead>
          <CeldaHead>DL</CeldaHead>
          <CeldaHead>DR</CeldaHead>
          <CeldaHead>Llegó al país:</CeldaHead>
          <CeldaHead>Fijar Fecha</CeldaHead>
        </Filas>
        </thead>
        <tbody>
          {
          listaBLsEditable.map((bl, index)=>{
            return(
                    <Filas 
                      key={index} 
                      className={`
                      body 
                      ${listaBLsEditable[index].fijado?
                      ' fijado '
                      :
                      ''}
                      ${bl.diasRestantes<2?' negativo ':''}
                      `}

                    
                     
                      >
                        <CeldasBody>{index+1}</CeldasBody>
                        <CeldasBody 
                            data-id={index}
                            >
                              <Enlaces 
                                to={`/importaciones/maestros/billoflading/${bl.numeroDoc}`}
                                target="_blank"
                                >
                                {bl.numeroDoc}

                              </Enlaces>
                            </CeldasBody>
                        <CeldasBody 
                          title={bl.proveedor}
                          className='proveedor'>{bl.proveedor}</CeldasBody>
                        <CeldasBody>{bl.naviera}</CeldasBody>
                        <CeldasBody>{bl.puerto}</CeldasBody>
                        <CeldasBody>{bl.diasLibres}</CeldasBody>
                        <CeldasBody>{bl.diasRestantes}</CeldasBody>
                        
                        <CeldasBody>
                        <InputEditable 
                          type='date'
                          data-id={index}
                          value={listaBLsEditable[index].llegadaAlPaisMostrar}
                          name='llegadaAlPais'
                          onChange={(e)=>{handleInputsTabla(e)}}
                          disabled={listaBLsEditable[index].fijado}
                         
                        />
                        </CeldasBody>
                        <CeldasBody className='celdaBtn'>
                          <BtnFijar
                            data-id={index}
                            data-nobl={bl.numeroDoc}

                            onClick={(e)=>fijar(e)}
                          >Fijar</BtnFijar>
                          <BtnFijar
                            data-id={index}
                            onClick={(e)=>editar(e)}
                          >Editar</BtnFijar>
                        </CeldasBody>
                    </Filas>
                )
            })
        }
        </tbody>
      </Tabla>
      </CajaTabla>
      {
        listaBLsMaster.length==0&&
        cargaComplete==true?
        <CajaSinFurgones>
          <TextoSinFurgones>
            ~ No existen BLs en status Transito Maritimo ~
          </TextoSinFurgones>
          <CajaImagen>
            <Imagen
              src={imgTransito}
              />
            <Xmark>
              ❌
            </Xmark>
            
          </CajaImagen>
        </CajaSinFurgones>
        :
        ''
      }
      </>
      :
      ''

      }
      {
        isLoading?
        <ModalLoading completa={true}/>
        :
        ''
      }
     </>
   
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

        margin-bottom: 100px;

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
    color: white;
  }
  &.negativo{
    &.bodyEditabe{
      background-color: ${theme.edicionYellow2};
      /* color: #333232; */
    }
    color: ${theme.danger};
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
    /* background-color: blue; */
    /* height: 60px; */
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
  &.celdaBtn{
    /* display: flex; */
    flex-direction: row;

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
const CajaControles=styled.div`
  display: flex;
  align-items: center;
  /* padding-left: 25px; */
  @media screen and (max-width:480px) {
    display: flex;
    flex-direction: column;
    justify-content: start;
    
  }
`
const CajaBtnAvanzar=styled.div`
  min-width: 150px;
  display: flex;
  justify-content: start;
  padding-left: 15px;
  @media screen and (max-width:480px) {
    width: 100%;
    
  }
`

const BtnAvanzar=styled(BtnGeneralButton)`
  height: 30px;
  margin: 0;
  &.avanzar{

  background-color: ${theme.warning};
  color: black;

  &.modoAvanzar{

    background-color:  #a79d9d;
      color: #383e44;
    
  }
  &:focus{
    background-color:  #a79d9d;
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
  min-width: 100px;

`

const InputCelda=styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  &.filaSelected{
    background-color: inherit;
  }
  border: none;
  color: ${theme.azul2};
  width: 100%;
  display: flex;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  
`

const InputEditable=styled(InputCelda)`
  height: 40px;
  width: 150px;
  border: 1px solid ${theme.azulOscuro1Sbetav2};
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 0;
  color: inherit;
 
  margin: 0;
  &.codigo{
    width: 65px;
  }
  &.celda{
    width: 100%;
  }
  &.fijado{
    background-color: red;
  }
`

const BtnFijar=styled(BtnGeneralButton)`
  /* width: 40%; */
  margin: 5px;
  height: 35px;
  font-size: 0.9rem;
  @media screen and (max-width:900px) {
    /* width: 90%; */
    
  }
  
`

const CajaSinFurgones=styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TextoSinFurgones=styled.h2`
  color: ${theme.azul2};
`

const Imagen=styled.img`
  width: 150px; 
  filter: grayscale(100%);
`
const CajaImagen=styled.div`
  /* border: 1px solid red; */
  position: relative;
`
const Xmark=styled.h2`
  font-size: 4rem;
  position: absolute;
  bottom: 0;
`

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion{
    cursor: pointer;
  }
`