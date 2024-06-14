import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import { NavLink } from 'react-router-dom';
import { CSSLoader } from '../../components/CSSLoader';
import { ControlesTablasMain } from '../components/ControlesTablasMain';
import DimensionScreen from '../../components/DimensionScreen';

export const TablaCiclo01Proveedor = ({
  dbOrdenes,
}) => {
  const [width, setWidth] = useState(window.innerWidth,);

  DimensionScreen(window.innerWidth,setWidth);

  // // ******************** RECURSOS GENERALES ******************** //

  // const [habilitar,setHabilitar]=useState({
  const habilitar={
    search:true,
    // status:true,
    opcionesUnicas:true
  };

  // // ************************** CODIGO LOADING ************************** //
  const [isLoading,setIsLoading]=useState(false);
  useEffect(()=>{
    if(dbOrdenes.length>0){
      setIsLoading(false);
    }
    if(dbOrdenes.length==0){
      setIsLoading(true);
    }
  },[dbOrdenes]);

  // // ******************** CONSOLIDACION ******************** //

  const [initialValueMatOC,setInitialValueMatOC]=useState([]);
  const [matOC,setMatOC]=useState([]);

  const [listaOrdenes,setListaOrdenes]=useState([]);
  const [initialValueOrden,setInitialValueOrden]=useState([]);

  useEffect(() => {
    // Obtener materiales de ordenes de compra
    let materialesOC = [];
    for(const orden of dbOrdenes){
      if(orden.estadoDoc!=2){
        for(const material of orden.materiales){
          let cantidadPendiente=0;
          let cantidadDespachada=0;
          if(material.despachos.length>0){
            material.despachos.forEach(desp=>{
              cantidadDespachada+=desp.qty;
            });
          }
          cantidadPendiente=material.qty-cantidadDespachada;
          // Si ya se despacho la cantidad completa de este item

          if(cantidadPendiente!=0){
            materialesOC=[
              ...materialesOC,
              {
                ...material,
                ordenCompra:orden.numeroDoc,
                proveedor:orden.proveedor,
                qtyPendiente:cantidadPendiente,
                qtyDespachada:cantidadDespachada,
              }
            ];
          }
        }
      }
    }

    setInitialValueMatOC(materialesOC);

    setMatOC(materialesOC);

    // ORDENES DE COMPRA
    // Obtener lista de ordenes de compra sin eliminadas
    const ordenSinEliminadas=dbOrdenes.filter(orden=>orden.estadoDoc!=2);

    // Calcular y filtrar estado de orden, abiertas o cerradas
    const ordenesParsed=(ordenSinEliminadas.filter((orden)=>{
      let matSombra=orden.materiales;
      let estadoDoc=0;
      for(let i=0;i<orden.materiales.length;i++){
        let item =orden.materiales[i];
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
      }

      // CERRADA
      // Si todos sus articulos estan despachos al 100%,
      if(matSombra.every((articulo)=> {return articulo.cerrado==1;})){
        estadoDoc =1;
      }
      // ABIERTA
      // Si alguno de sus items tiene cantidad pendiente
      else if(matSombra.some((articulo)=> {return articulo.cerrado==0;})){
        estadoDoc=0;
      }
      // CON NEGATIVOS
      // Si alguno de sus items tiene cantidad despachada mayor a cantidad disponible
      else if(matSombra.some((articulo)=> {return articulo.cerrado==2;})){
        estadoDoc=3;
      }

      if(estadoDoc!=1){
        return orden;
      }

    }));
    setInitialValueOrden(ordenesParsed);
    setListaOrdenes(ordenesParsed);

  }, [dbOrdenes]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput]=useState('');

  const handleSearch=(e)=>{
    let entradaMaster=e.target.value.toLowerCase();
    setBuscarDocInput(entradaMaster);

    if(arrayOpciones[1].select==true){
      if(e.target.name=='inputBuscar'){
        setMatOC(initialValueMatOC.filter((item)=>{
          if(
            item.codigo.toLowerCase().includes(entradaMaster)||
              item.descripcion.toLowerCase().includes(entradaMaster)||
              item.qtyPendiente.toString().includes(entradaMaster)||
              item.proveedor.toLowerCase().includes(entradaMaster)||
              item.ordenCompra.toLowerCase().includes(entradaMaster)||
              item.comentarios.toLowerCase().includes(entradaMaster)
          ){
            return item;
          }
        }));
      }
    }
    else if(arrayOpciones[0].select==true){
      if(e.target.name=='inputBuscar'){
        setListaOrdenes(initialValueOrden.filter((orden)=>{
          if(
            orden.numeroDoc.toLowerCase().includes(entradaMaster)||
              orden.proveedor.toLowerCase().includes(entradaMaster)||
              orden.comentarios.toLowerCase().includes(entradaMaster)
          ){
            return orden;
          }
        }));
      }
    }

    if(e.target.value==''&&buscarDocInput==''){
      setMatOC(initialValueMatOC);
      setListaOrdenes(initialValueOrden);
    }
  };

  const [arrayOpciones, setArrayOpciones]=useState([
    {
      nombre:width>300?'Ordenes de compra':'O/C',
      opcion:0,
      select: true
    },
    {
      nombre:'Articulos',
      opcion:1,
      select: false
    }
  ]);

  const handleOpciones=(e)=>{
    setBuscarDocInput('');
    let index=Number(e.target.dataset.id);

    setArrayOpciones(prevOpciones =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  return (
    <>
      <TituloEncabezadoTabla className='descripcionEtapa'>
        <Resaltar >En Proveedor</Resaltar>: Es la primera etapa del ciclo de vida del proceso de importación e inicia cuando Cielos Acústicos envía la orden de compra y finaliza cuando el proveedor carga los materiales en el contenedor.
      </TituloEncabezadoTabla>
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
          Lista de ordenes de compras abiertas y sus materiales.
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          handleOpciones={handleOpciones}
          arrayOpciones={arrayOpciones}
          buscarDocInput={buscarDocInput}
          tipo={'proveedor'}
        />
      </CabeceraListaAll>

      <>
        {
          arrayOpciones[1].select==true?
            <CajaTabla>

              <Tabla>
                <thead>
                  <Filas className='cabeza'>
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Codigo*</CeldaHead>
                    <CeldaHead >Descripcion</CeldaHead>
                    <CeldaHead>Qty Pendiente</CeldaHead>
                    <CeldaHead>Proveedor</CeldaHead>
                    <CeldaHead>O/C*</CeldaHead>
                    <CeldaHead className='comentarios'>Comentarios</CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  {

                    matOC.map((item,index)=>{
                      return(
                        <Filas key={index} className='body'>
                          <CeldasBody>{index+1}</CeldasBody>
                          <CeldasBody>
                            <Enlaces
                              to={`/importaciones/maestros/articulos/${item.codigo}`}
                              target="_blank"
                            >{item.codigo}
                            </Enlaces>
                          </CeldasBody>
                          <CeldasBody
                            title={item.descripcion}
                            className='descripcion'>
                            {item.descripcion}
                          </CeldasBody>
                          <CeldasBody>{item.qtyPendiente}</CeldasBody>
                          <CeldasBody
                            title={item.proveedor}
                            className='proveedor'>
                            {item.proveedor}
                          </CeldasBody>
                          <CeldasBody>
                            <Enlaces
                              to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
                              target="_blank"
                            >{item.ordenCompra}
                            </Enlaces>
                          </CeldasBody>
                          <CeldasBody>{item.comentarios}</CeldasBody>
                        </Filas>
                      );
                    })
                  }
                </tbody>

              </Tabla>
            </CajaTabla>
            :
            arrayOpciones[0].select==true?
              <CajaTabla>
                <Tabla>

                  <thead>
                    <Filas className='cabeza'>
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead>Numero*</CeldaHead>
                      <CeldaHead>Proveedor</CeldaHead>
                      <CeldaHead>Comentarios</CeldaHead>
                    </Filas>
                  </thead>
                  <tbody>
                    {
                      listaOrdenes?.map((orden,index)=>{
                        return(
                          <Filas
                            key={index}
                            className='body'
                          >
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/ordenescompra/${orden.numeroDoc}`}
                                target="_blank"
                              >
                                {orden.numeroDoc}
                              </Enlaces>
                            </CeldasBody>
                            <CeldasBody className='proveedor' >{orden.proveedor}</CeldasBody>
                            <CeldasBody>{orden.comentarios}</CeldasBody>
                          </Filas>
                        );
                      })
                    }
                  </tbody>

                </Tabla>
              </CajaTabla>

              :
              <Filas></Filas>

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
    </>
  );
};

const CabeceraListaAll=styled.div`
    background-color: ${theme.azulOscuro1Sbetav};
`;

const CajaLoader=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

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

`;
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
  &.comentarios{
    max-width: 200px;
  }
`;
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
`;

const Enlaces=styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover{
    text-decoration: underline;
  }
`;

const EncabezadoTabla =styled.div`
  /* margin-top: 20px; */
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;

  display: flex;
  justify-content: start;
  align-items: center;
`;
const TituloEncabezadoTabla=styled.h2`
  color: #757575;
  font-size: 1.2rem;
  font-weight: normal;
  padding: 0 10px;
  @media screen and (max-width:500px){
    font-size: 16px;

  }
  @media screen and (max-width:420px){
    font-size: 14px;

  }

  &.descripcionEtapa{
    font-size: 0.9rem;
    margin: 0;
    padding:0 15px;
    @media screen and (max-width:480px){
      font-size: 12px;
      /* border: 1px solid red; */
    }
  }
  
`;

const Resaltar =styled.span`
  text-decoration: underline;
  font-weight: bold;
`;