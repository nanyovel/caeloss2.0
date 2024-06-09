import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HashRouter } from "react-router-dom";
// import './index.css'
import { AuthProvider } from './context/AuthContext.jsx';
import ContenedorPrincipal from './components/ContenedorPrincipal.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>

        {/* <HashRouter> */}
          <App />
        {/* </HashRouter> */}
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>,
    
)



// Caeloss 2.0
// Miercoles 26 / julio / 2023 - 07:27PM

