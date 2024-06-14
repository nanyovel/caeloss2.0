import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import avatarMale from './../../public/img/avatares/maleAvatar.svg';
import styled from 'styled-components';
import theme from '../../theme';
import { BtnGeneralButton } from '../components/BtnGeneralButton';
import { getAuth, sendEmailVerification, signOut } from 'firebase/auth';
import db, { autenticar } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Alerta } from '../components/Alerta';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { ModalLoading } from '../components/ModalLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock, faUserPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
// import { BotonQuery } from '../components/BotonQuery';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { AvisoCaja } from '../components/Avisos/AvisoCaja';

export const Perfil = ({dbUsuario,userMaster,setUserMaster}) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const navegacion = useNavigate();
  const storage = getStorage();

  const [isLoading,setIsLoading]=useState(false);

  const auth=getAuth();
  auth.languageCode = 'es';
  const usuario=auth.currentUser;
  if(!usuario){
    navegacion('/acceder');
  }

  // // ******************** ALIMENTAR USERMASTER ******************** //
  useEffect(()=>{
    // Si por alguna razon cuando el usuario se registro no se creo la base de datos de usuario
    if(usuario&&!dbUsuario){
      setUserMaster({
        ...userMaster,
        userName: usuario.email.split('@')[0],
        correo:usuario.email,
      });
    }
    // Esto es lo normal
    if(usuario&&dbUsuario){
      const usuarioDB=userMaster;

      const usuarioCompilado={
        ...usuarioDB,
        userName: usuario.email.split('@')[0],
        correo:usuario.email,
      };
      setUserMaster(usuarioCompilado);
    }
  },[dbUsuario,usuario]);

  // ******************** MANEHANDO LOS INPUTS ******************** //
  const handleInput=(e)=>{
    const {name,value}=e.target;
    setUserEditable((prevEstado) => ({
      ...prevEstado,
      [name]: value,
    }));
  };

  const [fotoPerfil, setFotoPerfil]=useState(null);
  const handleFile=(e)=>{
    setFotoPerfil(e.target.files[0]);

  };

  // // ******************** EDITAR ******************** //
  const [modoEditar, setModoEditar]=useState(false);
  const [userEditable, setUserEditable]=useState();
  const editar=()=>{
    setModoEditar(true);
    setUserEditable(userMaster?userMaster:{});
  };

  // // ******************** GUARDAR CAMBIOS ******************** //
  const guardarCambios=async()=>{
    // Cargar foto de perfil
    const nombreFoto='avatars/fotoPerfil'+userMaster.userName;
    const storageRefFoto = ref(storage, nombreFoto);

    // Esto es lo normal que el userMaster exista
    if(userMaster){
      console.log(userMaster);
      const usuarioActualizar = doc(db, "usuarios", userMaster.id);
      setIsLoading(true);
      console.log(userEditable);
      // return
      try {
        // Primero actualiza los valores mas importantes
        await updateDoc(usuarioActualizar, userEditable);
        // Ahora sube la foto de perfil solamente si el usuario la cargo

        if(fotoPerfil){
          await uploadBytes(storageRefFoto, fotoPerfil).then(() => {
          });
          // Ahora entregame la url de la foto de perfil y colocasela en una propiedad del objeto de este usuario en la base de datos
          getDownloadURL(ref(storage, storageRefFoto)).then(
            (url)=>
              updateDoc(usuarioActualizar, {
                urlFotoPerfil:url
              })
          );
          setIsLoading(false);
        }
        setMensajeAlerta('Usuario actualizado correctamente.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        setIsLoading(false);
      }
      catch (error) {
        console.log(error);
        console.error('Error con la base de datos');
        setIsLoading(false);
        setMensajeAlerta('Error con la base de datos.');
        setTipoAlerta('error');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }

    }
    // Esto no deberia ejecutarse pero se debe colocar, dado que al momento de registrar el usuario Caeloss realiza dos peticiones a la base de datos:
    // 1-Crear usuario an Auth
    // 2-Crear el usuario en la base de datos
    //
    // Aunque lo veo dificil es posible que se cumpla la primera y la segunda no, para esos posibles casos tenemos este else if()
    else if(!userMaster){
      setIsLoading(true);
      try{
        addDoc(collection(db,'usuarios'),userEditable);

      }
      catch(error){
        console.log(error);
        setIsLoading(false);
        setMensajeAlerta('Error con la base de datos');
        setTipoAlerta('error');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
    }

    setModoEditar(false);
  };

  // // ******************** CONFIRMAR EMAIL ******************** //
  const confirmarEmail=()=>{
    var actionCodeSettings = {url:'https://caeloss.com'};
    sendEmailVerification(usuario,actionCodeSettings)
      .then(function() {
        setMensajeAlerta('Email enviado.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      })
      .catch(function(error) {
        console.log(error);
        setMensajeAlerta('Error con la base de datos.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      });

  };
  const cerrarSesion=async()=>{
    try{
      await signOut(autenticar);
      navegacion('/');
    }
    catch(error){
      console.log(error);
      setMensajeAlerta('Error al cerrar sesion.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header titulo={'Perfil'}/>
      {/* <BotonQuery
            userEditable={userEditable}
        /> */}

      {
        usuario?.emailVerified?
          <CajaPerfil>
            <CajaUsuario>
              <CajaImg>
                <Img src={

                  userMaster?.urlFotoPerfil?
                    userMaster?.urlFotoPerfil

                    :
                    avatarMale}
                />
              </CajaImg>
              <CajaDatos>
                <div>
                  <CajitaDatos>
                    <Texto>
                            Nombre:
                    </Texto>
                    <Texto className='detalle'>
                      {
                        modoEditar?
                          <InputEditable
                            type='text'
                            value={userEditable?.nombre}
                            name='nombre'
                            autoComplete='off'
                            onChange={(e)=>{handleInput(e);}}
                            placeholder='Indica tu nombre'
                          />
                          :
                          userMaster?.nombre
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Apellido:
                    </Texto>
                    <Texto className='detalle'>
                      {
                        modoEditar?
                          <InputEditable
                            type='text'
                            value={userEditable?.apellido}
                            name='apellido'
                            autoComplete='off'
                            onChange={(e)=>{handleInput(e);}}
                            placeholder='Indica tu apellido'
                          />
                          :
                          userMaster?.apellido
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Sucursal:
                    </Texto>
                    <Texto className='detalle'>
                      {
                        modoEditar?
                          <InputEditable
                            type='text'
                            value={userEditable?.sucursal}
                            name='sucursal'
                            autoComplete='off'
                            onChange={(e)=>{handleInput(e);}}
                            placeholder='Sucursal'
                          />
                          :
                          userMaster?.sucursal
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Departamento:
                    </Texto>
                    <Texto className='detalle'>
                      {
                        modoEditar?
                          <InputEditable
                            type='text'
                            value={userEditable?.dpto}
                            name='dpto'
                            autoComplete='off'
                            onChange={(e)=>{handleInput(e);}}
                            placeholder='Departamento'
                          />
                          :
                          userMaster?.dpto
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Posición:
                    </Texto>
                    <Texto className='detalle'>
                      {
                        modoEditar?
                          <InputEditable
                            type='text'
                            value={userEditable?.posicion}
                            name='posicion'
                            autoComplete='off'
                            onChange={(e)=>{handleInput(e);}}
                            placeholder='posicion'
                          />
                          :
                          userMaster?.posicion
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos className='file'>
                    <Texto className='fotoPerfil'>
                            Cargar foto de perfil:
                    </Texto>
                    <Texto className='detalle file'>
                      {
                        modoEditar?
                          <InputEditable
                            type='file'
                            className='file'
                            onChange={(e)=>{handleFile(e);}}
                          />
                          :
                          '📷'
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Username:
                    </Texto>
                    <Texto className='detalle'>
                      {auth.currentUser?.email?auth.currentUser.email.split('@')[0]:''}
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Correo:
                    </Texto>
                    <Texto className='detalle' >
                      {auth.currentUser?.email?auth.currentUser.email:''}
                    </Texto>
                  </CajitaDatos>
                </div>
                <CajaBtn>

                  {
                    modoEditar?
                      <>
                        <BtnSimple
                          onClick={()=>guardarCambios()}
                        >
                          <Icono icon={faFloppyDisk}/>
                            Guardar
                        </BtnSimple>
                        <BtnSimple
                          className='cancelar'
                          onClick={()=>setModoEditar(false)}
                        >
                          <Icono icon={faXmark}/>
                            Cancelar
                        </BtnSimple>
                      </>
                      :
                      <>
                        <BtnSimple
                          onClick={()=>cerrarSesion()}
                        >
                          <Icono icon={faUserLock}/>
                            Cerrar sesion
                        </BtnSimple>
                        <BtnSimple
                          onClick={()=>navegacion('/recuperar')}
                        >
                            Reiniciar contraseña
                        </BtnSimple>

                        <BtnSimple
                          onClick={()=>editar()}
                        >
                          <Icono icon={faUserPen}/>
                            Editar
                        </BtnSimple>
                      </>
                  }
                </CajaBtn>
              </CajaDatos>
            </CajaUsuario>
          </CajaPerfil>
          :
          <CajaAviso>

            <AvisoCaja
              titulo={'Confirmar correo'}
              texto={`Caeloss necesita confirmar que eres el propietario del email ${usuario.email}, para ello haz click en confirmar, y Caeloss te enviará un enlace a tu email, haz click en ese enlace para concluir el proceso.`}
              textoCTA={'Confirmar'}
              funcionCTA={confirmarEmail}
              textoCTA2={'Cerrar sesion'}
              funcionCTA2={cerrarSesion}

            />
          </CajaAviso>
      }

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {
        isLoading?
          <ModalLoading completa={true}/>
          :
          ''
      }
    </>
  );
};

const CajaPerfil =styled.div`
    padding: 15px;
`;
const CajaAviso =styled.div`
    padding: 15px;
`;
const CajaUsuario=styled.div`
    border: 1px solid ${theme.warning};
    border-radius: 15px 0 15px 0;
    background-color: ${theme.azulOscuro1Sbetav};
    padding: 10px;
    display: flex;
    flex-direction: column;

    width: 70%;
    margin: auto;
    @media screen and (max-width:500px) {
        width: 100%;
        
    }
    margin-bottom: 70px;
`;
const CajaImg=styled.div`
    display: flex;
    justify-content: center;
`;
const Img=styled.img`
    width: 150px;
    height: 150px;
    object-fit: contain;
    margin-right: 25px;
    border: 2px solid ${theme.warning};
    border-radius: 50%;
`;

const CajaDatos=styled.div`
`;

const CajitaDatos=styled.div`
    display: flex;
    gap: 20px;
    justify-content: space-between;
    border-bottom: 1px solid ${theme.azul1};
    margin-bottom: 10px;
    @media screen and (max-width:330px) {
        height: 40px;
        /* font-size: 14px; */
        
    }

 
`;

const Texto=styled.h2`
    font-size: 1rem;
    height: 20px;
    color: ${theme.azul1};
    width: auto;
    &.detalle{
        text-align: end;
        font-weight: normal;
        @media screen and (max-width:360px) {
        font-size: 14px;
        
    }
    }
    &.fotoPerfil{
    }
    &.file{
        height: auto;
    }
    @media screen and (max-width:360px) {
        font-size: 14px;
        
    }
`;

const InputEditable=styled.input`
    margin: 0;
    height: 20px;
    outline: none;
    border: 1px solid ${theme.azul2};
    background-color: transparent;
    /* background-color: ${theme.azul4Osc}; */
    color: ${theme.azul2};
    font-size: 0.8rem;
    padding: 8px;
    width: 280px;
    border-left: 1px solid ${theme.azul1};
    &.file{
        /* border: 1px solid red; */
        height: auto;
    }
`;

const CajaBtn=styled.div`
    /* border: 1px solid red; */
    display: flex;
    justify-content: center;
`;
const BtnSimple=styled(BtnGeneralButton)`
    width: auto;
    padding: 5px;
    &.cancelar{
        background-color: ${theme.danger};
        &:hover{
            color: ${theme.danger};
            background-color: white;
        }
    }
`;

const Icono=styled(FontAwesomeIcon)`
    margin-right: 7px ;
`;
