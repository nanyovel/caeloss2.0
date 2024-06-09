import React from 'react'
import { styled } from 'styled-components'
import theme from '../theme'

export const Error404 = () => {
  return (
    <CajaMensaje>

    La pagina que buscas no existe, haz click en el boton inicio del menu para visualizar todas las apps.
    </CajaMensaje>
  )
}

const CajaMensaje=styled.div`
  /* border: 1px solid red; */
  width: 90%;
  height: 250px;
  margin: auto;
  margin-top: 100px;
  color: #000;
  text-align: center;
  /* line-height: 250px; */
  padding: 100px;
  letter-spacing: 1px;
  border-radius: 5px;
  background-color: ${theme.warning};
  font-size: 1.3rem;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.43);
`
