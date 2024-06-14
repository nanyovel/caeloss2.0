import { useAuth } from '../context/AuthContext';
import { Navigate, } from 'react-router-dom';

export const RutaProtegida = ({children}) => {
  const {usuario}=useAuth();

  if(usuario?.emailVerified){
    return children;
  }
  else{
    return <Navigate replace to='/acceder' />;
  }
};
