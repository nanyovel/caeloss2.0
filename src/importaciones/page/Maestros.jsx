import { Header } from '../../components/Header';
import CajaNavegacion from '../components/CajaNavegacion';
import { useEffect, useState } from 'react';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import styled from 'styled-components';
import theme from '../../config/theme.jsx';
import imgFurgon from './../img/chinaEurope.png';
import imgOrdenCompra from './../img/ordenCompra2.jpg';
import imgEasyFinish from './../img/easyFinish2.png';
import docBl from './../img/docBL.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { Alerta } from '../../components/Alerta';

export const Maestros = ({dbUsuario,userMaster}) => {

  useEffect(()=>{
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  },[]);

  const [alertaFaltaFurgon, setAlertaFaltaFurgon]=useState(false);
  const [alertaFaltaArticulo, setAlertaFaltaArticulo]=useState(false);
  const [alertaFaltaOrdenCompra, setAlertaFaltaOrdenCompra]=useState(false);
  const [alertaFaltaBL, setAlertaFaltaBL]=useState(false);
  const navegacion = useNavigate();

  // const [focusOn, setFocusOn]=useState('');
  const [valueFurgon, setValueFurgon]=useState('');
  const [valueArticulo, setValueArticulo]=useState('');
  const [valueOrdenCompra, setValueOrdenCompra]=useState('');
  const [valueBillOfLading, setValueBillOfLading]=useState('');

  const handleInput=(e)=>{
    const {value, name}=e.target;
    let valorParsed=value.replace(' ','');
    if(name=='contenedor'){
      setValueFurgon((valorParsed).toUpperCase());
    }
    else if(name=='articulo'){
      setValueArticulo(valorParsed);
    }
    else if(name=='ordenCompra'){
      setValueOrdenCompra(valorParsed);
    }
    else if(name=='billOfLading'){
      setValueBillOfLading((valorParsed).toUpperCase());
    }
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(e.target.name=='formContenedor'){
      if(valueFurgon==''){
        setAlertaFaltaFurgon(true);
        setTimeout(() => {
          setAlertaFaltaFurgon(false);
        }, 3000);
      }
      else{
        let nuevoFurgon=valueFurgon.toUpperCase();
        nuevoFurgon=nuevoFurgon.replace(/ /g,'');
        nuevoFurgon=nuevoFurgon.replace(/-/g,'');
        navegacion('contenedores/'+nuevoFurgon);
      }
    }
    else if(e.target.name=='formArticulo'){
      if(valueArticulo==''){
        setAlertaFaltaArticulo(true);
        setTimeout(() => {
          setAlertaFaltaArticulo(false);
        }, 3000);
      }
      else{
        navegacion('articulos/'+valueArticulo);
      }
    }
    else if(e.target.name=='formOrdenCompra'){
      if(valueOrdenCompra==''){
        setAlertaFaltaOrdenCompra(true);
        setTimeout(() => {
          setAlertaFaltaOrdenCompra(false);
        }, 3000);
      }
      else{

        navegacion('ordenescompra/'+valueOrdenCompra);
      }}
    else if(e.target.name=='formBillOfLading'){
      if(valueBillOfLading==''){
        setAlertaFaltaBL(true);
        setTimeout(() => {
          setAlertaFaltaBL(false);
        }, 3000);
      }
      else{
        console.log(valueBillOfLading);
        navegacion('billoflading/'+valueBillOfLading);
      }}
  };

  return (
    <>
      <Header titulo='Sistema gestion de importaciones' subTitulo='Consultas'/>
      <ContainerNav>

        <CajaNavegacion
          titulo='Tipo de consulta'
          parametros={false}
          pageSelected={1}
          dbUsuario={dbUsuario}
          userMaster={userMaster}
        />
      </ContainerNav>

      <ContainerMain>
        <CajaQueryGeneral>
          <Titulo>Consultar Contenedor</Titulo>
          <CajaDetalle>
            <div>
              <form action="" onSubmit={(e)=>handleSubmit(e)} name='formContenedor'>
                <Texto>Ingrese numero de Contenedor:</Texto>
                <Input
                  type='text'
                  name='contenedor'
                  autoComplete='off'
                  //   onFocus={(e)=>handler(e)}
                  value={valueFurgon}
                  onChange={handleInput}

                />
                <BtnEjecutar type='submit'>Consultar</BtnEjecutar>
              </form>
            </div>

            <CajaImagen>
              <Enlaces
                to={`/importaciones/maestros/contenedores/`}
                target="_blank"
              >
                <ImagenMostrar src={imgFurgon} />
              </Enlaces>
            </CajaImagen>

          </CajaDetalle>
        </CajaQueryGeneral>

        <CajaQueryGeneral>
          <Titulo>Consultar Articulo</Titulo>
          <CajaDetalle>
            <div>
              <Texto>Ingrese codigo del producto:</Texto>
              <form action="" onSubmit={(e)=>handleSubmit(e)} name='formArticulo'>
                <Input
                  type='text'
                  name='articulo'
                  autoComplete='off'
                  //   onFocus={(e)=>handler(e)}
                  value={valueArticulo}
                  onChange={handleInput}
                />
                <BtnEjecutar type='submit'>Consultar</BtnEjecutar>
              </form>
            </div>
            <CajaImagen>
              <Enlaces
                to={`/importaciones/maestros/articulos/`}
                target="_blank"
              >
                <ImagenMostrar2 src={imgEasyFinish} />
              </Enlaces>
            </CajaImagen>
          </CajaDetalle>
        </CajaQueryGeneral>
        <CajaQueryGeneral>
          <Titulo>Consultar orden de compra</Titulo>
          <CajaDetalle>
            <div>
              <Texto>Ingrese numero de orden de compra:</Texto>
              <form action="" onSubmit={(e)=>handleSubmit(e)} name='formOrdenCompra'>
                <Input
                  type='text'
                  name='ordenCompra'
                  autoComplete='off'
                  //   onFocus={(e)=>handler(e)}
                  value={valueOrdenCompra}
                  onChange={handleInput}
                />
                <BtnEjecutar type='submit'>Consultar</BtnEjecutar>
              </form>
            </div>
            <CajaImagen>
              <Enlaces
                to={`/importaciones/maestros/ordenescompra/`}
                target="_blank"
              >
                <ImagenMostrar2 src={imgOrdenCompra} className='noPng' />
              </Enlaces>
            </CajaImagen>
          </CajaDetalle>
        </CajaQueryGeneral>
        <CajaQueryGeneral className='ultima'>
          <Titulo>Consultar Bill of Lading</Titulo>
          <CajaDetalle>
            <div>
              <Texto>Ingrese numero de Bill of Lading:</Texto>
              <form action="" onSubmit={(e)=>handleSubmit(e)} name='formBillOfLading'>
                <Input
                  type='text'
                  name='billOfLading'
                  autoComplete='off'
                  //   onFocus={(e)=>handler(e)}
                  value={valueBillOfLading}
                  onChange={handleInput}
                />
                <BtnEjecutar type='submit'>Consultar</BtnEjecutar>
              </form>
            </div>
            <CajaImagen>
              <Enlaces
                to={`/importaciones/maestros/billoflading/`}
                target="_blank"
              >
                <ImagenMostrar src={docBl} className='docBl' />
              </Enlaces>
            </CajaImagen>
          </CajaDetalle>
        </CajaQueryGeneral>

        <Alerta
          estadoAlerta={alertaFaltaFurgon}
          tipo={'warning'}
          mensaje={'Por favor indica un numero de contenedor.'}/>
        <Alerta
          estadoAlerta={alertaFaltaArticulo}
          tipo={'warning'}
          mensaje={'Por favor indica codigo del material que necesitas.'}/>
        <Alerta
          estadoAlerta={alertaFaltaOrdenCompra}
          tipo={'warning'}
          mensaje={'Ingresa numero de orden compra.'}/>
        <Alerta
          estadoAlerta={alertaFaltaBL}
          tipo={'warning'}
          mensaje={'Ingresa numero de Bill of Lading.'}/>

      </ContainerMain>

    </>
  );
};
const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width:1000px){
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width:410px){
    width: 99%;
  
  }
`;

const ContainerMain=styled.div`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  padding-left: 15px;
`;
const CajaQueryGeneral=styled.div`
  width: 100%;
  min-height: 100px;
  border: 1px solid black;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 5px;
  padding-left: 10px;
  background-color: ${theme.azulOscuro1Sbetav2};
  &.ultima{
    margin-bottom: 100px;
  }

`;
const Titulo=styled.h2`
  text-decoration: underline;
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: ${theme.azul2};
`;

const CajaDetalle=styled.div`
  background-color: ${theme.azulOscuro1Sbetav3};
  border: 1px solid ${theme.azul1};
  border-radius: 5px;
  padding: 10px ;
  padding-left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 500px) {
      flex-direction: column-reverse;
    
  }
`;
const Input=styled.input`
  height: 25px;
  border-radius: 5px;
  outline: none;
  border: none;
  padding: 5px;
  display: block;

  height: 35px;
  border: none;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${theme.azul1};
  background-color: ${theme.azulOscuro1Sbetav2};
  color: ${theme.azul2};
  padding: 10px;
`;

const Texto=styled.p`
  color: white;
  margin-bottom: 4px;
  color: ${theme.azul1};
`;
const BtnEjecutar=styled(BtnGeneralButton)`
  font-size: 1rem;
  display: inline-block;
  height: 30px;
  text-decoration: underline;
`;

const CajaImagen =styled.div`
  width: 40%;
  height: 140px;
  background-image: './img/rusaFurgon.jpg';
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 8px;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  @media screen and (max-width: 500px) {
    width: auto;
    height: 95%;
    justify-content: center;
    align-items: center;
      /* flex-direction: column-reverse; */
    
  }
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ImagenMostrar=styled.img`
  width: 100%;
  object-fit: contain;
  object-position: center;
  transform: translate(0,-15%);
  @media screen and (max-width: 500px) {
    transform: translate(0,0);
   
    
  }
`;

const ImagenMostrar2=styled(ImagenMostrar)`
width: 60%;
transform: translate(50%,-15%);
&.noPng{
  border-radius: 8px;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
}
@media screen and (max-width: 500px) {
    transform: translate(0,0);
   
    
  }
`;
const Enlaces=styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover{
    text-decoration: underline;
  }

  @media screen and (max-width: 500px) {
    display: flex;
    width: 100%;
    justify-content: center;
   
    
  }

`;