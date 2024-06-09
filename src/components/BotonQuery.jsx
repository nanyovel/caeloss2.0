import React from 'react'
import styled from 'styled-components'
import { BtnGeneralButton } from './BtnGeneralButton'

export const BotonQuery = (props,) => {
    const queryProps=()=>{
        console.log(props)
    }
  return (
    <CajaBotones >
        <BtnGeneralButton
            onClick={()=>queryProps()}
            
            >Query</BtnGeneralButton>
    </CajaBotones>
  )
}

const CajaBotones=styled.div`
    /* border: 1px solid red; */
    width: 100%;
    
`
