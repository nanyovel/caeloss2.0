import { styled } from 'styled-components';
import { NavLink, Route, Routes, useLocation} from 'react-router-dom';
import theme from '../theme';
import logoCielos from './../public/img/cielos.png';
import { CardHome } from './components/CardHome';
import { Materiales } from './materiales/Materiales';
import './app.css';
import { ListaPage } from './materiales/page/ListaPage';
import logoCaeloss from './../public/img/logoOficial2.svg';
import { MenuLateral } from './components/MenuLateral';
import { Fletes } from './fletes/Fletes';
import { SetupFletes } from './fletes/Setup';
import ContenedorPrincipal from './components/ContenedorPrincipal';
import ImagenCardMateriales from './../public/img/cardHomeComp/build.png';
import ImagenCardFletes from './../public/img/cardHomeComp/truck.png';
import ImagenCardImportacion from './../public/img/cardHomeComp/import33.png';
import ImagenCardTransportes from './../public/img/cardHomeComp/transportes.png';
// import ImagenCardMantenimiento from './../public/img/cardHomeComp/mante1.png';
import noCorreo from './../public/img/cardHomeComp/noCorreo.png';
// import ImgCerrado from './../public/img/candadoCerrado.png'
// import { Error404 } from '../public/404'
import { Transportes } from './transportes/Transportes';
// import {  Mantenimiento } from './mantenimiento/Mantenimiento'
import { Main } from './importaciones/page/Main';
import { Maestros } from './importaciones/page/maestros';
import { ListaArticulo } from './importaciones/template/ListaArticulo';
import { Seguimientos } from './importaciones/page/Seguimientos';
import { ListaOrdenCompra } from './importaciones/template/ListaOrdenCompra';
import { ListaBillOfLading } from './importaciones/Template/ListaBillOfLading';
import { Ciclo } from './importaciones/page/Ciclo';
import { Register } from './routes/Register';
import { Login } from './routes/Login';
import { LogOut } from './routes/LogOut';
import { Page404 } from './routes/Page404';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Perfil } from './routes/Perfil';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { RutaProtegida } from './routes/RutaProtegida';
import { Autenticado } from './context/Autenticado';
// import { AvisoCaja } from './components/Avisos/AvisoCaja'
import { AvisoTop } from './components/Avisos/AvisoTop';
import { ResetPass } from './routes/ResetPass';
import { Dashboard } from './dashboard/Dashboard';
import { ListaFurgon } from './importaciones/Template/ListaFurgon';
import { ListaUsuarios } from './dashboard/ListaUsuarios';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import db from './firebase/firebaseConfig';
import { Alerta } from './components/Alerta';
// import { BotonQuery } from './components/BotonQuery'
// import { BtnGeneralButton } from './components/BtnGeneralButton'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// import { FrasesCelebres } from './components/FrasesCelebres'
import { Resennias } from './resennias/Resennias';
import { DocumentacionParcial } from './documentacion/DocumentacionParcial';
import { Documentacion } from './documentacion/Documentacion';
import { ListaUsers } from './routes/ListaUsers';
import { Tutoriales } from './tutoriales/Tutoriales';
import { TutorialesParcial } from './tutoriales/TutorialesParcial';
import { Setup } from './importaciones/page/Setup';
import { RutaPrivilegiada } from './routes/RutaPrivilegiada';
import { Mantenimiento } from './mantenimiento/Mantenimiento';
import { NoCorreos } from './nocorreos/NoCorreos';
// import {MainMante} from './mantenimiento/page/Main';
// import { Programa } from './mantenimiento/page/Programa';
// import { Gastos } from './mantenimiento/page/Gastos';
// import { Combustibles } from './mantenimiento/page/Combustibles';
// import { Tickets } from './mantenimiento/page/Tickets';

const App = () => {
  console.log('App');
  // ******************** RECURSOS GENERALES ******************** //
  useEffect(()=>{
    document.title = "Caeloss - Home";
    return () => {
      document.title = "Caeloss";
    };
  },[]);

  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const auth=getAuth();
  const {usuario}=useAuth();
  const usuarioFireBase=auth.currentUser;

  let location = useLocation();
  let lugar = location.pathname;

  // // ******************** OBTENIENDO LAS BASES DE DATOS ******************** //
  const [dbBillOfLading, setDBBillOfLading] = useState([]);
  const [dbOrdenes,setDBOrdenes]=useState([]);
  const [userMaster, setUserMaster]=useState();
  const [dbUsuario, setDBUsuario] = useState([]);
  const [dbResennias, setDBResennias]=useState([]);
  const [dbTutoriales, setDBTutoriales]=useState([]);

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
  useDocByCondition('ordenesCompra', setDBOrdenes);
  useDocByCondition('usuarios', setDBUsuario);
  useDocByCondition('resennias', setDBResennias,'estadoDoc',"==",0);
  useDocByCondition('billOfLading', setDBBillOfLading, 'estadoDoc',"==",0);
  useDocByCondition('tutoriales', setDBTutoriales);
  let idUsuario=usuario?.uid?usuario.uid:'00';
  useDocById('usuarios', setUserMaster,idUsuario);

  // // ******************** CONFIRMAR EMAIL ******************** //
  const confirmarEmail=()=>{
    var actionCodeSettings = {url:'https://caeloss.com'};
    sendEmailVerification(usuario,actionCodeSettings)
      .then(function() {
        setMensajeAlerta('Email enviado.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      })
      .catch(function(error) {
        console.log(error);
        setMensajeAlerta('Error con la base de datos.');
        setTipoAlerta('success');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      });
  };

  // // ******************** REGISTRAR VISITAS DE USUARIOS ******************** //
  // BLoque de codigo provisional
  useEffect(()=>{
    console.log('La URL ha cambiado a:', location.pathname);
    let registrosActividad={};
    let visitas=[];
    if(userMaster){
      if(userMaster.registrosActividad){
        registrosActividad=userMaster.registrosActividad;
        visitas=userMaster.registrosActividad.visitas;
      }
      visitas.push(
        {
          url:location.pathname,
          fecha:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
        }
      );
      registrosActividad.visitas=visitas;

      const userActualizar = doc(db, "usuarios", userMaster.id);
      updateDoc(
        userActualizar,
        {
          ...userMaster,
          registrosActividad:registrosActividad} );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location]);
  return (
    <ContenedorPrincipal >
      <MenuLateral userMaster={userMaster}/>
      <Routes>
        <Route path='/' element={
          <>
            <CabezaHome >
              <CajaLogoCaeloss>
                <LogoC src={logoCaeloss} alt="" />
                <TituloMain>aeloss <Vol> 2.0</Vol>
                </TituloMain>
              </CajaLogoCaeloss>
              {
                usuario?
                  <LogoCielos src={logoCielos} />
                  :
                  null
              }
            </CabezaHome>
            {
              usuario?
                usuario.emailVerified==false?
                  <AvisoTop
                    ctaTexto={'Enviar enlace'}
                    cta={()=>confirmarEmail()}
                  />
                  :
                  null
                :
                null
            }
            <SeccionHome>
              <div>
                <TituloModulo>Sistemas y apps:</TituloModulo>
              </div>
              <PadreTarjetas>
                <CardHome
                  ImagenCard={ImagenCardMateriales}
                  titulo='Materiales'
                  title='Potente calculadora de materiales de construccion'
                  ruta='/materiales'
                  bloqueado={!usuario?.emailVerified?true:false}
                />

                <CardHome
                  ImagenCard={ImagenCardFletes}
                  titulo='Fletes'
                  title='Calculadora avanzada de fletes'
                  ruta='/fletes'
                  bloqueado={!usuario?.emailVerified?true:false}
                />
                <CardHome
                  ImagenCard={ImagenCardImportacion}
                  titulo='Importaciones'
                  title='Sistema moderno de gestion de importaciones'
                  ruta='importaciones'
                  bloqueado={!usuario?.emailVerified?true:false}
                  nuevo={true}/>
                <CardHome
                  ImagenCard={ImagenCardTransportes}
                  titulo='Transportes'
                  title='Sistema de gestion de transporte (Transport Management System  TMS)'
                  ruta='transportes'
                  // nuevo={true}
                  incompleto={true}
                  bloqueado={!usuario?.emailVerified?true:false}
                  tipo='transporte'
                />
                <CardHome
                  ImagenCard={noCorreo}
                  titulo='N° Email'
                  title='Enumerador de correos'
                  ruta='nocorreos'
                  // nuevo={true}
                  bloqueado={!usuario?.emailVerified?true:false}
                />
                {/* <CardHome
                  ImagenCard={ImagenCardMantenimiento}
                  titulo='Mantenimiento'
                  title='Sistema de gestion de mantenimiento (Maintenance Management Systems (MMS))'
                  ruta='mantenimiento'
                  // nuevo={true}
                  incompleto={true}
                  tipo={'mantenimiento'}
                  bloqueado={!usuario?.emailVerified?true:false}
                /> */}

              </PadreTarjetas>
            </SeccionHome>
            {
              !usuarioFireBase?
                <>
                  <SeccionHome>
                    <TituloModulo>Registrarse:</TituloModulo>
                    <Register
                      home={true}
                      auth={auth}
                    />
                  </SeccionHome>

                  <SeccionHome>
                    <TituloModulo>Acceder:</TituloModulo>
                    <Login
                      home={true}
                      auth={auth}

                    />
                  </SeccionHome>

                </>
                :
                null
            }

            {/* <FrasesCelebres/> */}

            {/* <VideoMostrar/> */}

            <Autenticado>
              <SeccionHome>
                <TituloModulo><Enlaces to={'/tutoriales'}> Tutoriales:</Enlaces></TituloModulo>
                <TutorialesParcial
                  setDBTutoriales={setDBTutoriales}
                  dbTutoriales={dbTutoriales}
                  dbUsuario={dbUsuario}
                  userMaster={userMaster}

                />
              </SeccionHome>
            </Autenticado>

            <Autenticado>
              <SeccionHome>
                <TituloModulo>Reseñas:</TituloModulo>
                <Resennias
                  dbUsuario={dbUsuario}
                  userMaster={userMaster}
                  dbResennias={dbResennias}
                  inicio={true}
                />
              </SeccionHome>
            </Autenticado>

            <Autenticado>
              <SeccionHome>
                <TituloModulo><Enlaces to={'/documentacion'}> Acerca de:</Enlaces></TituloModulo>
                <DocumentacionParcial/>
              </SeccionHome>
            </Autenticado>

          </>
        }/>
        {
          lugar!=="/version1"?
            <Route path='*' element={ <Page404/>}/>
            :
            ''
        }

        <Route path='/perfiles/:id' element={
          <RutaProtegida>
            <ListaUsers
              dbUsuario={dbUsuario}
            />
          </RutaProtegida>
        }/>

        <Route path='/materiales' element={
          <RutaProtegida>
            <Materiales/>
          </RutaProtegida>
        }/>

        <Route path='/materiales/:id' element={
          <RutaProtegida>
            <ListaPage/>
          </RutaProtegida>
        }/>

        <Route path='/fletes' element={
          <RutaProtegida>
            <Fletes
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>

        <Route path='/fletes/setup/' element={
          <RutaProtegida>
            <RutaPrivilegiada
              userMaster={userMaster}
              privilegioReq={'fullAccessFletes'}
            >
              <SetupFletes
                dbBillOfLading={dbBillOfLading}
                setDBBillOfLading={setDBBillOfLading}
                dbOrdenes={dbOrdenes}
                setDBOrdenes={setDBOrdenes}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />
            </RutaPrivilegiada>
          </RutaProtegida>
        }/>

        <Route path='/importaciones' element={
          <RutaProtegida>
            <Main
              dbBillOfLading={dbBillOfLading}
              dbOrdenes={dbOrdenes}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}

            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/' element={
          <RutaProtegida>
            <Maestros
              dbUsuario={dbUsuario}
              userMaster={userMaster}

            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/contenedores' element={
          <RutaProtegida>
            <ListaFurgon
              dbBillOfLading={dbBillOfLading}
              setDBBillOfLading={setDBBillOfLading}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/articulos' element={
          <RutaProtegida>
            <ListaArticulo
              dbOrdenes={dbOrdenes}
              dbBillOfLading={dbBillOfLading}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/ordenescompra' element={
          <RutaProtegida>
            <ListaOrdenCompra
              dbOrdenes={dbOrdenes}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              usuario={usuario}
            />
          </RutaProtegida>
        }/>

        <Route path='/importaciones/maestros/billoflading' element={
          <RutaProtegida>
            <ListaBillOfLading
              dbOrdenes={dbOrdenes}
              dbBillOfLading={dbBillOfLading}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}

            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/contenedores/:id' element={
          <RutaProtegida>
            <ListaFurgon
              dbBillOfLading={dbBillOfLading}
              setDBBillOfLading={setDBBillOfLading}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/articulos/:id' element={
          <RutaProtegida>
            <ListaArticulo
              dbOrdenes={dbOrdenes}
              dbBillOfLading={dbBillOfLading}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/ordenescompra/:id' element={
          <RutaProtegida>
            <ListaOrdenCompra
              dbOrdenes={dbOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}

            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/maestros/billoflading/:id' element={
          <RutaProtegida>
            <ListaBillOfLading
              dbOrdenes={dbOrdenes}
              dbBillOfLading={dbBillOfLading}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/seguimientos/' element={
          <RutaProtegida>
            <Seguimientos
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              dbOrdenes={dbOrdenes}
              dbBillOfLading={dbBillOfLading}
            />
          </RutaProtegida>
        }/>
        <Route path='/importaciones/ciclo/' element={
          <RutaProtegida>
            <Ciclo
              dbOrdenes={dbOrdenes}
              dbBillOfLading={dbBillOfLading}
              setDBBillOfLading={setDBBillOfLading}
              setDBOrdenes={setDBOrdenes}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>

        {
          // console.log(dbUsuario)
        }
        <Route path='/importaciones/setup/' element={
          <RutaProtegida>
            <RutaPrivilegiada
              userMaster={userMaster}
              dbUsuario={dbUsuario}
              privilegioReq={'fullAccessIMS'}
            >
              <Setup
                dbBillOfLading={dbBillOfLading}
                setDBBillOfLading={setDBBillOfLading}
                dbOrdenes={dbOrdenes}
                setDBOrdenes={setDBOrdenes}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />
            </RutaPrivilegiada>
          </RutaProtegida>
        }/>

        <Route path='/transportes' element={
          <RutaProtegida>
            <Transportes/>
          </RutaProtegida>
        }/>

        <Route path='/mantenimiento' element={
          <RutaProtegida>
            <Mantenimiento
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/nocorreos' element={
          <RutaProtegida>
            <NoCorreos
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        {/* <Route path='/mantenimiento/programa' element={
          <RutaProtegida>
            <Programa
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/mantenimiento/gastos' element={
          <RutaProtegida>
            <Gastos
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/mantenimiento/combustible' element={
          <RutaProtegida>
            <Combustibles
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>
        <Route path='/mantenimiento/tickets' element={
          <RutaProtegida>
            <Tickets
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/> */}

        <Route path='/tutoriales' element={
          <RutaProtegida>
            <Tutoriales
              setDBTutoriales={setDBTutoriales}
              dbTutoriales={dbTutoriales}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>

        <Route path='/tutoriales/:id' element={
          <RutaProtegida>
            <Tutoriales
              setDBTutoriales={setDBTutoriales}
              dbTutoriales={dbTutoriales}
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/>

        <Route path='/documentacion' element={
          <RutaProtegida>
            <Documentacion/>
          </RutaProtegida>
        }/>
        <Route path='/dashboard' element={
          <RutaProtegida>
            <RutaPrivilegiada
              userMaster={userMaster}
              privilegioReq='fullAccessDashboard'
            >
              <Dashboard
                useDocByCondition={useDocByCondition}
              />
            </RutaPrivilegiada>
          </RutaProtegida>
        }/>
        <Route path='/dashboard/usuarios/' element={
          <RutaProtegida>
            <RutaPrivilegiada
              privilegioReq='fullAccessDashboard'
              userMaster={userMaster}
            >

              <ListaUsuarios
                dbUsuario={dbUsuario}
                setDBUsuario={setDBUsuario}
              />
            </RutaPrivilegiada>
          </RutaProtegida>
        }/>
        <Route path='/dashboard/usuarios/:id' element={
          <RutaProtegida>
            <RutaPrivilegiada
              privilegioReq='fullAccessDashboard'
              userMaster={userMaster}
            >
              <ListaUsuarios
                userMaster={userMaster}
                useDocByCondition={useDocByCondition}
              />
            </RutaPrivilegiada>
          </RutaProtegida>
        }/>

        <Route path='/registro' element={<Register auth={auth}/>}/>
        <Route path='/acceder' element={<Login auth={auth}/>}/>
        <Route path='/logout' element={<LogOut/>}/>
        <Route path='/recuperar' element={<ResetPass/>}/>
        <Route path='/perfil'
          element={
            <Perfil
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              setUserMaster={setUserMaster}
            />}/>
      </Routes>

      {
        lugar=='/'?
          ''
          :
          ''
      }
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </ContenedorPrincipal>

  );
};
export default App;

const CabezaHome = styled.div`
    width: 100%;
    background-color: ${theme.azulOscuro1Sbetav};
    border-bottom:1px solid  ;
    display: flex;    
    height: auto;
    justify-content: space-between;
`;

const CajaLogoCaeloss=styled.div`
  display: flex;
  justify-content: end;
  align-items: end;
`;

const TituloMain = styled.h1`
    font-family: 'Lato', sans-serif;
    font-size: 4rem;
    letter-spacing: -7px;
    font-family: 'Lato';
    font-weight: 200;
    color: rgb(255, 255, 255);
    margin: 0;
    display: flex;
    align-items: end;
    &:hover{
      cursor: pointer;
    }

    span{
      letter-spacing: -4px;
      margin-left: 15px;
    }
    @media screen and (max-width: 750px) {
      font-size: 2rem;
      letter-spacing: -2px;
      span{
      letter-spacing: -4px;
      margin-left: 4px;
    }
    }


`;
const LogoC = styled.img`
  height: 70px;

  @media screen and (max-width: 750px) {
      font-size: 3rem;
      height: 40px;
  }
`;

const LogoCielos = styled.img`
    height: 50px;
    border-radius: 5px;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    margin-right: 15px;
    margin-top: 15px;

    @media screen and (max-width: 750px) {
      height: 30px;
    }
  
`;

const SeccionHome = styled.div`
      padding: 10px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    margin-bottom: 50px;
    margin-left: 10px;
`;

const Titulo=styled.h2`
  font-size: 2rem;
  text-decoration: underline;
  color: white;
`;

const PadreTarjetas=styled.div`
  display: flex;
  justify-content: center;
  @media screen and (max-width: 750px) {
    flex-direction: column;
}
`;
const TituloModulo = styled(Titulo)`
    margin-bottom: 15px;
    color: ${theme.azul2};
    @media screen and (max-width: 400px) {
      font-size: 1.1rem;
    }
`;
const Vol=styled.span`
margin: 0;
  @media screen and (max-width: 750px) {
    font-size: 1.8rem;
    margin-left: 5px;
  }
`;
const Enlaces=styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover{
    text-decoration: underline;
  }`;