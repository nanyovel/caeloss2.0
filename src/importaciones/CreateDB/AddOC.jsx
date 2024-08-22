import { useEffect, useRef, useState } from 'react';
import theme from '../../config/theme.jsx';
import styled from 'styled-components';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import parse from 'paste-from-excel';
import { Alerta } from '../../components/Alerta';
import { addDoc, collection, } from 'firebase/firestore';
import db from '../../firebase/firebaseConfig';
import { format, } from "date-fns";
import { es } from "date-fns/locale";
import { ModalLoading } from '../../components/ModalLoading';
// import { BotonQuery } from '../../components/BotonQuery';

export const AddOC = ({
  dbOrdenes,
}) => {

  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  // // ******************** CODIGO PARA EL HANDLE PASTE ******************** //
  // const [label, setlabel] = useState({ labels: ["N°","Codigo", "Descripcion", "Qty", "Comentarios"] });
  const label={ labels: ["N°","Codigo", "Descripcion", "Qty", "Comentarios"] };
  // const [initialValue, setInitialValue] = useState({
  const initialValue={
    inputs: [
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },
      { "N":"","Codigo": "", "Descripcion": "", "Qty":"","Comentarios":"" },

    ],
  };
  const [inputvalue, setinputvalue] = useState({...initialValue});

  // Codigo Original funciona
  // const handlePaste = (index, elm, e, i) => {
  //   return parse(e);
  // };
  const handlePaste = (index, elm, e,) => {
    return parse(e);
  };

  // const handlePaste1 = (index, elm, e, i) => {
  const handlePaste1 = (index, elm, e) => {
    setinputvalue((inputvalue) => ({
      ...inputvalue,
      inputs: inputvalue.inputs.map((item, i) =>{
        let valueParse=e.target.value;

        if(
          e.target.value=='Codigo'&&
          elm=='Codigo'
        ){
          valueParse='';
        }
        if(
          e.target.value=='Descripción del artículo'&&
          elm=='Descripcion'
        ){
          valueParse='';
        }
        if(
          e.target.value=='Cantidad'&&
          elm=='Qty'
        ){
          valueParse='';
        }
        if(
          e.target.value=='Detalles de artículo'&&
          elm=='Comentarios'
        ){
          valueParse='';
        }

        return( index === i
          ? {
            ...item,
            [elm]:
                  elm=='Qty'?
                    valueParse.replace(/,/g, '')
                    :

                    valueParse

          }
          : item);

      }
      )
    }
    ));
  };

  // Este codigo funciona sin problemas pero permite la coma en qty y el encabezado de SAP
  // const handlePaste1 = (index, elm, e, i) => {
  //   setinputvalue((inputvalue) => ({
  //     ...inputvalue,
  //     inputs: inputvalue.inputs.map((item, i) =>
  //       index === i
  //         ? {
  //             ...item,
  //             [elm]: e.target.value
  //           }
  //         : item
  //     )
  //   }
  //   ));
  // };

  // // ******************** CODIGO MASTER******************** //
  const handleInputs=(e)=>{
    const { name, value } = e.target;
    setOCEditable((prevEstadosBL) => ({
      ...prevEstadosBL,
      [name]: value,
    }));
  };

  const initialValueOrden={
    numeroDoc:'',
    proveedor:'',
    comentarios:'',
    fechaCreacion:'',
    estadoDoc:0,
    materiales:[]
  };

  const inputNumOrden=useRef(null);
  const [ocEditable, setOCEditable]=useState(initialValueOrden);

  const [isLoading,setIsLoading]=useState(false);

  const enviarObjeto=async()=>{
    let validacion={
      // -----Cabecera-----
      noExiste:true,
      numeroSinEspacios:true,
      hasNumero:true,
      hasProveedor:true,

      // -----Tabla-----
      filasCompletas:true,
      codigosSinEspacios:true,
      soloNumeros:true,
      hasUnique:true,
      hasItems:true,
    };

    // ************** VALIDACIONES CABECERA **************

    // Si el numero de orden ya existe
    dbOrdenes.map((orden)=>{
      if(orden.numeroDoc==ocEditable.numeroDoc){
        validacion.noExiste=false;
        setMensajeAlerta('El numero de orden de compra ya existe en la base de datos.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
    });
    if(ocEditable.numeroDoc.includes(' ')||ocEditable.numeroDoc.includes('\n')){
      validacion.numeroSinEspacios=false;
      setMensajeAlerta('El numero de orden de compra no puede contener espacios.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // Si no coloco numero de orden de compra
    if(ocEditable.numeroDoc==''){
      validacion.hasNumero=false;
      setMensajeAlerta('Colocar numero de orden de compra.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
    // Si no coloco proveedor
    if(ocEditable.proveedor==''){
      validacion.hasProveedor=false;
      setMensajeAlerta('Colocar nombre de proveedor.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // ************** VALIDACIONES TABLA **************

    // Mapeo a la tabla
    const itemsTabla=new Set();
    inputvalue.inputs.map((item,index)=>{
      if(
        item.Codigo!==''||
        item.Descripcion!==''||
        item.Qty!==''||
        item.Comentarios!==''
      ){
        // Si alguna fila tiene datos, pero esta incompleta
        if(
          item.Codigo==''||
          item.Descripcion==''||
          item.Qty==''
        ){
          validacion.filasCompletas=false;
          setMensajeAlerta(`Complete fila N° ${index+1} o elimine sus datos`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return'';
        }
        // Si algun item tiene letras en lugar de numero en la columna cantidad
        let expReg=/^[\d.]{0,1000}$/;
        if(expReg.test(item.Qty)==false){
          validacion.soloNumeros=false;
          setMensajeAlerta(`Cantidad incorrecta para el item de la fila N° ${index+1}.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return'';

        }
        // Si algun item tiene espacios
        if(item.Codigo.includes(' ')||item.Codigo.includes('\n')){
          validacion.codigosSinEspacios=false;
          setMensajeAlerta(`La celda codigo de la fila N° ${index+1} tiene espacios.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return'';

        }

        // Saber si algun item esta duplicado
        if(itemsTabla.has(item.Codigo)){
          validacion.hasUnique=false;
          setMensajeAlerta(`El item de la fila ${index+1} esta duplicado.`);
          setTipoAlerta('warning');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }
        else{
          itemsTabla.add(item.Codigo);
        }
      }
    });

    // Extraer Materiales filtrados, solo las filas que tengan item
    const materialesParsed=inputvalue.inputs.filter(item=>{
      if(
        item.Codigo!==''&&
        item.Descripcion!==''&&
        item.Qty!==''
      ){
        return item;
      }
    });
    // Si no existen filas completas
    if(materialesParsed.length==0){
      validacion.hasItems=false;
      setMensajeAlerta('Por favor agregar item a la tabla.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // ***** Si todo esta correcto *****
    if(
      // -----Cabecera------
      validacion.noExiste==true&&
      validacion.numeroSinEspacios==true&&
      validacion.hasNumero==true&&
      validacion.hasProveedor==true&&
      // -----Tabla------
      validacion.filasCompletas==true&&
      validacion.codigosSinEspacios==true&&
      validacion.soloNumeros==true&&
      validacion.hasUnique==true&&
      validacion.hasItems==true
    ){
      setIsLoading(true);
      // Cambiando nombre de propiedades
      const materialesNombresUp=materialesParsed.map(item=>{
        return{
          codigo:item.Codigo,
          descripcion:item.Descripcion,
          qty:item.Qty,
          comentarios:item.Comentarios,
          despachos:[],
          comentarioOrden:ocEditable.comentarios
        };
      });

      // Agregando algunos datos
      // Fecha de creacion
      const newOCEditable={
        ...ocEditable,
        fechaCreacion: format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        estadoDoc:0,
        materiales:materialesNombresUp,
      };

      try{
        await addDoc(collection(db,'ordenesCompra'),newOCEditable);
        setMensajeAlerta('Orden de compra realizada con exito.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        inputNumOrden.current.focus();
        setIsLoading(false);
      }
      catch(error){
        console.log(error);
        setMensajeAlerta('Error con la base de datos');
        setTipoAlerta('error');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        setIsLoading(false);
      }

      setOCEditable(initialValueOrden);
      setinputvalue({...initialValue});
    }
  };

  // // ***************************** SHORT HAND ******************************* //
  useEffect(() => {
    const shortHands = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        enviarObjeto(e);
      }
    };

    document.addEventListener('keyup', shortHands);

    return () => {
      document.removeEventListener('keyup', shortHands, false);
    };

  }, [initialValue, inputvalue, ocEditable, dbOrdenes, enviarObjeto]);

  return (
    <Container >
      <>
        {/* <BotonQuery
        ocEditable={ocEditable}
        inputvalue={inputvalue}
        initialValue={initialValue}
        /> */}

        <CajaEncabezado>
          <Titulo>Crear Ordenes de Compra</Titulo>
          <BtnHead
            onClick={()=>enviarObjeto()}
          >
            <Icono
              icon={faPaperPlane}
            />
          Enviar</BtnHead>

        </CajaEncabezado>
        <CajaDatosCabecera>
          <CajitaDatosCabecera>
            <TextoLabel>
            Numero:
            </TextoLabel>
            <Input
              type='text'
              name='numeroDoc'
              value={ocEditable.numeroDoc}
              ref={inputNumOrden}
              onChange={(e)=>{handleInputs(e);}}
            />
          </CajitaDatosCabecera>
          <CajitaDatosCabecera>
            <TextoLabel>
            Proveedor:
            </TextoLabel>
            <Input
              type='text'
              name='proveedor'
              value={ocEditable.proveedor}
              onChange={(e)=>{handleInputs(e);}}
            />
          </CajitaDatosCabecera>
          <CajitaDatosCabecera>
            <TextoLabel>
            Comentarios:
            </TextoLabel>
            <TextArea
              type='textarea'
              name='comentarios'
              value={ocEditable.comentarios}
              onChange={(e)=>{handleInputs(e);}}
            />
          </CajitaDatosCabecera>
        </CajaDatosCabecera>

        <Tabla>
          <EncabezadoTabla>
            <Filas className="text-center">
              {label.labels.map((elm, ind) => {
                return (
                  <CeldasHead
                    key={ind}
                  >
                    {elm}
                  </CeldasHead>
                );
              })}
            </Filas>
          </EncabezadoTabla>
          <Cuerpo>
            {
              inputvalue.inputs?.map((res, index) => {
                return (
                  <Filas key={index}>
                    {label.labels.map((elm, i) => {
                      return (
                        <CeldasBody
                          key={i}
                        >
                          {
                            elm=='N°'?
                              index+1
                              :
                              <InputCelda
                                onInput={(e) => {handlePaste1(index, elm, e, i);}}
                                className={elm}
                                onPaste={(e) => {handlePaste(index, elm, e, i); }}
                                type="textbox"
                                value={inputvalue.inputs[index][elm]}
                              />
                          }
                        </CeldasBody>
                      );
                    })}
                  </Filas>
                );
              })
            }
          </Cuerpo>
        </Tabla>

        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </>
      {
        isLoading?
          <ModalLoading completa={true}/>
          :
          ''
      }

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
};

const Container=styled.div`
  width: 100%;
  min-height: 400px;
  margin: auto;
  margin-bottom: 25px;
`;
const CajaEncabezado=styled.div`
  background-color: ${theme.azulOscuro1Sbetav2};
  padding: 5px;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid ${theme.azul1};
`;
const Titulo=styled.h2`
  color: ${theme.azul2};
  width: 100%;
  text-align: center;
  text-decoration: underline;
`;
const BtnHead=styled(BtnGeneralButton)`
  width: auto;
  padding: 10px;
  white-space: nowrap;
  margin:0;

  &.suma{
    border: 1px solid ${theme.success};
    &:hover{
      border: none;
      color: ${theme.success};
    }
  }
  &.resta{
    border: 1px solid ${theme.danger};
    &:hover{
      border: none;
      color: red;
    }
  }
`;
const CajaDatosCabecera =styled.div`
  background-color: ${theme.azulOscuro1Sbetav};
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 15px;
  margin-bottom: 10px;
`;

const CajitaDatosCabecera =styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
`;

const TextoLabel=styled.span`
  color: ${theme.azul1};
  margin-bottom: 2px;
  `;

const Input =styled.input`
   height: 35px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${theme.azul1};
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 5px;
  width: 95%;
  resize: both;
  resize: horizontal;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  &.fijado{
    background-color: ${theme.fondo};
    color:black;
  }
`;
const TextArea=styled.textarea`
  height: 35px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${theme.azul1};
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  padding: 4px;
  width: 95%;
  resize: vertical;
  /* field-sizing: content; */
  &:focus{
    border: 1px solid ${theme.azul2};
  }
`;
const Tabla=styled.table`
  border: 1px solid ${theme.azul1};
  border-radius: 5px;
  color: ${theme.azul1};
  margin: auto;
  border-collapse: collapse;
`;
const EncabezadoTabla=styled.thead`
  border: 1px solid white;
  background-color: ${theme.azulOscuro1Sbetav3};
`;
const Filas=styled.tr`
`;
const CeldasHead=styled.th`
  border: 1px solid ${theme.azul1};
  color: white;
  &:first-child{
    width: 50px;
    background-color: ${theme.azulOscuro1Sbetav3};
  }
  &:nth-child(2) {
    width: 80px;
  }
  &:nth-child(3) {
    width: 300px;
  }
  &:nth-child(4) {
    width: 100px;
  }
  &:last-child{
    width: 300px;
  }
`;
const Cuerpo =styled.tbody`
`;
const CeldasBody=styled.td`
border: 1px solid black;
font-size: 0.9rem;
height: 25px;
text-align: center;

  width: 10px;
  &:first-child{
    width: 40px;
  }
`;
const InputCelda=styled(Input)`
  width: 100%;
  height: 25px;
  outline: none;
  border: none;
  border-radius: 0;
  padding: 3px;
  &.Codigo{
    text-align: center;
  }
  &.Qty{
    text-align: center;
  }
`;
const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
// 777