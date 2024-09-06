import styled from "styled-components";
import theme from "../../config/theme";
import { getAuth } from "firebase/auth";
import { BtnGeneralButton } from "../BtnGeneralButton";

export const AvisoTop = ({ ctaTexto, cta, mensaje }) => {
  const auth = getAuth();

  return (
    <Contenedor>
      <Texto>{mensaje}</Texto>
      {ctaTexto ? (
        <BtnSimple onClick={() => cta()}>{ctaTexto}</BtnSimple>
      ) : null}
    </Contenedor>
  );
};

const Contenedor = styled.div`
  border: 1px solid ${theme.warning};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: ${theme.fondoEdTeam};
`;
const Texto = styled.h3`
  color: ${theme.warning};
  font-weight: lighter;
`;

const BtnSimple = styled(BtnGeneralButton)`
  width: auto;
`;
