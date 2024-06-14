import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import styled from 'styled-components';
import CajaNavegacion from '../components/CajaNavegacion';
import { DetalleBL } from '../Moldes/DetalleBL';
import { Alerta } from '../../components/Alerta';

export const ListaBillOfLading = ({
  dbOrdenes,
  dbBillOfLading,
  setDBOrdenes,
  dbUsuario,
  userMaster
}
) => {

  // Alertas
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  // // ******************** SELECIONANDO DOCUMENTO DESEADO ******************** //

  const initialValueBLMaster={none:true,furgones:[],};
  const [blMaster, setBLMaster]=useState(initialValueBLMaster);

  const [refresh, setRefresh]=useState(false);

  // 0-Sin ejecutar
  // 1-Encontrado
  // 2-NO encontrado
  const [docEncontrado, setDocEncontrado]=useState(0);

  // Variables varias necesarias
  let location = useLocation();
  const parametro= useParams();
  let docUser = parametro.id;

  useEffect(() => {
    console.log('entro');
    function extraerDoc(baseDatos, docUser){
      let retornar=initialValueBLMaster;
      let encontrado=false;
      baseDatos.forEach((bl)=>{
        if(bl.numeroDoc==docUser){

          encontrado=true;

          // Agregando propiedades
          // Agregar propiedad dias restantes
          let diasLibres=bl.diasLibres;
          let annio=bl.llegadaAlPais.slice(6,10);
          let mes=bl.llegadaAlPais.slice(3,5);
          let dia=bl.llegadaAlPais.slice(0,2);

          let fechaActual= new Date();

          let llegadaAlPaisPlana=
            new Date(
              Number(annio),
              Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
              Number(dia),
            );

          let diasLibresEnMiliSegundos = diasLibres * 24 * 60 * 60 * 1000;
          let diferenciaMilisegundos = llegadaAlPaisPlana - fechaActual + diasLibresEnMiliSegundos;
          let diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

          retornar={
            ...bl,
            diasRestantes
          };
          return;
        }
      });

      if(encontrado==true){
        setDocEncontrado(1);
      }
      else if(encontrado==false){
        setDocEncontrado(2);
      }

      return retornar;
    }

    if(
      location.pathname=='/importaciones/maestros/billoflading/'||
        location.pathname=='/importaciones/maestros/billoflading')
    {
      setBLMaster(initialValueBLMaster);
    }
    else{
      if(dbBillOfLading?.length>0){

        setBLMaster(extraerDoc(dbBillOfLading, docUser));
      }

    }
  }, [dbBillOfLading, refresh]);

  useEffect(()=>{
    if(docEncontrado==2){
      setMensajeAlerta('Bill Of Lading no encontrado.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  },[docEncontrado]);

  return (
    <>
      <Contenedor>
        <Header titulo='Sistema gestion de importaciones' subTitulo='Status de BL'/>
        <CajaNavegacion
          dbUsuario={dbUsuario}
          userMaster={userMaster}
        />
        {
          <DetalleBL
            blMaster={blMaster}
            setBLMaster={setBLMaster}
            dbBillOfLading={dbBillOfLading}
            setDBOrdenes={setDBOrdenes}
            dbOrdenes={dbOrdenes}
            docEncontrado={docEncontrado}
            setDocEncontrado={setDocEncontrado}
            setRefresh={setRefresh}
            refresh={refresh}
            userMaster={userMaster}
          />
        }
      </Contenedor>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};

const Contenedor=styled.div`
  height: 97%;
  padding: 1px;
`;