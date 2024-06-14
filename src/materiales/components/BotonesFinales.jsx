import { styled } from 'styled-components';
import { BtnGeneral } from '../../components/BtnGeneral';

export const BotonesFinales = () => {
  return (
    <SeccionBtnsFinal>
      <BtnFinal type="button" value="Limpiar" title="Tecla Delete/Suprimir"/>
      <BtnFinal type="button" value="Imprimir" title="Tecla Ctrl + P"/>
    </SeccionBtnsFinal>
  );
};

const SeccionBtnsFinal = styled.section`
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid red;
  display: flex;
  justify-content: space-evenly;
`;

const BtnFinal = styled(BtnGeneral)`
    font-size: 1rem;
    width: 20%;
    height: 35px;
`;