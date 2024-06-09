import {  faThumbsUp,  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import imgJeni from '../../public/img/avatares/jenifer1.png'
import imgHenryFord from '../../public/img/avatares/autoresFrases/henryFord.jpg'
import IconSend from './SVGEnviar'
// import Picker from 'emoji-picker-react';
// import Emoji from './sara'
import IconEmojiSmile from './SVGSmile'
// import { BtnGeneral } from './BtnGeneral'
import { BtnGeneralButton } from './BtnGeneralButton'


export const FrasesCelebres = () => {
    const [isEmoji, setIsEmoji]= useState(false)
    const [printEmoji, setPrintEmoji]=useState('')

    const [valorComentario, setValorComentario]=useState('')

    let probor=''
    const ramona = (emoji)=>{
         probor= probor.concat(emoji)
        // console.log(probor)
        // setPrintEmoji(probor)
        let newValorComentario = valorComentario
        console.log(newValorComentario)
        setValorComentario(newValorComentario+probor)
   
    }


    

    const handleInputComentario= (e)=>{
        // console.log(e)
        setValorComentario(e.target.value)
    }


    const [isLiked, setIsliked]= useState(false)

  return (
    <ContenedorFrasesMaster>

        <div>
            <TituloDoc>Letr4s:</TituloDoc>
        </div>
        <ArrayFrases>
            <ContenedorFrases>
                <CajaTextoLike>
                    <CajaFotoPerfil>
                        <Avatar src={imgHenryFord} className='imgAutor'/>
                    </CajaFotoPerfil>
                    <CajaTextoFrase>
                        <CajaTexto>
                            <Texto>“Si le hubiera preguntado a la gente, me habrían pedido caballos más rápidos” </Texto>
                        </CajaTexto>

                        <CajaTexto>
                            <Autor>Henry Ford</Autor>
                            
                        </CajaTexto>
                    </CajaTextoFrase>
                        <CajaManoArriba>
                            <Icono 
                                bounce={
                                    isLiked?
                                    false:
                                    true
                                }

                                icon={faThumbsUp}
                                className={isLiked?'liked':''}
                                onClick={()=>setIsliked(!isLiked)}
                            />
                            <ContadorLike>4 like</ContadorLike>
                        </CajaManoArriba>
                </CajaTextoLike>

                <CajaInterpretacion>
                    <TituloInterpretacion>Interpretacion:</TituloInterpretacion>
                    <TextoInterpretacion>El señor Henry Ford fundandor de Ford Motor, expresa que aveces nuestros clientes no saben lo que realmente quieren o peor aun no saben lo que necesitan en cuanto a innovacion.</TextoInterpretacion>
                </CajaInterpretacion>

                <CajaSocial>
                    
                    <CajaComentario>
                        <CajitaTituloComentario>
                            <TituloComentarios>Comentarios:</TituloComentarios>
                        </CajitaTituloComentario>

                        <CajaResenas>
                            <CajaResena>
                                <Avatar src={imgJeni}/>
                                <CajaTextoResena>
                                    <NombreResena>Jennifer Sanchez</NombreResena>
                                    <TextoResena>
                                        Interesante frase...
                                    </TextoResena>
                                </CajaTextoResena>
                            </CajaResena>
                            <CajaResena>
                                <Avatar src={imgJeni}/>
                                <CajaTextoResena>
                                    <NombreResena>Jennifer Sanchez</NombreResena>
                                    <TextoResena>
                                        La voy a poner de estado
                                    </TextoResena>
                                </CajaTextoResena>
                            </CajaResena>
                            <CajaResena>
                                <Avatar src={imgJeni}/>
                                <CajaTextoResena>
                                    <NombreResena>Jennifer Sanchez</NombreResena>
                                    <TextoResena>
                                        Asi es, pero algunas personas...✅😂
                                        
                                    </TextoResena>
                                    <h4>
                                            {printEmoji}
                                        </h4>
                                </CajaTextoResena>
                            </CajaResena>
                        </CajaResenas>

                        <CajaInputComentario>
                            <CajaInternaComentario>
                                <InputSencillo
                                    // type='text'
                                    placeholder='Ingrese un comentario...'
                                    value={valorComentario}
                                    onChange={(e)=>handleInputComentario(e)}
                                    />
                                    <IconEnviar
                                        onClick={() => alert('pink')}
                                        color={theme.azul2}
                                        width='32px'
                                        height='20px'
                                        
                                        // icon={IconSend}
                                    />
                                    <IconoSmiley
                                        onClick={()=> setIsEmoji(!isEmoji)}
                                    />
                            </CajaInternaComentario>
                                
                    {
                        isEmoji?
                            <Emoji
                            
                            // racando={racando}
                            ramona={ramona}
                            />
                        :
                        ''

                    }


                        </CajaInputComentario>

                    </CajaComentario>

                </CajaSocial>



            </ContenedorFrases>
           
          
        </ArrayFrases>

        <CajaAddFrase>
                    <MasFraseBtn>
                        Añadir Frase o pensamiento
                    </MasFraseBtn>
        </CajaAddFrase>

    </ContenedorFrasesMaster>
  )
}
const ContenedorFrasesMaster =styled.div`
    background-color: ${theme.azulOscuro1Sbetav3};
    /* border: 1px solid ${theme.azul2}; */
    border: 1px solid black;
    width: 75%;
    height: auto;
    /* margin-left: 25px; */
    margin: auto;
    
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 35px;
    gap: 15px;
    display: flex;
    flex-direction: column;
/* 
    background-color: ${theme.azulOscuro1Sbetav};
  background-image: radial-gradient(at 0% 0%,hsla(222,100%,11%,1) 0px,transparent 50%),radial-gradient(at 100% 100%,hsla(222,100%,11%,1) 0px,transparent 50%);
  padding: 20px; */
`
const ArrayFrases=styled.div`
     gap: 15px;
    display: flex;
    flex-direction: column;
`
const CajaFotoPerfil = styled.div``

const ContenedorFrases=styled.div`
    /* margin-bottom: 15px; */
`

const TituloDoc = styled.h2`
  color: ${theme.azul2};
  font-size: 2rem;
  border-bottom: 5px solid ;
    display: inline-block;
    width: auto;
    /* margin-bottom: 10px; */
`
const CajaTexto=styled.div`
    /* width: 97%; */
    
    /* padding-right: 15px; */
    margin-right: 5px;
`
const Texto = styled.h4`
    font-size: 1rem;
    color: ${theme.azul1};
    font-weight: lighter;
    font-style: italic;
    text-align: end;
`

const Autor=styled.p`
    font-size: 0.8rem;
    color: ${theme.azul2};
    font-weight: lighter;
    text-align: end;
    font-style: italic;
`
const CajaTextoLike = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    /* background-color: ${theme.gris2}; */
    background-color: ${theme.azulOscuro1Sbetav2};
    border: 1px solid ${theme.azul2};
    border-radius:5px;
    padding: 5px;
    width: 97%;
    margin: auto;
     margin-bottom: 5px;

`

const CajaTextoFrase=styled.div`
    /* border: 1px solid blue; */
`

const CajaSocial = styled.div`
    width: 97%;
    margin: auto;
    /* height: 40px; */
    text-align: end;
    padding: 15px;
    /* background-color: ${theme.gris2}; */
    background-color: ${theme.azulOscuro1Sbetav2};
    border: 1px solid ${theme.azul2};
    border-radius: 5px;
    /* margin-top: 10px; */

`


const CajaManoArriba = styled.div`
    border-radius: 5px;
    display: inline-block;
`

const Icono = styled(FontAwesomeIcon)`
    font-size: 2rem;
    color: white;
    cursor: pointer;
    /* &:hover{
        color: ${theme.azul2};
    } */
    &.liked{
        color: ${theme.azul2};
    }
    
`

const ContadorLike =styled.p`
    /* position: absolute;
    right: 2px;
    bottom: 2px; */
    font-size: 0.7rem;
    width: 100%;
    text-align: center;
    color: white;
    &:hover{
        cursor: pointer;
        text-decoration: underline;
    }
`

const CajaComentario=styled.div`
    /* height: 40px; */
`

const CajitaTituloComentario= styled.div`
    width: 100%;
    display: flex;
    justify-content: start;
    margin-bottom: 5px;
`

const TituloComentarios=styled.h4`
    /* text-align: start; */
    display: inline-block;
    font-weight: lighter;
    color: white;
    border-bottom: 1px solid white;
`

const CajaResenas = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  
`

const CajaResena = styled.div`
  border: 1px solid white;
  display: flex;
  border-radius: 4px;
  padding: 4px;
  background-color: #2a2727;
  background-color: ${theme.azulOscuro1Sbetav3};
    border: 1px solid ${theme.azul1};
  
`
const Avatar=styled.img`
  width: 50px;
  height: 50px;
  max-width: 100px;
  border: 3px solid ${theme.azulClaro1Svetav};
  border-radius: 50%;
  &.imgAutor{
    width: 80px;
    height: 80px;
  }
  
`
const CajaTextoResena= styled.div`
  display:flex;
  width: 100%;
  padding-left: 10px;
  flex-direction: column;
  justify-content: center;
`


const NombreResena=styled.h2`
  /* color: #fff; */
  color: ${theme.azul2};
  font-size: 1rem;
  text-align: start;
  
`
const TextoResena=styled.p`
  color: #fff;
  color: ${theme.azul1};
  text-align: start;
`


const CajaInputComentario = styled.div`
   
    width: 100%;
    background-color: ${theme.fondo};
    border: 1px solid black;
    border-radius: 5px;
    /* min-height: 55px; */
    

`


const InputSencillo = styled.input`
   background-color: transparent;
  color: white;
  min-width:150px;
  padding: 5px;
  height: 1.9rem;
  font-size: 0.9rem;
  
  text-align: start;
  align-items:center;
  outline: none;
  border: none;
  width: 100%;
  min-height: 35px;
  border-bottom: 1px solid black;
`
const CajaInternaComentario = styled.div`
    position: relative;
    width: 100%;
`
const IconoSmiley = styled(IconEmojiSmile)`
    display: inline-block;
    color: white;
    position: absolute;
    width: 30px;
    height: 30px;
    top: 50%;
    transform: translate(0,-50%);
    right: 35px;
    border-radius: 50%;
    padding: 4px;
    &:hover{
        background-color: gray;
        cursor: pointer;
    }
`
const IconEnviar = styled(IconSend)`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 4px;
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    right: 0;
    &:hover{
        background-color: gray;
        cursor: pointer;
    }
`

const CajaAddFrase = styled.div`
    width: 97%;
    /* height: 40px; */
    display: flex;
    justify-content: center;
    margin: auto;
    background-color: ${theme.gris2};
    border-radius: 5px;
`

const MasFraseBtn = styled( BtnGeneralButton)`
    font-size: 1rem;
    width: auto;
    height: 35px;
    text-align: center;
`

const CajaInterpretacion = styled.div`
    /* background-color: red; */
    margin-bottom: 10px;
`
const TituloInterpretacion=styled.h2`
    border-bottom: 1px solid black;
`
const TextoInterpretacion=styled.p`
    color: ${theme.azul1};
`