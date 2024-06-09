import React, { useState } from 'react'
import styled from 'styled-components'
import theme from '../../theme'

export const Interruptor = ({
  texto, 
  handleChange,
  isFollowing, 
  tipo,
  noFurgon,
  noBL,
  valor,
  disabled
}) => {

  return (
    <CajitaSeguimiento className={`
        ${tipo=='ordenCompra'?'lineal ':''}
        ${tipo=='recepAlmacen'?'lineal ':''}
        
        `}>
      <CajaTituloSeguimiento>
        <TituloSeguimiento className={tipo}>{texto?texto:null}</TituloSeguimiento>
      </CajaTituloSeguimiento>
      <ContenidoInterruptor>
        <EtiquetaDeslizar 
          className={`slideThree  ${tipo=='recepAlmacen'?' esp':''}`}
          >
          <InputNoVisible 
             type="checkbox"
             checked={isFollowing?isFollowing:(valor?valor:false)}
             data-nofurgon={tipo=='recepAlmacen'?noFurgon:''}
             data-nobl={tipo=='recepAlmacen'?noBL:''}
             onChange={(e)=>handleChange(e)}
             disabled={disabled?disabled:false}
            />
            <LabelSencillo htmlFor="btnEconomia"></LabelSencillo>
        </EtiquetaDeslizar>
      </ContenidoInterruptor>
    </CajitaSeguimiento>
  )
}

const CajitaSeguimiento=styled.div`
  display: inline-block;
  text-align: center;
  width: auto;
  height: 60px;
  box-shadow: 0 1px 4px #00abeea6, 0 0 40px rgba(0, 0, 0, 0.1) inset;
  border-radius: 5px;
  padding: 5px;
  background:#423e3e59;
  &.lineal{
    display: flex;
    height: auto;
    padding: 2px;
    /* flex-direction: ; */
  }
`

const CajaTituloSeguimiento=styled.div`
  width: 100%;
  height: 40%;
  padding: 0px 5px;

`

const TituloSeguimiento=styled.h3`
  color: white;
  font-size: 0.9rem;
  font-weight: lighter;
  border-bottom: 1px solid white;
  &.recepAlmacen{
    border: none;
  }
`

const CajaSeguimiento=styled.div`
  /* border: 1px solid red; */
  width: 95%;
  margin: auto;
  margin-bottom: 20px;
  background-color: ${theme.azulTransparente2};
  min-height: 200px;
  border: 1px solid #000;
  border-radius: 5px;
`

const ContenidoInterruptor=styled.div`
  display: flex;
  width: 100%;
  height: 59%;
  align-items: center;
  justify-content: center;
  padding-top: 5px;
`

const EtiquetaDeslizar=styled.label`
  display: block;
  width: 80px;
  height: 26px;
  background: #333;
  cursor: pointer;

  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  position: relative;

  -webkit-box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);
  -moz-box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);
  box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);

  &:after{
    content: 'OFF';
   
  font: 12px/26px Arial, sans-serif;
  color: rgb(0, 0, 0);
  position: absolute;
  right: 10px;
  z-index: 0;
  font-weight: bold;
  text-shadow: 1px 1px 0px rgba(255,255,255,.15);
  }

  &:before{
    content: 'ON';
  font: 12px/26px Arial, sans-serif;
  color: #00acee;
  position: absolute;
  left: 10px;
  z-index: 0;
  font-weight: bold;
  }
  &.esp{
    &:after{
      content: 'NO';
    }
    &:before{
      content: 'SI';
    }
  }

`

const LabelSencillo=styled.label`
    display: block;
  width: 34px;
  height: 20px;

  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;

  -webkit-transition: all .4s ease;
  -moz-transition: all .4s ease;
  -o-transition: all .4s ease;
  -ms-transition: all .4s ease;
  transition: all .4s ease;
  cursor: pointer;
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 1;

  -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
  background: #fcfff4;

  background: -webkit-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
  background: -moz-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
  background: -o-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
  background: -ms-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
  background: linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fcfff4', endColorstr='#b3bead',GradientType=0 );
`
const InputNoVisible=styled.input`
  visibility: hidden;
  
`