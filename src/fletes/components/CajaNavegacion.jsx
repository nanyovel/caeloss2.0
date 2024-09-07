import { useState } from "react";
import styled from "styled-components";
// import theme from '../../../theme';
import theme from "../../config/theme";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alerta } from "../../components/Alerta";

const CajaNavegacion = ({ pageSelected = false }) => {
  let location = useLocation();
  const [nombrePage, setNombrePage] = useState("");
  const [alertaMismaPage, setAlertaMismaPage] = useState(false);
  const navigate = useNavigate();

  // ---------------

  const probarURL = (e) => {
    e.preventDefault();
    let mismaPagina = false;
    setNombrePage(e.target.name);
    switch (e.target.name) {
      case "Main":
        if (location.pathname == "/fletes") {
          // console.log('ya te encuentras en la pagina Main')
          mismaPagina = true;
        } else {
          navigate("/fletes");
        }
        break;
      case "Setup":
        if (location.pathname == "/fletes/setup") {
          mismaPagina = true;
        } else {
          navigate("/fletes/setup");
        }
        break;
      default:
        break;
    }

    if (mismaPagina) {
      setAlertaMismaPage(true);
      setTimeout(() => {
        setAlertaMismaPage(false);
      }, 3000);
    }
  };

  return (
    <>
      <ContenedorSeguirItem>
        <TituloSeguimiento>Paginas:</TituloSeguimiento>
        <CajaBotones>
          <EnlacePrincipal
            className={pageSelected == 0 ? "selected" : ""}
            name="Main"
            to={"/fletes"}
            onClick={(e) => probarURL(e)}
          >
            Main
          </EnlacePrincipal>

          <EnlacePrincipal
            to={"/fletes/setup"}
            name="Setup"
            onClick={(e) => probarURL(e)}
            className={`agregar ${pageSelected == 1 ? " selected" : ""}`}
          >
            Setup
          </EnlacePrincipal>
        </CajaBotones>
      </ContenedorSeguirItem>

      <Alerta
        estadoAlerta={alertaMismaPage}
        tipo={"warning"}
        mensaje={`Ya se encuentra en la pagina ${nombrePage}.`}
      />
    </>
  );
};

export default CajaNavegacion;

const ContenedorSeguirItem = styled.div`
  /* width: 45%; */
  background-color: ${theme.azulTransparente2};
  border-radius: 4px;
  /* margin-left: 15px; */
  padding: 10px;
  @media screen and (max-width: 410px) {
    padding: 10px 2px;
  }
`;

const TituloSeguimiento = styled.p`
  color: white;
  border-bottom: 1px solid white;
  display: inline-block;
  margin-bottom: 5px;
`;

const CajaBotones = styled.div`
  /* border: 1px solid red; */
  display: flex;
  gap: 2px;
  /* border: 1px solid red; */
  flex-wrap: wrap;
`;

const EnlacePrincipal = styled(Link)`
  /* margin: 8px; */
  /* margin-left: 15px; */
  padding: 7px;
  width: auto;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: ${theme.azul3};
  color: white;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  display: inline-block;
  /* text-decoration: none; */

  &:focus {
    background-color: ${theme.azul3};
    color: #fff;
  }

  &:hover {
    background-color: #fff;
    color: #0074d9;
  }
  &:active {
    background-color: #135c9d;
    color: #fff;
  }

  &.agregar {
    background-color: ${theme.warning};
    color: black;
  }
  &.selected {
    background-color: #fff;
    color: #0074d9;
  }
  /* border: 1px solid red; */
  @media screen and (max-width: 410px) {
    font-size: 16x;
  }
  @media screen and (max-width: 380px) {
    font-size: 14px;
  }
  @media screen and (max-width: 340px) {
    font-size: 12px;
  }
`;
