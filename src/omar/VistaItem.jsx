import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import theme from "../config/theme";
import { useParams } from "react-router-dom";
import db from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const VistaItem = () => {
  const [dbOmarMiguel, setDBOmarMiguel] = useState([]);
  const useDocByCondition = (
    collectionName,
    setState,
    exp1,
    condicion,
    exp2
  ) => {
    useEffect(() => {
      console.log("BASE de Datos 📄📄📄📄👨‍🏫👨‍🏫👨‍🏫📄📄👨‍🏫👨‍🏫");
      let q = "";

      if (exp1) {
        q = query(collection(db, collectionName), where(exp1, condicion, exp2));
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
    }, [collectionName, setState, exp1, condicion, exp2]);
  };

  useDocByCondition("omarMiguel", setDBOmarMiguel);

  const Item = {
    tarima: 1,
    noDigitacion: 25,
    numeroItem: 174,
    descripcion: "Lavamano redondo de cristal",
    qty: 17,
    costo: 1000,
    precio: 1200,
    obs: "Imperfecto roto porque se coloco de manera incorrecta en la tarima, mi recomendacion es que ",
    fotos: [
      "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/fotosOmarMiguel%2F20240807_135239.jpg?alt=media&token=61e62c37-3a0c-4ef1-b4a2-e00d69279f49",
      "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/fotosOmarMiguel%2F20240807_135042.jpg?alt=media&token=157dbdc6-5f54-4346-981b-7f26f6da82c3",
      "https://firebasestorage.googleapis.com/v0/b/caelossoficial.appspot.com/o/fotosOmarMiguel%2F20240807_135055.jpg?alt=media&token=7569f4b6-80f3-472a-9917-6b192cf1a759",
    ],
  };

  const idItem = useParams();

  const [itemMaster, setItemMaster] = useState({
    tarima: "",
    noDigitacion: "",
    numeroItem: "",
    descripcion: "...",
    qty: "",
    costo: "",
    precio: "",
    obs: "... ",
    fotos: [],
  });

  useEffect(() => {
    if (dbOmarMiguel.length > 0) {
      const someItemMaster = dbOmarMiguel.find((item) => {
        if (idItem.id == item.id) {
          return item;
        }
      });
      setItemMaster(someItemMaster);
    }
  }, [dbOmarMiguel]);

  return (
    <>
      <Header titulo="Materiales Omar" />
      <CajaContenedor>
        <TituloItem>{Item.descripcion}</TituloItem>
        <ContenedorDetalle>
          <Tabla>
            <thead>
              <Filas>
                <CeldaHead>Tarima</CeldaHead>
                {/* <CeldaHead>N° digit</CeldaHead> */}
                <CeldaHead>Numero item</CeldaHead>
                <CeldaHead>Descripcion</CeldaHead>
                <CeldaHead>Qty</CeldaHead>
                <CeldaHead>Costo</CeldaHead>
                <CeldaHead>Precio</CeldaHead>
                <CeldaHead>Obs</CeldaHead>
              </Filas>
            </thead>
            <tbody>
              <Filas className="body">
                {itemMaster && (
                  <>
                    <CeldasBody>{itemMaster.tarima}</CeldasBody>
                    {/* <CeldasBody>{Item.noDigitacion}</CeldasBody> */}
                    <CeldasBody>{itemMaster.numeroItem}</CeldasBody>
                    <CeldasBody>{itemMaster.descripcion}</CeldasBody>
                    <CeldasBody>{itemMaster.qty}</CeldasBody>
                    <CeldasBody>{itemMaster.costo}</CeldasBody>
                    <CeldasBody>{itemMaster.precio}</CeldasBody>
                    <CeldasBody>{itemMaster.obs}</CeldasBody>
                  </>
                )}
              </Filas>
            </tbody>
          </Tabla>
          <CajaImg>
            <TituloItem className="tituloImg">Imagenes del producto</TituloItem>
            {itemMaster && (
              <>
                {itemMaster.fotos.map((img, index) => {
                  return <Img src={img} key={index} />;
                })}
              </>
            )}
          </CajaImg>
        </ContenedorDetalle>
      </CajaContenedor>
    </>
  );
};

const CajaContenedor = styled.div`
  /* border: 2px solid red; */
  width: 100%;
  height: 500px;
`;

const TituloItem = styled.h2`
  width: 100%;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  &.tituloImg {
    text-align: start;
    text-decoration: underline;
  }
`;

const ContenedorDetalle = styled.div`
  width: 100%;
  /* border: 1px solid blue; */
`;

const CajaTabla = styled.div`
  max-width: 100%;
`;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled.tr`
  &.body {
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${theme.azul5Osc};
  }
  color: ${theme.azul1};
`;

const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
`;
const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;
`;
const CajaImg = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 10px;
`;

const Img = styled.img`
  width: 100%;
  border-radius: 10px;
`;
