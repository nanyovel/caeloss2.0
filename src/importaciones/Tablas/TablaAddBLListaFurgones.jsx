import styled from 'styled-components';


import theme from '../../config/theme.jsx';

// import { BotonQuery } from '../../components/BotonQuery';

export const TablaAddBLListaFurgones = (
  {
    blEditable,
    setBLEditable,
    tablaFurgonRef,
    setFurgonEditable,
    setCopiarAFurgonMaster,
    listaFurgonesRef,
    ventanaJuntaMateriales,
    setVentanaJuntaMateriales,
    setIndexFurgonEnBL,
    inputNoFurgonRef,
    inputTamannioFurgonRef,
    dbOrdenes,
    setDBOrdenes,
    setVentanaOrdenVisible,
    setDispatchAlerta,
    setMensajeAlerta,
    setTipoAlerta,
    inputOrdenCompraRef,
    setValorInputMainOrden,
    initialValueFurgon,
    setValoresInputsFurgon,
    initialValueFurgonEditable,
    cambiosSinGuardar,
  }
) => {

  // Info relevante:
  // No deben haber contenedores con mismo numero que otro, esto traeria un monton de problemas, que afectaria incluso los despachos de la colecion de la orden, dado que se calculo filtrando los furgones que numero se diferente al res !=, esto para no calaculos los despachos de X furgon, si tenemos el mismo numero de furgon dos veces entonces en los despachos no se tomaran sus materiales, pero ademas afecta otras mas cosas aparte de los despachos de las ordenes

  const numerosDeFurgones = new Set();

  const handleInput=(e)=>{
    const index=Number(e.target.dataset.id);
    const { name, value } = e.target;

    blEditable.furgones.forEach(furgon => {
      numerosDeFurgones.add(furgon.numeroDoc.toString());
    });

    let hayDuplicados=false;
    if(name=='numeroDoc'){
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
      setBLEditable((prevBL) => {
        const transformedValue = name === 'numeroDoc' ? value.toUpperCase() : value;
        const newFurgones = [...prevBL.furgones];
        const updatedFurgon = { ...newFurgones[index], [name]: transformedValue };
        newFurgones[index] = updatedFurgon;
        return { ...prevBL, furgones: newFurgones };
      });
    }
  };

  const showFurgon=(e)=>{
    const index=Number(e.target.dataset.id);
    let validacion={
      edicionInactiva:true
    };

    // Si se realizaron cambios en la ventana juntadora de materiales
    if(cambiosSinGuardar==true){
      setMensajeAlerta('Guarda o cancela el contenedor en edicion.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 5000);
      validacion.edicionInactiva=false;
      return;
    }
    // Si todo esta correcto
    if(validacion.edicionInactiva==true){
      setIndexFurgonEnBL(index);
      setCopiarAFurgonMaster([]);

      inputNoFurgonRef.current.disabled=true;
      inputTamannioFurgonRef.current.disabled=true;
      setFurgonEditable({});

      setCopiarAFurgonMaster(blEditable.furgones[index].materiales.map((item)=>{
        let valoresParsed={};
        dbOrdenes.map((orden)=>{
          orden.materiales.map((product)=>{
            if(item.codigo==product.codigo&&item.ordenCompra==orden.numeroDoc){
              valoresParsed.qtyOrden=product.qty;
              valoresParsed.despachos=product.despachos;
            }
          });
        });

        return{
          ...item,
          qtyOrden:valoresParsed.qtyOrden,
          despachos:valoresParsed.despachos
        };
      }));

      setVentanaJuntaMateriales(0);
      setTimeout(() => {
        setVentanaJuntaMateriales(2);
      }, 100);
      setTimeout(() => {
        tablaFurgonRef.current.scrollIntoView({behavior: 'smooth'});
      }, 120);

      // Reiniciar furgon selecionado
      setValoresInputsFurgon(initialValueFurgon);
      setFurgonEditable(initialValueFurgonEditable);

      // Reiniciar materiales de orden compra
      inputOrdenCompraRef.current.disabled=false;
      setVentanaOrdenVisible(false);
      setValorInputMainOrden('');
    }
  };

  const eliminarFila=(e)=>{
    let index=Number(e.target.dataset.id);
    let validacion={
      sinEdicion:true,
    };
    // Si la ventana juntadora de materiales esta visible
    if(ventanaJuntaMateriales>0){
      setMensajeAlerta('Primero guarde o cancele el recuadro unificador.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.sinEdicion=false;
      return;
    }

    setBLEditable({
      ...blEditable,
      furgones:blEditable.furgones.filter((copiaFurgon, indexCopia) => indexCopia!=index)
    });

    setCopiarAFurgonMaster([]);
    inputNoFurgonRef.current.disabled=false;
    inputTamannioFurgonRef.current.disabled=false;

    // update despachos
    let newOrden=dbOrdenes;
    dbOrdenes.map((orden, indexOrden)=>{
      orden.materiales.map((item,indexItem)=>{
        newOrden[indexOrden].materiales[indexItem].despachos=
        dbOrdenes[indexOrden].materiales[indexItem].despachos.filter((despachoCopia)=>despachoCopia.furgon!=blEditable.furgones[index].numeroDoc);
      });
    });

    // update Orden
    setDBOrdenes(dbOrdenes.map((orden)=>{
      const matParsed=orden.materiales.map((item)=>{
        const despachoFiltrado=item.despachos.filter((desp)=>{
          if(desp.furgon!=blEditable.furgones[index].numeroDoc){
            return desp;
          }
        });
        return{
          ...item,
          despachos:despachoFiltrado
        };
      });

      return{
        ...orden,
        materiales:matParsed
      };
    }));

  };

  const clonar=(e)=>{
    const index=Number(e.target.dataset.id);
    let validacion={
      clonar:true
    };

    blEditable.furgones[index].materiales.forEach(item=>{
      // Calcular cantidad pendiente y disponible
      let cantidadDisponible=0;
      let cantidadDespachada=0;
      let qtyCargadaBL=0;

      // Obtener cantidad cargada es decir en este bl sin enviar a base de datos
      blEditable.furgones.forEach(furgon => {
        furgon.materiales.forEach(product=>{
          if(product.ordenCompra==item.ordenCompra&&product.codigo==item.codigo){
            qtyCargadaBL+=product.qty;
          }
        });
      });

      // Obtener la cantidad despachada de bl ya creados
      let qtyEnLaOrdenCompra=0;
      dbOrdenes.forEach(orden=>{
        if(orden.numeroDoc==item.ordenCompra){
          orden.materiales.forEach(articulo=>{
            if(articulo.codigo==item.codigo){
              qtyEnLaOrdenCompra=articulo.qty;
              if(articulo.despachos.length>0){
                articulo.despachos.forEach((desp)=>{
                  cantidadDespachada+=desp.qty;
                });
              }
            }
          });
        }
      });

      cantidadDisponible=qtyEnLaOrdenCompra-cantidadDespachada-qtyCargadaBL;

      // Si algun item no tiene cantidad suficiente para agregar otro furgon
      if(item.qty>cantidadDisponible){
        setMensajeAlerta(`Codigo ${item.codigo} sin disponibilidad suficiente.`);
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.clonar=false;
        return'';
      }
    });

    // Si la ventana compiladora de materiales esta activa
    if(ventanaJuntaMateriales>0){
      setMensajeAlerta(`Por favor guarde o cancele el recuadro unificador de materiales.`);
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.clonar=false;
      return'';
    }

    // Si todo esta correcto
    if(validacion.clonar==true){
      let nombreFurgon=(blEditable.furgones.length+1).toString();

      const clon={
        ...blEditable.furgones[index],
        numeroDoc:nombreFurgon
      };
      setBLEditable({
        ...blEditable,
        furgones:[
          ...blEditable.furgones,
          clon
        ]
      });
    }
  };

  return (
    <>
      {/* <BotonQuery
        blEditable={blEditable}
        numerosDeFurgones={numerosDeFurgones}
        /> */}
      <Tabla>
        <EncabezadoTabla>
          <Filas>
            <CeldasHead>N°</CeldasHead>
            <CeldasHead>Numero</CeldasHead>
            <CeldasHead>Tamaño </CeldasHead>
            <CeldasHead>Acciones</CeldasHead>
          </Filas>
        </EncabezadoTabla>
        <Cuerpo ref={listaFurgonesRef}>
          {
            blEditable.furgones.map((furgon, index)=>{
              return(
                <Filas key={index}>
                  <CeldasBody> {index+1}</CeldasBody>
                  <CeldasBody>
                    {
                      <InputEditable
                        type='text'
                        name='numeroDoc'
                        value={blEditable.furgones[index].numeroDoc}
                        data-id={index}
                        onChange={(e)=>handleInput(e)}
                        autoComplete='off'
                      />

                    }
                  </CeldasBody>
                  <CeldasBody>
                    <MenuDesplegable
                      value={blEditable.furgones[index].tamannio}
                      name='tamannio'
                      data-id={index}
                      onChange={(e)=>handleInput(e)}
                    >
                      <Opciones value="20'" >20&apos;</Opciones>
                      <Opciones value="40'" >40&apos;</Opciones>
                      <Opciones value="45'">45&apos;</Opciones>
                      <Opciones value="Otros">Otros</Opciones>
                    </MenuDesplegable>

                  </CeldasBody>
                  <CeldasBody>
                    <Ejecutar
                      data-id={index}
                      onClick={(e)=>eliminarFila(e)}
                    >
                        ❌
                    </Ejecutar>

                    <Ejecutar
                      data-id={index}
                      onClick={(e)=>{showFurgon(e);}}
                    >
                        Ⓜ️
                    </Ejecutar>
                    <Ejecutar
                      data-id={index}
                      onClick={(e)=>{clonar(e);}}
                    >
                        👥
                    </Ejecutar>
                  </CeldasBody>
                </Filas>);
            })
          }

        </Cuerpo>
      </Tabla>

    </>
  );
};

const Tabla=styled.table`
  border: 1px solid ${theme.azul1};
  color: ${theme.azul1};
  width: 100%;
  margin: auto;
  border-collapse: collapse;
`;

const Filas=styled.tr`
  width: 300px;
`;

const CeldasBody = styled.td`
    width: 800px;
font-size: 0.9rem;
border: 1px solid black;
height: 25px;

/* color: white; */
  text-align: center;
  &.romo{
    cursor: pointer;
    &:hover{
  }
  }
  &.descripcion{
    text-align: start;
    padding-left: 10px;
  }
  &.eliminar{
    cursor: pointer;
  }
`;

const Input=styled.input`
  height: 35px;
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

const InputEditable=styled(Input)`
  height: 24px;
  width: 120px;
  font-size: 0.8rem;
  padding: 8px;

  
`;

const MenuDesplegable=styled.select`
   height: 24px;
  outline: none;
  border-radius: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  /* padding: 10px; */
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
  background-color: ${theme.azulOscuro1Sbetav};
  /* font-size: 1rem; */
  &:hover{
    cursor: pointer;
  }
`;
const Ejecutar = styled.span`
  cursor: pointer;
  border: 1px solid ${theme.azulOscuro1Sbeta3};
  padding: 4px;
  border-radius: 3px;
  margin-right: 2px;
  font-size: 0.7rem;
  &:hover{
    border: 1px solid ${theme.azul2};
  }
`;
const Cuerpo =styled.tbody`
`;

// 343

const EncabezadoTabla=styled.thead`
  /* border: 1px solid white; */
  background-color: ${theme.azulOscuro1Sbetav3};
  width: 300px;
`;

const CeldasHead=styled.th`
width: 300px;
border: 1px solid ${theme.azul1};
`;
