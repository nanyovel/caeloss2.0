import React, { useState } from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import { BotonQuery } from '../components/BotonQuery'
import { BtnGeneralButton } from '../components/BtnGeneralButton'

import { useAuth } from '../context/AuthContext'
import {  useNavigate } from 'react-router-dom'
import { autenticar } from '../firebase/firebaseConfig'
import { signOut } from 'firebase/auth'


export const LogOut = () => {
    const navegacion=useNavigate()
    
    const handleSubmit=async(e)=>{
        try{
            await signOut(autenticar)
            navegacion('/')
        }catch(error){
            console.log(error)
            setMensajeAlerta('Error con la base de datos.')
            setTipoAlerta('error')
            setDispatchAlerta(true)
            setTimeout(() => {
                setDispatchAlerta(false)
            }, 3000);
        }
    
        
    }

  return (
    <Contenedor>
        <BotonQuery
            datos={datos}
        />
        <CajaTitulo>
            <TituloMain>Log Out</TituloMain>
        </CajaTitulo>
       
            <CajaTitulo>

        <BtnGeneralButton
            onClick={(e)=>handleSubmit(e)}
            >Salir</BtnGeneralButton>
            </CajaTitulo>
    </Contenedor>
  )
}

const CajaTitulo=styled.div`
    display: flex;
    justify-content: center;
    border-bottom: 2px solid ${theme.azul2};
`

const TituloMain=styled.h2`
    color:white;
    margin: auto;
`

const Contenedor=styled.div`
    height: 500px;
    margin: auto;
    padding: 25px;
    width: 90%;
    border: 1px solid black;
    border-radius: 10px;
    margin-top: 30px;
    background-color: ${theme.azulOscuro1Sbetav};

`
const CajaInput=styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Tituto=styled.h2`
    color:white;
`
const Input=styled.input`
  height: 30px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${theme.azul1};
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 10px;
  width: 300px;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }
`