import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'
import { collection, doc, onSnapshot, setDoc, writeBatch } from 'firebase/firestore'
import db from '../firebase/firebaseConfig'
import funcionConsumible from '../../consumible'
import theme from '../../theme'
import ImgCerrado from '../../public/img/candadoCerrado.png'
import { useAuth } from '../context/AuthContext'

export const CardHome = ({
    ImagenCard, 
    titulo, 
    ruta, 
    nuevo, 
    title,
    incompleto,
    tipo,
    bloqueado
}) => {





  return (
    <>
    {
        !bloqueado?
        <Card 
            title={title}
            className={`${incompleto?'incompleto':''}`}
            
            >
            <EnlacePrincipal to={`${ruta}`}>
                <CajaImagen className={incompleto?'incompleto':''}>
                        <Imagen src={ImagenCard}/>
                        <CajaPorcentaje 
                            className={`
                                ${incompleto?'incompleto':''}
                                ${tipo}
                                `}>
                        </CajaPorcentaje>
                        <NumberPor className={incompleto?'incompleto':''}>
                            {100-funcionConsumible(tipo).valorNumber+'%'}
                        </NumberPor>
                        {
                            nuevo?
                        <CajaNuevo 
                            className={nuevo?'nuevo':''}>
                                <NuevoTexto>Nuevo</NuevoTexto>


                        </CajaNuevo>
                        :
                        null
                        }
                </CajaImagen> 
                  
                <div>
                    <TextoCard>{titulo}</TextoCard>
                </div>

            </EnlacePrincipal> 
        </Card>
        :
        <Card 
            // title={title}
            className={`${incompleto?'incompleto':''}`}
            
            >
            <EnlacePrincipal to={`${ruta}`}>
                <CajaImagen className={incompleto?'incompleto':''}>
                        {
                            bloqueado?
                            <Imagen className='bloqueado' src={ImgCerrado}/>
                            :
                            null
                        }
                </CajaImagen> 
            </EnlacePrincipal> 
        </Card>
    }
    </>
  )
}

const Card = styled.div`
     width: 20%;
    height: 200px;
    border:5px solid  #535353;
    overflow: hidden;
    border-radius: 20px 0 20px 0;
    /* z-index: 100; */
    position: relative;

    box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);

    margin: 0 5px;
    /* transition: border 0.4s ease; */
    transition: width ease 0.5s ;
    &:hover{
        border:5px solid  #fff;
        width: 50%;
    }
    &.incompleto{
        /* filter: grayscale(100%); */
        /* background: url('tu-imagen.jpg') center/cover;  */
        /* -webkit-mask-image: linear-gradient(to bottom, transparent 80%, black 80%, black 100%); */
        
    }

    @media screen and (max-width: 750px) {
    width: 100%;
        }
   

`
const EnlacePrincipal = styled(Link)`
    text-decoration: none;
    /* opacity: 0.5; */
    position: relative;

    &:hover{
        opacity: 1;
    animation: arroz 1s;
    animation-direction: normal;}


    @keyframes arroz{
    0%{
        opacity: 0.6;
    }
    100%{
        opacity: 1;
    }
}
`

const CajaImagen = styled.div`
    display: block;
    overflow: hidden;
    /* border-bottom: 1px solid black; */
    width: 100%;
    height: 80%;
    background-size: contain;
    background-repeat: no-repeat;
    object-fit: cover;
    background-position: center;
    /* opacity: 0.5; */
    /* margin-bottom: 10px; */

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

   
`

const TextoCard = styled.h2`
    color:  white;
    text-decoration: none;
    font-size: 1.9rem;
    font-weight: 200;
    text-align: center;
    /* margin: 0px; */
    /* border: 1px solid blue; */
    @media screen and (max-width: 750px) {
    flex-direction: column;
    font-size: 1.9rem;
}
    
    
`

const Imagen = styled.img`
    width: 100%;
    height: 80%;
    /* border: 1px solid red; */
    object-fit: contain;
    position: absolute;
    /* top: 0; */
    z-index:1;
    
  
`
const CajaNuevo=styled.div`
    /* background-color: red; */
    &.nuevo{
    background-color: #ada5a550;
    width: 100%;
    z-index: 100;
    height: 30px;
    position: relative;
    top: 50%;

    }
`
const NuevoTexto=styled.h2`
    background-color: red;
    width: 100%;
    text-align: center;
    color: white;

`

const TextoNuevo = styled.p`
    
    position: absolute;
    color: #fff;
    
    /* -webkit-transform: rotate(-22deg);
    -moz-transform: rotate(-22deg);
    -ms-transform: rotate(-22deg);
    -o-transform: rotate(-22deg); */
    /* transform: rotate(-22deg); */
    height: 40px;
    padding: 20px 0 0 0;
    text-align: center;
    background-color: red;
    width: 100%;
    margin: 0;
    font-size: 0.9rem;
    border:1px solid black;
    /* left: -55px; */
    top: -15px;
`
const CajaPorcentaje=styled.div`
 
    &.incompleto{
        position: absolute;
        width: 100%;
        background-color: #ada5a550;
        top: 0;
        /* left: -50px; */
        backdrop-filter: blur(10px);
        /* border: 5px solid red; */
    }
    &.transporte{
        height: ${funcionConsumible('transporte').valorPorcentaja};
        border-radius:15px 0 0 0;
    }
    &.mantenimiento{
        border-radius:15px 0 15px 0;
        height: ${funcionConsumible('mantenimiento').valorPorcentaja};
    }
    /* background-color: red; */

    /* border: 1px solid; */
    z-index:5;
    /* z-index:100; */
`

const NumberPor=styled.h2`
    display: none;
    &.incompleto{
        display: block;
        position: absolute;
        color:${theme.azul4Osc};
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%); 
        font-size: 3rem;
        z-index:10
    }
`