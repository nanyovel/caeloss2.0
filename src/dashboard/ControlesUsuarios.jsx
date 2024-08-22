import styled from 'styled-components';
import theme from '../config/theme.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BtnGeneralButton } from '../components/BtnGeneralButton';
import { faMagnifyingGlass, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-regular-svg-icons';

export const ControlesUsuarios = ({
  modoEditar,
  userMaster,
  inputBuscarRef,
  handleInput,
  buscarDoc,
  buscarDocInput,
  editar,
  cancelar,
  guardarCambios,
  funcionAdvert
}) => {
  return (
    <CajaBotones>
      {
        modoEditar==false?
          <>
            <BtnNormal
              type='button'
              className={userMaster?.eliminated==true?'editaEliminada':''}
              onClick={()=>editar()}
            >
              <Icono icon={faPencil}/>
                    Editar
            </BtnNormal>

            <BtnNormal
              type='button'
              data-nombre='eliminarDoc'
              className={'borrada'}
              onClick={(e)=>funcionAdvert(e)}
            >
              <Icono icon={faTrashCan}/>
            Eliminar
            </BtnNormal>

          </>
          :
          <>
            <BtnNormal
              type='button'
              // className={docMaster?.eliminated==true?'editaEliminada':''}
              onClick={()=>guardarCambios()}
            >
              <Icono icon={faFloppyDisk}/>
                    Guardar
            </BtnNormal>

            <BtnNormal
              type='button'
              className={userMaster?.eliminated==true?'eliminadaRealizado':'borrada'}
              onClick={()=>cancelar()}
            >
              <Icono icon={faXmark}/>
                    Cancelar
            </BtnNormal>
          </>

      }

      {/* <ContenedorBuscar className={modoEditar?'editando':''}> */}
      <ContenedorBuscar >
        <Texto>
            Buscar: {''}
        </Texto>
        <InputBuscar
          className={
            modoEditar?
              'deshabilitado'
              :
              ''
          }
          ref={inputBuscarRef}
          type='text'
          name='buscarDocInput'
          value={buscarDocInput}
          onChange={(e)=>handleInput(e)}
          onKeyUp={(e)=>buscarDoc(e)}
          disabled={
            modoEditar
          }
        />
        <BtnNormal
          type='submit'
          className={`buscar ${modoEditar?'editando':''}`}
          onClick={()=>buscarDoc()}
        >
          <Icono icon={faMagnifyingGlass}/>
            Buscar
        </BtnNormal>
      </ContenedorBuscar>
    </CajaBotones>
  );
};
const CajaBotones =styled.div`
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;
  display: flex;
  align-items: center;
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
  }
  &.editando{
    background-color: #5e5d60;
    color: black;
    cursor: default;
  }
  &.mas{
    width: 50px;
  }
`;

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
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
  &.deshabilitado{
    background-color: ${theme.fondo};
    color: black;
  }
`;

const ContenedorBuscar=styled.div`
  background-color: ${theme.azulOscuro1Sbetav3};
  height: 40px;

  display: flex;
  align-items: center;
  /* width: 400px; */
  padding: 5px;
  border-radius: 5px;
  color: ${theme.azul2};
  &.editando{
    background-color: #5e5d60;
    color: black;
  }
`;