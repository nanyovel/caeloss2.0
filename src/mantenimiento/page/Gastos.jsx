import React from 'react'
import { Header } from '../../components/Header'
import CajaNavegacion from '../components/CajaNavegacion'

export const Gastos = ({
  dbUsuario,
  userMaster,
}) => {
  return (
    <>
    <Header titulo="Sistema gestion mantenimientos"/>
    <CajaNavegacion
      pageSelected={2}
      dbUsuario={dbUsuario}
      userMaster={userMaster}
      />
    </>
  )
}
