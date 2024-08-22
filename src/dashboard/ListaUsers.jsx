import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import avatarMale from './../../public/img/avatares/maleAvatar.svg';
import styled from 'styled-components';
import theme from '../config/theme.jsx';
// import { BtnGeneralButton } from '../components/BtnGeneralButton';
import { getAuth, } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';

export const ListaUsers = ({dbUsuario,}) => {

  const navegacion = useNavigate();

  const auth=getAuth();
  auth.languageCode = 'es';
  const usuario=auth.currentUser;
  if(!usuario){
    navegacion('/acceder');
  }

  const parametro= useParams();
  let docUser = parametro.id;

  const [userSelect, setUserSelect]=useState(null);
  const [numUser,setNumUser]=useState('');
  useEffect(()=>{
    // Función de comparación para ordenar por fecha de registro
    function compararFechas(a, b) {
      return a.fechaRegistro - b.fechaRegistro;
    }
    let userSelectAux={};
    if(dbUsuario){
      if(dbUsuario.length>0){
        userSelectAux=(dbUsuario.find(user=>user.userName==docUser));
        setUserSelect(userSelectAux);
      }

      const dbUserES6=dbUsuario.map((user)=>{
        const annio=user.fechaRegistro.slice(6,10);
        const mes=user.fechaRegistro.slice(3,5);
        const dia=user.fechaRegistro.slice(0,2);
        let hora=user.fechaRegistro.slice(11,13);
        let minutos=user.fechaRegistro.slice(14,16);
        let segundos=user.fechaRegistro.slice(17,19);
        const tipo=user.fechaRegistro.slice(24,27);

        if(hora!=12){
          if(tipo=='PM'){
            hora=Number(hora)+12;
          }
        }
        if(hora==12){
          if(tipo=='AM'){
            hora=0;
          }
        }

        const fechaES6= new Date(annio,mes-1,dia,hora,minutos,segundos);

        return{
          ...user,
          fechaRegistro:fechaES6
        };
      });

      // Ordenar el array de usuarios por fecha de registro

      const usuariosOrdenados=(dbUserES6.sort(compararFechas));

      usuariosOrdenados.forEach((user,index)=>{
        if(userSelectAux){
          if(user.userName==userSelectAux.userName){
            setNumUser(index+1);
          }
        }

      });

    }
  },[dbUsuario, docUser]);

  return (
    <>
      <Header titulo={'Perfiles'}/>
      {/* <BotonQuery
            userEditable={userEditable}
        /> */}
      {

        userSelect&&
        <>

          <CajaNumUser>
            <TextoNumUser>
                Usuario N°

              {' '+numUser}

            </TextoNumUser>
            <FechaRegistro>
                Registrado el
              {
                userSelect?.fechaRegistro&&
                    <>
                      {
                        ' '+
                    userSelect?.fechaRegistro?.slice(0,10)
                    +' a las '
                    +
                    userSelect?.fechaRegistro?.slice(11,16)
                    +
                    ' '
                    +
                    userSelect?.fechaRegistro?.slice(-2)
                      }
                    </>

              }
            </FechaRegistro>
          </CajaNumUser>

          <CajaPerfil>
            <CajaUsuario>
              <CajaImg>
                <Img src={

                  userSelect?.urlFotoPerfil?
                    userSelect?.urlFotoPerfil

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

                        userSelect?.nombre
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Apellido:
                    </Texto>
                    <Texto className='detalle'>
                      {
                        userSelect?.apellido
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Sucursal:
                    </Texto>
                    <Texto className='detalle'>
                      {

                        userSelect?.sucursal
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Departamento:
                    </Texto>
                    <Texto className='detalle'>
                      {

                        userSelect?.dpto
                      }
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Posición:
                    </Texto>
                    <Texto className='detalle'>
                      {

                        userSelect?.posicion
                      }
                    </Texto>
                  </CajitaDatos>

                  <CajitaDatos>
                    <Texto>
                            Username:
                    </Texto>
                    <Texto className='detalle'>
                      {userSelect?.userName?userSelect.userName:''}
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>
                            Correo:
                    </Texto>
                    <Texto className='detalle' >
                      {userSelect?.correo?userSelect?.correo:''}
                    </Texto>
                  </CajitaDatos>
                </div>

              </CajaDatos>
            </CajaUsuario>
          </CajaPerfil>

        </>
      }
    </>
  );
};

const CajaPerfil =styled.div`
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
    /* border: 1px solid red; */
    justify-content: space-between;
    gap: 20px;
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
        min-width: 20%;
    &.detalle{
        /* border: 1px solid red; */
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

const CajaNumUser=styled.div`
    /* border: 1px solid red; */
    width: 100%;
    height: 60px;
    padding: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;
const TextoNumUser=styled.h2`
    color: ${theme.azul2};
    text-align: bottom;
    padding: 0.1px;
    /* font-size: 2rem; */
    height: 30px;
    display:block;
    /* border: 1px solid black; */
    border-bottom: 1px solid ${theme.azul2};
`;

const FechaRegistro=styled.p`
    color: white;
`;