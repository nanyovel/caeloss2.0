import { Header } from "../components/Header";
import { DetalleUsuarios } from "./DetalleUsuarios";

export const ListaUsuarios = ({ useDocByCondition, userMaster }) => {
  useEffect(() => {
    document.title = "Caeloss - Dashboard";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  return (
    <>
      <Header titulo="Usuarios" />
      <DetalleUsuarios
        useDocByCondition={useDocByCondition}
        userMaster={userMaster}
      />
    </>
  );
};
