import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../config/theme.jsx';
import { NavLink, useNavigate} from 'react-router-dom';
import { Interruptor } from '../../components/Interruptor';
import './../components/interruptor.css';
import { ControlesTabla } from '../components/ControlesTabla';
// import { BotonQuery } from '../../components/BotonQuery';
import { Alerta } from '../../components/Alerta';
import { CSSLoader } from '../../components/CSSLoader';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { doc, updateDoc } from 'firebase/firestore';
import db from '../../firebase/firebaseConfig';

export const DetalleItem = ({
  todosItemsBL,
  todosItemsOC,
  dbBillOfLading,
  dbOrdenes,
  setRefresh,
  docEncontrado,
  userMaster,
}) => {

  // Alertas
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const navegacion=useNavigate();

  const [buscarDocInput,setBuscarDocInput]=useState('');
  // // ******************** CODIGO PARA EL SEARCH ******************** //

  const handleInput =(e)=>{
    const valor=e.target.value.replace(' ','');
    let mayus=((valor).toUpperCase());
    setBuscarDocInput(mayus);

  };

  const buscarDoc=(e)=>{
  // setTodosItemsBL([])
    let validacion={
      docExisteBL:false,
      docExisteOC:false,
      hasNumero:true,
    };
    if(e){
      if(e.key!='Enter'){
        return'';
      }
    }

    dbBillOfLading.forEach(bl=>{
      bl.furgones.forEach(furgon=>{
        furgon.materiales.forEach(item=>{
          if(item.codigo==buscarDocInput){
            validacion.docExisteBL=true;
          }
        });
      });
    });

    dbOrdenes.forEach(orden=>{
      orden.materiales.forEach(item=>{
        if(item.codigo==buscarDocInput){
          validacion.docExisteOC=true;
        }
      });
    });
    // Si no existen importaciones con el codigo indicado
    if(validacion.docExisteBL==false&&validacion.docExisteBL==false){
      setMensajeAlerta('No existen importaciones del codigo colocado.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // Si el input esta vacio
    if(buscarDocInput==''){
      validacion.hasNumero=false;
      setMensajeAlerta('Por favor indique codigo de producto.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }

    // Si todo esta correcto
    if(
      validacion.docExisteBL==true&&
        validacion.docExisteOC==true&&
        validacion.hasNumero==true
    ){
      navegacion('/importaciones/maestros/articulos/'+buscarDocInput);
      setBuscarDocInput('');
      setRefresh((prevRefresh) => !prevRefresh);
    }
  };

  // ********** ACTIVAR SEGUIMIENTO ************
  const [isFollowing, setIsFollowing]=useState(false);

  useEffect(()=>{
    userMaster?.seguimientos?.forEach((segui)=>{
      console.log(segui.codigoItem);
      console.log(todosItemsBL[0]?.codigo);
      if(segui.codigoItem==todosItemsBL[0]?.codigo){
        setIsFollowing(segui.activo?segui.activo:false);
      }
      if(segui.codigoItem==todosItemsOC[0]?.codigo){
        setIsFollowing(segui.activo?segui.activo:false);
      }
    });
  },[userMaster,todosItemsBL,navegacion]);

  const handleChange = async(e) => {
    const checK=e.target.checked;

    let seguiUpdate=undefined;
    // Si ese seguimiento ya existia
    const seguiExistBL=userMaster?.seguimientos?.find(segui=>
      segui.codigoItem==todosItemsBL[0]?.codigo);
    const seguiExistOC=userMaster?.seguimientos?.find(segui=>
      segui.codigoItem==todosItemsOC[0]?.codigo);

    if(seguiExistBL||seguiExistOC){
      console.log(checK);
      seguiUpdate=userMaster.seguimientos.map((segui)=>{
        if(segui.codigoItem==todosItemsBL[0]?.codigo||segui.codigoItem==todosItemsOC[0]?.codigo
        ){
          console.log(todosItemsBL[0]?.codigo);
          return{
            ...segui,
            activo:checK
          };
        }
        else{
          return segui;
        }
      });
    }
    console.log(seguiUpdate);
    // Si ese seguimiento no existia
    console.log(seguiExistBL);
    console.log(seguiExistOC);
    if(!seguiExistBL&&!seguiExistOC){
      console.log('nuevo**');
      // Si el usuario no tenia este seguimiento, ni true ni false
      seguiUpdate=userMaster.seguimientos?userMaster.seguimientos:[];
      let codigoTomar='';
      let descripcionTomar='';
      if(todosItemsBL[0]?.codigo){
        codigoTomar=todosItemsBL[0].codigo;
        descripcionTomar=todosItemsBL[0].descripcion;
      }
      if(todosItemsOC[0]?.codigo){
        codigoTomar=todosItemsOC[0].codigo;
        descripcionTomar=todosItemsOC[0].descripcion;
      }
      console.log(codigoTomar);
      console.log(descripcionTomar);
      seguiUpdate.push(
        {
          activo:checK,
          codigoItem:codigoTomar,
          descripcionItem:descripcionTomar,
          nota:'',
          fecha:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        }
      );
    }

    let usuarioUp={
      ...userMaster,
      seguimientos:seguiUpdate
    };

    const userActualizar = doc(db, "usuarios", userMaster.id);
    console.log( userMaster.id);
    console.log(userActualizar);
    console.log(usuarioUp);
    try{
      await updateDoc(userActualizar, usuarioUp);
      console.log('ac');
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
    userMaster={userMaster}
    /> */}
      <Container>
        <CajaEncabezado>
          <CajaDetalles>
            <CajitaDetalle>
              <TituloDetalle>Codigo:</TituloDetalle>
              <DetalleTexto>{todosItemsBL[0]?.codigo}</DetalleTexto>
            </CajitaDetalle>
            <CajitaDetalle>
              <TituloDetalle >Descripcion:</TituloDetalle>
              <DetalleTexto title={todosItemsBL[0]?.descripcion}>{todosItemsBL[0]?.descripcion}</DetalleTexto>
            </CajitaDetalle>

          </CajaDetalles>
          <CajaDetalles className='seguimiento'>
            <CajasInternas>

              <TituloFollowing>Seguimiento:</TituloFollowing>
              <Interruptor
                texto={'Seguimiento'}
                handleChange={handleChange}
                isFollowing={isFollowing}
                setIsFollowing={setIsFollowing}
              />
            </CajasInternas>
            <CajasInternas>
              {/* <MensajeSeguimiento>
          El seguimiento hacia artículos se debe desactivar de manera manual, a diferencia de seguimiento a un contenedor que se desactiva de manera automática cuando este cierra su ciclo.
          </MensajeSeguimiento> */}
            </CajasInternas>

          </CajaDetalles>

        </CajaEncabezado>
        {/* <BotonQuery
  docEncontrado={docEncontrado}
/> */}

        <ControlesTabla
          tipo={'detalleItem'}
          handleInput={handleInput}
          buscarDoc={buscarDoc}
          buscarDocInput={buscarDocInput}
        />

        {
          docEncontrado==0&&
        location.pathname!='/importaciones/maestros/billoflading/'&&
        location.pathname!='/importaciones/maestros/billoflading'?
            <CajaLoader>
              <CSSLoader/>
            </CajaLoader>
            :
            <>

              <TituloBloque>Contenedores:</TituloBloque>
              <TextoDescriptivo>
    La siguiente es una lista de este ítem de todas las cantidades ya enviadas por el proveedor hacia nuestros almacenes, en proceso de importación.
              </TextoDescriptivo>

              <CajaTabla>
                <Tabla >
                  <thead>
                    <Filas className='cabeza'>
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead>Codigo</CeldaHead>
                      <CeldaHead >Descripcion</CeldaHead>
                      <CeldaHead>Qty</CeldaHead>
                      <CeldaHead>Comentarios</CeldaHead>
                      <CeldaHead>Comentario Orden</CeldaHead>
                      <CeldaHead>Status</CeldaHead>
                      <CeldaHead>Listo SAP✅</CeldaHead>
                      <CeldaHead >Furgon*</CeldaHead>
                      <CeldaHead>Orden Compra*</CeldaHead>
                    </Filas>
                  </thead>
                  <tbody>
                    {
                      todosItemsBL.map((item,index)=>{
                        return(
                          <Filas key={index} className='body'>
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody>

                              {item.codigo}
                            </CeldasBody>
                            <CeldasBody className='descripcion'>{item.descripcion}</CeldasBody>
                            <CeldasBody>{item.qty}</CeldasBody>
                            <CeldasBody>{item.comentarios}</CeldasBody>
                            <CeldasBody>{item.comentarioOrden?item.comentarioOrden:''}</CeldasBody>
                            <CeldasBody className='status' >{
                              item.status==1?
                                'Transito Maritimo'
                                :
                                item.status==2?
                                  'En puerto'
                                  :
                                  item.status==3?
                                    'En almacen'
                                    :
                                    item.status==4?
                                      'Dpto de Import.'
                                      :
                                      item.status==5?
                                        'Mercancia en SAP'
                                        :
                                        ''
                            }</CeldasBody>
                            <CeldasBody>{

                              item.llegadaSap?
                                item.llegadaSap.slice(0,10)
                                :
                                ''
                            }</CeldasBody>
                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/contenedores/${item.furgon}`}
                                target="_blank"
                              >
                                {item.furgon}
                              </Enlaces>

                            </CeldasBody>
                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
                                target="_blank"
                              >
                                {item.ordenCompra}
                              </Enlaces>

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
          docEncontrado==false&&
         location.pathname!='/importaciones/maestros/billoflading/'&&
         location.pathname!='/importaciones/maestros/billoflading'?
            <CajaLoader>
              <CSSLoader/>
            </CajaLoader>
            :
            <>

              <TituloBloque>Ordenes de compra: </TituloBloque>
              <TextoDescriptivo>
    La siguiente es una lista de todas las cantidades de este ítem que ya le solicitamos al proveedor, pero este aun no carga el contenedor para enviar hacia Rep. Dominicana.
              </TextoDescriptivo>
              <CajaTabla className='ultima'>
                <Tabla>
                  <thead>
                    <Filas className='cabeza'>
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead>Codigo</CeldaHead>
                      <CeldaHead>Descripcion</CeldaHead>
                      <CeldaHead>Qty total</CeldaHead>
                      <CeldaHead>Qty Pendiente</CeldaHead>
                      {/* <CeldaHead>Qty Enviada</CeldaHead> */}
                      <CeldaHead>Comentarios</CeldaHead>
                      <CeldaHead>Comentario Orden</CeldaHead>
                      <CeldaHead>Orden Compra*</CeldaHead>
                    </Filas>
                  </thead>
                  <tbody>
                    {
                      todosItemsOC.map((item,index)=>{
                        return(
                          <Filas key={index} className='body'>
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody>{item.codigo}</CeldasBody>
                            <CeldasBody>{item.descripcion}</CeldasBody>
                            <CeldasBody>{item.qty}</CeldasBody>
                            <CeldasBody>{item.qtyPendiente}</CeldasBody>
                            {/* <CeldasBody>{item.qtyDespachada}</CeldasBody> */}
                            <CeldasBody>{item.comentarios}</CeldasBody>
                            <CeldasBody>{item.comentarioOrden?item.comentarioOrden:''}</CeldasBody>
                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
                                target="_blank"
                              >
                                {item.ordenCompra}
                              </Enlaces>
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
      </Container>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};

const Container=styled.div`
  position: relative;
  /* border: 1px solid red; */
  height: 100%;
`;

const CajaEncabezado = styled.div`
  /* border: 1px solid red; */
  width: 100%;
  min-height:40px;
  display: flex;
  justify-content: center;
  margin: 10px 0;
  @media screen and (max-width:830px) {
    flex-direction:column ;
    align-items: center;
  }
  /* padding-left: 10px; */
`;

const CajaDetalles = styled.div`
  width: 45%;
  /* border: 1px solid blue; */
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  border:2px solid  #535353;
  border-radius: 5px;
  margin-left: 12px;
  padding: 5px;

  &.seguimiento{
    width: 50%;
    display: flex;
    gap: 15px;
    @media screen and (max-width:830px) {
      width: 90%;
    }
    @media screen and (max-width:450px) {
      flex-direction: column;
      
    }
  }
  @media screen and (max-width:830px) {
    width: 90%;
    margin-bottom: 15px;
  }
`;
const CajitaDetalle=styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.azul1};
  display: flex;
  justify-content: space-around;
`;
const TituloDetalle=styled.p`
  width: 49%;
  color: ${theme.azul1};

`;
const DetalleTexto= styled.p`
  text-align: end;
  width: 49%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${theme.azul1};
  &.descripcion{
    width: auto;
  }

`;
const TituloBloque=styled.h2`
  text-decoration: underline;
  color: #fff;
  font-size: 1%.7;
  margin-left: 10px;
  margin-bottom: 5px;
  color: ${theme.azul2};
`;

const TextoDescriptivo=styled.p`
  color: ${theme.gris2};
  padding-left: 25px;
  padding-left: 35px;
  color: ${theme.azul1};
  background-color: ${theme.azulOscuro1Sbetav};
  padding: 0 15px;

`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 30px;
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
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty{
    width: 300px;
  }

`;
const CeldasBody = styled.td`
    font-size: 0.9rem;
    height: 25px;
    border: 1px solid black;
    padding-left: 5px;
    padding-right: 5px;
    &.numeroBL{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
   
    text-align: center;
    
    &.descripcion{
      /* border: 1px solid red; */
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 200px;
    }
    &.status{
      /* border: 1px solid red; */
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 200px;
    }
    &.romo{
      cursor: pointer;
      
      &:hover{

    }
  }

`;

const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}
`;

const TituloFollowing=styled.h2`
  font-size: 1.2rem;
  color: ${theme.azulClaro1Svetav};
  color: ${theme.azul2};
  margin-bottom: 5px;
`;
const CajasInternas=styled.div`
  
`;

const CajaLoader=styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
        height: 6px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 

        &.ultima{

          margin-bottom: 80px;
        }


`;