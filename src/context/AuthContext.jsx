import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { autenticar } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);
// Hook para acceder al contexto
const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  // Saber si el usuario tiene sesion iniciada
  const [usuario, setUsuario] = useState();
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const cancelarSuscripcion = onAuthStateChanged(autenticar, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
        console.log("❌❌❌❌");
      }
      setCargando(false);
    });
    return cancelarSuscripcion;
  }, []);
  return (
    <AuthContext.Provider value={{ usuario: usuario }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
};
export { AuthProvider, AuthContext, useAuth };
