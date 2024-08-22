import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import theme from '../config/theme.jsx';
import styled from 'styled-components';
import ImagenComingSoon from './../../public/img/buildApp.svg';
import funcionConsumible from '../libs/consumible';

export const Mantenimiento = (

) => {

  useEffect(()=>{
    document.title = "Caeloss - Mantenimiento";
    return () => {
      document.title = "Caeloss";
    };
  },[]);
  const [porcentaje,setPorcentaje]=useState('');

  useEffect(()=>{
    let newHijo=[];
    setPorcentaje(100-funcionConsumible('transporte').valorNumber);
    for(let i=0;i<porcentaje;i++){
      newHijo.push('');

    }
  },[porcentaje]);
  return (
    <>
      <Header titulo={'Sistema de gestion de Mantenimiento'}/>
      <CajaPorcentaje>
        <CajaTitulo>

          <Titulo>Coming soon...</Titulo>
        </CajaTitulo>
        <br />
        <br />
        <BarraProgres>
          <NumberPor>
            {0+'%'}
          </NumberPor>
          <HijosBarra ></HijosBarra>
        </BarraProgres>
      </CajaPorcentaje>
      <CajaImg>
        <Img src={ImagenComingSoon}/>
      </CajaImg>
    </>
  );
};
const CajaPorcentaje=styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  flex-direction: column;
`;

const CajaTitulo=styled.div`
  width: 100%;
  display: block;
`;

const Titulo=styled.h2`
  color: ${theme.azul2};
  font-size: 2rem;
  display: block;
  text-align: center;
  &.qty{
    font-size: 3rem;
  }
`;
//
//
//

const NumberPor=styled.h2`
    color: ${theme.success};
    font-size: 2.5rem;
    position: absolute;
    right: 45%;
`;

const BarraProgres=styled.div`
  display: flex;
  background-color: ${theme.azulOscuro1Sbetav};
  border: 1px solid ${theme.azul2};
  width: 100%;
  height: 50px;
  justify-content: start;
`;
const HijosBarra=styled.div`
  background-color: ${theme.azul2};
  width: 0.5%;
`;

const CajaImg=styled.div`
  width: 90%;
  height: 500px;
  margin: auto;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
  border: 4px solid ${theme.warning};
  /* border-bottom: 5px solid ${theme.warning}; */
  border-radius: 15px 0 15px 0;
  background-color: ${theme.fondoEdTeam};
  box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  /* -webkit-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75); */
  /* -moz-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75); */
`;
const Img=styled.img`
  width: 50%;
  object-fit: contain;
  
  
`;