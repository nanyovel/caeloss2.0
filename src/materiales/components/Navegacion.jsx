import { useState } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import {Link,} from "react-router-dom";
import menuX from './../../../public/img/xImg.png';
import menuHamburg from './../../../public/img/rayas.svg';

export const Navegacion = ({home}) => {
  const [menuOpen,setMenuOpen]=useState(false);
  const toggleMobil=()=>{
    setMenuOpen(!menuOpen);
  };
  return (

    <Container className={menuOpen||home?'abierto':''}>
      <CajaMenuHamburg >
        <Img
          className={menuOpen==false?'rayas':''}
          onClick={()=>toggleMobil()}
          src={menuOpen?menuX:menuHamburg}
        />
      </CajaMenuHamburg>
      <ListaMenu>
        <ItemsDeMenu className={home?'home':''}>
          <EnlaceMenu to="/materiales">Home</EnlaceMenu>
          <Submenu className={home?'home':''}>

          </Submenu>
        </ItemsDeMenu>
        <ItemsDeMenu className={home?'home':''}>
          <EnlaceMenu>Plafones y techos</EnlaceMenu>
          <Submenu className={`salirSubMenu ${home?'home':''}`}>
            <li><EnlaceSubmenu onClick={()=>toggleMobil()} to="/materiales/plafoncomercial">Plafon Comercial</EnlaceSubmenu></li>
            <li><EnlaceSubmenu onClick={()=>toggleMobil()} to="/materiales/plafonmachihembrado">Machihembrado</EnlaceSubmenu></li>
            <li><EnlaceSubmenu onClick={()=>toggleMobil()} to="/materiales/techolisosheetrock/">Techo liso Sheetrock</EnlaceSubmenu></li>
            <li><EnlaceSubmenu onClick={()=>toggleMobil()} to="/materiales/techolisodensglass/">Techo liso Densglass</EnlaceSubmenu></li>
            {/* <li><EnlaceSubmenu to="/materiales/macrolux/">Macrolux</EnlaceSubmenu></li> */}
            {/* <li><EnlaceSubmenu to="/materiales/poliacryl/">Poliacryl</EnlaceSubmenu></li> */}
          </Submenu >
        </ItemsDeMenu>
        <ItemsDeMenu className={home?'home':''}>
          <EnlaceMenu>Divisiones y muros</EnlaceMenu>
          <Submenu className={`salirSubMenu ${home?'home':''}`}>
            <li><EnlaceSubmenu onClick={()=>toggleMobil()} to="/materiales/divisionyeso/">Divisiones Yeso</EnlaceSubmenu></li>
            <li><EnlaceSubmenu onClick={()=>toggleMobil()} to="/materiales/divisiondensglass/">Division Fibrocemento</EnlaceSubmenu></li>
          </Submenu>
        </ItemsDeMenu>
        {/* <ItemsDeMenu className={home?'home':''}>
                  <EnlaceMenu>Pisos/Relacionados</EnlaceMenu>
                 <Submenu className={`salirSubMenu ${home?'home':''}`}>
                            <li><EnlaceSubmenu to="/materiales/pisoslaminados/">Piso Laminado</EnlaceSubmenu></li>
                            <li><EnlaceSubmenu to="/materiales/pisosvinyl/">Piso Vinyl</EnlaceSubmenu></li>
                            <li><EnlaceSubmenu to="/materiales/decking">Decking</EnlaceSubmenu></li>
                  </Submenu>
              </ItemsDeMenu>  */}
      </ListaMenu>
    </Container>

  );
};
const CajaMenuHamburg=styled.div`
  /* background-color: white; */
  display: none;
  width: 50px;
  height: 50px;
  position: fixed;
  right: 70px;
  bottom: 20px;
  justify-content: center;
  align-items: center;
  @media screen and (max-width:550px){
    display: flex;
  }
`;
const Img=styled.img`
  height:30px ;
  &.rayas{
    height: 45px;
  }
`;

const Container = styled.nav`
  width: 100%;
  margin:  1px;
  background-color: ${theme.azulTransparente2};
  border-bottom:1px solid  ${theme.azul2};
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    transition: all ease 0.2s;
    @media screen and (max-width: 550px){
      background-color: ${theme.fondoEdTeam};
      z-index: 100;
      position: fixed;
      left: -100%;
      border: none;
      &.abierto{
        left: 0;
      }
    }


`;
const ListaMenu = styled.ul`
    list-style-type: none !important;
    list-style: none !important;
    @media screen and (max-width: 400px) {
      font-size: 1.1rem;
    }
`;

const ItemsDeMenu = styled.li`
  position: relative;
	display: inline-block;
  list-style-type: none;
  &:hover .salirSubMenu{
    visibility: visible;
	  opacity: 1;
  }
  &.home{
    visibility: visible;
    opacity: 1;
  }
  @media screen and (max-width: 550px){
    visibility: visible;
    opacity: 1;
    display: flex;
    flex-direction: column;
  }

`;

const EnlaceMenu = styled(Link)`
  display: block;
	padding: 5px 20px;
	color: #ffffff;
	text-decoration: none;
  cursor: pointer;
  &:hover{
    color: ${theme.gris2};
	  transition: all .3s;
  }
  @media screen and (max-width: 550px){
    width: 100%;
    height: 35px;
    border-bottom: 1px solid black;
    border-top: 1px solid black;

    
  }
`;

const Submenu = styled.ul`
list-style: none;
border-radius: 10px;
    position: absolute;
    width: 120%;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.5s;
    z-index: 5;
    font-weight: 200;
    &.home{
      visibility: visible;
      opacity: 1;
    }
    @media screen and (max-width: 550px){
      visibility: visible;
      opacity: 1;
    position: relative;
    width: 100%;
      left: 15px;
  }
    @media screen and (max-width: 220px){
      visibility: visible;
      opacity: 1;
    position: relative;
    width: 95%;
      left: 10px;
      font-size: 0.9rem;
  }
    
`;
const EnlaceSubmenu= styled(Link)`
  display: block;
	padding: 8px;
	border-radius: 5px;
  color: #fff;
	text-decoration: none;
  background-color: ${theme.fondo};
  border: 0.5px solid ${theme.gris2};
  max-width: 95%;

    &:hover{
      background-color: ${theme.gris3};
    color: #fff;
    }
    &:active{
      background-color: ${theme.gris4};
    }
    @media screen and (max-width: 550px){
      height: 45px;
  }
  @media screen and (max-width: 220px){
    max-width: 95%;
  }
`;

