import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from '../../config/theme.jsx';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink, } from 'react-router-dom';
import { TablaMultiDespachos } from './TablaMultiDespachos';
import { Alerta } from '../../components/Alerta';

export const TablaMultiOC = ({
  // setOrdenSelect,
  ordenSelect,
  // hasOrden,
  setHasOrden,
  tabaOrden,

}) => {
  // const navegacion = useNavigate();

  const [despacho, setDespacho]=useState([]);
  const [hasDespachos, setHasDespachos]=useState(false);
  const [alertaItemSinEntrega,setAlertaItemSinEntrega]=useState(false);
  const tablaDespachos=useRef(null);
  const [nClases, setNClases]=useState([]);

  // Sirve para que al presionar el boton cancelar de la tabla que muestra los despachos pues que se deselecione la fila previamente selecionada
  useEffect(() => {
    if(hasDespachos==false){
      setNClases([]);
    }
  }, [hasDespachos]);

  // Cuando cambie de una orden a otra...
  useEffect(()=>{
    // que se deselecione la fila previamente selecionada
    setNClases([]);
    // se quiten los despachos, es decir los hijos, (nietos del padre))
    setHasDespachos(false);
  },[ordenSelect]);

  const mostrarDespacho=(e)=>{
    let index=Number(e.target.dataset.id);
    if(ordenSelect.materiales[index].despachos.length>0){
      setDespacho(ordenSelect.materiales[index].despachos);
      setHasDespachos(true);
      let newNClases=[];
      newNClases[index]='filaSelected';
      console.log(newNClases);
      setNClases(newNClases);
      setTimeout(() => {
        tablaDespachos.current.scrollIntoView({behavior: 'smooth'});
      }, 100);
    }else{
      setHasDespachos(false);
      setAlertaItemSinEntrega(true);
      setTimeout(() => {
        setAlertaItemSinEntrega(false);
      }, 3000);
    }

  };

  return (
    <>
      <EncabezadoTabla>
        <TituloEncabezadoTabla>
          <BtnNormal
            type='button'
            className={'borrada'}
            onClick={()=>setHasOrden(false)}
          >
            <Icono icon={faXmark}/>
            Cancelar
          </BtnNormal>
        Materiales de orden de compra Nº{ordenSelect.numeroDoc}
        </TituloEncabezadoTabla>
      </EncabezadoTabla>
      <Tabla ref={tabaOrden}>
        <thead>
          <Filas className='cabeza'>
            <CeldaHead >N°</CeldaHead>
            <CeldaHead >Codigo*</CeldaHead>
            <CeldaHead >Descripcion</CeldaHead>
            <CeldaHead >Qty</CeldaHead>
            <CeldaHead >Comentarios</CeldaHead>
            <CeldaHead >Qty Pendiente</CeldaHead>
            <CeldaHead >Qty Entregada</CeldaHead>
            <CeldaHead >Ver entregas</CeldaHead>
          </Filas>
        </thead>

        <tbody>
          {
            ordenSelect.materiales.map((item, index)=>{
              let cantidadDespachada=0;
              if(item.despachos.length>0){
                item.despachos.map((articulo)=>{
                  cantidadDespachada=cantidadDespachada+articulo.qty;
                });
              }
              return(
                <Filas key={index} className={nClases[index]}>
                  <CeldasBody>{index+1}</CeldasBody>
                  <CeldasBody
                    data-id={index}
                  >
                    <Enlaces
                      to={`/importaciones/consultas/articulos/${item.codigo}`}
                      target="_blank"
                    >
                      {item.codigo}

                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody className='descripcion'>{item.descripcion}</CeldasBody>
                  <CeldasBody>{item.qty}</CeldasBody>
                  <CeldasBody>{item.comentarios}</CeldasBody>
                  <CeldasBody>{item.qty-cantidadDespachada}</CeldasBody>
                  <CeldasBody>{cantidadDespachada}</CeldasBody>
                  <CeldasBody>
                    <IconoREDES
                      data-id={index}
                      onClick={(e)=>mostrarDespacho(e)}
                    >
                            👁️
                    </IconoREDES>
                  </CeldasBody>

                </Filas>
              );
            })
          }

        </tbody>
      </Tabla>
      {
        hasDespachos?
          <TablaMultiDespachos
            despachoSelect={despacho}
            setAlertaItemSinEntrega={setAlertaItemSinEntrega}
            tablaDespachos={tablaDespachos}
            hasDespachos={hasDespachos}
            setHasDespachos={setHasDespachos}
          />
          :
          ''

      }
      <Alerta
        estadoAlerta={alertaItemSinEntrega}
        tipo={'warning'}
        mensaje={'Este item aun no posee entregas.'}
      />
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
&.descripcion{
 text-align: start;
 padding-left: 5px;
}
&.furgon{
 text-decoration: underline;
 cursor: pointer;
}

&.clicKeable{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }

`;
const EncabezadoTabla =styled.div`
  margin-top: 20px;
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

`;
const BtnNormal=styled(BtnGeneralButton)`
&.borrada{
  background-color: red;
  color: white;
  &:hover{
    color: red;
    background-color: white;
    }
}
&.eliminadaRealizado{
  background-color: #eaa5a5;
  &:hover{
    cursor: default;
    color: white;

  }
}
  &.editaEliminada{
    background-color: #407aadb5;
    cursor: default;
    color: white;
  }
  &.buscar{
    margin: 0;
    /* height: 30px; */
  }
`;

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
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