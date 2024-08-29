import React from "react";
import { Header } from "../components/Header";
import styled, { keyframes } from "styled-components";
import Img1 from "./img/1.png";
import Img2 from "./img/2.png";
import Img3 from "./img/3.png";
import Img4 from "./img/4.png";
import Img5 from "./img/5.png";
import Img6 from "./img/6.png";
import Img7 from "./img/7.png";
import Img8 from "./img/8.png";
import Img9 from "./img/9.png";
import Img10 from "./img/10.png";
import Img11 from "./img/11.png";
import Img12 from "./img/12.png";
import Img13 from "./img/13.png";
import Img14 from "./img/14.png";
import Img15 from "./img/15.png";
import Img16 from "./img/16.png";
import Img17 from "./img/17.png";
import Img18 from "./img/18.png";
import Img19 from "./img/19.png";
import Img20 from "./img/20.png";
import Img21 from "./img/21.png";
import Img22 from "./img/22.png";
import Img23 from "./img/23.png";
import Img24 from "./img/24.png";
import Img25 from "./img/25.png";
import Img26 from "./img/26.png";
import Img27 from "./img/27.png";
import Img28 from "./img/28.png";
import Img29 from "./img/29.png";
import Img30 from "./img/30.png";
import Img31 from "./img/31.png";

import theme from "../config/theme";

export const Omar = () => {
  const imageArray = [
    Img1,
    Img2,
    Img3,
    Img4,
    Img5,
    Img6,
    Img7,
    Img8,
    Img9,
    Img10,
    Img11,
    Img12,
    Img22,
    Img13,
    Img23,
    Img14,
    Img24,
    Img15,
    Img25,
    Img16,
    Img26,
    Img17,
    Img27,
    Img18,
    Img28,
    Img19,
    Img29,
    Img20,
    Img30,
    Img21,
    Img31,
  ];
  return (
    <>
      <Header titulo={"Materiales Omar"} />
      <CajaCarrucel>
        <Carrucel className="segundo">
          {imageArray.map((image, index) => (
            <Imagen key={index} src={image} alt={`img-${index}`} />
          ))}
        </Carrucel>
        <Carrucel>
          {imageArray
            .concat(imageArray)
            .concat(imageArray)
            .concat(imageArray)
            .concat(imageArray)
            .map((image, index) => (
              <Imagen key={index} src={image} alt={`img-${index}`} />
            ))}
        </Carrucel>
      </CajaCarrucel>
      <TextoH2>Especial para empleados</TextoH2>
    </>
  );
};

const rotate = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }




/*     
  0% {
    transform:translate(0%);
  }
  50% {
    transform:translate(-100%);
  }
  100% {
    transform:translate(0%);
  } */
`;

const CajaCarrucel = styled.div`
  /* width: 100%; */
  /* height: 70px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column; */

  width: 100%;
  height: 100px; /* Ajusta la altura según necesites */
  overflow: hidden;
  position: relative;
`;

const Carrucel = styled.div`
  display: flex;
  width: max-content;
  animation: ${rotate} infinite linear 130s; /* Ajusta la duración */
  z-index: 10;
  background-color: ${theme.azulOscuro1Sbetav4};
  &.segundo {
    /* background-color: red; */
    position: absolute;
    top: 0;
    animation: none;
    /* display: none; */
    z-index: 0;
  }
`;
const Imagen = styled.img`
  width: auto; /* Ajusta el tamaño según necesites */
  height: 70px;
  margin: 0 15px;
`;

const TextoH2 = styled.h2`
  text-align: center;
  text-decoration: underline;
  color: white;
`;
