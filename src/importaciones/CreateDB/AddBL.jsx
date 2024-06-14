import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { TablaAddBLOrden } from '../Tablas/TablaAddBLOrden';
import { Alerta } from '../../components/Alerta';
import { TablaAddBLFurgon } from '../Tablas/TablaAddBLFurgon';
import { TablaAddBLListaFurgones } from '../Tablas/TablaAddBLListaFurgones';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { collection, doc,setDoc, writeBatch } from 'firebase/firestore';
import db from '../../firebase/firebaseConfig';
import { ModalLoading } from '../../components/ModalLoading';
import FuncionUpWayDate from '../components/FuncionUpWayDate';
// import { BotonQuery } from '../../components/BotonQuery';

export const AddBL = ({
  dbBillOfLading,
  dbOrdenes,
  setDBOrdenes
}) => {

  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const reiniciarCosas=(tipo)=>{
    if(tipo=='fijarBL'){
      inputBLRef.current.disabled=true;
      inputProveedorRef.current.disabled=true;
      inputNavieraRef.current.disabled=true;
      inputDiasLibresRef.current.disabled=true;
      inputPuertoRef.current.disabled=true;
      inputLlegadaPaisRef.current.disabled=true;
      inputNoFurgonRef.current.focus();
      setIsBLestablecido(true);
    }
    else if(tipo==='editarBl'){
      inputBLRef.current.disabled=false;
      inputProveedorRef.current.disabled=false;
      inputNavieraRef.current.disabled=false;
      inputDiasLibresRef.current.disabled=false;
      inputPuertoRef.current.disabled=false;
      inputLlegadaPaisRef.current.disabled=false;
      setIsBLestablecido(false);
    }
    else if(tipo==='fijarFurgon'){
      setCopiarAFurgonMaster([]);
      setVentanaJuntaMateriales(1);

      inputNoFurgonRef.current.disabled=true;
      inputTamannioFurgonRef.current.disabled=true;
      inputOrdenCompraRef.current.focus();
    }
    else if(tipo=='editarFurgon'){
      inputNoFurgonRef.current.disabled=false;
      inputTamannioFurgonRef.current.disabled=false;
      setCopiarAFurgonMaster([]);
      setFurgonEditable({});
      setVentanaJuntaMateriales(0);
    }
    else if(tipo=='cambiarOrden'){
      inputOrdenCompraRef.current.disabled=false;
      inputOrdenCompraRef.current.focus();
      setVentanaOrdenVisible(false);

      setValorInputMainOrden('');
      setOCMaster({});
    }
    else if(tipo==='enviarBL'){
      inputBLRef.current.disabled=false;
      inputProveedorRef.current.disabled=false;
      inputNavieraRef.current.disabled=false;
      inputDiasLibresRef.current.disabled=false;
      inputPuertoRef.current.disabled=false;
      inputLlegadaPaisRef.current.disabled=false;

      setIsBLestablecido(false);
      setValoresInputsBL(initialValueBL);
      setBLEditable(initialValueBLEditable);
      setFurgonEditable(initialValueFurgonEditable);

      // Reiniciando datos furgon
      setValoresInputsFurgon(initialValueFurgon);

      inputNoFurgonRef.current.disabled=false;
      inputTamannioFurgonRef.current.disabled=false;
      // Reiniciando datos o/c
      setVentanaOrdenVisible(false);
      setOCMaster({});
      setValorInputMainOrden('');
      setCopiarAFurgonMaster([]);
      inputOrdenCompraRef.current.disabled=false;
    }
  };

  // ******************** BILL OF LADING ******************** //
  const inputBLRef= useRef(null);
  const inputProveedorRef= useRef(null);
  const inputNavieraRef= useRef(null);
  const inputDiasLibresRef= useRef(null);
  const inputPuertoRef= useRef(null);
  const inputLlegadaPaisRef= useRef(null);

  const handleInputsBL = (event) => {
    const { name, value } = event.target;
    const transformedValue =
    name === 'numero' ?
      value.toUpperCase()
      :
      name === 'llegadaAlPais' ?
        format(
          (new Date(
            value.slice(0,4), //annio
            value.slice(5,7)-1, //mes
            value.slice(8,10))), //dia
          `dd/MM/yyyy hh:mm:ss:SSS aa`, //formato
          {locale:es}) //idioma español
        :
        value;

    if(name=='llegadaAlPais'){
      setValoresInputsBL((prevEstadosBL) => ({
        ...prevEstadosBL,
        ['llegadaAlPaisMostrar']: value,
      }));
    }

    setValoresInputsBL((prevEstadosBL) => ({
      ...prevEstadosBL,
      [name]: transformedValue,
    }));
  };
  const initialValueBL={
    numero:'',
    proveedor:'',
    naviera:'',
    diasLibres:7,
    puerto:'Haina',
    llegadaAlPais:'',
    llegadaAlPaisMostrar:'',
  };
  const [valoresInputsBL, setValoresInputsBL]=useState(initialValueBL);

  const initialValueBLEditable={
    numeroDoc:'',
    proveedor:'',
    naviera:'',
    diasLibres:7,
    puerto:'',
    llegadaAlPais:'',
    fechaCreacion:'',
    estadoDoc:0,
    furgones:[],
  };
  const[blEditable, setBLEditable]=useState(initialValueBLEditable);

  const [isBLestablecido, setIsBLestablecido]=useState(false);
  const fijarBL=(e)=>{
    e.preventDefault();
    let validacion={
      bl:false,
      blConEspacios:true,
      proveedor:false,
      naviera:false,
      diasLibres:false,
      puerto:false,
      llegadaPais:false,
    };
    for (let i = 0; i < e.target.length; i++) {
      switch (e.target[i].name) {
      case 'numero':
        if (e.target[i].value !== '') {
          setBLEditable(prevState => ({
            ...prevState,
            numeroDoc: e.target[i].value
          }));
          validacion.bl = true;
        }
        break;
      case 'proveedor':
        if (e.target[i].value !== '') {
          setBLEditable(prevState => ({
            ...prevState,
            proveedor: e.target[i].value
          }));
          validacion.proveedor = true;
        }
        break;

      case 'naviera':
        if(e.target[i].value!=''){
          setBLEditable(prevState => ({
            ...prevState,
            naviera: e.target[i].value
          }));
          validacion.naviera=true;
        }
        break;
      case 'diasLibres':
        if(e.target[i].value!=''){
          setBLEditable(prevState => ({
            ...prevState,
            diasLibres: Number(e.target[i].value)
          }));
          validacion.diasLibres=true;
        }
        break;
      case 'puerto':
        if(e.target[i].value!=''){
          setBLEditable(prevState => ({
            ...prevState,
            puerto: e.target[i].value
          }));
          validacion.puerto=true;
        }
        break;
      case 'llegadaAlPais':
        if(e.target[i].value!=''){
          setBLEditable(prevState => ({
            ...prevState,
            llegadaAlPais: valoresInputsBL.llegadaAlPais
          }));
          validacion.llegadaPais=true;
        }
        break;
      default:
        break;
      }
    }

    // Si numero de bl tiene espacios
    if(valoresInputsBL.numero.includes(' ')||valoresInputsBL.numero.includes('\n')){
      validacion.blConEspacios==false;
      setMensajeAlerta('El numero de BL no puede contener espacios.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si todo esta correcto
    if(
      validacion.bl==true &&
      validacion.blConEspacios==true &&
      validacion.proveedor==true &&
      validacion.naviera==true &&
      validacion.diasLibres==true &&
      validacion.puerto==true &&
      validacion.llegadaPais==true){

      let blYaExiste=false;
      dbBillOfLading.forEach((bl)=>{
        if(bl.numeroDoc==valoresInputsBL.numero){
          blYaExiste=true;
        }
      });

      if(blYaExiste==true){
        setMensajeAlerta('El numero de BL ingresado ya existe en la base de datos.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return'';
      }
      reiniciarCosas('fijarBL');

      setMensajeAlerta('BL fijado correctamente.');
      setTipoAlerta('success');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
    else{
      setMensajeAlerta('Por favor llene todos los campos del BL.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  const editarBl=()=>{
    reiniciarCosas('editarBl');
  };

  // ******************** CONTAINER ******************** //
  const inputNoFurgonRef= useRef(null);
  const inputTamannioFurgonRef= useRef(null);

  // Para saber cuando la ventana que unifica los materiales esta activa;
  // 0-Inactiva
  // 1-Activa modo agregar Color Azul
  // 2-Activa modo editar color Orange
  const [ventanaJuntaMateriales,setVentanaJuntaMateriales]=useState(0);

  const handleInputsFurgon = (event) => {
    const { name, value } = event.target;
    const transformedValue = name === 'numeroDoc' ? value.toUpperCase() : value;
    setValoresInputsFurgon((prevEstadosFurgon) => ({
      ...prevEstadosFurgon,
      [name]: transformedValue,
    }));
  };

  const initialValueFurgon={
    numeroDoc:'',
    tamannio:"40'",
    bl:''
  };

  const [valoresInputsFurgon, setValoresInputsFurgon]=useState(initialValueFurgon);

  const initialValueFurgonEditable={
    numeroDoc:'',
    tamannio:'',
    seguimientos:[],
    bl:''
  };
  const [furgonEditable, setFurgonEditable]=useState(initialValueFurgonEditable);

  const fijarFurgon=(e)=>{
    e.preventDefault();
    let validacion={
      blFijado:true,
      numeroDoc:true,
      tamannio:true,
      furgonesNoRepetidos:true
    };
    // Si aun no se fija bl
    if(isBLestablecido==false){
      validacion.blFijado=false;
      setMensajeAlerta('Primero se debe fijar BL.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

    }
    // Si el numero de furgon aun no se especifica
    if(valoresInputsFurgon.numero==''){
      validacion.numeroDoc=false;
      setMensajeAlerta('Numero de contenedor sin especificar.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el tamaño esta vacio, esto es mas por preacion de algun error al programar, pues no deberia esta vacio nunca
    if(valoresInputsFurgon.tamannio==''){
      validacion.tamannio=false;
      setMensajeAlerta('Tamaños de contenedor sin especificar.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el numero de furgon ya ha sido agregado al BL
    let furgonExiste=false;
    blEditable.furgones.forEach((furgon)=>{
      if(furgon.numeroDoc==valoresInputsFurgon.numeroDoc){
        furgonExiste=true;
        return'';
      }
    });
    if(furgonExiste==true){
      validacion.furgonesNoRepetidos=false;
      setMensajeAlerta('Este contenedor ya ha sido agregado.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si todo esta correcto
    if(
      validacion.blFijado==true&&
      validacion.numeroDoc==true&&
      validacion.tamannio==true&&
      validacion.furgonesNoRepetidos==true
    )
    {

      setFurgonEditable(prevFurgon => ({
        ...prevFurgon,
        numeroDoc: valoresInputsFurgon.numeroDoc,
        tamannio: valoresInputsFurgon.tamannio
      }));

      reiniciarCosas('fijarFurgon');
      setTimeout(() => {
        tablaFurgonRef.current.scrollIntoView({behavior: 'smooth'});
      }, 100);
    }
  };

  const editarFurgon=()=>{
    reiniciarCosas('editarFurgon');
  };

  // ******************** ORDENES DE COMPRA ******************** //
  const tablaOrdenRef=useRef(null);
  const inputOrdenCompraRef= useRef(null);
  const primerInputTablaOrdenRef=useRef(null);

  const handleInputsOrdenCompra = (event) => {
    if(event.target.value!='+'&&event.target.value!='-'){
      setValorInputMainOrden(event.target.value);
    }
  };

  const [valorInputMainOrden, setValorInputMainOrden]=useState('');
  const [ventanaOrdenVisible, setVentanaOrdenVisible]=useState(false);
  const [ocMaster, setOCMaster]=useState('');
  // newCopiaFurgon es el estado que sirve para manejar el recuadro de la orden de compra
  const [newCopiaFurgon, setNewCopiaFurgon]=useState([]);

  const mostrarOrden=(e)=>{
    e.preventDefault();

    if(valorInputMainOrden==''){
      setMensajeAlerta('Por favor ingrese numero de orden de compra.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return '';
    }

    console.log(dbOrdenes);
    console.log(valorInputMainOrden);
    let ordenExtraida=extrayendoOrdenDB(dbOrdenes, valorInputMainOrden);

    if(ordenExtraida){
      // Estableciendo cosas
      inputOrdenCompraRef.current.disabled=true;
      setVentanaOrdenVisible(true);
      setOCMaster(ordenExtraida);

      setNewCopiaFurgon(
        ordenExtraida.materiales.map((item)=>{
          return{
            ...item,
            qty:'',
            qtyOrden:item.qty,
            ordenCompra:ordenExtraida.numeroDoc,
            despachos:item.despachos
          };
        })
      );
      setTimeout(() => {
        tablaOrdenRef.current.scrollIntoView({behavior: 'smooth'});
        setTimeout(() => {
          primerInputTablaOrdenRef.current.focus();
        }, 250);
      }, 100);

    }
    else{
      console.log('no funciona');
      return'';
    }
  };
  function extrayendoOrdenDB(baseDatos, noOrden){
    console.log(baseDatos);
    console.log(noOrden);
    const ordenExt = baseDatos.find((orden) => orden.numeroDoc == noOrden);
    if(ordenExt){
      return ordenExt;
    }
    else{
      setMensajeAlerta('El numero de O/C no existe en la base de datos.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return undefined;
    }
  }

  const cambiarOrden=()=>{
    reiniciarCosas('cambiarOrden');
  };

  // ******************** COPIA DE ORDEN A FURGONES ******************** //
  const tablaFurgonRef=useRef(null);
  const [copiarAFurgonMaster, setCopiarAFurgonMaster]=useState([]);

  // ****************** LISTA (COMPILACION) DE FURGONES***************** //
  const listaFurgonesRef=useRef(null);
  const [indexFurgonEnBL, setIndexFurgonEnBL]=useState(null);
  const [cambiosSinGuardar, setCambiosSinGuardar]=useState(false);

  // ******************** ENVIANDO A LA BASE DE DATOS******************** //
  const [isLoading,setIsLoading]=useState(false);

  const enviarObjeto=async(e)=>{
    e.preventDefault();
    let validacion={
      hasCabeceraBL:true,
      blSinEspacios:true,
      numerosDiferentesTodosFurgones:true,
      tieneFurgones:true,
      todosFurgonesConMateriales:true,
      furgonesConNumero:true,
      blNoExiste:true,
      sinEditarFurgon:true,
      noSeEstaEditandoBL:true,
    };
    // Si numero de BL esta vacio, esto no deberia ejecutarse nunca, colocado "por si acaso"
    if(blEditable.numeroDoc==""){
      validacion.hasCabeceraBL==false;
      setMensajeAlerta('Favor colocar numero de BL.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si numero de bl tiene espacios
    if(blEditable.numeroDoc.includes(' ')||blEditable.numeroDoc.includes('\n')){
      validacion.blSinEspacios==false;
      setMensajeAlerta('El numero de BL no puede contener espacios.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // Si algun numero de furgon se repite
    const numerosDeFurgones = new Set();
    let hayDuplicados = false;
    blEditable.furgones.forEach(furgon => {
      const numeroDoc = furgon.numeroDoc;
      if (numerosDeFurgones.has(numeroDoc)) {
        hayDuplicados = true;
      } else {
        numerosDeFurgones.add(numeroDoc);
      }
    });
    if (hayDuplicados) {
      validacion.numerosDiferentesTodosFurgones=false;
      setMensajeAlerta('Existen numeros de contenedores repetidos.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // Si no se colocaron furgones
    if(blEditable.furgones.length==0){
      validacion.tieneFurgones=false;
      setMensajeAlerta('BL sin contenedores.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // Si algun furgon carece de materiales
    let furgonSinMat=false;
    blEditable.furgones.forEach((furgon)=>{
      if(furgon.materiales.length==0){
        furgonSinMat=true;
        return'';
      }
    });
    if(furgonSinMat){
      validacion.todosFurgonesConMateriales=false;
      setMensajeAlerta('Existen contenedores sin materiales agregados.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // Si algun furgon no tiene numero
    let faltaNumero=false;
    blEditable.furgones.forEach((furgon)=>{
      if(furgon.numeroDoc==''){
        faltaNumero=true;
        return'';
      }
    });
    if(faltaNumero==true){
      validacion.furgonesConNumero=false;
      setMensajeAlerta('Existen contenedores sin numero colocado.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // SI el bl ingresado ya existe en la base de datos
    // Esto no deberia ejecutarse, pues si aun no se fija bl debe dar error
    // Es util colocarlo "por si acaso"
    dbBillOfLading.forEach((bl)=>{
      if(bl.numeroDoc==blEditable.numeroDoc){
        validacion.blNoExiste=false;
      }
    });
    if(validacion.blNoExiste==false){
      setMensajeAlerta('El numero de BL ingresado ya existe en la base de datos.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si hay un furgon en ejecucion, es decir si la ventana TablaAddBLFurgon de copiarAfurgonMaster... esta activa
    if(ventanaJuntaMateriales>0){
      validacion.sinEditarFurgon=false;
      setMensajeAlerta(' Primero guarde o cancele el contenedor que esta agregando.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si es editando bl
    if(isBLestablecido==false){
      validacion.noSeEstaEditandoBL=false;
      setMensajeAlerta('Se debe fijar Bill Of Lading.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si todo esta correcto
    if(
      validacion.hasCabeceraBL==true&&
      validacion.blSinEspacios==true&&
      validacion.numerosDiferentesTodosFurgones==true&&
      validacion.tieneFurgones==true&&
      validacion.todosFurgonesConMateriales==true&&
      validacion.furgonesConNumero==true&&
      validacion.blNoExiste==true&&
      validacion.sinEditarFurgon==true&&
      validacion.noSeEstaEditandoBL==true
    ){

      setIsLoading(true);

      // ******Alimentar dbOrdenes con los despachos******

      // Esto se hace aqui al final, es decir cuando el usuario presiona Enviar, esto para que cualquier cambio como,
      // Cambiar numero de bl, numero de furgon, qty de los materiales, etc, queden registradas correctamente en las ordenes, de esta manera el codigo es mas sencillo y limpio

      // Crea un array con todos los despachos del bl
      const findedFurgon = blEditable.furgones.flatMap((furgon) =>
        furgon.materiales.map((item) => ({
          ...item,
          furgon:furgon.numeroDoc,
          numeroBL: blEditable.numeroDoc,
        }))
      );

      // Dame solo las ordenes abiertas, dado que estamos creando bl, no podria existir una orden cerrada a usar
      const filterOrden=dbOrdenes.filter((orden) => orden.estadoDoc==0);

      // Recorre todas las ordenes abiertas
      const parsedOrden=filterOrden.map((orden)=>{

        // Elimina todos los despachos de esa orden que tengan el numero de bl del bl master
        // ***Este punto lo podemos obviar dado que en AddBL estamos agregando  o creando despachos no existen despachosa eliminar***

        // Agrega todos los despachos a partir de los furgones del bl editable
        const addedMateriales=orden.materiales.map((item)=>{
          const despachado=findedFurgon.filter((desp)=>{
            if(
              desp.ordenCompra===orden.numeroDoc&&
              desp.codigo===item.codigo
            ){
              return desp;
            }
          });

          if(despachado.length>0){
            return {...item, despachos:[...item.despachos, ...despachado]};
          }
          else{
            return item;
          }
        });
        return {...orden,materiales:addedMateriales};
      });

      setDBOrdenes(parsedOrden);
      const nuevaDbOrden=parsedOrden;

      // ******Alimentar base datos BL******

      // Obtener una lista de todas las ordenes de compra que se usaron en este BL, usaremos esta lista para afectar en la base de datos unicamente las ordenes de compra que hallamos usado
      const ordenesUsadas = [...new Set(blEditable.furgones.flatMap(furgon => furgon.materiales.map(item => item.ordenCompra)))];

      //Definiendo info de cabecera a BL
      let annio=blEditable.llegadaAlPais.slice(6,10);
      let mes=blEditable.llegadaAlPais.slice(3,5);
      let dia=blEditable.llegadaAlPais.slice(0,2);

      const {llegadaAlmacen, llegadaDptoImport,llegadaSap}=FuncionUpWayDate(annio,mes,dia,2);

      const furgonesParsed=blEditable.furgones.map((furgon)=>{
        const materialParsed=furgon.materiales.map((item)=>{
          return {
            ...item,
            furgon:furgon.numeroDoc
          };
        });

        return {
          ...furgon,
          materiales:materialParsed,
          destino:'Pantoja',
          status:1,
          llegadaAlmacen:llegadaAlmacen,
          llegadaDptoImport:llegadaDptoImport,
          llegadaSap:llegadaSap,
        };
      });

      // Agregando algunas propiedades

      const newBL=({
        ...blEditable,
        fechaCreacion:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        furgones:furgonesParsed,
        estadoDoc:0
      });

      setBLEditable(newBL);

      // CARGANDO BASE DE DATOS****

      // Crear un lote para operaciones atómicas,
      // aqui busco que cuando el usuario presione Enviar la app envie varias ejecuciones en una misma operaciones pues se necesita 1-actualzar dbOrdenes y 2-cargar un nuevo BL,
      // por lo cual se debe hacer con un lote y esta fue la solucion que pude conseguir
      // de otra manera es decir si se hace individual y ocurre por ejemplo algun error con crear bl pues se actualizara dbOrdenes y billOfLading no se crearia el nuevo BL, por lo tanto tendria incoherencias
      const batch = writeBatch(db);
      try {
      // Actualizar documentos en dbOrdenes dentro del lote
        for (let i = 0; i < nuevaDbOrden.length; i++) {
          const numeroDoc = nuevaDbOrden[i].numeroDoc;

          if (ordenesUsadas.includes(numeroDoc)) {
            const ordenId = nuevaDbOrden[i].id;
            const materiales = nuevaDbOrden[i].materiales;

            const ordenActualizar = doc(db, "ordenesCompra", ordenId);

            // Agregar la operación de actualización al lote
            batch.update(ordenActualizar, {
              "materiales": materiales,
            });
          }
        }

        // Agregar nuevo documento a billOfLading en el mismo lote
        const collectionBLRef = collection(db,'billOfLading');
        const nuevoDocumentoRef = doc(collectionBLRef);
        setDoc(nuevoDocumentoRef, newBL);
        await batch.commit();

        reiniciarCosas('enviarBL');
        setIsLoading(false);
        inputBLRef.current.focus();
        setMensajeAlerta('BL cargado correctamente a la Base de Datos.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);

      }
      catch (error) {
        console.error('Error al realizar la transacción:', error);
        setIsLoading(false);
        setMensajeAlerta('Error con la base de datos.');
        setTipoAlerta('error');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 7000);
      }
    }
  };

  // // ***************************** SHORT HAND ******************************* //
  useEffect(() => {
    const shortHands = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        enviarObjeto(e);
      }
    };

    document.addEventListener('keyup', shortHands);

    return () => {
      document.removeEventListener('keyup', shortHands, false);
    };
  }, [
    dbOrdenes,
    dbBillOfLading,
    blEditable,
    initialValueBL,
    valoresInputsBL,
    initialValueBLEditable,
    blEditable,
    isBLestablecido,
    ventanaJuntaMateriales,
    initialValueFurgon,
    valoresInputsFurgon,
    initialValueFurgonEditable,
    furgonEditable,
    valorInputMainOrden,
    ventanaOrdenVisible,
    ocMaster,
    newCopiaFurgon,
    indexFurgonEnBL,
    cambiosSinGuardar,
    copiarAFurgonMaster,
  ]);

  return (
    <Container>
      {/* <BotonQuery
        dbBillOfLading={dbBillOfLading}
        valoresInputsBL={valoresInputsBL}
      /> */}
      <form action="" onSubmit={(e)=>enviarObjeto(e)}>
        <CajaEncabezado>
          <Titulo>Crear Bill of Lading</Titulo>
          <BtnHead
            type='submit'
            onClick={(e)=>enviarObjeto(e)}
          >
            <Icono icon={faPaperPlane}/>
          Enviar</BtnHead>

        </CajaEncabezado>
      </form>
      <ContainerSecond>
        <Formulario action="" onSubmit={(e)=>fijarBL(e)}>
          <CajaAdd>
            <CajitaAdd>
              <TextoLabel>Numero BL:</TextoLabel>
              <Input
                type='text'
                ref={inputBLRef}
                name='numero'
                value={valoresInputsBL.numero}
                onChange={(e)=>{handleInputsBL(e);}}
                className={isBLestablecido?'fijado':''}
                autoComplete='off'
              />
            </CajitaAdd>

            <CajitaAdd>
              <TextoLabel>Proveedor:</TextoLabel>
              <Input
                type='text'
                ref={inputProveedorRef}
                name='proveedor'
                value={valoresInputsBL.proveedor}
                onChange={(e)=>{handleInputsBL(e);}}
                className={isBLestablecido?'fijado':''}
                autoComplete='off'
              />
            </CajitaAdd>

            <CajitaAdd>
              <TextoLabel>Naviera:</TextoLabel>
              <Input
                type='text'
                ref={inputNavieraRef}
                name='naviera'
                value={valoresInputsBL.naviera}
                onChange={(e)=>{handleInputsBL(e);}}
                className={isBLestablecido?'fijado':''}
                autoComplete='off'
              />

            </CajitaAdd>

            <CajitaAdd>
              <TextoLabel>Puerto:</TextoLabel>
              <MenuDesplegable
                ref={inputPuertoRef}
                name='puerto'
                value={valoresInputsBL.puerto}
                onChange={(e)=>{handleInputsBL(e);}}
                className={isBLestablecido?'fijado':''}
              >
                <option value="Haina">Haina</option>
                <option value="Caucedo">Caucedo</option>
                <option value="Otros">Otros</option>
              </MenuDesplegable>
            </CajitaAdd>
            <CajitaAdd>
              <TextoLabel>Dias libres:</TextoLabel>
              <Input
                type='text'
                ref={inputDiasLibresRef}
                name='diasLibres'
                value={valoresInputsBL.diasLibres}
                onChange={(e)=>{handleInputsBL(e);}}
                className={isBLestablecido?'fijado':''}
                autoComplete='off'
              />

            </CajitaAdd>
            <CajitaAdd>
              <TextoLabel>Llegada al pais:</TextoLabel>
              <Input
                type='date'
                ref={inputLlegadaPaisRef}
                name='llegadaAlPais'
                value={valoresInputsBL.llegadaAlPaisMostrar}
                onChange={(e)=>{handleInputsBL(e);}}
                className={isBLestablecido?'fijado':''}
                autoComplete='off'
              />
            </CajitaAdd>
            <CajaBotonesForm>
              <BtnEstacebler type='submit'>Fijar</BtnEstacebler>
              <BtnEstacebler
                type='button'
                onClick={()=>{editarBl();}}
              >
                  Editar</BtnEstacebler>
            </CajaBotonesForm>
          </CajaAdd>
        </Formulario>

        <CajaFurgonAdded>
          <TituloFurgon>Lista de contenedores:</TituloFurgon>
          <CajitaFurgonAdded>
            <TablaAddBLListaFurgones
              blEditable={blEditable}
              setBLEditable={setBLEditable}
              tablaFurgonRef={tablaFurgonRef}
              setFurgonEditable={setFurgonEditable}
              setCopiarAFurgonMaster={setCopiarAFurgonMaster}
              listaFurgonesRef={listaFurgonesRef}
              ventanaJuntaMateriales={ventanaJuntaMateriales}
              setVentanaJuntaMateriales={setVentanaJuntaMateriales}
              setIndexFurgonEnBL={setIndexFurgonEnBL}
              inputNoFurgonRef={inputNoFurgonRef}
              inputTamannioFurgonRef={inputTamannioFurgonRef}
              dbOrdenes={dbOrdenes}
              setDBOrdenes={setDBOrdenes}
              setVentanaOrdenVisible={setVentanaOrdenVisible}
              inputOrdenCompraRef={inputOrdenCompraRef}
              setValorInputMainOrden={setValorInputMainOrden}
              initialValueFurgon={initialValueFurgon}
              setValoresInputsFurgon={setValoresInputsFurgon}
              initialValueFurgonEditable={initialValueFurgonEditable}
              setDispatchAlerta={setDispatchAlerta}
              setMensajeAlerta={setMensajeAlerta}
              setTipoAlerta={setTipoAlerta}
              cambiosSinGuardar={cambiosSinGuardar}
              setCambiosSinGuardar={setCambiosSinGuardar}

            />
          </CajitaFurgonAdded>
        </CajaFurgonAdded>

        <CajaFurgon>
          {/* <TituloFurgon>Contenedores:</TituloFurgon> */}
          <FormularioFurgon action="" onSubmit={(e)=>fijarFurgon(e)}>
            <CajitaAddFurgon>
              <TextoLabel>N° contenedor:</TextoLabel>
              <Input
                type='text'
                name='numeroDoc'
                value={valoresInputsFurgon.numeroDoc}
                ref={inputNoFurgonRef}
                onChange={(e)=>{handleInputsFurgon(e);}}
                className={ventanaJuntaMateriales>0?'fijado':''}
                autoComplete='off'
              />
            </CajitaAddFurgon>
            <CajitaAddFurgon>
              <TextoLabel>Tamaño (pies):</TextoLabel>
              <MenuDesplegable
                ref={inputTamannioFurgonRef}
                name='tamannio'
                value={valoresInputsFurgon.tamannio}
                onChange={(e)=>{handleInputsFurgon(e);}}
                className={ventanaJuntaMateriales>0?'fijado':''}
              >
                <Opciones value="20'">20&apos;</Opciones>
                <Opciones value="40'" >40&apos;</Opciones>
                <Opciones value="45'" defaultValue>45&apos;</Opciones>
                <Opciones value="Otros">Otros</Opciones>
              </MenuDesplegable>

            </CajitaAddFurgon>
            <CajaBotonesForm2>
              <BtnAdd2
                type='submit'>Fijar
              </BtnAdd2>
              <BtnAdd2
                type='button'
                onClick={()=>{editarFurgon();}}
              >
                Editar</BtnAdd2>
            </CajaBotonesForm2>
          </FormularioFurgon>
          <form action="" onSubmit={(e)=>mostrarOrden(e)}>
            <CajitaAddFurgon>
              <TextoLabel>Orden de compra:</TextoLabel>
              <Input
                type='text'
                name='ordenCompra'
                value={valorInputMainOrden}
                onChange={(e)=>{handleInputsOrdenCompra(e);}}
                ref={inputOrdenCompraRef}
                className={ventanaOrdenVisible?'fijado':''}
                autoComplete='off'
              />
            </CajitaAddFurgon>
            <CajaBotonesForm2>
              <BtnAddFurgon
                type='submit'
              >Halar
              </BtnAddFurgon>
              <BtnAddFurgon
                onClick={()=>{cambiarOrden();}}
                type='button'
              >Cambiar
              </BtnAddFurgon>
            </CajaBotonesForm2>
          </form>
        </CajaFurgon>

      </ContainerSecond>
      {
        ventanaJuntaMateriales>0?
          <>
            <CajitaEncabezadoTablita>
              <TextoCajitaHead>
                {
                  ventanaJuntaMateriales==1?
                    'Recuadro unificador, materiales de contenedor N°: '+furgonEditable.numeroDoc
                    :
                    ventanaJuntaMateriales==2?
                      'Recuadro unificador, materiales contenedor N°: '+blEditable.furgones[indexFurgonEnBL].numeroDoc
                      :
                      ''
                }
              </TextoCajitaHead>
            </CajitaEncabezadoTablita>
            <TablaAddBLFurgon
              copiarAFurgonMaster={copiarAFurgonMaster}
              setCopiarAFurgonMaster={setCopiarAFurgonMaster}
              tipo={'addBL'}
              blEditable={blEditable}
              setBLEditable={setBLEditable}
              tablaFurgonRef={tablaFurgonRef}
              furgonEditable={furgonEditable}
              setFurgonEditable={setFurgonEditable}

              inputNoFurgonRef={inputNoFurgonRef}
              inputTamannioFurgonRef={inputTamannioFurgonRef}
              ventanaJuntaMateriales={ventanaJuntaMateriales}
              setVentanaJuntaMateriales={setVentanaJuntaMateriales}
              indexFurgonEnBL={indexFurgonEnBL}
              setIndexFurgonEnBL={setIndexFurgonEnBL}
              ventanaOrdenVisible={ventanaOrdenVisible}
              setVentanaOrdenVisible={setVentanaOrdenVisible}

              initialValueFurgon={initialValueFurgon}
              setValoresInputsFurgon={setValoresInputsFurgon}

              initialValueFurgonEditable={initialValueFurgonEditable}

              valorInputMainOrden={valorInputMainOrden}
              cambiosSinGuardar={cambiosSinGuardar}
              setCambiosSinGuardar={setCambiosSinGuardar}

              // Alertas
              setMensajeAlerta={setMensajeAlerta}
              setTipoAlerta={setTipoAlerta}
              setDispatchAlerta={setDispatchAlerta}

            />
          </>
          :
          ''
      }

      {
        ventanaOrdenVisible==true?
          <>

            <CajitaEncabezadoTablita>
              <TextoCajitaHead>
              O/C: {ocMaster.numeroDoc+' - '}
                {ocMaster.proveedor} -
              Fecha {
                  ocMaster.fechaCreacion.slice(0,10)
                }
              </TextoCajitaHead>
            </CajitaEncabezadoTablita>
            <TablaAddBLOrden
              ocMaster={ocMaster}
              setOCMaster={setOCMaster}
              copiarAFurgonMaster={copiarAFurgonMaster}
              setCopiarAFurgonMaster={setCopiarAFurgonMaster}
              tablaOrdenRef={tablaOrdenRef}
              primerInputTablaOrdenRef={primerInputTablaOrdenRef}
              setVentanaOrdenVisible={setVentanaOrdenVisible}
              valorInputMainOrden={valorInputMainOrden}
              setValorInputMainOrden={setValorInputMainOrden}
              inputOrdenCompraRef={inputOrdenCompraRef}
              tipo={'addBL'}
              setVentanaJuntaMateriales={setVentanaJuntaMateriales}
              blEditable={blEditable}
              setMensajeAlerta={setMensajeAlerta}
              setTipoAlerta={setTipoAlerta}
              setDispatchAlerta={setDispatchAlerta}
              newCopiaFurgon={newCopiaFurgon}
              setNewCopiaFurgon={setNewCopiaFurgon}
              ventanaJuntaMateriales={ventanaJuntaMateriales}
              setCambiosSinGuardar={setCambiosSinGuardar}

            />
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
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
};

const Container=styled.div`
  width: 100%;
  min-height: 400px;
  margin: auto;
`;

const Titulo=styled.h2`
  color: ${theme.azul2};
  width: 100%;
  text-align: center;
  text-decoration: underline;
`;

const ContainerSecond=styled.div`
  display: flex;
  gap: 10px;
  padding-top: 20px;
  padding: 20px;
  @media screen and (max-width:980px) {
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    
  }
  @media screen and (max-width:550px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    
  }
`;

const Formulario=styled.form`
  justify-content: center;
  width: 24%;
  @media screen and (max-width:980px) {
      min-width: 40%;
      
    }
  @media screen and (max-width:550px) {
      min-width: 90%;
      
    }
`;

const CajaAdd=styled.div`
  min-height: 100px;
  height: 400px;
  background-color: ${theme.azulOscuro1Sbetav2};
  border-radius: 20px 0 20px 0;
  padding: 10px;
  border: 1px solid ${theme.azul1};
  display: flex;
    flex-direction: column;
    align-items: center;
 
`;

const CajitaAdd=styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 10px;
`;

const TextoLabel=styled.span`
  color: ${theme.azul1};
  margin-bottom: 4px;
  
`;
const Input=styled.input`
  height: 30px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${theme.azul1};
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 10px;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }
`;

const MenuDesplegable=styled.select`
   height: 35px;
  outline: none;
  border-radius: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 10px;
  border: 1px solid ${theme.azul1};
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }
 `;

const Opciones = styled.option`
  height:100px;
  padding: 100px;
  &:hover{
    cursor: pointer;
  }
`;

const CajaFurgon=styled(CajaAdd)`
  padding-top: 10px;
  overflow: hidden;
  width: 24%;
  @media screen and (max-width:980px){
    min-width: 40%;
    
  }
  @media screen and (max-width:550px){
    min-width: 90%;
    
  }
`;

const TituloFurgon=styled.h2`
  color: ${theme.azul1};
  font-size: 1.2rem;
  text-decoration: underline;
  width: 100%;
  height: 45px;
  padding: 10px;
  background-color: ${theme.azulOscuro1Sbetav3};
`;
const CajitaAddFurgon=styled(CajitaAdd)`
  width: 85%;
  margin: auto;
`;
const CajaFurgonAdded=styled(CajaAdd)`
  width: 50%;
  padding: 0;
  /* padding-top: 20px; */
  overflow: hidden;
  @media screen and (max-width:550px){
    min-width: 90%;
    
  }
`;

const BtnAddFurgon=styled(BtnGeneralButton)`
  width: auto;
  padding: 10px 4px;
  margin: 8px;
  min-width: 30%;
  margin-top: 20px;
  border: 1px solid transparent;
  &:focus{
    border: 1px solid white;
  }
`;

const BtnAdd2=styled(BtnAddFurgon)`
  width: 40px;
`;

const CajitaFurgonAdded=styled.div`
  overflow: auto;
  &::-webkit-scrollbar{
  width: 3px;
  }
  &::-webkit-scrollbar-thumb{
  background-color: #19b4ef;
  border-radius: 7px;
  } 
`;

const CajaEncabezado=styled.div`
  background-color: ${theme.azulOscuro1Sbetav2};
  padding: 5px;
  display: flex;
  justify-content: space-around;
`;

const BtnHead=styled(BtnGeneralButton)`
width: auto;
padding: 10px;
white-space: nowrap;
margin: 0;
`;
const Icono=styled(FontAwesomeIcon)`
margin-right: 4px;
`;

const BtnEstacebler =styled(BtnGeneralButton)`
  width: 45%;
  margin: 0;
  padding: 10px;
  border: 1px solid transparent;
  &:focus{
    border: 1px solid white;
  }
`;

const CajaBotonesForm=styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  gap: 5px;
  justify-content: center;
`;
const CajaBotonesForm2=styled(CajaBotonesForm)`
  padding: auto ;
`;

const CajitaEncabezadoTablita=styled.div`
  background-color: ${theme.azulOscuro1Sbetav2};
`;

const TextoCajitaHead=styled.h2`
  color:white;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 400;
  
`;

const FormularioFurgon= styled.form`
`;
// 1707 es la ultima linea