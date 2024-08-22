import {useEffect, useRef} from 'react';
import { styled } from 'styled-components';
import theme from '../../config/theme.jsx';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';

export const EntradaDatos = ({
  hab,
  setHab,
  datos,
  setDatos,
  objetoOriginal,
  parametroA,
  shortHandOpciones,
  parametroB,
  setAlertaTamanoPlafon,
  copiarPortaPapeles,
  inputFocusAncho,
  inputFocusArea,
  perimetroInputIsDisabled,
  isPisos
}) => {
  const handleInput = (e, index)=>{
    let depositEvent = parseInt(e.nativeEvent.data);
    if(depositEvent>=0){
      setAlertaTamanoPlafon(false);
      // if(parametroB){

      if(parametroB==undefined){
        setAlertaTamanoPlafon(true);
        setTimeout(() => {
          setAlertaTamanoPlafon(false);
        }, 3000);
        return('');
      }
      // }
    }
    let afectar;
    switch (e.target.name) {
    case 'ancho':
      afectar = 'ancho';
      break;
    case 'largo':
      afectar = 'largo';
      break;
    case 'puertas':
      afectar = 'puertas';
      break;
    case 'area':
      afectar = 'area';
      break;
    case 'perimetro':
      afectar = 'perimetro';
      break;
    default:
      break;
    }
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
    if(parametroA==1){
      resultado= resultado*0.3048;
    }

    else if(parametroA==3){
      if(afectar==='area'){
        resultado= resultado*0.0929;
      }
      if(afectar==='perimetro'){
        resultado= resultado*0.3048;
      }
    }
    setDatos(datos.map((item, itemIndex)=>{
      if(itemIndex===index){
        return{...datos[itemIndex], [afectar]: resultado};
      }
      return item;
    }));

  };

  let modalidad;

  if(parametroA===0||parametroA===1){
    modalidad='distanciaLineal';
  }
  else if(parametroA===2||parametroA===3){
    modalidad='areaCuadrada';
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
            puertas:'',
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
    case 69:
      shortHandOpciones[0].opcionMetros2.current.click();
      inputFocusArea.current.focus();
      break;
    case 82:
      shortHandOpciones[0].opcionPies2.current.click();
      inputFocusArea.current.focus();
      break;

    case 65:
      shortHandOpciones[1].opcion2x4.current.click();
      break;
    case 83:
      shortHandOpciones[1].opcion2x4a2x2.current.click();
      break;
    case 68:
      shortHandOpciones[1].opcion2x2.current.click();
      break;
    default:
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
            <CajaEncabezadosCalcular className={`${isPisos==true?'esPisos':''}`}>
              <EnzabezadoCalcular>Ancho</EnzabezadoCalcular>
              <EnzabezadoCalcular>Largo</EnzabezadoCalcular>
              {
                isPisos?
                  <EnzabezadoCalcular>Puetas</EnzabezadoCalcular>
                  :
                  ''
              }
              <EnzabezadoCalcular>Area²</EnzabezadoCalcular>
              <EnzabezadoCalcular>Perímetro</EnzabezadoCalcular>
            </CajaEncabezadosCalcular>
            <ContenedoraHab>
              {/* <CajaEntradaDatos > */}
              {
                hab.map((object, index) => {
                  let inputRefAncho = null;
                  let inputRefArea = null;
                  if(index===0){
                    inputRefAncho = inputFocusAncho;
                    inputRefArea =inputFocusArea;
                  }

                  return (
                    <CajaEntradaDatos key={index + "dataInput"} className={`${isPisos==true?'esPisos':''}`}>
                      <Input
                        name='ancho'
                        placeholder='0'
                        type='text'
                        className={`${modalidad==='distanciaLineal'?'cajaActiva':'cajaInactiva'}`}
                        disabled={modalidad==='distanciaLineal'?false:true}
                        ref={inputRefAncho}
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

                      {
                        isPisos?
                          <Input
                            name='puertas'
                            placeholder='0'
                            type='text'
                            className={`cajaActiva`}
                            // disabled={modalidad==='distanciaLineal'?true:''}
                            ref={inputRefArea}
                            value={hab[index].puertas}
                            onChange={(e) =>handleInput(e, index)}
                          />
                          :
                          ''

                      }

                      <Input
                        name='area'
                        placeholder='0'
                        type='text'
                        className={`${modalidad==='distanciaLineal'?'cajaInactiva':'cajaActiva'}`}
                        disabled={modalidad==='distanciaLineal'?true:''}
                        ref={inputRefArea}
                        value={modalidad==='distanciaLineal'?hab[index].ancho&&hab[index].largo? ((Number(hab[index].ancho) * (Number(hab[index].largo))).toFixed(2)) +(parametroA==0?' M²':' P²'):(parametroA==0?'0.00 M²':'0.00 P²'):hab[index].area}
                        onChange={(e) =>handleInput(e, index)}
                      />
                      {
                        perimetroInputIsDisabled==true?
                          <Input
                            name='perimetro'
                            placeholder='0'
                            type='text'
                            className={`cajaInactiva`}
                            disabled={true}
                            // value={hab[index].ancho&&hab[index].largo?  (((Number(hab[index].ancho) + (Number(hab[index].largo)))*2).toFixed(2)) +' ML':'0.00 ML'}
                            value={modalidad==='distanciaLineal'?hab[index].ancho&&hab[index].largo? (((Number(hab[index].ancho) + (Number(hab[index].largo)))*2).toFixed(2)) +(parametroA==0?' ML':' PL'):(parametroA==0?'0.00 ML':'0.00 PL'):hab[index].perimetro}
                            onChange={(e) =>handleInput(e, index)}
                          />
                          :
                          <Input
                            name='perimetro'
                            placeholder='0'
                            type='text'
                            className={`${modalidad==='distanciaLineal'?'cajaInactiva':'cajaActiva'} `}
                            disabled={modalidad==='distanciaLineal'?true:''}
                            // value={hab[index].ancho&&hab[index].largo?  (((Number(hab[index].ancho) + (Number(hab[index].largo)))*2).toFixed(2)) +' ML':'0.00 ML'}
                            value={modalidad==='distanciaLineal'?hab[index].ancho&&hab[index].largo? (((Number(hab[index].ancho) + (Number(hab[index].largo)))*2).toFixed(2)) +(parametroA==0?' ML':' PL'):(parametroA==0?'0.00 ML':'0.00 PL'):hab[index].perimetro}
                            onChange={(e) =>handleInput(e, index)}
                          />
                      }

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
                title="Tecla Enter"
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
  border: 1px solid red;
`;

const ContainerInputsMasBtnCalcular=styled.form`
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 5px;
  width: 100%;
  min-height: auto;
  margin-bottom: 10px;
  border: 1px solid red;

`;

const CajaInputsForm=styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  align-content: flex-end;
  background-color:${theme.azulOscuro1Sbetav};
  border: 1px solid ${theme.azul2};
  border-radius: 10px;
  padding: 5px;
  /* background-color: red; */
  border: 1px solid red;
`;

const CajaEncabezadosCalcular = styled.div`
  width: 100%;
  /* display: flex; */
  /* justify-content: center; */
  margin-bottom: 2px;
  /* border: 1px solid black; */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  /* gap: 5px; */
  &.esPisos{
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
 
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
  grid-template-columns: 1fr 1fr 1fr 1fr ;
  gap: 3px;
  &.esPisos{
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }


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
    background-color:${theme.azulOscuro1Sbetav3} ;
    color: ${theme.azul2};
    /* border:1px solid ${theme.azul1}; */
}

   
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
const BtnAddRed =styled(BtnGeneralButton)`
  height: auto;
  
`;
const BtnCopiar = styled(BtnGeneralButton)`
  font-size: 1rem;
`;

const ContenedoraHab = styled.div`
`;