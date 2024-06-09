import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { NavLink } from 'react-router-dom'
import { CSSLoader } from '../../components/CSSLoader'
import { Alerta } from '../../components/Alerta'
import { collection, doc, onSnapshot,  updateDoc, writeBatch } from 'firebase/firestore'
import db from '../../firebase/firebaseConfig'
import { ControlesTablasMain } from '../components/ControlesTablasMain'
import { BotonQuery } from '../../components/BotonQuery'
import FuncionStatus from '../components/FuncionStatus'
import { BtnGeneralButton } from '../../components/BtnGeneralButton'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import imgX from '../../../public/img/xImg.png'
import imgDescarga from '../img/descarga.png'
import { faAnglesRight, faCheck, faTruckRampBox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import FuncionUpWayDate from '../components/FuncionUpWayDate'
import { getAuth } from 'firebase/auth'
import { Interruptor } from '../../components/Interruptor'

export const TablaCiclo04EnAlmacen = ({
    dbBillOfLading,
    userMaster
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
    destino:true,
    // status:true,
    opcionesUnicas:true
  })

  const [modoEditable, setModoEditable]=useState({
    furgonArrived:false,
    docSend:false,
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
  // BL con furgones en almacen
  const [blFurgonAlmacen, setBlFurgonAlmacen]=useState([])
  const [initialBLFurgonAlmacen,setInitialBLFurgonAlmacen]=useState([])

  // BL con furgones en Puerto
  const [blFurgonPuerto, setBlFurgonPuerto]=useState([])
  const [initialFurgonPuerto,setInitialFurgonPuerto]=useState([])

  // Furgones en programacion es decir en status en puerto (EDITABLE)
  const [furgonesProgEnPuerto, setFurgonesProgEnPuerto]=useState([])
  const [initialProgPuerto, setInitialProgPuerto]=useState([])
  
  // Furgones en status en almacen (EDITABLE)
  const [furgonesEditables, setFurgonesEditables]=useState([])
  const [initialValueEditable, setInitialValueEditable]=useState([])
  
  // Furgones en status Almacen (CONSUMIBLE)
  const [initialValueFurgones,setInitialValueFurgones]=useState([])
  const [listaFurgonesMaster,setListaFurgonesMaster]=useState([])

  // Lista de material en status Almacen
  const [initialValueMat,setInitialValueMat]=useState([])
  const [listaMat,setListaMat]=useState([])

  useEffect(()=>{
     // ***** BILL OF LADING *****
    // No mostrar bl eliminados
    const blsSinEliminados=dbBillOfLading.filter((bl,index)=>{
      return bl.estadoDoc!=2
    })
    
    //Agregar propiedad de dias restantes
    const blParsed=blsSinEliminados.map((bill)=>{
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

    // Dame solo los BL con sus furgones en almacen
    const blsFiltradosAlmacen=(blsOrdenados.filter((bl)=>{
      let transito=false
      if(bl.furgones.some(furgon=>furgon.status==3)==true){
        transito=true
      }
      if(transito==true){
        return bl
      }
    }))

    setBlFurgonAlmacen(blsFiltradosAlmacen)
    setInitialBLFurgonAlmacen(blsFiltradosAlmacen)

    // Dame solo los BL con sus furgones en almacen
    const blsFiltradosPuerto=(blsOrdenados.filter((bl)=>{
      let transito=false
      if(bl.furgones.some(furgon=>furgon.status==2)==true){
        transito=true
      }
      if(transito==true){
        return bl
      }
    }))

    setBlFurgonPuerto(blsFiltradosPuerto)
    setInitialFurgonPuerto(blsFiltradosPuerto)

    // ************* CONTENEDORES *************
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
                descargado:furgon.descargado?furgon.descargado:false,
              }
            ]
        }
      }
    }

    // Ordenar por dias restantes
    const sortFurgones=furgones.sort( (a, b)=> {
      return a.diasRestantes - b.diasRestantes;
    });

    // **** Todos los furgones en status almacen (consumible) ****
    const furgonesConsumibles=sortFurgones.filter((furgon)=>{
      return furgon.status==3
    })

    setInitialValueFurgones(furgonesConsumibles)
    setListaFurgonesMaster(furgonesConsumibles)

    // ****De los furgones en status PUERTO toma los que esten en stand by, es decir programado en la semana (editable)****
    const furgonesProgEdit=sortFurgones.filter((furgon)=>{
      if( furgon.status==2 && furgon.standBy==2){
        return furgon
      }
    }).map((furgon)=>{
      return{
        ...furgon,
        llegadaAlmacenMostrar:''
      }
    })
    setInitialProgPuerto(furgonesProgEdit)
    setFurgonesProgEnPuerto(furgonesProgEdit)

    // *****Todos los furgones en status almacen (editable)****
    const furgonesAlmacenEdit=sortFurgones.filter((furgon)=>{
      return furgon.status===3
    })

    setFurgonesEditables(furgonesAlmacenEdit)
    setInitialValueEditable(furgonesAlmacenEdit)

    // ***** MATERIALES *****
    let materialesBL = [];
      for (const bill of dbBillOfLading) {
        if(bill.estadoDoc!=2){
          for (const furgon of bill.furgones) {
            if(furgon.status==3){
              for (const material of furgon.materiales) {
                materialesBL=[
                  ...materialesBL,
                  {
                    ...material,
                    furgon:furgon.numeroDoc,
                    proveedor:bill.proveedor ,
                    llegadaAlPais:furgon.llegadaAlPais,
                    bl:bill.numeroDoc,
                    destino:furgon.destino
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
              furgon.puerto.toLowerCase().includes(entradaMaster)
            ){
              return furgon
            }
          }))
        }
      }
      // else if(arrayOpciones[1].select==true){
      //   if(e.target.name=='inputBuscar'){
      //     setListaMat(initialValueMat.filter((item)=>{
      //       if( 
      //         item.codigo.toLowerCase().includes(entradaMaster)||
      //         item.descripcion.toLowerCase().includes(entradaMaster)||
      //         item.qty.toString().includes(entradaMaster)||
      //         item.furgon.toLowerCase().includes(entradaMaster)||
      //         item.bl.toLowerCase().includes(entradaMaster)||
      //         item.proveedor.toLowerCase().includes(entradaMaster)||
      //         item.ordenCompra.toLowerCase().includes(entradaMaster)||
      //         item.comentarios.toLowerCase().includes(entradaMaster)
      //         ){
      //           return item
      //         }
      //     }))
      //   }
      // }

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
      // {
      //   nombre:'Materiales',
      //   opcion:1,
      //   select: false
      // },
    ])

    const handleOpciones=(e)=>{
      setBuscarDocInput('')
      setModoEditable({
        arrived:false,
        docSend:false
      })

      let index=Number(e.target.dataset.id)
      if(index==0){
        setHabilitar({
          ...habilitar,
          search:true,
          destino:true,
        })
      }
      if(index==1){
        setHabilitar({
          ...habilitar,
          search:true,
          destino:false,
        })
      }
   
      setArrayOpciones(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );
    }


  // // ******************** MANEJANDO PROGRAMACION EDITABLE ******************** //
  const [listDestinos, setListDestinos]=useState([])
  const [refreshDestino, setRefreshDestino]=useState(false)
  useEffect(()=>{
    setDestinoDocInput('')
    setFurgonesProgEnPuerto(initialProgPuerto)
    setFurgonesEditables(initialValueEditable)
   // Obtener listado de destinos para crear el menu desplegable
   let destinos=new Set()
   const destinosTodos=[]

   if(modoEditable.furgonArrived==true&&modoEditable.docSend==false){
     if(initialProgPuerto.length>0){
       initialProgPuerto.forEach((furgon)=>{
         if(furgon.standBy==2){
           destinos.add(furgon.destino)
           destinosTodos.push(furgon.destino)
          }
        })
      }
    }
    else if(
      modoEditable.docSend==true&&modoEditable.furgonArrived==false||
      arrayOpciones[0].select==true
    ){
      if(initialValueEditable.length>0){
        initialValueEditable.forEach((furgon)=>{
          if(furgon.status==3){
            destinos.add(furgon.destino)
            destinosTodos.push(furgon.destino)
            }
          })
      }
    }
   
   let arrayDestinos=(Array.from(destinos))
   let newListDestino=[]

   arrayDestinos.forEach((dest)=>{
    const qtyDestinos=destinosTodos.filter((lugar)=>{
      if(lugar==dest){
        return lugar
      }
    })

    let stringDestino=`${qtyDestinos.length} - ${qtyDestinos[0]}`
    newListDestino=([
      ...newListDestino,
      stringDestino
    ])
   })

   console.log('paso')
   setListDestinos(newListDestino)
  },[modoEditable,initialProgPuerto,initialValueEditable,arrayOpciones])

  const [destinoDocInput,setDestinoDocInput]=useState('')
  const handleDestino=(e)=>{
    setDestinoDocInput(e.target.value.toLowerCase())
    let entrada=e.target.value.toLowerCase()
    const posicionCaracter = entrada.indexOf('-');

    let entradaMaster= entrada.slice(posicionCaracter + 2);

    if(modoEditable.furgonArrived==true&&modoEditable.docSend==false){
      if(entradaMaster!=''){
        setFurgonesProgEnPuerto(initialProgPuerto.filter((furgon)=>{
          if(furgon.destino.toLowerCase()==entradaMaster){
            return furgon
          }
        }))
      } 
      else if(entradaMaster==''){
        setFurgonesProgEnPuerto(initialProgPuerto)
      }
    }
    else if(modoEditable.docSend==true&&modoEditable.furgonArrived==false){
      if(entradaMaster!=''){
        setFurgonesEditables(initialValueEditable.filter((furgon)=>{
          if(furgon.destino.toLowerCase()==entradaMaster){
            return furgon
          }
        }))
      }
      else if(entradaMaster==''){
        setFurgonesEditables(initialValueEditable)
      }

    }
    else if(arrayOpciones[0].select==true){
      if(entradaMaster!=''){
        setListaFurgonesMaster(initialValueFurgones.filter((furgon)=>{
          if(furgon.destino.toLowerCase()==entradaMaster){
            return furgon
          }
        }))
      }
      else if(entradaMaster==''){
        setListaFurgonesMaster(initialValueFurgones)
      }
    }


    // setRefreshDestino(!refreshDestino)
  }

  // ***************** CODIGO PARA CONFIRMAR LLEGADA (Arrived) ***************

  const funcionArrivar=()=>{

    setModoEditable({
      furgonArrived:true,
      docSend:false
    })
    setHabilitar({
      ...habilitar,
      search:false,
      destino:true,
    })

    setArrayOpciones(arrayOpciones.map((opciones)=>{
      return {
        ...opciones,
        select:false
      }
    }))
  }



  const handleInputsTabla=(e)=>{
    let noFurgon=e.target.dataset.furgon
    const {value,name}=e.target
    let validacion={
      fechaAnterior:true
    }
  
    if(name=='llegadaAlmacen'){
      const annio =value.slice(0,4)
      const mes =value.slice(5,7)
      const dia =value.slice(8,10)
      
      let fechaActual=new Date()
      let llegadaAlmacenES6 = new Date(annio,mes-1,dia);

      if(
        llegadaAlmacenES6.getFullYear()!==fechaActual.getFullYear() ||
        llegadaAlmacenES6.getMonth()!==fechaActual.getMonth() ||
        llegadaAlmacenES6.getDate()!==fechaActual.getDate() 
      ){
         // 2-Una vez que sabemos que no estamos trantando el mismo dia, verifica si llegada almacen es anterior o posterior al dia de hoy
         if(llegadaAlmacenES6>fechaActual){
          validacion.fechaAnterior=false
          setMensajeAlerta('La fecha indicada no puede ser posterior a la fecha actual.')
          setTipoAlerta('warning')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
        }
      }

      if(validacion.fechaAnterior==true){
        const { llegadaAlmacen}=FuncionUpWayDate(annio,mes,dia,3,true)
        const { llegadaDptoImport,llegadaSap}=FuncionUpWayDate(annio,mes,dia,3)
          setFurgonesProgEnPuerto(prevState=>
            prevState.map((furgon,i)=>{
              if(noFurgon==furgon.numeroDoc){
                return{
                  ...furgon,
                  llegadaAlmacenMostrar:value,
                  llegadaAlmacen:llegadaAlmacen,
                  llegadaDptoImport:llegadaDptoImport,
                  llegadaSap:llegadaSap
                }
              }
              else{
                return furgon
              }
          }))      
      }


      }
    }

  const confirmarLlegada=async(e)=>{

    let noFurgon=e.target.dataset.furgon
    let noBill=e.target.dataset.bl
    let expressHOY=e.target.dataset.expresshoy
    let index=Number(e.target.dataset.id)

    const {value,name}=e.target
    const validacion={
      hasFecha:true
    }
    
    if(name=='btnLlegadaAlmacen'||name=='btnLlegadaAlmacenExpressHOY'){   
      // Si el usuario no coloca fecha
      if(furgonesProgEnPuerto[index].llegadaAlmacenMostrar==''&&!expressHOY){
        validacion.hasFecha=false
        setMensajeAlerta('Indique fecha de llegada.')
        setTipoAlerta('warning')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);
      }

      let fechaHoy=''
      if(name=='btnLlegadaAlmacenExpressHOY'){
        validacion.hasFecha=true
        fechaHoy=format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es})
        
      }

      
      if(validacion.hasFecha==true){
        const billUnico = initialFurgonPuerto.find((bill) => noBill === bill.numeroDoc);
        if (billUnico) {
          const furgonUnico = furgonesProgEnPuerto.find((furgon) => furgon.numeroDoc === noFurgon);
          const billParsed = {
            ...billUnico,
            diasRestantes:null,
            furgones: billUnico.furgones.map((furgon) => {
              if (furgon.numeroDoc === noFurgon) {
                return {
                  ...furgonUnico,
                  status: 3,
                  llegadaAlmacenMostrar: '',
                  standBy: '',
                  diasLibres:null,
                  bl:null,
                  diasRestantes:null,
                  llegadaAlmacen:expressHOY?fechaHoy:furgon.llegadaAlmacen
                };
              } else {
                return furgon;
              }
            }),
          };





          const blActualizar = doc(db, "billOfLading", billParsed.id);
          try{
            await updateDoc(blActualizar, billParsed)
            setMensajeAlerta('Llegada de contenedor confirmada.')
            setTipoAlerta('success')
            setDispatchAlerta(true)
            setTimeout(() => {
              setDispatchAlerta(false)
            }, 3000);
            setDestinoDocInput('')
          }
          catch(error){
            console.log(error)
            setMensajeAlerta('Error con la base de datos')
            setTipoAlerta('error')
            setDispatchAlerta(true)
            setTimeout(() => {
              setDispatchAlerta(false)
            }, 3000);
          }

        }
        else{
          setMensajeAlerta('Bill No encontrado.')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
            setDispatchAlerta(false)
          }, 3000);
        }
      }
    }
  }

  
    // ******************** CODIGO AVANZAR *********************
    const avanzar=()=>{

      setModoEditable({
        furgonArrived:false,
        docSend:true
      })

      setHabilitar({
        ...habilitar,
        search:false,
        destino:true,
      })

      setArrayOpciones(arrayOpciones.map((opciones)=>{
        return {
          ...opciones,
          select:false
        }
      }))
      

      // setRefreshDestino(!refreshDestino)
    }
    
    const fijarFurgon =(e)=>{
      let noFurgon=e.target.dataset.furgon
      let index=Number(e.target.dataset.id)

      const fechaActual=new Date()
      const annio=fechaActual.getFullYear()
      const mes=fechaActual.getMonth()
      const dia=fechaActual.getDate()
      const { llegadaAlmacen,llegadaDptoImport,llegadaSap}=FuncionUpWayDate(annio,mes,dia,4,true)

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
              llegadaDptoImport:llegadaDptoImport,
              status:index===i&&noFurgon==furgon.numeroDoc?4:furgon.status
            }
          })
        )
    }

    const guardarCambios=async(e)=>{
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
        // Aqui dice el estado de los bl con furgones en almacen, actualizalo con los furgones de furgonesEditable, obviamente solo los furgones que hallan recibido modificaciones
        const blsUp=initialBLFurgonAlmacen.map((bl)=>{
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
        const blParsed=blFijados.map((bill)=>{
          const furgonesParsed=bill.furgones.map((furgon)=>{
            return{
              ...furgon,
              fijado:null,
              diasLibres:null,
              diasRestantes:null,
              bl:null,
            }
          })
          return{
            ...bill,
            bl:'',
            furgones:furgonesParsed
          }
        })


        const batch = writeBatch(db);
        try {
          blParsed.forEach((bl)=>{
            const blId=bl.id
              const blActualizar= doc(db, "billOfLading", blId);
              batch.update(blActualizar, {
                
                "furgones": bl.furgones,
              });
          })

          await batch.commit();
          setArrayOpciones(prevOpciones => 
            prevOpciones.map((opcion, i) => ({
              ...opcion,
              select: i === 0?true:false,
            }))
          );
          setModoEditable({
            furgonArrived:false,
            docSend:false
          })
            setIsLoading(false)
            setMensajeAlerta('Guardado correctamente.')
            setTipoAlerta('success')
            setDispatchAlerta(true)
            setTimeout(() => {
              setDispatchAlerta(false)
            }, 3000);

            } 
            catch (error) {
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

    // ********* CODIGO DESCARGA REALIZADA ********
    const handleChange=async(e)=>{
      const noFurgon=e.target.dataset.nofurgon
      const noBL=e.target.dataset.nobl
      const checK=e.target.checked

      const blSelect=dbBillOfLading.find(bl=>bl.numeroDoc==noBL)
      const furgonUpdated=blSelect.furgones.map((furgon)=>{
        if(furgon.numeroDoc==noFurgon){
          return{
            ...furgon,
            descargado:checK
          }
        }
        else{
          return furgon
        }
      })

      const blUpdated={
        ...blSelect,
        furgones:furgonUpdated
      }

      const blActualizar = doc(db, "billOfLading", blUpdated.id);

      try{
        await updateDoc(blActualizar, blUpdated)
      }catch(error){
        console.error(error)
        setMensajeAlerta('Error con la base de datos.')
        setTipoAlerta('error')
        setDispatchAlerta(true)
        setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);
      }

    }

    return (
    <>
    {/* <BotonQuery
      accesoFullIMS={accesoFullIMS}
      
      
      
    /> */}
        <TituloEncabezadoTabla className='descripcionEtapa'>
        <Resaltar>Recepcion almacén:</Resaltar> Es la cuarta etapa del ciclo y consta desde que el contenedor llega a su destino (usualmente un almacén de la empresa), y finaliza cuando quien recibe notifica al dpto. de import. que la mercancía llegó correctamente, a través de correo electrónico.
        </TituloEncabezadoTabla>
    <CabeceraListaAll>
      <EncabezadoTabla>
        <TituloEncabezadoTabla>
          Lista de contenedores en proceso de recepcion.
        </TituloEncabezadoTabla>
      </EncabezadoTabla>

        <CajaControles>
          <CajaBtnAvanzar >
        {
           accesoFullIMS&&
          <BtnSimple
              onClick={()=>funcionArrivar()}
              className={`avanzar confirmar`}
            >
            <Icono icon={faCheck} />
            Arrived
            </BtnSimple>}
        {
           accesoFullIMS&&
            (modoEditable.docSend==false?
            <>
              <BtnSimple
                onClick={()=>avanzar()}
                className={`avanzar ${modoEditable.docSend?'modoAvanzar':''}`}
              >
              <Icono icon={faAnglesRight} />
              Avanzar</BtnSimple>
            </>
            :
              <BtnSimple
                onClick={()=>guardarCambios()}
              >
                  <Icono icon={faFloppyDisk} />
                Guardar</BtnSimple>)
          }
          </CajaBtnAvanzar>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          handleOpciones={handleOpciones}
          arrayOpciones={arrayOpciones}
          buscarDocInput={buscarDocInput}
          listDestinos={listDestinos}
          handleDestino={handleDestino}
          tipo={'almacen'}
          destinoDocInput={destinoDocInput}
        />
      </CajaControles>
    </CabeceraListaAll>
    
     <>
     {
      // Lista de todos los furgones *TablaConsulta* **ReturnTabla0**
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
            <CeldaHead title='Dias Libres'>DL</CeldaHead>
            <CeldaHead title='Dias Restantes'>DR</CeldaHead>
            <CeldaHead title='Dias Restantes'>Descargado</CeldaHead>
          </Filas>
          </thead>
          <tbody>
          {
          listaFurgonesMaster.map((furgon,index)=>{
            return(
              <Filas
                key={index}
                className={`
                body 
                ${furgon.diasRestantes<2?'negativo ':''}
                ${furgon.descargado?'descargado':''}
                
                `}
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
                  className='destino'
                  title={furgon.destino}
                >
                    {furgon.destino}
                </CeldasBody>
              
                
                <CeldasBody>
                    {furgon.diasLibres}
                </CeldasBody>
                <CeldasBody>
                    {furgon.diasRestantes}
                </CeldasBody>

                <CeldasBody>
                  <Interruptor 
                    data-noFurgon='romo'
                    valor={furgon.descargado}
                    tipo={'recepAlmacen'}
                    handleChange={handleChange}
                    noFurgon={furgon.numeroDoc}
                    noBL={furgon.bl}
                    disabled={accesoFullIMS?false:true}
                    />
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
          // // Lista de todos los items *TablaContulta* **ReturnTabla1**
          // arrayOpciones[1].select==true?
          // <CajaTabla>
          //   <Tabla>
          //   <thead>
          //     <Filas className='cabeza'>
          //       <CeldaHead>N°</CeldaHead>
          //       <CeldaHead>Codigo*</CeldaHead>
          //       <CeldaHead>Descripcion</CeldaHead>
          //       <CeldaHead>Qty</CeldaHead>
          //       <CeldaHead>Contenedor</CeldaHead>
          //       <CeldaHead>BL</CeldaHead>
          //       <CeldaHead>Proveedor</CeldaHead>
          //       <CeldaHead>Destino</CeldaHead>
          //       <CeldaHead>O/C*</CeldaHead>
          //       <CeldaHead>Comentarios</CeldaHead>
               
          //     </Filas>
          //   </thead>
          //   <tbody>
          //     {
          //        listaMat.map((item,index)=>{
          //         return(
          //           <Filas
          //           className='body'
          //             key={index}
          //           >
          //             <CeldasBody className='index'>{index+1}</CeldasBody>
          //             <CeldasBody>
          //               <Enlaces 
          //                 to={`/importaciones/maestros/articulos/${item.codigo}`}
          //                 target="_blank"
          //                 >
          //                 {item.codigo}
          //               </Enlaces>
          //             </CeldasBody>
          //             <CeldasBody 
          //               title={item.descripcion}
          //               className='descripcion'>
          //                 {item.descripcion}
          //               </CeldasBody>
          //             <CeldasBody>{item.qty}</CeldasBody>
          //             <CeldasBody>
          //               <Enlaces 
          //                 to={`/importaciones/maestros/contenedores/${item.furgon}`}
          //                 target="_blank"
          //                 >
          //                 {item.furgon}
          //               </Enlaces>
          //             </CeldasBody>
          //             <CeldasBody>
          //             <Enlaces 
          //                 to={`/importaciones/maestros/billoflading/${item.bl}`}
          //                 target="_blank"
          //                 >
          //                 {item.bl}
          //               </Enlaces>
                      
          //             </CeldasBody>
                      
          //             <CeldasBody
          //               title={item.proveedor}
          //               className='proveedor'>
          //               {item.proveedor}
          //             </CeldasBody>
          //             <CeldasBody>
                        
          //                 {item.destino}
          //             </CeldasBody>
          //             <CeldasBody>
          //               <Enlaces 
          //                 to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
          //                 target="_blank"
          //                 >
          //                 {item.ordenCompra}
          //               </Enlaces>
          //             </CeldasBody>
                     
          //             <CeldasBody 
          //               title={item.comentarios}
          //               className='comentarios'>
          //               {item.comentarios}</CeldasBody>
          //           </Filas>
          //         )
          //       })
          //     }
          //   </tbody>
          //   </Tabla>
          //   </CajaTabla>
          // :
          // ''
      }


      {/* Modo Confirmar, esta tabla representa la tabla que se usa para confirmar que el furgon llego a X almacen, es decir arrived*/}
      {/* TablaReturn2 */}
      {
        modoEditable.furgonArrived&&
        <>
        <TituloDayStandBy>Programado para hoy</TituloDayStandBy>
        <CajaTabla className='cajaHoy'>
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
            <CeldaHead title='Dias Libres'>DL</CeldaHead>
            <CeldaHead title='Dias Restantes'>DR</CeldaHead>
            <CeldaHead title='Dias Restantes'>Destino</CeldaHead>
            <CeldaHead title='Confirmar llegada de furgon a almacen' >Confirmar</CeldaHead>
          </Filas>
        </thead>
        <tbody>
        {
        furgonesProgEnPuerto.filter((furgon)=>{
          const fechaActual=new Date()

          const annio= furgon.fechaRecepProg.slice(6,10)
          const mes= furgon.fechaRecepProg.slice(3,5)
          const dia= furgon.fechaRecepProg.slice(0,2)
          const fechaFurgon=new Date(
            Number(annio),
            Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
            Number(dia),
          )
          fechaActual.setHours(0, 0, 0, 0);
          fechaFurgon.setHours(0, 0, 0, 0);
          if(fechaActual.getTime()==fechaFurgon.getTime()){
            return furgon
          }
        }).map((furgon,index)=>{
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
              <CeldasBody>
                  {furgon.destino}
              </CeldasBody>
              
              <CeldasBody className='celdaBtn'>
                <BtnSimple
                  data-furgon={furgon.numeroDoc}
                  data-bl={furgon.bl}
                  data-id={index}
                  data-expresshoy={true}
                  onClick={(e)=>confirmarLlegada(e)}
                  name='btnLlegadaAlmacenExpressHOY'
                  className='docEnviado'
                >Confirmar</BtnSimple>
               
              </CeldasBody>
             
            </Filas>
          )
        })
      }
           </tbody>

          </Tabla>
        </CajaTabla>
        </>
        
      }
      {
        // SEMANA
        modoEditable.furgonArrived&&

        <>
        <TituloDayStandBy>Programacion completa</TituloDayStandBy>
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
            <CeldaHead title='Dias Libres'>DL</CeldaHead>
            <CeldaHead title='Dias Restantes'>DR</CeldaHead>
            <CeldaHead title='Dias Restantes'>Destino</CeldaHead>
            <CeldaHead title='Fecha en que el contenedor llego almacen' >Llegó almacen</CeldaHead>
            <CeldaHead title='Confirmar llegada de furgon a almacen' >Confirmar</CeldaHead>
          </Filas>
        </thead>
        <tbody>
        {
        furgonesProgEnPuerto.map((furgon,index)=>{
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
              <CeldasBody>
                  {furgon.destino}
              </CeldasBody>
              <CeldasBody>
                <InputEditable 
                  type='date'
                  data-id={index}
                  data-furgon={furgon.numeroDoc}
                  data-bl={furgon.bl}
                  value={furgonesProgEnPuerto[index].llegadaAlmacenMostrar}
                  name='llegadaAlmacen'
                  onChange={(e)=>{handleInputsTabla(e)}}
                  
                />
              </CeldasBody>
              <CeldasBody className='celdaBtn'>
                <BtnSimple
                  data-furgon={furgon.numeroDoc}
                  data-bl={furgon.bl}
                  data-id={index}
                  onClick={(e)=>confirmarLlegada(e)}
                  name='btnLlegadaAlmacen'
                  className='docEnviado'
                >Confirmar</BtnSimple>
               
              </CeldasBody>
             
            </Filas>
          )
        })
      }
           </tbody>
        
        
        </Tabla>
        </CajaTabla>
        </>
      }
     </>

     {
      // Esta tabla representa todos los furgones que tenemos en status en almacen pero a modo de edicion
      modoEditable.docSend&&
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
            <CeldaHead title='Dias Libres'>DL</CeldaHead>
            <CeldaHead title='Dias Restantes'>DR</CeldaHead>
            <CeldaHead title='Dias Restantes'>Destino</CeldaHead>
            <CeldaHead>Doc Send</CeldaHead>
          </Filas>
        </thead>
        <tbody>
          {
            furgonesEditables.map((furgon,index)=>{
              return(
                <Filas
                key={index}
                className={`body 
                ${furgon.diasRestantes<2?'negativo':''}
                ${furgon.fijado?'fijado':''}`
              }
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
                    <CeldasBody>
                        {furgon.destino}
                    </CeldasBody>
                    <CeldasBody className='celdaBtn'>
                      {
                        furgon.fijado?
                        <BtnSimple
                          data-furgon={furgon.numeroDoc}
                          data-bl={furgon.bl}
                          data-id={index}
                          onClick={(e)=>fijarFurgon(e)}
                          name='btnLlegadaAlmacen'
                          className='docEnviado'
                        >Sin enviar</BtnSimple>
                        :
                        <BtnSimple
                          data-furgon={furgon.numeroDoc}
                          data-bl={furgon.bl}
                          data-id={index}
                          onClick={(e)=>fijarFurgon(e)}
                          name='btnLlegadaAlmacen'
                          className='docEnviado'
                        >Enviados</BtnSimple>
                        

                      }
                    </CeldasBody>



                </Filas>
              )
            })
          }
        </tbody>
      </Tabla>
      </CajaTabla>
     }


     
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

    &.cajaHoy{
      margin-bottom: 25px;
    }

`
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
  @media screen and (max-width:620px){
    margin-bottom: 100px;
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
    color: ${theme.danger};
    /* font-weight: bold; */
  }
  &.fijado{
    background-color: ${theme.fondo};
    color: ${theme.fondoEdTeam};
    &.negativo{
      color: #441818;

    }
  }
  &.descargado{
    background-color: ${theme.success};
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
  /* font-weight: bold; */
`


const CajaControles=styled.div`
  display: flex;
  align-items: start;
  padding-left: 25px;
  /* flex-direction: column; */
  /* justify-content: start; */
  @media screen and (max-width:1000px){
    align-items: start;
    flex-direction: column;
    
  }
  `
const CajaBtnAvanzar=styled.div`
  min-width:200px;
  @media screen and (max-width:900px){
    min-width: 190px;
  }
  @media screen and (max-width:830px){
    margin-bottom: 5px;
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


const ContenedorStandBy=styled.div`

`

const CajaDayStandBy=styled.div`
`
const HR=styled.hr`
  margin-bottom: 100px;
`

const TituloDayStandBy=styled.h2`
border-bottom: 1px solid ${theme.azul2};

  margin-left: 40px;
  &.pasado{
    font-size: 0.9rem;
    color: ${theme.azul1};
    border-bottom: 1px solid black;
    
  }
  &.tituloCabeza{
    display: inline-block;
    margin-left: 20px;
    color: ${theme.azul1};
    background-color: ${theme.azulOscuro1Sbetav};
  }
  &.tituloEditable{
    display: inline-block;
    margin-left: 20px;
    color: ${theme.azul1};

    /* background-color: ${theme.azulOscuro1Sbetav}; */
  }

  color: ${theme.azul2};
`


const InputCelda=styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul1};
  &.filaSelected{
    background-color: inherit;
  }
  border: none;
  width: 100%;
  display: flex;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  
`

const InputEditable=styled(InputCelda)`
  height: 100%;
  width: 100%;
  margin: 0;
  font-size: 0.8rem;

`

const Imagen=styled.img`
  &.dispacth{
    width: 25px;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 2px;
    border-radius: 5px;
    &:hover{
      border: 1px solid ${theme.azul2};
    }
  }
`

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion{
    cursor: pointer;
  }
`
const BtnDispath=styled(BtnGeneralButton)`
  width: 40%;
  margin: 5px;
  height: 35px;
  font-size: 0.9rem;
  
`
const TextoDiasAtrasados=styled.h2`
  color:${theme.danger};
  text-align: center;
  
`

