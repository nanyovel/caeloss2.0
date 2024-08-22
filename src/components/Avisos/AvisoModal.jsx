import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import theme from '../../config/theme';

export const AvisoModal = ({
  children,
  tituloMain,
  tituloSecond,
  setHasModal,
  hasModal,
}) => {
  return (

    <ContenedorAvisoModal className={hasModal==true?'':'activo'}>
      <CajaAviso>
        <CajaEncabezado>

          <TituloAviso>{tituloMain}</TituloAviso>
          <CajaX>
            <Icono icon={faXmark} onClick={()=>setHasModal(false)}/>
          </CajaX>
        </CajaEncabezado>
        <TituloAviso className='subtitulo'>{tituloSecond}</TituloAviso>
        {children}
        {/* <CajaImg>
            <Img src={ImagenBuildWeb}/>
              </CajaImg> */}
      </CajaAviso>
    </ContenedorAvisoModal>
  );
};

const ContenedorAvisoModal=styled.div`
  background-color: #32353868;
  z-index: 100;
  position: fixed;
  top: 0;
  width: 900px;
  height: 100vh;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(1px);

  @media screen and (max-width: 1070px) {
        width: 80%;
      }
      @media screen and (max-width: 650px) {
        width: 80%;
      }
      @media screen and (max-width: 550px) {
        width: 100%;
        margin: 0;
      }
      &.activo{
        display: none;
        background-color: red;
      }
`;

const CajaAviso=styled.div`
  width: 80%;
  height: 80%;
  background-color: #000b1a;
  border: 2px solid ${theme.warning};
  border-radius: 15px 0 15px 0;
  padding: 20px;
`;

const TituloAviso=styled.h2`
  color: ${theme.azul2};
  border-bottom: 1px solid ${theme.azul2};
  
  &.subtitulo{
    font-size: 1.5rem;
    border-bottom: none;
    color: ${theme.warning};
    width: 100%;
    text-align: center;
  }
`;

const CajaEncabezado =styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;
const CajaX =styled.div`
  
`;

const Icono=styled(FontAwesomeIcon)`
  color: red;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid ${theme.azul2};
  width: 20px;
  height: 20px;
  transition: 0.2s ease ;
  &:hover{
    border: 1px solid ${theme.azul2};
    border-radius: 4px 0 4px 0;
  }
`;