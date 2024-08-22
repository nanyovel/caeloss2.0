import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../config/theme.jsx';
import { NavLink } from 'react-router-dom';
import { CSSLoader } from '../../components/CSSLoader';
import { ControlesTablasMain } from '../components/ControlesTablasMain';
import FuncionStatus from '../components/FuncionStatus';
// import { BotonQuery } from '../../components/BotonQuery';

export const TablaListaTodosLosItems = ({
  dbOrdenes,
  dbBillOfLading,
}) => {
  // console.log('itemssss')
  const [width, setWidth] = useState(window.innerWidth);
  // const [hasModal, setHasModal]=useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener en el componente desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // // ******************** RECURSOS GENERALES ******************** //

  const [isLoading,setIsLoading]=useState(false);

  // El menu desplegable status tiene su funcionalidad completa y todo, lo desactive para sencillez del equipo de comercial
  // const [habilitar,setHabilitar]=useState({
  //   search:true,
  //   // status:true,
  //   opcionesUnicas:true
  // });

  // // ************************** CODIGO LOADING ************************** //
  useEffect(()=>{
    if(dbOrdenes.length>0&&dbBillOfLading.length>0){
      setIsLoading(false);
    }
    if(dbOrdenes.length==0&&dbBillOfLading.length==0){
      setIsLoading(true);
    }
  },[dbBillOfLading,dbOrdenes]);

  // // ************************** CONSOLIDACION ************************** //
  const [initialValueMatBL,setInitialValueMatBL]=useState([]);
  const [matBL,setMatBL]=useState([]);

  const [initialValueMatOC,setInitialValueMatOC]=useState([]);
  const [matOC,setMatOC]=useState([]);

  useEffect(() => {
    // Obtener materiales de BL
    let materialesBL = [];
    for (const bill of dbBillOfLading) {
      if(bill.estadoDoc!=2){
        for (const furgon of bill.furgones) {
          if(furgon.status!=5){
            for (const material of furgon.materiales) {
              materialesBL=[
                ...materialesBL,
                {
                  ...material,
                  furgon:furgon.numeroDoc,
                  proveedor:bill.proveedor ,
                  llegadaSap:furgon.llegadaSap,
                  status:furgon.status
                }
              ];
            }
          }
        }
      }
    }
    setInitialValueMatBL(materialesBL);

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

    setMatBL(materialesBL);
    setMatOC(materialesOC);
  }, [dbBillOfLading,dbOrdenes]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput]=useState('');
  const [statusDocInput,setStatusDocInput]=useState('');

  const handleSearch=(e)=>{
    let shadowMatBL=[];
    let shadowMatOC=[];
    let entradaMaster=e.target.value.toLowerCase();
    let entradaSlave1='';

    if(e.target.name=='inputBuscar'){
      setBuscarDocInput(entradaMaster);
      entradaSlave1=statusDocInput.toLowerCase();
    }
    else if(e.target.name=='cicloVida'){
      setStatusDocInput(entradaMaster);
      entradaSlave1=buscarDocInput.toLowerCase();
    }

    if(arrayOpciones[0].select==true){
      if(e.target.name=='inputBuscar'){
        shadowMatBL=(initialValueMatBL.filter((item)=>{
          if(
            item.codigo.toLowerCase().includes(entradaMaster)||
              item.descripcion.toLowerCase().includes(entradaMaster)||
              item.qty.toString().includes(entradaMaster)||
              item.furgon.toLowerCase().includes(entradaMaster)||
              item.proveedor.toLowerCase().includes(entradaMaster)||
              item.ordenCompra.toLowerCase().includes(entradaMaster)||
              item.comentarios.toLowerCase().includes(entradaMaster)||
              item.comentarioOrden?.toLowerCase().includes(entradaMaster)
          ){
            return item;
          }
        }));

        if(statusDocInput!=''){
          shadowMatBL=(shadowMatBL.filter((item)=>{
            if(item.status==entradaSlave1){
              return item;
            }
          }));
        }
      }
      else if(e.target.name=='cicloVida'){
        if(entradaMaster!=''){
          shadowMatBL=(initialValueMatBL.filter((item)=>{
            if(item.status.toString()==entradaMaster.toString()){
              return item;
            }
          }));
        }
        else if(entradaMaster==''){
          shadowMatBL=initialValueMatBL;
        }

      // if(buscarDocInput!=''){
      //   shadowMatBL=(shadowMatBL.filter((item)=>{
      //     if(
      //       item.codigo.toLowerCase().includes(entradaSlave1)||
      //       item.descripcion.toLowerCase().includes(entradaSlave1)||
      //       item.qty.toString().includes(entradaSlave1)||
      //       item.furgon.toLowerCase().includes(entradaSlave1)||
      //       item.proveedor.toLowerCase().includes(entradaSlave1)||
      //       item.ordenCompra.toLowerCase().includes(entradaSlave1)||
      //       item.comentarios.toLowerCase().includes(entradaSlave1)
      //       ){
      //         return item
      //       }
      //     }))
      // }
      }

      setMatBL(shadowMatBL);
    }
    else if(arrayOpciones[1].select==true){
      if(e.target.name=='inputBuscar'){
      // setMatOC(initialValueMatOC.filter((item)=>{

        shadowMatOC=(initialValueMatOC.filter((item)=>{
          if(
            item.codigo.toLowerCase().includes(entradaMaster)||
          item.descripcion.toLowerCase().includes(entradaMaster)||
          item.qtyPendiente.toString().includes(entradaMaster)||
          item.proveedor.toLowerCase().includes(entradaMaster)||
          item.ordenCompra.toLowerCase().includes(entradaMaster)||
          item.comentarios.toLowerCase().includes(entradaMaster)||
          item.comentarioOrden?.toLowerCase().includes(entradaMaster)
          ){
            return item;
          }

        }));
      }
      setMatOC(shadowMatOC);

    }
    if(e.target.value==''&&buscarDocInput==''&&statusDocInput==''){
      setMatBL(initialValueMatBL);
      setMatOC(initialValueMatOC);
    }
  };

  const [arrayOpciones,setArrayOpciones]=useState([
    {
      nombre:'Enviados',
      opcion: 0,
      select:true,
    },
    {
      nombre:'Sin enviar',
      opcion: 1,
      select:false,
    },
  ]);

  const handleOpciones=(e)=>{
    let index=Number(e.target.dataset.id);
    setArrayOpciones(prevOpciones =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
    setMatBL(initialValueMatBL);
    setMatOC(initialValueMatOC);
    setBuscarDocInput('');
    setStatusDocInput('');
  };

  const [habilitar,setHabilitar]=useState({
    search:true,
    opcionesUnicas:true
  });

  useEffect(()=>{
    setHabilitar({
      ...habilitar,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[arrayOpciones]);

  // const updatedHabilitar = useMemo(() => ({
  //   ...habilitar,
  // }), [arrayOpciones]);

  // useEffect(() => {
  //   setHabilitar(updatedHabilitar);
  // }, [arrayOpciones]);

  return (
    <>
      {/* <BotonQuery
      matBL={matBL}
      matOC={matOC}
    /> */}
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
          Lista de todos los articulos en proceso de importacion
            {width>850?' (antiguo Status Report)':''}
          .
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          handleOpciones={handleOpciones}
          arrayOpciones={arrayOpciones}
          buscarDocInput={buscarDocInput}
          tipo={'articulo'}
        />
      </CabeceraListaAll>
      {
        arrayOpciones[0].select==true?
          <>
            <TituloEncabezadoTabla className='subTitulo'>
          Articulos ya enviados por el proveedor hacia Rep. Dominicana
              {width>1000?', (todos los items de contenedores en proceso)':''}
          .

            </TituloEncabezadoTabla>

            <CajaTabla>
              <Tabla>
                <thead>
                  <Filas className='cabeza'>
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Codigo*</CeldaHead>
                    <CeldaHead >Descripcion</CeldaHead>
                    <CeldaHead>Qty</CeldaHead>
                    <CeldaHead>Contenedor*</CeldaHead>
                    <CeldaHead>Status</CeldaHead>
                    <CeldaHead title='Fecha en que estara disponible en SAP'>En SAP</CeldaHead>
                    <CeldaHead className='proveedor'>Proveedor</CeldaHead>
                    <CeldaHead className='ordenCompra'>O/C*</CeldaHead>
                    <CeldaHead className='comentarios'>Comentarios</CeldaHead>
                    <CeldaHead className='comentarios'>Comentarios Orden</CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  {
                    matBL.map((item,index)=>{
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
                          <CeldasBody className='status' title={FuncionStatus(item.status)}>
                            {
                              FuncionStatus(item.status)
                            }
                          </CeldasBody>
                          <CeldasBody>{item.llegadaSap.slice(0,10)}</CeldasBody>
                          <CeldasBody
                            title={item.proveedor}
                            className='proveedor'>
                            {item.proveedor}
                          </CeldasBody>
                          <CeldasBody
                            className='ordenCompra'
                          >
                            <Enlaces
                              to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
                              target="_blank"
                            >
                              {item.ordenCompra}
                            </Enlaces>
                          </CeldasBody>
                          <CeldasBody
                            title={item.comentarios}
                            className='comentarios'>
                            {item.comentarios}</CeldasBody>
                          <CeldasBody
                            title={item.comentarioOrden}
                            className='comentarios'>
                            {item.comentarioOrden}</CeldasBody>
                        </Filas>
                      );
                    })
                  }
                </tbody>
              </Tabla>
            </CajaTabla>
          </>
          :
          arrayOpciones[1].select==true?
            <>
              <TituloEncabezadoTabla className='subTitulo'>
        Articulos solicitados a proveedor, pero aun sin enviar
                {width>1000?', (todos los items de ordenes de compra abiertas)':''}.

              </TituloEncabezadoTabla>
              <CajaTabla>
                <Tabla>
                  <thead>
                    <Filas className='cabeza'>
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead>Codigo*</CeldaHead>
                      <CeldaHead >Descripcion</CeldaHead>
                      <CeldaHead className='qtyPendiente'>Pend.</CeldaHead>
                      <CeldaHead className='proveedor'>Proveedor</CeldaHead>
                      <CeldaHead>O/C*</CeldaHead>
                      <CeldaHead className='comentarios'>Comentarios</CeldaHead>
                      <CeldaHead className='comentarios'>Comentarios Orden</CeldaHead>
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
                            <CeldasBody className='qtyPendiente'>{item.qtyPendiente}</CeldasBody>
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
                            <CeldasBody title={item.comentario}>{item.comentario}</CeldasBody>
                            <CeldasBody title={item.comentarioOrden}>{item.comentarioOrden}</CeldasBody>
                          </Filas>
                        );
                      })
                    }
                  </tbody>
                </Tabla>
              </CajaTabla>
            </>
            :
            ''
      }
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
    width: 100%;
`;

const CajaLoader=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CajaTabla=styled.div`
    overflow-x: scroll;
    padding: 0 10px;
    /* border: 1px solid red; */
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

`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;

  @media screen and (max-width:650px){
    margin-bottom: 200px;
    
  }
  @media screen and (max-width:380px){
    /* overflow: scroll; */
    margin-bottom: 130px;
    
  }
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
  padding: 3px ;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
  &.qty{
    width: 300px;
  }
  &.comentarios{
    max-width: 200px;

  }
  &.proveedor{
  }
  &.ordenCompra{

  }
 
  @media screen and (max-width:715px){
    font-size: 14px;
    
  }
  @media screen and (max-width:460px){
    font-weight: normal;

    
  }
  &.qtyPendiente{
    font-size: 12px;
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
      /* background-color: red; */
    }
   
    &.descripcion{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 200px;
      /* @media screen and (max-width:660px){
        max-width: 120px;
    
      }
      @media screen and (max-width:500px){
        max-width: 100px;
    
      }
      @media screen and (max-width:740px){
        max-width: 70px;
    
      } */
    }
    &.proveedor{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 150px;

    }
    &.ordenCompra{
 
    }
    &.comentarios{
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;   
      text-overflow: ellipsis;
  
    }
    &.status{
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;  
    @media screen and (max-width:650px){
      max-width: 60px;
      padding: 0;
  } 

  }
  &.qtyPendiente{
    padding: 2px;
  }
  @media screen and (max-width:715px){
    font-size: 14px;
    padding-left: 2px;
    padding-right: 2px;
    
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
  margin-top: 20px;
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;

  display: flex;
  justify-content: start;
  align-items: center;
  @media screen and (max-width:720px) {
    padding-left: 0;
  }

`;
const TituloEncabezadoTabla=styled.h2`
  color: #757575;
  font-size: 1.2rem;
  font-weight: normal;
  padding-left: 20px;
  &.subTitulo{
    font-size: 1rem;
    @media screen and (max-width:460px) {
      font-size: 13px;
      
    }
  }
  @media screen and (max-width:590px) {
    font-size: 16px;
  }
  @media screen and (max-width:400px) {
    font-size: 14px;
  }
`;