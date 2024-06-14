import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import { NavLink } from 'react-router-dom';
import { CSSLoader } from '../../components/CSSLoader';
import { ControlesTablasMain } from '../components/ControlesTablasMain';

export const TablaListaTodosLosBLs = ({
  dbBillOfLading,
}) => {
  // // ******************** RECURSOS GENERALES ******************** //

  // const [habilitar,setHabilitar]=useState({
  const habilitar={
    search:true,
  };

  // // ************************** CODIGO LOADING ************************** //
  const [isLoading,setIsLoading]=useState(false);
  useEffect(()=>{
    if(dbBillOfLading.length>0){
      setIsLoading(false);
    }
    if(dbBillOfLading.length==0){
      setIsLoading(true);
    }
  },[dbBillOfLading,]);

  // // ************************* CONSOLIDACION ************************* //

  const [listaBLs, setListaBLs]=useState([]);
  const [initialValueBLs,setInitialValueBLs]=useState([]);

  useEffect(()=>{
    // No mostrar bl eliminados
    const blsSinEliminados=dbBillOfLading.filter((bl)=>{
      return bl.estadoDoc!=2;
    });

    // Calcular y filtrar estado del documento Abierto o Cerrado
    const blsFiltrados=(blsSinEliminados.filter((bl)=>{
      let estadoDoc=0;
      if(bl.furgones.every(furgon=>furgon.status==5)==false){
        estadoDoc=0;
      }
      else if(bl.furgones.every(furgon=>furgon.status==5)==true){
        estadoDoc=1;
      }
      if(bl.estadoDoc==2){
        estadoDoc=2;
      }

      if(estadoDoc==0){
        return bl;
      }

    }));

    //Agregar propiedad de dias restantes
    const blParsed=blsFiltrados.map((bill)=>{
      let diasLibres=bill.diasLibres;
      let annio=bill.llegadaAlPais.slice(6,10);
      let mes=bill.llegadaAlPais.slice(3,5);
      let dia=bill.llegadaAlPais.slice(0,2);

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

      return{
        ...bill,
        diasRestantes:diasRestantes
      };
    });

    // Ordenar por dias libres
    const blsOrdenados = blParsed.sort((a, b)=> {
      return a.diasRestantes - b.diasRestantes;
    });

    setInitialValueBLs(blsOrdenados);
    setListaBLs(blsOrdenados);
  },[dbBillOfLading]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //

  const [buscarDocInput, setBuscarDocInput]=useState('');

  const handleSearch=(e)=>{
    let entrada=e.target.value;
    setBuscarDocInput(entrada);
    const textoMin=entrada.toLowerCase();

    setListaBLs(initialValueBLs.filter((bl)=>{
      if(
        bl.numeroDoc.toLowerCase().includes(textoMin)||
      bl.proveedor.toLowerCase().includes(textoMin)||
      bl.naviera.toLowerCase().includes(textoMin)||
      bl.puerto.toLowerCase().includes(textoMin)
      ){
        return bl;
      }
    }));

    if(e.target.value==''){
      setListaBLs(initialValueBLs);
    }
  };

  return (
    <>

      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
        Lista de todos los Bill of Lading activos, ordenados por dias restantes (DR).
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          buscarDocInput={buscarDocInput}
        />
      </CabeceraListaAll>
      <CajaTabla>
        <Tabla >
          <thead>
            <Filas className='cabeza'>
              <CeldaHead>N°</CeldaHead>
              <CeldaHead>Numero*</CeldaHead>
              <CeldaHead >Proveedor</CeldaHead>
              <CeldaHead>Naviera</CeldaHead>
              <CeldaHead>Puerto</CeldaHead>
              <CeldaHead title='Dias Libres'>DL</CeldaHead>
              <CeldaHead title='Dias Restantes'>DR</CeldaHead>
              <CeldaHead>Llegada al pais</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {
              listaBLs.map((bl, index)=>{
                return(
                  <Filas
                    key={index}
                    className={`body ${bl.diasRestantes<2?'negativo':''}`}
                  >
                    <CeldasBody>{index+1}</CeldasBody>
                    <CeldasBody
                      data-id={index}
                    >
                      <Enlaces
                        to={`/importaciones/maestros/billoflading/${bl.numeroDoc}`}
                        target="_blank"
                      >
                        {bl.numeroDoc}

                      </Enlaces>
                    </CeldasBody>
                    <CeldasBody
                      title={bl.proveedor}
                      className='proveedor'>{bl.proveedor}</CeldasBody>
                    <CeldasBody>{bl.naviera}</CeldasBody>
                    <CeldasBody>{bl.puerto}</CeldasBody>
                    <CeldasBody>{bl.diasLibres}</CeldasBody>
                    <CeldasBody>{bl.diasRestantes}</CeldasBody>

                    <CeldasBody>{bl.llegadaAlPais.slice(0,10)}</CeldasBody>
                    {/* <CeldasBody>
                          <IconoREDES
                            data-id={index}
                            onClick={(e)=>mostrarFurgones(e)}
                          >
                            👁️
                          </IconoREDES>
                        </CeldasBody> */}
                  </Filas>
                );
              })
            }
          </tbody>
        </Tabla>
      </CajaTabla>
      {
        isLoading?
          <CajaLoader>
            <CSSLoader/>
          </CajaLoader>
          :
          ''
      }
    </>
  );
};

const CajaLoader=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CabeceraListaAll=styled.div`
    background-color: ${theme.azulOscuro1Sbetav};
`;

const EncabezadoTabla =styled.div`
  margin-top: 20px;
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;

  display: flex;
  justify-content: start;
  align-items: center;
`;

const CajaTabla=styled.div`
    overflow-x: scroll;
    padding: 0 10px;
    /* border: 1px solid red; */
    *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        height: 8px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 

`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  @media screen and (max-width:650px){
    margin-bottom: 200px;
    
  }
  @media screen and (max-width:380px){
    /* overflow: scroll; */
    margin-bottom: 130px;
    
  }
  `;

const Filas =styled.tr`
  &.body{
    
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${theme.azul5Osc};
  
  }
  &.descripcion{
    text-align: start;
  }

  &.filaSelected{
    background-color: ${theme.azulOscuro1Sbetav};
    border: 1px solid red;
  }
  &.cabeza{
    background-color: ${theme.azulOscuro1Sbetav};
  }
  color: ${theme.azul1};
  &.negativo{
    color: ${theme.danger}
  }
`;

const CeldaHead= styled.th`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty{
    width: 300px;
  }

`;
const CeldasBody = styled.td`
    font-size: 0.9rem;
    height: 25px;
    border: 1px solid black;
    &.numeroBL{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
   
    text-align: center;
  &.proveedor{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 200px;
    }

`;

const Enlaces=styled(NavLink)`
color: inherit;
text-decoration: none;
&:hover{
  text-decoration: underline;
}

`;
const TituloEncabezadoTabla=styled.h2`
  color: #757575;
  font-size: 1.2rem;
  font-weight: normal;
  padding-left: 20px;
  &.subTitulo{
    font-size: 1rem;
  }
`;