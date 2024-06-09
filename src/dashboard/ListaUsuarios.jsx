import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import db from '../firebase/firebaseConfig'
import styled from 'styled-components'
import theme from '../../theme'
import { Header } from '../components/Header'
import { DetalleUsuarios } from './DetalleUsuarios'

export const ListaUsuarios = ({extraerGrupoPorCondicion,userMaster}) => {
    
     // // ******************** RECURSOS GENERALES ******************** //
    // Alertas
    const [dispatchAlerta, setDispatchAlerta]=useState(false)
    const [mensajeAlerta, setMensajeAlerta]=useState('')
    const [tipoAlerta, setTipoAlerta]=useState('')

    return(
        <>
            <Header titulo='Usuarios'/>
            <DetalleUsuarios 
                extraerGrupoPorCondicion={extraerGrupoPorCondicion}
                userMaster={userMaster}/>
        </>
    )

}
