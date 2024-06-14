import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'paste-from-excel';
import { faEdit, faLock, faUnlock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TablaMultiDespachos } from '../Tablas/TablaMultiDespachos';
import theme from '../../../theme';
import db from '../../firebase/firebaseConfig';
import { Alerta } from '../../components/Alerta';
import { CSSLoader } from '../../components/CSSLoader';
import { ControlesTabla } from '../components/ControlesTabla';
import { Advertencia } from '../../components/Advertencia';
import { ModalLoading } from '../../components/ModalLoading';
// import { BotonQuery } from '../../components/BotonQuery';
import { Interruptor } from '../../components/Interruptor';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DetalleOrden = ({dbOrdenes, userMaster,usuario}) => {
  // // ******************** OBTENIENDO LA BASE DE DATOS ******************** //

  // // ******************** SELECIONANDO DOCUMENTO DESEADO ******************** //
  const initialValueOCMaster={none:true,materiales:[],};
  const [ocMaster, setOCMaster]=useState(initialValueOCMaster);
  const [docEncontrado, setDocEncontrado]=useState(false);

  const [refresh, setRefresh]=useState(false);

  useEffect(() => {
    function extraerDoc(baseDatos,docUser){
      let objeto=initialValueOCMaster;
      let encontrado=false;
      baseDatos.forEach((orden)=>{
        if(orden.numeroDoc==docUser){
          encontrado=true;
          objeto=orden;
          return;
        }
      });
      if(encontrado==true){
        setDocEncontrado(1);
      }
      else if(encontrado==false){
        setDocEncontrado(2);
      }
      return objeto;
    }
    if(
      location.pathname=='/importaciones/maestros/ordenescompra/'||
         location.pathname=='/importaciones/maestros/ordenescompra')
    {
      setOCMaster(initialValueOCMaster);
    }
    else{
      if(dbOrdenes.length>0){
        setOCMaster(extraerDoc(dbOrdenes, docUser));
      }
    }
  }, [dbOrdenes, refresh]);
  useEffect(()=>{
    if(docEncontrado==2){

      setMensajeAlerta('Orden de compra no encontrada.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  },[docEncontrado]);

  // // ******************** RECURSOS GENERALES ******************** //
  const navegacion=useNavigate();
  const [isLoading,setIsLoading]=useState(false);
  const parametro= useParams();
  const docUser = parametro.id;

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

  // Para obtener el estado del documento; Abierto, Cerrado, Eliminado
  // 0-Abierta
  // 1-Cerrada
  // 2-Eliminada
  // 3-Con negativo
  const [estadoDoc, setEstadoDoc]=useState('empty');

  // Para si el usuario elimina el documento, realmente Caeloss no elimina documentos sino que le cambia el estadoDoc a 2  y su numero cambia y es basicamente agregarle al inicio E0 y si el usuario crea otro documento con el mismo numero y lo elimina tambien entonces el proximo tendra el nombre de E1 y asi sucesivamente
  const [numeroEliminado, setNumeroEliminado]=useState('');

  useEffect(()=>{
  // CODIGO PARA CALCULAR EL ESTADO DEL DOC, ABIERTO, CERRADO, ELIMINADO
    let matSombra=ocMaster.materiales;
    for(let i=0;i<ocMaster.materiales.length;i++){
      let item =ocMaster.materiales[i];
      let cantidadDespachada=0;

      if(item.despachos.length>0){
        item.despachos.forEach((desp)=>{
          cantidadDespachada+=desp.qty;
        });

        if(cantidadDespachada<item.qty){
        // Articulo abierto
          matSombra[i].cerrado=0;
        }
        else if(cantidadDespachada==item.qty){
        // Articulo cerrado
          matSombra[i].cerrado=1;
        }
        else if(cantidadDespachada>item.qty){
        // Articulo con negativo
          matSombra[i].cerrado=2;
        }
      }
      else if (item.despachos.length==0){
        setEstadoDoc(0);
        break;
      }
    }
    // CERRADA
    // Si todos sus articulos estan despachos al 100%,
    if(matSombra.every((articulo)=> {return articulo.cerrado==1;})){
      setEstadoDoc(1);
    }
    // ABIERTA
    // Si alguno de sus items tiene qty pendiente
    else if(matSombra.some((articulo)=> {return articulo.cerrado==0;})){
      setEstadoDoc(0);
    }
    // CON NEGATIVOS
    // Si alguno de sus items tiene qty despachada mayor a qty disponible
    else if(matSombra.some((articulo)=> {return articulo.cerrado==2;})){
      setEstadoDoc(3);
    }
    // ELIMINADA
    // El usuario elimino la orden
    if(ocMaster.estadoDoc==2){
      setEstadoDoc(2);
    }

    // None
    if(docEncontrado==false){
      setEstadoDoc('empty');
    }

    // Definir numero de eliminacion E1 / E2 / E3 etc
    let num=0;
    for(const orden of dbOrdenes){
      const existeNumero=dbOrdenes.some(orden=>orden.numeroDoc==`E${[num]}${ocMaster.numeroDoc}`);
      if(existeNumero==false){
        setNumeroEliminado(`E${[num]}`);
        break;
      }
      num+=1;
    }
  },[ocMaster]);

  // // *************** FUNCION INTERMEDIARIA ADVERTENCIA ****************** //
  const funcionAdvert=(e)=>{
    if(e.target.dataset.nombre=='eliminarDoc'){
      if(
        isEditando==false&&
        docEncontrado==true&&
        ocMaster.estadoDoc!=2
      ){
        setTipoAdvertencia('warning');
        setMensajeAdvertencia('¿Seguro que desea eliminar este esta Orden de Compra?');
        setDispatchAdvertencia(true);
        setEventFunction(e);
        setFunctAEjecutar('eliminarDoc');
      }
    }
  };

  // // ******************** CODIGO PARA EL HANDLEPASTE ******************** //
  const [label, setlabel] = useState({ labels: ["n","codigo", "descripcion", "qty","comentarios", "qtyDisponible", "qtyTotalDespachada","despachos"] });
  const [initialValue, setInitialValue] = useState(
    {inputs:[
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
      { "n":"","codigo": "", "descripcion": "", "qty":"","comentarios":"","qtyDisponible":"","despachos":"empty por edicion detalle Orden", },
    ]},
  );

  const [inputvalue, setInputvalue] = useState({...initialValue});

  const handlePaste = (index, elm, e, i) => {
    return parse(e);
  };

  const handlePaste1 = (index, elm, e, i) => {
    setInputvalue((inputvalue) => ({
      ...inputvalue,
      inputs: inputvalue.inputs.map((item, i) =>
        index === i
          ? {
            ...item,
            [elm]: e.target.value
          }
          : item
      )
    }
    ));
  };

  // // **************************** CODIGO ********************************* //
  // // *************************** LECTURA*** ***************************** //

  // // ************************* BUSCAR DOC ***************************** //
  const [buscarDocInput, setBuscarDocInput]=useState('');
  const buscarDoc=(e)=>{
    let validacion={
      hasNumero:true,
      existe:true,

    };
    if(isEditando){
      return;
    }
    if(e){
      if(e.key!='Enter'){
        return'';
      }
    }
    let docExiste=false;
    for(const orden of dbOrdenes){
      if(orden.numeroDoc==buscarDocInput){
        setOCMaster(orden);
        docExiste=true;
        break;
      }
    }
    // Si el numero no existe
    if(buscarDocInput==''){
      validacion.hasNumero=false;
      setMensajeAlerta('Por favor indica numero de Orden de Compra.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    if(docExiste==false){
      validacion.existe=false;
      setMensajeAlerta('El numero ingresado no existe en la base de datos.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    if(validacion.existe==true&&validacion.hasNumero==true){
      setRefresh(!refresh);
      setNClases([]);
      setHasDespachos(false);
      navegacion('/importaciones/maestros/ordenescompra/'+buscarDocInput);
    }
    setBuscarDocInput('');
  };

  // // ************************* VISUALIZACION ***************************** //
  const tablaDespachos=useRef(null);
  const [despachoSelect, setDespachoSelect]=useState([]);
  const [hasDespachos, setHasDespachos]=useState(false);
  const [nClases, setNClases]=useState([]);

  const mostrarDespacho=(e)=>{
    let index=Number(e.target.dataset.id);
    if(ocMaster.materiales[index].despachos.length>0){
      setDespachoSelect(ocMaster.materiales[index].despachos);
      setHasDespachos(true);
      setTimeout(() => {
        tablaDespachos.current.scrollIntoView({behavior: 'smooth'});
      }, 100);
      let newNClases=[];
      newNClases[index]='filaSelected';
      setNClases(newNClases);
    }else{
      setNClases([]);
      setMensajeAlerta('Este item aun no posee entregas.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
  };

  // // ******************  EDICION ORDEN DE COMPRA ************************** //
  // // ******************  EDICION ORDEN DE COMPRA ************************** //
  const initialValueOCEditable={
    numeroDoc:'',
    proveedor:'',
    comentarios:'',
    fechaCreacion:'',
    materiales:[],
  };
  const [ocEditable,setOCEditable]=useState(initialValueOCEditable);

  const handleInputCabecera=(e)=>{
    const { name, value } = e.target;
    if(name=='buscarDocInput'){
      const valor=value.replace(' ','');
      setBuscarDocInput(valor);
    }
    else{

      setOCEditable((prevEstado) => ({
        ...prevEstado,
        [name]: value,
      }));

    }
  };

  const inputBuscarRef = useRef(null);
  const [isEditando, setIsEditando]=useState(false);

  const editar=()=>{
    if(
      isEditando==true||
      docEncontrado==false||
      ocMaster.estadoDoc==2
    ){
      console.log('retornado');
      return'';
    }

    else if(isEditando==false){
      setInputvalue((prevEstado) => ({
        ...prevEstado,
        inputs: ([...ocMaster.materiales.map((item)=>{
          return{
            n:'',
            codigo:item.codigo,
            descripcion:item.descripcion,
            qty:item.qty,
            comentarios:item.comentarios,
            qtyDisponible:'',
            despachos:item.despachos
          };
        }),...initialValue.inputs]),
      }));

      setOCEditable(ocMaster);

      setIsEditando(true);
      setHasDespachos(false);
      setDespachoSelect([]);
      inputBuscarRef.current.disabled=true;

      setNClases([]);
      setHasDespachos(false);
      inputBuscarRef.current.disabled=true;
      setBuscarDocInput('');
    }
  };

  // // *************************  GUARDAR CAMBIOS *************************** //

  const guardarCambios=async()=>{
    let validacion={
      // -----Cabecera-----
      noExiste:true,
      ordenSinEspacios:true,
      hasNumero:true,
      hasProveedor:true,

      // -----Tabla-----
      filasCompletas:true,
      codigoSinEspacios:true,
      soloNumeros:true,
      hasUnique:true,
      hasItems:true,
    };

    // ************** VALIDACIONES CABECERA **************

    // Si el numero de orden ya existe
    if(ocEditable.numeroDoc!==ocMaster.numeroDoc){
      dbOrdenes.map((orden)=>{
        if(orden.numeroDoc==ocEditable.numeroDoc){
          validacion.noExiste=false;
          setMensajeAlerta('El numero de orden de compra ya existe en la base de datos.');
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }
      });
    }
    // Si el numero de orden tiene espacios
    if(ocEditable.numeroDoc.includes(' ')||ocEditable.numeroDoc.includes('\n')){
      validacion.ordenSinEspacios=false;
      setMensajeAlerta('El numero de orden de compra no puede contener espacios.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // Si no coloco numero de orden de compra
    if(ocEditable.numeroDoc==''){
      validacion.hasNumero=false;
      setMensajeAlerta('Colocar numero de orden de compra.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // Si no coloco proveedor
    if(ocEditable.proveedor==''){
      validacion.hasProveedor=false;
      setMensajeAlerta('Colocar nombre de proveedor.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // ************** VALIDACIONES TABLA **************

    // Mapeo a tabla
    const itemsTabla=new Set();
    inputvalue.inputs.forEach((item,index)=>{
      if(
        item.codigo!==''||
      item.descripcion!==''||
      item.qty!==''||
      item.comentarios!==''
      ){
        // Si alguna fila tiene datos, pero esta incompleta
        if(
          item.codigo==''||
          item.descripcion==''||
          item.qty==''
        ){
          validacion.filasCompletas=false;
          setMensajeAlerta(`Complete fila N° ${index+1} o elimine sus datos`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return'';
        }
        // Si algun item tiene letras en lugar de numero en la columna cantidad
        let expReg=/^[\d.]{0,1000}$/;
        if(expReg.test(item.qty)==false){
          validacion.soloNumeros=false;
          setMensajeAlerta(`Cantidad incorrecta para el item de la fila N° ${index+1}.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return'';
        }
        //  Si algun codigo tiene espacios
        if(item.codigo.includes(' ')||item.codigo.includes('\n')){
          validacion.codigoSinEspacios=false;
          setMensajeAlerta(`La celda código de la fila ${index+1} contiene espacios.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }

        //  Si algun item esta mas de una vez
        if(itemsTabla.has(item.codigo)){
          validacion.hasUnique=false;
          setMensajeAlerta(`El item de la fila ${index+1} esta duplicado.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }
        else{
          itemsTabla.add(item.codigo);
        }

      }
    });

    // Extraer Materiales filtrados, solo las filas que tengan item y a los articulos del inputs colocarle un array en su propiedad despacho VERY IMPORTANT!!!
    console.log(inputvalue);
    const materialesParsed=inputvalue.inputs.filter(item=>{
      if(
        item.codigo!==''&&
      item.descripcion!==''&&
      item.qty!==''
      ){
        return item;
      }
    });
    console.log(materialesParsed);
    // Agregando la propiedad despacho a los item que no lo tiene, estos son item que no estaban incluido al momento del usuario presionar editar
    const matMasDespacho=materialesParsed.map((item)=>{
      if(Array.isArray(item.despachos)&&
    item.despachos.length>0
      ){
        return item;

      }
      else{
        return {
          ...item,
          despachos:[]
        };
      }
    });

    // Ahora tenemos que resetear los despachos de los articulos, que pasa si un usuario:
    // Tenemos una orden que solo tiene un item 03119---15unds y tiene varios despachos
    // El usuario empieza a editar y este codigo lo duplica, la app le dice que tiene que borrar uno
    // el usuario borra el primero es decir el que ya estaba que tiene sus despachos,
    // En ese caso se borran los despachos y tendremos una incoherencia, aqui haremos lo siguiente

    // Borrar todos los despachos
    // Agregar a cada item los despachos del ocMaster, dado que una orden no puede tener un codigo repetido dos veces

    const materialesReset=matMasDespacho.map((item)=>{
      let despachoOCMaster='aguacate con yuca';

      let articuloOCMaster = ocMaster.materiales.find((articulo)=> {
        return articulo.codigo === item.codigo;
      });

      if(articuloOCMaster!==undefined){
        despachoOCMaster=articuloOCMaster.despachos;
      }
      else{
        despachoOCMaster=[];
      }

      return {
        ...item,
        despachos:despachoOCMaster
      };
    });

    // Si no existen filas completas
    if(materialesParsed.length==0){
      validacion.hasItems=false;
      setMensajeAlerta('Por favor agregar item a la tabla.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // ***** Si todo esta correcto *****
    if(
      // -----Cabecera------
      validacion.noExiste==true&&
      validacion.ordenSinEspacios==true&&
      validacion.hasNumero==true&&
      validacion.hasProveedor==true&&
      // -----Tabla------
      validacion.filasCompletas==true&&
      validacion.soloNumeros==true&&
      validacion.codigoSinEspacios==true&&
      validacion.hasUnique==true&&
      validacion.hasItems==true
    ){
      setIsLoading(true);
      // Eliminando propiedades inecesarias //dando formato
      let propiedadesAEliminar = ['n', 'qtyDisponible'];

      propiedadesAEliminar.forEach((props)=> {
        materialesReset.forEach(item=>{
          delete item[props];
        });
      });
      const newOCEditable={
        ...ocEditable,
        estadoDoc:estadoDoc,
        materiales:materialesReset
      };

      // Cargar DB
      const ordenActualizar = doc(db, "ordenesCompra", ocMaster.id);

      try{
        await updateDoc(ordenActualizar, newOCEditable);
        setMensajeAlerta('Orden actualizada correctamente.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 7000);
        setIsLoading(false);
      }
      catch(error){
        console.log(error);
        setMensajeAlerta('Error con la base de datos.');
        setTipoAlerta('error');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 7000);
        setIsLoading(false);
      }
      setOCEditable(initialValueOCEditable);
      setInputvalue(initialValue);
      setIsEditando(false);
      inputBuscarRef.current.disabled=false;
      setDespachoSelect([]);
      setHasDespachos(false);
      setNClases([]);
    }
  };

  // // *************************  CANCELAR EDICION *************************** //
  const cancelar=()=>{
    setIsEditando(false);
    inputBuscarRef.current.disabled=false;
  };

  // // ****************************** ELIMINAR DOC ****************************** //

  const eliminarDoc=async()=>{
    let validacion=true;
    console.log(isEditando,docEncontrado,ocMaster.estadoDoc);
    if(isEditando||docEncontrado==false||ocMaster.estadoDoc==2){
      validacion=false;
      return'';
    }

    if(validacion==true){
      console.log('paso');

      // Cargar DB
      const ordenActualizar = doc(db, "ordenesCompra", ocMaster.id);
      try{
        await updateDoc(ordenActualizar, {
          numeroDoc: `${numeroEliminado}${ocMaster.numeroDoc}`,
          estadoDoc:2
        });
        setMensajeAlerta('Orden eliminada correctamente.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 7000);

        setTimeout(() => {
          navegacion('/importaciones/maestros/ordenescompra/');
        }, 500);
      }
      catch(error){
        console.log(error);
        setMensajeAlerta('Error con la base de datos.');
        setTipoAlerta('error');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 7000);
      }
    }
  };

  // // ************************** LIMPIAR TABLA ************************** //
  const limpiarTabla =()=>{
    setInputvalue({...initialValue});
  };

  // ************************* SEGUIMIENTO *************************
  const [isFollowing, setIsFollowing]=useState(false);
  useEffect(()=>{
    ocMaster?.seguimientos?.forEach((segui)=>{
      if(segui.idUser==userMaster.id){
        setIsFollowing(segui.activo);
      }
    });
  },[userMaster,ocMaster]);

  const handleChange = async(e) => {
    let ordenUpdate={...ocMaster};
    const checK=e.target.checked;

    let yaExistia=false;
    // Si ese seguimiento ya existia
    if(ocMaster?.seguimientos?.length>0){
      const seguiParsed=ocMaster.seguimientos.map((segui)=>{
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

      ordenUpdate={
        ...ordenUpdate,
        seguimientos:seguiParsed
      };
    }

    // Si ese seguimiento no existia
    if(yaExistia==false){
    // Si este seguimiento no existia
      let seguimiento=ordenUpdate.seguimientos?ordenUpdate.seguimientos:[];
      seguimiento.push(
        {
          activo:checK,
          idUser:userMaster.id,
          userName:userMaster.userName,
          nota:'',
          fecha:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        }
      );

      ordenUpdate={
        ...ordenUpdate,
        seguimientos:seguimiento
      };
    }

    const ordenActualizar = doc(db, "ordenesCompra", ocMaster.id);

    try{
      await updateDoc(ordenActualizar, ordenUpdate);
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
      <CajaEncabezado>
        <CajaDetalles>
          <CajitaDetalle>
            <TituloDetalle>N° Orden Compra:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto>{ocMaster.numeroDoc}</DetalleTexto>
                :
                <InputEditable
                  type='text'
                  defaultValue={ocMaster.numeroDoc}
                  name='numeroDoc'
                  data-guardar='si'
                  onChange={(e)=>{handleInputCabecera(e);}}

                />
            }
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Proveedor:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto title={ocMaster.proveedor}>{ocMaster.proveedor}</DetalleTexto>
                :
                <InputEditable
                  type='text'
                  defaultValue={ocMaster.proveedor}
                  name='proveedor'
                  data-guardar='si'
                  onChange={(e)=>{handleInputCabecera(e);}}
                />
            }
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Comentarios:</TituloDetalle>
            {
              isEditando==false?
                <DetalleTexto title={ocMaster.comentarios}>{ocMaster.comentarios}</DetalleTexto>
                :
                <TextArea
                  type='text'
                  defaultValue={ocMaster.comentarios}
                  name='comentarios'
                  data-guardar='si'
                  onChange={(e)=>{handleInputCabecera(e);}}
                />
            }
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Fecha de creacion:</TituloDetalle>
            <DetalleTexto>
              {
                ocMaster.fechaCreacion?
                  ocMaster.fechaCreacion.slice(0,10)
                  :
                  ''
              }
            </DetalleTexto>
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
        <CajaDetalles
          className={`cajaStatus ${ocMaster.estado==3?'eliminada':''}`}>
          <TextoStatus
            className={
              isEditando==true?
                'block'
                :
                estadoDoc==0?
                  'success'
                  :
                  estadoDoc==1?
                    'block'
                    :
                    estadoDoc==2 ||estadoDoc==3?
                      'del'
                      :
                      ''
            }>
            {
              isEditando==true?
                <>
                Editando O/C... {` `}
                  <Icono icon={faEdit}/>
                </>
                :
                estadoDoc==0?
                  <>
              O/C Abierta {` `}
                    <Icono icon={faUnlock}/>
                  </>
                  :
                  estadoDoc==1?
                    <>
              O/C Cerrada {` `}
                      <Icono icon={faLock}/>
                    </>
                    :
                    estadoDoc==2?
                      <>
              O/C Eliminada {` `}
                        <Icono icon={faXmark}/>
                      </>
                      :
                      estadoDoc==3?
                        <>
              O/C con negativos {` `}
                          <Icono icon={faXmark}/>
                        </>
                        :
                        estadoDoc=='empty'?
                          <>
                            {` `}
                          </>
                          :
                          ''
            }
          </TextoStatus>
        </CajaDetalles>
      </CajaEncabezado>
      {/* <BotonQuery
        dbOrdenes={dbOrdenes}
        ocEditable={ocEditable}
        ocMaster={ocMaster}
        docEncontrado={docEncontrado}
        inputvalue={inputvalue}
        initialValue={initialValue}
        estado={estadoDoc}
      /> */}
      <ControlesTabla
        isEditando={isEditando}
        docMaster={ocMaster}
        inputBuscarRef={inputBuscarRef}
        tipo={'ordenCompra'}
        handleInput={handleInputCabecera}
        editar={editar}
        guardarCambios={guardarCambios}
        buscarDoc={buscarDoc}
        buscarDocInput={buscarDocInput}
        cancelar={cancelar}
        limpiarTabla={limpiarTabla}
        // Alertas
        setMensajeAlerta={setMensajeAlerta}
        setTipoAlerta={setTipoAlerta}
        setDispatchAlerta={setDispatchAlerta}
        //  Advertencias
        funcionAdvert={funcionAdvert}
        usuario={usuario}
        userMaster={userMaster}
      />
      {
        docEncontrado==false&&
       location.pathname!='/importaciones/maestros/ordenescompra/'&&
       location.pathname!='/importaciones/maestros/ordenescompra'
          ?
          <CajaLoader>
            <CSSLoader/>
          </CajaLoader>
          :
          <>
            <EncabezadoTabla>
              <TituloEncabezadoTabla>
           Materiales de orden de compra N° {ocMaster.numeroDoc}
              </TituloEncabezadoTabla>
            </EncabezadoTabla>
            <CajaTabla>
              <Tabla >
                <thead>
                  <Filas className='cabeza'>
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Codigo*</CeldaHead>
                    <CeldaHead>Descripcion</CeldaHead>
                    <CeldaHead >Qty</CeldaHead>
                    <CeldaHead className='comentarios'> Comentarios</CeldaHead>
                    <CeldaHead>
                      {
                        isEditando?
                          'Pendiente'
                          :
                          'Qty Pendiente'
                      }
                    </CeldaHead>
                    <CeldaHead>Qty Enviada</CeldaHead>
                    <CeldaHead>Ver Envios</CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  {
                    isEditando?
                      inputvalue.inputs?.map((res, index) => {
                        return (
                          <Filas key={index} className={'body'}>
                            {label.labels.map((elm, i) => {
                              return (
                                <CeldasBody
                                  key={i}
                                >
                                  {
                                    elm=='codigo'||
                    elm=='descripcion'||
                    elm=='qty'||
                    elm=='comentarios'?
                                      <InputCelda
                                        onInput={(e) => {handlePaste1(index, elm, e, i);}}
                                        onPaste={(e) => {handlePaste(index, elm, e, i); }}
                                        type="textbox"
                                        className={
                                          elm=='n'? elm +' disable'
                                            :
                                            elm=='qtyDisponible'?elm +' disable'
                                              :
                                              elm=='qtyTotalDespachada'?elm +' disable'
                                                :
                                                elm=='despachos'?elm +' disable'
                                                  :
                                                  elm
                                        }
                                        name={elm}
                                        data-guardar='si'
                                        articulo={elm}
                                        data-id={index}
                                        data-articulo={elm}
                                        disabled={
                                          elm=='n'?true
                                            :
                                            elm=='qtyDisponible'?true
                                              :
                                              elm=='qtyTotalDespachada'?true
                                                :
                                                elm=='despachos'?true
                                                  :
                                                  false
                                        }
                                        value={inputvalue.inputs[index][elm]}
                                        // defaultValue={
                                        //   elm=='n'?
                                        //     index+1
                                        //     :
                                        //     ocMaster.materiales[index]?
                                        //     ocMaster.materiales[index][elm]
                                        //     :
                                        //     ''
                                        // }
                                      />
                                      :
                                      elm=='n'?
                                        index+1
                                        :
                                        ''
                                  }
                                </CeldasBody>
                              );
                            })}
                          </Filas>
                        );
                      })
                      :
                      docEncontrado&&
      ocMaster.materiales.map((item, index)=>{
        let cantidadDespachada=0;
        let cantidadDisponible=0;
        if(index<ocMaster?.materiales?.length){
          if(index<ocMaster?.materiales.length){
            let despachos=ocMaster.materiales[index].despachos;
            if(ocMaster.materiales[index].despachos?.length>0){
              despachos.map((desp)=>{
                cantidadDespachada+=desp.qty;
              });
            }
            cantidadDisponible=ocMaster?.materiales[index].qty-cantidadDespachada;
          }

          return(
            <Filas key={index} className={'body SinEditar '+nClases[index]}>
              {
                label.labels.map((elm,i)=>{
                  return(
                    <CeldasBody
                      key={i}
                      className={elm}
                      title={
                        elm=='comentarios'&&index<ocMaster.materiales.length?
                          ocMaster.materiales[index][elm]
                          :
                          ''
                      }
                    >
                      {
                        index<ocMaster.materiales.length ?
                          (
                            elm=='n'?
                              index+1
                              :
                              (
                                elm=='descripcion'||
                          elm=='qty'||
                          elm=='comentarios'
                          // elm=='qtyDisponible'||
                          // elm=='qtyTotalDespachada'
                                  ?
                                  ocMaster.materiales[index][elm]
                                  :
                                  elm=='codigo'?

                                    <Enlaces
                                      to={`/importaciones/maestros/articulos/${ocMaster.materiales[index][elm]}`}
                                      target="_blank"
                                    >
                                      {ocMaster.materiales[index][elm]}
                                    </Enlaces>
                                    :
                                    elm=='qtyDisponible'?
                                      cantidadDisponible
                                      :
                                      elm=='qtyTotalDespachada'?
                                        cantidadDespachada
                                        :
                                        elm=='despachos'?
                                          <IconoREDES
                                            data-id={index}
                                            onClick={(e)=>mostrarDespacho(e)}
                                          >
                            👁️
                                          </IconoREDES>
                                          :
                                          ''
                              )
                          )
                          :
                          ''
                      }
                    </CeldasBody>
                  );
                })
              }
            </Filas>
          );
        }
      })
                  }
                </tbody>
              </Tabla>
            </CajaTabla>

          </>
      }
      {
        hasDespachos?

          <TablaMultiDespachos
            despachoSelect={despachoSelect}
            tablaDespachos={tablaDespachos}
            setHasDespachos={setHasDespachos}
            setNClases={setNClases}
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
        // function1={eliminarFila}
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
  border-radius: 5px;
  width: 95%;
  margin: auto;
  margin-bottom: 30px;
  border: 1px solid #000;
  
  `;
const CeldaHead= styled.th`
padding: 3px 8px;
text-align: center;
font-size: 0.9rem;
border: 1px solid black;
&.comentarios{
  width: 150px;
}
`;
const Filas =styled.tr`
  &.body{
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${theme.azul5Osc};
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

const CeldasBody = styled.td`
border: 1px solid black;
font-size: 0.9rem;
height: 25px;
text-align: center;

&.romo{
 cursor: pointer;
 &:hover{
}}
&.numero{
  width: 50px;
}
&.codigo{
  width: 50px;
  text-align: center;
}
&.descripcion{
 text-align: start;
 padding-left: 5px;
}
&.comentarios{
  text-align: start;
  padding-left: 5px;
  height: 8px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;    /* Oculta el contenido que sobrepasa el ancho */
  text-overflow: ellipsis;
}
&.clicKeable{
 cursor: pointer;
 &:hover{
      text-decoration: underline;
  }
}
`;
const CajaEncabezado = styled.div`
  width: 100%;
  min-height:40px;
  display: flex;
  justify-content: start;
  margin: 10px 0;
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
  &.eliminada{
    background-color: #a92828;
  }
  @media screen and (max-width:650px){
    width: 90%;
    margin-bottom: 5px;
    
  }
`;
const TextoStatus=styled.h3`
   color: white;
   font-size: 2rem;
   text-align: center;
   &.success{
    color:${theme.success}
   }
   &.block{
    color: #524a4a;
  }
  &.del{
    color: #8c3d3d;
  }
  
   &.sinDocumento{
    color: red;
   }
`;
const CajitaDetalle=styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.azul1};
  color: ${theme.azul1};
  display: flex;
  justify-content: space-around;

  &.seguimiento{
    /* width: 100%; */
    /* border: 1px solid red; */
  }
`;
const TituloDetalle=styled.p`
  width: 49%;
`;
const DetalleTexto= styled.p`
  white-space: nowrap;
  overflow: hidden;  
  text-overflow: ellipsis;
  height: 20px;
  text-align: end;
  width: 49%;
`;
const InputCelda=styled.input`
  margin: 0;
  height: 25px;
  outline: none;
  border: none;
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 4px;
  &:focus{
    border: 1px solid ${theme.azul2};
  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }
  &.n{
    width: 40px;
    padding: 0;
    text-align: center;
  }
  &.codigo{
    width: 100%;
    padding: 0;
    text-align: center;
  }
  
  &.descripcion{
    width: 300px;
    padding-left: 5px;
  }
  &.qty{
    width: 100%;
  }
  &.qtyDisponible{
    width: 100%;
  }
  
  &.comentarios{
    width: 100%;
  }

  &.disable{
    background-color: transparent;
    color: black;
  }
`;
const InputEditable=styled(InputCelda)`
  height: 20px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 0;
  margin: 0;
  /* width: 100%; */
  &.codigo{
    width: 65px;
  }
  &.celda{
    width: 100%;
  }
`;
const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
const TextArea=styled.textarea`
  height: 20px;
  outline: none;
  padding-left: 4px;
  border-radius: 0;
  border: 1px solid ${theme.azul1};
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  width: 95%;
  resize: vertical;
  &:focus{
    border: 1px solid ${theme.azul2};
  }
`;
const IconoREDES =styled.p`
  cursor: pointer;
`;
const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}
`;
const CajaLoader=styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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


          margin-bottom: 25px;


`;