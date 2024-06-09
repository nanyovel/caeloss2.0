import React from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import { Link } from 'react-router-dom'
import logoCielos from './../../public/img/cielos.png'
import logoCaeloss from './../../public/img/logoOficial2.png'

export const Header = (props) => {
  return (
    <Cabecera>
      <ContenedorOne>
          <CajaLogoC to='/'>
            <LogoC src={logoCaeloss} alt="Logo Caeloss" />
          </CajaLogoC>
        <TituloMain>
          <CajaTexto>
            <Titulo>

            {props.titulo}
            </Titulo>
          </CajaTexto>
        </TituloMain>
        <SubTitulo>
          {props.subTitulo}
        </SubTitulo>
      </ContenedorOne>
      <CajaCielos>
       
          <LogoCielos src={logoCielos} />
      </CajaCielos>
  </Cabecera>
  )
}


const Cabecera=styled.div`
    width: 100%;
    /* align-items: center; */
    background-color: ${theme.azulOscuro1Sbetav};
    border-bottom:1px solid  ${theme.azul2};
    display: flex;    
    height: 70px;
    justify-content: space-between;
    @media screen and (max-width:290px) {
      flex-direction: column;
      
    }
  `
  
const ContenedorOne=styled.div`
  display: flex;
  gap: 15px;
  padding-left: 10px;

`

const TituloMain = styled.div`
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;


`
const SubTitulo=styled.h2`
  font-size: 1rem;
  height: 100%;
  display: flex;
  align-items: end;
  color: ${theme.fondo};
  @media screen and (max-width: 350px) {
      font-size: 0.7rem;
    }
`

const CajaLogoC = styled(Link)`
  /* border: 1px solid red; */
  display: flex;
  /* align-items: center;
  align-items: center;
  text-align: center;
  justify-content: center; */
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.43);
  border-radius: 10px 0 10px 0;
  /* margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px; */
  background-color: ${theme.azul4Osc};
  @media screen and (max-width: 600px) {
      /* height: 60%; */
      align-items: end;
    }
  

`
const LogoC = styled.img`
  height: 55px;
  margin: 4px;
  /* border: 1px solid red; */
  &:hover{
  cursor: pointer;
  }
  @media screen and (max-width: 880px) {
      height: 85%;
    }
  /* @media screen and (max-width: 700px) {
      height: 30px;
    } */
    @media screen and (max-width: 580px) {
      height: 60%;
    }
    @media screen and (max-width: 290px) {
      height: 40px;
    }
`

const CajaTexto = styled.div`
  display: flex;
  justify-content: end;
  align-items: end;
  padding: 0;
  height: 100%;
`
const Titulo=styled.h2`
  font-size: 2rem;
  color: white;
  @media screen and (max-width: 880px) {
      font-size: 1.8rem;
    }
  @media screen and (max-width: 720px){
    font-size: 1.1rem;
  }
  @media screen and (max-width: 350px) {
      font-size: 0.9rem;
    }


  
`
const CajaCielos=styled.div`
  display: flex;
  align-items: end;
   @media screen and (max-width: 400px) {
      font-size: 1.1rem;
    }
    @media screen and (max-width:290px) {
      flex-direction: column;
      width: 20px;
      
    }
`
const LogoCielos = styled.img`
    height: 55px;
    @media screen and (max-width: 880px) {
      height: 30px;
    }
`
