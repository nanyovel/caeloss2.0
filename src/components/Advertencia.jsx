import React from 'react'
import { styled } from 'styled-components';
import theme from '../../theme';
import { BtnNormal } from './BtnNormal';

export const Advertencia = ({
    tipo, 
    mensaje,
    dispatchAdvertencia,
    setDispatchAdvertencia,
    // Setting Function
    functAEjecutar,
    eventFunction,
    function1,
    function2,
}) => {

const ejecucion=(e)=>{
    if(functAEjecutar=='eliminarFila'){
        function1(eventFunction)
        setDispatchAdvertencia(false)
    }
    else if(functAEjecutar=='eliminarDoc'){
        function2(eventFunction)
        setDispatchAdvertencia(false)
    }
}
    
    return (
        <>  {
            dispatchAdvertencia &&
            <ContenedorAdvertencia >
                <CajaContenido className={tipo}>
                    <Texto>{mensaje}  </Texto>
                    <div>
                        <BtnNormal
                            className='normal'
                            onClick={(e)=>ejecucion(e)}
                        >
                            Aceptar
                        </BtnNormal>

                        <BtnNormal
                            className='danger'
                            onClick={()=>setDispatchAdvertencia(false)}
                        >
                            Cancelar
                        </BtnNormal>
                    </div>
                </CajaContenido>
            </ContenedorAdvertencia>
            }
        </>
  )
}

const ContenedorAdvertencia=styled.div`
    width: 100%;
    height: 100vh;
    background-color: #000000af;
    backdrop-filter: blur(1px);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`
const CajaContenido=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.31rem; /* 5px */
    box-shadow: 0px 0px 15px rgba(0,0,0,.1);

    &.error{
    background: ${theme.danger};
    }
    &.warning{
    background: ${theme.warning};
    color: #000;
    }
    &.success{
    background: ${theme.success};
    }
    &.info{
    background: ${theme.info};
    }
`

const Texto=styled.p`
    /* background: ${theme.warning}; */
    color: inherit;
    padding: 1.25rem 2.5rem; /* 20px 40px */
    box-shadow: 0px 0px 15px rgba(0,0,0,.1);
    text-align: center;
    display: flex;
    flex-direction: column;

    /* &.error{
    background: ${theme.danger};
    }
    &.warning{
    background: ${theme.warning};
    color: #000;
    }
    &.success{
    background: ${theme.success};
    }
    &.info{
    background: ${theme.info};
    } */

`
