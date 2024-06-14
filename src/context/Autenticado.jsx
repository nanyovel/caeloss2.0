import { useAuth } from './AuthContext';

export const Autenticado = ({children}) => {
  const {usuario}=useAuth();
  if(usuario){
    return usuario.emailVerified==true?children:null;
  }
  else{
    return null;
  }
};
