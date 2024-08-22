import { styled } from "styled-components";
import { useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import theme from "../config/theme.jsx";

export const ContenedorPrincipal = ({children}) => {
  const location=useLocation();
  const {pathname}=location;

  const contenedorPrincipalRef=useRef(null);

  useEffect(() => {
    if(contenedorPrincipalRef.current){
      contenedorPrincipalRef.current.scrollTo(0,0);
    }

  }, [pathname]);

  return (
    <ContenedorPrincipalCaja ref={contenedorPrincipalRef}>

      {
        children
      }

    </ContenedorPrincipalCaja>
  );
};

const ContenedorPrincipalCaja = styled.div`
      display: block;
      position: relative;
      width: 900px;
      height: 100vh;
      margin: auto;
      border: 1px solid ${theme.azul1};
      border-radius: 10px;
      overflow-x: hidden;
      background-color: ${theme.azulOscuro1Sbetav4};
      /* background-image: linear-gradient(20deg, #525256dc 0%, #626569eb 100%); */
      background-position: top;
      background-attachment: fixed;
      background-size: cover;
      /* object-fit: contain; */
      background-repeat: no-repeat;
      align-items: center;
     

      *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        width: 4px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 

      /* background-image: 
      repeating-linear-gradient(
        -45deg,
        #04162c,
        #011b3b 350px,
        #0b1825 350px,
        #0b1825 920px
      ); */

      @media screen and (max-width: 1070px) {
        width: 80%;
      }
      @media screen and (max-width: 650px) {
        width: 80%;
        margin: 0 0 0 80px;
      }
      @media screen and (max-width: 620px) {
        width: 100%;
        margin: 0;
      }
  `;
export default ContenedorPrincipal;