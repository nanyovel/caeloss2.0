import {useState,useEffect } from 'react';
import theme from '../../config/theme.jsx';

import styled from 'styled-components';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCodePullRequest,faXmark } from '@fortawesome/free-solid-svg-icons';

export const TablaAddBLOrden = ({
  ocMaster,
  setOCMaster,
  copiarAFurgonMaster,
  setCopiarAFurgonMaster,
  tablaOrdenRef,
  primerInputTablaOrdenRef,
  setVentanaOrdenVisible,
  valorInputMainOrden,
  setValorInputMainOrden,
  inputOrdenCompraRef,
  tipo,
  blEditable,
  newCopiaFurgon,
  setNewCopiaFurgon,
  setCambiosSinGuardar,

  // Alertas
  setMensajeAlerta,
  setTipoAlerta,
  setDispatchAlerta,
  // add BL
  ventanaJuntaMateriales,
  // detalle BL
  buscarOrden,
  refBtnBuscar,
  blMaster,
}) => {
  // ********************* DOCUMENTACION ********************//
  // newCopiaFurgon
  // Es la matriz base de la tabla unificadora que muestra los materiales de la orden deseada
  //
  //
  //

  // ******************** RECURSOS GENERALES ******************** //

  const shortHands=(e)=>{
    if(e.key=='Enter'){
      if(e.target.name=='buscarDocInput'){
        buscarOrden();
      }
      else {
        copiarMateriales();
      }
    }
  };

  const reiniciarCosas=(funcion)=>{
    if(funcion=='copiarMateriales'){
      if(tipo=='addBL'){
        setVentanaOrdenVisible(false);
        inputOrdenCompraRef.current.disabled=false;
        inputOrdenCompraRef.current.focus();
        setOCMaster(false);
        setValorInputMainOrden('');
        setNewCopiaFurgon([]);
      }
      else if(tipo=='detalleBL'){
        inputOrdenCompraRef.current.disabled=false;
        inputOrdenCompraRef.current.focus();
        setOCMaster(false);
        setValorInputMainOrden('');
        setNewCopiaFurgon([]);
      }
    }
    else if(funcion=='cancelarTabla'){
      if(tipo=='addBL'){
        inputOrdenCompraRef.current.disabled=false;
        setOCMaster(false);
        setValorInputMainOrden('');
        setNewCopiaFurgon([]);

        setVentanaOrdenVisible(false);
        inputOrdenCompraRef.current.focus();
      }
      else if(tipo=='detalleBL'){
        setOCMaster(false);
        setNewCopiaFurgon([]);
        inputOrdenCompraRef.current.disabled=false;
        setValorInputMainOrden('');
        inputOrdenCompraRef.current.focus();
      }

    }
  };

  // Obtener cantidad disponible de cada item de newCopiaFurgon
  const [cantidadDisponible, setCantidadDisponible]=useState([]);
  useEffect(()=>{

    newCopiaFurgon.forEach((item,index)=>{
      let cantidadDespachada=0;
      let qtyCargadaBL=0;

      // // Obtener cantidades desde la base de datos
      // if(item.despachos.length>0){
      //   item.despachos.map((desp,index)=>{
      //     cantidadDespachada+=desp.qty
      //   })
      // }

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
            qtyCargadaBL+=product.qty;
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

  },[blEditable.furgones, blMaster, newCopiaFurgon, tipo]);

  // ******************** MANEJANDO LOS INPUTS ******************** //

  //  Inputs cabecera  -DETALLE BL-
  const handleInputCabecera=(e)=>{
    if(e.target.name=='buscarDocInput'){
      setValorInputMainOrden(e.target.value);
    }
  };

  const handleInputs=(e)=>{
    e.preventDefault();
    let index=Number(e.target.dataset.id);

    // Guardando la info
    let newCopia=newCopiaFurgon;
    let expReg = /^[\d.]{0,1000}$/;

    let expSoloUnPunto=/^[^.]*\.{0,1}[^.]*$/;
    let tientePunto=false;
    if(expSoloUnPunto.test(e.target.value)){
      tientePunto=true;
    }
    if(expReg.test(e.target.value)===true){
      newCopia=newCopiaFurgon.map((item,indexCopia)=>{
        if(index==indexCopia){
          return{
            ...item,
            qty:tientePunto?e.target.value:Number(e.target.value),
          };
        }
        else{
          return item;
        }
      });
    }
    setNewCopiaFurgon(newCopia);

    // Si el codigo ya ha sido agregado
    let nDuplicate=true;
    if(newCopia[index].qty>0){
      copiarAFurgonMaster.forEach((item2)=>{
        if(item2.codigo==newCopia[index].codigo&&item2.ordenCompra==newCopia[index].ordenCompra)
        {
          let nombreClases = e.target.className;
          let expReg= /sobrePasa/;
          if(expReg.test(nombreClases)==false){
            e.target.className+=' sobrePasa';
          }
          setMensajeAlerta(`Este item ya ha sido agregado, mejor modifica la cantidad ya agregada.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          nDuplicate=false;
        }
      });
    }
    else if(newCopia[index].qty==''){
      let nombreClases = e.target.className;
      let expReg= /sobrePasa/;
      if(expReg.test(nombreClases)){
        nombreClases=nombreClases.replace('sobrePasa', '');
        e.target.className=nombreClases;
      }
    }

    // Si la cantidad indicada es mayor a cantidad disponible
    if(e.target.value>cantidadDisponible[index]){
      let nombreClases = e.target.className;
      let expReg= /sobrePasa/;
      if(expReg.test(nombreClases)==false){
        e.target.className+=' sobrePasa';
      }

      setMensajeAlerta('La cantidad indicada supera la cantidad disponible.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // Si la info esta correcta
    if(nDuplicate==true){
      if(e.target.value<=cantidadDisponible[index]&&e.target.value!==''){
        let nombreClases = e.target.className;
        let expReg= /sobrePasa/;
        if(expReg.test(nombreClases)){
          nombreClases=nombreClases.replace('sobrePasa', '');
          e.target.className=nombreClases;
        }
      }
    }
  };

  // ********* COPIAR MATERIALES DE LOS INPUTS A LA UNIFICADORA DE MATERIALES *********//
  const copiarMateriales=()=>{
    let validacion={
      nqtyNMayor:true,
      nDuplicate:true,
      furgon:true,
      nEpty:true,
    };
    // Calcular cantidad pendiente y disponible
    newCopiaFurgon.forEach((item,index)=>{
      // let qtyCargadaBL =0;
      // // Obtener qtyCargadaBL que es la cantidad despachada pero de este BL es decir aun sin enviar a la base de datos
      // if(item.qty>0){
      //   blEditable.furgones.forEach((furgon)=>{
      //     furgon.materiales.forEach(product=>{
      //       if(product.ordenCompra==item.ordenCompra&&
      //         product.codigo==item.codigo
      //       ){
      //         qtyCargadaBL+=product.qty;
      //       }
      //     });
      //   });
      // }

      // Si algun item tiene una cantidad mayor a su cantidad disponible

      if(item.qty>cantidadDisponible[index]){
        setMensajeAlerta('Existen item cuya cantidad supera cantidad disponible.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.nqtyNMayor=false;
        return'';
      }

      // Si existe item que ya copio de la misma orden al mismo furgon
      if(item.qty>0){
        copiarAFurgonMaster.forEach((item2)=>{
          if(
            item2.codigo==item.codigo&&
            item2.ordenCompra==item.ordenCompra
          ){
            setMensajeAlerta(`El codigo ${item.codigo} en la fila ${index+1} ya ha sido agregado, mejor modifica la cantidad ya agregada.`);
            setTipoAlerta('warning');
            setDispatchAlerta(true);
            setTimeout(() => {
              setDispatchAlerta(false);
            }, 5000);
            validacion.nDuplicate=false;
            return'';
          }
        });
      }

    });

    // Si aun no se establece un furgon
    if(ventanaJuntaMateriales==0){
      setMensajeAlerta('Primero fije un contenedor.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

      validacion.furgon=false;
      return'';
    }

    // Si el usuario aun no indica los materiales a copiar
    const todosVacios = newCopiaFurgon.every(objeto => objeto.qty === '');
    if(todosVacios){
      setMensajeAlerta('Indica los materiales a copiar.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.nEpty=false;
      return'';
    }

    // Si todo esta okay
    if(
      validacion.nqtyNMayor==true&&
      validacion.nDuplicate==true&&
      validacion.furgon==true&&
      validacion.nEpty==true
    ){

      // Esto para saber cuando el usuario realizo algun cambio
      setCambiosSinGuardar(true);

      // Dame solo los articulos con cantidad
      setCopiarAFurgonMaster([
        ...copiarAFurgonMaster,
        ...newCopiaFurgon.filter(item => item.qty > 0).map(item => ({ ...item, qty: Number(item.qty) }))
      ]);

      reiniciarCosas('copiarMateriales');
    }
  };
  // ********************* CANCELAR TABLA ********************//
  const cancelarTabla=()=>{
    reiniciarCosas('cancelarTabla');
  };
  return (
    <>
      <CajaBotones>
        <BtnNormal
          type='button'
          onClick={()=>copiarMateriales()}
        >
          <Icono icon={faCopy}/>
        Copiar
        </BtnNormal>
        <BtnNormal
          type='button'
          className='cancelar'
          onClick={()=>cancelarTabla()}
        >
          <Icono icon={faXmark}/>
        Soltar
        </BtnNormal>

        {
          tipo=='detalleBL'?
            <>
              <ContenedorBuscar >
                <Texto>
              Orden Compra: {''}
                </Texto>
                <InputBuscar
                  type='text'
                  name='buscarDocInput'
                  value={valorInputMainOrden}
                  onChange={(e)=>handleInputCabecera(e)}
                  onKeyUp={(e)=>shortHands(e)}
                  ref={inputOrdenCompraRef}
                  className={ocMaster?'disable':''}
                />
                <BtnNormal
                  type='submit'
                  className={`buscar ${ocMaster?'disabled':''}`}
                  onClick={()=>buscarOrden()}
                  ref={refBtnBuscar}

                >
                  <Icono icon={faCodePullRequest} className='fa-thin'/>
              Halar
                </BtnNormal>
              </ContenedorBuscar>
            </>
            :
            ''
        }
      </CajaBotones>
      <CajaTabla>
        <Tabla ref={tablaOrdenRef}>
          <thead>
            <Filas>
              <CeldaHead>N°</CeldaHead>
              <CeldaHead>Codigo</CeldaHead>
              <CeldaHead>Descripcion</CeldaHead>
              <CeldaHead>Qty</CeldaHead>
              <CeldaHead>Disponible</CeldaHead>
              <CeldaHead>Qty copiar</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {
              newCopiaFurgon.length>0?
                newCopiaFurgon.map((item,index)=>{
                  return(
                    <Filas key={index}>
                      <CeldasBody>{index+1}</CeldasBody>
                      <CeldasBody>{item.codigo}</CeldasBody>
                      <CeldasBody className='descripcion'>{item.descripcion}</CeldasBody>
                      <CeldasBody>{item.qtyOrden}</CeldasBody>
                      <CeldasBody>{cantidadDisponible[index]}</CeldasBody>
                      <CeldasBody>
                        <InputCelda
                          type='text'
                          ref={index==0?primerInputTablaOrdenRef:null}
                          name='qtyCopiar'
                          data-id={index}
                          onChange={(e)=>handleInputs(e)}
                          onKeyUp={(e)=>shortHands(e)}
                          value={newCopiaFurgon[index]?.qty || ''}
                          autoComplete='off'
                        />
                      </CeldasBody>
                    </Filas>
                  );
                })
                :
                <Filas>
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
      </CajaTabla>

    </>
  );
};

const CajaTabla=styled.div`
overflow-x: scroll;
width: 100%;
padding: 0 20px;

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

      /* margin-bottom: 100px; */


`;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border: 1px solid white;
  border-radius: 5px;
  width: 95%;
  margin: auto;
  margin-bottom: 100px;
  border: 1px solid ${theme.azul1};
  `;
const Filas =styled.tr`
  background-color: ${theme.azulOscuro1Sbetav2};
`;

const CeldaHead= styled.th`
   border-bottom: 1px solid #605e5e;
  padding: 3px 8px;
  text-align: center;
  background-color: #2b7d9e5d;
  color: white;
  font-size: 0.9rem;
  border: 1px solid ${theme.azul1};
  &.qty{
    width: 300px;
  }

  &:first-child{
    width: 40px;
  }
  &:nth-child(2) {
    width: 50px;
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
  background-color: #2f85d0;
  color: #252020;
  font-size: 0.9rem;
  height: 25px;
  text-align: center;
  &.romo{
    cursor: pointer;
    &:hover{
  }}
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
`;
const BtnNormal=styled(BtnGeneralButton)`
  &.cancelar{
    background-color: red;
    width: auto;
    padding: 5px;
    &:hover{
      background-color: white;
      color: red
    }
  }
  &.buscar{
    margin: 0;
  }
  &.disabled{
    background-color: ${theme.fondo};
    color: black;
    cursor: auto;
  }
`;

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const ContenedorBuscar=styled.div`
  background-color: ${theme.azulOscuro1Sbetav3};
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  color: ${theme.azul2};
  &.editando{
    background-color: #5e5d60;
    color: black;
  }

`;

const Texto=styled.h2`
  color: inherit;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;
`;

const InputBuscar=styled.input`
  border: none;
  outline: none;
  height: 25px;
  border-radius: 4px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  border: 1px solid ${theme.azul1};
  color: ${theme.azul2};
  margin-right: 5px;
  &.disable{
    background-color: ${theme.fondo};
    color: black;
  }
`;
// 581