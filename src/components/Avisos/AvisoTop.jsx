import styled from 'styled-components';
import theme from '../../config/theme';
import { getAuth } from 'firebase/auth';
import { BtnGeneralButton } from '../BtnGeneralButton';

export const AvisoTop = ({
  ctaTexto,
  cta
}) => {
  const auth=getAuth();
  const usuario=auth.currentUser;
  return (
    <Contenedor>
      <Texto>La cuenta del email:  <u>{ usuario.email} </u> ya está creada pero ahora debes confirmar que eres el propietario, para ello haz click en el siguiente boton para enviarte un enlace a tu correo, luego haz click en ese enlace, regresa aqui y recarga esta pagina.
      </Texto>
      <BtnSimple
        onClick={()=>cta()}
      >
        {ctaTexto}
      </BtnSimple>
    </Contenedor>
  );
};

const Contenedor=styled.div`
    border: 1px solid ${theme.warning};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px;
    background-color: ${theme.fondoEdTeam};
`;
const Texto=styled.h3`
    color: ${theme.warning};
    font-weight: lighter;
`;

const BtnSimple=styled(BtnGeneralButton)`
  width: auto;
`;
