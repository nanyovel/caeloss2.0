import { styled } from 'styled-components'
import theme from '../../theme'
import imgArrow2 from './../importaciones/img/arrowRight2.png'

export const OpcionUnica = ({
  titulo,
  name,
  arrayOpciones,
  handleOpciones,
  tipo,
  selectScreen,
  dosMobil,
  width,
  flete,
  masPeque,
  marginRight
}) => {
  
  return (
    <ContenedorParametro 
      className={`
        ${dosMobil?' dosMobil ':''}
        ${width<550&&flete?' flete ':''}
        ${width>550&&flete?' masPeque ':''}
        ${marginRight?' marginRight ':''}
      `}
      >
      {
        titulo?
          <div>
            <TituloParametro
              className={
                tipo=='ciclo'&&
                arrayOpciones[0].select==true?
                'final'
                :
                tipo=='ciclo'&&
                arrayOpciones[1].select==true?
                'final'
                :
                ''
              }
              >{titulo}</TituloParametro>
          </div>
        :
        ''
      }
      <CajaParametro  
        className={`
          ${tipo=='ciclo'?' step ':''}
          ${width<550&&flete?' flete ':''}
         
        
        `}>
        {tipo!='ciclo'&&
        
          arrayOpciones.map((opcion, index)=>{
              return(
                <CajaBlanco key={`${index}`}>
                  <Radio 
                    className='inputRed' 
                    type="radio" 
                    name={name} 
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
                </CajaBlanco>
                )
          })
        }
     
            {
              tipo=='ciclo'&&
              arrayOpciones.map((step,index)=>{
                return(
                  <CajitaStep key={index}>
                    <CajaStep 
                      data-id={index} 
                      onClick={(e)=>selectScreen(e)}
                    >
                      <Imagen
                        src={step.img}
                        data-id={index} 
                        title={step.title}
                        className={step.select==true?'selected':''}
                      />
                        <TextoStep 
                          className={step.select==true?'visible':''}
                          data-id={index} 
                          >
                          {step.nombre}
                        </TextoStep>
                     
                    </CajaStep>
                    <ImagenFlecha src={imgArrow2} />

                  </CajitaStep>
                )
              })
            }
       
            </CajaParametro>
    </ContenedorParametro>
  )
}





  const TituloParametro=styled.h2`
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
    color: #fff;
    margin-bottom: 8px;
    /* margin-left: 20px; */
    border-bottom: 1px solid #fff;
    white-space: nowrap;
    &.final{
      margin-left: 100%;
    transform: translate(-100%);

    }
    transform: ease 0.2s;
  `


const Radio = styled.input`
display: none;
`

const Label = styled.label`
  color: #bebbbb;
  background-color: ${theme.azulTransparente2};
  padding: 5px 10px 5px 30px;
  display: inline-block;
  position: relative;
  font-size: 0.9em;
  border-radius: 3px;
  cursor: pointer;
  -webkit-transition: all 0.3s ease;
  -o-transition:all 0.3s ease ;
  transition: all 0.3s ease;
  margin: 5px 0px;
  margin-right: 2px;
  font-weight: 2000;
  @media screen and (max-width: 394px){
    padding: 5px 10px 5px 25px;
   
    /* top: 4px; */
  }
  @media screen and (max-width: 360px){
    padding: 5px 10px 5px 20px;
   
    /* top: 4px; */
  }
  @media screen and (max-width: 340px){
    padding: 5px 5px 5px 20px;
   
    /* top: 4px; */
  }

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
  left: 5px;
  top: 5px;


  @media screen and (max-width: 380px){
    /* top: 4px; */
  }
  @media screen and (max-width: 360px){
    width: 14px;
    height: 14px;

    /* left: 14px; */
    top: 7px;
  }
  @media screen and (max-width: 340px){
    /* width: 10px; */
    /* height: 10px; */
    /* left: 10px; */
  }
  @media screen and (max-width: 320px){
    width: 8px;
    height: 8px;
    left: 8px;
  }

}
${Radio}:checked + && {
   background-color: ${theme.azul3};
   padding: 5px 5px;
  border-radius: 2px;
  color: #fff;
  /* @media screen and (max-width: 360px){

    padding: 4px  4px;
  } */
  @media screen and (max-width: 340px){
    /* padding: 3px  3px; */
  }
  @media screen and (max-width: 320px){
    padding: 2px  2px;
  }

}
${Radio}:checked + &&::before{
   display: none;
}
  @media screen and (max-width: 500px){
    white-space: nowrap;
    /* width: 300px; */
    /* min-width: 100px; */
    /* word-wrap:; */
  }

  @media screen and (max-width: 385px){
    /* font-size: 12px; */
    /* font-weight: normal; */
  }

  /* @media screen and (max-width: 340px){
    padding: 3px 7px 3px 30px;
  } */
  @media screen and (max-width: 320px){
    padding: 2px 5px 2px 20px;
  }

`
const CajaBlanco=styled.div`
`

const ContenedorParametro= styled.div`

  /* max-width: 1000px; */
  border: 1px solid transparent;
  border-bottom: 1px solid #fff;
  justify-content: start;
  align-items: start;
  flex-direction: column;
  display: flex;
  /* width: 45%; */
  &.marginRight{
    /* width: auto; */
    margin-right: 45px;
  }
  &.bottomOf{
    border-bottom: none;
  }
  &.error{
    border: 1px solid ${theme.danger};
    border-radius: 5px;
  }
  &.dosMobil{
    margin: 0;
  }
  &.flete{
    width: 90%;

  }
  &.masPeque{
    width: 30%;
  }
  @media screen and (max-width: 319px){
    flex-direction: column;
    /* width: 70%; */
    
  }
  @media screen and (max-width: 620px){
    width: 90%;
    
  }
  @media screen and (max-width: 520px){
    width: 100%;
    
  }

  
`

const CajaParametro = styled.div`
  display: flex;
  &.step{
    justify-content: space-between;
    row-gap: 40px;
  }
  &.flete{
    flex-wrap: wrap;
    width: 100%;
  }
  justify-content: start;
  @media screen and (max-width: 319px){
    flex-direction: column;
    /* row-gap: 40px; */
    flex-wrap: wrap;
    /* width: 100%; */
  }

  &.step{
    @media screen and (max-width: 500px){
      row-gap: 40px;
      flex-wrap: wrap;
      width: 100%;
    }
    @media screen and (max-width: 400px){
      row-gap: 20px;
    }
  }
`

const CajitaStep=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  transition: ease 0.2s;
  @media screen and (max-width:500px){
    width: 60px;
    
  }
  @media screen and (max-width:400px){
    width: 33%;
    
  }
`
const CajaStep=styled.div`
  background-color: ${theme.azulOscuro1Sbetav};
  border-radius: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 60px;
  height: 45px;
  align-items: center;
  justify-content: center;
  @media screen and (max-width:400px){
    width: 40%;
    height: 40px;
    
  }
    
`
const Imagen=styled.img`
  width: 70%; 
  transition: ease 0.2s;

  &:hover{
    width: 60px;
  }
  &.selected{
    width: 60px;
    @media screen and (max-width:400px) {
      width: 65px;
      
    }
  }

`
const ImagenFlecha=styled.img`
  width: 15px;
  height: 20px;
`
const TextoStep=styled.h2`
  font-size: 0.4rem;
  /* color: transparent; */
  white-space: nowrap;
  color: ${theme.azul2};
  transition: ease 0.2s;
  &.visible{
    font-size: 1rem;
    @media screen and (max-width:380px) {
      text-align: start;
      margin-left: 30px;
    }
  }
`
