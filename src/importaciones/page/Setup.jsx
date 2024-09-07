import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import styled from "styled-components";
import CajaNavegacion from "../components/CajaNavegacion";
import { AddBL } from "../CreateDB/AddBL";
import { AddOC } from "../CreateDB/AddOC";
import { OpcionUnica } from "../../components/OpcionUnica";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";

export const Setup = ({
  // dbBillOfLading,
  // setDBBillOfLading,
  // dbOrdenes,
  // setDBOrdenes,
  dbUsuario,
  userMaster,
}) => {
  const [dbBillOfLading, setDBBillOfLading] = useState([]);
  const [dbOrdenes, setDBOrdenes] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const usuario = auth.currentUser;
  let location = useLocation();
  let lugar = location.pathname;

  // ************************** DAME UN GRUPO DE DOC POR CONDICION**************************
  const useDocByCondicion = (
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
        q = query(collection(db, collectionName), where(exp1, condicion, exp2));

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

  useDocByCondicion("ordenesCompra", setDBOrdenes, "estadoDoc", "<", 2);
  useDocByCondicion("billOfLading", setDBBillOfLading, "estadoDoc", "<", 2);

  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  useEffect(() => {
    if (dbBillOfLading.length > 0) {
      console.log(dbBillOfLading);
    }
  }, [dbBillOfLading]);

  useEffect(() => {
    if (lugar == "/importaciones/setup/" || lugar == "/importaciones/setup") {
      if (dbUsuario.length > 0) {
        const userMaster = dbUsuario.find((user) => {
          if (user.idUsuario == usuario.uid) {
            return user;
          }
        });

        if (userMaster) {
          userMaster.privilegios.forEach((pri) => {
            if (pri.code === "fullAccessIMS" && pri.valor === false) {
              navigate("/");
            }
          });
        }
      }
    }
  }, [usuario, dbUsuario, lugar, navigate]);

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Bill of Lading",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Orden de compra",
      opcion: 1,
      select: false,
    },
  ]);

  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  return (
    <>
      <Header titulo="Sistema gestion de importaciones" subTitulo="Agregar" />
      <Container>
        <ContainerNav>
          <CajaNavegacion
            pageSelected={4}
            dbUsuario={dbUsuario}
            userMaster={userMaster}
          />
          <OpcionUnica
            titulo="Pantallas"
            name="grupoA"
            arrayOpciones={arrayOpciones}
            handleOpciones={handleOpciones}
          />
        </ContainerNav>

        {arrayOpciones[0].select == true ? (
          <AddBL
            dbBillOfLading={dbBillOfLading}
            setDBBillOfLading={setDBBillOfLading}
            dbOrdenes={dbOrdenes}
            setDBOrdenes={setDBOrdenes}
          />
        ) : arrayOpciones[1].select == true ? (
          <AddOC dbOrdenes={dbOrdenes} setDBOrdenes={setDBOrdenes} />
        ) : (
          ""
        )}
      </Container>
    </>
  );
};

const Container = styled.div``;

const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width: 1000px) {
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: 410px) {
    width: 99%;
  }
`;
