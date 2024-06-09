import React from 'react'
import { Header } from '../../components/Header'
import CajaNavegacion from '../components/CajaNavegacion'

export const Programa = ({
  dbUsuario,
  userMaster,
}) => {
  return (
    <>
    <Header titulo="Sistema gestion mantenimientos"/>
    <CajaNavegacion
      pageSelected={1}
      dbUsuario={dbUsuario}
      userMaster={userMaster}
      />
    </>
  )
}
