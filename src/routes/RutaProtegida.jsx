import React, { createContext, useContext } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import {  Navigate, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'


export const RutaProtegida = ({children}) => {
  const {usuario}=useAuth()

    
  if(usuario?.emailVerified){
    return children
  }
  else{
        return <Navigate replace to='/acceder' />
      }
}
