import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../config/theme.jsx';
// import { BotonQuery } from '../components/BotonQuery';
import { BtnGeneralButton } from '../components/BtnGeneralButton';

import {autenticar} from './../firebase/firebaseConfig.js';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Alerta } from '../components/Alerta.jsx';
import { ModalLoading } from '../components/ModalLoading.jsx';
import { Header } from '../components/Header.jsx';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {onAuthStateChanged} from 'firebase/auth'

export const Login = ({home,auth}) => {
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');
  const navegacion = useNavigate();

  // ******************** ENVIANDO A LA BASE DE DATOS******************** //
  const [isLoading,setIsLoading]=useState(false);

  auth.languageCode = 'es';
  //   const [usuario,setusuario]=useState(auth.currentUser);
  useEffect(()=>{
    if(auth.currentUser?.emailVerified==true){
      navegacion('/');
    }
    else if(auth.currentUser?.emailVerified==false){
      navegacion('/perfil');
    }

  },[auth.currentUser, navegacion]);

  const [datos, setDatos]=useState({
    correo:'',
    password:'',
  });

  const handleInput=(e)=>{
    const {name, value}=e.target;
    setDatos({
      ...datos,
      [name]:value
    });
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    let validacion={
      hasCamposLlenos:true,
      hasCorreoGrupo:true,
    };
    let correoParsed=datos.correo.replace(' ','');

    // Si existe algun campo vacio
    if(correoParsed==''||datos.password==''){
      setMensajeAlerta('Llena todos los campos.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.hasCamposLlenos=false;
      return;
    }

    // Si el correo no es correcto
    const expReg={
      correo:/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
      correoCielos:/^[\w-]+(?:\.[\w-]+)*@(?:cielosacusticos\.com)$/,
      correoPyL:/^[\w-]+(?:\.[\w-]+)*@(?:pyldecoraciones\.com)$/,
      correoPosto:/^[\w-]+(?:\.[\w-]+)*@(?:postodesign\.com)$/,
      correoServiCielos:/^[\w-]+(?:\.[\w-]+)*@(?:servicielos\.com)$/,
    };
    if(expReg.correo.test(correoParsed)==false){
      setMensajeAlerta('Correo incorrecto.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      validacion.hasCorreo=false;
      return;
    }else{
      // Si el correo no tiene un dominio del grupo Cielos Acusticos
      if(
        expReg.correoCielos.test(correoParsed)==false&&
                expReg.correoPyL.test(correoParsed)==false&&
                expReg.correoPosto.test(correoParsed)==false&&
                expReg.correoServiCielos.test(correoParsed)==false
      ){
        setMensajeAlerta('Dominio no autorizado.');
        setTipoAlerta('error');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        validacion.hasCorreoGrupo=false;
        return;
      }
    }

    // Si todo esta correcto
    console.log(validacion);
    if(
      validacion.hasCamposLlenos==true&&
                validacion.hasCorreoGrupo==true
    ){

      setIsLoading(true);
      try{
        await signInWithEmailAndPassword(autenticar,correoParsed,datos.password);

        navegacion('/');
        setIsLoading(false);
      }
      catch(error){
        console.log(error);
        switch (error.code) {
        case 'auth/invalid-credential':
          setMensajeAlerta('Datos incorrectos.');
          setTipoAlerta('error');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          break;
        default:
          setMensajeAlerta('Error con la base de datos');
          setTipoAlerta('error');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          break;
        }
        setIsLoading(false);
      }
    }
  };

  const [showPassword,setShowPassword]=useState(false);
  return (
    <>
      {
        !home?
          <Header titulo={'Iniciar sesión'}/>
          :
          null

      }
      <Contenedor>
        {/* <BotonQuery
            datos={datos}
        /> */}
        <CajaTitulo>
          <TituloMain>Iniciar sesión</TituloMain>
        </CajaTitulo>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <CajaInput>
            <CajaInternaInput>
              <Input
                name='correo'
                value={datos.correo}
                onChange={(e)=>handleInput(e)}
                placeholder='Correo'
                autoComplete='off'
              />
            </CajaInternaInput>
          </CajaInput>

          <CajaInput>
            <CajaInternaInput>
              <Input
                name='password'
                type={showPassword?'text':'password'}
                value={datos.password}
                onChange={(e)=>handleInput(e)}
                placeholder='Contraseña'
                autoComplete='off'
              />
              <CajaEye>
                <Icono
                  icon={showPassword?faEyeSlash:faEye}
                  onClick={()=>setShowPassword(!showPassword)}
                />
              </CajaEye>
            </CajaInternaInput>
          </CajaInput>

          <CajaTitulo className='cajaBoton'>
            <Boton
              type='subtmi'
              onClick={(e)=>handleSubmit(e)}
            >Entrar</Boton>

          </CajaTitulo>
          <CajaTitulo className='cajaEnlaces'>
            <Enlaces
              to={'/registro'}
            >Registrarse</Enlaces>
            <Enlaces
              to={'/recuperar'}
            >Olvide mi contraseña</Enlaces>

          </CajaTitulo>
        </form>
        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </Contenedor>

      {
        isLoading?
          <ModalLoading completa={true}/>
          :
          ''
      }
    </>
  );
};

const Boton=styled(BtnGeneralButton)`
    font-size: 0.9rem;
`;
const Enlaces = styled(NavLink)`
       /* border: 1px solid red; */
       margin-right: 10px;
       text-decoration: none;
       color: ${theme.fondo};
       &:visited{
        color: ${theme.fondo};
       }
       &:hover{
        text-decoration: underline;
       }
`;

const CajaTitulo=styled.div`
    display: flex;
    justify-content: center;
    border-bottom: 2px solid ${theme.azul2};
    margin-bottom: 45px;
    &.cajaBoton{
        margin-top: 60px;
        margin-bottom: 15px;
        /* border: 1px solid red; */
    }
    &.cajaEnlaces{
        margin: 0;
        /* border: 1px solid red; */
        border: none;
    }
`;

const TituloMain=styled.h2`
    color:white;
    margin: auto;
`;

const Contenedor=styled.div`
    height: 500px;
    margin: auto;
    padding: 25px;
    width: 90%;
    border-radius: 10px;
    /* margin-top: 30px; */
    background-color: ${theme.azulOscuro1Sbetav};
    padding-top: 60px;
    border: 1px solid ${theme.azul2};
    margin-bottom: 50px;

`;
const CajaInput=styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const Input=styled.input`
  height: 30px;
  outline: none;
  background-color: transparent;
  border: none;
  border-bottom:2px solid ${theme.azul2};
  color: ${theme.azul2};
  padding: 10px;
  width: 100%;
  &:focus{
    /* border: 1px solid ${theme.azul2}; */

  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }
  @media screen and (max-width:360px) {
    width: 90%;
    
  }
`;

const CajaInternaInput=styled.div`
    width: 350px;
    display: flex;
    position: relative;
    @media screen and (max-width:500px){
        width: 90%;
        
    }
`;
const CajaEye=styled.div`
    width: 10%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
`;

const Icono=styled(FontAwesomeIcon)`
    color: ${theme.azul2};
    cursor: pointer;
`;