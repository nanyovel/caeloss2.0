import React from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import { BtnGeneralButton } from './BtnGeneralButton'

export const BtnNormal = styled(BtnGeneralButton)`
    &.danger{
        background-color: red;
        color: white;
    &:hover{
        background-color: white;
        color:red;
    }
    &:active{
        background-color: #c52a2a;
        color: white;
    }
    }
    &.buscar{
        margin: 0;
    }
`

export const BtnNormalw = ({tipo,texto}) => {
  return (
<BtnSingle
        className={tipo}
    >
        {texto}
    </BtnSingle>
  )
}


const BtnSingle=styled(BtnGeneralButton)`
&.normal{

}
&.danger{
    background-color: red;
    color: white;
    &:hover{
        background-color: white;
        color:red;
    }
    &:active{
        background-color: #c52a2a;
    color: white;
    }
}
&.buscar{
    margin: 0;
  }
/* 
&.borrada{
  background-color: red;
  color: white;
  &:hover{
    color: red;
    background-color: white;
    }
}
&.eliminadaRealizado{
  background-color: #eaa5a5;
  &:hover{
    cursor: default;
    color: white;

  }
}
  &.editaEliminada{
    background-color: #407aadb5;
    cursor: default;
    color: white;
  }
  &.buscar{
    margin: 0;
    /* height: 30px; */
  /* }
  &.editando{
    background-color: #5e5d60;
    color: black;
    cursor: default;
  } */ 
`

