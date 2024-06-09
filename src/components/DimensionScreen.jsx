import { useEffect } from "react";


export default function DimensionScreen(anchoPantalla, setWidth){
    let anchoReturn
    
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener en el componente desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

    return anchoReturn
}