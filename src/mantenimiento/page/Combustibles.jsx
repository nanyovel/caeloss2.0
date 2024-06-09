import React from 'react'
import { Header } from '../../components/Header'
import CajaNavegacion from '../components/CajaNavegacion'


export const Combustibles = ({
  dbUsuario,
  userMaster,
}) => {
  return (
    <>
    <Header titulo="Sistema gestion mantenimientos"/>
    <CajaNavegacion
      pageSelected={3}
      dbUsuario={dbUsuario}
      userMaster={userMaster}
      />
    </>
  )
}
