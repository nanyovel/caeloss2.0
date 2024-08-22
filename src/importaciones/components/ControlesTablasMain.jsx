import theme from '../../config/theme.jsx';
import styled from 'styled-components';

export const ControlesTablasMain = ({
  handleSearch,
  arrayOpciones,
  buscarDocInput,
  statusDocInput,
  destinoDocInput,
  listDestinos,
  habilitar,
  handleOpciones,
  handleDestino,
  tipo,
}) => {

  return (
    <Container className={tipo}>
      {
        habilitar.opcionesUnicas&&
        <CajaParametro className={tipo}>
          {
            arrayOpciones.map((opcion,index)=>{
              return (
                <CajaBlanco key={index}>
                  <Radio

                    type="radio"
                    name={'enviados'}
                    data-id={index}
                    value={index}
                    onChange={(e)=>handleOpciones(e)}
                    checked={opcion.select}
                    id={opcion.nombre}

                  />
                  <Label
                    htmlFor={opcion.nombre}
                  >
                    {opcion.nombre}
                  </Label>
                </CajaBlanco>);
            })
          }
        </CajaParametro>
      }

      <ContenedorInputTextMenuDesplegable className={tipo}>
        {
          habilitar.search&&
        <ContenedorBuscar className={tipo}>
          <TituloBuscar>
        Buscar
          </TituloBuscar>
          <InputBuscar
            onChange={(e)=>handleSearch(e)}
            value={buscarDocInput}
            name='inputBuscar'
            className={tipo}
            autoComplete='off'
          />
        </ContenedorBuscar>
        }

        {
          habilitar.status&&
            <ContenedorBuscar className={tipo}>
              <TituloBuscar>
              Status
              </TituloBuscar>
              <MenuDesplegable
                onChange={(e)=>{handleSearch(e);}}
                name='cicloVida'
                value={statusDocInput}
                className={tipo}
              >
                <Opciones value="">Todos</Opciones>
                <Opciones disabled value="0">Proveedor</Opciones>
                <Opciones value="1">Transito Maritimo</Opciones>
                <Opciones value="2">En Puerto</Opciones>
                <Opciones value="3">Recepcion Almacen</Opciones>
                <Opciones value="4">Dpto Importaciones</Opciones>
                <Opciones value="5" disabled>Concluido en SAP✅</Opciones>
              </MenuDesplegable>
            </ContenedorBuscar>
        }
        {
          habilitar.destino&&
            <ContenedorBuscar className={tipo}>
              <TituloBuscar>
              Destino
              </TituloBuscar>
              <MenuDesplegable
                className={tipo

                }
                onChange={tipo=='enPuerto'||tipo=='almacen'?
                  (e)=>{handleDestino(e);}
                  :
                  (e)=>{handleSearch(e);}
                }
                name='destino'
                value={destinoDocInput}
              >
                <Opciones value="">Todos</Opciones>
                {
                  listDestinos.map((dest,index)=>{
                    return (
                      <Opciones key={index} value={dest.toLowerCase()}>{dest}</Opciones>
                    );
                  })
                }

              </MenuDesplegable>
            </ContenedorBuscar>

        }
      </ContenedorInputTextMenuDesplegable>

    </Container>
  );
};

const Container=styled.div`
  display: flex;
  max-width: 1000px;
  /* margin: 0 20px; */
  border: 1px solid transparent;
  width: 100%;
  padding: 5px 15px;
  justify-content: center;
  &.articulo{
    justify-content: start;
  }
  @media screen and (max-width:620px){
      flex-direction: column;
  }
  &.proveedor{
    justify-content: start;
    @media screen and (max-width:700px) {
      display: flex;
      flex-direction: column;
      
    }
  }
  &.transito{
    @media screen and (max-width:900px) {
      flex-direction: column;
    }

  }

  display: flex;
  align-items: end;
  &.enPuerto{
    
    /* flex-wrap: wrap; */
    @media screen and (max-width:850px){
      display: flex;
      flex-direction: column;
      padding-right: 0;

      
    }
  }
  &.enPuertoAvanzar{
    padding: 5px 2px;
    /* flex-wrap: wrap; */
    @media screen and (max-width:850px){
      display: flex;
      flex-direction: column;
      padding-right: 0;

      
    }
  }
  &.almacen{
      justify-content: start;
    @media screen and (max-width:830px){
      display: flex;
      justify-content: start;
      padding: 0;
    }
    @media screen and (max-width:620px){
      display: flex;
      flex-direction: row;
     
    }
    @media screen and (max-width:480px){
      display: flex;
      flex-direction: column;
     
    }
  }
  &.import{
    @media screen and (max-width:630px) {
      flex-direction: row;
      
    }
    @media screen and (max-width:450px) {
      flex-direction: column;
      
    }
  }


`;
const CajaParametro = styled.div`
  display: flex;
  &.articulo{
      @media screen and (max-width:860px){

      width: 49%;
    }
  
    @media screen and (max-width:700px){
        width: 50%;
    }
    @media screen and (max-width:680px){
        width: 40%;
    }
    @media screen and (max-width:620px){
        width: 100%;
        margin-bottom: 5px;
    }
    @media screen and (max-width:460px){
        width: 100%;
        padding-left: 0 10px;
    }
    min-width: 190px;
    
  }
  &.proveedor{
    margin-right: 5px;
    @media screen and (max-width:700px) {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }
  &.transito{
    margin-right: 5px;
    @media screen and (max-width:900px){
      margin-bottom: 5px ;
    }
    @media screen and (max-width:310px){
        flex-wrap: wrap;
        width: 100%;
        padding-left: 0 10px;
    }

  }
  &.enPuerto{
    @media screen and (max-width:460px){
        flex-wrap: wrap;
        width: 100%;
        padding-left: 0 10px;
    }
    @media screen and (max-width:850px){
      margin-bottom: 5px;
    }

  }
  &.almacen{
    margin-right: 5px;
    @media screen and (max-width:480px){
      flex-wrap: wrap;
      margin-bottom: 5px;
      
    }
  }
  &.import{
    margin-right: 5px;
  }

  @media screen and (max-width:200px) {
      flex-wrap: wrap;
      
    }
`;

const Radio = styled.input`
  display: none;
`;

const Label = styled.label`
  color: #bebbbb;
  background-color: ${theme.azulTransparente2};
  padding: 5px 10px 5px 40px;
  display: inline-block;
  position: relative;
  font-size: 0.9em;
  border-radius: 3px;
  cursor: pointer;
  -webkit-transition: all 0.3s ease;
  -o-transition:all 0.3s ease ;
  transition: all 0.3s ease;
  /* margin: 5px 0px; */
  margin-right: 2px;
  font-weight: 2000;
  &:hover{
  background-color: ${theme.hover1};
  }
  &::before{
  content: "";
  width: 17px;
  height: 17px;
  display: inline-block;
  background-color: none;
  border: 3px solid ${theme.azulBorde};
  border-radius: 50%;
  position: absolute;
  left: 17px;
  top: 5px;
  }
  ${Radio}:checked + && {
  background-color: ${theme.azul3};
  padding: 5px 5px;
  border-radius: 2px;
  color: #fff;
  }
  ${Radio}:checked + &&::before{
  display: none;
  }
  `;
const CajaBlanco=styled.div`

`;
const ContenedorInputTextMenuDesplegable=styled.div`
  display: flex;

  
  &.articulo{
    @media screen and (max-width:860px){
        width: 49%;
        flex-direction: column;
    }
    @media screen and (max-width:700px){
        width: 50%;
    }
    @media screen and (max-width:680px){
        width: 60%;
    }
    @media screen and (max-width:620px){
        width: 100%;
        flex-direction: row;
    }
    @media screen and (max-width:390px){
        width: 100%;
        flex-direction: column;
        padding-left: 10px;
    }
  }
  &.contenedores{
    @media screen and (max-width:820px) {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
  &.enPuerto{
    /* @media screen and (max-width:820px) { */
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    /* } */
  }
  &.almacen{
    @media screen and (max-width:720px) {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }
  margin-right: 5px;
 

`;

const ContenedorBuscar=styled.div`
  /* width: 95%; */
  /* padding: 4px; */
  /* margin: auto; */
  /* margin-bottom: 5px; */

  background-color: ${theme.azulOscuro1Sbetav2};
  display: inline-block;
  /* width: 280px; */
  /* margin-left: 15px; */
  border-radius: 5px;
  &.articulo{
    margin-right: 5px;
    @media screen and (max-width:860px){
      margin-bottom: 5px;
    }
    @media screen and (max-width:630px){
      /* margin-left: 5px; */
      display: flex;
    }
    @media screen and (max-width:500px){
      flex-direction: column;
    }
    @media screen and (max-width:500px){
      margin-left: 0px;
      flex-direction: column;
      padding: 0;
    }
  }
  &.enPuerto{
    display: flex;
    flex-direction: row;
  }
  &.transito{
    display: flex;
    flex-direction: row;
  }
  &.almacen{
    display: flex;
    margin-left: 5px;
    /* width: 200px; */
    /* margin-bottom: 5px; */
  }
  &.contenedores{
    @media screen and (max-width:820px){
      margin-bottom: 5px;
      
    }
    display: flex;
    /* margin-bottom: 5px; */
  }

`;

const TituloBuscar=styled.h2`
  color: white;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;

  color:${theme.azul1};
  @media screen and (max-width:620px) {
    font-size: 14px;
    
  }
`;

const InputBuscar=styled.input`
  border: none;
  outline: none;
  height: 25px;
  border-radius: 4px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  border: 1px solid ${theme.azul1};
  color: ${theme.azul2};
  &:focus{
    border: 1px solid ${theme.azul2};
  }
  &.articulo{
    @media screen and (max-width:950px){
      width: 150px;
      
    }
    @media screen and (max-width:850px){
      width: 200px;
      
    }
    @media screen and (max-width:760px){
      width: 180px;
      
    }
    @media screen and (max-width:390px){
      width: 90%;
    }
  } 
  &.contenedores{
    @media screen and (max-width:820px) {
      width: 200px;
    }
  }
  &.enPuertoAvanzar{
    width: 125px;
  }
`;
const MenuDesplegable=styled.select`
  outline: none;
  border: none;
  border: 1px solid ${theme.azul1};
  border-radius: 4px;
  background-color: ${theme.azulOscuro1Sbetav3};
  height: 25px;
  width: 200px;
  color: ${theme.azul2};
  &:focus{
    border: 1px solid ${theme.azul2};
  }
  &.disabled{
    background-color: inherit;
    color: inherit;
  }
    &.articulo{
      @media screen and (max-width:950px){
        width: 150px;
      }
      @media screen and (max-width:850px){
        width: 200px;
      }
      @media screen and (max-width:760px){
        width: 180px;
      }
      @media screen and (max-width:390px){
        width: 90%;
      }
    }
  &.contenedores{
    @media screen and (max-width:820px) {
      width: 200px;
    }
  }


  &.enPuerto{
    width: 150px;

  }

  &.almacen{
    width: 140px;

  }
 `;

const Opciones =styled.option`
  border: none;
  background-color: ${theme.azulOscuro1Sbetav};
 `;

