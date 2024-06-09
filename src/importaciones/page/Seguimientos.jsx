import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../../components/Header'
import CajaNavegacion from '../components/CajaNavegacion'
import { OpcionUnica } from '../../components/OpcionUnica'
import theme from '../../../theme'
import { BtnGeneralButton } from '../../components/BtnGeneralButton'
import { BotonQuery } from '../../components/BotonQuery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { Alerta } from '../../components/Alerta'
import { doc, updateDoc } from 'firebase/firestore'
import db from '../../firebase/firebaseConfig'
import { Advertencia } from '../../components/Advertencia'
import { NavLink } from 'react-router-dom'

export const Seguimientos = (
  {
    dbUsuario,
    userMaster,
    dbBillOfLading,
    dbOrdenes
  }) => {

    useEffect(()=>{
      document.title = "Caeloss - Importaciones";
      return () => {
        document.title = "Caeloss"; 
      };
    },[])
    
  // Alertas
  const [dispatchAlerta, setDispatchAlerta]=useState(false)
  const [mensajeAlerta, setMensajeAlerta]=useState('')
  const [tipoAlerta, setTipoAlerta]=useState('')

  // Advertencias
  const [tipoAdvertencia, setTipoAdvertencia]=useState('')
  const [mensajeAdvertencia, setMensajeAdvertencia]=useState('')
  const [dispatchAdvertencia, setDispatchAdvertencia]=useState(false)
  const [eventFunction,setEventFunction]=useState('')
  const [functAEjecutar, setFunctAEjecutar]=useState('')

  const [arrayOpciones,setArrayOpciones]=useState([
    {
      nombre:'Articulos',
      opcion: 0,
      select:true,
    },
    {
      nombre:'Contenedores',
      opcion: 1,
      select:false,
    },
    {
      nombre:'O/C',
      opcion: 2,
      select:false,
    },
    {
      nombre:'BLs',
      opcion: 3,
      select:false,
    },
   
  ])
  
  const handleOpciones=(e)=>{
    let index=Number(e.target.dataset.id)
    setSeguirEditable()
    setArrayOpciones(prevOpciones => 
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  }

  const [seguirItem, setSeguirItem]=useState()
  const [seguiFurgon, setSeguiFurgon]=useState()
  const [seguiOrden, setSeguiOrden]=useState()
  const [seguiBL, setSeguiBL]=useState()
  useEffect(()=>{

    // Dame los datos para articulos
    if(userMaster?.seguimientos?.length>0){
      const newSeguiItem=userMaster.seguimientos.map((segui)=>{
        return{
          ...segui,
          editar:false
        }
      })

    const seguiItemParsed=newSeguiItem.filter((segui)=>{
      
      if(segui.activo){
        return segui
      }
    })

    
    setSeguirItem(seguiItemParsed)
  }

  // Dame los datos para furgones
  let seguimientosFurgon=[]
  if(dbBillOfLading.length>0){
    dbBillOfLading.forEach((bl)=>{
      bl.furgones.forEach((furgon)=>{
        if(furgon.seguimientos){
          if(furgon.seguimientos.length>0){
            let deposit=furgon.seguimientos.map((segui)=>{
              return{
                ...segui,
                noFurgon:furgon.numeroDoc,
                proveedor:bl.proveedor,
                nota:segui.nota?segui.nota:'',
                editar:false,
                blPadre:bl.numeroDoc,
                idBlPadre:bl.id
              }
            })

            seguimientosFurgon=
            [
              ...seguimientosFurgon,
              ...deposit
            ]
            
        }
      }
    })
  })
  const seguiFurgonParsed=seguimientosFurgon.filter((segui)=>{
    if(segui.idUser==userMaster.id){
      if(segui.activo){
        return segui
      }
    }
  })
  
  setSeguiFurgon(seguiFurgonParsed)
}
  // Dame los datos para ordenes de compra
  let seguimientosOrden=[]
  if(dbOrdenes.length>0){
    dbOrdenes.forEach((orden)=>{
      if(orden?.seguimientos?.length>0){
        let deposit=orden.seguimientos.map((segui)=>{
          return{
            ...segui,
            proveedor:orden.proveedor,
            nota:segui.nota?segui.nota:'',
            editar:false,
            ordenPadre:orden.numeroDoc,
            idOrden:orden.id
          }
        })
        seguimientosOrden=
        [
          ...seguimientosOrden,
          ...deposit
        ]

      }
  })
  const seguiOrdenParsed=seguimientosOrden.filter((segui)=>{
    if(segui.idUser==userMaster.id){
      if(segui.activo){
        return segui
      }
    }
  })
  
  setSeguiOrden(seguiOrdenParsed)
}
  // Dame los datos para bill of lading
  let seguimientosBL=[]
  if(dbBillOfLading.length>0){
    dbBillOfLading.forEach((bill)=>{
      if(bill?.seguimientos?.length>0){
        let deposit=bill.seguimientos.map((segui)=>{
          return{
            ...segui,
            proveedor:bill.proveedor,
            nota:segui.nota?segui.nota:'',
            editar:false,
            blPadre:bill.numeroDoc,
            idBL:bill.id
          }
        })
        seguimientosBL=
        [
          ...seguimientosBL,
          ...deposit
        ]

      }
  })
  const seguiBLParsed=seguimientosBL.filter((segui)=>{
    if(segui.idUser==userMaster.id){
      if(segui.activo){
        return segui
      }
    }
  })
  
  setSeguiBL(seguiBLParsed)
}
    
  },[userMaster,dbBillOfLading,dbOrdenes])

  // 
  const [seguirEditable, setSeguirEditable]=useState()
  const handleNota=(e,index)=>{
    const value=e.target.value
    setSeguirEditable(prevState=>
      prevState.map((segui,i)=>({
        ...segui,
        nota:i==index?value:segui.nota
      }))
    )
  }

  const editar=(e,index)=>{
    const name=e.currentTarget.name
    console.log('Botón clicado!', e.currentTarget);
    if(name=='editarItem'){
      setSeguirEditable(seguirItem)
  
      setSeguirItem(prevState=>
        prevState.map((segui,i)=>({
          ...segui,
          editar:i==index
        }))
      )

    }
    else if(name=='editarFurgon'){
      setSeguirEditable(seguiFurgon)
      
      setSeguiFurgon(prevState=>
        prevState.map((segui,i)=>({
          ...segui,
          editar:i==index
        }))
      )
    }
    else if(name=='editarOrden'){
      setSeguirEditable(seguiOrden)
      
      setSeguiOrden(prevState=>
        prevState.map((segui,i)=>({
          ...segui,
          editar:i==index
        }))
      )
    }
    else if(name=='editarBL'){
      setSeguirEditable(seguiBL)
      
      setSeguiBL(prevState=>
        prevState.map((segui,i)=>({
          ...segui,
          editar:i==index
        }))
      )
    }
   
  }
  const cancelarEdicion=(e,index,)=>{
    const name=e.currentTarget.name
    if(name=='item'){
      setSeguirItem(prevState=>
        prevState.map((segui,i)=>{
          if(i==index){
            return( 
            {
              ...segui,
              editar:false}
          )
          
        }
        else{
          return segui
        }
        
      })
    )
    }
    if(name=='furgon'){
      setSeguiFurgon(prevState=>
        prevState.map((segui,i)=>{
          if(i==index){
            return( 
            {
              ...segui,
              editar:false}
          )
          
        }
        else{
          return segui
        }
        
      })
    )
  }
    if(name=='orden'){
      setSeguiOrden(prevState=>
        prevState.map((segui,i)=>{
          if(i==index){
            return( 
            {
              ...segui,
              editar:false}
          )
          
        }
        else{
          return segui
        }
        
      })
    )
  }
    if(name=='bl'){
      setSeguiBL(prevState=>
        prevState.map((segui,i)=>{
          if(i==index){
            return( 
            {
              ...segui,
              editar:false}
          )
          
        }
        else{
          return segui
        }
        
      })
    )
  }
   
  }
  const guardarEdicion=async(e,index,idDoc,noFurgon,nota)=>{
    const name=e.currentTarget.name
    console.log(idDoc)
    if(name=='item'){
      const newSegui=userMaster.seguimientos.map((segui,i)=>{

        return{
          ...segui,
          nota:segui.codigoItem==idDoc?nota:segui.nota
        }
      })

      const userFinal={
        ...userMaster,
        seguimientos:newSegui
      }


      const userUpdate = doc(db, "usuarios", userMaster.id);

      console.log(newSegui)
      try{
        await updateDoc(userUpdate, userFinal)
        // cancelarEdicion(e,index,name)
      }
      catch(error){
        console.error(error)
        setMensajeAlerta('Error con la base de datos.')
        setTipoAlerta('error')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);

      }


    }

    if(name=='furgon'){
      const newBlUp=dbBillOfLading.find(bl=>bl.id==idDoc)
      const furgonesUp=newBlUp.furgones.map((furgon,i)=>{
        if(furgon.numeroDoc==noFurgon){
          return{
            ...furgon,
            seguimientos:furgon.seguimientos.map((segui,i)=>{
              if(segui.idUser==userMaster.id){
                return{
                  ...segui,
                  nota:nota
                }
              }
              else{
                return segui
              }
            })

          }
        }
        else{
          return furgon
        }
      })

      const blFinal={
        ...newBlUp,
        furgones:furgonesUp

      }
      
      // return''
      console.log(idDoc)
      console.log(blFinal)
      // return''
      const blUpdate = doc(db, "billOfLading", idDoc);

        try{
          await updateDoc(blUpdate, blFinal)
        }
        catch(error){
          console.error(error)
          setMensajeAlerta('Error con la base de datos.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);

        }
    }
    if(name=='orden'){
      const newOrdenUp=dbOrdenes.find(orden=>orden.id==idDoc)
      const seguiUp=newOrdenUp.seguimientos.map((segui)=>{
        if(segui.idUser==userMaster.id){
          return{
            ...segui,
            nota:nota
          }
        }
        else{
          return segui
        }
      })

      const ordenFinal={
        ...newOrdenUp,
        seguimientos:seguiUp

      }
      
      const ordenUpdate = doc(db, "ordenesCompra", idDoc);
        try{
          await updateDoc(ordenUpdate, ordenFinal)
        }
        catch(error){
          console.error(error)
          setMensajeAlerta('Error con la base de datos.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
        }
    }

    if(name=='bl'){
      const newBlUP=dbBillOfLading.find(bl=>bl.id==idDoc)
      const seguiUp=newBlUP.seguimientos.map((segui)=>{
        if(segui.idUser==userMaster.id){
          return{
            ...segui,
            nota:nota
          }
        }
        else{
          return segui
        }
      })

      const blFinal={
        ...newBlUP,
        seguimientos:seguiUp

      }
      
      // return''
      const blUpdate = doc(db, "billOfLading", idDoc);

        try{
          await updateDoc(blUpdate, blFinal)
        }
        catch(error){
          console.error(error)
          setMensajeAlerta('Error con la base de datos.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);

        }
    }
  }
  // // *************** FUNCION INTERMEDIARIA ADVERTENCIA ****************** //
  const [argCerrar, setArgCerrar]=useState({})
  
  const funcionAdvert=(e,index,idDoc,noDoc,tipoDoc)=>{
    setArgCerrar(
      {
        e:e,
        index:index,
        idDoc:idDoc,
        noDoc:noDoc,
        tipoDoc:tipoDoc
      })
      setTipoAdvertencia('warning')
      setMensajeAdvertencia('¿Seguro que desea cerrar este seguimiento?')
      setDispatchAdvertencia(true)
      setEventFunction(e)
      setFunctAEjecutar('eliminarDoc')
  }


  const cerrarSegui=async()=>{
    let e=argCerrar.e
    let index=Number(argCerrar.index)
    let idDoc=argCerrar.idDoc
    let noDoc=argCerrar.noDoc
    let tipoDoc=argCerrar.tipoDoc

    if(tipoDoc=='item'){
      const seguimientoUp=userMaster.seguimientos.map((segui,i)=>{
        if(noDoc==segui.codigoItem){
          return{
            ...segui,
            activo:false
          }
        }
        else{
          return segui
        }
      })

      const userFinal={
        ...userMaster,
        seguimientos:seguimientoUp
      }
      const userUpdate = doc(db, "usuarios", userMaster.id);

      try{
        await updateDoc(userUpdate, userFinal)
      }
      catch(error){
        console.error(error)
        setMensajeAlerta('Error con la base de datos.')
        setTipoAlerta('error')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);

      }



    }
    if(tipoDoc=='furgon'){
      const newBlUp=dbBillOfLading.find(bl=>bl.id==idDoc)
      const furgonesUp=newBlUp.furgones.map((furgon,index)=>{
        if(furgon.numeroDoc==noDoc){
          return{
            ...furgon,
            seguimientos:furgon.seguimientos.map((segui,index)=>{
              if(segui.idUser==userMaster.id){
                return{
                  ...segui,
                  activo:false
                }
              }
            })
          }
        }
        else{
          return furgon
        }
      })

      const BlFinal={
        ...newBlUp,
        furgones:furgonesUp

      }
      
      // return''
      const blUpdate = doc(db, "billOfLading", idDoc);
      
        try{
          await updateDoc(blUpdate, BlFinal)
        }
        catch(error){
          console.error(error)
          setMensajeAlerta('Error con la base de datos.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);

        }
    }
    if(tipoDoc=='orden'){
      const ordenUp=dbOrdenes.find(orden=>orden.id==idDoc)
      const seguiUp=ordenUp.seguimientos.map((segui)=>{
        if(segui.idUser==userMaster.id){
          return{
            ...segui,
            activo:false
          }
        }
        else{
          return segui
        }
      }
    )

    const ordenFinal={
      ...ordenUp,
      seguimientos:seguiUp
    }
    // return''
  
      const ordenUpdate = doc(db, "ordenesCompra", idDoc);
      
        try{
          await updateDoc(ordenUpdate, ordenFinal)
        }
        catch(error){
          console.error(error)
          setMensajeAlerta('Error con la base de datos.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);

        }
    }

    if(tipoDoc=='bl'){
      const blUp=dbBillOfLading.find(bl=>bl.id==idDoc)
      const seguiUp=blUp.seguimientos.map((segui)=>{
        if(segui.idUser==userMaster.id){
          return{
            ...segui,
            activo:false
          }
        }
        else{
          return segui
        }
      }
    )

    const blFinal={
      ...blUp,
      seguimientos:seguiUp
    }
    // return''
  
      const blUpdate = doc(db, "billOfLading", idDoc);
      
        try{
          await updateDoc(blUpdate, blFinal)
        }
        catch(error){
          console.error(error)
          setMensajeAlerta('Error con la base de datos.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);

        }
    }
  }

 

  return (
      <>
      
      <Header titulo={'Sistema gestion de importaciones'} subTitulo='Seguimientos' />
      <ContainerNav>
        <CajaNavegacion
          pageSelected={2}
          dbUsuario={dbUsuario}
          userMaster={userMaster}
        />
        <OpcionUnica
           titulo='Pantallas'
           name='grupoA'
           arrayOpciones={arrayOpciones}
           handleOpciones={handleOpciones}
        
        />
        </ContainerNav>
        {/* <BotonQuery 
          seguiBL={seguiBL}
          /> */}

{
      arrayOpciones[0].select?
      <Container>
      <TituloPrincipal>Articulos</TituloPrincipal>
      <CajaCard>
        {
          seguirItem?.map((segui,index)=>{
            return(
              <Card key={index}>
              <CajaContenido>
                <CajaItem>
                <CajaCodigo className='codigo'>
                  <TextoInterno>
                  <Enlaces 
                    to={`/importaciones/maestros/articulos/${segui.codigoItem}`}
                    target="_blank"
                    >
                    {segui.codigoItem}
                  </Enlaces>
                  </TextoInterno>
                </CajaCodigo>
                <CajaCodigo className=' codigo descripcion'>
                  <TextoInterno>
                    {segui.descripcionItem}
                  </TextoInterno>
                </CajaCodigo>
                </CajaItem>
                <CajaNotas>
                  {
                    segui.editar?
                    <TextArea
                      value={seguirEditable[index].nota}
                      onChange={(e)=>handleNota(e,index)}
                    />
                    :
                      <TextoInterno>
                        {segui.nota}
                      </TextoInterno>
                  }
              </CajaNotas>
              </CajaContenido>
              <CajaBtn>
                  {
                    segui.editar?
                      <BtnGeneralButton
                      onClick={(e)=>cancelarEdicion(e,index)}
                        className='danger'
                        name='item'
                      >
                        Cancelar
                      </BtnGeneralButton>
                    :
                      <BtnGeneralButton
                        className='dangers'
                        onClick={(e)=>
                          funcionAdvert(
                            e,
                            index,
                            undefined,
                            segui.codigoItem,
                            'item'
                          )}
                      >
                        Cerrar
                      </BtnGeneralButton>
                  }
                  {
                    segui.editar?
                    <BtnGeneralButton 
                      name='item'
                      tipo={'guardar'}
                      onClick={(e)=>
                        guardarEdicion(
                          e,
                          index,
                          segui.codigoItem,
                          undefined,
                          seguirEditable[index].nota
                        )}
                    >
                      <Icono icon={faFloppyDisk}/>
                      Guardar
                    </BtnGeneralButton>
                    :
                 
                    <BtnGeneralButton 
                        name='editarItem'
                        onClick={(e)=>editar(e,index)}
                      >
                        <Icono icon={faPencil}/>
                        Editar
                    </BtnGeneralButton>
                  }
             
                </CajaBtn>
            
            </Card>
            )
          })
        }
       
      
      </CajaCard>
      
    </Container>
    :
    ''
     }

        {
      arrayOpciones[1].select?
      <Container>
      <TituloPrincipal>Contenedores</TituloPrincipal>
      <CajaCard>
        {
          seguiFurgon?.map((segui,index)=>{
            return(
              <Card key={index}>
              <CajaContenido>
                <CajaItem>
                <CajaCodigo className='codigo'>
                  <TextoInterno>
                  <Enlaces 
                    to={`/importaciones/maestros/contenedores/${segui.noFurgon}`}
                    target="_blank"
                    >
                    {segui.noFurgon}
                  </Enlaces>
                  
                  </TextoInterno>
                </CajaCodigo>
                <CajaCodigo className=' codigo descripcion'>
                  <TextoInterno>
                  {segui.proveedor}
                  </TextoInterno>
                </CajaCodigo>
                </CajaItem>
                <CajaNotas>
                  {
                    segui.editar?
                    <TextArea
                      value={seguirEditable[index].nota}
                      onChange={(e)=>handleNota(
                        e,
                        index,
                      )}
                    />
                    :
                      <TextoInterno>
                        {segui.nota}
                      </TextoInterno>
                  }
              </CajaNotas>
              </CajaContenido>
                <CajaBtn>
                  {
                    segui.editar?
                      <BtnGeneralButton
                      onClick={(e)=>cancelarEdicion(e,index)}
                        className='danger'
                        name='furgon'
                      >
                        Cancelar
                      </BtnGeneralButton>
                    :
                      <BtnGeneralButton
                        className='dangers'
                        onClick={(e)=>
                          funcionAdvert(
                            e,
                            index,
                            segui.idBlPadre,
                            segui.noFurgon,
                            'furgon'
                          )}
                      >
                        Cerrar
                      </BtnGeneralButton>
                  }
                  {
                    segui.editar?
                    <BtnGeneralButton 
                      tipo={'guardar'}
                      name='furgon'
                      onClick={(e)=>
                        guardarEdicion(
                          e,
                          index,
                          segui.idBlPadre,
                          segui.noFurgon,
                          seguirEditable[index].nota
                        )}
                    >
                      <Icono icon={faFloppyDisk}/>
                      Guardar
                    </BtnGeneralButton>
                    :
                 
                    <BtnGeneralButton 
                        name='editarFurgon'
                        onClick={(e)=>editar(e,index)}
                      >
                        <Icono icon={faPencil}/>
                        Editar
                    </BtnGeneralButton>
                  }
             
                </CajaBtn>
            
            </Card>
            )
          })
        }
       
      
      </CajaCard>
      
    </Container>
    :
    ''
     }
        {
      arrayOpciones[2].select?
      <Container>
      <TituloPrincipal>Ordenes de compra</TituloPrincipal>
      <CajaCard>
        {
          seguiOrden?.map((segui,index)=>{
            return(
              <Card key={index}>
              <CajaContenido>
                <CajaItem>
                <CajaCodigo className='codigo'>
                  <TextoInterno>
                  <Enlaces 
                    to={`/importaciones/maestros/ordenescompra/${segui.ordenPadre}`}
                    target="_blank"
                    >
                    {segui.ordenPadre}
                  </Enlaces>
                  
                  </TextoInterno>
                </CajaCodigo>
                <CajaCodigo className=' codigo descripcion'>
                  <TextoInterno>
                  {segui.proveedor}
                  </TextoInterno>
                </CajaCodigo>
                </CajaItem>
                <CajaNotas>
                  {
                    segui.editar?
                    <TextArea
                      value={seguirEditable[index].nota}
                      onChange={(e)=>handleNota(
                        e,
                        index,
                      )}
                    />
                    :
                      <TextoInterno>
                        {segui.nota}
                      </TextoInterno>
                  }
              </CajaNotas>
              </CajaContenido>
                <CajaBtn>
                  {
                    segui.editar?
                      <BtnGeneralButton
                      onClick={(e)=>cancelarEdicion(e,index)}
                        className='danger'
                        name='orden'
                      >
                        Cancelar
                      </BtnGeneralButton>
                    :
                      <BtnGeneralButton
                        className='dangers'
                        onClick={(e)=>
                          funcionAdvert(
                            e,
                            index,
                            segui.idOrden,
                            segui.ordenPadre,
                            'orden'
                          )}
                      >
                        Cerrar
                      </BtnGeneralButton>
                  }
                  {
                    segui.editar?
                    <BtnGeneralButton 
                      tipo={'guardar'}
                      name='orden'
                      onClick={(e)=>
                        guardarEdicion(
                          e,
                          index,
                          segui.idOrden,
                          segui.ordenPadre,
                          seguirEditable[index].nota
                        )}
                    >
                      <Icono icon={faFloppyDisk}/>
                      Guardar
                    </BtnGeneralButton>
                    :
                 
                    <BtnGeneralButton 
                        name='editarOrden'
                        onClick={(e)=>editar(e,index)}
                      >
                        <Icono icon={faPencil}/>
                        Editar
                    </BtnGeneralButton>
                  }
             
                </CajaBtn>
            
            </Card>
            )
          })
        }
       
      
      </CajaCard>
      
    </Container>
    :
    ''
     }
        {
      arrayOpciones[3].select?
      <Container>
      <TituloPrincipal>Bill of Lading</TituloPrincipal>
      <CajaCard>
        {
          seguiBL?.map((segui,index)=>{
            return(
              <Card key={index}>
              <CajaContenido>
                <CajaItem>
                <CajaCodigo className='codigo'>
                  <TextoInterno>
                  <Enlaces 
                    to={`/importaciones/maestros/billoflading/${segui.blPadre}`}
                    target="_blank"
                    >
                    {segui.blPadre}
                  </Enlaces>
                  
                  </TextoInterno>
                </CajaCodigo>
                <CajaCodigo className=' codigo descripcion'>
                  <TextoInterno>
                  {segui.proveedor}
                  </TextoInterno>
                </CajaCodigo>
                </CajaItem>
                <CajaNotas>
                  {
                    segui.editar?
                    <TextArea
                      value={seguirEditable[index].nota}
                      onChange={(e)=>handleNota(
                        e,
                        index,
                      )}
                    />
                    :
                      <TextoInterno>
                        {segui.nota}
                      </TextoInterno>
                  }
              </CajaNotas>
              </CajaContenido>
                <CajaBtn>
                  {
                    segui.editar?
                      <BtnGeneralButton
                      onClick={(e)=>cancelarEdicion(e,index)}
                        className='danger'
                        name='bl'
                      >
                        Cancelar
                      </BtnGeneralButton>
                    :
                      <BtnGeneralButton
                        className='dangers'
                        onClick={(e)=>
                          funcionAdvert(
                            e,
                            index,
                            segui.idBL,
                            segui.blPadre,
                            'bl'
                          )}
                      >
                        Cerrar
                      </BtnGeneralButton>
                  }
                  {
                    segui.editar?
                    <BtnGeneralButton 
                      tipo={'guardar'}
                      name='bl'
                      onClick={(e)=>
                        guardarEdicion(
                          e,
                          index,
                          segui.idBL,
                          segui.blPadre,
                          seguirEditable[index].nota
                        )}
                    >
                      <Icono icon={faFloppyDisk}/>
                      Guardar
                    </BtnGeneralButton>
                    :
                 
                    <BtnGeneralButton 
                        name='editarBL'
                        onClick={(e)=>editar(e,index)}
                      >
                        <Icono icon={faPencil}/>
                        Editar
                    </BtnGeneralButton>
                  }
             
                </CajaBtn>
            
            </Card>
            )
          })
        }
       
      
      </CajaCard>
      
    </Container>
    :
    ''
     }
     
    
    
    
    <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
        <Advertencia
          tipo={tipoAdvertencia}
          mensaje={mensajeAdvertencia}
          dispatchAdvertencia={dispatchAdvertencia}
          setDispatchAdvertencia={setDispatchAdvertencia}

          notificacionFinal={true}

          // Alertas
          setMensajeAlerta={setMensajeAlerta}
          setTipoAlerta={setTipoAlerta}
          setDispatchAlerta={setDispatchAlerta}

          // Setting Function
          functAEjecutar={functAEjecutar}
          eventFunction={eventFunction}
          // function1={eliminarFila}
          function2={cerrarSegui}
      />
      </>
  )
}

const Container=styled.div`
  padding-top: 30px;
  height: auto;
`

const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width:1000px){
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width:410px){
    width: 99%;
  
  }
`
const TituloPrincipal=styled.h2`
  color: ${theme.azul2};
  border-bottom: 2px solid ${theme.azul2};
  padding-left: 20px;
`

const CajaCard=styled.div`
  padding: 10px 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`

const BtnSimple=styled(BtnGeneralButton)`
  
`

const Card=styled.div`
  border: 1px solid ${theme.warning};
  width: 90%;
  min-height: 100px;
  display: flex;
  border-radius: 10px 0 10px 0;
  background-color: ${theme.azulOscuro1Sbetav};

  overflow: hidden;
  /* padding: 5px; */
`
const CajaContenido=styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`
const CajaCodigo=styled.div`
  /* border: 1px solid; */
  padding: 10px;
  display: flex;
  align-items: center;
  &.codigo{
    border-left: 2px solid black;
  }
`
const TextoInterno=styled.p`
  color: ${theme.azul1};
  font-size: 16px;
  height: 100%;
  padding: 0 10px;
`
const CajaNotas=styled.div`
  padding: 0;

  min-height: 50px;
  width: 100%;
`
const CajaBtn=styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  border-left: 2px solid black;
`
const CajaItem=styled.div`
  display: flex;
  width: 100%;
  border-bottom: 2px solid black;
`

const TextArea=styled.textarea`
  height: 100%;
  min-height: 50px;
  width: 100%;
  outline: none;
  border: none;
  /* border-radius: 5px; */
  /* border: 1px solid ${theme.azul1}; */
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 0 8px;
  padding: 5px;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }

  max-width: 100%;
  min-width: 100%;
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