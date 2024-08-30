import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Materiales } from "./materiales/Materiales";
import "./app.css";
import { ListaPage } from "./materiales/page/ListaPage";
import { MenuLateral } from "./components/MenuLateral";
import { Fletes } from "./fletes/Fletes";
import { SetupFletes } from "./fletes/Setup";
import ContenedorPrincipal from "./components/ContenedorPrincipal";
import { Transportes } from "./transportes/Transportes";
import { Mantenimiento } from "./mantenimiento/Mantenimiento.jsx";
import { Main } from "./importaciones/page/Main";
import { Maestros } from "./importaciones/page/maestros";
import { ListaArticulo } from "./importaciones/template/ListaArticulo";
import { Seguimientos } from "./importaciones/page/Seguimientos";
import { ListaOrdenCompra } from "./importaciones/template/ListaOrdenCompra";
import { ListaBillOfLading } from "./importaciones/Template/ListaBillOfLading";
import { Ciclo } from "./importaciones/page/Ciclo";
import { Register } from "./auth/Register.jsx";
import { Login } from "./auth/Login";
import { LogOut } from "./auth/LogOut";
import { Page404 } from "./page/Page404";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { Perfil } from "./page/Perfil";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { RutaProtegida } from "./context/RutaProtegida";
// import { AvisoTop } from './components/Avisos/AvisoTop';
import { ResetPass } from "./auth/ResetPass";
import { Dashboard } from "./dashboard/Dashboard";
import { ListaFurgon } from "./importaciones/Template/ListaFurgon";
import { ListaUsuarios } from "./dashboard/ListaUsuarios";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "./firebase/firebaseConfig";
import { Alerta } from "./components/Alerta";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Documentacion } from "./page/documentacion/Documentacion";
import { ListaUsers } from "./dashboard/ListaUsers";
import { Tutoriales } from "./components/tutoriales/Tutoriales";
import { Setup } from "./importaciones/page/Setup";
import { RutaPrivilegiada } from "./context/RutaPrivilegiada";
import { Home } from "./page/Home.jsx";
import { Omar } from "./omar/Omar.jsx";

const App = () => {
  // ******************** RECURSOS GENERALES ******************** //
  useEffect(() => {
    document.title = "Caeloss - Home";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const auth = getAuth();
  const { usuario } = useAuth();
  const usuarioFireBase = auth.currentUser;

  let location = useLocation();
  let lugar = location.pathname;

  // // ******************** OBTENIENDO LAS BASES DE DATOS ******************** //
  const [dbBillOfLading, setDBBillOfLading] = useState([]);
  const [dbOrdenes, setDBOrdenes] = useState([]);
  const [userMaster, setUserMaster] = useState();
  const [dbUsuario, setDBUsuario] = useState([]);
  const [dbResennias, setDBResennias] = useState([]);
  const [dbTutoriales, setDBTutoriales] = useState([]);
  const [dbOmarMiguel, setDBOmarMiguel] = useState([]);

  // ************************** DAME UN GRUPO DE DOC POR CONDICION**************************
  const useDocByCondition = (
    collectionName,
    setState,
    exp1,
    condicion,
    exp2
  ) => {
    useEffect(() => {
      if (usuario) {
        console.log("BASE de Datos 📄📄📄📄👨‍🏫👨‍🏫👨‍🏫📄📄👨‍🏫👨‍🏫");
        let q = "";

        if (exp1) {
          q = query(
            collection(db, collectionName),
            where(exp1, condicion, exp2)
          );
        } else {
          q = query(collection(db, collectionName));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const colecion = [];
          querySnapshot.forEach((doc) => {
            // console.log(doc.data())
            colecion.push({ ...doc.data(), id: doc.id });
          });
          setState(colecion);
        });
        // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
        return () => unsubscribe();
      }
    }, [collectionName, setState, exp1, condicion, exp2]);
  };

  // ************************** DAME SOLO UN DOC POR ID**************************
  const useDocById = (collectionName, setState, idUsuario) => {
    useEffect(() => {
      if (usuario) {
        const unsub = onSnapshot(doc(db, collectionName, idUsuario), (doc) => {
          setState({ ...doc.data(), id: doc.id });
        });
        // Devolver una función de limpieza para detener la escucha cuando el componente se desmonte
        return () => unsub();
      }
    }, [collectionName, setState, idUsuario]);
  };
  useDocByCondition("ordenesCompra", setDBOrdenes);
  useDocByCondition("usuarios", setDBUsuario);
  useDocByCondition("resennias", setDBResennias, "estadoDoc", "==", 0);
  useDocByCondition("billOfLading", setDBBillOfLading, "estadoDoc", "==", 0);
  useDocByCondition("tutoriales", setDBTutoriales);
  let idUsuario = usuario?.uid ? usuario.uid : "00";
  useDocById("usuarios", setUserMaster, idUsuario);
  useDocByCondition("omarMiguel", setDBOmarMiguel);

  // // ******************** CONFIRMAR EMAIL ******************** //
  const confirmarEmail = () => {
    var actionCodeSettings = { url: "https://caeloss.com" };
    sendEmailVerification(usuario, actionCodeSettings)
      .then(function () {
        setMensajeAlerta("Email enviado.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      })
      .catch(function (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      });
  };

  // // ******************** REGISTRAR VISITAS DE USUARIOS ******************** //
  // BLoque de codigo provisional
  useEffect(() => {
    console.log("La URL ha cambiado a:", location.pathname);
    let registrosActividad = {};
    let visitas = [];
    if (userMaster) {
      if (userMaster.registrosActividad) {
        registrosActividad = userMaster.registrosActividad;
        visitas = userMaster.registrosActividad.visitas;
      }
      visitas.push({
        url: location.pathname,
        fecha: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, { locale: es }),
      });
      registrosActividad.visitas = visitas;

      const userActualizar = doc(db, "usuarios", userMaster.id);
      updateDoc(userActualizar, {
        ...userMaster,
        registrosActividad: registrosActividad,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <ContenedorPrincipal>
      <MenuLateral userMaster={userMaster} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              usuario={usuario}
              usuarioFireBase={usuarioFireBase}
              setDBTutoriales={setDBTutoriales}
              dbUsuario={dbUsuario}
              dbTutoriales={dbTutoriales}
              userMaster={userMaster}
              dbResennias={dbResennias}
              auth={auth}
            />
          }
        />
        {lugar !== "/version1" ? <Route path="*" element={<Page404 />} /> : ""}

        <Route
          path="/perfiles/:id"
          element={
            <RutaProtegida>
              <ListaUsers dbUsuario={dbUsuario} />
            </RutaProtegida>
          }
        />

        <Route
          path="/materiales"
          element={
            <RutaProtegida>
              <Materiales />
            </RutaProtegida>
          }
        />

        <Route
          path="/materiales/:id"
          element={
            <RutaProtegida>
              <ListaPage />
            </RutaProtegida>
          }
        />

        <Route
          path="/fletes"
          element={
            <RutaProtegida>
              <Fletes dbUsuario={dbUsuario} userMaster={userMaster} />
            </RutaProtegida>
          }
        />

        <Route
          path="/fletes/setup/"
          element={
            <RutaProtegida>
              <RutaPrivilegiada
                userMaster={userMaster}
                privilegioReq={"fullAccessFletes"}
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
          }
        />

        <Route
          path="/importaciones"
          element={
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
          }
        />

        <Route
          path="/importaciones/maestros/"
          element={
            <RutaProtegida>
              <Maestros dbUsuario={dbUsuario} userMaster={userMaster} />
            </RutaProtegida>
          }
        />
        <Route
          path="/importaciones/maestros/contenedores"
          element={
            <RutaProtegida>
              <ListaFurgon
                dbBillOfLading={dbBillOfLading}
                setDBBillOfLading={setDBBillOfLading}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/importaciones/maestros/articulos"
          element={
            <RutaProtegida>
              <ListaArticulo
                dbOrdenes={dbOrdenes}
                dbBillOfLading={dbBillOfLading}
                setDBBillOfLading={setDBBillOfLading}
                setDBOrdenes={setDBOrdenes}
                userMaster={userMaster}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/importaciones/maestros/ordenescompra"
          element={
            <RutaProtegida>
              <ListaOrdenCompra
                dbOrdenes={dbOrdenes}
                setDBOrdenes={setDBOrdenes}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
                usuario={usuario}
              />
            </RutaProtegida>
          }
        />

        <Route
          path="/importaciones/maestros/billoflading"
          element={
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
          }
        />
        <Route
          path="/importaciones/maestros/contenedores/:id"
          element={
            <RutaProtegida>
              <ListaFurgon
                dbBillOfLading={dbBillOfLading}
                setDBBillOfLading={setDBBillOfLading}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/importaciones/maestros/articulos/:id"
          element={
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
          }
        />
        <Route
          path="/importaciones/maestros/ordenescompra/:id"
          element={
            <RutaProtegida>
              <ListaOrdenCompra
                dbOrdenes={dbOrdenes}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/importaciones/maestros/billoflading/:id"
          element={
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
          }
        />
        <Route
          path="/importaciones/seguimientos/"
          element={
            <RutaProtegida>
              <Seguimientos
                dbUsuario={dbUsuario}
                userMaster={userMaster}
                dbOrdenes={dbOrdenes}
                dbBillOfLading={dbBillOfLading}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/importaciones/ciclo/"
          element={
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
          }
        />

        <Route
          path="/importaciones/setup/"
          element={
            <RutaProtegida>
              <RutaPrivilegiada
                userMaster={userMaster}
                dbUsuario={dbUsuario}
                privilegioReq={"fullAccessIMS"}
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
          }
        />
        <Route
          path="/transportes"
          element={
            <RutaProtegida>
              <Transportes />
            </RutaProtegida>
          }
        />
        <Route
          path="/omar"
          element={
            // <RutaProtegida>
            <Omar
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              dbOmarMiguel={dbOmarMiguel}
              setDBOmarMiguel={setDBOmarMiguel}
            />
            // </RutaProtegida>
          }
        />
        <Route
          path="/omar/:id"
          element={
            // <RutaProtegida>
            <Omar
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              dbOmarMiguel={dbOmarMiguel}
              setDBOmarMiguel={setDBOmarMiguel}
            />
            // </RutaProtegida>
          }
        />
        <Route
          path="/omar/:id/:param2"
          element={
            // <RutaProtegida>
            <Omar
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              dbOmarMiguel={dbOmarMiguel}
              setDBOmarMiguel={setDBOmarMiguel}
            />
            // </RutaProtegida>
          }
        />
        {/* <Route path='/mantenimiento' element={
          <RutaProtegida>
            <Mantenimiento
              dbUsuario={dbUsuario}
              userMaster={userMaster}
            />
          </RutaProtegida>
        }/> */}
        <Route
          path="/tutoriales"
          element={
            <RutaProtegida>
              <Tutoriales
                setDBTutoriales={setDBTutoriales}
                dbTutoriales={dbTutoriales}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />
            </RutaProtegida>
          }
        />

        <Route
          path="/tutoriales/:id"
          element={
            <RutaProtegida>
              <Tutoriales
                setDBTutoriales={setDBTutoriales}
                dbTutoriales={dbTutoriales}
                dbUsuario={dbUsuario}
                userMaster={userMaster}
              />
            </RutaProtegida>
          }
        />

        <Route
          path="/documentacion"
          element={
            <RutaProtegida>
              <Documentacion />
            </RutaProtegida>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <RutaPrivilegiada
                userMaster={userMaster}
                privilegioReq="fullAccessDashboard"
              >
                <Dashboard useDocByCondition={useDocByCondition} />
              </RutaPrivilegiada>
            </RutaProtegida>
          }
        />
        <Route
          path="/dashboard/usuarios/"
          element={
            <RutaProtegida>
              <RutaPrivilegiada
                privilegioReq="fullAccessDashboard"
                userMaster={userMaster}
              >
                <ListaUsuarios
                  dbUsuario={dbUsuario}
                  setDBUsuario={setDBUsuario}
                />
              </RutaPrivilegiada>
            </RutaProtegida>
          }
        />
        <Route
          path="/dashboard/usuarios/:id"
          element={
            <RutaProtegida>
              <RutaPrivilegiada
                privilegioReq="fullAccessDashboard"
                userMaster={userMaster}
              >
                <ListaUsuarios
                  userMaster={userMaster}
                  useDocByCondition={useDocByCondition}
                />
              </RutaPrivilegiada>
            </RutaProtegida>
          }
        />

        <Route path="/registro" element={<Register auth={auth} />} />
        <Route path="/acceder" element={<Login auth={auth} />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/recuperar" element={<ResetPass />} />
        <Route
          path="/perfil"
          element={
            <Perfil
              dbUsuario={dbUsuario}
              userMaster={userMaster}
              setUserMaster={setUserMaster}
            />
          }
        />
      </Routes>

      {lugar == "/" ? "" : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </ContenedorPrincipal>
  );
};
export default App;
