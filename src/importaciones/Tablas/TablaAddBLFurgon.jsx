import {useEffect, useRef, useState} from 'react';
import theme from '../../config/theme.jsx';
import styled from 'styled-components';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

export const TablaAddBLFurgon = ({
  copiarAFurgonMaster,
  setCopiarAFurgonMaster,
  tablaFurgonRef,
  furgonEditable,
  setFurgonEditable,
  blEditable,
  setBLEditable,
  indexFurgonEnBL,
  setIndexFurgonEnBL,
  ventanaOrdenVisible,
  setVentanaOrdenVisible,
  ventanaJuntaMateriales,
  setVentanaJuntaMateriales,
  tipo,
  setCambiosSinGuardar,
  // Alertas
  setMensajeAlerta,
  setTipoAlerta,
  setDispatchAlerta,
  // add BL
  inputNoFurgonRef,
  inputTamannioFurgonRef,
  initialValueFurgon,
  setValoresInputsFurgon,
  initialValueFurgonEditable,
  // detalle bl
  cancelarAgregarMat,
  blMaster,
  newCopiaFurgon,
  setNClasesPadre,
  setOCMaster,
  setNewCopiaFurgon,
  inputOrdenCompraRef,
  setValorInputMainOrden

}) => {
  // ********************* DOCUMENTACION ********************//
  // copiarAFurgonMaster
  // Es la matriz base de la tabla unificadora de materiales
  //
  //
  //

  // ventanaJuntaMateriales sirve para saber cuando la ventada unificadora de materiales esta visible
  // Ejemplos:
  // 0---No visible
  // 1-Visible en modo agregar y sale de color azul
  // 2-Visible en modo modificar un furgon y sale de color naranja
  //

  // ********************* RECURSOS GENERALES ********************//
  useEffect(() => {
    document.addEventListener('keyup',shortHands);
    return () => {
      document.removeEventListener('keyup',shortHands, false);
    };
  }, []);

  const btnAgregar = useRef(null);
  const shortHands =(e)=>{
    switch (e.key) {
    case '+':
      if(ventanaJuntaMateriales==1){
        btnAgregar.current.click();
      }
      break;
    }
  };

  const copiarEnter=(e)=>{
    if(e.key=='Enter'){
      if(ventanaJuntaMateriales==1){
        agregarABL();
      }
      else if(ventanaJuntaMateriales==2){
        guardarCambios();
      }
    }
  };

  // Obtener cantidad disponible de cada item de copiarAFurgonMaster
  const [cantidadDisponible, setCantidadDisponible]=useState([]);
  useEffect(()=>{

    copiarAFurgonMaster.forEach((item,index)=>{
      let cantidadDespachada=0;
      let qtyCargadaBL=0;
      console.log(item);
      // Obtener cantidades desde la base de datos
      if(item.despachos.length>0){
        item.despachos.map((desp)=>{
          if(tipo=='addBL'){
            cantidadDespachada+=desp.qty;
          }
          else if(tipo=='detalleBL'){
            if(desp.numeroBL!==blMaster.numeroDoc){
              cantidadDespachada+=desp.qty;
            }
          }
        });
      }

      // Obtener la cantidad que estamos cargando a este BL
      blEditable.furgones.forEach(furgon => {
        furgon.materiales.forEach(product=>{
          if(product.ordenCompra === item.ordenCompra&& product.codigo === item.codigo){
            if(ventanaJuntaMateriales==1){
              qtyCargadaBL+=product.qty;
            }
            else if(ventanaJuntaMateriales==2){
              if(blEditable.furgones[indexFurgonEnBL].numeroDoc!=furgon.numeroDoc){
                qtyCargadaBL+=product.qty;
              }
            }
          }
        });
      });

      let qtyTotalDespachada=cantidadDespachada+qtyCargadaBL;
      setCantidadDisponible(prevCantidad => {
        const newCantidadDisponible = [...prevCantidad];
        newCantidadDisponible[index] = item.qtyOrden - qtyTotalDespachada;
        return newCantidadDisponible;
      });
    });

  },[copiarAFurgonMaster]);

  // ******************** MANEJANDO LOS INPUTS ******************** //
  const handleInputs=(e)=>{
    e.preventDefault();
    let index=Number(e.target.dataset.id);

    setCambiosSinGuardar(true);

    // Si la cantidad indicada es mayor a cantidad disponible
    if(e.target.value>cantidadDisponible[index]){
      let nombreClases = e.target.className;
      let expReg= /sobrePasa/;
      if(expReg.test(nombreClases)==false){
        e.target.className+=' sobrePasa';
      }
      setMensajeAlerta('Cantidad mayor a cantidad disponible.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
    // Si el usuario dejo el valor en blanco
    else if(e.target.value==''){
      let nombreClases = e.target.className;
      let expReg= /sobrePasa/;
      if(expReg.test(nombreClases)==false){
        e.target.className+=' sobrePasa';
      }
      setMensajeAlerta('Por favor indique cantidad o elimine la fila.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // Si todo esta correcto
    if(e.target.value<=cantidadDisponible[index]&&e.target.value!==''){
      let nombreClases = e.target.className;
      let expReg= /sobrePasa/;
      if(expReg.test(nombreClases)){
        nombreClases=nombreClases.replace('sobrePasa', '');
        e.target.className=nombreClases;
      }
    }

    // Guardando la info
    // let expRegSoloNum = /^[\d.]{0,1000}$/;
    let expRegNumeroDecimal = /^(\d*\.\d+|\d+\.?\d*)$/;
    if(expRegNumeroDecimal.test(e.target.value)===true||e.target.value==''){
      // Este condicional es para permitir puntos, cuando el usuario escribe 1 y despues un punto, en ese momento tenemos esto '1.', como no hay nada despues del punto, parsetFloat y tambien Number eliminan el punto en consecuencia el usuario le dara muchas veces al punto pero nunca aparecera

      let ultimoCaracter = e.target.value.charAt(e.target.value.length - 1);

      if(ultimoCaracter=='.'){
        setCopiarAFurgonMaster((prevState) =>
          prevState.map((item, i) =>
            i === index ? { ...item, qty: e.target.value } : item
          ));
      }
      else{
        setCopiarAFurgonMaster((prevState) =>
          prevState.map((item, i) =>
            i === index ? { ...item, qty: Number(e.target.value) } : item
          ));
      }

    }
  };

  // ****************Agregar materiales hasta bl**************
  const agregarABL=()=>{
    // Si estamos editando en la ventana orange, no debe agregar materiales
    if(ventanaJuntaMateriales==2){
      return'';
    }
    let validacion={
      nqtyNMayor:true,
      valoresCorrectos:true,
      sinEnBlanco:true,
      itemCopiados:true,
      ordenOculta:true,
    };

    copiarAFurgonMaster.forEach((item,index)=>{
      // Si existen item con cantidad mayor a cantidad disponible
      if(item.qty>cantidadDisponible[index]){
        setMensajeAlerta('Existen items con cantidad mayor a disponible.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.nqtyNMayor=false;
        return'';
      }
      // Si en alguno escribieron algo que no sea un numero
      // Esto nunca deberia ejecutarse, colocado por precaucion
      let expRegSoloNum = /^[\d.]{0,1000}$/;
      if(expRegSoloNum.test(item.qty)===false){
        setMensajeAlerta('Existen items con valores incorrectos.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.valoresCorrectos=false;
        return'';
      }
      // Si algun item lo dejaron en blanco o tiene valor 0
      if(item.qty==''||item.qty==0||item.qty=='0'){
        setMensajeAlerta('Existen items sin cantidades, eliminelo o indique su cantidad.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.sinEnBlanco=false;
        return'';
      }

    });

    // Si no hay item
    if(copiarAFurgonMaster.length==0){
      setMensajeAlerta('Por favor copie los items deseados.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.itemCopiados=false;
      return'';
    }
    // Si la ventana de materiales de orden esta visible
    if(ventanaOrdenVisible==true){
      setMensajeAlerta('Copie o cancele los materiales de la orden de compra mostrada.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.ordenOculta=false;
      return'';
    }

    // Si todo esta correcto
    if(
      validacion.ordenOculta==true&&
      validacion.nqtyNMayor==true&&
      validacion.valoresCorrectos==true&&
      validacion.sinEnBlanco==true&&
      validacion.itemCopiados==true&&
      tipo=='addBL'
    ){
      // **********ALIMENTANDO BL MASTER**********
      // Filtrando los datos de copiafurgonmaster hasta bl master, basicamente es quitar la propiedad qtyOrden y despachos
      const newCopia = furgonEditable;
      newCopia.materiales = copiarAFurgonMaster.map(({ despachos, qtyOrden, ...resto }) => ({
        ...resto,
        // qty: Number(qty),
      }));

      setBLEditable({
        ...blEditable,
        furgones:[
          ...blEditable.furgones,
          newCopia
        ]
      });

      // REINICIANDO TODO
      if(tipo=='addBL'){
        setValoresInputsFurgon(initialValueFurgon);
        inputNoFurgonRef.current.disabled=false;
        inputTamannioFurgonRef.current.disabled=false;
        inputNoFurgonRef.current.focus();
      }

      setCambiosSinGuardar(false);
      setVentanaJuntaMateriales(0);
      setCopiarAFurgonMaster([]);
      setFurgonEditable(initialValueFurgonEditable);
    }
  };

  // ****************Guardar cambios ventana Orange**************
  const guardarCambios =()=>{
    let validacion={
      nqtyNMayor:true,
      valoresCorrectos:true,
      sinEnBlanco:true,
      itemCopiados:true,
      ordenOculta:true,
    };

    copiarAFurgonMaster.forEach((item, index)=>{

      // Si existen item con cantidad mayor a cantida disponible
      if(item.qty>cantidadDisponible[index]){
        setMensajeAlerta('Existen items con cantidad mayor a cantidad disponible.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.nqtyNMayor=false;
        return'';
      }
      // Si en alguno escribieron algo que no sea un numero
      // Esto nunca deberia ejecutarse, colocado por precaucion
      let expRegSoloNum = /^[\d.]{0,1000}$/;
      if(expRegSoloNum.test(item.qty)===false){
        setMensajeAlerta('Existen items con valores incorrectos.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);

        validacion.valoresCorrectos=false;
        return'';
      }
      // Si algun item lo dejaron en blanco
      if(item.qty==''||item.qty==0||item.qty=='0'){
        setMensajeAlerta('Existen items sin cantidades, eliminelo o indique su cantidad.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.sinEnBlanco=false;
        return'';
      }
    });

    // Si no hay item
    if(copiarAFurgonMaster.length==0){
      setMensajeAlerta('Por favor copie los items deseados.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.itemCopiados=false;
      return'';
    }
    // Si el recuadro de orden de compra esta abierto,
    // Este bloqueo es necesario pues de otro modo el usuario podria agregar cantidades de mas al bl desde la orden de compra generando negativos
    if(ventanaOrdenVisible==true){
      if(tipo=='addBL'){
        setMensajeAlerta('Presione soltar o copie los materiales de la orden halada.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.ordenOculta=false;
        return'';
      }
      else if(tipo=='detalleBL'){
        if(newCopiaFurgon.length>0){
          setMensajeAlerta('Presione soltar o copie los materiales de la orden halada.');
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          validacion.ordenOculta=false;
          return'';
        }
      }
    }

    // si todo esta correcto
    if(
      validacion.nqtyNMayor==true&&
      validacion.valoresCorrectos==true&&
      validacion.sinEnBlanco==true&&
      validacion.itemCopiados==true&&
      validacion.ordenOculta==true
    ){

      // Guardar cambios en blEditable basicamente quitar las propiedades despachos y qtyOrden
      const materialesParsed = copiarAFurgonMaster.map(({ despachos, qtyOrden, ...resto }) => resto);
      setBLEditable((prevBL) => ({
        ...prevBL,
        furgones: prevBL.furgones.map((furgon, i) =>
          i === indexFurgonEnBL ? { ...furgon, materiales: materialesParsed } : furgon
        ),
      }));

      //
      if(tipo=='addBL'){
        inputNoFurgonRef.current.disabled=false;
        inputTamannioFurgonRef.current.disabled=false;
        setVentanaOrdenVisible(false);
      }

      // Reiniciando
      setCambiosSinGuardar(false);
      setFurgonEditable(initialValueFurgonEditable);
      setCopiarAFurgonMaster([]);
      setVentanaJuntaMateriales(0);

      // Reiniciar del recuadro de la orden
      if(tipo=='detalleBL'){
        setNClasesPadre([]);
        setOCMaster(false);
        setNewCopiaFurgon([]);
        inputOrdenCompraRef.current.disabled=false;
        setValorInputMainOrden('');
      }

    }
  };

  // ****************Eliminar fila**************
  const eliminarFila=(e)=>{
    let index=Number(e.target.dataset.id);
    setCambiosSinGuardar(true);
    setCopiarAFurgonMaster(copiarAFurgonMaster.filter((copiaFurgon, indexCopia) =>{
      return indexCopia!=index;
    }));

  };

  // ****************Cancelar tabla********************
  const cancelarTabla=()=>{
    setCambiosSinGuardar(false);
    setIndexFurgonEnBL(null);
    setVentanaJuntaMateriales(0);
    setCopiarAFurgonMaster([]);
    inputNoFurgonRef.current.disabled=false;
    inputTamannioFurgonRef.current.disabled=false;

    setValoresInputsFurgon(initialValueFurgon);
    setFurgonEditable(initialValueFurgonEditable);

  };

  // <------------------->
  return (
    <>
      {tipo=='addBL'&&
      <CajaBotones
        className={
          ventanaJuntaMateriales==2?
            'isEditFurgon':
            ''}
      >
        {
          ventanaJuntaMateriales==1?
            <BtnNormal
              type='button'
              ref={btnAgregar}
              onClick={()=>agregarABL()}
            >
              <Icono icon={faPlus}/>
          Agregar a BL
            </BtnNormal>
            :
            ''
        }

        <BtnNormal
          type='button'
          className='cancelar'
          onClick={()=>cancelarTabla()}
        >
          <Icono icon={faTrashCan}/>
        Cancelar
        </BtnNormal>

        {
          ventanaJuntaMateriales==2?
            <BtnNormal
              type='button'
              onClick={()=>guardarCambios()}
              className='guardar'
            >
              <Icono icon={faFloppyDisk}/>
           Guardar
            </BtnNormal>
            :
            ''
        }
      </CajaBotones>
      }
      {
        tipo=='detalleBL'?
          <CajaBotones>
            <BtnNormal
              type='button'
              ref={btnAgregar}
              onClick={()=>guardarCambios()}
            >
              <Icono icon={faPlus}/>
            Guardar materiales
            </BtnNormal>
            <BtnNormal
              type='button'
              className='cancelar'
              ref={btnAgregar}
              onClick={()=>cancelarAgregarMat()}
            >
              <Icono icon={faXmark}/>
            Cancelar
            </BtnNormal>
          </CajaBotones>
          :
          ''
      }

      <Tabla
        ref={tablaFurgonRef}
        className={ventanaJuntaMateriales==2?'isEditFurgon':''}
      >
        <thead>
          <Filas>
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Codigo</CeldaHead>
            <CeldaHead>Descripcion</CeldaHead>
            <CeldaHead>Copiando</CeldaHead>
            <CeldaHead>Disponible</CeldaHead>
            <CeldaHead>O/C</CeldaHead>
            <CeldaHead>Eliminar</CeldaHead>
          </Filas>
        </thead>
        <tbody>
          {
            copiarAFurgonMaster.length>0?
              copiarAFurgonMaster.map((item,index)=>{

                return(
                  <Filas key={index}>
                    <CeldasBody>{index+1}</CeldasBody>
                    <CeldasBody>{item.codigo}</CeldasBody>
                    <CeldasBody className='descripcion'>{item.descripcion}</CeldasBody>
                    <CeldasBody>
                      <InputCelda
                        type='text'
                        name='qtyCopiar'
                        value={copiarAFurgonMaster[index].qty}
                        data-id={index}
                        onChange={(e)=>handleInputs(e)}
                        onKeyUp={(e)=>copiarEnter(e)}
                        autoComplete='off'
                      />
                    </CeldasBody>
                    <CeldasBody>{cantidadDisponible[index]}</CeldasBody>
                    <CeldasBody>{item.ordenCompra}</CeldasBody>
                    <CeldasBody
                      className='eliminar'
                      data-id={index}
                      onClick={(e)=>eliminarFila(e)}
                    >
                    ❌</CeldasBody>
                  </Filas>);
                // }

              })
              :
              <Filas>
                <CeldasBody>-</CeldasBody>
                <CeldasBody>-</CeldasBody>
                <CeldasBody>-</CeldasBody>
                <CeldasBody>-</CeldasBody>
                <CeldasBody>-</CeldasBody>
                <CeldasBody>-</CeldasBody>
                <CeldasBody>-</CeldasBody>
              </Filas>
          }

        </tbody>
      </Tabla>
    </>
  );
};

// ---------
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 30px;
  background-color: ${theme.azulOscuro1Sbetav2};
  color:white;
  &.isEditFurgon{
    background-color: ${theme.edicionYellow};
    color: #333232;
  }
  `;
const Filas =styled.tr`
`;

const CeldaHead= styled.th`
   border-bottom: 1px solid #605e5e;
  padding: 3px 8px;
  text-align: center;
  background-color: #2b7d9e5d;
  border-right: 1px solid #5e5e60;
  font-size: 0.9rem;
 

  &:first-child{
    width: 40px;
  }
  &:nth-child(2) {
    width: 10px;
  }
  &:nth-child(3) {
    width: 250px;
  }
  &:nth-child(4) {
    width: 60px;
  }
  &:nth-child(5) {
    width: 100px;
  }
`;
const CeldasBody = styled.td`
font-size: 0.9rem;
border: 1px solid black;
height: 25px;
text-align: center;
&.eliminar{
    cursor: pointer;
  }
  &.descripcion{
    text-align: start;
    padding-left: 10px;
  }
`;
const InputCelda=styled.input`
&::-webkit-outer-spin-button{
  -webkit-appearance: none;
    margin: 0;
}
&::-webkit-inner-spin-button{
  -webkit-appearance: none;
    margin: 0;
}
  width: 60px;
  text-align: center;
  margin: 0;
  height: 25px;
  outline: none;
  border: none;
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 4px;
  border-radius: 5px;
  border: 1px solid ${theme.azul1};
  &:focus{
    border: 1px solid ${theme.azul2};
  }
  &.sobrePasa{
    border: 1px solid red;
  }
`;

const CajaBotones =styled.div`
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;
  display: flex;
`;
const BtnNormal=styled(BtnGeneralButton)`
width: auto;
&.cancelar{
    background-color: red;
    width: auto;
    padding: 5px;
    &:hover{
      background-color: white;
      color: red
    }
  }

&.guardar{
    background-color: #b9a603;
    width: auto;
    padding: 5px;
    &:hover{
      background-color: white;
      color: red
    }
  }
`;

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
// 751