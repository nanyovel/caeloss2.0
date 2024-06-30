import styled from "styled-components";
import { Header } from "../components/Header";
import theme from "../../theme";
import { OpcionUnica } from "../components/OpcionUnica";
import { useEffect, useRef, useState } from "react";
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import db from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { getAuth } from "firebase/auth";

export const NoCorreos = () => {
  
  const auth=getAuth();
  const {usuario}=useAuth();
  const usuarioFireBase=auth.currentUser;

  const [dbTickets, setDBTickets]=useState([]);

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

    useDocByCondition('tickets', setDBTickets, 'estadoDoc',"==",0);


    
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

  const guiones='----------'

  // const [textoResultado, setTextoResultado]=useState('No Ticket---------10003525 \nUsuario-----------Cindy Rosario \nFecha-------------25/06/2024 \nProyecto----------PR001525 \nMonto-------------1000 \nDetalles----------Subir a tercer nivel en area de cocina \n')
//   const [textoResultado, setTextoResultado]=useState(`
//    <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>
//           {Object.keys(data[0]).map((key) => (
//             <th style={{ border: '1px solid black', padding: '5px' }} key={key}>
//               {key}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row, index) => (
//           <tr key={index}>
//             {Object.values(row).map((value, index) => (
//               <td style={{ border: '1px solid black', padding: '5px' }} key={index}>
//                 {value}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>   
// `)
// Ejemplo de datos
const data = [
  { Name: 'John', Age: 28, Country: 'USA' },
  { Name: 'Anna', Age: 22, Country: 'Sweden' },
  { Name: 'Peter', Age: 35, Country: 'Norway' }
];

const [textoResultado, setTextoResultado] = useState()

  const [valorInput, setValorInput]=useState()
  const generalTicket=()=>{
    setValorInput( data.map((dato,index)=>{
      return(
        <table key={index} style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>
                Nombre
              </th>
              <th style={{ border: '1px solid black', padding: '5px' }}>
                Edad
              </th>
              <th style={{ border: '1px solid black', padding: '5px' }}>
                Pais
              </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td style={{ border: '1px solid black', padding: '5px' }} key={index}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> 
        
      )
    }))
   
    
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
  

  return (
    <>
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
            <DetalleTexto>10003525</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
            <TituloDetalle>Usuario:</TituloDetalle>
            <DetalleTexto>Cindy Rosario</DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
            <TituloDetalle>Fecha:</TituloDetalle>
            <DetalleTexto>Lunes 25 junio 2024</DetalleTexto>
        </CajitaDetalle>
        <CajitaInterna>
            <TituloCajita>N° Proyecto:</TituloCajita>
            <Input type="text" />
        </CajitaInterna>
        <CajitaInterna>
            <TituloCajita>Monto RD$:</TituloCajita>
            <Input type="text" />
        </CajitaInterna>
        <CajitaInterna>
            <TituloCajita>Detalles:</TituloCajita>
            <InputArea  />
        </CajitaInterna>
        <CajitaInterna className="btnGeneral">
            <BtnGenerarTicket
              onClick={(e)=>generalTicket(e)}
            >
                Generar Ticket
            </BtnGenerarTicket>
        </CajitaInterna>
        <CajitaInterna className="cajaResultado">
            <InputArea
                className="inputResultado"
                value={valorInput}
            />
        </CajitaInterna>
        
    
      <Tabla ref={tableRef}
       border="1"
          style={{
            fontFamily: 'Arial, Helvetica, sans-serif',
            borderCollapse: 'collapse',
            // width: '95%',
            minWidth: '400px',
            maxWidth: '450px',
            marginBottom: '25px',
            // border: '1px solid red'
          }}
      >
        <thead  >
          <Filas className="cabeza"
           style={{
            backgroundColor: '#254778',
            textAlign: 'left',
            borderBottom: '1px solid black',
          }}
          
          >
            <CeldaHead
              style={{
                minWidth: '80px',
                // maxWidth: '450px',
                border: '1px solid black'
              }}
              
            >Propiedad</CeldaHead> 
            <CeldaHead
             style={{
              border: '1px solid black'
            }}
            
            >Valor</CeldaHead> 
          </Filas>
        </thead>
        <tbody  border="1">
          <Filas  
             style={{
              backgroundColor: '#325b94d6',
            }}
           
          border="1">
            <CeldasBody
             style={{
              border: '1px solid black'
          }}   
            >Nº Ticket</CeldasBody>
            <CeldasBody
              style={{
                border: '1px solid black'
            }}    
            >10001526</CeldasBody>
          </Filas>
          <Filas    style={{
              backgroundColor: '#325b94d6',
            }}  border="1">
            <CeldasBody>Usuario</CeldasBody>
            <CeldasBody>Cindy Rosario</CeldasBody>
          </Filas>
          <Filas    style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody>Fecha</CeldasBody>
            <CeldasBody>25/06/24</CeldasBody>
          </Filas>
          <Filas    style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody>Monto</CeldasBody>
            <CeldasBody>1000</CeldasBody>
          </Filas>
          <Filas    style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody>Proyecto</CeldasBody>
            <CeldasBody>PR001544</CeldasBody>
          </Filas>
          <Filas    style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody>Monto</CeldasBody>
            <CeldasBody>1000</CeldasBody>
          </Filas>
          <Filas    style={{
              backgroundColor: '#325b94d6',
            }}>
            <CeldasBody>Detalles</CeldasBody>
            <CeldasBody>Subir al segundo nivel colocar en area de cocina Subir al segundo nivel colocar enSubir al segundo nivel colocar enSubir al segundo nivel colocar enSubir al segundo nivel colocar en.</CeldasBody>
          </Filas>
        </tbody>

      </Tabla> 
{/* 
<table
        ref={tableRef}
        border="1"
        style={{
          backgroundColor: 'red',
          borderCollapse: 'collapse',
          margin: '25px 0',
          fontSize: '0.9em',
          fontFamily: 'Arial, Helvetica, sans-serif',
          minWidth: '400px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <thead>
          <tr
            style={{
              // backgroundColor: '#009879',
              color: '#ffffff',
              textAlign: 'left',
            }}
          >
            <th style={{ padding: '12px 15px' }}>Header 1</th>
            <th style={{ padding: '12px 15px' }}>Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #dddddd' }}>
            <td style={{ padding: '12px 15px' }}>Data 1</td>
            <td style={{ padding: '12px 15px' }}>Data 2</td>
          </tr>
          <tr
            style={{
              borderBottom: '1px solid #dddddd',
              backgroundColor: '#f3f3f3',
            }}
          >
            <td style={{ padding: '12px 15px' }}>Data 3</td>
            <td style={{ padding: '12px 15px' }}>Data 4</td>
          </tr>
          <tr style={{ borderBottom: '2px solid #009879' }}>
            <td style={{ padding: '12px 15px' }}>Data 5</td>
            <td style={{ padding: '12px 15px' }}>Data 6</td>
          </tr>
        </tbody>
      </table> */}
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
        <Contenedor>
            <TituloCajita>Buscar ticket:</TituloCajita>
            <Input className="inputConsulta" type="text"/>
            <CajitaInterna className="btnGeneral">
            <BtnGenerarTicket>
                Buscar Ticket
            </BtnGenerarTicket>
        </CajitaInterna>
        </Contenedor>
    }
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

`;

const TituloDetalle=styled.p`
  width: 49%;
  color: inherit;
  &.negativo{
    color: ${theme.danger};
  }
  &.docCerrado{
    color: inherit;
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

  `;

  
const Filas =styled.tr`
&.body{
  
  font-weight: normal;
  border-bottom: 1px solid #49444457;
  border: none;
  background-color: ${theme.azul5Osc};

}
&.descripcion{
  text-align: start;
}

&.filaSelected{
  background-color: ${theme.azulOscuro1Sbetav};
  border: 1px solid red;
}
&.cabeza{
  background-color: ${theme.azulOscuro1Sbetav};
  color: red;
  /* backgroundColor: '##000b1a', */
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