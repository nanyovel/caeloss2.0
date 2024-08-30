import { useState } from "react";
import { Header } from "../../components/Header";
import CajaNavegacion from "../components/CajaNavegacion";
import { TablaListaTodosLosItems } from "../Tablas/TablaListaTodosLosItems";
import { TablaListaTodosLosFurgones } from "../Tablas/TablaListaTodosLosFurgones";
import { TablaListaTodasLasOC } from "../Tablas/TablaListaTodasLasOC";
import { TablaListaTodosLosBLs } from "../Tablas/TablaListaTodosLosBLs";
// import { BotonQuery } from '../../components/BotonQuery';
import styled from "styled-components";
import { OpcionUnica } from "../../components/OpcionUnica";
import { useEffect } from "react";
import ExcelJS from "exceljs";

import { saveAs } from "file-saver";
import { AvisoModal } from "../../components/Avisos/AvisoModal";

export const Main = ({ dbOrdenes, dbBillOfLading, dbUsuario, userMaster }) => {
  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Articulos",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Contenedores",
      opcion: 1,
      select: false,
    },
    {
      nombre: "O/C",
      opcion: 2,
      select: false,
    },
    {
      nombre: "BLs",
      opcion: 3,
      select: false,
    },
  ]);

  const generateExcel = async (ordenCompra) => {
    console.log(dbOrdenes);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Omar");

    // console.log(ordenCompra)

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "N° Orden", key: "numeroDoc", width: 10 },
      { header: "Proveedor", key: "proveedor", width: 40 },
      { header: "Fecha", key: "date", width: 15 },
      { header: "Status", key: "estadoDoc", width: 10 },
      { header: "Obs", key: "obs", width: 40 },
    ];
    ordenCompra.forEach((orden, index) => {
      worksheet.addRow({
        id: orden.id,
        numeroDoc: orden.numeroDoc,
        proveedor: orden.proveedor,
        date: orden.fechaCreacion,
        estadoDoc: orden.estadoDoc,
        obs: orden.comentarios,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Ordenes de compra.xlsx");

    // worksheet.columns = [
    //   { header: 'Tarima', key: 'tarima', width: 10 },
    //   { header: 'Numero', key: 'numero', width: 10 },
    //   { header: 'Descripcion', key: 'descripcion', width: 60 },
    //   { header: 'Qty', key: 'qty', width: 10 },
    //   { header: 'Obs', key: 'obs', width: 10 },
    //   { header: 'Link', key: 'link', width: 10 },
    // ];

    // worksheet.addRow({ tarima: 1, numero: 'NN2', descripcion: "Silla de mesa", qty:3, obs:"Esto observa", link:"enlace"});
    // worksheet.addRow({ tarima: 2, numero: 'NN3', descripcion: "Lavanavo azul", qty:10, obs:"Esto observa", link:"enlace"});
    // worksheet.addRow({ tarima: 2, numero: 'NN4', descripcion: "Lavamano de cristal rojo", qty:8, obs:"Esto observa", link:"enlace"});
    // worksheet.addRow({ tarima: 2, numero: 'NN5', descripcion: "Lavamano con pedestal", qty:7, obs:"Esto observa", link:"enlace"});
    // worksheet.addRow({ tarima: 3, numero: 'NN6', descripcion: "Inodoro simphonic", qty:10, obs:"Esto observa", link:"enlace"});
    // worksheet.addRow({ tarima: 3, numero: 'NN7', descripcion: "Mezcladora", qty:19, obs:"Esto observa", link:"enlace"});

    // const buffer = await workbook.xlsx.writeBuffer();
    // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // saveAs(blob, 'MiArchivo.xlsx');
  };

  const [tablaActiva, setTablaActiva] = useState();
  useEffect(() => {
    if (arrayOpciones[0].select == true) {
      setTablaActiva(
        <TablaListaTodosLosItems
          dbOrdenes={dbOrdenes}
          dbBillOfLading={dbBillOfLading}
        />
      );
    } else if (arrayOpciones[1].select == true) {
      setTablaActiva(
        <TablaListaTodosLosFurgones
          dbOrdenes={dbOrdenes}
          dbBillOfLading={dbBillOfLading}
        />
      );
    } else if (arrayOpciones[2].select == true) {
      setTablaActiva(
        <TablaListaTodasLasOC
          dbOrdenes={dbOrdenes}
          dbBillOfLading={dbBillOfLading}
        />
      );
    } else if (arrayOpciones[3].select == true) {
      setTablaActiva(
        <TablaListaTodosLosBLs
          dbOrdenes={dbOrdenes}
          dbBillOfLading={dbBillOfLading}
        />
      );
    }
  }, [dbBillOfLading, dbOrdenes, arrayOpciones]);

  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  const [hasModal, setHasModal] = useState(true);
  return (
    <>
      <Header titulo={"Sistema gestion de importaciones"} subTitulo="Main" />
      {/* <h2>Hola</h2> */}
      <AvisoModal
        children="Prueba"
        tituloMain="Realizando cambios..."
        tituloSecond="Estamos realizando cambios, por el momento el SGI no esta disponible, la informacion a visualizar podria estar desactualizada."
        setHasModal={setHasModal}
        hasModal={hasModal}
        hasBtnClose={false}

        // funcionCTA2="asd"
      />

      <ContainerNav>
        <CajaNavegacion
          pageSelected={0}
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

      {/* <BtnGeneralButton onClick={() => generateExcel(dbOrdenes)}>
        Descargar
      </BtnGeneralButton> */}

      {tablaActiva}

      {/* <Footer/>       */}
    </>
  );
};

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
