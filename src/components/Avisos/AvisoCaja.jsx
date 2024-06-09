import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import theme from '../../../theme'
import { BtnGeneralButton } from '../BtnGeneralButton'

export const AvisoCaja = ({
  titulo,
  texto,
  textoCTA,
  funcionCTA,
  textoCTA2,
  funcionCTA2,
}) => {
  return (
    <CajaAviso>
      <TituloAviso className='subtitulo'>{titulo}</TituloAviso>
        <CajaTexto>
                <CajaTextoPunto>
                {texto}
              </CajaTextoPunto>
              {
                textoCTA&&
                <CajaCTAs>
                  <BtnCTA
                    onClick={()=>funcionCTA()}
                  >{textoCTA}</BtnCTA>
                  {
                    textoCTA2&&
                    <BtnCTA
                    onClick={()=>funcionCTA2()}
                  >{textoCTA2}</BtnCTA>}
                </CajaCTAs>

              }
            
        </CajaTexto>
        </CajaAviso>
  )
}


const ContenedorAvisoModal=styled.div`
  background-color: #32353868;
  z-index: 100;
  width: 900px;
  height: 100vh;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(1px);

  @media screen and (max-width: 1070px) {
        width: 80%;
      }
      @media screen and (max-width: 650px) {
        width: 80%;
      }
      @media screen and (max-width: 550px) {
        width: 100%;
        margin: 0;
      }
      &.activo{
        display: none;
        background-color: red;
      }
`

const CajaAviso=styled.div`
  width: 90%;
  margin: auto;
  /* height: 80%; */
  /* background-color: ${theme.azulOscuro1Sbetav}; */
  background-color: #000b1a;
  border: 1px solid ${theme.azul2};
  border-radius: 15px 0 15px 0;
  padding: 20px;
  margin-bottom: 55px;
`

const TituloAviso=styled.h2`
  color: ${theme.azul2};
  border-bottom: 1px solid ${theme.azul2};
  
  &.subtitulo{
    font-size: 1.5rem;
    border-bottom: none;
    color: ${theme.warning};
    width: 100%;
    text-align: center;
  }

`

const CajaImg=styled.div`
  width: 100%;
  /* height: 500px; */
  display: flex;
  justify-content: center;
  /* border: 1px solid red; */
`

const Img=styled.img`
  width: 300px;
  object-fit: contain;
  
  
`

const CajaTexto =styled.div`
  border: 1px solid ${theme.warning};
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  -webkit-box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  -moz-box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  
`
const CajaEncabezado =styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`
const CajaX =styled.div`
  
`

const Icono=styled(FontAwesomeIcon)`
  color: red;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid ${theme.azul2};
  width: 20px;
  height: 20px;
  transition: 0.2s ease ;
  &:hover{
    border: 1px solid ${theme.azul2};
    border-radius: 4px 0 4px 0;
  }
`
const CajaTextoPunto=styled.div`
  color: ${theme.azul1};
  /* border: 1px solid red; */
  padding-left: 20px;

`
const CajaCTAs=styled.div`
  display: flex;
  justify-content: center;
`
const BtnCTA=styled(BtnGeneralButton)`
  width: auto;
  font-size: 0.9rem;
  
`
const SemiTitulo=styled.span`
  font-weight: bold;
  text-decoration: underline;
  color: ${theme.azul1}
`


