import { Header } from '../components/Header';
import styled from 'styled-components';
import theme from '../config/theme.jsx';
import page404 from './page404.svg/';

export const Page404 = () => {
  return (
    <>
      <Header titulo='Error 404'/>
      <Titulo>Pagina no encontrada</Titulo>
      <ContenedorImg>
        <Img src={page404}/>
      </ContenedorImg>
    </>
  );
};

const Titulo=styled.h2`
    color: ${theme.azul2};
    border-bottom: 1px solid ${theme.azul2};
    margin: 25px auto;
    width: 600px;
    text-align: center;
    font-size: 2rem;
    @media screen and (max-width:800px) {
        width: 100%;
        
    }
    
`;
const ContenedorImg=styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const Img=styled.img`
    width: 60%;
    margin: auto;
    
`;