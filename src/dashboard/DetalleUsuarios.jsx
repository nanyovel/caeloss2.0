import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from '../config/theme.jsx';
import avatarMale from './../../public/img/avatares/maleAvatar.svg';
import { ControlesUsuarios } from './ControlesUsuarios';
import {doc, updateDoc,deleteDoc } from 'firebase/firestore';
import db from '../firebase/firebaseConfig';
import {useNavigate, useParams } from 'react-router-dom';
import {getAuth } from 'firebase/auth';
import { Alerta } from '../components/Alerta';
import { ModalLoading } from '../components/ModalLoading';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Advertencia } from '../components/Advertencia';

export const DetalleUsuarios = ({useDocByCondition}) => {

  // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const navegacion = useNavigate();

  // Variables varias necesarias
  const parametro= useParams();
  const docUser = parametro.id;

  const [isLoading,setIsLoading]=useState(false);

  const auth=getAuth();
  auth.languageCode = 'es';

  const [dbUsuario,setDBUsuario]=useState();
  useDocByCondition('usuarios', setDBUsuario, "userName","!=","null");

  // // ******************** ALIMENTAR USERBUSCADO ******************** //
  const [userBuscado, setUserBuscado]=useState(null);

  useEffect(()=>{
    if(dbUsuario){
      const usuarioBuscado=dbUsuario.find((user)=>{

        if(user.userName==docUser){
          return user;
        }
      });
      setUserBuscado(usuarioBuscado);

      const arrayPrivigelios=usuarioBuscado.privilegios.map((priv)=>{
        return priv;
      });

      // Saber si contiene el privilegio de Fletes
      const hasFlete=arrayPrivigelios.find(priv=>priv.code==="fullAccessFletes");

      let arrayPrivParsed=[];
      if(hasFlete){
        arrayPrivParsed=arrayPrivigelios.map((priv)=>{
          return priv;
        });
      }
      else{
        arrayPrivParsed=[
          ...arrayPrivigelios,
          {
            code:"fullAccessFletes",
            descripcion:'Acceso total a la calculadora de fletes, esto incluye poder de escritura sobre los valores de las unidades vehicular.',
            valor:false,
          }
        ];
      }

      const userParsed={
        ...usuarioBuscado,
        privilegios:arrayPrivParsed
      };
      setUserBuscado(userParsed);
    }
  },[dbUsuario,docUser]);

  // ******************** BUSCAR DOC ********************
  const [buscarDocInput,setBuscarDocInput]=useState('');
  const inputBuscarRef=useRef(null);
  const buscarDoc=(e)=>{
    let validacion={
      docExiste:false,
      hasNumero:true,
    };
    const valorMin=buscarDocInput.toLocaleLowerCase();
    if(modoEditar){
      return;
    }
    if(e){
      if(e.key!='Enter'){
        return'';
      }
    }
    dbUsuario.forEach((user)=>{
      if(user.userName==valorMin){
        validacion.docExiste=true;
        return'';
      }
    });
    // Si el input esta vacio
    if(valorMin==''){
      validacion.hasNumero=false;
      setMensajeAlerta('Por favor indique username.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si el username no existe
    if(validacion.docExiste==false){
      setMensajeAlerta('El username ingresado no existe en la base de datos.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return'';
    }
    // Si todo esta correcto
    if(
      validacion.docExiste==true&&
        validacion.hasNumero==true
    ){
      navegacion('/dashboard/usuarios/'+valorMin);
      setBuscarDocInput('');
    }};

  // ******************** MANEHANDO LOS INPUTS ******************** //
  const handleInput=(e)=>{
    const {name,value}=e.target;
    if(name=='buscarDocInput'){
      setBuscarDocInput(value);
    }
    else{
      setUserEditable((prevEstado) => ({
        ...prevEstado,
        [name]: value,
      }
      ));
    }
  };
  const [fotoPerfil, setFotoPerfil]=useState(null);
  const handleFile=(e)=>{
    setFotoPerfil(e.target.files[0]);
  };

  const handleInputTabla = (e) => {
    const index = Number(e.target.dataset.id);
    const newPrivilegios = [...userEditable.privilegios]; // Crear una copia de los privilegios

    // Invertir el valor del privilegio en la copia
    newPrivilegios[index] = {
      ...newPrivilegios[index],
      valor: !newPrivilegios[index].valor
    };

    // Actualizar el estado con la nueva lista de privilegios
    setUserEditable({
      ...userEditable,
      privilegios: newPrivilegios
    });
  };

  // ******************** EDITAR *************************
  const initialValueUserEditable={
    apellido:'romo',
    correo:'',
    dpto:'',
    fechaRegistro:'',
    id:'',
    idUsuario:'roma',
    licencia:'',
    nombre:'',
    posicion:'remo',
    privilegios:'',
    sucursal:'rimo',
    urlFotoPerfil:'',
    userName:''
  };
  const [modoEditar, setModoEditar]=useState(false);
  const [userEditable, setUserEditable]=useState(initialValueUserEditable);

  const editar=()=>{
    setModoEditar(true);
    setUserEditable({...userBuscado});
    setBuscarDocInput('');
  };

  // ******************** GUARDAR CAMBIOS *************************
  const guardarCambios=async()=>{
    setIsLoading(true);
    const storage = getStorage();
    const nombreFoto='avatars/fotoPerfil'+userEditable.userName;
    const storageRefFoto = ref(storage, nombreFoto);

    const usuarioActualizar = doc(db, "usuarios", userEditable.id);
    try{
      // Primero actualiza los valores mas importantes
      await updateDoc(usuarioActualizar, userEditable);
      //Ahora sube la foto de perfil solamente si el usuario la cargo
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
      setIsLoading(false);
      setMensajeAlerta('Usuario actualizado.');
      setTipoAlerta('success');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
    catch(error){
      console.log(error);
      setIsLoading(false);
      setMensajeAlerta('Error con la base de datos.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
    setModoEditar(false);
  };

  // *********************** CANCELAR EDICION **************************
  const cancelar=()=>{
    setUserEditable({});
    setModoEditar(false);
  };

  // // *************** FUNCION INTERMEDIARIA ADVERTENCIA ****************** //
  // Advertencias
  const [tipoAdvertencia, setTipoAdvertencia]=useState('');
  const [mensajeAdvertencia, setMensajeAdvertencia]=useState('');
  const [dispatchAdvertencia, setDispatchAdvertencia]=useState(false);
  // const [eventFunction,setEventFunction]=useState('');
  const [functAEjecutar, setFunctAEjecutar]=useState('');

  const funcionAdvert=()=>{
    setTipoAdvertencia('warning');
    setMensajeAdvertencia(`¿Seguro que desea eliminar el usuario ${userBuscado.userName}?`);
    setDispatchAdvertencia(true);
    // setEventFunction(e);
    setFunctAEjecutar('eliminarDoc');
  };

  const eliminarDoc=async()=>{
    setIsLoading(true);
    try{
      // await deleteUser(usuario)
      await deleteDoc(doc(db, "usuarios", userBuscado.id));
      setIsLoading(false);
      setMensajeAlerta('Usuario eliminado.');
      setTipoAlerta('success');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

    }
    catch(error){
      console.log(error);
      setIsLoading(false);
      setMensajeAlerta('Error con la base de datos.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

    }
  };

  return (
    <Contenedor>

      <SeccionEncabezado>
        <CajaDetalles>
          <CajaImg>
            {/* <Img src={avatarMale} /> */}
            <Img src={
              userBuscado?.urlFotoPerfil?
                userBuscado?.urlFotoPerfil
                :
                avatarMale} />

            {
              modoEditar?
                <InputEditable
                  type='file'
                  className='file'
                  onChange={(e)=>handleFile(e)}
                />
                :
                null
            }
          </CajaImg>
          <CajaNombreCompleto>
            <TituloNombre>
              {
                userBuscado?
                  userBuscado.nombre
                  :
                  '-'
              }
            </TituloNombre>
          </CajaNombreCompleto>

        </CajaDetalles>
        <CajaDetalles>
          <CajitaDetalle>
            <TituloDetalle>Username</TituloDetalle>
            <DetalleTexto>
              {userBuscado?
                userBuscado.userName
                :
                ''}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Correo</TituloDetalle>
            <DetalleTexto>
              {
                userBuscado?
                  userBuscado.correo
                  :
                  ''
              }
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Nombre</TituloDetalle>
            <DetalleTexto>
              {
                modoEditar?
                  <InputEditable
                    value={userEditable?.nombre}
                    name='nombre'
                    onChange={(e)=>handleInput(e)}
                  />
                  :
                  ( userBuscado?
                    userBuscado.nombre
                    :
                    '')
              }
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Apellido</TituloDetalle>
            <DetalleTexto>
              {
                modoEditar?
                  <InputEditable
                    value={userEditable?.apellido}
                    name='apellido'
                    onChange={(e)=>handleInput(e)}
                  />
                  :
                  ( userBuscado?
                    userBuscado.apellido
                    :
                    '')
              }
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Posicion</TituloDetalle>
            <DetalleTexto
              title={ userBuscado?.posicion}
            >
              { modoEditar?
                <InputEditable
                  value={userEditable?.posicion}
                  name='posicion'
                  onChange={(e)=>handleInput(e)}
                />
                :
                ( userBuscado?
                  userBuscado.posicion
                  :
                  '')
              }
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Departamento</TituloDetalle>
            <DetalleTexto>
              { modoEditar?
                <InputEditable
                  value={userEditable?.dpto}
                  name='dpto'
                  onChange={(e)=>handleInput(e)}
                />
                :
                ( userBuscado?
                  userBuscado.dpto
                  :
                  ''
                )
              }
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Fecha registro</TituloDetalle>
            <DetalleTexto>
              {
                userBuscado?.fechaRegistro?
                  userBuscado?.fechaRegistro.slice(0,16)+
                            userBuscado?.fechaRegistro.slice(-2)
                  :
                  null

              }
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Sucursal</TituloDetalle>
            <DetalleTexto>
              {
                modoEditar?
                  <InputEditable
                    value={userEditable?.sucursal}
                    name='sucursal'
                    onChange={(e)=>handleInput(e)}
                  />
                  :
                  ( userBuscado?
                    userBuscado.sucursal
                    :
                    ''
                  )
              }
            </DetalleTexto>
          </CajitaDetalle>
        </CajaDetalles>
      </SeccionEncabezado>
      <ControlesUsuarios
        modoEditar={modoEditar}
        userBuscado={userBuscado}
        inputBuscarRef={inputBuscarRef}
        handleInput={handleInput}
        buscarDoc={buscarDoc}
        buscarDocInput={buscarDocInput}
        editar={editar}
        cancelar={cancelar}
        guardarCambios={guardarCambios}
        funcionAdvert={funcionAdvert}
      />
      <Tabla >
        <thead>
          <Filas className='cabeza'>
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Codigo</CeldaHead>
            <CeldaHead >Valor</CeldaHead>
            <CeldaHead>Descripcion</CeldaHead>
          </Filas>
        </thead>
        <tbody>
          {
            userBuscado?.privilegios?.map((privilegio,index)=>{
              return(
                <Filas key={index}>
                  <CeldasBody>{index+1}</CeldasBody>
                  <CeldasBody>{privilegio.code}</CeldasBody>
                  <CeldasBody className='checkBox'>
                    {
                      modoEditar?
                        <InputEditable
                          className='checkBox'
                          type='checkbox'
                          checked={
                            userEditable?.privilegios[index]?.valor
                          }
                          onChange={(e)=>handleInputTabla(e)}
                          data-id={index}
                        />
                        :
                        (privilegio.valor?
                          'Aprobado ✅'
                          :
                          'Denegado ❌')
                    }</CeldasBody>
                  <CeldasBody>{privilegio.descripcion}</CeldasBody>

                </Filas>
              );
            })
          }

        </tbody>
      </Tabla>

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

      <Advertencia
        tipo={tipoAdvertencia}
        mensaje={mensajeAdvertencia}
        dispatchAdvertencia={dispatchAdvertencia}
        setDispatchAdvertencia={setDispatchAdvertencia}

        notificacionFinal={true}

        // Alertas
        setMensajeAlerta={setMensajeAlerta}
        setTipoAlerta={setTipoAlerta}
        setDispatchAlerta={setDispatchAlerta}

        // Setting Function
        functAEjecutar={functAEjecutar}
        // eventFunction={eventFunction}
        function2={eliminarDoc}
      />
    </Contenedor>
  );
};

const Contenedor=styled.div`
    /* border: 1px solid red; */
    margin-bottom: 85px;
`;
const SeccionEncabezado = styled.div`
  width: 100%;
  /* min-height:40px; */
  display: flex;
  justify-content: center;
  margin: 10px 0;
  color: ${theme.azul1};
  &.negativo{
    color: ${theme.danger};
  }
`;
const CajaDetalles = styled.div`
  min-width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  border:2px solid  #535353;
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;
  border: 1px solid ${theme.warning};
`;
const CajitaDetalle=styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.azul1};
  display: flex;
  justify-content: space-between;
  
 
`;
const TituloDetalle=styled.p`
  /* border: 1px solid red; */
  width: 30%;
  color: inherit;
  &.negativo{
    color: ${theme.danger};
  }
  &.docCerrado{
    color: inherit;
  }

`;
const DetalleTexto= styled.p`
  text-align: end;
  min-width: 49%;
  width: auto;
  white-space: nowrap;
  overflow: hidden;  
  text-overflow: ellipsis;
  /* width: 100; */
  /* border: 1px solid red; */
  color: inherit;
  height: 20px;
  &.negativo{
    color: ${theme.danger};
  }
  &.docCerrado{
    color: inherit;
  }

`;
const CajaImg=styled.div`
    display: flex;
    justify-content: center;
`;
const Img=styled.img`
    width: 150px;
    height: 150px;
    object-fit: contain;
    border: 2px solid ${theme.warning};
    border-radius: 50%;
`;

const CajaNombreCompleto =styled.div`
    
`;
const TituloNombre=styled.h2`
    text-align: center;
    color: ${theme.azul2};
`;
const InputEditable=styled.input`
    margin: 0;
    height: 20px;
    outline: none;
    border: none;
    background-color: transparent;
    color: ${theme.azul2};
    padding: 4px;
    font-size: 1rem;
    padding: 4px;
    border-radius: 0;
    font-weight: normal;
    width: 200px;
    border-left: 1px solid ${theme.azul1};
    &.file{
        /* border: 1px solid red; */
        height: auto;
    }
    &.checkBox{
        width: 30px;
        cursor: pointer;

    }
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 90%;
  margin: auto;
  margin-left: 15px;
  margin-bottom: 25px;
  `;

const Filas =styled.tr`
  &.body{
    
    font-weight: lighter;
    border-bottom: 1px solid #49444457;
    background-color: ${theme.azul5Osc};
  
  }
  &.descripcion{
    text-align: start;
  }

  &.filaSelected{
    background-color: ${theme.azulOscuro1Sbetav};
    border: 1px solid red;
  }
  &.cabeza{
    background-color: ${theme.azulOscuro1Sbetav};
  }
  color: ${theme.azul1};
`;

const CeldaHead= styled.th`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty{
    width: 300px;
  }

`;

const CeldasBody = styled.td`
    border: 1px solid black;
    font-size: 0.9rem;
    height: 25px;

    text-align: center;
    &.checkBox{
        min-width: 100px;
     
    }
`;

