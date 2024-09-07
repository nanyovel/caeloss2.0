import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Documentacion } from "./../page/documentacion/Documentacion";
import { ListaUsers } from "./../dashboard/ListaUsers";
import { Tutoriales } from "./../components/tutoriales/Tutoriales";
import { Setup } from "./../importaciones/page/Setup";
import { RutaPrivilegiada } from "./../context/RutaPrivilegiada";
import { Home } from "./../page/Home.jsx";
import { Omar } from "./../omar/Omar.jsx";
import { RutaProtegida } from "./../context/RutaProtegida";
// import { AvisoTop } from "./components/Avisos/AvisoTop";
import { ResetPass } from "./../auth/ResetPass";
import { Dashboard } from "./../dashboard/Dashboard";
import { ListaFurgon } from "./../importaciones/Template/ListaFurgon";
import { ListaUsuarios } from "./../dashboard/ListaUsuarios";
import { Perfil } from "./../page/Perfil";
import { Transportes } from "./../transportes/Transportes";
// import { Mantenimiento } from "./mantenimiento/Mantenimiento.jsx";
import { Main } from "./../importaciones/page/Main";
import { Maestros } from "./../importaciones/page/maestros";
import { ListaArticulo } from "./../importaciones/template/ListaArticulo";
import { Seguimientos } from "./../importaciones/page/Seguimientos";
import { ListaOrdenCompra } from "./../importaciones/template/ListaOrdenCompra";
import { ListaBillOfLading } from "./../importaciones/Template/ListaBillOfLading";
import { Ciclo } from "./../importaciones/page/Ciclo";
import { Register } from "./../auth/Register.jsx";
import { Login } from "./../auth/Login";
import { LogOut } from "./../auth/LogOut";
import { Page404 } from "./../page/Page404";
import { Fletes } from "./../fletes/Fletes";
import { SetupFletes } from "./../fletes/Setup";
import { ListaPage } from "./../materiales/page/ListaPage";
import { Materiales } from "./../materiales/Materiales";
import { VistaItem } from "../omar/VistaItem.jsx";

export const MasterRoutes = ({
  usuario,
  setDBTutoriales,
  dbUsuario,
  dbTutoriales,
  userMaster,
  dbResennias,
  dbBillOfLading,
  setDBBillOfLading,
  dbOrdenes,
  setDBOrdenes,
  dbOmarMiguel,
  setDBOmarMiguel,
  useDocByCondition,
  setDBUsuario,
  setUserMaster,
}) => {
  let lugar = location.pathname;
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RutaProtegida>
            <Home
              usuario={usuario}
              // usuarioFireBase={usuario}
              setDBTutoriales={setDBTutoriales}
              dbUsuario={dbUsuario}
              dbTutoriales={dbTutoriales}
              userMaster={userMaster}
              dbResennias={dbResennias}
            />
          </RutaProtegida>
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
          <VistaItem dbUsuario={dbUsuario} userMaster={userMaster} />
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

      <Route path="/registro" element={<Register />} />
      <Route path="/acceder" element={<Login />} />
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
  );
};
