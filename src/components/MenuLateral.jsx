import React, { useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import {Link, useLocation, useParams, NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import theme from '../../theme'
import {faHelmetSafety,  faTruckFast,faEarthAmericas,faGasPump,faRoute, faFileLines,faCircleInfo, faFolder, faScrewdriver, faScrewdriverWrench, faHouse, faPersonWalkingDashedLineArrowRight, faRightToBracket, faChartSimple  } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../context/AuthContext';
import { BotonQuery } from './BotonQuery';

export const MenuLateral = ({userMaster}) => {
    let oneRef= useRef()
    const [menuAbierto, cambiarMenuAbierto]= useState(false)
  
    let location = useLocation();
    let lugar = location.pathname;

    const {usuario}=useAuth()

    // Obtener usuario de base de datos si ya esta creado
    const [userDB, setUserDB]=useState({})
    const [privilegios, setPrivilegios]=useState({
        fullDashBoard:false
    })

    useEffect(()=>{
        if(usuario,userMaster){
            const usuarioDB=userMaster

            let proceder=false
            usuarioDB?.privilegios?.forEach(pri=>{
              if (pri.code === "fullAccessDashboard" && pri.valor === true) {
                proceder=true
              }
            })

        // Si el usuario tiene 
        setUserDB(usuarioDB)
        if(proceder==true){
            setPrivilegios({
                ...privilegios,
                fullDashBoard:true
            })
          }
         
        }
    },[userMaster,usuario])
  
  return (
    <Body > 
       
        <MenuSide className={`
            ${menuAbierto? " arrru" : ""}`} 
            dataset='menuSide' 
            ref={oneRef} 
            onMouseEnter={()=>cambiarMenuAbierto(true)} 
            onMouseLeave={()=>cambiarMenuAbierto(false)}
            >
                {
                    usuario?
                        <Enlaces 
                            to={'/perfil'}  
                            className={'perfil'}

                        >
                        <Option className='fotoPerfil' >
                            {
                                userDB?.urlFotoPerfil?
                                    <Img src={userDB.urlFotoPerfil}/>
                                :
                                <Icono icon={faUser} className={`${lugar==="/perfil"? "iconoSelect" : ""}`}/>
                            }
                            <TituloMenu className={menuAbierto?'menuAbierto':''}>
                                {
                                    usuario?
                                    (
                                        userDB?.nombre?
                                            userDB.nombre
                                        :
                                        'Perfil'
                                        //     userDB?.userName?
                                        //     userDB.userName
                                        // :
                                        // 'User perfil'
                                    )
                                    :
                                    'Perfil'
                                    }
                            </TituloMenu>
                        </Option>
                    </Enlaces>
                    :

                        <Enlaces 
                            to={'/acceder'} 
                            className={'fotoPerfil'}
                        >
                        <Option >
                            <Icono icon={faUser} className={`${lugar==="/acceder"? "iconoSelect" : ""}`}/>
                            <TituloMenu className={menuAbierto?'menuAbierto':''}>Acceder</TituloMenu>
                        </Option>
                    </Enlaces>
                    }
            <NamePage>
                <BoxBarsMenu onClick={()=>cambiarMenuAbierto(!menuAbierto)} >
                    <Linea1 className={`${menuAbierto? " activeline1" : ""}`} ></Linea1>
                    <Linea2 className={`${menuAbierto? " activeline2" : ""}`}></Linea2>
                    <Linea3 className={`${menuAbierto? " activeline3" : ""}`}></Linea3>
                </BoxBarsMenu>
            </NamePage>
            <CajaOptionMenu >
                

                    <Enlaces to={'/'}  
                    >
                    <Option >
                        <Icono icon={faHouse} className={`${lugar==="/"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Inicio</TituloMenu>
                    </Option>
                </Enlaces>

                



                <Enlaces to={'/materiales'}  
                     className={({ isActive, isPending }) =>
                     isPending ? "pending" : isActive ? "active" : ""
                   }
                >
                    <Option>
                        <Icono icon={faHelmetSafety} className={`${lugar==="/materiales"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Materiales</TituloMenu>
                    </Option>

                </Enlaces>
                {
                    usuario?.emailVerified&&
                <Enlaces to={'/fletes'} >
                    <Option>
                        <Icono icon={faTruckFast} className={`${lugar==="/fletes"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Fletes</TituloMenu>
                    </Option>

                </Enlaces>
                }
                
                {
                    usuario?.emailVerified&&
                <Enlaces to={'/importaciones'} placeholder='Modulo Nuevo'
                      className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    <Option>
                        <Icono icon={faEarthAmericas} className={`${lugar==="/importaciones"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Importaciones</TituloMenu>
                    </Option>
                </Enlaces >
                }


                {/* <Enlaces to={'/transportes'} >
                    <Option>
                        <Icono icon={faRoute} className={`icono debajo ${lugar==="/transportes"? "iconoSelect" : ""}`}/>
                        <Icono icon={faFileLines} className={`icono encima ${lugar==="/transportes"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Transportes</TituloMenu>
                    </Option>

                </Enlaces> */}
                <Enlaces to={'/mantenimiento'} >
                    <Option>
                        <Icono icon={faScrewdriverWrench} className={` ${lugar==="/mantenimiento"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Mantenimiento</TituloMenu>
                    </Option>

                </Enlaces>
                {/* <Enlaces to={'/documentacion'}>
                    <Option>
                        <Icono icon={faCircleInfo} className={`icono ${lugar==="/documentacion"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Documentacion</TituloMenu>
                    </Option>

                </Enlaces> */}


                {/* <Anclas target='_blank' href={'/version1/'}>
                    <Option>
                        <Icono icon={faFolder} className={`icono ${lugar==="/version1"? "iconoSelect" : ""}`}/>
                        <TituloMenu className={menuAbierto?'menuAbierto':''}>Version 1</TituloMenu>
                    </Option>

                </Anclas> */}

                
                {
                    usuario?.emailVerified&&
                    (
                        privilegios.fullDashBoard?
                        <Enlaces to={'/dashboard'} 
                            className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}>
                            <Option>
                                <Icono icon={faChartSimple} className={`${lugar==="/dashboard"? "iconoSelect" : ""}`}/>
                                <TituloMenu className={menuAbierto?'menuAbierto':''}>Dashboard</TituloMenu>
                            </Option>
                        </Enlaces >
                    :
                    ''
                    )
                
                }
               
               {/* ------------------- */}
            </CajaOptionMenu>

        </MenuSide>
       
    </Body>
  )
}

const Body = styled.div`
    margin-left: 80px;
    margin-top: 80px;
    /* transition: margin-left 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86); */
    position: absolute;
    background-color: red;
    /* border: 1px solid red; */

   
`
const MenuSide = styled.div`
    width: 60px;
    height: 100%;
    background-color: ${theme.fondoEdTeam2};
    position: fixed;
    top: 0;
    left: 0;
    color: white;
    font-size: 18px;
    z-index: 300;
    overflow: hidden;
    border-right: 1px solid ${theme.azul2};
    transition: all 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    &.arrru{
        width: 300px;
        @media screen and (max-width:620px){
            left: 0;
        }
    }
    @media screen and (max-width:620px){
        left: -60px;
    }

/* Ocultar scroll para IE, Edge y Firefox */
    /* -ms-overflow-style: none; */
    /* scrollbar-width: 2px; */

/*Ocultar scroll para chrome, safari y opera*/
    /* &::-webkit-scrollbar{ */
        /* width: 3px; */
        /* display: none; */
    /* } */
    overflow-y:scroll;
    *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        width: 2px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
`

const NamePage = styled.div`
    padding: 0 30px 0 30px;
    display: flex;
    /* margin-top: 10px; */

    width: 100%;
    border-bottom: 3px solid ${theme.azul2};
    h2{
        margin-bottom: 7px;
        font-weight: 200;
    }
    @media screen and (max-width: 620px){
        /* width: 100px; */
        background-color: transparent;
        /* position: fixed; */
    }
  
`

const BoxBarsMenu=styled.div`
    width: 30px;
    height: 50px;
    position: absolute; 
    left: 18px;
    margin-top: 10px;
     margin-right: 10px;
    z-index: 1;
    &:hover{
        cursor: pointer;
    }
    @media screen and (max-width:620px){
        border: 1px solid ${theme.azul2};
        background-color: ${theme.azulOscuro1Sbetav3};
        border-radius: 5px 0 5px 0;
        padding: 4px;
        /* padding-left: 6px; */
        width: 40px;
        height: 50px;
        /* left: 0; */
        left: auto;
        right: 10px;
        bottom: 20px;
        position: fixed;
    }
`

const Linea= styled.span`
    display: block;
    /* position: absolute; */
    width: 100%;
    height: 4px;
    background: #ffffff;
    margin-top: 7px;
    transform-origin: 0px 100%;
    transition: all 300ms;
    &.activeline1{
        transform: rotate(45deg) translate(0px, 2px); 
        margin-left: 5px;
    }

    &.activeline2{
        opacity: 0;
        margin-left: -30px; 
    }

    &.activeline3{
        margin-left: 5px;
        transform: rotate(-45deg) translate(0px, 2px);
    }
`
const Linea1=styled(Linea)`
`
const Linea2=styled(Linea)`
`
const Linea3=styled(Linea)`
`

const CajaOptionMenu= styled.div`
     padding: 20px 0;
    position: absolute;
    top: 90px;
`
const Enlaces = styled(NavLink)`
    color: #ffffffb2;
    display: block;
    position: relative;
    transition: color 25ms;
    border-bottom: 3px solid transparent;
    padding: 0 25px;
    width: 200px;
    &:hover{
        color: white;
        border-bottom: 3px solid ${theme.azul2};
    }

    h4{
        position: absolute;
        left: 40px;
        font-weight: 200;
    }
    &:hover{
        cursor: pointer;
    }
    &.nuevo{
        border: 1px solid ${theme.azul2};
    }
    h2{
        font-size: 1rem;
        text-decoration: none;
        font-weight: 200;
        z-index: 5;
        padding: 5px;
        background-color: ${theme.azul2};
    }
    text-decoration: none;
    &.active{
        color: red;
        color: ${theme.azul2};
    }
    &.perfil{
        /* border: none; */
        padding: 0 ;
        /* border: 1px solid yellow; */
        display: inline-block;
        height: 70px;
        width: 100%;
        &:hover{
            border-bottom: 3px solid transparent;
            background-color: ${theme.hover1};
        }
        &.active{
            color: white;
            background-color: ${theme.hover1};
        }
    }
`

const Anclas=styled.a`
    color: #ffffffb2;
    display: block;
    position: relative;
    transition: color 25ms;
    border-bottom: 3px solid transparent;
    padding: 0 25px;
    width: 200px;
    &:hover{
        color: white;
        border-bottom: 3px solid ${theme.azul2};
    }

    h4{
        position: absolute;
        left: 40px;
        font-weight: 200;
    }
    &:hover{
        cursor: pointer;
    }
    &.nuevo{
        border: 1px solid ${theme.azul2};
    }
    h2{
        font-size: 1rem;
        text-decoration: none;
        font-weight: 200;
        z-index: 5;
        padding: 5px;
        background-color: ${theme.azul2};
    }
    text-decoration: none;
    &.active{
        color: red;
        color: ${theme.azul2};
    }
`

const Icono = styled(FontAwesomeIcon)`
    &.debajo{
        position: absolute;
        left:-5px;
    }
    &.encima{
        opacity: 0.6;
        position: absolute;
        bottom: 10%;
        left: 8%;
    }

`

const TituloMenu =styled.h4`
    display: none;
    &.menuAbierto{
        display: block;
    }
`
const Option = styled.div`
    padding: 20px 0px;
    display: flex;
    align-items: center;
    position: relative;
    /* display: none; */
    
    
    &.fotoPerfil{
        padding:  0px;
        display: flex;
        justify-content: center;
        align-items: center;
        /* border: 1px solid red; */
       
        width: 100%;
        height: 100%;
    }
`
const Img=styled.img`
    width: 40px;
    height: 40px;
    object-fit: contain;
    /* border: 1px solid red; */
    /* border: 1px solid ${theme.warning}; */
    border-radius: 50%;
    /* transform: translate(-30%,0); */
    

`