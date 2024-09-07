import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import styled, { keyframes } from "styled-components";
import imgItem0 from "./image/20240814_162137.jpg";
import imgItem1 from "./image/20240814_162140.jpg";
import imgItem2 from "./image/20240814_162206.jpg";
import theme from "../config/theme";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { CarrucelImg } from "./CarrucelImg.jsx";
import db from "../firebase/firebaseConfig";
import { NavLink, useParams } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alerta } from "../components/Alerta.jsx";
import { ModalLoading } from "../components/ModalLoading.jsx";
import { actualizarDatos, cargarDatos } from "../libs/FirebaseLibs.jsx";
import { BotonQuery } from "../components/BotonQuery.jsx";

// ****Tarima - Es el numero de tarima colocado en fisico
// ****numeroDigitado - Es el orden con el que escribi lo fisico, este dato es importante para poder ordenar segun el orden fisico
// por ejemplo el numeroItem es diferente porque por ejemplo encontramos diferentes incoherencias entre ellas:
// -Existen item NN y EP
// -Existen NN duplicado por lo cual le agregue el sufijo B, por ejemplo NN378 y NN378B
// -Hay numeros que me salte por error por ejemplo NN175,NN176,NN177,NN179 etc
// La solucion es agregar un dato aparte para ello cree numeroDigitado

export const Omar = () => {
  useEffect(() => {
    document.title = "Caeloss - Omar";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
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

  const storage = getStorage();
  const [params, setParams] = useState(useParams());
  const [nuevaDBOmar, setNuevaDBOmar] = useState([]);
  const [itemsPorPagina, setItemsPorPagina] = useState(1000);
  const [numeroPagina, setNumeroPagina] = useState(1);

  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const arraySubir = [
    {
      numeroDigitado: 474,
      tarima: 101,
      numeroItem: "NN462",
      descripcion: "Lavamano ref; CH2-AF G1W",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 475,
      tarima: 101,
      numeroItem: "NN463",
      descripcion: "Pieza no identificada ref; TR-270A",
      qty: 9,
      obs: "",
    },
    {
      numeroDigitado: 476,
      tarima: 102,
      numeroItem: "NN464",
      descripcion: "Base Cabinet B1P-BWPC-30",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 477,
      tarima: 102,
      numeroItem: "NN465",
      descripcion: "Caja con descripcion a manuscrito",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 478,
      tarima: 102,
      numeroItem: "NN466",
      descripcion: "Caja con etiqueta rota",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 479,
      tarima: 102,
      numeroItem: "NN467",
      descripcion: "Lavamano blanco 45x56 sin identificacion",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 480,
      tarima: 102,
      numeroItem: "NN468",
      descripcion: "Lavamano clear BX2023FE",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 481,
      tarima: 102,
      numeroItem: "NN469",
      descripcion: "Lavamano clear BX2023CL",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 482,
      tarima: 102,
      numeroItem: "NN470",
      descripcion:
        "Lavamano clear opaco 0.3m 370x370x160 (coduigo cielos; 20158)",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 483,
      tarima: 102,
      numeroItem: "NN471",
      descripcion: "Lavamano blanco tipo corazon sin ref",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 484,
      tarima: 102,
      numeroItem: "NN472",
      descripcion: "Lavamano media luna 420x290x150",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 485,
      tarima: 102,
      numeroItem: "NN473",
      descripcion: "Lavamano clear 18BX2023",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 486,
      tarima: 103,
      numeroItem: "NN474",
      descripcion: "Lavamano blanco CHNS-5004",
      qty: 5,
      obs: "",
    },
    {
      numeroDigitado: 487,
      tarima: 103,
      numeroItem: "NN475",
      descripcion: "Lavamano blanco R7098 390x390",
      qty: 5,
      obs: "",
    },
    {
      numeroDigitado: 488,
      tarima: 103,
      numeroItem: "NN476",
      descripcion: "Lavamano blanco P-7881",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 489,
      tarima: 103,
      numeroItem: "NN477",
      descripcion: "Lavamano 7657 (codigo cielos; 20037)",
      qty: 5,
      obs: "",
    },
    {
      numeroDigitado: 490,
      tarima: 103,
      numeroItem: "NN478",
      descripcion: "Lavamano blanco P-7243",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 491,
      tarima: 104,
      numeroItem: "NN479",
      descripcion: "Mueble oak BY-803 1240x490",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 492,
      tarima: 104,
      numeroItem: "NN480",
      descripcion: "Mueble sin identificacion (codigo cielos; 20120)",
      qty: 1,
      obs: "imperfecto",
    },
    {
      numeroDigitado: 493,
      tarima: 104,
      numeroItem: "NN481",
      descripcion: "20123 ref F01A",
      qty: 8,
      obs: "",
    },
    {
      numeroDigitado: 494,
      tarima: 105,
      numeroItem: "NN482",
      descripcion: "Inodoro A0622 720x430 (codigo cielos; 20040)",
      qty: 1,
      obs: "3 bueno mas 1 sin tapa",
    },
    {
      numeroDigitado: 495,
      tarima: 105,
      numeroItem: "NN483",
      descripcion: "Lavamano 7953 460x310",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 496,
      tarima: 105,
      numeroItem: "NN484",
      descripcion: "Lavamano blanco 7243",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 497,
      tarima: 105,
      numeroItem: "NN485",
      descripcion: "Bathroom cabinet FA2-501560 500x150x600",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 498,
      tarima: 105,
      numeroItem: "NN486",
      descripcion: "Repisa de pared 40x15x1.5 ref; FA1-401515",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 499,
      tarima: 105,
      numeroItem: "NN487",
      descripcion: "Repisa de pared sin ref",
      qty: 1,
      obs: "averia",
    },
    {
      numeroDigitado: 500,
      tarima: 105,
      numeroItem: "NN488",
      descripcion: "Bathroom cabinet FA2-501560",
      qty: 1,
      obs: "incompleta",
    },
    {
      numeroDigitado: 501,
      tarima: 105,
      numeroItem: "NN489",
      descripcion: "Gabinete incompleto",
      qty: 1,
      obs: "imperfecto",
    },
    {
      numeroDigitado: 502,
      tarima: 105,
      numeroItem: "NN490",
      descripcion: "Inodoro A0610 700x400x520",
      qty: 4,
      obs: "",
    },
    {
      numeroDigitado: 503,
      tarima: 105,
      numeroItem: "NN491",
      descripcion: "Mezcladora p/fregadero Baxcy B2MH-EX1C",
      qty: 4,
      obs: "",
    },
    {
      numeroDigitado: 504,
      tarima: 107,
      numeroItem: "NN492",
      descripcion: "Lavamano 7911 570x450x160 (codigo cielos; 20063)",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 505,
      tarima: 107,
      numeroItem: "NN493",
      descripcion: "Lavamano 7821",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 506,
      tarima: 107,
      numeroItem: "NN494",
      descripcion: "Lavamano 7657 (codigo cielos; 20037)",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 507,
      tarima: 107,
      numeroItem: "NN495",
      descripcion: "Lavamano 7846 470x460",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 508,
      tarima: 107,
      numeroItem: "NN496",
      descripcion: "Lavamano P9393",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 509,
      tarima: 107,
      numeroItem: "NN497",
      descripcion: "Lavamano 91x46cm P9393(90)",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 510,
      tarima: 107,
      numeroItem: "NN498",
      descripcion: "Lavamano 58x45cm",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 511,
      tarima: 107,
      numeroItem: "NN499",
      descripcion: "Lavamano sin identificar 43x43c",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 512,
      tarima: 107,
      numeroItem: "NN500",
      descripcion: "Lavamano clear CBA-100",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 513,
      tarima: 107,
      numeroItem: "NN501",
      descripcion: "Lavamano clear sin identiticar",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 514,
      tarima: 107,
      numeroItem: "NN502",
      descripcion: "Lavamano blanco (codigo cielos; 20039) AC217 ",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 515,
      tarima: 108,
      numeroItem: "NN503",
      descripcion: "Mueble negro sin identificar",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 516,
      tarima: 108,
      numeroItem: "NN504",
      descripcion: "Mueble FA3-A sin identificar",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 517,
      tarima: 108,
      numeroItem: "NN505",
      descripcion: "Mueble p/lavamano 51x45x25 Ref; FP7H-45255",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 518,
      tarima: 108,
      numeroItem: "NN506",
      descripcion: "Mueble no identificado ",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 519,
      tarima: 108,
      numeroItem: "NN507",
      descripcion: "Mueble sin identificar ",
      qty: 1,
      obs: "averias",
    },
    {
      numeroDigitado: 520,
      tarima: 108,
      numeroItem: "NN508",
      descripcion: "Mueble marron sin identificar",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 521,
      tarima: 108,
      numeroItem: "NN509",
      descripcion: "Repisa sin identificar",
      qty: 2,
      obs: "averias",
    },
    {
      numeroDigitado: 522,
      tarima: 109,
      numeroItem: "NN510",
      descripcion: "Mobiliario no identificado de cristal GY38",
      qty: 8,
      obs: "",
    },
    {
      numeroDigitado: 523,
      tarima: 110,
      numeroItem: "NN511",
      descripcion: "Mueble negro BY-803 120x45x70",
      qty: 1,
      obs: "averia",
    },
    {
      numeroDigitado: 524,
      tarima: 110,
      numeroItem: "NN512",
      descripcion: "Mueble BY-803-M-MA",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 525,
      tarima: 110,
      numeroItem: "NN513",
      descripcion: "Mueble BY-863 BL",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 526,
      tarima: 110,
      numeroItem: "NN514",
      descripcion: "Mueble 120cm de ancho BY-866-M-BL negro",
      qty: 1,
      obs: "averias",
    },
    {
      numeroDigitado: 527,
      tarima: 110,
      numeroItem: "NN515",
      descripcion: "Mueble negro 120x5x53",
      qty: 1,
      obs: "averias",
    },
    {
      numeroDigitado: 528,
      tarima: 110,
      numeroItem: "NN516",
      descripcion: "Botiquin de baño BY863-es-ML nergo con cristal ",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 529,
      tarima: 110,
      numeroItem: "NN517",
      descripcion: "Espejo botiqui 50cm ancho BY-856-ES",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 530,
      tarima: 110,
      numeroItem: "NN518",
      descripcion: "Espejo con marco EM16083",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 531,
      tarima: 110,
      numeroItem: "NN519",
      descripcion: "Marco con espejo (codigo cielos; 20092)",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 532,
      tarima: 110,
      numeroItem: "NN520",
      descripcion: "Botiquin con espejo BY-856-ESW",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 533,
      tarima: 111,
      numeroItem: "NN521",
      descripcion: "Mobiliariao imperfecto varias",
      qty: "varias",
      obs: "",
    },
    {
      numeroDigitado: 534,
      tarima: 112,
      numeroItem: "NN522",
      descripcion: "Botiquin con espejo BY 825-ES ",
      qty: 1,
      obs: "imperfecto",
    },
    {
      numeroDigitado: 535,
      tarima: 112,
      numeroItem: "NN523",
      descripcion: "Mueble 120cm de ancho BY-866-M-BL negro con cristal",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 536,
      tarima: 112,
      numeroItem: "NN524",
      descripcion: "Mueble BY 825-ES con cristal ",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 537,
      tarima: 113,
      numeroItem: "NN525",
      descripcion: "Paneles no identificados varios",
      qty: "varias",
      obs: "",
    },
    {
      numeroDigitado: 538,
      tarima: 114,
      numeroItem: "NN526",
      descripcion: "Espejo GY-5645",
      qty: 26,
      obs: "",
    },
    {
      numeroDigitado: 539,
      tarima: 114,
      numeroItem: "NN527",
      descripcion: "Espejo con marco BY868 ES-BL",
      qty: 1,
      obs: "imperfecto; calcolma",
    },
    {
      numeroDigitado: 540,
      tarima: 115,
      numeroItem: "NN528",
      descripcion: "Espejo AM10050",
      qty: 34,
      obs: "",
    },
    {
      numeroDigitado: 541,
      tarima: 116,
      numeroItem: "NN529",
      descripcion: "Espejos variados en tarima",
      qty: 58,
      obs: "",
    },
    {
      numeroDigitado: 542,
      tarima: 117,
      numeroItem: "NN530",
      descripcion: "Botiquin BY866 Oak",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 543,
      tarima: 117,
      numeroItem: "NN531",
      descripcion: "Botiquin negro BY-825 940x790x18 con espejo deslizable",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 544,
      tarima: 118,
      numeroItem: "NN532",
      descripcion: "Mampara modelo S8507 90x90x200",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 545,
      tarima: 118,
      numeroItem: "NN533",
      descripcion: "Mampara S176 90x90x200",
      qty: 2,
      obs: "",
    },
    {
      numeroDigitado: 546,
      tarima: 118,
      numeroItem: "NN534",
      descripcion: "Mampara sin ref dice E09EC486",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 547,
      tarima: 119,
      numeroItem: "NN535",
      descripcion: "Mampara FD-JZ-90K",
      qty: 5,
      obs: "",
    },
    {
      numeroDigitado: 548,
      tarima: 120,
      numeroItem: "NN536",
      descripcion: "Mampara FD-JZ-90K",
      qty: 7,
      obs: "6 mas 1 con un cristal roto",
    },
    {
      numeroDigitado: 549,
      tarima: 121,
      numeroItem: "NN537",
      descripcion: "Mampara FD-JZ-90K",
      qty: 2,
      obs: "1  buena mas 1 con un cristal roto",
    },
    {
      numeroDigitado: 550,
      tarima: 122,
      numeroItem: "NN538",
      descripcion: "Mampara FD-JZ-90K",
      qty: 7,
      obs: "",
    },
    {
      numeroDigitado: 551,
      tarima: 123,
      numeroItem: "NN538b",
      descripcion: "Mampara FD-JZ-90K",
      qty: 7,
      obs: "",
    },
    {
      numeroDigitado: 552,
      tarima: 124,
      numeroItem: "NN539",
      descripcion: "Mampara FD-JZ-90K",
      qty: 3,
      obs: "",
    },
    {
      numeroDigitado: 553,
      tarima: 125,
      numeroItem: "NN540",
      descripcion: "Extra panel 360x350 oak ",
      qty: 6,
      obs: "",
    },
    {
      numeroDigitado: 554,
      tarima: 125,
      numeroItem: "NN542",
      descripcion: "Gabinete de baño FA-11-705225 700x520x250",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 555,
      tarima: 125,
      numeroItem: "NN544",
      descripcion: "Wall cabinet W1P-BWPC-45 oak",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 556,
      tarima: 125,
      numeroItem: "NN545",
      descripcion: "Producto no identificado",
      qty: 4,
      obs: "",
    },
    {
      numeroDigitado: 557,
      tarima: 125,
      numeroItem: "NN546",
      descripcion: "Tanque de inodoro A0616 blanco",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 558,
      tarima: 125,
      numeroItem: "NN547",
      descripcion: "Mezcladora sin identificar",
      qty: 1,
      obs: "",
    },
    {
      numeroDigitado: 559,
      tarima: 125,
      numeroItem: "NN548",
      descripcion: "Mesita sin identificar",
      qty: 1,
      obs: "",
    },
  ];

  useEffect(() => {
    const itemsOrdenados = [
      ...dbOmarMiguel.sort(
        (a, b) => Number(a.numeroDigitado) - Number(b.numeroDigitado)
      ),
    ];

    const indiceInicio = (numeroPagina - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;

    console.log(dbOmarMiguel);
    setNuevaDBOmar(itemsOrdenados.slice(indiceInicio, indiceFin));

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
      // console.log("Todas las fotos se subieron correctamente:", urls);
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
      ñ;
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
      {/* <BtnGeneralButton
        onClick={() => actualizarDatos(dbOmarMiguel, "omarMiguel")}
      >
        Cargar datos!
      </BtnGeneralButton> */}

      {/* <BotonQuery dbOmarMiguel={dbOmarMiguel}>Consulta</BotonQuery> */}
      <ContenedorItems>
        {nuevaDBOmar.map((item, index) => {
          return (
            <CajaItem key={index}>
              <LadoIzquierdo>
                <CajaTabla>
                  <Tabla>
                    <tbody>
                      {/* <Filas className="body">
                        <CeldasBody>N°</CeldasBody>
                        <CeldasBody>{item.numeroDigitado}</CeldasBody>
                      </Filas> */}
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
                        <CeldasBody className="descripcion">
                          <Enlace to={item.id}>{item.descripcion}</Enlace>
                        </CeldasBody>
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

  @media screen and (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`;
const LadoIzquierdo = styled.div`
  width: 50%;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
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
  &.descripcion {
    text-decoration: underline;
  }
`;
const LadoDerecho = styled.div`
  width: 100%;
  /* height: 500px; */
  /* overflow: hidden; */
`;
const CajaImg = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  border: 1px solid gray;
  border-radius: 5px;
  height: 300px;
`;
const ImagenItem = styled.img`
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
const Enlace = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
