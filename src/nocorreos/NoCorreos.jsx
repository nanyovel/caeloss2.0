import styled from "styled-components";
import { Header } from "../components/Header";
import theme from "../../theme";
import { OpcionUnica } from "../components/OpcionUnica";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, getFirestore, onSnapshot, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import db from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BotonQuery } from "../components/BotonQuery";
import { Alerta } from "../components/Alerta";
import { ModalLoading } from "../components/ModalLoading";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

export const NoCorreos = () => {
  
  // ***************RECURSOS GENERALES*****************
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const auth=getAuth();
  const {usuario}=useAuth();
  const usuarioFireBase=auth.currentUser;

  const [dbTickets, setDBTickets]=useState([]);
  const [dbContador, setDBContador]=useState([]);
  const [contadorTickets, setContadorTickets]=useState({});

    // ************************** DAME UN GRUPO DE DOC POR CONDICION**************************
    const useDocByCondition = (collectionName, setState, exp1,condicion,exp2) => {
      useEffect(() => {
        if(usuario){
          console.log('BASE de Datos 📄📄📄📄👨‍🏫👨‍🏫👨‍🏫📄📄👨‍🏫👨‍🏫');
          let q='';
  
          if(exp1){
            q = query(collection(db, collectionName), where(exp1, condicion, exp2));
          }
          else{
            q = query(collection(db, collectionName));
          }
  
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const colecion = [];
            querySnapshot.forEach((doc) => {
            // console.log(doc.data())
              colecion.push({...doc.data(), id:doc.id});
            });
            setState(colecion);
          });
          // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
          return () => unsubscribe();
        }
      }, [collectionName, setState, exp1,condicion,exp2]);
    };

    // useDocByCondition('tickets', setDBTickets, 'estadoDoc',"==",0);
    useDocByCondition('tickets', setDBTickets);

     // ************************** DAME SOLO UN DOC POR ID**************************
  const useDocById = (collectionName, setState, idUsuario) => {
    useEffect(() => {
      if(usuario){
        const unsub = onSnapshot(doc(db, collectionName, idUsuario), (doc) => {
          setState({...doc.data(),id:doc.id});
        });
        // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
        return () => unsub();
      }
    }, [collectionName, setState, idUsuario]);
  };
  useDocById('counters', setDBContador,'ticketCounter');

  useEffect(()=>{
    if(dbContador.length>0){
      setContadorTickets(dbContador.find(contador=>contador.id=='ticketCounter'))
    }

  },[dbContador])

  useDocById('counters', setContadorTickets,'ticketCounter');

    
    // ******************** OPCIONES UNICAS *******************
  const [arrayOpciones,setArrayOpciones]=useState([
    {
      nombre:'Nuevo ticket',
      opcion: 0,
      select:true,
    },
    {
      nombre:'Consulta',
      opcion: 1,
      select:false,
    },
    {
      nombre:'Historico',
      opcion: 2,
      select:false,
    },
  ]);
  const handleOpciones=(e)=>{
    let index=Number(e.target.dataset.id);
    setArrayOpciones(prevOpciones =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  // ********************** ESTADO MAESTRO ********************
  const [ticketMaster, setTicketMaster]=useState({
    numeroDoc:'',
    usuarioCreador:'',
    fecha:'',
    proyecto:'',
    monto:'',
    detalles:'',
    destinatario:'',
    estadoDoc:'',
  })


  useEffect(()=>{
    console.log(dbTickets)
    console.log(usuario)
    console.log(contadorTickets)
    if(usuario&&contadorTickets.lastTicketNumber){
      const userName = usuario.email.split('@')[0];

   
      console.log(contadorTickets.lastTicketNumber+1)
      console.log(contadorTickets)
      setTicketMaster({
        ...ticketMaster,
        numeroDoc:contadorTickets.lastTicketNumber+1,
        usuarioCreador:userName,
        fecha:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        estadoDoc:0,
      })
    }
  },[dbTickets, usuario])

  // ******************** MANEJADOR DE INPUTS ********************
  const handleInput=(e)=>{
    const {value,name}=e.target

    if(name=='textoConsolidado'){
      setTextoConsolidado(value)
    }
    else if(name=='buscarDocInput'){
      setBuscarDocInput(value)
    }
    else{
      setTicketMaster({
        ...ticketMaster,
        [name]:value
      })
    }
  }

  const [textoConsolidado, setTextoConsolidado]=useState()
  const [isLoading,setIsLoading]=useState(false);

  const generarTicket=async()=>{
    setIsLoading(true);
    const textoConso=(
      'N° Ticket:'+'--------'+ticketMaster.numeroDoc +'\n'+
      'Usuario:'+'----------'+ticketMaster.usuarioCreador +'\n'+
      'Fecha:'+'------------'+ticketMaster.fecha +'\n'+
      'Proyecto:'+'---------'+ticketMaster.proyecto +'\n'+
      'Monto:'+'------------'+ticketMaster.monto +'\n'+
      'Detalles:'+'---------'+ticketMaster.detalles +'\n'
    )

    const batch = writeBatch(db);
    try{
      // Agregar la operación de actualización del contador
        const contadorTicketId= 'ticketCounter';
        const contadorUpdate = doc(db, "counters", contadorTicketId);
        console.log(contadorUpdate)
        const nuevoNumero=contadorTickets.lastTicketNumber+1
         batch.update(contadorUpdate, {
          "lastTicketNumber": nuevoNumero
        });

      // Agregar nuevo documento a tickets en el mismo lote
        const collectionTicketsRef = collection(db,'tickets');
        const nuevoDocumentoRef = doc(collectionTicketsRef);
        batch.set(nuevoDocumentoRef, {
          ...ticketMaster,
          numeroDoc:nuevoNumero
        });

        console.log(nuevoNumero)
        if(nuevoNumero>10000000){
          console.log(nuevoNumero)
          await batch.commit();
          setMensajeAlerta('Ticket cargado.');
          setTipoAlerta('success');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          setTextoConsolidado(textoConso)
        }
        else{
          setMensajeAlerta('Error con numero de ticket..');
          setTipoAlerta('error');
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          setIsLoading(false);

        }
    
    
     
      setIsLoading(false);
    }
    catch(error){
      console.log(error);
      setMensajeAlerta('Error con la base de datos.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
    }
  }

  

  const tableRef = useRef(null);

  const copyTable = async () => {
    if (tableRef.current) {
      // Obtener la tabla como HTML
      const tableHTML = tableRef.current.outerHTML;

      // Crear un nuevo blob con el HTML de la tabla
      const blob = new Blob([tableHTML], { type: 'text/html' });

      // Crear un objeto DataTransfer para copiar al portapapeles
      const data = [new ClipboardItem({ 'text/html': blob })];

      // Intentar copiar al portapapeles
      try {
        await navigator.clipboard.write(data);
        // alert('Tabla copiada al portapapeles');
      } catch (err) {
        console.error('Error al copiar la tabla: ', err);
        alert('Hubo un problema al copiar la tabla');
      }
    }
  };

  const [queryTicketMaster, setQueryTicketMaster]=useState({});
  const [buscarDocInput, setBuscarDocInput]=useState('')

  const buscarTicket=(e)=>{
    e.preventDefault()
    const ticketBuscado=dbTickets.find(tikect=>tikect.numeroDoc==buscarDocInput)

    console.log(dbTickets)
    console.log(ticketBuscado)
    console.log(buscarDocInput)
    if(ticketBuscado){
      console.log(ticketBuscado)
      setQueryTicketMaster(ticketBuscado)
    }
    else{
      setMensajeAlerta('El numero no existe.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

    }
  }


  return (
    <>
    <BotonQuery
      queryTicketMaster={queryTicketMaster}
    />
      <Header titulo='Enumerador de correos'/>
      <ContainerNav>
        <OpcionUnica
            titulo='Pantallas'
            name='grupoA'
            arrayOpciones={arrayOpciones}
            handleOpciones={handleOpciones}
        />

      </ContainerNav>
      {
        arrayOpciones[0].select&&
      <Contenedor>
        <CajitaDetalle>
            <TituloDetalle>N° Ticket:</TituloDetalle>
            <DetalleTexto>{ticketMaster.numeroDoc}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
            <TituloDetalle>Usuario:</TituloDetalle>
            <DetalleTexto>{ticketMaster.usuarioCreador}</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
            <TituloDetalle>Fecha:</TituloDetalle>
            <DetalleTexto>{ticketMaster.fecha.slice(0,10)}</DetalleTexto>

        </CajitaDetalle>
        <CajitaInterna>
            <TituloCajita>N° Proyecto:</TituloCajita>
            <Input 
              type="text" 
              name="proyecto"
              value={ticketMaster.proyecto}
              onChange={(e)=>handleInput(e)}
            />
        </CajitaInterna>
        <CajitaInterna>
            <TituloCajita>Monto RD$:</TituloCajita>
            <Input 
              type="text" 
              name="monto"
              value={ticketMaster.monto}
              onChange={(e)=>handleInput(e)}
              />
        </CajitaInterna>
        <CajitaInterna>
            <TituloCajita>Detalles:</TituloCajita>
            <InputArea  
               name="detalles"
               value={ticketMaster.detalles}
               onChange={(e)=>handleInput(e)}
            />
        </CajitaInterna>
        <CajitaInterna className="btnGeneral">
            <BtnGenerarTicket
              onClick={(e)=>generarTicket(e)}
            >
                Generar Ticket
            </BtnGenerarTicket>
        </CajitaInterna>
        <CajitaInterna className="cajaResultado">
            <InputArea
                className="inputResultado"
                onChange={(e)=>handleInput(e)}
                name="textoConsolidado"
                value={textoConsolidado}
            />
        </CajitaInterna>
        
    
      <Tabla ref={tableRef}
        
       border="1"
          style={{
            // display='none',
            fontFamily: 'Arial, Helvetica, sans-serif',
            borderCollapse: 'collapse',
            // width: '95%',
            minWidth: '400px',
            maxWidth: '450px',
            marginBottom: '25px',
          }}
      >
        <thead  >
          <Filas className="cabeza"
           style={{
            backgroundColor: '#254778',
            textAlign: 'left',
            borderBottom: '1px solid black',
          }}>
            <CeldaHead
              style={{
                minWidth: '80px',
                border: '1px solid black'
              }}>Propiedad</CeldaHead> 
            <CeldaHead
              style={{
              border: '1px solid black'
            }}>Valor</CeldaHead> 
          </Filas>
        </thead>
        <tbody  border="1">
          <Filas  
             style={{
              backgroundColor: '#325b94d6',
            }}
          >
            <CeldasBody
             style={{
              border: '1px solid black'
          }}   
            >Nº Ticket</CeldasBody>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}    
            >{ticketMaster.numeroDoc}</CeldasBody>
          </Filas>
          <Filas    
            style={{
              backgroundColor: '#325b94d6',
            }}  border="1">
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >Usuario</CeldasBody>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >{ticketMaster.usuarioCreador}</CeldasBody>
          </Filas>
          <Filas    
            style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >Fecha</CeldasBody>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >{ticketMaster.fecha.slice(0,10)}</CeldasBody>
          </Filas>

          <Filas    
            style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >Proyecto</CeldasBody>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >{ticketMaster.proyecto}</CeldasBody>
          </Filas>

          <Filas    
            style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >Monto</CeldasBody>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >{ticketMaster.monto}</CeldasBody>
          </Filas>
         
          <Filas    style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >Detalles</CeldasBody>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}   
            >{ticketMaster.detalles}</CeldasBody>
          </Filas>
        </tbody>

      </Tabla> 

        <CajitaInterna className="btnGeneral">
            <BtnGenerarTicket
              onClick={()=>copyTable()}
            >
                Copiar texto
            </BtnGenerarTicket>
        </CajitaInterna>
      </Contenedor>
    }
    {
        arrayOpciones[1].select&&
        <>
        <CajaControles>
            <ContenedorBuscar>
              <form action="" onSubmit={(e)=>buscarTicket(e)}>
                <Texto>
                    Buscar: {''}
                </Texto>
                <InputBuscar
                  type='text'
                  name='buscarDocInput'
                  value={buscarDocInput}
                  onChange={(e)=>handleInput(e)}
                />
                <BtnNormal
                  type='submit'
                  className={`buscar`}
                  onClick={(e)=>buscarTicket(e)}
                >
                  <Icono icon={faMagnifyingGlass}/>
                    Buscar
                </BtnNormal>
            </form>
          </ContenedorBuscar>

        </CajaControles>

        <CajaEncabezadoQuery>
          <CajaDetalles>
            <CajitaDetalle>
              <TituloDetalle>N° Ticket:</TituloDetalle>
              <DetalleTexto>{queryTicketMaster.numeroDoc||''}</DetalleTexto>
            </CajitaDetalle>
            <CajitaDetalle>
              <TituloDetalle>Usuario</TituloDetalle>
              <DetalleTexto>{queryTicketMaster.usuarioCreador||''}</DetalleTexto>
            </CajitaDetalle>
            <CajitaDetalle>
              <TituloDetalle>Fecha</TituloDetalle>
              <DetalleTexto>{queryTicketMaster?.fecha?.slice(0,10)||''}</DetalleTexto>
            </CajitaDetalle>
            <CajitaDetalle>
              <TituloDetalle>N° Proyecto</TituloDetalle>
              <DetalleTexto>{queryTicketMaster.proyecto||''}</DetalleTexto>
            </CajitaDetalle>
            <CajitaDetalle>
              <TituloDetalle>Monto</TituloDetalle>
              <DetalleTexto>RD$ {queryTicketMaster.monto||''}</DetalleTexto>
            </CajitaDetalle>

            <CajitaDetalle className="detalles">
              <TituloDetalle className="detalles">Detalles:</TituloDetalle>
              <DetalleTexto className="detalles">
                {queryTicketMaster.detalles||''}
              </DetalleTexto>
            </CajitaDetalle>

          </CajaDetalles>
          <CajaDetalles  className="cajaStatus">
            <TextoStatus
              className={
                  queryTicketMaster.estadoDoc==0?
                    'success'
                    :
                    queryTicketMaster.estadoDoc==1?
                    'block'
                    :
                    queryTicketMaster.estadoDoc==2?
                        'del'
                        :
                        ''
              }
            >
              {
                 queryTicketMaster.estadoDoc==0?
                 <>
                 Ticket Abierto{' '}
                 <Icono icon={faLockOpen}/>
                 </>
                 :
                 queryTicketMaster.estadoDoc==1?
                 <>
                 Pagado{' '}
                 <Icono icon={faLock}/>
                 </>
                 :
                 queryTicketMaster.estadoDoc==2?
                 <>
                 Cancelado{' '}
                 <Icono icon={faXmark}/>
                 </>
                     :
                     ''

              }
               </TextoStatus>

          </CajaDetalles>

           
        </CajaEncabezadoQuery>
       
        </>
    }
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
    </>
  );
};

const Contenedor=styled.div`
    margin: auto;
    border: 2px solid ${theme.fondo};
    width: 400px;
    margin-top: 20px;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 50px;
`



const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width:1000px){
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width:410px){
    width: 99%;
  
  }
`;
const CajitaInterna=styled.div`
    width: 100%;
    margin-top: 10px;
    &.btnGeneral{
        display: flex;
        justify-content: center;
    }

`
const TituloCajita=styled.p`
    color: ${theme.fondo};
`

const Input=styled.input`
  border: none;
  outline: none;
  height: 30px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  border: none;
  color: ${theme.azul2};
  width: 100%;
  display: flex;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  border-radius: 5px;
  border: 1px solid #7575751e;
  &.inputConsulta{
    text-align: center;
  }
  
`;

const InputArea=styled.textarea`
  border: none;
  outline: none;
  /* height: 25px; */
  min-height: 60px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  border: none;
  color: ${theme.azul2};
  width: 100%;
  display: flex;
  resize: vertical;
  &:focus{
      border: 1px solid ${theme.azul2};
      
    }
    border-radius: 5px;
    
 &.inputResultado{
    min-height: 130px;
    color: #000;
    border: none;
    background-color: #fff;
  }
    
`

const CajitaDetalle=styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.azul1};
  display: flex;
  justify-content: space-between;
  color: ${theme.fondo};

  &.detalles{
    flex-direction: column;
    border: none;
  }

`;

const TituloDetalle=styled.p`
  width: 49%;
  color: inherit;
  &.detalles{
    width: 100%;
    border-bottom: 1px solid ${theme.azul1};

  }
`;
const DetalleTexto= styled.p`
  text-align: end;
  height: 20px;
  width: 49%;
  white-space: nowrap;
  overflow: hidden;  
  text-overflow: ellipsis;
  color: inherit;
  &.negativo{
    color: ${theme.danger};
  }
  &.docCerrado{
    color: inherit;
  }
  &.detalles{
    height: auto;
    width: 100%;
    white-space: normal;
    text-align: start;
    padding-left: 10px;
  }
 
`;

const BtnGenerarTicket=styled.button`
   height: 35px;
   width: 70%;
   border-radius: 5px;
   outline: none;
   border: none;
   font-weight: bold;
   font-size: 1rem;
   background-color:${theme.azul2};
   color: #403c3c;
   &:hover{
       background-color: #403c3c;
       color: ${theme.azul2};
        cursor: pointer;
   }
   &:active{
       background-color: #565353;
       color: ${theme.azulpr};
        cursor: pointer;
   }
`

const Tabla = styled.table`
  display: none;

  `;

  
const Filas =styled.tr`
&.cabeza{
  background-color: ${theme.azulOscuro1Sbetav};
}
/* color: ${theme.azul1}; */
&:hover{
  background-color: ${theme.azulOscuro1Sbetav};
}
`;

const CeldaHead= styled.th`
 border-bottom: 1px solid #605e5e;
padding: 3px 7px;
text-align: center;
border: 1px solid #000;


font-size: 0.9rem;
&.qty{
  width: 300px;
}

&.noFurgon{
  width: 120px;
}
&.tamannio{
  width: 90px;
}
&.destino{
  width: 120px;
}
&.disponibleEnSAP{
  width: 80px;
}
&.status{
  width: 160px;
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
&.proveedor{
  text-align: start;
  padding-left: 5px;
}

`;

const CajaControles=styled.div`
  width: 100%;
  padding: 10px;
  background-color: ${theme.azulOscuro1Sbetav};
`
const CajaBuscar=styled.div`
background-color: ${theme.azulOscuro1Sbetav3};
  border: 1px solid red;
`


const TituloBuscar=styled.p`
    color: ${theme.fondo};
`

// const InputBuscar=styled.input`
//   border: none;
//   outline: none;
//   height: 30px;
//   padding: 5px;
//   background-color: ${theme.azulOscuro1Sbetav3};
//   border: ${theme.azul1};
//   color: ${theme.azul2};
//   width: 150px;
//   display: flex;
//   &:focus{
//     border: 1px solid ${theme.azul2};

//   }
//   border-radius: 5px;
//   border: 1px solid #7575751e;
//   &.inputConsulta{
//     text-align: center;
//   }
  
// `;

const ContenedorBuscar=styled.div`
  background-color: ${theme.azulOscuro1Sbetav3};
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  color: ${theme.azul2};
  &.editando{
    background-color: #5e5d60;
    color: black;
  }
`;


const Texto=styled.h2`
  color: inherit;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;

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
  margin-right: 5px;
  &.deshabilitado{
    background-color: ${theme.fondo};
    color: black;
  }
`;


const BtnNormal=styled(BtnGeneralButton)`
&.borrada{
  background-color: red;
  color: white;
  &:hover{
    color: red;
    background-color: white;
    }
}
&.eliminadaRealizado{
  background-color: #eaa5a5;
  &:hover{
    cursor: default;
    color: white;

  }
}
  &.editaEliminada{
    background-color: #407aadb5;
    cursor: default;
    color: white;
  }
  &.buscar{
    margin: 0;
  }
  &.editando{
    background-color: #5e5d60;
    color: black;
    cursor: default;
  }
  &.mas{
    width: 50px;
  }
`;

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const CajaEncabezadoQuery = styled.div`
  width: 100%;
  min-height:40px;
  display: flex;
  justify-content: center;
  margin: 10px 0;
  color: ${theme.azul1};
  &.negativo{
    color: ${theme.danger};
  }
  @media screen and (max-width:650px){
    flex-direction: column;
    align-items: center;
    
  }
`;


const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
  border:2px solid  #535353;
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;
  &.cajaStatus{
    background-color: ${theme.azulOscuro1Sbetav2};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.detallesCaja{
    color: ${theme.fondo};
    width: 90%;
  }
  @media screen and (max-width:650px){
    width: 90%;
    margin-bottom: 5px;
    
  }
`;
const DetalleTextoQuery=styled.p`
  

`
const TextoStatus=styled.h3`
    font-size: 2rem;
    &.sinDocumento{
      color: red;
    }
    &.success{
      color: ${theme.success};
    }
    &.block{
      color: #524a4a;
    }
    &.del{
      color: #8c3d3d;
    }
`;