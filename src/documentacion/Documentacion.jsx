import { DocumentacionParcial } from './DocumentacionParcial';
import { Header } from '../components/Header';

export const Documentacion = () => {
  return (
    <>
      <Header titulo={'Sobre Caeloss'}/>
      <DocumentacionParcial completa={true}/>
    </>
  );
};
