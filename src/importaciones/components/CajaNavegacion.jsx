import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../config/theme.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alerta } from '../../components/Alerta';
import { getAuth } from 'firebase/auth';

const CajaNavegacion = ({
  pageSelected=false,
  userMaster,
}) => {

  let location = useLocation();
  const[nombrePage,setNombrePage]=useState('');
  const[alertaMismaPage,setAlertaMismaPage]=useState(false);
  const navegacion = useNavigate();

  const auth=getAuth();
  const usuario=auth.currentUser;

  const [accesoFullIMS, setAccesoFullIMS]=useState(false);
  useEffect(()=>{
    const usuarioDB=userMaster;

    if(usuarioDB){
      usuarioDB.privilegios.forEach((pri)=>{
        if (pri.code === "fullAccessIMS" && pri.valor === true) {
          setAccesoFullIMS(true);
        }
      });
    }

  },[usuario,userMaster]);

  // ---------------

  const probarURL=(e)=>{
    e.preventDefault();
    let mismaPagina=false;
    setNombrePage(e.target.name);
    switch (e.target.name) {
    case 'Main':
      if(location.pathname=='/importaciones'){
        // console.log('ya te encuentras en la pagina Main')
        mismaPagina=true;
      }
      else{
        navegacion('/importaciones');

      }
      break;
    case 'Maestros':
      if(location.pathname=='/importaciones/maestros'){
        // console.log('ya te encuentras en maestros')
        mismaPagina=true;
      }
      else{
        navegacion('/importaciones/maestros');
      }
      break;
    case 'Seguimientos':
      if(location.pathname=='/importaciones/seguimientos'){
        // console.log('ya te encuentras en seguimientos')
        mismaPagina=true;
      }
      else{
        navegacion('/importaciones/seguimientos');
      }
      break;
    case 'Ciclo':
      if(location.pathname=='/importaciones/ciclo'){
        // console.log('ya te encuentras en setup')
        mismaPagina=true;
      }
      else{
        navegacion('/importaciones/ciclo');
      }
      break;

    case 'Setup':
      if(location.pathname=='/importaciones/setup'){
        mismaPagina=true;
      }
      else{
        navegacion('/importaciones/setup');
      }
      break;
    default:
      break;
    }

    if(mismaPagina){
      setAlertaMismaPage(true);
      setTimeout(() => {
        setAlertaMismaPage(false);
      }, 3000);
    }

  };

  return (
    <>
      <ContenedorSeguirItem>
        <TituloSeguimiento>Paginas:</TituloSeguimiento>
        <CajaBotones>
          <EnlacePrincipal
            className={pageSelected==0?'selected':''}
            name='Main'
            to={'/importaciones'}
            onClick={(e)=>probarURL(e)}
          >
               Main
          </EnlacePrincipal>

          <EnlacePrincipal
            className={pageSelected==1?'selected':''}
            name='Maestros'
            to={'/importaciones/maestros'}
            onClick={(e)=>probarURL(e)}
          >
              Maestros
          </EnlacePrincipal>

          <EnlacePrincipal
            className={pageSelected==2?'selected':''}
            name='Seguimientos'
            to={'/importaciones/seguimientos'}
            onClick={(e)=>probarURL(e)}
          >
            Seguimientos
          </EnlacePrincipal>
          <EnlacePrincipal
            className={pageSelected==3?'selected':''}
            name='Ciclo'
            to={'/importaciones/ciclo'}
            onClick={(e)=>probarURL(e)}
          >
            Ciclo
          </EnlacePrincipal>

          {
            accesoFullIMS?
              <EnlacePrincipal
                to={'/importaciones/setup'}
                name='Setup'
                onClick={(e)=>probarURL(e)}
                className={`agregar ${pageSelected==4?" selected":''}`}>
              Setup
              </EnlacePrincipal>
              :
              null
          }

        </CajaBotones>
      </ContenedorSeguirItem>

      <Alerta
        estadoAlerta={alertaMismaPage}
        tipo={'warning'}
        mensaje={`Ya se encuentra en la pagina ${nombrePage}.`}
      />
    </>
  );
};

export default CajaNavegacion;

const ContenedorSeguirItem = styled.div`
  /* width: 45%; */
  background-color: ${theme.azulTransparente2};
  border-radius: 4px;
  /* margin-left: 15px; */
  padding: 10px;
  @media screen and (max-width:410px) {
    padding: 10px 2px;
  }

`;

const TituloSeguimiento = styled.p`
  color: white;
  border-bottom: 1px solid white;
  display: inline-block;
  margin-bottom: 5px;

`;

const CajaBotones =styled.div`
  /* border: 1px solid red; */
  display: flex;
  gap: 2px;
  /* border: 1px solid red; */
  flex-wrap: wrap;
`;

const EnlacePrincipal = styled(Link)`
  /* margin: 8px; */
  /* margin-left: 15px; */
  padding: 7px;
  width: auto;
  cursor: pointer; 
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: ${theme.azul3} ;
  color: white;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  display: inline-block;
  /* text-decoration: none; */
    
  
    &:focus{
      background-color: ${theme.azul3} ;
      color: #fff;
    }

    &:hover{
      background-color: #fff ;
    color: #0074d9;
    }
    &:active{
      background-color:  #135c9d;
      color: #fff;
    }

    &.agregar{
      background-color: ${theme.warning};
      color: black;
    }
    &.selected{
      background-color: #fff ;
      color: #0074d9;
    }
    /* border: 1px solid red; */
    @media screen and (max-width:410px){
      font-size: 16x;
      
    }
    @media screen and (max-width:380px){
      font-size: 14px;
      
    }
    @media screen and (max-width:340px){
      font-size: 12px;
    }
  

  
`;

