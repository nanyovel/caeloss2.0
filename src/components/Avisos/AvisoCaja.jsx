import styled from 'styled-components'
import theme from '../../../theme'
import { BtnGeneralButton } from '../BtnGeneralButton'

export const AvisoCaja = ({
  titulo,
  texto,
  textoCTA,
  funcionCTA,
  textoCTA2,
  funcionCTA2,
}) => {
  return (
    <CajaAviso>
      <TituloAviso className='subtitulo'>{titulo}</TituloAviso>
        <CajaTexto>
                <CajaTextoPunto>
                {texto}
              </CajaTextoPunto>
              {
                textoCTA&&
                <CajaCTAs>
                  <BtnCTA
                    onClick={()=>funcionCTA()}
                  >{textoCTA}</BtnCTA>
                  {
                    textoCTA2&&
                    <BtnCTA
                    onClick={()=>funcionCTA2()}
                  >{textoCTA2}</BtnCTA>}
                </CajaCTAs>

              }
            
        </CajaTexto>
        </CajaAviso>
  )
}


const CajaAviso=styled.div`
  width: 90%;
  margin: auto;
  background-color: #000b1a;
  border: 1px solid ${theme.azul2};
  border-radius: 15px 0 15px 0;
  padding: 20px;
  margin-bottom: 55px;
`

const TituloAviso=styled.h2`
  color: ${theme.azul2};
  border-bottom: 1px solid ${theme.azul2};
  
  &.subtitulo{
    font-size: 1.5rem;
    border-bottom: none;
    color: ${theme.warning};
    width: 100%;
    text-align: center;
  }

`


const CajaTexto =styled.div`
  border: 1px solid ${theme.warning};
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  -webkit-box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  -moz-box-shadow: 2px 2px 5px 0px rgba(255, 184, 5, 0.75);
  
`
const CajaTextoPunto=styled.div`
  color: ${theme.azul1};
  /* border: 1px solid red; */
  padding-left: 20px;

`
const CajaCTAs=styled.div`
  display: flex;
  justify-content: center;
`
const BtnCTA=styled(BtnGeneralButton)`
  width: auto;
  font-size: 0.9rem; 
`