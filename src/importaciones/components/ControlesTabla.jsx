import styled from 'styled-components';
import theme from '../../../theme';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faBroom, faMagnifyingGlass, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';

export const ControlesTabla = ({
  isEditando,
  crearFurgon,
  docMaster,
  inputBuscarRef,
  tipo,
  handleInput,
  buscarDoc,
  buscarDocInput,
  editar,
  cancelar,
  guardarCambios,
  funcionAdvert,
  limpiarTabla,
  userMaster
}) => {

  return (
    <CajaBotones>
      {
        tipo!=='detalleFurgon'&&tipo!=='detalleItem'&&userMaster?.privilegios[0]?.valor==true?
          <>
            {
              isEditando==false?
                <>
                  <BtnNormal
                    type='button'
                    className={docMaster?.eliminated==true?'editaEliminada':''}
                    onClick={()=>editar()}
                  >
                    <Icono icon={faPencil}/>
            Editar
                  </BtnNormal>
                  <BtnNormal
                    type='button'
                    data-nombre='eliminarDoc'
                    className={docMaster?.eliminated==true?'eliminadaRealizado':'borrada'}
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
                    className={docMaster?.eliminated==true?'editaEliminada':''}
                    onClick={()=>guardarCambios()}
                  >
                    <Icono icon={faFloppyDisk}/>
            Guardar
                  </BtnNormal>

                  <BtnNormal
                    type='button'
                    className={docMaster?.eliminated==true?'eliminadaRealizado':'borrada'}
                    onClick={()=>cancelar()}
                  >
                    <Icono icon={faXmark}/>
            Cancelar
                  </BtnNormal>
                </>
            }

          </>
          :
          ''
      }

      <ContenedorBuscar className={isEditando?'editando':''}>
        <Texto>
            Buscar: {''}
        </Texto>
        <InputBuscar
          className={
            isEditando?
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
        />
        <BtnNormal
          type='submit'
          className={`buscar ${isEditando?'editando':''}`}
          onClick={()=>buscarDoc()}
        >
          <Icono icon={faMagnifyingGlass}/>
            Buscar
        </BtnNormal>
      </ContenedorBuscar>
      {
        isEditando&&tipo=='detalleBL'?
          <>
            <BtnNormal
              name='adicionar'
              onClick={(e)=>crearFurgon(e)}
              className='mas'
            >
                  +
            </BtnNormal>
          </>
          :
          isEditando&&tipo=='ordenCompra'?
            <>
              <BtnNormal
                name='limpiarTabla'
                onClick={(e)=>limpiarTabla(e)}
                className='limpiarTabla'
              >
                <Icono icon={faBroom}/>
                  Limpiar
              </BtnNormal>
            </>
            :
            ''
      }
    </CajaBotones>
  );
};

const CajaBotones =styled.div`
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;
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
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  color: ${theme.azul2};
  &.editando{
    background-color: #5e5d60;
    color: black;
  }
`;
// 206