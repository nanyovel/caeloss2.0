import {useEffect, useState } from 'react';
import { styled } from 'styled-components';
import theme from '../config/theme.jsx';
import { Header } from '../components/Header';
import {dbProvincias } from './DBFletex';
import { OpcionUnica } from '../components/OpcionUnica';
// import { BotonQuery } from '../components/BotonQuery';
// import { BtnGeneralButton } from '../components/BtnGeneralButton';
import { AvisoModal } from '../components/Avisos/AvisoModal';
import { Alerta } from '../components/Alerta';
import CajaNavegacion from './components/CajaNavegacion';
import { ElementoPrivilegiado } from '../context/ElementoPrivilegiado.jsx';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import db from '../firebase/firebaseConfig';

export const Fletes = ({
  dbUsuario,
  userMaster
}) => {

  const [dbValoresUV, setDBValoresUV]=useState([]);
  const [valoresMaster,setValoresMaster]=useState([]);

  const useDocByCondicion = (collectionName, setState, exp1,condicion,exp2) => {
    useEffect(() => {
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

    }, [collectionName, setState, exp1,condicion,exp2]);
  };

  useDocByCondicion('valoresUnidadVehicular', setDBValoresUV);

  useEffect(()=>{
    const valoresOrdenados=dbValoresUV.sort((a, b) => a.no - b.no);
    setValoresMaster(valoresOrdenados);

  },[dbValoresUV]);

  useEffect(()=>{
    document.title = "Caeloss - Fletes";

    return () => {
      document.title = "Caeloss"; // Aquí puedes establecer el título por defecto
    };
  },[]);
  // Alertas
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const [width, setWidth] = useState(window.innerWidth);
  const [hasModal, setHasModal]=useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener en el componente desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // *********************MANEJANDO ARRAY OPCIONES*************************
  const [opcionesModalidad,setOpcionesModalidad]=useState([
    {
      nombre:'Por destino',
      opcion: 0,
      select:true,
    },
    {
      nombre:'Por kilometros',
      opcion: 1,
      select:false,
    },
  ]);
  const [opcionesPuntaPartida,setOpcionesPuntaPartida]=useState([
    {
      nombre:'Sto.Dgo',
      nombrePronvica:'Santo Domingo',
      select:true,
      opcion: 0,
      nombreDistancia:'distanciaSD',
      nombreLink:'linkSD',
      mapa:'https://www.google.com/maps/embed?pb=!4v1694361633123!6m8!1m7!1saLwV4KAQzvCG4ph_jyfSlg!2m2!1d18.4762744033304!2d-69.95464102754933!3f196.43932439905848!4f-4.832561925849461!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'

    },
    {
      nombre:'P&L',
      nombrePronvica:'Santo Domingo',
      select:false,
      opcion: 1,
      nombreDistancia:'distanciaPyL',
      nombreLink:'linkPyL',
      mapa:'https://www.google.com/maps/embed?pb=!4v1694312255345!6m8!1m7!1sYwe1zW5y7I1ly6W3SUqgkg!2m2!1d18.49447669425849!2d-69.8948331255642!3f250.28127992169277!4f-6.831736467840457!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
    },
    {
      nombre:'Santiago',
      nombrePronvica:'Santiago',
      select:false,
      opcion: 2,
      nombreDistancia:'distanciaStgo',
      nombreLink:'linkStgo',
      mapa:'https://www.google.com/maps/embed?pb=!4v1694312363155!6m8!1m7!1s_UygiuWOL2JV4Q9AHJU-_w!2m2!1d19.47892374795364!2d-70.72289931724042!3f72.5745762185047!4f-0.6540053955846332!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
    },
    {
      nombre:'Z.O',
      nombrePronvica:'Santo Domingo',
      select:false,
      opcion: 3,
      nombreDistancia:'distanciaZO',
      nombreLink:'linkZO',
      mapa:'https://www.google.com/maps/embed?pb=!4v1694312478310!6m8!1m7!1sF_1diNkkZZ_WVSDS0pwPgQ!2m2!1d18.53433567188377!2d-69.84682906353103!3f55.553501638646814!4f-2.965861543220541!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'

    },
    {
      nombre:'Bavaro',
      nombrePronvica:'La Altagracia',
      select:false,
      opcion: 4,
      nombreDistancia:'distanciaBvro',
      nombreLink:'linkBvro',
      mapa:'https://www.google.com/maps/embed?pb=!4v1694312555848!6m8!1m7!1sCAoSLEFGMVFpcE0ydlpIY1BoMGYySzRkQjY4SDZlekdwRC1nR24ycURxTUphU2Iy!2m2!1d18.6423825174432!2d-68.41571083383191!3f40.93204775648098!4f-12.2911012921316!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
    },
  ]);

  const handleOpciones=(e)=>{
    let index=Number(e.target.dataset.id);
    let name=e.target.name;

    if(name=='modalidad'){
      setDistanciaManual('');
      setResultadoGlobla(initalValueResultado);
      setOpcionesModalidad(prevOpciones =>
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );
    }
    else if(name=='puntoPartida'){
      setOpcionesPuntaPartida(prevOpciones=>
        prevOpciones.map((opcion,i)=>{
          if(i==index){
            setMapaDefault(opcion.mapa);
          }
          return{

            ...opcion,
            select: i === index,
          };
        })
      );
    }
  };

  // ************************HANDLE PROVINCIA************************
  const [provinciasParsed,setProvinciasParsed]=useState([]);

  useEffect(()=>{
    let duplica= new Set();
    setProvinciasParsed(dbProvincias.map((db)=>{
      const nueMun=db.municipios.map((mun)=>{
        if(duplica.has(mun.label)){
          console.log('municipio duplicado:'+mun.label);
          return{
            ...mun,
            label:mun.label+' - A12'
          };
        }
        else{
          duplica.add(mun.label);
          return {
            ...mun,
            provinciaPadre:db.label
          };
        }
      });

      return{
        ...db,
        municipios:nueMun
      };

    }));

  },[]);

  // ************************HANDLE MUNICIPIO************************
  const [muniSelect, setMuniSelect]=useState('');
  const handleSelectMun=(e)=>{
    // const indexMun=Number(e.id);
    const value=e.target.value;
    setMuniSelect(value);

    setProvinciasParsed(provinciasParsed.map((pro)=>{
      const muni=pro.municipios.map((mun)=>{
        return{
          ...mun,
          select:value==mun.label
        };
      });

      return{
        ...pro,
        municipios:muni
      };
    }));

    if(value=='Miches'){
      setMensajeAlerta('El destino se considera una ruta peligrosa, se debe tomar la precaución adecuada, y enviar un chofer experimentado.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 10000);

    }
  };

  // ************************HANDLE VEHICULO************************
  // const initialVehiculos=[
  //   {
  //     nombre:'platanera',
  //     descripcion:"Mini truck 7' (Platanera)",
  //     srcImg:platanera,
  //     select:false,
  //     cuota:500,
  //     radio1_0a2:450,
  //     radio2_2a4:750,
  //     radio3_4a6:900,
  //     radio4_6a9:1350,
  //     radio5_9a15:1500,
  //     radio6_15a20:1700,
  //     radio7_20a30:2000,
  //   },
  //   {
  //     nombre:'camioncito',
  //     descripcion:"Mini truck 10'",
  //     srcImg:platanera10Pies,
  //     select:false,
  //     cuota:540,
  //     radio1_0a2:750,
  //     radio2_2a4:900,
  //     radio3_4a6:1350,
  //     radio4_6a9:1500,
  //     radio5_9a15:1700,
  //     radio6_15a20:2000,
  //     radio7_20a30:2400,
  //   },
  //   {
  //     nombre:'camaLarga',
  //     descripcion:"Camion 16' (Cama Larga)",
  //     srcImg:camaLarga,
  //     select:false,
  //     cuota:625,
  //     radio1_0a2:900,
  //     radio2_2a4:1500,
  //     radio3_4a6:2250,
  //     radio4_6a9:2500,
  //     radio5_9a15:2800,
  //     radio6_15a20:3300,
  //     radio7_20a30:4100,
  //   },
  //   {
  //     nombre:'rigido',
  //     descripcion:"Camion rigido 24'",
  //     srcImg:rigido,
  //     select:false,
  //     cuota:700,
  //     radio1_0a2:1800,
  //     radio2_2a4:3000,
  //     radio3_4a6:4500,
  //     radio4_6a9:5000,
  //     radio5_9a15:5600,
  //     radio6_15a20:6600,
  //     radio7_20a30:8200,
  //   },
  //   {
  //     nombre:'patana',
  //     descripcion:"Camion trailer plataforma 40' (Patana)",
  //     srcImg:patana,
  //     select:false,
  //     cuota:800,
  //     radio1_0a2:3000,
  //     radio2_2a4:5000,
  //     radio3_4a6:7500,
  //     radio4_6a9:8300,
  //     radio5_9a15:9500,
  //     radio6_15a20:11000,
  //     radio7_20a30:14000,
  //   },
  // ];
  const [opcionesVehiculos, setOpcionesVehiculos]= useState();
  useEffect(()=>{
    setOpcionesVehiculos(valoresMaster.map((uv)=>{
      return{
        ...uv,
        select:false
      };
    }));

  },[valoresMaster]);

  const handleVehiculo=(e)=>{
    const index = Number(e.target.dataset.id);
    setOpcionesVehiculos(opcionesVehiculos.map((vehi,i)=>{
      return{
        ...vehi,
        select: i==index,
      };
    }));
  };

  const [distanciaManual,setDistanciaManual]=useState('');
  const handleDistanciaManual=(e)=>{
    const valor=e.target.value;
    const regex = /\.$/;
    let expReg = /^[\d.]{0,1000}$/;
    if(expReg.test(valor)==true){
      setDistanciaManual(Number(valor));
    }
    if(regex.test(valor)){
      setDistanciaManual(valor);
    }
  };

  // ******************REALIZAR CALCULO*************
  const initalValueResultado={
    costo:'-',
    precio:'-',
    distancia:'-',
    destino:'-',
    provincia:'-',
  };
  const [resultadoGlobal,setResultadoGlobla]=useState(initalValueResultado);
  const datosFijos={
    totalAnillos:30,
    horgura:25
  };

  const [rutaPeligrosa, setRutaPeligrosa]=useState(false);
  useEffect(()=>{
    let validacion={
      hasVehiculo:false,
      hasMunicipio:false,
      origenIgualDestino:false,
    };
    let newResultadoGlobal={};

    // Dame el punto de partida
    const puntoSelect=opcionesPuntaPartida.find((punt)=>{
      if(punt.select==true){
        return punt;
      }
    });

    // Dame el vehiculo
    const vehiSelect=opcionesVehiculos?.find((veh)=>{
      if(veh.select==true){
        validacion.hasVehiculo=true;
        return veh;
      }
    });

    // Dame el destino/municipio
    let municiSelect={};
    // Modalidad por destino
    if(opcionesModalidad[0].select==true){
      provinciasParsed.forEach((provincia) => {
        provincia.municipios.forEach((mun)=>{
          if(mun.select==true){
            municiSelect=mun;
            newResultadoGlobal.provincia=provincia.label;
            validacion.hasMunicipio=true;

            newResultadoGlobal={
              ...newResultadoGlobal,
              mapa:municiSelect[puntoSelect.nombreLink],
              destino:municiSelect.label
            };
          }
        });
      });

      if(validacion.hasMunicipio==false){
        newResultadoGlobal={
          ...newResultadoGlobal,
          costo:0,
          precio: 0,
          distancia:0
        };
        setResultadoGlobla(newResultadoGlobal);
        opcionesPuntaPartida.forEach((punto)=>{
          if(punto.select==true){
            setMapaDefault(punto.mapa);
          }
        });
      }
    }
    // Modalidad por kilometros
    if(opcionesModalidad[1].select==true){
      if(typeof(distanciaManual)=='number'){

        validacion.hasMunicipio=true;
        newResultadoGlobal={
          ...newResultadoGlobal,
          mapa:municiSelect[puntoSelect.nombreLink],
          destino:municiSelect.label
        };
      }
    }

    // Si el usuario coloco una provincia destino igual a la provincia origen
    if(puntoSelect.nombrePronvica==municiSelect.provinciaPadre){
      validacion.origenIgualDestino=
      setMensajeAlerta('Provincia destino igual a provincia origen, seleccione un radio o indique distancia en kilómetros');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 7000);
    }

    let costo=0;
    let distancia=0;

    // Si todo correcto
    if(
      validacion.hasVehiculo==true&&
      validacion.hasMunicipio==true&&
      validacion.origenIgualDestino==false
    ){

      if(municiSelect.value=='Miches'){
        setHasModal(true);
        setRutaPeligrosa(true);

      }
      else{
        setRutaPeligrosa(false);
      }

      // Modalidad por destino
      if(opcionesModalidad[0].select==true){
        // Si el usuario eligio una provincia normal, es decir no un radio
        if(municiSelect.provincia!='Radio'){
          distancia=municiSelect[puntoSelect.nombreDistancia];

        }
        // Si el usuario seleciona un radio/anillo,
        // ~ condicion abajo ~

      }
      // Modalidad por kilometros
      else if(opcionesModalidad[1].select==true){
        distancia=Number(distanciaManual);
      }

      // Si la distancia es mayor a 30 kilometro
      if(distancia>30){

        costo=distancia-datosFijos.totalAnillos;
        costo=costo+datosFijos.horgura;

        console.log(costo);
        costo=Math.round(costo/10);
        console.log(costo);
        costo=costo*vehiSelect.cuota;
        costo=costo+vehiSelect.radio7_20a30;
      }
      else if(distancia<=30){
        // distancia=municiSelect[puntoSelect.nombreDistancia]
        if(distancia>0&&distancia<2){
          costo=vehiSelect.radio1_0a2;
          municiSelect=(provinciasParsed[1].municipios[0]);
        }
        else if(distancia>=2&&distancia<4){
          costo=vehiSelect.radio2_2a4;
          municiSelect=(provinciasParsed[1].municipios[1]);
        }
        else if(distancia>=4&&distancia<6){
          costo=vehiSelect.radio3_4a6;
          municiSelect=(provinciasParsed[1].municipios[2]);
        }
        else if(distancia>=6&&distancia<9){
          costo=vehiSelect.radio4_6a9;
          municiSelect=(provinciasParsed[1].municipios[3]);
        }
        else if(distancia>=9&&distancia<15){
          costo=vehiSelect.radio5_9a15;
          municiSelect=(provinciasParsed[1].municipios[4]);
        }
        else if(distancia>=15&&distancia<20){
          costo=vehiSelect.radio6_15a20;
          municiSelect=(provinciasParsed[1].municipios[5]);
        }
        else if(distancia>=20&&distancia<=30){
          costo=vehiSelect.radio7_20a30;
          municiSelect=(provinciasParsed[1].municipios[6]);
        }
        newResultadoGlobal.destino=municiSelect.label;
        newResultadoGlobal.provincia=provinciasParsed[1].label;
      }

      if(municiSelect.provincia=='Radio'){
        costo=vehiSelect[municiSelect.value],
        distancia=municiSelect.label;
      }

      // const formatoMoneda= new Intl.NumberFormat('en-US',{
      //   style:'currency',
      //   currency: 'DOP',
      //   minimumFractionDigits:0
      // });

      newResultadoGlobal={
        ...newResultadoGlobal,
        costo:costo.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }),
        precio: Math.round(costo/0.75).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }),
        distancia:distancia
      };
      setResultadoGlobla(newResultadoGlobal);
    }

  },[opcionesVehiculos, opcionesModalidad, opcionesPuntaPartida, provinciasParsed, distanciaManual, valoresMaster, datosFijos.totalAnillos, datosFijos.horgura]);

  // Municipio selecionado
  const [mapaDefault, setMapaDefault]=useState(opcionesPuntaPartida[0].mapa);

  return (

    <Container>
      <Header titulo={'Calculadora Fletes'} subTitulo='Main'/>
      <ElementoPrivilegiado
        userMaster={userMaster}
        privilegioReq={'fullAccessFletes'}
      >

        <ContainerNav>

          <CajaNavegacion
            pageSelected={0}
            dbUsuario={dbUsuario}
            userMaster={userMaster}
          />
        </ContainerNav>
      </ElementoPrivilegiado>

      <SeccionParametros>

        <OpcionUnica
          titulo='Modalidad'
          name='modalidad'
          arrayOpciones={opcionesModalidad}
          handleOpciones={handleOpciones}
          width={width}
          flete={true}
          masPeque={true}
        />

        <OpcionUnica
          titulo='Punto de partida'
          name='puntoPartida'
          arrayOpciones={opcionesPuntaPartida}
          handleOpciones={handleOpciones}
          width={width}
          flete={true}
        />

      </SeccionParametros>

      <SeccionEntradaDatos className='oficial'>
        {
          opcionesModalidad[0].select?
            <>

              <CajaEntrada>
                <TituloSimple>
              Destinos:
                </TituloSimple>
                <InputDesplegable placeholder='Empiece a escribir el destino' value={muniSelect} list='municipios' onChange={(e)=>handleSelectMun(e)}/>
                <DataList id='municipios'>
                  {
                    provinciasParsed.flatMap(provincia => provincia.municipios).map((mun,index)=>{
                      return(
                        <Opcion
                          value={mun.label}
                          key={index}>
                          {mun.provinciaPadre}
                        </Opcion>
                      );
                    })
                  }

                </DataList>
              </CajaEntrada>
            </>
            :
            <CajaEntrada className='cajaDistancia'>
              <TituloSimple>
            Ingrese distancia en Km:
              </TituloSimple>
              <InputSencillo
                placeholder='0'
                value={distanciaManual}
                onChange={(e)=>handleDistanciaManual(e)}
              />

            </CajaEntrada>
        }
      </SeccionEntradaDatos>

      <SeccionEntradaDatos className='seccionCamiones'>
        <TituloSimple>Unidad Vehicular:</TituloSimple>
        <CajaCamiones>
          {
            opcionesVehiculos?.map((vehiculo,index)=>{
              return(
                <Card
                  className={
                    vehiculo.select==true?
                      'selected'
                      :
                      ''}

                  data-id={index}
                  key={index}
                  onClick={(e)=>{handleVehiculo(e);}}
                >
                  <EnlacePrincipal>
                    <div>
                      <TextoCard
                        data-id={index}
                        onClick={(e)=>{handleVehiculo(e);}}
                      >{vehiculo.descripcion}</TextoCard>
                    </div>
                    <CajaImagen>
                      <ImagenCarro
                        src={vehiculo.urlFoto}
                        data-id={index}
                        onClick={(e)=>{handleVehiculo(e);}}
                      />
                    </CajaImagen>

                  </EnlacePrincipal>
                </Card>
              );
            })
          }
        </CajaCamiones>

      </SeccionEntradaDatos>

      <SeccionSalidaDatos>
        <CajaInput>
          <TextoInput>Costo</TextoInput>
          <ParrafoSalida>
            {
              resultadoGlobal.costo=='-'?
                '-'
                :
                resultadoGlobal.costo
            }
          </ParrafoSalida>
        </CajaInput>

        <CajaInput>
          <TextoInput>Precio</TextoInput>
          <ParrafoSalida>
            {
              resultadoGlobal.precio=='-'?
                '-'
                :
                resultadoGlobal.precio}</ParrafoSalida>
        </CajaInput>

        <CajaInput>
          <TextoInput>Distancia</TextoInput>
          <ParrafoSalida>
            {
              resultadoGlobal.distancia=='-'?
                '-'
                :
                resultadoGlobal.distancia +'KM'
            }</ParrafoSalida>
        </CajaInput>
        <CajaInput>
          <TextoInput>Destino</TextoInput>
          <ParrafoSalida>
            {
              resultadoGlobal.destino=='-'?
                '-'
                :
                resultadoGlobal.destino
            }</ParrafoSalida>
        </CajaInput>
        <CajaInput>
          <TextoInput>Provincia</TextoInput>
          <ParrafoSalida>
            {
              resultadoGlobal.provincia=='-'?
                '-'
                :
                resultadoGlobal.provincia
            }</ParrafoSalida>
        </CajaInput>

      </SeccionSalidaDatos>

      <SeccionMapa className={rutaPeligrosa?'peligro':''}>
        {
          rutaPeligrosa?
            <TextoPeligro>
              RUTA PELIGROSA
            </TextoPeligro>
            :
            ''

        }
        <div >
          <MapaGoogle src={
            resultadoGlobal.mapa?
              resultadoGlobal.mapa
              :
              mapaDefault
          }

          ></MapaGoogle>
        </div>
      </SeccionMapa>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />

      <AvisoModal
        tituloMain={'Ruta peligrosa'}
        tituloSecond={'Aviso'}
        hasModal={hasModal}
        setHasModal={setHasModal}>
        <CajaAviso>
          <TextoAviso>
              Miches se considera una ruta peligrosa, por lo cual es necesario que la ruta a utilizar sea a través de Punta Cana, a continuación algunas recomendaciones:
          </TextoAviso>
          <ListaDesordenada>
            <ElementosLista>Buscar asesoramiento con personal del área. </ElementosLista>
            <ElementosLista>Conversar con el chofer sobre el potencial peligro. </ElementosLista>
            <ElementosLista>Evaluar rutas seguras. </ElementosLista>
            <ElementosLista>Enviar un chofer experimentado. </ElementosLista>
            <ElementosLista>Indicarle al chofer que realice un chequeo de su unidad vehicular; frenos, neumáticos, luces y demás. </ElementosLista>

          </ListaDesordenada>

        </CajaAviso>
      </AvisoModal>

    </Container>

  );
};

const Container=styled.div`
  position: relative;
`;
const CajaAviso=styled.div`
  
`;
const TextoAviso=styled.div`
  color: ${theme.azul2};
  `;
const ListaDesordenada=styled.ul`
  margin-left: 35px;
  color: ${theme.azul1};
  
`;
const ElementosLista=styled.li`
  
`;
// const SeccionParametros = styled.section`
//   margin-top: 10px;
//   display: flex;
//   justify-content: start;
//   align-items: center;
//   flex-direction: row;
//   margin-bottom: 15px;

//   @media screen and (max-width: 900px){

//       flex-direction: column;
//       justify-content: start;
//       align-items: start;
//     }

// `

const SeccionParametros = styled.section`
  margin-top: 10px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
  padding: 15px;
@media screen and (max-width: 500px){
  flex-direction: column;
  /* border: 1px solid red; */
  gap: 5px;
  justify-content: start;
  align-items: start;
}
`;
const SeccionEntradaDatos = styled.div`
  width: 100%;
  /* border: 1px solid black; */
  display: flex;
  flex-direction: row;
  justify-content: center;

  &.seccionCamiones{
    padding: 10px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
  }
  &.oficial{
    /* margin-bottom: 50px; */
  }

`;

const CajaEntrada= styled.div`
  display: flex;
  align-items: center;
  /* width: 40%; */
  /* height: 2rem; */
  margin-right: 25px;
  &.cajaDistancia{
    width:60% 
  }

  @media screen and (max-width: 500px){
    width: 100%;
    height: auto;
    padding: 5px;
    flex-direction: column;
    margin: 0;
  }

`;
const TituloSimple = styled.h2`
font-size: 16px;
    font-weight: 400;
    display: inline-block;
    color: #fff;
    margin-bottom: 8px;
    margin-left: 20px;
    border-bottom: 1px solid #fff;
    margin-right: 15px;
`;
const CajaCamiones = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;

  /* flex-wrap: wrap; */
  @media screen and (max-width: 500px){
    width: 100%;
    margin: 0;
    flex-wrap: wrap;
  }
  
`;

const ImagenCarro = styled.img`
  width: 100%;
    height: 100%;
    object-fit: contain;
 
`;

const Card = styled.div`
     width: 20%;
    height: 200px;
    border:2px solid  #535353;
    overflow: hidden;
    border-radius: 20px 0 20px 0;
    box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);
    margin: 0 5px;
    transition: border 0.4s ease;
    transition: width ease 0.5s ;
    &:hover{
        border:2px solid  ${theme.azul2};
        /* width: 40%; */
        cursor: pointer;
    }
    &.selected{
      border:2px solid  ${theme.azul2};
        width: 50%;
    }


    @media screen and (max-width:550px) {
      min-width: 33%;
      width: 50%;
      height: auto;
      flex-wrap: wrap;
      &.selected{
        border:2px solid  ${theme.azul2};
        width: 100%;
      }
      
    }

    /* width: calc(30.33% - 10px);
  margin: 5px; */ 

`;
const EnlacePrincipal = styled.div`
display: flex;
flex-direction: column;
    text-decoration: none;
    /* opacity: 0.5; */
    position: relative;
    border-radius

    &:hover{
        opacity: 1;
    animation: arroz 1s;
    animation-direction: normal;}


    @keyframes arroz{
    0%{
        opacity: 0.6;
    }
    100%{
        opacity: 1;
    }

    
}


`;

const CajaImagen = styled.div`
    display: block;
    width: 100%;
    height: 80%;
    background-size: contain;
    background-repeat: no-repeat;
    object-fit: cover;
    background-position: center;

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
   
  
`;

const TextoCard = styled.h2`
    color:  white;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 200;
    text-align: center;
    background-color: ${theme.success};
    height: 2rem;
    padding: 5px;
`;

const SeccionSalidaDatos = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  margin: auto;
  gap: 5px;
  margin-bottom: 20px;

`;

const CajaInput=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`;

const ParrafoSalida = styled.p`
  background-color: ${theme.fondo};
  color: white;
  min-width:100px;
  padding: 0 10px;
  /* width: 150px; */
  height: 1.9rem;
  font-size: 0.9rem;
  border-radius: 5px;
  text-align: center;
  line-height: 1.8rem;
  align-items:center;
  outline: none;
  border: 1px solid black;
  
`;
const InputSencillo = styled.input`
   background-color: ${theme.fondo};
  color: white;
  min-width:150px;
  padding: auto 5px;
  /* width: 150px; */
  height: 1.9rem;
  font-size: 0.9rem;
  border-radius: 5px;
  text-align: center;
  line-height: 1.8rem;
  align-items:center;
  outline: none;
  border: 1px solid black;
  &.anchoPagina{
    background-color: ${theme.fondo};
  }
`;

const TextoInput = styled.h2`
  font-size: 1.2rem;
  color: white;
  font-weight: lighter;
  
`;

const SeccionMapa= styled.div`
  margin-bottom: 100px;
  &.peligro{
    border: 12px solid ${theme.danger};
    background-color: ${theme.danger};
  }
`;
const TextoPeligro=styled.h2`
  color: white;
  width: 100%;
  text-align: center;
  font-size: 28px;
  letter-spacing: 4px;
`;

const MapaGoogle = styled.iframe`
  width: 95%;
  display: block;
  margin: auto;
  height: 500px;
  border-radius: 5px;
  border: none;
  box-shadow: 5px 5px 5px -1px rgba(0,0,0,0.43);
`;

const InputDesplegable=styled.input`
  width: 300px;
  height: 35px;
  padding: 5px;
  border: none;
  border: 1px solid black;
  border-radius: 5px;

  outline: none;
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul2};
  display: flex;
  &:focus{
    border: 1px solid ${theme.azul2};
  }

  @media screen and (max-width: 550px){
    width: 85%;
  }
`;
const DataList=styled.datalist`
  background-color: red;
  width: 150%;
`;

const Opcion=styled.option`
background-color: red;
`;

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