import React, { useEffect } from 'react'
import { styled, keyframes } from 'styled-components';
import theme from '../../theme';

export const Alerta = ({tipo, mensaje,estadoAlerta}) => {
    return (
        <>  {
                estadoAlerta &&
                    <ContenedorAlerta >
                        <Texto className={tipo}>{mensaje}</Texto>
                    </ContenedorAlerta>
            }
        </>
  )
}
const slideDown = keyframes`
    0% {
        transform: translateY(-1.25rem); /* 20px */
        opacity: 0;
    }
 
    10% {
        transform: translateY(1.25rem);
        opacity: 1;
    }
    
    90% {
        transform: translateY(1.25rem);
        opacity: 1;
    }
 
    100% {
        transform: translateY(1.25rem);
        opacity: 1;
    }
`;
 
const ContenedorAlerta = styled.div`
    z-index: 1000;
    width: 100%;
    left: 0;
    top: 1.25rem; /* 20px */
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${slideDown} 4s ease forwards;
 
 `

 const Texto=styled.p`
 /* background: ${theme.warning}; */
 color: #fff;
 padding: 1.25rem 2.5rem; /* 20px 40px */
 border-radius: 0.31rem; /* 5px */
 box-shadow: 0px 0px 15px rgba(0,0,0,.1);
 text-align: center;
background-color: #000;
 &.error{
    background: ${theme.danger};
 }
 &.warning{
    background: ${theme.warning};
    color: #000;
 }
 &.success{
    background: ${theme.success};
 }
 &.info{
    background: ${theme.info};
 }

 `