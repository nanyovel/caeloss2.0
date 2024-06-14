import { Header } from '../components/Header';
import { DetalleUsuarios } from './DetalleUsuarios';

export const ListaUsuarios = ({useDocByCondition,userMaster}) => {

  return(
    <>
      <Header titulo='Usuarios'/>
      <DetalleUsuarios
        useDocByCondition={useDocByCondition}
        userMaster={userMaster}/>
    </>
  );

};
