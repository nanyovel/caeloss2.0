import React from 'react'
import { Header } from '../../components/Header'
import CajaNavegacion from '../components/CajaNavegacion'
import { ControlesTablasMain } from '../components/ControlesTablasMain'

export const MainMante = ({
  dbUsuario,
  userMaster,
}) => {
  return (
    <>
      <Header titulo='Sistema Gestion Mantenimiento' subTitulo='Main'/>
      <CajaNavegacion
        pageSelected={0}
        dbUsuario={dbUsuario}
        userMaster={userMaster}
      />
      {/* <ControlesTablasMain/> */}
    
    </>
  )
}
