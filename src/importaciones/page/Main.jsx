import React, {  useState } from 'react'
import { Header } from '../../components/Header'
import CajaNavegacion from '../components/CajaNavegacion'
import { TablaListaTodosLosItems } from '../Tablas/TablaListaTodosLosItems'
import { TablaListaTodosLosFurgones } from '../Tablas/TablaListaTodosLosFurgones'
import { TablaListaTodasLasOC } from '../Tablas/TablaListaTodasLasOC'
import { TablaListaTodosLosBLs } from '../Tablas/TablaListaTodosLosBLs'
import { BotonQuery } from '../../components/BotonQuery'
import styled from 'styled-components'
import { OpcionUnica } from '../../components/OpcionUnica'
import { useEffect } from 'react'
import theme from '../../../theme'
import ImagenBuildWeb from './../../../public/img/buildWeb.svg'


export const Main = ({
  dbOrdenes,
  dbBillOfLading,
  dbUsuario,
  userMaster
}) => {

  useEffect(()=>{
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss"; 
    };
  },[])
const [arrayOpciones,setArrayOpciones]=useState([
  {
    nombre:'Articulos',
    opcion: 0,
    select:true,
  },
  {
    nombre:'Contenedores',
    opcion: 1,
    select:false,
  },
  {
    nombre:'O/C',
    opcion: 2,
    select:false,
  },
  {
    nombre:'BLs',
    opcion: 3,
    select:false,
  },
])


const [hasModal, setHasModal]=useState(false)
 

  

  const [tablaActiva,setTablaActiva]=useState()
  useEffect(()=>{
    if(arrayOpciones[0].select==true){
      setTablaActiva(
      <TablaListaTodosLosItems
        dbOrdenes={dbOrdenes}
        dbBillOfLading={dbBillOfLading}

      />)
    }
    else if(arrayOpciones[1].select==true){
      setTablaActiva(<TablaListaTodosLosFurgones
        dbOrdenes={dbOrdenes}
        dbBillOfLading={dbBillOfLading}
      />)
    }
    else if(arrayOpciones[2].select==true){
      setTablaActiva(<TablaListaTodasLasOC
        dbOrdenes={dbOrdenes}
        dbBillOfLading={dbBillOfLading}
      />)
    }
    else if(arrayOpciones[3].select==true){
      setTablaActiva(<TablaListaTodosLosBLs
        dbOrdenes={dbOrdenes}
        dbBillOfLading={dbBillOfLading}
      />)
    }

  },[dbBillOfLading,dbOrdenes,arrayOpciones])

  const handleOpciones=(opcion)=>{
    let index=Number(event.target.dataset.id)
    setArrayOpciones(prevOpciones => 
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  }


  return (
    <>
   
    <ContenedorAvisoModal className={hasModal==true?'':'activo'}>
      <CajaAviso>
        <TituloAviso>Sistema de gestión de importaciones.</TituloAviso>
        <TituloAviso className='subtitulo'>Realizando toques finales, aquí podrás:</TituloAviso>
        <ListaDesordenada>
        <ElementoLista>Consultar en tiempo real status de tus materiales en proceso de importación.</ElementoLista>
              <ElementoLista>Acceder a la informar desde el celular cuando desees. </ElementoLista>
              <ElementoLista>Consultas rápidas y de manera intuitiva.</ElementoLista>
              <ElementoLista>Activar seguimiento a un producto especifico.</ElementoLista>
              <ElementoLista>Activar notificaciones del ciclo de vida de importación.</ElementoLista>
              <ElementoLista>Asignar prioridad a productos y contenedores.</ElementoLista>
              <ElementoLista>Mantenerte actualizado sobre cambios de fechas de tus materiales.</ElementoLista>

           
              <ElementoLista>Y muchas cosas mas...</ElementoLista>

            </ListaDesordenada>
            <CajaImg>
          <Img src={ImagenBuildWeb}/>
            </CajaImg>
      </CajaAviso>
    </ContenedorAvisoModal>
      <Header titulo={'Sistema gestion de importaciones'} subTitulo='Main'/>
      <ContainerNav>
          <CajaNavegacion
            pageSelected={0}
            dbUsuario={dbUsuario}
            userMaster={userMaster}
          />
          <OpcionUnica
              titulo='Pantallas'
              name='grupoA'
              arrayOpciones={arrayOpciones}
              handleOpciones={handleOpciones}
              
          />

      </ContainerNav>
          
         { tablaActiva}
         

  {/* <Footer/>       */}
    </>
  )
}

const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width:1000px){
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width:410px){
    width: 99%;
  
  }
`

const ContenedorAvisoModal=styled.div`
  background-color: #32353868;
  z-index: 100;
  position: fixed;
  width: 900px;
  height: 100vh;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(1px);

  @media screen and (max-width: 1070px) {
        width: 80%;
      }
      @media screen and (max-width: 650px) {
        width: 80%;
      }
      @media screen and (max-width: 550px) {
        width: 100%;
        margin: 0;
      }
      &.activo{
        display: none;
        background-color: red;
      }
`

const CajaAviso=styled.div`
  width: 80%;
  height: 80%;
  /* background-color: ${theme.azulOscuro1Sbetav}; */
  background-color: #000b1ad7;
  border: 1px solid ${theme.azul2};
  border-radius: 15px 0 15px 0;
  padding: 10px;
`

const ListaDesordenada=styled.ul`
  color: ${theme.azul1};
  margin-left: 20px;
  font-size: 0.9rem;
  margin-bottom: 45px;
`

const ElementoLista=styled.li`
  
`

const TituloAviso=styled.h2`
  color: ${theme.azul2};
  border-bottom: 1px solid ${theme.azul2};
  
  &.subtitulo{
    font-size: 1rem;
    border-bottom: none;
    color: ${theme.azul2};
    color: #534e4e;
  }

`

const CajaImg=styled.div`
  width: 100%;
  /* height: 500px; */
  display: flex;
  justify-content: center;
`

const Img=styled.img`
  width: 65%;
  object-fit: contain;
  
  
`