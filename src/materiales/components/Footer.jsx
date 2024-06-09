import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

export const Footer = () => {
  return (
    <footer>
        <Enlace to='/'>Home</Enlace>
    </footer>
  )
}


const Enlace = styled(Link)`
    color: #fff;
    text-decoration: none;
`