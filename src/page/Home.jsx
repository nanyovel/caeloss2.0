import React, { useEffect, useState } from "react";
import theme from "../config/theme";
import styled from "styled-components";
import logoCaeloss from "./../../public/img/logoOficial2.svg";
import { NavLink } from "react-router-dom";
import logoCielos from "./../../public/img/cielos.png";
import { CardHome } from "./../components/CardHome";

import ImagenCardMateriales from "./../../public/img/cardHomeComp/build.png";
import ImagenCardFletes from "./../../public/img/cardHomeComp/truck.png";
import ImagenCardImportacion from "./../../public/img/cardHomeComp/import33.png";
import ImagenCardTransportes from "./../../public/img/cardHomeComp/transportes.png";
// import ImagenCardMantenimiento from './../../public/img/cardHomeComp/mante1.png';
import { Autenticado } from "./../context/Autenticado";
import { TutorialesParcial } from "./../components/tutoriales/TutorialesParcial";
import { Resennias } from "./../components/Resennias";
import { DocumentacionParcial } from "./documentacion/DocumentacionParcial.jsx";
import { Register } from "../auth/Register.jsx";
import { Login } from "../auth/Login.jsx";
import { AvisoTop } from "./../components/Avisos/AvisoTop.jsx";
import { sendEmailVerification } from "firebase/auth";
import { Alerta } from "../components/Alerta.jsx";
import { AvisoModal } from "../components/Avisos/AvisoModal.jsx";

export const Home = ({
  usuario,
  dbUsuario,
  setDBTutoriales,
  dbTutoriales,
  userMaster,
  dbResennias,
  auth,
}) => {
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const confirmarEmail = () => {
    var actionCodeSettings = { url: "https://caeloss.com" };
    sendEmailVerification(usuario, actionCodeSettings)
      .then(function () {
        setMensajeAlerta("Email enviado.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      })
      .catch(function (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      });
  };

  // const usuario = auth.currentUser;

  useEffect(() => {
    console.log(usuario);
  }, [usuario]);

  return (
    // // ******************** CONFIRMAR EMAIL ******************** //
    <>
      <CabezaHome>
        <CajaLogoCaeloss>
          <LogoC src={logoCaeloss} alt="" />
          <TituloMain>
            aeloss <Vol> 2.0</Vol>
          </TituloMain>
        </CajaLogoCaeloss>
        {usuario ? <LogoCielos src={logoCielos} /> : null}
      </CabezaHome>
      {usuario ? (
        usuario.emailVerified == false ? (
          <AvisoTop
            mensaje={`La cuenta del email: ${(<u>{usuario.email} </u>)} ya está creada pero ahora debes confirmar que eres el propietario, para ello haz click en el siguiente boton para enviarte un enlace a tu correo, luego haz click en ese enlace, regresa aqui y recarga esta pagina.`}
            ctaTexto={"Enviar enlace"}
            cta={() => confirmarEmail()}
          />
        ) : null
      ) : null}

      <SeccionHome>
        <div>
          <TituloModulo>Sistemas y apps:</TituloModulo>
        </div>
        <PadreTarjetas>
          <CardHome
            ImagenCard={ImagenCardMateriales}
            titulo="Materiales"
            title="Potente calculadora de materiales de construccion"
            ruta="/materiales"
            bloqueado={!usuario?.emailVerified ? true : false}
          />

          <CardHome
            ImagenCard={ImagenCardFletes}
            titulo="Fletes"
            title="Calculadora avanzada de fletes"
            ruta="/fletes"
            bloqueado={!usuario?.emailVerified ? true : false}
          />
          <CardHome
            ImagenCard={ImagenCardImportacion}
            titulo="Importaciones"
            title="Sistema moderno de gestion de importaciones"
            ruta="importaciones"
            bloqueado={!usuario?.emailVerified ? true : false}
            nuevo={false}
          />
          <CardHome
            ImagenCard={ImagenCardTransportes}
            titulo="Transportes"
            title="Sistema de gestion de transporte (Transport Management System  TMS)"
            ruta="transportes"
            // nuevo={true}
            incompleto={true}
            bloqueado={!usuario?.emailVerified ? true : false}
            tipo="transporte"
          />
          {/* <CardHome
                  ImagenCard={noCorreo}
                  titulo='N° Email'
                  title='Enumerador de correos'
                  ruta='nocorreos'
                  // nuevo={true}
                  bloqueado={!usuario?.emailVerified?true:false}
                /> */}
          {/* <CardHome
                  ImagenCard={ImagenCardMantenimiento}
                  titulo='Mantenimiento'
                  title='Sistema de gestion de mantenimiento (Maintenance Management Systems (MMS))'
                  ruta='mantenimiento'
                  // nuevo={true}
                  incompleto={true}
                  tipo={'mantenimiento'}
                  bloqueado={!usuario?.emailVerified?true:false}
                />  */}
          {/* <CardHome
            ImagenCard={ImgCocina}
            titulo="En especial"
            title="Materiales en especiales para empleados"
            ruta="enespecial"
            // nuevo={true}
            incompleto={false}
            tipo={"omar"}
            bloqueado={!usuario?.emailVerified ? true : false}
          /> */}
        </PadreTarjetas>
      </SeccionHome>
      {!usuario ? (
        <>
          <SeccionHome>
            <TituloModulo>Registrarse:</TituloModulo>
            <Register home={true} auth={auth} />
          </SeccionHome>

          <SeccionHome>
            <TituloModulo>Acceder:</TituloModulo>
            <Login home={true} auth={auth} />
          </SeccionHome>
        </>
      ) : null}

      {/* <FrasesCelebres/> */}

      {/* <VideoMostrar/> */}

      <Autenticado>
        <SeccionHome>
          <TituloModulo>
            <Enlaces to={"/tutoriales"}> Tutoriales:</Enlaces>
          </TituloModulo>
          <TutorialesParcial
            setDBTutoriales={setDBTutoriales}
            dbTutoriales={dbTutoriales}
            dbUsuario={dbUsuario}
            userMaster={userMaster}
          />
        </SeccionHome>
      </Autenticado>

      <Autenticado>
        <SeccionHome>
          <TituloModulo>Reseñas:</TituloModulo>
          <Resennias
            dbUsuario={dbUsuario}
            userMaster={userMaster}
            dbResennias={dbResennias}
            inicio={true}
          />
        </SeccionHome>
      </Autenticado>

      <Autenticado>
        <SeccionHome>
          <TituloModulo>
            <Enlaces to={"/documentacion"}> Acerca de:</Enlaces>
          </TituloModulo>
          <DocumentacionParcial />
        </SeccionHome>
      </Autenticado>

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};

const CabezaHome = styled.div`
  width: 100%;
  background-color: ${theme.azulOscuro1Sbetav};
  border-bottom: 1px solid;
  display: flex;
  height: auto;
  justify-content: space-between;
`;

const CajaLogoCaeloss = styled.div`
  display: flex;
  justify-content: end;
  align-items: end;
`;

const TituloMain = styled.h1`
  font-family: "Lato", sans-serif;
  font-size: 4rem;
  letter-spacing: -7px;
  font-family: "Lato";
  font-weight: 200;
  color: rgb(255, 255, 255);
  margin: 0;
  display: flex;
  align-items: end;
  &:hover {
    cursor: pointer;
  }

  span {
    letter-spacing: -4px;
    margin-left: 15px;
  }
  @media screen and (max-width: 750px) {
    font-size: 2rem;
    letter-spacing: -2px;
    span {
      letter-spacing: -4px;
      margin-left: 4px;
    }
  }
`;

const LogoC = styled.img`
  height: 70px;

  @media screen and (max-width: 750px) {
    font-size: 3rem;
    height: 40px;
  }
`;

const Vol = styled.span`
  margin: 0;
  @media screen and (max-width: 750px) {
    font-size: 1.8rem;
    margin-left: 5px;
  }
`;
const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LogoCielos = styled.img`
  height: 50px;
  border-radius: 5px;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  margin-right: 15px;
  margin-top: 15px;

  @media screen and (max-width: 750px) {
    height: 30px;
  }
`;

const SeccionHome = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  margin-bottom: 50px;
  margin-left: 10px;
`;

const Titulo = styled.h2`
  font-size: 2rem;
  text-decoration: underline;
  color: white;
`;
const TituloModulo = styled(Titulo)`
  margin-bottom: 15px;
  color: ${theme.azul2};
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
  }
`;

const PadreTarjetas = styled.div`
  display: flex;
  justify-content: center;
  @media screen and (max-width: 750px) {
    flex-direction: column;
  }
`;
