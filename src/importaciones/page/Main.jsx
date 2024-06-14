import { useState } from 'react';
import { Header } from '../../components/Header';
import CajaNavegacion from '../components/CajaNavegacion';
import { TablaListaTodosLosItems } from '../Tablas/TablaListaTodosLosItems';
import { TablaListaTodosLosFurgones } from '../Tablas/TablaListaTodosLosFurgones';
import { TablaListaTodasLasOC } from '../Tablas/TablaListaTodasLasOC';
import { TablaListaTodosLosBLs } from '../Tablas/TablaListaTodosLosBLs';
// import { BotonQuery } from '../../components/BotonQuery';
import styled from 'styled-components';
import { OpcionUnica } from '../../components/OpcionUnica';
import { useEffect } from 'react';

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
  },[]);
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
  ]);

  const [tablaActiva,setTablaActiva]=useState();
  useEffect(()=>{
    if(arrayOpciones[0].select==true){
      setTablaActiva(
        <TablaListaTodosLosItems
          dbOrdenes={dbOrdenes}
          dbBillOfLading={dbBillOfLading}

        />);
    }
    else if(arrayOpciones[1].select==true){
      setTablaActiva(<TablaListaTodosLosFurgones
        dbOrdenes={dbOrdenes}
        dbBillOfLading={dbBillOfLading}
      />);
    }
    else if(arrayOpciones[2].select==true){
      setTablaActiva(<TablaListaTodasLasOC
        dbOrdenes={dbOrdenes}
        dbBillOfLading={dbBillOfLading}
      />);
    }
    else if(arrayOpciones[3].select==true){
      setTablaActiva(<TablaListaTodosLosBLs
        dbOrdenes={dbOrdenes}
        dbBillOfLading={dbBillOfLading}
      />);
    }

  },[dbBillOfLading,dbOrdenes,arrayOpciones]);

  const handleOpciones=(e)=>{
    let index=Number(e.target.dataset.id);
    setArrayOpciones(prevOpciones =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  return (
    <>
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
  );
};

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
`;