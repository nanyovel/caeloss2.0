import styled from 'styled-components';
import theme from '../../config/theme.jsx';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

export const TablaMultiFurgon = ({
  furgonSelect,
  tablaItemRef,
  setNClases,
  setFurgonSelect,
}) => {

  const cancelar=()=>{
    setFurgonSelect('');
    setNClases([]);
  };

  return (
    <>
      <EncabezadoTabla>
        <TituloEncabezadoTabla>
          <BtnNormal
            type='button'
            className={'borrada'}
            onClick={()=>cancelar()}
          >
            <Icono icon={faXmark}/>
                Cancelar
          </BtnNormal>
          {/* Entregas del ítem {despacho[0].codigo}--{despacho[0].descripcion} */}
            Materiales del contenedor N° {furgonSelect.numeroDoc}
        </TituloEncabezadoTabla>

      </EncabezadoTabla>
      <CajaTabla>
        <Tabla ref={tablaItemRef}>
          <thead>
            <Filas className='cabeza'>
              <CeldaHead >N°</CeldaHead>
              <CeldaHead >Codigo*</CeldaHead>
              <CeldaHead >Descripcion</CeldaHead>
              <CeldaHead >Qty</CeldaHead>
              <CeldaHead >Orden Compra*</CeldaHead>
              <CeldaHead >Comentarios</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {
              furgonSelect.materiales?.map((item,index)=>{
                return(
                  <Filas key={index} className='body'>
                    <CeldasBody className='numero'>{index+1}</CeldasBody>
                    <CeldasBody
                      className='codigo clicKeable'
                      data-id={index}
                    >
                      <Enlaces
                        to={`/importaciones/maestros/articulos/${item.codigo}`}
                        target="_blank"
                      >
                        {item.codigo}

                      </Enlaces>
                    </CeldasBody>
                    <CeldasBody className='descripcion' >{item.descripcion}</CeldasBody>
                    <CeldasBody >{item.qty}</CeldasBody>
                    <CeldasBody >
                      <Enlaces
                        to={`/importaciones/maestros/ordenescompra/${item.ordenCompra}`}
                        target="_blank"
                      >
                        {item.ordenCompra}

                      </Enlaces>

                    </CeldasBody>
                    <CeldasBody >{item.comentarios}</CeldasBody>
                  </Filas>
                );
              })
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
    margin-bottom: 100px;
   
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

        /* border: 2px solid yellow; */
          /* margin-bottom: 200px; */
          /* background-color: red; */
   



`;
const Tabla = styled.table`

  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border-radius: 5px;
  width: 95%;
  margin: auto;
  margin-bottom: 100px;
  /* background-color: ${theme.azulOscuro1Sbetav3}; */
  border: 1px solid black;
  `;

const CeldaHead= styled.th`
padding: 3px 8px;
text-align: center;
font-size: 0.9rem;
border: 1px solid black;


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

  display: flex;
  justify-content: start;
  align-items: center;
  justify-content: space-between;
  /* padding: 20px; */
  padding-left: 15px;
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

const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}

`;