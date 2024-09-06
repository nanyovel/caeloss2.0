import { useLocation, useNavigate } from "react-router-dom";
import "./app.css";
import { MenuLateral } from "./components/MenuLateral";
import ContenedorPrincipal from "./components/ContenedorPrincipal";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { getAuth } from "firebase/auth";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "./firebase/firebaseConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MasterRoutes } from "./routes/MasterRoutes";
import { AvisoModal } from "./components/Avisos/AvisoModal";
import { BtnGeneralButton } from "./components/BtnGeneralButton";
import styled from "styled-components";

const App = () => {
  // ******************** RECURSOS GENERALES ******************** //
  useEffect(() => {
    document.title = "Caeloss - Home";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  const auth = getAuth();
  const usuarioPrueba = useAuth().usuario;
  const [usuario, setUsuario] = useState(usuarioPrueba);

  useEffect(() => {
    setUsuario(usuarioPrueba);
  }, [usuarioPrueba]);
  // console.log(usuario);

  // const emailVerified = usuario.auth.currentUser.emailVerified;

  let location = useLocation();
  let lugar = location.pathname;

  // // ******************** OBTENIENDO LAS BASES DE DATOS ******************** //
  const [dbBillOfLading, setDBBillOfLading] = useState([]);
  const [dbOrdenes, setDBOrdenes] = useState([]);
  const [userMaster, setUserMaster] = useState();
  const [dbUsuario, setDBUsuario] = useState([]);
  const [dbResennias, setDBResennias] = useState([]);
  const [dbTutoriales, setDBTutoriales] = useState([]);

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

  // Hacer que los usuarios se registren
  const [datosIncompletos, setDatosIncompletos] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (usuario?.emailVerified && userMaster) {
      if (
        userMaster.nombre == "" ||
        userMaster.apellido == "" ||
        userMaster.dpto == "" ||
        userMaster.posicion == "" ||
        userMaster.sucursal == ""
      ) {
        setDatosIncompletos(true);
        if (location.pathname == "/perfil") {
          setHasModal(false);
        } else {
          setHasModal(true);
        }
        // console.log(navigate());
      }
    }
  }, [usuario, userMaster]);

  const [hasModal, setHasModal] = useState(false);

  const goPerfil = () => {
    navigate("/perfil");
    setHasModal(false);
  };

  return (
    <ContenedorPrincipal>
      <MenuLateral userMaster={userMaster} />
      {datosIncompletos ? (
        <AvisoModal
          tituloMain={"Debe completar datos"}
          tituloSecond={
            "A solicitud de la dirrecion cada usuario de Caeloss debe completar sus datos de perfil, por ejemplo nombre, apellido y demas, dirigete a perfil y presiona editar para completar tus datos."
          }
          setHasModal={setHasModal}
          hasModal={hasModal}
          hasBtnClose={false}
          children={
            <CajaBtnModal>
              <BtnGeneralButton onClick={() => goPerfil()}>
                Ir a perfil
              </BtnGeneralButton>
            </CajaBtnModal>
          }
        />
      ) : null}
      <MasterRoutes
        usuario={usuario}
        dbTutoriales={dbTutoriales}
        setDBTutoriales={setDBTutoriales}
        dbUsuario={dbUsuario}
        userMaster={userMaster}
        dbResennias={dbResennias}
        auth={auth}
        dbBillOfLading={dbBillOfLading}
        setDBBillOfLading={setDBBillOfLading}
        dbOrdenes={dbOrdenes}
        setDBOrdenes={setDBOrdenes}
        useDocByCondition={useDocByCondition}
        setDBUsuario={setDBUsuario}
        setUserMaster={setUserMaster}
      />

      {lugar == "/" ? "" : ""}
    </ContenedorPrincipal>
  );
};
export default App;
const CajaBtnModal = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
