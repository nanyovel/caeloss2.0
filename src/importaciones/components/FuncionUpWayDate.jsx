// Inputs
// 0-proveedor,
// 1-transito,
// 2-pais,
// 3-almacen,
// 4-dptoImport,
// 5-Sap,

import { format } from "date-fns";
import { es } from "date-fns/locale";

// 5-sap,
export default function FuncionUpWayDate(
  annio, mes, dia,
  fechaInput,
  confirmada,
){
  let fechaEntrada='';

  // Si el usuario ingresa fecha de llegada al pais
  if(fechaInput==2){
    // Aqui basicamente no tenemos que hacer nada
    fechaEntrada=
            new Date(
              Number(annio),
              Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
              Number(dia),
            );
  }

  // Si el usuario esta introduciendo la fecha de llegada almacen, entonces a la fecha origen (llegadaAlPais) tenemos que restarle 3 dias
  else if(fechaInput==3){
    fechaEntrada=
            new Date(
              Number(annio),
              Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
              Number(dia)-3,
            );
  }
  // Si el usuario coloco dptoImport como input, entoces llegada al pais es 4 dias menos
  else if(fechaInput==4){
    fechaEntrada=
            new Date(
              Number(annio),
              Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
              Number(dia)-4,
            );
  }
  // Si el usuario coloco listoSap como input, entoces llegada al pais es 5 dias menos
  else if(fechaInput==5){
    fechaEntrada=
            new Date(
              Number(annio),
              Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
              Number(dia)-5,
            );
  }
  let llegadaAlmacen=
        new Date(
          fechaEntrada.getFullYear(),
          fechaEntrada.getMonth(),
          fechaEntrada.getDate()+3,);

  let llegadaDptoImport=
        new Date(
          llegadaAlmacen.getFullYear(),
          llegadaAlmacen.getMonth(),
          llegadaAlmacen.getDate()+1,);

  let llegadaSap=
        new Date(
          llegadaDptoImport.getFullYear(),
          llegadaDptoImport.getMonth(),
          llegadaDptoImport.getDate()+1,);

  let textoFechaConfirmada=confirmada?' confirmada':'';

  return {
    llegadaAlPais:format(fechaEntrada,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es}) +textoFechaConfirmada,
    llegadaAlmacen:format(llegadaAlmacen,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es}) +textoFechaConfirmada,
    llegadaDptoImport:format(llegadaDptoImport,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es})+textoFechaConfirmada,
    llegadaSap:format(llegadaSap,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es})+textoFechaConfirmada,
  };
}