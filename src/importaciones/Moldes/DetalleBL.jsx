import { useRef, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import db from '../../firebase/firebaseConfig';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TablaMultiFurgon } from '../Tablas/TablaMultiFurgon';
import { faEdit, faLock, faLockOpen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSLoader } from '../../components/CSSLoader';
import { ControlesTabla } from '../components/ControlesTabla';
import { Alerta } from '../../components/Alerta';
import { format } from 'date-fns';
import { es } from "date-fns/locale";
import { Advertencia } from '../../components/Advertencia';
import { TablaAddBLOrden } from '../Tablas/TablaAddBLOrden';
import { TablaAddBLFurgon } from '../Tablas/TablaAddBLFurgon';
import { ModalLoading } from '../../components/ModalLoading';
// import { BotonQuery } from '../../components/BotonQuery';
import { useEffect } from 'react';
import FuncionUpWayDate from '../components/FuncionUpWayDate';
import { Interruptor } from '../../components/Interruptor';

export const DetalleBL = ({
  blMaster,
  dbBillOfLading,
  dbOrdenes,
  setDBOrdenes,
  docEncontrado,
  setRefresh,
  refresh,
  userMaster,
}) => {

  // // *********************** RECURSOS GENERALES ************************** //
  const navegacion=useNavigate();
  const [isLoading,setIsLoading]=useState(false);
  let location = useLocation();

  // Para obtener el estado del documento; Abierto, Cerrado, Eliminado
  const [estadoDoc, setEstadoDoc]=useState('epty');

  // Para si el usuario elimina el documento, realmente Caeloss no elimina nada sino que le cambia el estado a eestadoDoc:2 y su numero cambia y es basicamente agregarle al inicio E0 y si el usuario crea otro documento con el mismo numero y lo elimina tambien entonces el proximo tendra el nombre de E1 y asi sucesivamente
  const [numeroEliminado, setNumeroEliminado]=useState('');

  useEffect(()=>{
    // Calcular estado del documento Abierto o Cerrado
    if(blMaster.furgones.length>0){
      console.log(blMaster.furgones);
      if(blMaster.furgones.some(furgon=>furgon.status<5)==true){
        setEstadoDoc(0);
      }
      else if(blMaster.furgones.every(furgon=>furgon.status>=5)==true){
        setEstadoDoc(1);
      }
      if(blMaster.estadoDoc==2){
        setEstadoDoc(2);
      }

      // Definir numero de eliminacion E1 / E2 / E3 etc
      let num=0;
      // eslint-disable-next-line no-unused-vars
      for(const bl of dbBillOfLading){
        const existeNumero=dbBillOfLading.some(bl=>bl.numeroDoc==`E${[num]}${blMaster.numeroDoc}`);
        if(existeNumero==false){
          setNumeroEliminado(`E${[num]}`);
          break;
        }
        num+=1;
      }
    }
  },[blMaster, dbBillOfLading]);

  // Alertas
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  // Advertencias
  const [tipoAdvertencia, setTipoAdvertencia]=useState('');
  const [mensajeAdvertencia, setMensajeAdvertencia]=useState('');
  const [dispatchAdvertencia, setDispatchAdvertencia]=useState(false);
  const [eventFunction,setEventFunction]=useState('');
  const [functAEjecutar, setFunctAEjecutar]=useState('');

  // // *************** FUNCION INTERMEDIARIA ADVERTENCIA ****************** //
  const funcionAdvert=(e)=>{
    if(e.target.dataset.nombre=='eliminarFila'){
      let validacion={
        sinCambios:true
      };
      if(cambiosSinGuardar==true){
        setMensajeAlerta('Guarde o cancele los cambios en materiales.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.sinCambios==false;
        return'';
      }
      setTipoAdvertencia('warning');
      setMensajeAdvertencia('¿Seguro que desea eliminar este contenedor?');
      setDispatchAdvertencia(true);
      setEventFunction(e);
      setFunctAEjecutar('eliminarFila');
    }
    else if(e.target.dataset.nombre=='eliminarDoc'){
      if(
        isEditando==false&&
        docEncontrado==true&&
        blMaster.estadoDoc!=2
      ){
        setTipoAdvertencia('warning');
        setMensajeAdvertencia('¿Seguro que desea eliminar este Bill Of Lading?');
        setDispatchAdvertencia(true);
        setEventFunction(e);
        setFunctAEjecutar('eliminarDoc');
      }
    }
  };

  // // **************************** CODIGO ********************************* //
  // // ************************* VISUALIZACION ***************************** //
  const tablaItemRef=useRef(null);
  const [furgonSelect, setFurgonSelect]=useState('');

  const [nClases, setNClases]=useState([]);

  const mostrarItem=(e)=>{
    let index=Number(e.target.dataset.id);
    setFurgonSelect(blMaster.furgones[index]);

    let newNClases=[];
    newNClases[index]='filaSelected';
    setNClases(newNClases);

    setTimeout(() => {
      tablaItemRef.current.scrollIntoView({behavior: 'smooth'});
    }, 100);
  };

  // // ************************* BUSCAR DOC **************************** //
  const [buscarDocInput, setBuscarDocInput]=useState('');
  const buscarDoc=(e)=>{
    if(isEditando){
      return;
    }
    if(e){
      if(e.key!='Enter'){
        return'';
      }
    }

    let docExiste=false;
    // dbBillOfLading.forEach((bl,index)=>{
    //   console.log(bl.numeroDoc)
    //   console.log(buscarDocInput)
    //   if(bl.numeroDoc==buscarDocInput){
    //     console.log('rmo')
    //     setBLMaster(bl)
    //     docExiste=true
    //     return''
    //   }
    // })

    const blBuscar=dbBillOfLading.find(bl=>bl.numeroDoc.toUpperCase() ==buscarDocInput.toUpperCase());
    if(blBuscar){
      docExiste=true;
    }
    // Si el input esta vacio
    if(buscarDocInput==''){
      setMensajeAlerta('Por favor indica numero de BL.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el numero no existe
    if(docExiste==false){
      setMensajeAlerta('El numero ingresado no existe en la base de datos.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si todo esta correcto
    else if(docExiste==true){
      navegacion('/importaciones/maestros/billoflading/'+buscarDocInput);
      setBuscarDocInput('');
      setRefresh(!refresh);
    }
  };

  // // ******************  BORRAR BILL OF LADING ************************** //
  const eliminarDoc=async()=>{
  // Este bloque es para evitar errores
    if(isEditando||docEncontrado==false||blMaster.estadoDoc==2){
      return'';
    }

    // Eliminar todos los despachos con este BL

    // 1-Dame una lista de todas las ordenes de compra que halla usado este BL
    const ordenesUsadas = [...new Set(blMaster.furgones.flatMap(furgon => furgon.materiales.map(item => item.ordenCompra)))];

    // 2-Crea un array de las ordenes, pero parseado es decir sin los despachos de esos BL
    const parsedOrden=dbOrdenes.map((orden)=>{
      const itemsParsed=orden.materiales.map((item)=>{
        const delDesp=item.despachos.filter((desp)=>{
          if(desp.numeroBL!=blMaster.numeroDoc){
            return desp;
          }
        });
        if(item.despachos.length>0){
          return {...item, despachos:delDesp};
        }
        else{
          return item;
        }
      });
      return {...orden,materiales:itemsParsed};
    });

    const batch = writeBatch(db);
    try {
    // Actualizar documentos en dbOrdenes dentro del lote
      for (let i = 0; i < parsedOrden.length; i++) {
        const numeroDoc = parsedOrden[i].numeroDoc;

        if (ordenesUsadas.includes(numeroDoc)) {
          // 1-
          const ordenId = parsedOrden[i].id;
          const materiales = parsedOrden[i].materiales;
          const ordenActualizar = doc(db, "ordenesCompra", ordenId);

          // Agregar la operación de actualización de O/C al lote
          batch.update(ordenActualizar, {
            "materiales": materiales,
          });
        }
      }

      // 2-
      const blActualizar = doc(db, "billOfLading", blMaster.id);

      // Agregar la operación de actualización de BL al lote
      batch.update(blActualizar, {
        numeroDoc: `${numeroEliminado}${blMaster.numeroDoc}`,
        estadoDoc:2
      });

      await batch.commit();

      setIsLoading(false);
      setMensajeAlerta('BL eliminado correctamente.');
      setTipoAlerta('success');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

      setTimeout(() => {
        navegacion('/importaciones/maestros/billoflading/');
      }, 500);

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
    //
    //
    //
    //

    // Reiniciando
    setBLEditable(initialValueBLEditable);
    setLlegadaAlPaisMostrar('');
    setCambiosNumDoc(false);
    setIsEditando(false);
    inputBuscarRef.current.disabled=false;
    setFurgonEditable(initialValueFurgonEditable);
    setIsLoading(false);
    setCambiosSinGuardar(false);
    setCopiarAFurgonMaster([]);
    setIndexFurgonEnBL(null);
    setVentanaJuntaMateriales(0);
    setValorInputMainOrden('');
    setVentanaOrdenVisible(false);
    setOCMaster(false);
    setNewCopiaFurgon([]);
  };

  // // ******************  EDICION BILL OF LADING ************************** //
  // // ******************  EDICION BILL OF LADING ************************** //

  // // ******************** MANEJANDO INPUTS CABECERA ******************** //
  const initialValueBLEditable={
    numeroDoc:'',
    proveedor:'',
    naviera:'',
    diasLibres:'',
    puerto:'',
    llegadaAlPais:'',
    fechaCreacion:'',
    estadoDoc:2,
    furgones:[],
  };
  const [blEditable,setBLEditable]=useState(initialValueBLEditable);
  const [llegadaAlPaisMostrar,setLlegadaAlPaisMostrar]=useState('');

  const [cambiosNumDoc, setCambiosNumDoc]=useState(false);

  const handleInputCabecera=(e)=>{
    const { name, value } = e.target;
    const transformedValue =
    name === 'numeroDoc' ?
      value.toUpperCase()
      :
    // Cuando el usuario coloca una fecha de llegada al pais que aun no se cumple, cuando el usuario presiona guardar, Caeloss a todos los furgones le calcula una fecha estimada, ahora si el usuario coloca que el BL ya llego, entonces se tomara la fecha calculadas a raiz del status que coloque el usuario en cada furgon individual,
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

    if(e.target.name=='buscarDocInput'){
      const valor=e.target.value.replace(' ','');
      let mayus=((valor).toUpperCase());
      setBuscarDocInput(mayus);
    }
    else if(e.target.name=='llegadaAlPais'){
      setLlegadaAlPaisMostrar(value);
      setBLEditable((prevEstadoEditable) => ({
        ...prevEstadoEditable,
        [name]: transformedValue,
      }));
    }
    else{
      setBLEditable((prevEstadoEditable) => ({
        ...prevEstadoEditable,
        [name]: transformedValue,
      }));
    }

    // Saber si el usuario modifico el numero de Doc, en este caso numero de BL, esto para saber que hacer cuando se guarden los cambios, dado que el numero de cada doc, esta en la URL, si hubo cambios, Caeloss redirecionara al usuario a la raiz
    if(blMaster.numeroDoc!==blEditable.numeroDoc){
      setCambiosNumDoc(true);
    }
    else{
      setCambiosNumDoc(false);
    }
  };

  // // ******************** MANEJANDO INPUTS TABLA ******************** //
  // No deben existen contenedores con numeros repetidos, esto traeria un desaste para la app, dado que hay bloque de codigo que calculo !=furgon.numeroDoc etc

  const handleInputTabla = (e) => {
    const index = Number(e.target.dataset.id);
    const name = e.target.name;
    const value = e.target.value;

    const numerosDeFurgones = new Set();
    blEditable.furgones.forEach(furgon => {
      numerosDeFurgones.add(furgon.numeroDoc.toString());
    });

    let hayDuplicados=false;
    if(name=='numero'){
      if (numerosDeFurgones.has(value.toUpperCase())) {
        hayDuplicados = true;
        setMensajeAlerta('Este numero de contenedor ya existe en este BL.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return'';
      }
    }

    if(hayDuplicados==false){
      setBLEditable((prevBLEditable) => {
        const furgonesUpdate = [...prevBLEditable.furgones];
        const tranformedValue=
        name=='numero'?value.toUpperCase()
          :
          name=='status'?
            Number(value)
            :
            value;

        furgonesUpdate[index] = {
          ...furgonesUpdate[index],
          [name === 'numero' ? 'numeroDoc' : name]: tranformedValue,
        };

        return {
          ...prevBLEditable,
          furgones: furgonesUpdate,
        };
      });
    }
  };

  // // ******************************** BOTON EDITAR ******************************** //
  const inputBuscarRef = useRef(null);
  const [isEditando, setIsEditando]=useState(false);
  const [cambiosSinGuardar,setCambiosSinGuardar]=useState(false);

  const editar=()=>{
    // Este condicionar es para evitar errores
    if(
      isEditando==true||
      docEncontrado==false||
      blMaster.estadoDoc==2
    ){
      return'';
    }
    else if(isEditando==false){
      setIsEditando(true);
      setBLEditable({...blMaster});
      let annio=blMaster.llegadaAlPais.slice(6,10);
      let mes =blMaster.llegadaAlPais.slice(3,5);
      let dia = blMaster.llegadaAlPais.slice(0,2);
      setLlegadaAlPaisMostrar(
        `${annio}-${mes}-${dia}`
      );

      // Reiniciar cosas
      setNClases([]);
      setFurgonSelect('');
      setFurgonEditable({});
      inputBuscarRef.current.disabled=true;
      setBuscarDocInput('');
    }
  };

  // // ********************* ELIMINAR FURGON ************************** //
  const eliminarFila=(e)=>{
    let index=Number(e.target.dataset.id);
    let validacion={
      sinCambios:true
    };

    // Si se modifico algo en la tabla de materiales
    // Este bloque de codigo en realidad no se va ejecutar, dado que tambien lo coloque en la funcion advertencia, pero quedara "por si acaso"
    if(cambiosSinGuardar==true){
      setMensajeAlerta('Guarde o cancele los cambios en materiales.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.sinCambios==false;
      return'';
    }
    if(validacion.sinCambios==true){
      setBLEditable({
        ...blEditable,
        furgones:blEditable.furgones.filter((furgon,indexFurgon)=>{
          if(indexFurgon!==index){
            return furgon;
          }})
      });

      inputBuscarRef.current.disabled=false;
      setFurgonEditable(initialValueFurgonEditable);
      setCambiosSinGuardar(false);
      setCopiarAFurgonMaster([]);
      setIndexFurgonEnBL(null);
      setVentanaJuntaMateriales(0);
      setValorInputMainOrden('');
      setVentanaOrdenVisible(false);
      setOCMaster(false);
      setNewCopiaFurgon([]);
      setNClases([]);
    }
  };

  // // ************************ CANCELAR CAMBIOS ************************** //
  const cancelar=()=>{
    setIsEditando(false);

    // Reiniciar cosas
    setNClases([]);
    inputBuscarRef.current.disabled=false;

    setFurgonEditable({});
    setVentanaOrdenVisible(false);
    setFurgonSelect('');
    setVentanaJuntaMateriales(0);
    setCopiarAFurgonMaster([]);
    setLlegadaAlPaisMostrar('');
    setValorInputMainOrden('');
  };

  // // ************************ COPIAR MATERIALES DE ORDEN ************************** //
  const tablaOrdenRef=useRef(null);
  const inputOrdenCompraRef= useRef(null);
  const primerInputTablaOrdenRef=useRef(null);
  const tablaFurgonRef=useRef(null);
  const btnBuscarRef= useRef(null);
  const [copiarAFurgonMaster, setCopiarAFurgonMaster]=useState([]);
  const [indexFurgonEnBL, setIndexFurgonEnBL]=useState(null);
  // Para saber cuando la ventana que unifica los materiales esta activa;
  // 0-Inactiva
  // 1-Activa modo agregar Color Azul
  // 2-Activa modo editar color Orange
  // En este componente es decir en detalle BL siempre se usara en modo editar dado que para editar debe existe ya un furgon, a diferencia de crear bl que puedes estar creando un furgon que aun no existe
  const [ventanaJuntaMateriales,setVentanaJuntaMateriales]=useState(0);

  const agregarMateriales=(e)=>{
    let index=Number(e.target.dataset.id);
    setIndexFurgonEnBL(index);
    let validacion={
      sinCambios:true
    };

    // Si se modifico algo en la tabla de materiales
    if(cambiosSinGuardar==true){
      setMensajeAlerta('Guarde o cancele los cambios en materiales.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.sinCambios==false;
      return'';
    }

    // Si todo esta correcto
    if(validacion.sinCambios==true){
      // Colocar clase a la fila
      let newNClases=[];
      newNClases[index]='filaSelected';
      setNClases(newNClases);

      setVentanaJuntaMateriales(2);
      setVentanaOrdenVisible(true);

      setFurgonEditable(blEditable.furgones[index]);

      // Copiar materiales de furgon selecionado, agregando qtyOrden y despachos
      setCopiarAFurgonMaster(blEditable.furgones[index].materiales.map((articulo)=>{
        let valoresParsed={};
        dbOrdenes.map((orden)=>{
          orden.materiales.map((product)=>{
            if(articulo.codigo==product.codigo&&articulo.ordenCompra==orden.numeroDoc){
              valoresParsed.qtyOrden=product.qty;
              valoresParsed.despachos=product.despachos;
            }
          });
        });

        return{
          ...articulo,
          qtyOrden:valoresParsed.qtyOrden,
          despachos:valoresParsed.despachos
        };
      }));

      setTimeout(() => {
        tablaOrdenRef.current.scrollIntoView({behavior: 'smooth'});
      }, 50);
    }
  };

  const cancelarAgregarMat=()=>{
    setNClases([]);
    setVentanaJuntaMateriales(0);
    setFurgonEditable([]);
    setCopiarAFurgonMaster([]);
    setCambiosSinGuardar(false);
    setVentanaOrdenVisible(false);

    setOCMaster(false);
    setNewCopiaFurgon([]);
    inputOrdenCompraRef.current.disabled=false;
    setValorInputMainOrden('');
  };

  // // ************************ BUSCAR ORDEN DE COMPRA ************************** //
  const [valorInputMainOrden, setValorInputMainOrden]=useState('');
  const [ventanaOrdenVisible, setVentanaOrdenVisible]=useState(false);
  const [ocMaster,setOCMaster]=useState(false);
  // newCopiaFurgon es el estado que sirve para manejar el recuadro de la orden de compra
  const [newCopiaFurgon, setNewCopiaFurgon]=useState([]);

  const buscarOrden=()=>{
    // Esto es para que una vez el usuario hale la orden, pues si le vuelve a dar a halar la app no haga nada, de otro modo la app hala nuevamente la orden y como la orden ya estaba halada, basicamente solo se borra las cantidades escritas
    if(newCopiaFurgon.length>0){
      return'';
    }
    if(valorInputMainOrden==''){
      setMensajeAlerta('Por favor ingrese numero de orden de compra.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return '';
    }

    let ordenExtraida=extrayendoOrdenDB(dbOrdenes, valorInputMainOrden);

    if(ordenExtraida){
      // Estableciendo cosas
      inputOrdenCompraRef.current.disabled=true;
      setOCMaster(ordenExtraida);

      setNewCopiaFurgon(
        ordenExtraida.materiales.map((item)=>{
          return{
            ...item,
            qty:'',
            qtyOrden:item.qty,
            ordenCompra:ordenExtraida.numeroDoc,
          };
        })
      );
      setTimeout(() => {
        tablaOrdenRef.current.scrollIntoView({behavior: 'smooth'});
        setTimeout(() => {
          primerInputTablaOrdenRef.current.focus();
        }, 80);
      }, 100);
    }
    else{
      console.log('no funciona');
      return'';
    }
  };

  function extrayendoOrdenDB(baseDatos, noOrden){
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

  // // **************************** AGREGAR  FURGON ******************************* //
  const initialValueFurgonEditable={
    numeroDoc:'',
    tamannio:'',
    destino:'Pantoja',
    materiales:[],
    status:1,
    llegadaAlmacen:'',
    llegadaDptoImport:'',
    llegadaSap:''

  };
  const [furgonEditable, setFurgonEditable]=useState(initialValueFurgonEditable);

  const crearFurgon=()=>{
    let sinEdicion=true;
    if(ventanaJuntaMateriales>0){
      setMensajeAlerta('Guarde o cancele los materiales en edicion.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      sinEdicion=false;
      return'';
    }

    if(sinEdicion==true){
      setBLEditable({
        ...blEditable,
        furgones:[
          ...blEditable.furgones,
          {...initialValueFurgonEditable,
            numeroDoc:blEditable.furgones.length+1}
        ]
      });
    }
  };

  // // **************************** GUARDAR CAMBIOS ******************************* //
  const guardarCambios=async()=>{
    let validacion={
    // validaciones cabecera
      blNoExiste:true,
      blSinEspacios:true,
      hasCabeceraBL:true,
      hasCabeceraProveedor:true,
      hasCabeceraNaviera:true,
      hasCabeceraDiasLibres:true,
      hasCabeceraPuerto:true,
      hasCabeceraLLegadaAlPais:true,
      // validaciones tabla
      furgonSinEspacios:true,
      numerosDiferentesTodosFurgones:true,
      tieneFurgones:true,
      sinEditarFurgon:true,
      hasFilaNoFurgon:true,
      hasFilaTamannioFurgon:true,
      hasFilaDestinoFurgon:true,
      hasFilaStatusFurgon:true,
      hasFilaMaterialesFurgon:true,
      successFecha:true
    };

    // // ************** Validaciones Cabecera ************** //
    // Si el BL ingresado tiene espacios
    if(blEditable.numeroDoc.includes(' ')||blEditable.numeroDoc.includes('\n')){
      validacion.blSinEspacios=false;
      setMensajeAlerta('En el campo numero de BL no se permiten espacios.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // SI el bl ingresado ya existe en la base de datos
    dbBillOfLading.forEach((bl)=>{
      if(bl.numeroDoc==blEditable.numeroDoc&&blEditable.numeroDoc!==blMaster.numeroDoc){
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

    // Si numero de BL esta vacio
    if(blEditable.numeroDoc==""){
      validacion.hasCabeceraBL=false;
      setMensajeAlerta('Favor colocar numero de BL.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // Si el proveedor esta vacio
    if(blEditable.proveedor==""){
      validacion.hasCabeceraProveedor=false;
      setMensajeAlerta('Favor colocar nombre de Proveedor.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el campo naviera esta vacio
    if(blEditable.naviera==""){
      validacion.hasCabeceraNaviera=false;
      setMensajeAlerta('Favor colocar nombre de Naviera.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el campo diasLibres esta vacio
    if(blEditable.diasLibres==""){
      validacion.hasCabeceraDiasLibres=false;
      setMensajeAlerta('Favor colocar cantidad de dias libres.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el campo puerto esta vacio
    if(blEditable.puerto==""){
      validacion.hasCabeceraPuerto=false;
      setMensajeAlerta('Favor indicar puerto.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el campo llegada al pais esta vacio
    if(blEditable.llegadaAlPais==""){
      validacion.hasCabeceraLLegadaAlPais=false;
      setMensajeAlerta('Se debe ingresar fecha de llegada al pais.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // // ************** Validaciones Tabla ************** //

    // Si algun numero de furgon se repite
    const numerosDeFurgones = new Set();
    let hayDuplicados = false;
    blEditable.furgones.forEach(furgon => {
      if (numerosDeFurgones.has(furgon.numeroDoc)) {
        hayDuplicados = true;
      } else {
        numerosDeFurgones.add(furgon.numeroDoc);
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

    // Si algun furgon:
    // No tiene numero
    // No tiene tamannio
    // No tiene destino
    // No tiene status
    // No tiene materiales
    for(let i=0;i<blEditable.furgones.length;i++){
      // Si el BL ingresado tiene espacios
      if(blEditable.furgones[i].numeroDoc.includes(' ')||blEditable.furgones[i].numeroDoc.includes('\n')){
        validacion.furgonSinEspacios=false;
        setMensajeAlerta(`El numero de contenedor de la fila ${i+1} contiene espacios.`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 4000);
      }
      if(blEditable.furgones[i].numeroDoc==''){
        validacion.hasFilaNoFurgon=false;
        setMensajeAlerta(`Indicar numero al contenedor de la fila ${i+1}.`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        break;
      }
      if(blEditable.furgones[i].tamannio==''){
        validacion.hasFilaTamannioFurgon=false;
        setMensajeAlerta(`Indicar tamaño al contenedor de la fila ${i+1}.`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        break;
      }
      if(blEditable.furgones[i].destino==''){
        validacion.hasFilaDestinoFurgon=false;
        setMensajeAlerta(`Indicar destino al contenedor de la fila ${i+1}.`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        break;
      }
      if(blEditable.furgones[i].status==''){
        validacion.hasFilaStatusFurgon=false;
        setMensajeAlerta(`Indicar status al contenedor de la fila ${i+1}.`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        break;
      }
      if(blEditable.furgones[i].materiales.length==0){
        validacion.hasFilaMaterialesFurgon=false;
        setMensajeAlerta(`Contenedor de la fila ${i+1} carece de materiales.`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        break;
      }
    }

    // *************** VALIDACIONES DE FECHAS ***************
    //0- Si el BL aun no llega al pais, todos los furgones deben tener de status; Transito Maritimo

    //1- Si el BL llego al pais, ningun furgon puede tener de status; Transito Maritimo

    //2- Si el BL llega hoy al pais, se permite cualquier status a los furgones, de la siguiente manera;
    // Todos tienen Transito Maritimo
    // Ninguno tiene Transito Maritimo

    // Calcular si el BL llego al pais
    // 0-Aun no llega al pais ---- Fecha de llegada a un no se cumple
    // 1-Llego al pais ----------- Fecha de llegada ya se cumplio
    // 2-Llegando hoy al pais ---- Fecha de llegada igual a fecha actual, es decir es el mismo dia
    let blLlegoAlPais=0;

    // Obteniendo variables elementales
    const annio=blEditable.llegadaAlPais.slice(6,10);
    const mes=(blEditable.llegadaAlPais.slice(3,5)-1);
    const mesSinRebajar=(blEditable.llegadaAlPais.slice(3,5));
    const dia=blEditable.llegadaAlPais.slice(0,2);

    // Comparar fecha llegada al pais vs fechas de cada furgon
    let fechaActual= new Date();
    let llegadaAlPaisBLES6 = new Date(annio,mes,dia);
    // Calculando si el BL llego o no al pais
    // El BL aun no llega al pais

    // 1-Primero verifica que el dia indicando por el usuario no es el dia de hoy, obviando las horas y minutos super importante
    if(
      llegadaAlPaisBLES6.getFullYear()!==fechaActual.getFullYear() ||
    llegadaAlPaisBLES6.getMonth()!==fechaActual.getMonth() ||
    llegadaAlPaisBLES6.getDate()!==fechaActual.getDate()
    ){
    // 2-Una vez que sabemos que no estamos trantando el mismo dia, verifica si llegada al pais es anterior o posterior al dia de hoy
      if(llegadaAlPaisBLES6>fechaActual){
        blLlegoAlPais=0;
      }
      else if(llegadaAlPaisBLES6<fechaActual){
        blLlegoAlPais=1;
      }

    }
    // Si el dia indicado de llegada al pais es igual al dia de hoy obviando las horas y minutos muy importante
    else if(
      fechaActual.getFullYear() === llegadaAlPaisBLES6.getFullYear() &&
      fechaActual.getMonth() === llegadaAlPaisBLES6.getMonth() &&
      fechaActual.getDate() === llegadaAlPaisBLES6.getDate())
    {
      blLlegoAlPais=2;
    }

    // El proposito de este for es validar la coherencia entre los status de los furgones a nivel individual y la fecha global de llegada al pais colocada en la cabecera del BL
    for(let i=0;i<blEditable.furgones.length;i++){
      // let fecha=blEditable.llegadaAlPais.slice(0,10);
      // let status=
      // Esta opcion nunca deberia ejecutarse dado que la opcion en el menu desplegable esta disabled, lo dejo "Por si acaso".
      blEditable.furgones[i].status==0?
        'Proveedor'
        :
        blEditable.furgones[i].status==1?
          'Transito Maritimo'
          :
          blEditable.furgones[i].status==2?
            'En puerto '
            :
            blEditable.furgones[i].status==3?
              'Recepcion Almacen'
              :
              blEditable.furgones[i].status==4?
                'Dpto. Importaciones'
                :
                blEditable.furgones[i].status==5?
                  'Concluido en SAP✅'
                  :
                  '';
      // Si el BL aun no llega al pais
      if(blLlegoAlPais==0){
        // Si el BL aun no llega al pais, todos sus furgones deben tener status transito maritimo
        if(blEditable.furgones[i].status!==1){
          validacion.successFecha=false;
          setMensajeAlerta(`La fecha de llegada al pais indica que los contenedores aun no llegan, favor colocar el status de todos los furgones en transito maritimo o cambie la fecha de llegada al pais.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 7000);
          break;
        }
      }
      // Si el BL llego al pais
      else if(blLlegoAlPais==1){
        // Si el BL llego al pais ningun furgon tener status En Proveedor o Status Transito Maritimo
        if(blEditable.furgones[i].status==1||blEditable.furgones[i].status==0){
          validacion.successFecha=false;
          setMensajeAlerta(`En la fecha de llegada al pais indicas que el BL ya llego, no debe haber contenedores en transito maritimo.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 8000);
          break;
        }
      }
      else if(blLlegoAlPais==2){
        // Aqui podemos colocar que se pueden aceptar cualquier status desde transito maritimo en adelante,
        // Aqui podemos colocar las siguientes conticiones:
        // Se aceptan que todos sean transito maritimo
        // Se aceptan que ninguno sean transito maritimo
        // No se aceptan ambos, es decir furgones que no sean transito maritimo junto con furgones en transito maritimo
        // No se acepta proveedor
        //
        // Dado a que en realidad estas condiciones deben ser general sin importar que el contenedor llega hoy, se colocara a nivel general
      }
    }

    // Aqui se cumplen las siguientes condiciones:
    // Se aceptan que todos los furgones esten en transito maritimo
    // Se aceptan que ningun furgon este en transito maritimo
    // No se acepta que dentro de la lista halla transito maritimo y otros

    // Primero verifica si algun furgon tiene de Status Transito Maritimo
    const hasTransitoMaritimo=blEditable.furgones.some(furgon=>furgon.status==1);
    if(hasTransitoMaritimo){
      const todosFurgonesTransitoMaritimo=blEditable.furgones.every(furgon=>furgon.status==1);
      if(todosFurgonesTransitoMaritimo==false){
        validacion.successFecha=false;
        setMensajeAlerta(`Existen contenedores con status Transito Maritimo y otros no, por favor corregir incoherencia`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 6000);
        return;
      }

    }

    // No se aceptan furgones en status proveedor
    // Esto no deberia ejecutarse nunca dado que la opcion proveedor esta en modo disabled, el usuario no podria selecionarla, colocaso "por si acaso"
    if(blEditable.furgones.some(furgon=>furgon.status==0)){
      validacion.successFecha=false;
      setMensajeAlerta(`Existen contenedores con status Proveedor, por favor corregir incoherencia`);
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 6000);
      return;
    }
    // Reiniciar cosas
    // Si todo esta correcto

    if(
    // validaciones cabecera
      validacion.blNoExiste==true&&
    validacion.blSinEspacios==true&&
    validacion.hasCabeceraBL==true&&
    validacion.hasCabeceraProveedor==true&&
    validacion.hasCabeceraNaviera==true&&
    validacion.hasCabeceraPuerto==true&&
    validacion.hasCabeceraLLegadaAlPais==true&&
    // validaciones tabla
    validacion.furgonSinEspacios==true&&
    validacion.numerosDiferentesTodosFurgones==true&&
    validacion.tieneFurgones==true&&
    validacion.sinEditarFurgon==true&&
    validacion.hasFilaNoFurgon==true&&
    validacion.hasFilaTamannioFurgon==true&&
    validacion.hasFilaDestinoFurgon==true&&
    validacion.hasFilaStatusFurgon==true&&
    validacion.hasFilaMaterialesFurgon==true&&
    // validaciones fecha
    validacion.successFecha==true
    ){
      setNClases([]);
      setIsLoading(true);

      // Esto se hace aqui al final, es decir cuando el usuario presiona Enviar, esto para que cualquier cambio como,
      // Cambiar numero de bl, numero de furgon, qty de los materiales, etc, queden registradas correctamente en las ordenes, de esta manera el codigo es mas sencillo y limpio

      // *******************ACTUALIZANDO ORDENES DE COMPRA (sus despachos)************************

      // Crea un array con todos los despachos del bl
      const findedFurgon = blEditable.furgones.flatMap((furgon) =>
        furgon.materiales.map((item) => ({
          ...item,
          furgon:furgon.numeroDoc,
          numeroBL: blEditable.numeroDoc,
        })));

      // Recorre todas las ordenes
      const parsedOrden=dbOrdenes.map((orden)=>{
        // Elimina todos los despachos de esa orden que tengan el numero de bl del bl master
        const delDesp=orden.materiales.map((item)=>{
          const despFilter=item.despachos.filter((desp)=>{
            if(desp.numeroBL!=blMaster.numeroDoc){
              return desp;
            }
          });

          if(item.despachos.length>0){
            return {...item, despachos:despFilter};
          }
          else{
            return item;
          }
        });

        // Agrega todos los despachos a partir de los furgones del bl editable
        const addedMateriales=delDesp.map((item)=>{
          const despachado=findedFurgon.filter((desp)=>{
            if(desp.ordenCompra===orden.numeroDoc&&desp.codigo===item.codigo)
            {
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

      // Obtener una lista de todas las ordenes de compra que se usaron en este BL, usaremos esta lista para afectar en la base de datos unicamente las ordenes de compra que hallamos usado
      const ordenesUsadas = [...new Set(blEditable.furgones.flatMap(furgon => furgon.materiales.map(item => item.ordenCompra)))];

      // *******************ACTUALIZANDO BILL OF LADING************************

      // Creando una variables sombra para evitar problemas
      let nuevoBLEditable={...blEditable};

      // ***** FECHAS *****
      // *****Si el BL aun no llega, vas a calcular la fecha de todos los furgones de acuerdo a la fecha de llegada al pais colocada en la cabecera del BL
      // El ciclo de vida sera el siguiente:
      // -llegada al pais de furgon= llegada al pais de BL
      // -llegada almacen de furgon= llegada al pais mas 3 dias
      // -llegada dptoImport furgon= llegada almacen mas 1 dia
      // -llegada al Sap del furgon= llegada dptoimport mas 1 dia
      // Se coloca ES6 para identificar que no es un string sino fecha de javascript

      // Si el BL aun no llega al pais
      if(blLlegoAlPais==0){

        const {llegadaAlmacen, llegadaDptoImport,llegadaSap}=FuncionUpWayDate(annio,mesSinRebajar,dia,2);

        nuevoBLEditable={
          ...nuevoBLEditable,
          furgones:blEditable.furgones.map((furgon)=>{
            return{
              ...furgon,
              llegadaAlmacen:llegadaAlmacen,
              llegadaDptoImport:llegadaDptoImport,
              llegadaSap:llegadaSap,
              // standBy:'',
              diasLibres:null,
              diasRestantes:null,
            };
          })
        };

      }
      // *****Si el BL ya llego al pais, entonces vas a calcular las fechas del ciclo de vida de cada furgon de manera individual, siguiendo el ciclo de vida pero desde el punto colocado por el usuario,(solo hacia adelante, no hacia atras) es decir si el usuario coloca que el furgon esta en almacen, Caeloss colocara en la fecha en puerto '',
      else if(blLlegoAlPais==1){

        const furgonesFechaUpDated = blEditable.furgones.map(furgon => ({ ...furgon }));

        for(let i=0;i<nuevoBLEditable.furgones.length;i++){
        // Standarizar todas las fechas, esto lo hago para que no queden fechas viejas colocadas y se genere incoherencias
          //  Si la fecha que tiene esta confirmada no la cambies, de otro modo borra esa fecha

          // Status---0---Proveedor--------->Nunca sucedera
          // Status---1---Transito Maritimo-->Nunca sucedera dado a que si el BL ya llego al pais, ningun puede estar en transito maritimo
          // Status---2---En puerto
          // Status---3---En Almacen
          // Status---4---Dpto Import
          // Status---5---Disponible en SAP✅

          // Todas las fechas colocadas aqui, sera fechas posteriores al dia de hoy, es decir el furgon que se encuentre en puerto, Caeloss le colocara las fechas de almacen en adelante, dado que son fechas estimadas, las fechas oficiles confirmadas es decir despues que ocurren se colocaran en la pagina de ciclo de vida
          let fechaActual= new Date();
          // Si el furgon esta en puerto, actualiza:
          // Fecha almacen
          // Fecha dpto Import
          // Fecha SAP
          if(nuevoBLEditable.furgones[i].status==2){
            console.log('mang');
            const {llegadaAlmacen, llegadaDptoImport,llegadaSap}=
          FuncionUpWayDate(
            fechaActual.getFullYear(),
            fechaActual.getMonth() + 1, //se le suma uno porque FuncionUpWayDate, espera el mes como si fuera un strin donde febrero es el mes 2, y ella luego lo ajusta
            fechaActual.getDate(),
            2);

            furgonesFechaUpDated[i].llegadaAlmacen= llegadaAlmacen,
            furgonesFechaUpDated[i].llegadaDptoImport= llegadaDptoImport,
            furgonesFechaUpDated[i].llegadaSap= llegadaSap;
          }

          // Si el furgon esta en almacen, actualiza:
          // Fecha dpto Import
          // Fecha SAP
          else if(nuevoBLEditable.furgones[i].status==3){
            const {llegadaDptoImport,llegadaSap}=
          FuncionUpWayDate(
            fechaActual.getFullYear(),
            fechaActual.getMonth() + 1, //se le suma uno porque FuncionUpWayDate, espera el mes como si fuera un strin donde febrero es el mes 2, y ella luego lo ajusta
            fechaActual.getDate(),
            3);

            furgonesFechaUpDated[i].llegadaDptoImport= llegadaDptoImport;
            furgonesFechaUpDated[i].llegadaSap= llegadaSap;
          }

          // Si el furgon esta en dpto import, actualiza;
          // Fecha SAP
          else if(nuevoBLEditable.furgones[i].status==4){
            const {llegadaSap}=
          FuncionUpWayDate(
            fechaActual.getFullYear(),
            fechaActual.getMonth() + 1, //se le suma uno porque FuncionUpWayDate, espera el mes como si fuera un strin donde febrero es el mes 2, y ella luego lo ajusta
            fechaActual.getDate(),
            4);
            furgonesFechaUpDated[i].llegadaSap= llegadaSap;
          }

        }

        nuevoBLEditable={
          ...nuevoBLEditable,
          furgones:furgonesFechaUpDated.map((furgon)=>{
            return furgon;
          })
        };
      }

      // ****Agregando algunas propiedades****
      // 1-Numero de Furgon a cada item
      const furgonesParsed=(nuevoBLEditable.furgones.map((furgon)=>{
        const materialParsed=furgon.materiales.map((item)=>{
          return {
            ...item,
            furgon:furgon.numeroDoc
          };
        });
        return {
          ...furgon,
          materiales:materialParsed,
          diasRestantes:null
        };
      }));

      // 2-Fecha de creacion al BL
      nuevoBLEditable=({
        ...nuevoBLEditable,
        fechaCreacion:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        furgones:furgonesParsed,
        diasRestantes:null
      });

      setBLEditable(nuevoBLEditable);

      // ******** CARGANDO BASE DE DATOS ********
      // Crear un lote para operaciones atómicas,
      // La app enviara varias ejecuciones en una misma operaciones pues se necesita 1-actualzar dbOrdenes y 2-actualizar BL,
      // se debe hacer con un lote y esta fue la solucion que pude conseguir
      // de otra manera es decir si se hace individual y ocurre algun error con la actualizacion de uno de los dos documentos, se podria actualizar uno y el otro no, creando incoherencias graves en la base de datos
      const batch = writeBatch(db);
      try {
        // Actualizar documentos en dbOrdenes dentro del lote
        for (let i = 0; i < parsedOrden.length; i++) {
          const numeroDoc = parsedOrden[i].numeroDoc;

          if (ordenesUsadas.includes(numeroDoc)) {
            // 1-
            const ordenId = parsedOrden[i].id;
            const materiales = parsedOrden[i].materiales;
            const ordenActualizar = doc(db, "ordenesCompra", ordenId);

            // Agregar la operación de actualización de O/C al lote
            console.log(ordenActualizar);
            batch.update(ordenActualizar, {
              "materiales": materiales,
            });
          }
        }

        // Eliminando propiedades que no deben ir a la base de datos, sino que son calculables

        const blId = nuevoBLEditable.id;
        const blCompleto=nuevoBLEditable;
        const blActualizar = doc(db, "billOfLading", blId);

        // Agregar la operación de actualización de BL al lote
        batch.update(blActualizar, blCompleto);

        await batch.commit();

        setIsLoading(false);
        setMensajeAlerta('BL actualizado correctamente.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);

        // Si el usuario modifico el numero de documento, el cual afecta la URL, entonces que valla a la raiz de detalle BL
        if(cambiosNumDoc==true){
          setTimeout(() => {
            navegacion('/importaciones/maestros/billoflading/');
          }, 500);
        }
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

      // Reiniciando
      setBLEditable(initialValueBLEditable);
      setLlegadaAlPaisMostrar('');
      setCambiosNumDoc(false);
      setIsEditando(false);
      inputBuscarRef.current.disabled=false;
      setFurgonEditable(initialValueFurgonEditable);
      setIsLoading(false);
      setCambiosSinGuardar(false);
      setCopiarAFurgonMaster([]);
      setIndexFurgonEnBL(null);
      setVentanaJuntaMateriales(0);
      setValorInputMainOrden('');
      setVentanaOrdenVisible(false);
      setOCMaster(false);
      setNewCopiaFurgon([]);
      // setDocEncontrado(false)

    }
  };

  // ************************* SEGUIMIENTO *************************
  const [isFollowing, setIsFollowing]=useState(false);
  useEffect(()=>{
    blMaster?.seguimientos?.forEach((segui)=>{
      if(segui.idUser==userMaster.id){
        setIsFollowing(segui.activo);
      }
    });
  },[userMaster,blMaster]);

  const handleChange = async(e) => {
    let blUpdate={...blMaster};
    const checK=e.target.checked;

    let yaExistia=false;
    // Si ese seguimiento ya existia
    if(blMaster?.seguimientos?.length>0){
      const seguiParsed=blMaster.seguimientos.map((segui)=>{
        if(segui.idUser==userMaster.id){
          yaExistia=true;
          return{
            ...segui,
            activo:checK
          };
        }
        else{
          return segui;
        }
      });

      blUpdate={
        ...blUpdate,
        seguimientos:seguiParsed
      };
    }

    // Si ese seguimiento no existia
    if(yaExistia==false){
    // Si este seguimiento no existia
      let seguimiento=blUpdate.seguimientos?blUpdate.seguimientos:[];
      seguimiento.push(
        {
          activo:checK,
          idUser:userMaster.id,
          userName:userMaster.userName,
          nota:'',
          fecha:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        }
      );

      blUpdate={
        ...blUpdate,
        seguimientos:seguimiento
      };
    }

    const blActualizar = doc(db, "billOfLading", blMaster.id);

    try{
      await updateDoc(blActualizar, blUpdate);
    }catch(error){
      console.error(error);
      setMensajeAlerta('Error con la base de datos.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  return (
    <>
      {/* <BotonQuery
            blMaster={blMaster}
          /> */}
      <CajaEncabezado>

        <CajaDetalles>
          <CajitaDetalle>
            <TituloDetalle>Bill of Lading (BL):</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto
                  title={blMaster.numeroDoc}
                >{blMaster.numeroDoc}</DetalleTexto>
                :
                <InputEditable
                  type='text'
                  value={blEditable.numeroDoc}
                  name='numeroDoc'
                  onChange={(e)=>{handleInputCabecera(e);}}
                />
            }
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Proveedor:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto
                  title={blMaster.proveedor}
                >{blMaster.proveedor}</DetalleTexto>
                :
                <InputEditable
                  type='text'
                  value={blEditable.proveedor}
                  name='proveedor'
                  onChange={(e)=>{handleInputCabecera(e);}}
                />
            }
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Naviera:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto
                  title={blMaster.naviera}
                >{blMaster.naviera}</DetalleTexto>
                :
                <InputEditable
                  type='text'
                  value={blEditable.naviera}
                  name='naviera'
                  onChange={(e)=>{handleInputCabecera(e);}}
                />
            }
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Dias Libres:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto>{blMaster.diasLibres}</DetalleTexto>
                :
                <InputEditable
                  type='text'
                  value={blEditable.diasLibres}
                  name='diasLibres'
                  onChange={(e)=>{handleInputCabecera(e);}}
                />
            }
          </CajitaDetalle>

          <CajitaDetalle>
            <TituloDetalle
              className={
                `${blMaster.diasRestantes<2?
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
                `${blMaster.diasRestantes<2?
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
                  blMaster.diasRestantes
              }
            </DetalleTexto>

          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Puerto:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto>{blMaster.puerto}</DetalleTexto>
                :
                <MenuDesplegable
                  value={blEditable.puerto}
                  name='puerto'
                  onChange={(e)=>{handleInputCabecera(e);}}
                  className='cabecera'
                >
                  <Opciones value="Haina">Haina</Opciones>
                  <Opciones value="Caucedo">Caucedo</Opciones>
                  <Opciones value="Otros">Otros</Opciones>
                </MenuDesplegable>
            }
          </CajitaDetalle>

          <CajitaDetalle>
            <TituloDetalle>Llegada al pais:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto>{
                  blMaster.llegadaAlPais&&
                        blMaster.llegadaAlPais.slice(0,10)
                }</DetalleTexto>
                :
                <InputEditable
                  type='date'
                  value={llegadaAlPaisMostrar}
                  name='llegadaAlPais'
                  onChange={(e)=>{handleInputCabecera(e);}}
                />

            }

          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Fecha de creacion:</TituloDetalle>
            <DetalleTexto>{
              blMaster.fechaCreacion?
                blMaster.fechaCreacion.slice(0,10)
                :
                ''
            }</DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle className='seguimiento'>
            <Interruptor
              texto={'Seguimiento'}
              tipo={'ordenCompra'}
              handleChange={handleChange}
              isFollowing={isFollowing}
            />

          </CajitaDetalle>
        </CajaDetalles>
        <CajaDetalles className='cajaStatus'>
          <TextoStatus
            className={
              isEditando?
                'block'
                :
                ( estadoDoc==0?
                  'success'
                  :
                  estadoDoc==1?
                    'block'
                    :
                    estadoDoc==2?
                      'del'
                      :
                      '')
            }
          >

            {
              isEditando==true?
                <>
                    Editando BL... {` `}
                  <Icono icon={faEdit}/>
                </>
                :
                estadoDoc==0?
                  <>
                    BL abierto {` `}
                    <Icono icon={faLockOpen}/>
                  </>
                  :
                  estadoDoc==1?
                    <>
                    BL Cerrado {` `}
                      <Icono icon={faLock}/>
                    </>
                    :
                    estadoDoc==2?
                      <>
                    BL Eliminado {` `}
                        <Icono icon={faXmark}/>
                      </>
                      :
                      estadoDoc=='epty'?
                        <>

                        </>
                        :
                        ''
            }
          </TextoStatus>
        </CajaDetalles>
      </CajaEncabezado>
      <ControlesTabla
        userMaster={userMaster}
        isEditando={isEditando}
        docMaster={blMaster}
        inputBuscarRef={inputBuscarRef}

        crearFurgon={crearFurgon}

        tipo={'detalleBL'}
        handleInput={handleInputCabecera}
        buscarDoc={buscarDoc}
        buscarDocInput={buscarDocInput}
        editar={editar}
        cancelar={cancelar}
        guardarCambios={guardarCambios}

        // Alertas
        setMensajeAlerta={setMensajeAlerta}
        setTipoAlerta={setTipoAlerta}
        setDispatchAlerta={setDispatchAlerta}
        //  Advertencias
        funcionAdvert={funcionAdvert}
      />
      {
        docEncontrado==0&&
      location.pathname!='/importaciones/maestros/billoflading/'&&
      location.pathname!='/importaciones/maestros/billoflading'?
          <>
            <CajaLoader>
              <CSSLoader/>
            </CajaLoader>
          </>
          :

          <>
            <EncabezadoTabla>
              <TituloEncabezadoTabla>
           Contenedores del BL N° {blMaster.numeroDoc}
              </TituloEncabezadoTabla>

            </EncabezadoTabla>

            <CajaTabla>
              <Tabla>
                <thead>

                  <Filas className='cabeza'>
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead className='noFurgon'>Contenedor {`${isEditando||blMaster.estadoDoc==2?'':'*'}`}</CeldaHead>
                    <CeldaHead className='tamannio'>Tamaño </CeldaHead>
                    <CeldaHead className='destino'>Destino</CeldaHead>
                    <CeldaHead className='status'>Status</CeldaHead>
                    <CeldaHead className='disponibleEnSAP'>Listo</CeldaHead>
                    <CeldaHead className='materiales'>Materiales</CeldaHead>
                    {
                      isEditando&&
                  <CeldaHead className='eliminarFilas'>Eliminar</CeldaHead>
                    }
                  </Filas>
                </thead>
                <tbody>
                  {
                    isEditando==false?
                      blMaster.furgones?.map((furgon, index)=>{
                        return(
                          <Filas key={index} className={'body '+nClases[index]}>
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody
                              data-id={index}
                            >
                              {
                                blMaster.estadoDoc!==2?
                                  <Enlaces
                                    to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                    target="_blank"
                                  >

                                    {furgon.numeroDoc}

                                  </Enlaces>
                                  :
                                  furgon.numeroDoc

                              }
                            </CeldasBody>
                            <CeldasBody>{furgon.tamannio}</CeldasBody>
                            <CeldasBody>{furgon.destino}</CeldasBody>
                            <CeldasBody className='status'>{
                              furgon.status==0?
                                'Proveedor'
                                :
                                furgon.status==1?
                                  'Transito  Maritimo'
                                  :
                                  furgon.status==2?
                                    'En puerto'
                                    :
                                    furgon.status==3?
                                      'Recepcion almacen'
                                      :
                                      furgon.status==4?
                                        'Dpto Importaciones'
                                        :
                                        furgon.status==5?
                                          'Concluido en SAP✅'
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

                            <CeldasBody>
                              <IconoREDES
                                data-id={index}
                                name='prue'
                                onClick={(e)=>mostrarItem(e)}
                              >
                                      👁️
                              </IconoREDES>
                            </CeldasBody>
                          </Filas>
                        );
                      })
                      :
                      blEditable.furgones?.map((furgon,index)=>{
                        let llegadaSap={annio:false};
                        if(blEditable.furgones[index].llegadaSap){
                          // eslint-disable-next-line no-unused-vars
                          llegadaSap={
                            annio:blEditable.furgones[index].llegadaSap.slice(6,10),
                            mes:blEditable.furgones[index].llegadaSap.slice(3,5),
                            dia:blEditable.furgones[index].llegadaSap.slice(0,2)
                          };
                        }
                        return(
                          <Filas key={index} className={'body '+nClases[index]}>
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody>
                              <InputCelda
                                data-id={index}
                                className={nClases[index]}
                                name='numero'
                                value={blEditable.furgones[index].numeroDoc}
                                onChange={(e)=>handleInputTabla(e)}
                              />
                            </CeldasBody>

                            <CeldasBody>
                              <MenuDesplegable
                                data-id={index}
                                name='tamannio'
                                className={nClases[index]}
                                value={blEditable.furgones[index].tamannio}
                                onChange={(e)=>handleInputTabla(e)}
                              >

                                <Opciones value="" >Selecione</Opciones>
                                <Opciones value="40'" >40&apos;</Opciones>
                                <Opciones value="20'">20&apos;</Opciones>
                                <Opciones value="45'">45&apos;</Opciones>
                                <Opciones value="Otros">Otros</Opciones>
                              </MenuDesplegable>
                            </CeldasBody>
                            <CeldasBody>
                              <InputCelda
                                data-id={index}
                                className={nClases[index]}
                                name='destino'
                                value={blEditable.furgones[index].destino}
                                onChange={(e)=>handleInputTabla(e)}
                              />
                            </CeldasBody>
                            <CeldasBody >
                              <MenuDesplegable
                                className={`${nClases[index]}`}
                                data-id={index}

                                name='status'
                                onChange={(e)=>{handleInputTabla(e);}}
                                value={blEditable.furgones[index].status}
                              >
                                <Opciones disabled value="99999" >Seleccione</Opciones>
                                <Opciones disabled value="0">Proveedor</Opciones>
                                <Opciones value="1">Transito Maritimo</Opciones>
                                <Opciones value="2">En Puerto</Opciones>
                                <Opciones value="3">Recepcion Almacen</Opciones>
                                <Opciones value="4">Dpto Importaciones</Opciones>
                                <Opciones value="5">Concluido en SAP✅</Opciones>
                              </MenuDesplegable>
                            </CeldasBody>
                            {/* <CeldasBody>{`${llegadaSap.annio}-${llegadaSap.mes}-${llegadaSap.dia}`} */}
                            <CeldasBody>
                              {furgon.llegadaSap&&
                              blEditable.furgones[index].llegadaSap.slice(0,10)
                              }
                            </CeldasBody>

                            <CeldasBody >
                              <IconoREDES
                                data-id={index}
                                data-nombre='agregarMateriales'
                                onClick={(e)=>agregarMateriales(e)}>
                                 Ⓜ️
                              </IconoREDES>
                            </CeldasBody>
                            <CeldasBody >
                              <IconoREDES
                                data-id={index}
                                data-nombre='eliminarFila'
                                onClick={(e)=>funcionAdvert(e)}>
                                 ❌
                              </IconoREDES>
                            </CeldasBody>
                          </Filas>
                        );
                      })
                  }
                </tbody>
              </Tabla>
            </CajaTabla>
          </>
      }
      {
        ventanaJuntaMateriales>0?
          <>
            <EncabezadoTabla>
              <TituloEncabezadoTabla>
           Materiales de contenedor N° { furgonEditable.numeroDoc}
              </TituloEncabezadoTabla>
            </EncabezadoTabla>
            <CajaTabla>
              <TablaAddBLFurgon
                copiarAFurgonMaster={copiarAFurgonMaster}
                setCopiarAFurgonMaster={setCopiarAFurgonMaster}
                tablaFurgonRef={tablaFurgonRef}
                furgonEditable={furgonEditable}
                setFurgonEditable={setFurgonEditable}
                blEditable={blEditable}
                setBLEditable={setBLEditable}
                indexFurgonEnBL={indexFurgonEnBL}
                setIndexFurgonEnBL={setIndexFurgonEnBL}
                ventanaOrdenVisible={ventanaOrdenVisible}
                setVentanaOrdenVisible={ventanaOrdenVisible}
                ventanaJuntaMateriales={ventanaJuntaMateriales}
                setVentanaJuntaMateriales={setVentanaJuntaMateriales}
                tipo={'detalleBL'}
                setCambiosSinGuardar={setCambiosSinGuardar}
                cancelarAgregarMat={cancelarAgregarMat}
                blMaster={blMaster}
                newCopiaFurgon={newCopiaFurgon}
                setNClasesPadre={setNClases}
                // para reiniciar valores del recuadro orden
                setValorInputMainOrden={setValorInputMainOrden}
                setOCMaster={setOCMaster}
                setNewCopiaFurgon={setNewCopiaFurgon}
                inputOrdenCompraRef={inputOrdenCompraRef}

                // Alertas
                setMensajeAlerta={setMensajeAlerta}
                setTipoAlerta={setTipoAlerta}
                setDispatchAlerta={setDispatchAlerta}
              />
            </CajaTabla>
            {
              ventanaOrdenVisible&&
      <>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
              Copiar materiales de orden de compra
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

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
          tipo='detalleBL'
          blEditable={blEditable}
          newCopiaFurgon={newCopiaFurgon}
          setNewCopiaFurgon={setNewCopiaFurgon}
          buscarOrden={buscarOrden}
          btnBuscarRef={btnBuscarRef}
          blMaster={blMaster}
          setCambiosSinGuardar={setCambiosSinGuardar}
          // Alertas
          setMensajeAlerta={setMensajeAlerta}
          setTipoAlerta={setTipoAlerta}
          setDispatchAlerta={setDispatchAlerta}
        />
      </>
            }
          </>
          :
          ''
      }

      {
        furgonSelect?

          <TablaMultiFurgon
            furgonSelect={furgonSelect}
            tablaItemRef={tablaItemRef}
            setNClases={setNClases}
            setFurgonSelect ={setFurgonSelect }
          />
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
        function1={eliminarFila}
        function2={eliminarDoc}
      />
      {
        isLoading?
          <ModalLoading completa={true}/>
          :
          ''
      }
    </>
  );
};

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
  `;

const Filas =styled.tr`
  &.body{
    
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    border: none;
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
`;

const CeldaHead= styled.th`
   border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  
  
  font-size: 0.9rem;
  &.qty{
    width: 300px;
  }
 
  &.noFurgon{
    width: 120px;
  }
  &.tamannio{
    width: 90px;
  }
  &.destino{
    width: 120px;
  }
  &.disponibleEnSAP{
    width: 80px;
  }
  &.status{
    width: 160px;
  }

`;
const CeldasBody = styled.td`
    font-size: 0.9rem;
    border: 1px solid black;
    height: 25px;
    &.clicKeable{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
    text-align: center;
  &.proveedor{
    text-align: start;
    padding-left: 5px;
  }
 
`;
const IconoREDES =styled.p`
  cursor: pointer;
`;

const CajaEncabezado = styled.div`
  width: 100%;
  min-height:40px;
  display: flex;
  justify-content: start;
  margin: 10px 0;
  color: ${theme.azul1};
  &.negativo{
    color: ${theme.danger};
  }
  @media screen and (max-width:650px){
    flex-direction: column;
    align-items: center;
    
  }
`;
const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  border:2px solid  #535353;
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;
  &.cajaStatus{
    background-color: ${theme.azulOscuro1Sbetav2};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width:650px){
    width: 90%;
    margin-bottom: 5px;
    
  }
`;
const TituloDetalle=styled.p`
  width: 49%;
  color: inherit;
  &.negativo{
    color: ${theme.danger};
  }
  &.docCerrado{
    color: inherit;
  }
`;
const DetalleTexto= styled.p`
  text-align: end;
  height: 20px;
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
`;
const CajitaDetalle=styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.azul1};
  display: flex;
  justify-content: space-between;
`;

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
`;

const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}

`;
const Icono=styled(FontAwesomeIcon)`
  &.accion{
    cursor: pointer;
  }
`;

const CajaLoader=styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
  
`;

const InputEditable=styled(InputCelda)`
  height: 20px;
  width: 150px;
  border: 1px solid ${theme.azulOscuro1Sbetav2};
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 0;
 
  margin: 0;
  &.codigo{
    width: 65px;
  }
  &.celda{
    width: 100%;
  }
`;

const MenuDesplegable=styled.select`
  outline: none;
  border: none;
  background-color: ${theme.azulOscuro1Sbetav3};
  height: 25px;
  width: 100%;
  &.cabecera{
    height: 20px;
    border: 1px solid ${theme.azulOscuro1Sbetav2};
    width: 150px;
  }
  &.filaSelected{
    background-color: inherit;
  }
  color: ${theme.azul2};
  
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }

  &.disabled{
    background-color: inherit;
    color: inherit;
  }
 `;

const Opciones =styled.option`
  border: none;
  background-color: ${theme.azulOscuro1Sbetav};
 `;

const EncabezadoTabla =styled.div`
  background-color: ${theme.azulOscuro1Sbetav};

  display: flex;
  justify-content: start;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
`;
const TituloEncabezadoTabla=styled.h2`
  color: #757575;
  font-size: 1.2rem;
  font-weight: normal;

`;

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

 
          /* margin-bottom: 200px; */
          /* background-color: red; */
   



`;