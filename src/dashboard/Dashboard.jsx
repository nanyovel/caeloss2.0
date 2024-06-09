import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styled from 'styled-components';
import theme from '../../theme';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { BotonQuery } from '../components/BotonQuery';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BtnGeneralButton } from '../components/BtnGeneralButton';
import { OpcionUnica } from '../components/OpcionUnica';


export const Dashboard = ({extraerGrupoPorCondicion }) => {
  // Extrar un grupo de documentos por una condicion
  const [dbUsuario,setDBUsuario]=useState()

  extraerGrupoPorCondicion('usuarios', setDBUsuario, "userName","!=","null")
  
    const [userList, setUserList]=useState([])

  
    useEffect(()=>{
      if(dbUsuario){
      const dbUserES6=dbUsuario.map((user)=>{
        const annio=user.fechaRegistro.slice(6,10)
        const mes=user.fechaRegistro.slice(3,5)
        const dia=user.fechaRegistro.slice(0,2)
        let hora=user.fechaRegistro.slice(11,13)
        let minutos=user.fechaRegistro.slice(14,16)
        let segundos=user.fechaRegistro.slice(17,19)
        const tipo=user.fechaRegistro.slice(24,27)

        if(hora!=12){
          if(tipo=='PM'){
            hora=Number(hora)+12
          }
        }
        if(hora==12){
          if(tipo=='AM'){
            hora=0
          }
        }

        const fechaES6= new Date(annio,mes-1,dia,hora,minutos,segundos)

        return{
          ...user,
          fechaRegistro:fechaES6
        }
      })

    // Función de comparación para ordenar por fecha de registro
    function compararFechas(a, b) {
      return a.fechaRegistro - b.fechaRegistro;
    }

    // Ordenar el array de usuarios por fecha de registro
    
    setUserList(dbUserES6.sort(compararFechas))
  }
    },[dbUsuario])

    const [arrayOpciones,setArrayOpciones]=useState([
      {
        nombre:'Usuarios',
        opcion: 0,
        select:true,
      },
      {
        nombre:'Visitas',
        opcion: 1,
        select:false,
      },

     
    ])
    
    const handleOpciones=(e)=>{
      let index=Number(e.target.dataset.id)
      setArrayOpciones(prevOpciones => 
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );
    }

  return (
    <Contenedor>
        <Header titulo={'Dashboard'}/>
        <BotonQuery userList={userList}/>
        <OpcionUnica
           titulo='Pantallas'
           name='grupoA'
           arrayOpciones={arrayOpciones}
           handleOpciones={handleOpciones}
        />
     
      
      {
        arrayOpciones[0].select&&
        <>
        <CajaEncabezado>
          <TituloEncabezado>Lista de todos los usuarios</TituloEncabezado>
        </CajaEncabezado>

        <CajaTabla>
      <Tabla >
        <thead>
          <Filas className='cabeza'>
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Username*</CeldaHead>
            <CeldaHead>Nombre</CeldaHead>
            <CeldaHead >Apellido</CeldaHead>
            <CeldaHead >Dpto</CeldaHead>
            <CeldaHead >Registro</CeldaHead>
          </Filas>
        </thead>
        <tbody>
          {
            userList.length>0&&
            userList.map((user,index)=>{
              return(
                <Filas key={index}>
                  <CeldasBody>{index+1}</CeldasBody>
                  <CeldasBody >
                    <Enlaces 
                      to={`/dashboard/usuarios/${user.userName}`}
                      target="_blank">
                      {user.userName}
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody>{user.nombre}</CeldasBody>
                  <CeldasBody>{user.apellido}</CeldasBody>
                  <CeldasBody>{user.dpto}</CeldasBody>
                  <CeldasBody className='registro'>
                    {format(user.fechaRegistro,`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es})}</CeldasBody>
                </Filas>
              )
            })
          }
        </tbody>
    </Tabla>
    </CajaTabla>
    </>
  }
  {
    arrayOpciones[1].select&&
    <>
      <CajaEncabezado>
          <TituloEncabezado>Tabla de visitas de usuarios</TituloEncabezado>
        </CajaEncabezado>
        {
          userList.map((user,index)=>{
            const urlCount = {};

            // Recorrer el array y contar las URLs
            console.log(user)
            user?.registrosActividad?.visitas?.forEach(item => {
              if (urlCount[item.url]) {
                urlCount[item.url]++;
              } else {
                urlCount[item.url] = 1;
              }
            });

            // Crear un nuevo array con las URLs únicas y su cantidad
            const resultArray = Object.keys(urlCount).map(url => ({
              url,
              qty: urlCount[url]
            }));

            // Ordenar el array resultante de mayor a menor cantidad
            resultArray.sort((a, b) => b.qty - a.qty);


            return(
              <div key={index}>
                  <TextoTitulo>{
                    user.nombre?
                    user.nombre
                    :
                    user.userName
                    
                    }</TextoTitulo>

                 <Tabla>
                  <thead>
                    <Filas>
                      <CeldaHead>URL</CeldaHead>
                      <CeldaHead>QTY</CeldaHead>
                    </Filas>

                  </thead>
                  <tbody>
                    {
                      resultArray.map((url,i)=>{
                        return(
                          <Filas key={i}>
                            <CeldasBody>
                              {url.url}
                            </CeldasBody>
                            <CeldasBody>
                              {url.qty}
                            </CeldasBody>
                          </Filas>
                        )
                      })
                    }
                  </tbody>
                 </Tabla>
                    
                  
                </div>
            )
          })
        }
        
    </>
  }
    </Contenedor>
  )
}


const Contenedor=styled.div`
width: 95%;
  overflow: auto;
  margin: auto;
  margin-bottom: 85px;
`
const CajaEncabezado=styled.div`
  padding: 15px;
`
const TituloEncabezado=styled.h2`
  color: ${theme.azul2};
  border-bottom: 2px solid ${theme.azul2};
`

const CajaTabla=styled.div`
    overflow-x: scroll;
    padding: 0 10px;
    /* border: 1px solid red; */
    *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        height: 3px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 

`
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  margin-left: 5px;

  /* margin: auto; */
  `

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
`

const CeldaHead= styled.th`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty{
    width: 300px;
  }

`
const CeldasBody = styled.td`
border: 1px solid black;
font-size: 0.9rem;
height: 25px;

text-align: center;
&.romo{
 cursor: pointer;
 &:hover{
}}
&.descripcion{
 text-align: start;
 padding-left: 5px;
}
&.registro{
  /* text-overflow: ellipsis; */
  white-space: nowrap;
 text-align: start;
 padding: 0 5px;
}
&.clicKeable{
 cursor: pointer;
 &:hover{
      text-decoration: underline;
  }
}
`

const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}

`
const TextoTitulo=styled.h2`
  color:${theme.azul2}
`