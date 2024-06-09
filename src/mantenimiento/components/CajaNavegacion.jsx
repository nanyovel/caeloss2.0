import React, { useEffect,  useState } from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alerta } from '../../components/Alerta'
import { getAuth } from 'firebase/auth'

const CajaNavegacion = ({
  pageSelected=false,
  userMaster,
}) => {



  let location = useLocation();
  const[nombrePage,setNombrePage]=useState('')
  const[alertaMismaPage,setAlertaMismaPage]=useState(false)
  const navegacion = useNavigate()

  
  const auth=getAuth()
  const usuario=auth.currentUser

  

  const [accesoFullIMS, setAccesoFullIMS]=useState(false)
  useEffect(()=>{
        const usuarioDB=userMaster
        
              
        if(usuarioDB){
          usuarioDB.privilegios.forEach((pri)=>{
            if (pri.code === "fullAccessIMS" && pri.valor === true) {
              setAccesoFullIMS(true)
            }
          })
        }
      
    
  },[usuario,userMaster])




  // ---------------

  const probarURL=(e)=>{
    e.preventDefault()
    let mismaPagina=false
    setNombrePage(e.target.name)
    switch (e.target.name) {
      case 'Equipos':
        if(location.pathname=='/mantenimiento'){
          mismaPagina=true
        }
        else{
          navegacion('/mantenimiento')
        }
        break;
      case 'Programa':
        if(location.pathname=='/mantenimiento/programa'){
          mismaPagina=true
        }
        else{
          navegacion('/mantenimiento/programa')
        }
        break;
      case 'Gastos':
        if(location.pathname=='/mantenimiento/gastos'){
          mismaPagina=true
        }
        else{
          navegacion('/mantenimiento/gastos')
        }
        break;

      case 'Combustible':
        if(location.pathname=='/mantenimiento/combustible'){
          mismaPagina=true
        }
        else{
          navegacion('/mantenimiento/combustible')
        }
        break;
      case 'Tickets':
        if(location.pathname=='/mantenimiento/tickets'){
          mismaPagina=true
        }
        else{
          navegacion('/mantenimiento/tickets')
        }
        break;
      default:
        break;
    }

    if(mismaPagina){
      setAlertaMismaPage(true)
      setTimeout(() => {
        setAlertaMismaPage(false)
      }, 3000);
    }


    
}
 
  return (
    <>
      <ContenedorSeguirItem>
        <TituloSeguimiento>Paginas:</TituloSeguimiento>
        <CajaBotones>
          <EnlacePrincipal 
            className={pageSelected==0?'selected':''}
            name='Equipos'
            to={'/mantenimiento'}
            onClick={(e)=>probarURL(e)}
            >
               Equipos
              </EnlacePrincipal>
         

            <EnlacePrincipal 
          className={pageSelected==1?'selected':''}
          name='Programa'
          to={'/mantenimiento/programa'}
            onClick={(e)=>probarURL(e)}
          >
            Programa
            </EnlacePrincipal>
            <EnlacePrincipal 
          className={pageSelected==2?'selected':''}
          name='Gastos'
          to={'/mantenimiento/gastos'}
            onClick={(e)=>probarURL(e)}
          >
            Gastos
            </EnlacePrincipal>
            <EnlacePrincipal 
              to={'/mantenimiento/combustible'} 
              name='Combustible'
              onClick={(e)=>probarURL(e)}
              className={`${pageSelected==3?" selected":''}`}>
              Combustible
              </EnlacePrincipal>

            <EnlacePrincipal 
              to={'/mantenimiento/tickets'} 
              name='Tickets'
              onClick={(e)=>probarURL(e)}
              className={`${pageSelected==4?" selected":''}`}>
              Tickets
              </EnlacePrincipal>

          </CajaBotones>
      </ContenedorSeguirItem>

      <Alerta
        estadoAlerta={alertaMismaPage}
        tipo={'warning'}
        mensaje={`Ya se encuentra en la pagina ${nombrePage}.`}
      />
    </>
  )
}

export default CajaNavegacion


const ContenedorParametrizados= styled.div`
  width: 49%;
`
const ContenedorSeguirItem = styled.div`
  /* width: 45%; */
  background-color: ${theme.azulTransparente2};
  border-radius: 4px;
  /* margin-left: 15px; */
  padding: 10px;
  @media screen and (max-width:410px) {
    padding: 10px 2px;
  }

`

const TituloSeguimiento = styled.p`
  color: white;
  border-bottom: 1px solid white;
  display: inline-block;
  margin-bottom: 5px;

`

const CajaBotones =styled.div`
  /* border: 1px solid red; */
  display: flex;
  gap: 2px;
  /* border: 1px solid red; */
  flex-wrap: wrap;
`



const EnlacePrincipal = styled(Link)`
  /* margin: 8px; */
  /* margin-left: 15px; */
  padding: 7px;
  width: auto;
  cursor: pointer; 
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: ${theme.azul3} ;
  color: white;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  display: inline-block;
  /* text-decoration: none; */
    
  
    &:focus{
      background-color: ${theme.azul3} ;
      color: #fff;
    }

    &:hover{
      background-color: #fff ;
    color: #0074d9;
    }
    &:active{
      background-color:  #135c9d;
      color: #fff;
    }

    &.agregar{
      background-color: ${theme.warning};
      color: black;
    }
    &.selected{
      background-color: #fff ;
      color: #0074d9;
    }
    /* border: 1px solid red; */
    @media screen and (max-width:410px){
      font-size: 16x;
      
    }
    @media screen and (max-width:380px){
      font-size: 14px;
      
    }
    @media screen and (max-width:340px){
      font-size: 12px;
    }
  

  
`

const Icono=styled(FontAwesomeIcon)`
`