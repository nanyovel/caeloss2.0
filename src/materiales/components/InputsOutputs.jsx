import styled from 'styled-components';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import theme from '../../config/theme.jsx';

export const InputsOutputs = ({
  sumarRestarHab,
  handleInputs,
  entradaMaster,
  tablaMat,
  tablaResult,
  arrayOpcionesUnidadMedida,
  copiarPortaPapeles,
  primerInputRef,
  inputAreaRef,
  comprimir,
  width,
  sinAreaCuadrada,
}) => {

  return (

    <>
      <SeccionInputs>
        <CajaInputsForm>
          <CajaTablaEntrada>
            <CajaControles>
              <BtnSimple
                onClick={(e)=>sumarRestarHab(e)}
                name='sumar'
              >
                        +</BtnSimple>
              <BtnSimple
                onClick={(e)=>sumarRestarHab(e)}
                name='restar'
              >-</BtnSimple>
              {
                width>600&&
                          <BtnSimple
                            onClick={()=>copiarPortaPapeles()}
                          >
                          Copiar</BtnSimple>
              }
            </CajaControles>

            <Tabla className='tablaEntrada'>
              <thead>
                <Filas>
                  <CeldaHead>N°</CeldaHead>
                  {
                    entradaMaster[0]?.map((input,index)=>{
                      return(
                        <CeldaHead key={index} name={input.nombre}>
                          {`${input.nombre.charAt(0).toUpperCase() + input.nombre.slice(1)} ${input.nombre=='area'?'²':''}`}
                        </CeldaHead>
                      );
                    })
                  }
                </Filas>
              </thead>
              <tbody>
                {
                  entradaMaster.map((hab,index)=>{
                    return(
                      <Filas key={index}>
                        <CeldasBody> {'D'+(index+1)}</CeldasBody>
                        {
                          hab.map((input,i)=>{
                            let ancho=Number(hab[0].valor);
                            let largo=Number(hab[1].valor);
                            let area=0;
                            let perimetro=0;

                            if(ancho>0&&largo>0){
                              area=ancho*largo;
                              perimetro=(ancho+largo)*2;
                            }
                            return(
                              <CeldasBody key={i}>
                                <InputCelda
                                  type={
                                    arrayOpcionesUnidadMedida[0].select||
                                            arrayOpcionesUnidadMedida[1].select
                                      ?
                                      (
                                        width<550&&
                                            input.nombre!=='area'&&
                                            input.nombre!=='perimetro'
                                          ?
                                          'number':'text')
                                      :
                                      arrayOpcionesUnidadMedida[2].select||
                                            arrayOpcionesUnidadMedida[3].select
                                        ?
                                        (
                                          width<550&&
                                              input.nombre!=='ancho'&&
                                              input.nombre!=='largo'
                                            ?
                                            'number'
                                            :
                                            'text')
                                        :
                                        ''
                                  }
                                  ref={
                                    index==0?
                                      (
                                        input.nombre=='ancho'?
                                          primerInputRef
                                          :
                                          input.nombre=='area'?
                                            inputAreaRef
                                            :
                                            null

                                      ):
                                      null}
                                  name={input.nombre}
                                  value={input.inactivo==false?
                                    input.valor
                                    :
                                    (input.nombre=='area'&&area>0?(area.toFixed(2)+
                                            (
                                              arrayOpcionesUnidadMedida[0].select==true?' M²'
                                                :
                                                arrayOpcionesUnidadMedida[1].select==true?' P²'
                                                  :
                                                  (
                                                    sinAreaCuadrada?
                                                      (arrayOpcionesUnidadMedida[2].select==true?' In²':'')
                                                      :
                                                      (arrayOpcionesUnidadMedida[4].select==true?' In²':'')

                                                  )

                                            ))
                                      :
                                      (
                                        input.nombre=='perimetro'&&perimetro>0?(perimetro.toFixed(2)+
                                            (
                                              arrayOpcionesUnidadMedida[0].select==true?' ML'
                                                :
                                                arrayOpcionesUnidadMedida[1].select==true?' PL'
                                                  :
                                                  (
                                                    sinAreaCuadrada?
                                                      (arrayOpcionesUnidadMedida[2].select==true?' InL':'')
                                                      :
                                                      (arrayOpcionesUnidadMedida[4].select==true?' InL':'')

                                                  )
                                            )):''))}
                                  data-id={index}
                                  data-numerador={input.numerador}
                                  onChange={(e)=>handleInputs(e)}
                                  autoComplete='off'
                                  disabled={input.inactivo}
                                  className={`
                                            ${input.inactivo?'inactivo':''} 
                                            ${input.nombre=='perimetro'&&hab[i-1].valor>0&&hab[i].valor==''?
                                'vacio'
                                :
                                ''
                              }
                                            
                                          `}
                                />
                              </CeldasBody>
                            );
                          })
                        }

                      </Filas>
                    );
                  })
                }

              </tbody>
            </Tabla>

          </CajaTablaEntrada>
        </CajaInputsForm>
      </SeccionInputs>
      <SeccionSalida>
        <CajaTablaSalida className={width<550?'mobil':''}>
          <CajaTablaResult>
            <Tabla className='tablaMat'>
              <tbody>
                <Filas>
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Codigo</CeldaHead>
                  <CeldaHead>Descripcion</CeldaHead>
                  <CeldaHead>Total</CeldaHead>
                </Filas>
              </tbody>
              <tbody>
                {
                  tablaMat.map((mat,index)=>{
                    return(
                      <Filas key={index} className={mat.desactivado!=true?'':'desactivado'}>
                        <CeldasBody className={comprimir==true?'comprimir':''}>{index+1}</CeldasBody>
                        <CeldasBody className={comprimir==true?'comprimir':''}>{mat.desactivado!=true?mat.codigo:'-'}</CeldasBody>
                        <CeldasBody title={mat.descripcion} className={`descripcion ${comprimir==true?'comprimir':''}`}>{mat.descripcion}</CeldasBody>
                        <CeldasBody className={comprimir==true?'comprimir':''}>{mat.desactivado!=true?(mat.qtyTotal>0?mat.qtyTotal:''):'-'}</CeldasBody>
                      </Filas>
                    );
                  })
                }
              </tbody>
            </Tabla>
          </CajaTablaResult>
          <CajaTablaResult className={`tablaResult ${width<550?' mobil':''}`}>

            <Tabla className={`tablaResult ${width<550?' mobil':''}`}>
              <thead>
                <Filas >
                  {
                    tablaResult[0]?.map((mat,index)=>{
                      return(
                        <CeldaHead key={index}>{'D'+(index+1)}</CeldaHead>
                      );
                    })
                  }
                </Filas>
              </thead>
              <tbody>
                {
                  tablaResult.map((fila,index)=>{
                    return(
                      <Filas key={index} >
                        {
                          fila.map((celda,i)=>{
                            return(
                              <CeldasBody key={i}
                                className=
                                  {`${celda.desactivado!=true?'':'desactivado'}
                              ${celda.global!=true?'':'desactivado'}
                              ${comprimir==true?'comprimir':''}
                              `}
                              >
                                {
                                  celda.global==true?'-':
                                    (celda.desactivado!=true?(celda.qty>0?celda.qty:''):'-')
                                }
                              </CeldasBody>
                            );
                          })
                        }

                      </Filas>
                    );
                  })
                }
              </tbody>
            </Tabla>

          </CajaTablaResult>
        </CajaTablaSalida>
      </SeccionSalida>
    </>
  );
};
const SeccionInputs=styled.section`
  margin-bottom:10px;
  display: flex;
  justify-content: center;
`;
const CajaInputsForm=styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  background-color:${theme.azulOscuro1Sbetav};
  border: 1px solid ${theme.azul2};
  border-radius: 10px;
  /* padding: 5px; */
  @media screen and (max-width:700px){
    width: 90%;
  }

`;

const CajaTablaEntrada=styled.div`
`;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  max-width: 95%;
  margin-bottom: 40px;
  &.tablaResult, &.tablaMat{
    background-color: ${theme.contenedorPrincipal};
    /* margin-bottom: 200px; */
  }
  &.mobil{
    overflow-x: scroll;
  }


  &.tablaEntrada{
  }
  `;
const CajaTablaResult=styled.div`
       /* overflow-x: hidden; */

     &.tablaResult{
        overflow-x: scroll;
        *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        height: 5px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
        /* width: 100px; */
  }
     &.mobil{
        overflow-x: scroll;
        /* width: 100px; */
  }
  `;

const Filas =styled.tr`
  &.body{
    
    font-weight: lighter;
    border-bottom: 1px solid #49444457;
    border: none;
    background-color: ${theme.azul5Osc};
  
  }
  /* &.descripcion{
    text-align: start;
    width: 10px;
    max-width: 15px;
  } */
  &.desactivado{
      background-color: ${theme.fondo};
      color:black;
    }


  color: ${theme.textoBlancoEdtem};
`;
const CeldaHead= styled.th`
   border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  background-color: ${theme.azulOscuro1Sbetav};
  color:${theme.textoBlancoEdtem};
  font-weight  :100 ;
  
  font-size: 0.9rem;
  &.descripcion{
    text-align: start;
    width: 10px;
    max-width: 15px;
  }
  &.qty{
    width: 25px;
    max-width: 35px;
  }
  @media screen and (max-width: 300px){
    /* max-width: ; */
    font-size: 0.7rem;
  }

`;
const CeldasBody = styled.td`
    font-size: 0.9rem;
    border: 1px solid black;
    height: 25px;
    &.clicKeable{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
    text-align: center;
    &.descripcion{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 150px;
    }
   
    &.desactivado{
    background-color: ${theme.fondo};
    color: black;
  }
  &.comprimir{
    height: 22px;
  }

  @media screen and (max-width: 400px) {
    &.descripcion{
      max-width: 40px;
      font-size: 0.7rem;
    }
    
  }
`;

const InputCelda=styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  &.filaSelected{
    background-color: inherit;
  }
  border: none;
  color: ${theme.azul2};
  width: 100%;
  display: flex;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  &.inactivo{
    background-color: ${theme.fondo};
  }
  &.vacio{
    background-color: ${theme.danger};
  }

  
`;

const CajaControles=styled.div`
    display: flex;
    justify-content: center;
`;
const BtnSimple=styled(BtnGeneralButton)`
    width: 20%;
    font-size: 0.8rem;
    &:focus{
      background-color: ${theme.azul1};
    }
`;

const SeccionSalida=styled.section`
`;
const CajaTablaSalida=styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  &.mobil{
    justify-content: start;
  }
`;