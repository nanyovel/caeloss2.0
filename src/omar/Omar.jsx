import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import styled, { keyframes } from "styled-components";
import imgItem0 from "./image/20240814_162137.jpg";
import imgItem1 from "./image/20240814_162140.jpg";
import imgItem2 from "./image/20240814_162206.jpg";
import arrayDataBase from "./dataBase.jsx";
import theme from "../config/theme";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { CarrucelImg } from "./CarrucelImg.jsx";
import {
  getFirestore,
  writeBatch,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import { useParams } from "react-router-dom";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alerta } from "../components/Alerta.jsx";
import { ModalLoading } from "../components/ModalLoading.jsx";

export const Omar = ({ setDBOmarMiguel, dbOmarMiguel }) => {
  const storage = getStorage();
  const [params, setParams] = useState(useParams());
  const [nuevaDBOmar, setNuevaDBOmar] = useState([]);
  const [itemsPorPagina, setItemsPorPagina] = useState(500);
  const [numeroPagina, setNumeroPagina] = useState(1);

  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const itemsOrdenados = [
      ...dbOmarMiguel.sort(
        (a, b) => Number(a.numeroDigitado) - Number(b.numeroDigitado)
      ),
    ];

    const indiceInicio = (numeroPagina - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;

    setNuevaDBOmar(itemsOrdenados.slice(indiceInicio, indiceFin));

    // console.log(Number(params.numeroPagina));
    console.log(typeof params.numeroPagina);
    if (
      Number(params.numeroPagina) &&
      typeof Number(params.numeroPagina == "number")
    ) {
      setNumeroPagina(Number(params.numeroPagina));
    } else {
      setNumeroPagina(1);
    }
  }, [dbOmarMiguel]);

  const [images, setImages] = useState([]);

  const handleFileUpload = (event) => {
    setImages(event.target.files);
  };

  const uploadMultipleFiles = async (idItem) => {
    setIsLoading(true);
    // const nombreFoto = "fotosOmarMiguel/foto" + numerItem;

    const uploadPromises = Array.from(images).map((file) => {
      const storageRef = ref(storage, `fotosOmarMiguel/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Puedes manejar el progreso de la carga aquí si lo necesitas
          },
          (error) => {
            reject(error); // Maneja cualquier error en la carga
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL); // Obtén la URL de descarga de cada archivo subido
            });
          }
        );
      });
    });

    try {
      const urls = await Promise.all(uploadPromises);
      console.log("Todas las fotos se subieron correctamente:", urls);
      actualizarURLFotoItem(urls, idItem);
    } catch (error) {
      setIsLoading(false);
      setMensajeAlerta("Error al cargar fotos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      console.error("Error al subir las fotos:", error);
    }
  };

  const actualizarURLFotoItem = async (urls, itemId) => {
    const itemActualizar = doc(db, "omarMiguel", itemId);

    const itemMaster = dbOmarMiguel.find((item) => item.id == itemId);

    const itemConcat = itemMaster.fotos.concat(urls);
    // console.log(itemConcat);
    try {
      await updateDoc(itemActualizar, {
        fotos: itemConcat,
      });
      setMensajeAlerta("Item actualizado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header titulo={"Materiales Omar"} />
      <CarrucelImg />

      <TextoH2>Materiales linea Omar Miguel</TextoH2>
      <ContenedorItems>
        {nuevaDBOmar.map((item, index) => {
          return (
            <CajaItem key={index}>
              <LadoIzquierdo>
                <CajaTabla>
                  <Tabla>
                    <tbody>
                      <Filas className="body">
                        <CeldasBody>N°</CeldasBody>
                        <CeldasBody>{item.numeroDigitado}</CeldasBody>
                      </Filas>
                      <Filas className="body">
                        <CeldasBody>Tarima</CeldasBody>
                        <CeldasBody>{item.tarima}</CeldasBody>
                      </Filas>
                      <Filas className="body">
                        <CeldasBody>Numero</CeldasBody>
                        <CeldasBody>{item.numeroItem}</CeldasBody>
                      </Filas>
                      <Filas className="body">
                        <CeldasBody>Descripcion</CeldasBody>
                        <CeldasBody>{item.descripcion}</CeldasBody>
                      </Filas>
                      <Filas className="body">
                        <CeldasBody>Qty</CeldasBody>
                        <CeldasBody>{item.qty}</CeldasBody>
                      </Filas>
                      <Filas className="body">
                        <CeldasBody>Costo</CeldasBody>
                        <CeldasBody>{item.costo}</CeldasBody>
                      </Filas>
                      <Filas className="body">
                        <CeldasBody>Precio</CeldasBody>
                        <CeldasBody>{item.precio}</CeldasBody>
                      </Filas>
                      <Filas className="body">
                        <CeldasBody>Obs</CeldasBody>
                        <CeldasBody>{item.obs}</CeldasBody>
                      </Filas>
                    </tbody>
                  </Tabla>
                </CajaTabla>
                <InputEditable
                  type="file"
                  multiple
                  className="file"
                  onChange={(e) => {
                    handleFileUpload(e);
                  }}
                />

                <BtnGeneralButton onClick={() => uploadMultipleFiles(item.id)}>
                  Cargar Fotos
                </BtnGeneralButton>
              </LadoIzquierdo>
              <LadoDerecho>
                <CajaImg>
                  <ImagenItem src={item.fotos[0]} />
                </CajaImg>
              </LadoDerecho>
            </CajaItem>
          );
        })}
      </ContenedorItems>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </>
  );
};

const TextoH2 = styled.h2`
  text-align: center;
  text-decoration: underline;
  color: white;
`;

const ContenedorItems = styled.div`
  width: 100%;
  padding: 15px;
`;

const CajaItem = styled.div`
  width: 100%;
  margin: 5px;
  background-color: ${theme.azulOscuro1Sbetav};
  border: 1px solid ${theme.azul2};
  border-radius: 15px;
  /* overflow: hidden; */
  padding: 10px;
  display: flex;
  margin-bottom: 25px;
  -webkit-box-shadow: 7px 7px 12px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 7px 7px 12px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 7px 7px 12px -1px rgba(0, 0, 0, 0.75);
`;
const LadoIzquierdo = styled.div`
  width: 50%;
  /* border: 1px solid red; */
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

const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;
`;
const LadoDerecho = styled.div`
  /* border: 1px solid red; */
  width: 100%;
  /* height: 500px; */
  /* overflow: hidden; */
`;
const CajaImg = styled.div`
  /* background-color: red; */
  width: 100%;
  overflow: hidden;
  position: relative;
  border: 1px solid gray;
  border-radius: 5px;
  height: 300px;
`;
const ImagenItem = styled.img`
  /* border: 1px solid blue; */
  /* &.master { */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  /* height: 200px; */
  object-fit: contain;
  /* } */
`;

const InputEditable = styled.input`
  margin: 0;
  height: 20px;
  outline: none;
  border: 1px solid ${theme.azul2};
  background-color: transparent;
  color: ${theme.azul2};
  font-size: 0.8rem;
  padding: 8px;
  width: 280px;
  border-left: 1px solid ${theme.azul1};
  &.file {
    height: auto;
  }
`;
