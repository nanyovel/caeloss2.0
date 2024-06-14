import { useEffect } from 'react';
import { Header } from '../components/Header';
import { Navegacion } from './components/Navegacion';

export const Materiales = () => {
  useEffect(()=>{
    document.title = "Caeloss - Materiales";
    return () => {
      document.title = "Caeloss";
    };
  },[]);

  return (
    <>
      <Header titulo='Calculadora de materiales' subTitulo='Main'/>
      <Navegacion home={true} />
    </>
  );
};
