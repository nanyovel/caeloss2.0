import {useEffect, useRef} from 'react';
import { styled } from 'styled-components';
import theme from '../../../theme';
import { BtnGeneral } from '../../components/BtnGeneral';

export const EntradaDatosMachihembrado = ({
  hab,
  setHab,
  datos,
  setDatos,
  objetoOriginal,
  parametroA,
  shortHandOpciones,
  copiarPortaPapeles,
  setUndMedida,
  inputFocusAncho,
  renderizar,
  setRenderizar,
  // functPrincipal
}) => {

  const cocinar = (index)=>{
    // let guaraguao = functPrincipal(datos[index]);
    // guaraguao.update = !guaraguao.update

    if(datos[index].direccionCorrecta==true){
      return( <>
        <line
          x1="30%"
          y1="60%"
          x2="45%"
          y2="100%"
          stroke="#33c154"
          strokeWidth="4"
          data-no-direccion={index}
          data-name='direccion'
        />
        <line
          x1="45%"
          y1="100%"
          x2="70%"
          y2="0%"
          stroke="#33c154"
          strokeWidth="4"
          data-no-direccion={index}
          data-name='direccion'
        />
      </>);

    }
    else if(datos[index].direccionCorrecta==false){
      return( <>
        <line
          x1="35%"
          y1="10%"
          x2="65%"
          y2="90%"
          stroke="#ff0019"
          strokeWidth="3"
          data-no-direccion={index}
          data-name='direccion'
        />
        <line
          x1="65%"
          y1="10%"
          x2="35%"
          y2="90%"
          stroke="#ff0019"
          strokeWidth="3"
          data-no-direccion={index}
          data-name='direccion'
        />
      </>);
    }
    else{
      return(
        <></>

      );

    }

  };

  const handleInput = (e, index)=>{

    let afectar;
    switch (e.target.name) {
    case 'ancho':
      afectar = 'ancho';
      break;
    case 'largo':
      afectar = 'largo';
      break;
    case 'area':
      afectar = 'area';
      break;
    case 'perimetro':
      afectar = 'perimetro';
      break;

    default: 'none';
      break;
    }

    if(e.target.dataset.name=='direccion'){
      let newDatos=datos;
      let newHab = hab;
      let depositIndex = Number(e.target.dataset.noDireccion);
      if(newDatos[depositIndex].direccion=='corta'){
        newDatos[depositIndex].direccion='larga';
        newHab[depositIndex].direccion='larga';
      }
      else if(newDatos[depositIndex].direccion=='larga'){
        newDatos[depositIndex].direccion='corta';
        newHab[depositIndex].direccion='corta';
      }

      setDatos(newDatos);
      setHab(newHab);
      setRenderizar(!renderizar);
    }
    else if(e.target.name=='ancho'|| e.target.name=='largo'){

      let resultado;
      let valor=e.target.value;
      // con esta expresion regular obligamos que solo acepte numero, nada de simbolo + o simbolo - o letra e,
      let expReg = /^[\d.]{0,1000}$/;
      if(expReg.test(valor)===true){
        resultado = e.target.value;
      }
      else{
        resultado=hab[index][afectar];
      }
      // Con esto permitimos que el input que se esta escribiendo pueda aceptar lo que el usuario esta escribiendo, tomando en cuenta que React trabaja de diferente forma los inputs
      setHab(hab.map((item, itemIndex) => {
        if (itemIndex === index) {
          return {...hab[itemIndex], [afectar]: resultado};
        }
        return item;
      }));

      // Aqui definimos que pasara cuando X opcion de X grupo de parametros este selecionada
      if(parametroA==0){
        setUndMedida("Mts");
      }

      if(parametroA==1){
        setUndMedida("'");
        // resultado= resultado*0.3048
      }

      setDatos(datos.map((item, itemIndex)=>{
        if(itemIndex===index){
          return{...datos[itemIndex], [afectar]: resultado};
        }
        return item;
      }));
    }
  };
  let modalidad;

  if(parametroA===0||parametroA===1){
    modalidad='distanciaLineal';
  }

  const handleCalculo =(e)=>{
    // 01-Este bloque de codigo sirve para agregar habs
    if(e.target.name==='btnSumar' && hab.length<15){
      setHab(
        [
          ...hab,
          {
            ancho:'',
            largo:'',
            direccion:'corta',
            area:'',
            perimetro:''
          }
        ]
      );
      setDatos(
        [
          ...datos,
          objetoOriginal
          ,
        ]
      );
    }
    // Este bloque de codigo sirve para eliminar habs
    else if(e.target.name==='btnRestar' && hab.length>2){

      const updateHab = [...hab];
      updateHab.splice((hab.length-1),1);
      setHab(updateHab);

      const updateDatos = [...datos];
      updateDatos.splice((datos.length-1),1);
      setDatos(updateDatos);
    }

  };
  // 03-Con esta funcion manejamos los inputs, recordemos que React trabaja de una manera diferente con los inputs,
  useEffect(() => {
    document.addEventListener('keyup',shortHands);

    return () => {
      document.removeEventListener('keyup',shortHands, false);

    };
  }, []);

  const shortHands =(e)=>{

    switch (e.keyCode) {
    case 107:
      btnMas.current.click();
      break;
    case 109:
      btnMenos.current.click();
      break;
    case 13:
      btnCopiar.current.click();
      break;

    case 81:
      shortHandOpciones[0].opcionMetros.current.click();
      inputFocusAncho.current.focus();
      break;
    case 87:
      shortHandOpciones[0].opcionPies.current.click();
      inputFocusAncho.current.focus();
      break;
    }
  };

  let btnMas = useRef();
  let btnMenos = useRef();
  let btnCopiar = useRef();
  return (
    <>

      <SeccionCalcular>
        <ContainerInputsMasBtnCalcular >
          <CajaInputsForm >
            <CajaEncabezadosCalcular >
              <EnzabezadoCalcular>Ancho</EnzabezadoCalcular>
              <EnzabezadoCalcular>Largo</EnzabezadoCalcular>
              <EnzabezadoCalcular>Direccion</EnzabezadoCalcular>
              <EnzabezadoCalcular>Area²</EnzabezadoCalcular>
              <EnzabezadoCalcular>Perímetro</EnzabezadoCalcular>
            </CajaEncabezadosCalcular>
            <ContenedoraHab>
              {/* <CajaEntradaDatos > */}
              {
                hab.map((object, index) => {
                  const inputRef = index === 0 ? inputFocusAncho : null;
                  return (
                    <CajaEntradaDatos key={index + "dataInput"}>
                      <Input
                        name='ancho'
                        placeholder='0'
                        type='text'
                        className={`${modalidad==='distanciaLineal'?'cajaActiva':'cajaInactiva'}`}
                        disabled={modalidad==='distanciaLineal'?false:true}
                        ref={inputRef}
                        value={`${modalidad==='distanciaLineal'?hab[index].ancho:'-'}`}
                        onChange={(e) =>handleInput(e, index)}
                        // className={}
                      />
                      <Input
                        name='largo'
                        placeholder='0'
                        type='text'
                        className={`${modalidad==='distanciaLineal'?'cajaActiva':'cajaInactiva'}`}
                        disabled={modalidad==='distanciaLineal'?'':true}
                        value={`${modalidad==='distanciaLineal'?hab[index].largo:'-'}`}
                        onChange={(e) =>handleInput(e, index)}
                      />
                      <CajaImgDireccion>

                        <CajaPadreDireccion
                          onClick={(e, index)=>{ handleInput(e,index);}}
                          // data-no-direccion={index}
                        >
                          {

                            hab[index].direccion=='corta'?
                              <ImagenDireccion
                                data-no-direccion={index}
                                data-name='direccion'
                                name='jojo'
                                value='verde'
                              >
                                <line
                                  data-no-direccion={index}
                                  data-name='direccion'
                                  x1="12.5%"
                                  y1="0"
                                  x2="12.5%"
                                  y2="100%"
                                  stroke="#000"
                                  strokeWidth="3"
                                />
                                <line
                                  x1="27.5%"
                                  y1="0"
                                  x2="27.5%"
                                  y2="100%"
                                  stroke="#000"
                                  strokeWidth="3"
                                  data-no-direccion={index}
                                  data-name='direccion'
                                />
                                <line
                                  x1="42.5%"
                                  y1="0"
                                  x2="42.5%"
                                  y2="100%"
                                  stroke="#000"
                                  strokeWidth="3"
                                  data-no-direccion={index}
                                  data-name='direccion'
                                />
                                <line
                                  x1="57.5%"
                                  y1="0" x2="57.5%"
                                  y2="100%"
                                  stroke="#000"
                                  strokeWidth="3"
                                  data-no-direccion={index}
                                  data-name='direccion'
                                />
                                <line
                                  x1="72.5%"
                                  y1="0"
                                  x2="72.5%"
                                  y2="100%"
                                  stroke="#000"
                                  strokeWidth="3"
                                  data-no-direccion={index}
                                  data-name='direccion'
                                />
                                <line
                                  x1="87.5%"
                                  y1="0"
                                  x2="87.5%"
                                  y2="100%"
                                  stroke="#000"
                                  strokeWidth="3"
                                  data-no-direccion={index}
                                  data-name='direccion'
                                />

                                {
                                  cocinar(index)
                                }
                              </ImagenDireccion>
                              :
                              <ImagenDireccion
                                data-no-direccion={index}
                                data-name='direccion'
                                name='jose'
                                value='verde'
                              >
                                <line
                                  data-no-direccion={index}
                                  data-name='direccion'
                                  x1="0"
                                  y1="7"
                                  x2="100%"
                                  y2="7"
                                  stroke="#000"
                                  strokeWidth="3"
                                />
                                <line
                                  data-no-direccion={index}
                                  data-name='direccion'
                                  x1="0"
                                  y1="21"
                                  x2="100%"
                                  y2="21"
                                  stroke="#000"
                                  strokeWidth="3"
                                />
                                {
                                  cocinar(index)
                                }
                              </ImagenDireccion>
                          }

                        </CajaPadreDireccion>

                      </CajaImgDireccion>

                      <Input
                        name='area'
                        placeholder='0'
                        type='text'
                        className={`${modalidad==='distanciaLineal'?'cajaInactiva':'cajaActiva'}`}
                        disabled={modalidad==='distanciaLineal'?true:''}
                        value={modalidad==='distanciaLineal'?hab[index].ancho&&hab[index].largo? ((Number(hab[index].ancho) * (Number(hab[index].largo))).toFixed(2)) +' M²':'0.00 ML':hab[index].area}
                        onChange={(e) =>handleInput(e, index)}
                      />
                      <Input
                        name='perimetro'
                        placeholder='0'
                        type='text'
                        className={`${modalidad==='distanciaLineal'?'cajaInactiva':'cajaActiva'}`}
                        disabled={modalidad==='distanciaLineal'?true:''}
                        // value={hab[index].ancho&&hab[index].largo?  (((Number(hab[index].ancho) + (Number(hab[index].largo)))*2).toFixed(2)) +' ML':'0.00 ML'}
                        value={modalidad==='distanciaLineal'?hab[index].ancho&&hab[index].largo? (((Number(hab[index].ancho) + (Number(hab[index].largo)))*2).toFixed(2)) +' ML':'0.00 ML':hab[index].perimetro}
                        onChange={(e) =>handleInput(e, index)}
                      />

                    </CajaEntradaDatos>
                  );
                })}
              {/* </CajaEntradaDatos> */}
            </ContenedoraHab>
            <CajaBtnGeneral>
              <BtnAddRed
                ref={btnMas}
                type="button"
                value="+"
                title="Tecla +"
                name='btnSumar'
                onClick={(e) => {

                  handleCalculo(e);

                }}
              />
              <BtnAddRed
                ref={btnMenos}
                type="button"
                value="-"
                title="Tecla -"
                name='btnRestar'
                onClick={(e) => {
                  handleCalculo(e);
                }}
              />

              <BtnCopiar
                ref={btnCopiar}
                type="button"
                value="Copiar"
                title="Tecla N"
                name='btnRestar'
                onClick={() => {
                  copiarPortaPapeles();
                }}
              />

            </CajaBtnGeneral>
          </CajaInputsForm>
        </ContainerInputsMasBtnCalcular>
      </SeccionCalcular>

    </>
  );
};

const SeccionCalcular=styled.section`
  margin-bottom: 20px;
`;

const ContainerInputsMasBtnCalcular=styled.form`
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 5px;
  width: 100%;
  min-height: auto;
  margin-bottom: 10px;
`;

const CajaInputsForm=styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  align-content: flex-end;
  background-color:${theme.azulTransparente};
  border: 1px solid ${theme.azul2};
  border-radius: 10px;
  padding: 5px;
`;

const CajaEncabezadosCalcular = styled.div`
  width: 100%;
  /* display: flex; */
  /* justify-content: center; */
  margin-bottom: 2px;
  /* border: 1px solid black; */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  /* gap: 5px; */
 
`;
const EnzabezadoCalcular = styled.p`
  font-size: 1rem;
  color: #fff;
  /* width: 50%; */
  text-align: center;
  font-weight: 200;
  /* border: 1px solid red; */
  
`;

const CajaEntradaDatos = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 3px;
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 3px;

`;

const Input = styled.input`
  padding: 3px;
  font-size: 1rem;
  width: 100%;
  margin-right: 5px;
  box-shadow: ${theme.boxShadow};
  color: #fff;
  outline: none;
  border: none;
  border-radius: 5px;
  border: 1px solid black;
  height: 30px;
  font-weight: lighter;
  &::-webkit-inner-spin-button{
    -webkit-appearance: none; 
    margin: 0
  }
  &::-webkit-outer-spin-button{
    -webkit-appearance: none; 
    margin: 0
  }
  &::placeholder{
  color: #5d5353
  
}


&.cajaInactiva{
    /* width: 20%; */
    width: 100%;
    font-size: 14px;
    background-color: ${theme.fondo};
    text-align: center;
}

&.cajaActiva{
    background: none;
}  

&.agia{
  background-color: transparent;
  border: 1px solid red;
  outline: none;
  /* position: relative;
  top: 0; */
  width: 10%;
  z-index: 999999999999999999999999999999;
}
`;

const CajaImgDireccion=styled.div`
    width: 100%;
    border: 1px solid black;
    border-radius: 4px;
    /* overflow: hidden; */
    height: 30px;
    background-color: #fff;
    position: relative;
    z-index:0;
`;
const ImagenDireccion=styled.svg`
    /* border: 1px solid red; */
    width: 100%;
    height: 100%;
    /* height: 40px; */
    position: absolute;
    /* left: ; */
    top: 0;
    z-index:0;
`;

const CajaBtnGeneral = styled.div`
  
  width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 3px;
    display: flex;
    flex-direction: row;
    /* border: 1px solid black; */
    
 
`;
const BtnAddRed =styled(BtnGeneral)`
  height: auto;
  
`;
const BtnCopiar = styled(BtnGeneral)`
  font-size: 1rem;
`;

const ContenedoraHab = styled.div`
`;

const CajaPadreDireccion = styled.div`
  /* border: 1px solid red; */
  height: 100%;
  width: 100%;
  background-color:#fff;
  z-index: 50000;
  border-radius: 5px;
`;

