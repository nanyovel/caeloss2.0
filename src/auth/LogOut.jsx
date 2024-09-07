import styled from "styled-components";
import theme from "../config/theme.jsx";
// import { BotonQuery } from '../components/BotonQuery';
import { BtnGeneralButton } from "../components/BtnGeneralButton";

import { useNavigate } from "react-router-dom";
import { autenticar } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { Alerta } from "../components/Alerta";
import { useState } from "react";

export const LogOut = () => {
  const navigate = useNavigate();
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const handleSubmit = async () => {
    try {
      await signOut(autenticar);
      navigate("/");
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  return (
    <Contenedor>
      {/* <BotonQuery
        datos={datos}
      /> */}
      <CajaTitulo>
        <TituloMain>Log Out</TituloMain>
      </CajaTitulo>

      <CajaTitulo>
        <BtnGeneralButton onClick={(e) => handleSubmit(e)}>
          Salir
        </BtnGeneralButton>
      </CajaTitulo>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Contenedor>
  );
};

const CajaTitulo = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 2px solid ${theme.azul2};
`;

const TituloMain = styled.h2`
  color: white;
  margin: auto;
`;

const Contenedor = styled.div`
  height: 500px;
  margin: auto;
  padding: 25px;
  width: 90%;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 30px;
  background-color: ${theme.azulOscuro1Sbetav};
`;
