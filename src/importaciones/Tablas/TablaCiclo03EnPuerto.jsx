import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import { NavLink } from 'react-router-dom';
import { Alerta } from '../../components/Alerta';
import {doc, writeBatch } from 'firebase/firestore';
import db from '../../firebase/firebaseConfig';
import { ControlesTablasMain } from '../components/ControlesTablasMain';
// import { BotonQuery } from '../../components/BotonQuery';
import { BtnGeneralButton } from '../../components/BtnGeneralButton';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import imgCheck from '../../../public/img/checkImg.png';
import imgX from '../../../public/img/xImg.png';
import { ModalLoading } from '../../components/ModalLoading';
import FuncionUpWayDate from '../components/FuncionUpWayDate';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { faAnglesRight, faRotate,} from '@fortawesome/free-solid-svg-icons';
import { getAuth } from 'firebase/auth';

export const TablaCiclo03EnPuerto = ({
  dbBillOfLading,
  userMaster,
}) => {
  const auth=getAuth();
  const usuario=auth.currentUser;

  const [accesoFullIMS, setAccesoFullIMS]=useState(false);
  useEffect(()=>{

    if(userMaster){
      userMaster.privilegios.forEach((pri)=>{
        if (pri.code === "fullAccessIMS" && pri.valor === true) {
          setAccesoFullIMS(true);
        }
      });

    }

  },[usuario,userMaster]);

  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta]=useState(false);
  const [mensajeAlerta, setMensajeAlerta]=useState('');
  const [tipoAlerta, setTipoAlerta]=useState('');

  const [habilitar,setHabilitar]=useState({
    // search:true,
    opcionesUnicas:true,
    destino:true,
  });

  const [isLoading,setIsLoading]=useState(false);

  useEffect(()=>{
    if(dbBillOfLading.length>0){
      setIsLoading(false);
    }
    if(dbBillOfLading.length==0){
      setIsLoading(true);
    }
  },[dbBillOfLading]);

  // // ******************** CONSOLIDACION ******************** //
  const [listaBLsMaster, setListaBLsMaster]=useState([]);
  const [initialValueBLs,setInitialValueBLs]=useState([]);

  const [initialValueFurgones,setInitialValueFurgones]=useState([]);
  const [listaFurgonesMaster,setListaFurgonesMaster]=useState([]);

  // Codigo programacion consumible
  const [initialValueProgramacion, setInitialValueProgramacion]=useState([]);
  const [listaProgramacion, setListaProgramacion]=useState([]);

  // Codigo para la parte editable y fechas
  const [listaFurgonesEditable,setListaFurgonesEditable]=useState([]);
  const [initialValueEditable,setInitialValueEditable]=useState([]);

  useEffect(()=>{
    // ***** BILL OF LADING *****
    // No mostrar bl eliminados
    const blsSinEliminados=dbBillOfLading.filter((bl)=>{
      return bl.estadoDoc!=2;
    });

    // Calcular y filtrar estado del documento Abierto o Cerrado
    // Dame solo los BL con sus furgones en transito maritimo
    const blsFiltrados=(blsSinEliminados.filter((bl)=>{
      // let estadoDoc=0;
      // // Abierto
      // if(bl.furgones.every(furgon=>furgon.status<5)==true){
      //   estadoDoc=0;
      // }
      // // Cerrado
      // else if(bl.furgones.every(furgon=>furgon.status==5)==true){
      //   estadoDoc=1;
      // }
      // // Eliminado
      // if(bl.estadoDoc==2){
      //   estadoDoc=2;
      // }

      let transito=false;
      // Transito Maritimo
      if(bl.furgones.some(furgon=>furgon.status==2)==true){
        transito=true;
      }

      if(transito==true){
        return bl;
      }
    }));

    //Agregar propiedad de dias restantes
    const blParsed=blsFiltrados.map((bill)=>{
      let diasLibres=bill.diasLibres;
      let annio=bill.llegadaAlPais.slice(6,10);
      let mes=bill.llegadaAlPais.slice(3,5);
      let dia=bill.llegadaAlPais.slice(0,2);

      let fechaActual= new Date();

      let llegadaAlPaisPlana=
      new Date(
        Number(annio),
        Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
        Number(dia),
      );

      let diasLibresEnMiliSegundos = diasLibres * 24 * 60 * 60 * 1000;
      let diferenciaMilisegundos = llegadaAlPaisPlana - fechaActual + diasLibresEnMiliSegundos;
      let diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

      return{
        ...bill,
        diasRestantes:diasRestantes
      };
    });

    // Ordenar por dias libres
    const blsOrdenados = blParsed.sort((a, b)=> {
      return a.diasRestantes - b.diasRestantes;
    });
    setInitialValueBLs(blsOrdenados);
    setListaBLsMaster(blsOrdenados);

    // ***** CONTENEDORES *****
    let furgones = [];
    for (const bill of dbBillOfLading) {
      if(bill.estadoDoc!=2){
        for (const furgon of bill.furgones) {
          // Agregar propiedad dias restantes
          let diasLibres=bill.diasLibres;
          let annio=bill.llegadaAlPais.slice(6,10);
          let mes=bill.llegadaAlPais.slice(3,5);
          let dia=bill.llegadaAlPais.slice(0,2);

          let fechaActual= new Date();

          let llegadaAlPaisPlana=
          new Date(
            Number(annio),
            Number(mes-1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
            Number(dia),
          );
          let diasLibresEnMiliSegundos = diasLibres * 24 * 60 * 60 * 1000;
          let diferenciaMilisegundos = llegadaAlPaisPlana - fechaActual + diasLibresEnMiliSegundos;
          let diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

          if(furgon.status==2){
            furgones=[
              ...furgones,
              {
                ...furgon,
                proveedor:bill.proveedor,
                bl:bill.numeroDoc,
                puerto:bill.puerto,
                naviera:bill.naviera,
                diasLibres:bill.diasLibres,
                diasRestantes:diasRestantes,
              }
            ];
          }
        }
      }
    }
    // Ordenar por dias restantes
    const sortFurgones=furgones.sort( (a, b)=> {
      return a.diasRestantes - b.diasRestantes;
    });

    setInitialValueFurgones(sortFurgones);
    setListaFurgonesMaster(sortFurgones);

    // ******CODIGO EDITABLE******
    // Si la fecha de programacion esta fuera del rango de las dos semana, entonces debe elimarse el standby
    // let fechaActual= new Date()
    // const numeroDiaES6 = fechaActual.getDay();
    // const numeroDiaParsed=numeroDiaES6>0?numeroDiaES6-1:6

    // // Obtener la fecha del lunes de la primera semana
    // const lunesInicialES6=new Date(fechaActual)
    // lunesInicialES6.setDate(fechaActual.getDate()-numeroDiaParsed)

    // // Obtener la fecha del domingo de la segunda semana
    // const domingoFinalES6=new Date(lunesInicialES6)
    // domingoFinalES6.setDate(lunesInicialES6.getDate()+13)

    // // Convertir esas fechas en string
    // const lunesParsed=  format(lunesInicialES6,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es})
    // const domingoParse=  format(domingoFinalES6,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es})

    // // Obtener esas fechas pero con horario de 12:00AM
    // const lunes12AMES6=new Date(
    //   Number(lunesParsed.slice(6,10)),
    //   Number(lunesParsed.slice(3,5)),
    //   Number(lunesParsed.slice(0,2))
    // )
    // const dom12AMES6=new Date(
    //   Number(domingoParse.slice(6,10)),
    //   Number(domingoParse.slice(3,5)),
    //   Number(domingoParse.slice(0,2))
    // )

    // ALIMENTANDO EL ARRAY EDITABLE
    // let editable=(prevState =>
    let editable=sortFurgones.map((furgon) => {
      // let fecha = new Date(
      //   Number(furgon.fechaRecepProg?.slice(6,10)),
      //   Number(furgon.fechaRecepProg?.slice(3,5)),
      //   Number(furgon.fechaRecepProg?.slice(0,2))
      // )

      // Si la fecha de llegada almacen esta fuera del rango de las 2 semanas, entonces que se le quite el stanby, por lo tanto no pertence a la programacion
      return furgon;
      // if(fecha<lunes12AMES6||
      //   fecha>dom12AMES6
      //   ){
      //   return{
      //     ...furgon,
      //     standBy:''
      //   }
      // }
      // else{
      //   return furgon
      // }
    });

    setInitialValueEditable(editable);
    setListaFurgonesEditable(editable);

    // ******PROGRAMACION CONSUMIBLE******
    let programacion =(sortFurgones.filter((furgon)=>{
      if(furgon.standBy==2){
        return furgon;
      }
    }));
    setListaProgramacion(programacion);
    setInitialValueProgramacion(programacion);

  }, [dbBillOfLading]);

  // // ******************** ALIMENTANDO FECHAS ******************** //
  // const [hasFurgonSet,setHasFurgonSet]=useState(new Set())
  const [weekSelected, setWeekSelected]=useState(
    {
      week1:
      [
        {
          nombre:'Lunes',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Martes',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Miercoles',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Jueves',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Viernes',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Sabado',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Domingo',
          selected:false,
          fecha:'',
          disabled:false,
        },

      ],
      week2:[
        {
          nombre:'Lunes',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Martes',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Miercoles',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Jueves',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Viernes',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Sabado',
          selected:false,
          fecha:'',
          disabled:false,
        },
        {
          nombre:'Domingo',
          selected:false,
          fecha:'',
          disabled:false,
        },
      ]
    });

  useEffect(()=>{
    // ALIMENTANDO FECHAS

    //Esto es para que el domingo sea el ultimo dia, no el primero como en JS normalmente
    let fechaActual=new Date();
    const numeroDiaES6 = fechaActual.getDay();
    const numeroDiaParsed=numeroDiaES6>0?numeroDiaES6-1:6;

    // // Saber si existen furgones con la fecha de X dia
    // const newFurgonSet= hasFurgonSet
    // newFurgonSet.clear()
    // listaFurgonesEditable.forEach((furgon)=>{
    //   newFurgonSet.add(furgon.llegadaAlmacen.slice(0,10))
    // })
    // setHasFurgonSet(newFurgonSet)

    setWeekSelected({
      ...weekSelected,
      week1:[
        ...weekSelected.week1.map((day,i)=>{{
          let fecha = '';
          if(i==numeroDiaParsed){
            fecha=fechaActual;
          }
          else if(i>numeroDiaParsed){
            fecha=new Date();
            let dif=i-numeroDiaParsed;
            fecha.setDate(fechaActual.getDate() + dif);
          }
          else if(i<numeroDiaParsed){
            fecha=new Date();
            let dif=i-numeroDiaParsed;
            fecha.setDate(fechaActual.getDate() + dif);
          }
          let fechaFormato=format(fecha,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es});

          //  Contar cantidad de furgones por dia
          let arrayFecha =listaProgramacion.filter((furgon)=>{
            // console.log(furgon);
            if(furgon.fechaRecepProg?.slice(0,10)==fechaFormato.slice(0,10)){
              return furgon;
            }
          });

          return{
            ...day,
            disabled:numeroDiaParsed>i?true:false,
            fecha:fechaFormato,
            qtyFurgones:arrayFecha.length,
          };
        }})
      ],
      week2:[
        ...weekSelected.week2.map((day,i)=>{
          // Primero dime cual es la diferencia de dias de hoy hasta el lunes de la semana proxima
          let fechaActual=new Date();
          const numeroDiaES6 = fechaActual.getDay();
          // Si el dia es domingo entonces sera igual a 6, ese decir el septimo dia, hago esto dado que para js el domingo es primer dia pero es mas sencillo para el usuario si el lunes es el primer dia
          const numeroDiaParsed=numeroDiaES6>0?numeroDiaES6-1:6;
          // let dif=7-new Date().getDay()
          let dif=7-numeroDiaParsed;
          // dias a sumar sera igual a la diferencia de hoy hasta el lunes mas i que es que ira sumando lunes, martes miercoles...
          let diasASumar=dif+i;
          let fechaFinal=new Date();
          fechaFinal.setDate(fechaActual.getDate() + diasASumar);

          let fechaFormato=format(fechaFinal,`dd/MM/yyyy hh:mm:ss:SSS aa`,{locale:es});

          //  Contar cantidad de furgones por dia
          let arrayFecha =listaProgramacion.filter((furgon)=>{
            if(furgon.fechaRecepProg?.slice(0,10)==fechaFormato.slice(0,10)){
              return furgon;
            }
          });

          return{
            ...day,
            fecha:fechaFormato,
            qtyFurgones:arrayFecha.length,
          };
        })
      ]
    });
  },[listaFurgonesEditable, listaProgramacion]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput]=useState('');

  const handleSearch=(e)=>{
    let entradaMaster=e.target.value.toLowerCase();
    setBuscarDocInput(entradaMaster);

    if(arrayOpciones[0].select==true){
      if(e.target.name=='inputBuscar'){
        setListaBLsMaster(initialValueBLs.filter((bl)=>{
          if(
            bl.numeroDoc.toLowerCase().includes(entradaMaster)||
              bl.proveedor.toLowerCase().includes(entradaMaster)||
              bl.naviera.toLowerCase().includes(entradaMaster)||
              bl.puerto.toLowerCase().includes(entradaMaster)
          ){
            return bl;
          }
        }));
      }
    }
    else if(arrayOpciones[1].select==true){
      if(e.target.name=='inputBuscar'){
        setListaFurgonesMaster(initialValueFurgones.filter((furgon)=>{
          if(
            furgon.numeroDoc.toLowerCase().includes(entradaMaster)||
              furgon.proveedor.toLowerCase().includes(entradaMaster)||
              furgon.bl.toLowerCase().includes(entradaMaster)||
              furgon.naviera.toLowerCase().includes(entradaMaster)||
              furgon.puerto.toLowerCase().includes(entradaMaster)
          ){
            return furgon;
          }
        }));
      }
    }

    else if(modoAvanzar){
      if(e.target.name=='inputBuscar'){
        setListaFurgonesEditable(initialValueEditable.filter((furgon)=>{
          if(
            furgon.numeroDoc.toLowerCase().includes(entradaMaster)||
              furgon.proveedor.toLowerCase().includes(entradaMaster)||
              furgon.bl.toLowerCase().includes(entradaMaster)||
              furgon.naviera.toLowerCase().includes(entradaMaster)||
              furgon.puerto.toLowerCase().includes(entradaMaster)
          ){
            return furgon;
          }
        }));
      }

    }
    if(e.target.value==''&&buscarDocInput==''){
      setListaBLsMaster(initialValueBLs);
      setListaFurgonesMaster(initialValueFurgones);
      setListaFurgonesEditable(initialValueEditable);
    }
  };

  // // ******************** MANEJANDO OPCIONES UNICAS ******************** //
  // Esto se modifico y se quito la opcion de articulos
  const [arrayOpciones, setArrayOpciones]=useState([
    {
      nombre:'BLs',
      opcion:0,
      select: false
    },
    {
      nombre:'Contenedores',
      opcion:1,
      select: false
    },
    {
      nombre:'Programacion',
      opcion:2,
      select: true
    },
  ]);

  const handleOpciones=(e)=>{
    setModoAvanzar(false);
    setListaFurgonesEditable(initialValueEditable);

    setBuscarDocInput('');
    let index=Number(e.target.dataset.id);

    if(index<2){
      setHabilitar({
        ...habilitar,
        search:true,
        destino:false,
      });
    }
    else if(index==2){
      setHabilitar({
        ...habilitar,
        search:false,
        destino:true,
      });
      setRefreshDestino(!refreshDestino);
    }
    setArrayOpciones(prevOpciones =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );

    setWeekSelected({
      ...weekSelected,
      week1:[
        ...weekSelected.week1.map((day)=>{
          return{
            ...day,
            selected:false
          };
        })
      ],
      week2:[
        ...weekSelected.week2.map((day)=>{
          return{
            ...day,
            selected:false
          };
        })
      ],
    });

    setRefreshDestino(!refreshDestino);
  };

  // ************************** CODIGO AVANZAR ********************************* //
  const [modoAvanzar, setModoAvanzar]=useState(false);

  const avanzar=()=>{
    setModoAvanzar(true);
    setHabilitar({
      ...habilitar,
      search:true,
      destino:false,
    });
    setListDestinos([]);

    setArrayOpciones(prevOpciones =>
      prevOpciones.map((opcion) => ({
        ...opcion,
        select: false,
      }))
    );
  };

  const selecionarDia=(e)=>{
    let validacionDiaActivo=true;
    let index=Number(e.target.dataset.id);
    const nombre=e.target.dataset.nombre;

    // Si el dia selecionado esta inactivo
    if(nombre=='semana1'){
      if(weekSelected.week1[index].disabled==true){
        // validacionDiaActivo=false
        setMensajeAlerta('Este dia es anterior a la fecha actual.');
        setTipoAlerta('warning');
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
    }

    if(validacionDiaActivo==true){
      if(nombre=='semana1'){
        setWeekSelected({
          week1:[
            ...weekSelected.week1.map((day,i)=>{
              return{
                ...day,
                selected:
                i===index&&day.selected==false?
                  true
                  :
                  false
              };
            })
          ],

          week2:[
            ...weekSelected.week2.map((day)=>{
              return{
                ...day,
                selected:false
              };
            })
          ]
        });
      }
      else if(nombre=='semana2'){
        setWeekSelected({
          week1:[
            ...weekSelected.week1.map((day)=>{
              return{
                ...day,
                selected:false
              };
            })
          ],
          week2:[
            ...weekSelected.week2.map((day,i)=>{
              return{
                ...day,
                selected:
                i===index&&day.selected==false?
                  true
                  :
                  false
              };
            })
          ]
        });
      }
    }
  };

  const selecionarFurgon=(e)=>{
    let validacion={
      fechaElegida:false
    };
    let noFurgon=e.target.dataset.furgon;
    let fechaTomar='';

    weekSelected.week1.forEach((day)=>{
      if(day.selected==true){
        validacion.fechaElegida=true;
        fechaTomar=day.fecha;
      }
    });
    weekSelected.week2.forEach((day)=>{
      if(day.selected==true){
        validacion.fechaElegida=true;
        fechaTomar=day.fecha;
      }
    });
    const annio= fechaTomar.slice(6,10);
    const mes= fechaTomar.slice(3,5);
    const dia= fechaTomar.slice(0,2);
    const { llegadaAlmacen,llegadaDptoImport,llegadaSap}=FuncionUpWayDate(annio,mes,dia,3);

    if(validacion.fechaElegida==false){
      setMensajeAlerta('Indique dia a programar.');
      setTipoAlerta('warning');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    if(validacion.fechaElegida==true){
      // aplicar al Editable Master
      setListaFurgonesEditable(listaFurgonesEditable.map((furgon)=>{
        if(furgon.numeroDoc==noFurgon){
          return {
            ...furgon,
            standBy:2,
            llegadaAlmacen:llegadaAlmacen,
            fechaRecepProg:llegadaAlmacen,
            llegadaDptoImport:llegadaDptoImport,
            llegadaSap:llegadaSap,
          };
        }
        else{
          return furgon;
        }
      }));
      // Aplicar al Editable initial value
      setInitialValueEditable(initialValueEditable.map((furgon)=>{
        if(furgon.numeroDoc==noFurgon){
          return {
            ...furgon,
            standBy:2,
            llegadaAlmacen:llegadaAlmacen,
            fechaRecepProg:llegadaAlmacen,
            llegadaDptoImport:llegadaDptoImport,
            llegadaSap:llegadaSap,
          };
        }
        else{
          return furgon;
        }
      }));

    }
  };

  const descelecionarFurgon=(e)=>{
    let noFurgon=e.target.dataset.furgon;
    if(modoAvanzar){
      // Aplicar al Editable Master
      setListaFurgonesEditable(listaFurgonesEditable.map((furgon)=>{
        if(furgon.numeroDoc==noFurgon){
          return{
            ...furgon,
            standBy:'',
            fechaRecepProg:''
          };
        }
        else {
          return furgon;
        }
      }));
      // Aplicar al Editable initial value
      setInitialValueEditable(initialValueEditable.map((furgon)=>{
        if(furgon.numeroDoc==noFurgon){
          return{
            ...furgon,
            standBy:'',
            fechaRecepProg:''
          };
        }
        else {
          return furgon;
        }
      }));

    }
  };

  function primeraMayuscula(palabra) {
    // return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
  }

  const handleInputsTabla=(e)=>{
    let noFurgon=e.target.dataset.furgon;
    const { name, value } = e.target;

    setListaFurgonesEditable(prevState =>
      prevState.map((furgon) => ({
        ...furgon,
        destino:
          noFurgon==furgon.numeroDoc&&name=='destino'?
            primeraMayuscula(value)
            :
            furgon.destino
      }))
    );
  };

  // *********************** RESET PROGRAMACION ************************
  const resetProgramacion=()=>{
    let newEditable=[];
    newEditable=(listaFurgonesEditable.map((furgon)=>{
      return{
        ...furgon,
        standBy:'',
        fechaRecepProg:'',
      };
    }));
    setListaFurgonesEditable(newEditable);
    setInitialValueEditable(newEditable);
  };

  // *******************GUARDAR EN BASE DE DATOS***************
  const guardarCambios=async()=>{
    setIsLoading(true);
    // Reiniciar propiedades
    const newListaFurgones=listaFurgonesEditable.map((furgon)=>{
      return{
        ...furgon,
        bl:null,
        diasRestantes:null,
        diasLibres:null,
      };
    });

    const blsUpdate=initialValueBLs.map((bl)=>{
      const furgonesUpdate=bl.furgones.map((furgon)=>{
        const furgonUpdate=newListaFurgones.find((container)=>{
          if(container.numeroDoc==furgon.numeroDoc){
            return container;
          }
        });

        if(furgonUpdate){
          return furgonUpdate;
        }
        else{
          return {
            ...furgon,
            bl:null
          };
        }
      });
      return{
        ...bl,
        furgones:furgonesUpdate,
        diasRestantes:null
      };
    });

    const batch = writeBatch(db);
    try{
      blsUpdate.forEach((bl)=>{
        const blId=bl.id;
        const blActualizar=doc(db,"billOfLading", blId);
        batch.update(blActualizar,bl);
      });
      await batch.commit();
      setMensajeAlerta('Programacion guardada correctamente.');
      setTipoAlerta('success');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);

      // Redirecionar
      setBuscarDocInput('');
      setModoAvanzar(false);
      let newOpciones=arrayOpciones;
      newOpciones[2].select=true;
      setArrayOpciones(newOpciones);

      setHabilitar({
        ...habilitar,
        search:false,
        destino:true,
      });
      setRefreshDestino(!refreshDestino);
      setIsLoading(false);

    }
    catch(error){
      console.error('Error al realizar la transacción:', error);
      setIsLoading(false);
      setMensajeAlerta('Error con la base de datos.');
      setTipoAlerta('error');
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 7000);
    }
  };

  // // ******************** MANEJANDO PROGRAMACION CONSUMIBLE ******************** //
  const [listDestinos, setListDestinos]=useState([]);
  const [refreshDestino, setRefreshDestino]=useState(false);
  useEffect(()=>{

    // Obtener listado de destinos para crear el menu desplegable
    let destinos=new Set();
    const destinosTodos=[];
    if(initialValueProgramacion.length>0){
      initialValueProgramacion.forEach((furgon)=>{
        if(furgon.standBy==2){
          destinos.add(furgon.destino);
          destinosTodos.push(furgon.destino);
        }
      });
    }

    let arrayDestinos=(Array.from(destinos));
    let newListDestino=[];

    arrayDestinos.forEach((dest)=>{
      const qtyDestinos=destinosTodos.filter((lugar)=>{
        if(lugar==dest){
          return lugar;
        }
      });

      let stringDestino=`${qtyDestinos.length} - ${qtyDestinos[0]}`;
      newListDestino=([
        ...newListDestino,
        stringDestino
      ]);

    });

    setListDestinos(newListDestino);

  },[refreshDestino,initialValueProgramacion]);

  const handleDestino=(e)=>{
    let entrada=e.target.value.toLowerCase();
    const posicionCaracter = entrada.indexOf('-');

    let entradaMaster= entrada.slice(posicionCaracter + 2);

    if(entradaMaster!=''){
      setListaProgramacion(initialValueProgramacion.filter((furgon)=>{
        if(furgon.destino.toLowerCase()==entradaMaster){
          return furgon;
        }
      }));
    }
    else if(entradaMaster==''){
      setListaProgramacion(initialValueFurgones);
    }
    setRefreshDestino(!refreshDestino);
  };

  return (
    <>
      {/* <BotonQuery
      initialValueEditable={initialValueEditable}
      listaFurgonesEditable={listaFurgonesEditable}
    /> */}
      <TituloEncabezadoTabla className='descripcionEtapa'>
        <Resaltar>En puerto</Resaltar>: Es la tercera fase y establece la programación que define el destino de cada contenedor, inicia cuando el BL llega al país (al puerto) y finaliza cuando todos los contenedores de ese BL llegaron a su destino (generalmente un almacen de la empresa).
      </TituloEncabezadoTabla>
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
          Lista de contenedores en puerto.
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

        <CajaControles>
          <CajaBtnAvanzar>
            {
              accesoFullIMS&&
          (modoAvanzar==false?
            <BtnSimple
              onClick={()=>avanzar()}
              className={`avanzar ${modoAvanzar?'modoAvanzar':''}`}
            >
              <Icono icon={faAnglesRight} />
            Avanzar</BtnSimple>
            :
            <BtnSimple
              onClick={()=>guardarCambios()}
            >
              <Icono icon={faFloppyDisk}/>
            Guardar
            </BtnSimple> )
            }
          </CajaBtnAvanzar>

          <ControlesTablasMain
            habilitar={habilitar}
            handleSearch={handleSearch}
            handleOpciones={handleOpciones}
            arrayOpciones={arrayOpciones}
            buscarDocInput={buscarDocInput}
            listDestinos={listDestinos}
            handleDestino={handleDestino}
            tipo={modoAvanzar?'enPuertoAvanzar enPuerto':'enPuerto'}
          />
          {
            modoAvanzar?
              <BtnSimple
                onClick={()=>resetProgramacion()}
                className='resetPrograma'
                title='Borrar programacion'
              >
                <Icono icon={faRotate}/>
            Reset</BtnSimple>
              :
              ''
          }
        </CajaControles>
      </CabeceraListaAll>
      <>
        {
          // Lista de todos los BL *TablaConsulta*
          arrayOpciones[0].select==true?
            <CajaTabla>
              <Tabla>
                {/* <Tabla className={day.nombre.includes('mingo')?'domingo':''}> */}
                <thead>
                  <Filas className='cabeza'>
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Numero*</CeldaHead>
                    <CeldaHead >Proveedor</CeldaHead>
                    <CeldaHead>Naviera</CeldaHead>
                    <CeldaHead>Puerto</CeldaHead>
                    <CeldaHead title='Dias Libres'>DL</CeldaHead>
                    <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                    <CeldaHead>Llegada al pais</CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  {
                    listaBLsMaster.map((bl, index)=>{
                      return(
                        <Filas
                          key={index}
                          className={`body ${bl.diasRestantes<2?'negativo':''}`}
                        >
                          <CeldasBody>{index+1}</CeldasBody>
                          <CeldasBody
                            data-id={index}
                          >
                            <Enlaces
                              to={`/importaciones/maestros/billoflading/${bl.numeroDoc}`}
                              target="_blank"
                            >
                              {bl.numeroDoc}

                            </Enlaces>
                          </CeldasBody>
                          <CeldasBody
                            title={bl.proveedor}
                            className='proveedor'>{bl.proveedor}</CeldasBody>
                          <CeldasBody>{bl.naviera}</CeldasBody>
                          <CeldasBody>{bl.puerto}</CeldasBody>
                          <CeldasBody>{bl.diasLibres}</CeldasBody>
                          <CeldasBody>{bl.diasRestantes}</CeldasBody>

                          <CeldasBody>{bl.llegadaAlPais.slice(0,10)}</CeldasBody>
                          {/* <CeldasBody>
                            <IconoREDES
                              data-id={index}
                              onClick={(e)=>mostrarFurgones(e)}
                            >
                              👁️
                            </IconoREDES>
                          </CeldasBody> */}
                        </Filas>
                      );
                    })
                  }
                </tbody>
              </Tabla>
            </CajaTabla>
            :
          // Lista de todos los furgones *TablaConsulta*
            arrayOpciones[1].select==true?
              <CajaTabla>
                <Tabla>
                  {/* <Tabla className={day.nombre.includes('mingo')?'domingo':''}> */}
                  <thead>
                    <Filas className='cabeza'>
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead>Numero*</CeldaHead>
                      <CeldaHead title='Tamaño'>T</CeldaHead>
                      <CeldaHead>Proveedor</CeldaHead>
                      <CeldaHead>BL*</CeldaHead>
                      <CeldaHead>Naviera</CeldaHead>
                      <CeldaHead>Puerto</CeldaHead>
                      <CeldaHead title='Dias Libres'>DL</CeldaHead>
                      <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                      <CeldaHead >En Almacen</CeldaHead>
                    </Filas>
                  </thead>
                  <tbody>
                    {
                      listaFurgonesMaster.map((furgon,index)=>{
                        return(
                          <Filas
                            key={index}
                            className={`body ${furgon.diasRestantes<2?'negativo':''}`}
                          >
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                target="_blank"
                              >
                                {furgon.numeroDoc}
                              </Enlaces>
                            </CeldasBody>
                            <CeldasBody>
                              {furgon.tamannio}
                            </CeldasBody>

                            <CeldasBody
                              title={furgon.proveedor}
                              className='proveedor'>
                              {furgon.proveedor}
                            </CeldasBody>

                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                target="_blank"
                              >
                                {furgon.bl}
                              </Enlaces>
                            </CeldasBody>
                            <CeldasBody
                              className='naviera'
                              title={furgon.naviera}
                            >{furgon.naviera}
                            </CeldasBody>
                            <CeldasBody
                              className='puerto'
                              title={furgon.puerto}
                            >
                              {furgon.puerto}
                            </CeldasBody>

                            <CeldasBody>
                              {furgon.diasLibres}
                            </CeldasBody>
                            <CeldasBody>
                              {furgon.diasRestantes}
                            </CeldasBody>
                            <CeldasBody>
                              {furgon.llegadaAlmacen?.slice(0,10)}
                            </CeldasBody>
                          </Filas>
                        );
                      })
                    }
                  </tbody>

                </Tabla>
              </CajaTabla>

              :
            // Programacion de contenedores *TablaEditable*
            // Semana Actual
            // Planifacion activa (tambien existe planificacion atrasada)
            // Esto debe ser
              arrayOpciones[2].select==true?
                <ContenedorStandBy>

                  <TituloDayStandBy className='tituloEditable'>
            -Programa semana actual:
                  </TituloDayStandBy>
                  {
                    weekSelected.week1?.map((day,index)=>{
                      return(
                        <CajaDayStandBy key={index}>
                          <CajaTextoMasNum>

                            <TituloDayStandBy
                              className={day.disabled?'pasado':''}
                            >
                              {day.nombre+' - '}
                              {
                                day.fecha?
                                  day.fecha.slice(0,10)
                                  :
                                  '~'
                              }
                              {

                                day.disabled&&day.qtyFurgones>0?
                                  <TextroAtrasadoSpan>
                              - Planificacion atrasada
                                  </TextroAtrasadoSpan>
                                  :
                                  ''
                              }
                            </TituloDayStandBy>
                            <TextoNumFurgon>
                              {day.qtyFurgones>0?day.qtyFurgones:'-'}
                            </TextoNumFurgon>
                          </CajaTextoMasNum>

                          {day.disabled==false?
                            <CajaTabla>
                              {/* <Tabla> */}
                              <Tabla className={day.nombre.includes('mingo')?'domingo':''}>
                                <thead>
                                  <Filas className='cabeza'>
                                    <CeldaHead>N°</CeldaHead>
                                    <CeldaHead>Numero*</CeldaHead>
                                    <CeldaHead title='Tamaño'>T</CeldaHead>
                                    <CeldaHead>Proveedor</CeldaHead>
                                    <CeldaHead>BL*</CeldaHead>
                                    <CeldaHead>Naviera</CeldaHead>
                                    <CeldaHead>Puerto</CeldaHead>
                                    <CeldaHead title='Dias Libres'>DL</CeldaHead>
                                    <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                                    <CeldaHead>Destino</CeldaHead>
                                    {
                                      modoAvanzar&&
                        <CeldaHead>Selecion</CeldaHead>
                                    }
                                  </Filas>
                                </thead>
                                <tbody>
                                  {
                                    listaProgramacion.filter((furgon)=>{
                                      if(furgon.standBy==2&&
                              furgon.fechaRecepProg?.slice(0,10)==day.fecha.slice(0,10)){
                                        return furgon;
                                      }
                                    }).map((furgon,index)=>{
                                      return(
                                        <Filas
                                          key={index}
                                          className={`
                              body 
                             
                              ${
                                        furgon.diasRestantes<2?
                                          'negativo'
                                          :
                                          ''
                                        }
                              `}

                                        >
                                          <CeldasBody>{index+1}</CeldasBody>
                                          <CeldasBody>
                                            <Enlaces
                                              to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                              target="_blank"
                                            >
                                              {furgon.numeroDoc}

                                            </Enlaces>

                                          </CeldasBody>
                                          <CeldasBody>{furgon.tamannio}</CeldasBody>
                                          <CeldasBody>{furgon.proveedor}</CeldasBody>
                                          <CeldasBody>
                                            <Enlaces
                                              to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                              target="_blank"
                                            >
                                              {furgon.bl}

                                            </Enlaces>

                                          </CeldasBody>
                                          <CeldasBody>{furgon.naviera}</CeldasBody>
                                          <CeldasBody>{furgon.puerto}</CeldasBody>
                                          <CeldasBody>{furgon.diasLibres}</CeldasBody>
                                          <CeldasBody>{furgon.diasRestantes}</CeldasBody>
                                          <CeldasBody
                                            className='inputEditable'
                                          >
                                            {
                                              modoAvanzar?
                                                <InputEditable
                                                  type='text'
                                                  data-id={index}
                                                  data-furgon={furgon.numeroDoc}
                                                  value={furgon.destino}
                                                  name='destino'
                                                  onChange={(e)=>{handleInputsTabla(e);}}
                                                />
                                                :
                                                furgon.destino
                                            }

                                          </CeldasBody >
                                          {
                                            modoAvanzar&&
                    <CeldasBody className='celdaBtn'>
                      <Imagen
                        data-furgon={furgon.numeroDoc}
                        className='check'
                        onClick={(e)=>descelecionarFurgon(e)}
                        src={imgX}
                      />
                    </CeldasBody>
                                          }

                                        </Filas>
                                      );
                                    })
                                  }
                                </tbody>
                              </Tabla>
                            </CajaTabla>
                            :
                          // Semana Actual
                          // Planificacion atrasada *TablaEditable*
                            day.qtyFurgones>0&&
                   <>
                     <div key={index}>
                       {/* <TextoDiasAtrasados>
                            Existe planificacion atrasada
                          </TextoDiasAtrasados> */}
                       <CajaTabla>
                         {/* <Tabla> */}
                         <Tabla className={day.nombre.includes('mingo')?'domingo':''}>
                           <thead>
                             <Filas className='cabeza'>
                               <CeldaHead>N°</CeldaHead>
                               <CeldaHead>Numero*</CeldaHead>
                               <CeldaHead title='Tamaño'>T</CeldaHead>
                               <CeldaHead>Proveedor</CeldaHead>
                               <CeldaHead>BL*</CeldaHead>
                               <CeldaHead>Naviera</CeldaHead>
                               <CeldaHead>Puerto</CeldaHead>
                               <CeldaHead title='Dias Libres'>DL</CeldaHead>
                               <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                               <CeldaHead>Destino</CeldaHead>
                               {
                                 modoAvanzar&&
                                <CeldaHead>Selecion</CeldaHead>
                               }
                             </Filas>
                           </thead>
                           <tbody>
                             {
                               listaProgramacion.filter((furgon)=>{
                                 if(furgon.standBy==2&&
                                      furgon.fechaRecepProg?.slice(0,10)==day.fecha.slice(0,10)){

                                   return furgon;
                                 }
                               }).map((furgon,index)=>{
                                 return(
                                   <Filas
                                     key={index}
                                     className={`
                                          body
                                          ${furgon.diasRestantes<2?'negativo'
                                     :
                                     ''}
                                        `}>
                                     <CeldasBody>{index+1}</CeldasBody>
                                     <CeldasBody>
                                       <Enlaces
                                         to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                         target="_blank"
                                       >
                                         {furgon.numeroDoc}

                                       </Enlaces>
                                     </CeldasBody>
                                     <CeldasBody>{furgon.tamannio}</CeldasBody>
                                     <CeldasBody>{furgon.proveedor}</CeldasBody>
                                     <CeldasBody>
                                       <Enlaces
                                         to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                         target="_blank"
                                       >
                                         {furgon.bl}

                                       </Enlaces>
                                     </CeldasBody>
                                     <CeldasBody>{furgon.naviera}</CeldasBody>
                                     <CeldasBody>{furgon.puerto}</CeldasBody>
                                     <CeldasBody>{furgon.diasLibres}</CeldasBody>
                                     <CeldasBody>{furgon.diasRestantes}</CeldasBody>
                                     <CeldasBody className='inputEditable'
                                     >
                                       {
                                         modoAvanzar?
                                           <InputEditable
                                             type='text'
                                             data-id={index}
                                             data-furgon={furgon.numeroDoc}
                                             value={furgon.destino}
                                             name='destino'
                                             onChange={(e)=>{handleInputsTabla(e);}}
                                           />
                                           :
                                           furgon.destino
                                       }
                                     </CeldasBody>
                                     {
                                       modoAvanzar&&
                                          <CeldasBody className='celdaBtn'>
                                            <Imagen
                                              data-furgon={furgon.numeroDoc}
                                              className='check'
                                              onClick={(e)=>descelecionarFurgon(e)}
                                              src={imgX}
                                            />
                                          </CeldasBody>
                                     }
                                   </Filas>
                                 );
                               })
                             }
                           </tbody>
                         </Tabla>
                       </CajaTabla>
                     </div>
                   </>
                          }
                        </CajaDayStandBy>
                      );
                    })
                  }
                  <HR/>
                  <TituloDayStandBy className='tituloEditable'>
            -Programa semana próxima:
                  </TituloDayStandBy>
                  {
                    weekSelected.week2?.map((day,index)=>{
                      return(
                        <CajaDayStandBy key={index}>
                          <CajaTextoMasNum>
                            <TituloDayStandBy
                              className={day.disabled?'pasado':''}
                            >
                              {day.nombre+' - '}
                              {
                                day.fecha?
                                  day.fecha.slice(0,10)
                                  :
                                  '~'
                              }
                            </TituloDayStandBy>
                            <TextoNumFurgon>
                              {day.qtyFurgones>0?day.qtyFurgones:'-'}
                            </TextoNumFurgon>
                          </CajaTextoMasNum>
                          {day.disabled==false&&
                  // Semana Proxima *TablaEditable*
                  <CajaTabla>
                    {/* <Tabla> */}
                    <Tabla className={day.nombre.includes('mingo')?'domingo':''}>
                      <thead>
                        <Filas className='cabeza'>
                          <CeldaHead>N°</CeldaHead>
                          <CeldaHead>Numero*</CeldaHead>
                          <CeldaHead title='Tamaño'>T</CeldaHead>
                          <CeldaHead>Proveedor</CeldaHead>
                          <CeldaHead>BL*</CeldaHead>
                          <CeldaHead>Naviera</CeldaHead>
                          <CeldaHead>Puerto</CeldaHead>
                          <CeldaHead title='Dias Libres'>DL</CeldaHead>
                          <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                          <CeldaHead>Destino</CeldaHead>
                        </Filas>
                      </thead>
                      <tbody>
                        {
                          listaProgramacion.filter((furgon)=>{
                            if(furgon.standBy==2&&

                                furgon.fechaRecepProg?.slice(0,10)==day.fecha.slice(0,10)){
                              return furgon;
                            }
                          }).map((furgon,index)=>{
                            return(
                              <Filas
                                key={index}
                                className={`
                              body 
                              
                              ${
                              furgon.diasRestantes<2?
                                'negativo'
                                :
                                ''
                              }
                              `}

                              >
                                <CeldasBody>{index+1}</CeldasBody>
                                <CeldasBody>
                                  <Enlaces
                                    to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                    target="_blank"
                                  >
                                    {furgon.numeroDoc}

                                  </Enlaces>

                                </CeldasBody>
                                <CeldasBody>{furgon.tamannio}</CeldasBody>
                                <CeldasBody>{furgon.proveedor}</CeldasBody>
                                <CeldasBody>
                                  <Enlaces
                                    to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                    target="_blank"
                                  >
                                    {furgon.bl}

                                  </Enlaces>

                                </CeldasBody>
                                <CeldasBody>{furgon.naviera}</CeldasBody>
                                <CeldasBody>{furgon.puerto}</CeldasBody>
                                <CeldasBody>{furgon.diasLibres}</CeldasBody>
                                <CeldasBody>{furgon.diasRestantes}</CeldasBody>
                                <CeldasBody
                                  className='inputEditable'
                                >{furgon.destino}
                                </CeldasBody >

                              </Filas>
                            );
                          })
                        }
                      </tbody>
                    </Tabla>
                  </CajaTabla>
                          }
                        </CajaDayStandBy>
                      );
                    })
                  }

                </ContenedorStandBy>
                :
                ''
        }
        {
        // SemanaR
          modoAvanzar?
            <>
              <div>
                <TituloWeek>Programacion semanal</TituloWeek>
                <ContainerWeek>
                  <WrapSemana>
                    <TextoWeek>Actual: </TextoWeek>
                    <CajaWeek>
                      {
                        weekSelected.week1?.map((dia,index)=>{
                          return(
                            <CajaDay
                              key={index}
                              // className={dia.selected?'selected':''}
                              className={`
                        ${dia.selected?'selected ':''}
                        ${dia.disabled?'disabled ':''}
                      `}
                              onClick={(e)=>{selecionarDia(e);}}
                              data-id={index}
                              data-nombre='semana1'
                            >
                              <TextoDay
                                onClick={(e) => selecionarDia(e)}
                                data-id={index}
                                data-nombre='semana1'
                              >
                                {
                                  dia.nombre=='Miercoles'?
                                    'MI'
                                    :
                                    dia.nombre[0]
                                }
                              </TextoDay>
                            </CajaDay>
                          );
                        })
                      }
                    </CajaWeek>
                  </WrapSemana>
                  <WrapSemana>
                    <TextoWeek>Próxima: </TextoWeek>
                    <CajaWeek>
                      {
                        weekSelected.week2?.map((dia,index)=>{
                          return(
                            <CajaDay
                              key={index}
                              className={`
                        ${dia.selected?'selected ':''}
                        ${dia.disabled?'disabled ':''}
                      `}
                              data-id={index}
                              onClick={(e)=>{selecionarDia(e);}}
                              data-nombre='semana2'
                            >
                              <TextoDay
                                data-nombre='semana2'
                                data-id={index}
                                onClick={(e)=>{selecionarDia(e);}}
                              >
                                {
                                  dia.nombre=='Miercoles'?
                                    'MI'
                                    :
                                    dia.nombre[0]
                                }
                              </TextoDay>
                            </CajaDay>
                          );
                        })
                      }
                    </CajaWeek>
                  </WrapSemana>

                </ContainerWeek>
              </div>
              <CajaTabla>
                <Tabla>
                  {/* <Tabla className={day.nombre.includes('mingo')?'domingo':''}> */}
                  <thead>
                    <Filas className='cabeza'>
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead>Numero*</CeldaHead>
                      <CeldaHead title='Tamaño'>T</CeldaHead>
                      <CeldaHead>Proveedor</CeldaHead>
                      <CeldaHead>BL*</CeldaHead>
                      <CeldaHead>Naviera</CeldaHead>
                      <CeldaHead>Puerto</CeldaHead>
                      <CeldaHead title='Dias Libres'>DL</CeldaHead>
                      <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                      <CeldaHead>Destino</CeldaHead>
                      <CeldaHead>Selecion</CeldaHead>
                    </Filas>
                  </thead>
                  <tbody>
                    {
                      // Tabla principal todos los furgones en PUERTO
                      //  *TablaEditable*
                      listaFurgonesEditable.filter((furgon)=>{
                        if(furgon.standBy!=2){
                          return furgon;
                        }
                      }).map((furgon,index)=>{
                        return(
                          <Filas
                            key={index}
                            className={`body
                    ${
                          furgon.diasRestantes<2?
                            'negativo'
                            :
                            ''
                          }
                    `}

                          >
                            <CeldasBody>{index+1}</CeldasBody>
                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                target="_blank"
                              >
                                {furgon.numeroDoc}

                              </Enlaces>
                            </CeldasBody>
                            <CeldasBody>{furgon.tamannio}</CeldasBody>
                            <CeldasBody>{furgon.proveedor}</CeldasBody>
                            <CeldasBody>
                              <Enlaces
                                to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                target="_blank"
                              >
                                {furgon.bl}

                              </Enlaces>
                            </CeldasBody>
                            <CeldasBody>{furgon.naviera}</CeldasBody>
                            <CeldasBody>{furgon.puerto}</CeldasBody>
                            <CeldasBody>{furgon.diasLibres}</CeldasBody>
                            <CeldasBody>{furgon.diasRestantes}</CeldasBody>
                            <CeldasBody
                              className='inputEditable'
                            >
                              <InputEditable
                                type='text'
                                data-furgon={furgon.numeroDoc}
                                value={furgon.destino}
                                name='destino'
                                onChange={(e)=>{handleInputsTabla(e);}}

                              />
                            </CeldasBody >
                            <CeldasBody className='celdaBtn'>
                              <Imagen
                                data-furgon={furgon.numeroDoc}
                                className='check'
                                onClick={(e)=>selecionarFurgon(e)}
                                src={imgCheck}
                              />
                            </CeldasBody>
                          </Filas>
                        );
                      })
                    }
                  </tbody>
                </Tabla>
              </CajaTabla>
            </>
            :
            ''
        }
        {
          modoAvanzar==true&&
        listaFurgonesEditable.length>0?
            <ContenedorStandBy className='editable'>
              <TituloDayStandBy className='tituloEditable'>
          -Programa semana actual:
              </TituloDayStandBy>
              {
                weekSelected.week1?.map((day,index)=>{
                  return(
                    <CajaDayStandBy key={index}>
                      <TituloDayStandBy
                        className={day.disabled?'pasado':''}
                      >
                        {day.nombre+' - '}
                        {
                          day.fecha?
                            day.fecha.slice(0,10)
                            :
                            '~'
                        }
                        {
                          day.disabled&&day.qtyFurgones>0?
                            <TextroAtrasadoSpan>
                        - Planificacion atrasada
                            </TextroAtrasadoSpan>
                            :
                            ''
                        }

                      </TituloDayStandBy>
                      {day.disabled==false?
                        <CajaTabla>
                          <Tabla className={day.nombre.includes('mingo')?'domingo':''}>
                            {/* <Tabla className={'domingo'}> */}
                            <thead>
                              <Filas className='cabezaEditable'>
                                <CeldaHead>{day.nombre}</CeldaHead>
                                <CeldaHead>Numero*</CeldaHead>
                                <CeldaHead title='Tamaño'>T</CeldaHead>
                                <CeldaHead>Proveedor</CeldaHead>
                                <CeldaHead>BL*</CeldaHead>
                                <CeldaHead>Naviera</CeldaHead>
                                <CeldaHead>Puerto</CeldaHead>
                                <CeldaHead title='Dias Libres'>DL</CeldaHead>
                                <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                                <CeldaHead>Destino</CeldaHead>
                                {
                                  modoAvanzar&&
                      <CeldaHead>Selecion</CeldaHead>
                                }
                              </Filas>
                            </thead>
                            <tbody>
                              {
                                listaFurgonesEditable.filter((furgon)=>{
                                  // Planifacion semana actual
                                  // *TablaEditable*
                                  if(furgon.standBy==2&&
                            furgon.fechaRecepProg?.slice(0,10)==day.fecha.slice(0,10)){
                                    return furgon;
                                  }
                                }).map((furgon,index)=>{
                                  return(
                                    <Filas
                                      key={index}
                                      className={`
                            body 
                            bodyEditabe
                            ${
                                    furgon.diasRestantes<2?
                                      'negativo'
                                      :
                                      ''
                                    }
                            `}
                                    >
                                      <CeldasBody>{index+1}</CeldasBody>
                                      <CeldasBody>
                                        <Enlaces
                                          to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                          target="_blank"
                                        >
                                          {furgon.numeroDoc}
                                        </Enlaces>
                                      </CeldasBody>
                                      <CeldasBody>{furgon.tamannio}</CeldasBody>
                                      <CeldasBody>{furgon.proveedor}</CeldasBody>
                                      <CeldasBody>
                                        <Enlaces
                                          to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                          target="_blank"
                                        >
                                          {furgon.bl}
                                        </Enlaces>
                                      </CeldasBody>
                                      <CeldasBody>{furgon.naviera}</CeldasBody>
                                      <CeldasBody>{furgon.puerto}</CeldasBody>
                                      <CeldasBody>{furgon.diasLibres}</CeldasBody>
                                      <CeldasBody>{furgon.diasRestantes}</CeldasBody>
                                      <CeldasBody
                                        className='inputEditable'
                                      >
                                        {
                                          modoAvanzar?
                                            <InputEditable
                                              type='text'
                                              data-id={index}
                                              data-furgon={furgon.numeroDoc}
                                              value={furgon.destino}
                                              name='destino'
                                              onChange={(e)=>{handleInputsTabla(e);}}
                                            />
                                            :
                                            furgon.destino
                                        }

                                      </CeldasBody >
                                      {
                                        modoAvanzar&&
                  <CeldasBody className='celdaBtn'>
                    <Imagen
                      data-furgon={furgon.numeroDoc}
                      className='check'
                      onClick={(e)=>descelecionarFurgon(e)}
                      src={imgX}
                    />
                  </CeldasBody>
                                      }

                                    </Filas>
                                  );
                                })
                              }
                            </tbody>
                          </Tabla>
                        </CajaTabla>
                        :
                        day.qtyFurgones>0&&
                 <>
                   <div key={index}>
                     {/* <TextoDiasAtrasados>
                        Existe planificacion atrasada
                        </TextoDiasAtrasados> */}
                     <CajaTabla>
                       {/* <Tabla> */}
                       {/* <Tabla className={day.nombre.includes('mingo')?'domingo':''}> */}
                       <Tabla className={'domingo'}>

                         <thead>
                           <Filas className='cabezaEditable'>
                             <CeldaHead>N°</CeldaHead>
                             <CeldaHead>Numero*</CeldaHead>
                             <CeldaHead title='Tamaño'>T</CeldaHead>
                             <CeldaHead>Proveedor</CeldaHead>
                             <CeldaHead>BL*</CeldaHead>
                             <CeldaHead>Naviera</CeldaHead>
                             <CeldaHead>Puerto</CeldaHead>
                             <CeldaHead title='Dias Libres'>DL</CeldaHead>
                             <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                             <CeldaHead>Destino</CeldaHead>
                             {
                               modoAvanzar&&
                              <CeldaHead>Selecion</CeldaHead>
                             }
                           </Filas>
                         </thead>
                         <tbody>
                           {
                             // Planificacion semana actual atrasada
                             // *TablaEditable*
                             listaFurgonesEditable.filter((furgon)=>{
                               if(furgon.standBy==2&&
                                    furgon.fechaRecepProg?.slice(0,10)==day.fecha.slice(0,10)){
                                 return furgon;
                               }
                             }).map((furgon,index)=>{
                               return(
                                 <Filas
                                   key={index}
                                   className={`
                                      bodyEditabe 
                                        body
                                        ${furgon.diasRestantes<2?'negativo'
                                   :
                                   ''}
                                      `}>
                                   <CeldasBody>{index+1}</CeldasBody>
                                   <CeldasBody>
                                     <Enlaces
                                       to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                       target="_blank"
                                     >
                                       {furgon.numeroDoc}
                                     </Enlaces>
                                   </CeldasBody>
                                   <CeldasBody>{furgon.tamannio}</CeldasBody>
                                   <CeldasBody>{furgon.proveedor}</CeldasBody>
                                   <CeldasBody>
                                     <Enlaces
                                       to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                       target="_blank"
                                     >
                                       {furgon.bl}
                                     </Enlaces>
                                   </CeldasBody>
                                   <CeldasBody>{furgon.naviera}</CeldasBody>
                                   <CeldasBody>{furgon.puerto}</CeldasBody>
                                   <CeldasBody>{furgon.diasLibres}</CeldasBody>
                                   <CeldasBody>{furgon.diasRestantes}</CeldasBody>
                                   <CeldasBody className='inputEditable'
                                   >
                                     {
                                       modoAvanzar?
                                         <InputEditable
                                           type='text'
                                           data-id={index}
                                           data-furgon={furgon.numeroDoc}
                                           value={furgon.destino}
                                           name='destino'
                                           onChange={(e)=>{handleInputsTabla(e);}}
                                         />
                                         :
                                         furgon.destino
                                     }
                                   </CeldasBody>
                                   {
                                     modoAvanzar&&
                                        <CeldasBody className='celdaBtn'>
                                          <Imagen
                                            data-furgon={furgon.numeroDoc}
                                            className='check'
                                            onClick={(e)=>descelecionarFurgon(e)}
                                            src={imgX}
                                          />
                                        </CeldasBody>
                                   }

                                 </Filas>
                               );
                             })
                           }

                         </tbody>
                       </Tabla>
                     </CajaTabla>
                   </div>
                 </>
                      }
                    </CajaDayStandBy>
                  );
                })
              }
              <HR/>
              <TituloDayStandBy className='tituloEditable'>
          -Programa semana próxima:
              </TituloDayStandBy>
              {
                weekSelected.week2?.map((day,index)=>{
                  return(
                    <CajaDayStandBy key={index}>
                      <TituloDayStandBy
                        className={day.disabled?'pasado':''}
                      >
                        {day.nombre+' - '}
                        {
                          day.fecha?
                            day.fecha.slice(0,10)
                            :
                            '~'
                        }
                      </TituloDayStandBy>
                      {day.disabled==false&&
                <CajaTabla>
                  {/* <Tabla className={day.nombre}> */}
                  <Tabla className={day.nombre.includes('mingo')?'domingo':''}>

                    <thead>
                      <Filas className='cabezaEditable'>
                        <CeldaHead>N°</CeldaHead>
                        <CeldaHead>Numero*</CeldaHead>
                        <CeldaHead title='Tamaño'>T</CeldaHead>
                        <CeldaHead>Proveedor</CeldaHead>
                        <CeldaHead>BL*</CeldaHead>
                        <CeldaHead>Naviera</CeldaHead>
                        <CeldaHead>Puerto</CeldaHead>
                        <CeldaHead title='Dias Libres'>DL</CeldaHead>
                        <CeldaHead title='Dias Restantes'>DR</CeldaHead>
                        <CeldaHead>Destino</CeldaHead>
                        <CeldaHead>Selecion</CeldaHead>
                      </Filas>
                    </thead>
                    <tbody>
                      {
                        // Planificacion semana proxima
                        // *TablaEditable*
                        listaFurgonesEditable.filter((furgon)=>{
                          if(furgon.standBy==2&&
                              furgon.fechaRecepProg?.slice(0,10)==day.fecha.slice(0,10)){
                            return furgon;
                          }
                        }).map((furgon,index)=>{
                          return(
                            <Filas
                              key={index}
                              className={`
                            bodyEditabe 
                            body 
                            
                            ${
                            furgon.diasRestantes<2?
                              'negativo'
                              :
                              ''
                            }
                            `}

                            >
                              <CeldasBody>{index+1}</CeldasBody>
                              <CeldasBody>
                                <Enlaces
                                  to={`/importaciones/maestros/contenedores/${furgon.numeroDoc}`}
                                  target="_blank"
                                >
                                  {furgon.numeroDoc}

                                </Enlaces>

                              </CeldasBody>
                              <CeldasBody>{furgon.tamannio}</CeldasBody>
                              <CeldasBody>{furgon.proveedor}</CeldasBody>
                              <CeldasBody>
                                <Enlaces
                                  to={`/importaciones/maestros/billoflading/${furgon.bl}`}
                                  target="_blank"
                                >
                                  {furgon.bl}
                                </Enlaces>
                              </CeldasBody>
                              <CeldasBody>{furgon.naviera}</CeldasBody>
                              <CeldasBody>{furgon.puerto}</CeldasBody>
                              <CeldasBody>{furgon.diasLibres}</CeldasBody>
                              <CeldasBody>{furgon.diasRestantes}</CeldasBody>
                              <CeldasBody
                                className='inputEditable'
                              >
                                <InputEditable
                                  type='text'
                                  data-furgon={furgon.numeroDoc}
                                  value={furgon.destino}
                                  name='destino'
                                  onChange={(e)=>{handleInputsTabla(e);}}

                                />
                              </CeldasBody >
                              <CeldasBody className='celdaBtn'>
                                <Imagen
                                  data-furgon={furgon.numeroDoc}
                                  className='check'
                                  onClick={(e)=>descelecionarFurgon(e)}
                                  src={imgX}
                                />
                              </CeldasBody>
                            </Filas>
                          );
                        })
                      }
                    </tbody>
                  </Tabla>
                </CajaTabla>
                      }
                    </CajaDayStandBy>
                  );
                })
              }

            </ContenedorStandBy>
            :
            ''
        }
      </>
      {
        isLoading?
          <ModalLoading completa={true}/>
        // <CajaLoader>
        //   <CSSLoader/>
        // </CajaLoader>

          :
          ''
      }
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>

  );
};

const CabeceraListaAll=styled.div`
    background-color: ${theme.azulOscuro1Sbetav};
`;
const CajaTabla=styled.div`
    overflow-x: scroll;
    padding: 0 10px;
    *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        height: 8px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 

`;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
  &.edicion{
    background-color: ${theme.edicionYellow};
    color: #333232;
  }
  &.domingo{
    /* background-color: red; */
    margin-bottom: 85px;

  }
  `;

const Filas =styled.tr`
  &.body{
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${theme.azul5Osc};
  }
  &.descripcion{
    text-align: start;
  }

  &.filaSelected{
    background-color: ${theme.azulOscuro1Sbetav};
    border: 1px solid red;
  }
  &.cabeza{
    background-color: ${theme.azulOscuro1Sbetav};
   
  }
  color: ${theme.azul1};
  &:hover{
    background-color: ${theme.azulOscuro1Sbetav};
  }
  &.cabezaEditable{
    background-color: ${theme.edicionYellow};
    color: #333232;
  }

  &.negativo{
    &.bodyEditabe{
      background-color: ${theme.edicionYellow2};
      /* color: #333232; */
    }
    color: ${theme.danger};
  }
 
`;

const CeldaHead= styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
  &.qty{
    width: 300px;
  }
  &.comentarios{
    max-width: 200px;
  }


`;
const CeldasBody = styled.td`
    font-size: 0.9rem;
    border: 1px solid black;
    height: 25px;
    padding-left: 5px;
    padding-right: 5px;
    

    &.clicKeable{
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
      }
   
    text-align: center;
    &.index{
      /* max-width: 5px; */
      /* background-color: red; */
    }
   
    &.descripcion{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 150px;
    }
    &.proveedor{
      text-align: start;
      padding-left: 5px;
      white-space: nowrap;
      overflow: hidden;    
      text-overflow: ellipsis;
      max-width: 100px;
    }
    &.comentarios{
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;   
      text-overflow: ellipsis;
    }
    &.status{
    max-width: 80px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;    
  }
  &.inputEditable{
      padding: 0;
      width: 100px;
      /* display: flex; */
      /* flex-direction: column; */
      /* flex-wrap: nowrap; */
    
    }
    /* &.celdaBtn{
      padding: 0;
    } */
    
`;

const Enlaces=styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover{
    text-decoration: underline;
  }
`;

const EncabezadoTabla =styled.div`
  /* margin-top: 20px; */
  background-color: ${theme.azulOscuro1Sbetav};
  padding-left: 15px;

  display: flex;
  justify-content: start;
  align-items: center;
`;
const TituloEncabezadoTabla=styled.h2`
  color: #757575;
  font-size: 1.2rem;
  font-weight: normal;
  padding:0 15px;
  @media screen and (max-width:500px){
    font-size: 16px;

  }
  @media screen and (max-width:420px){
    font-size: 14px;

  }
  &.descripcionEtapa{
    font-size: 0.9rem;
    margin: 0;
    @media screen and (max-width:480px){
      font-size: 12px;
    }
  }
  
`;
const Resaltar =styled.span`
  text-decoration: underline;
  font-weight: bold;
`;
const CajaControles=styled.div`
  display: flex;
  align-items: end;
  padding: 0 15px;
  @media screen and (max-width:1000px){
    flex-direction: column;
    
  }
`;
const CajaBtnAvanzar=styled.div`
width: 100%;
  display: flex;
  justify-content: start;
  align-items: end;
  height: 100%;
  padding: 5px;
`;

const BtnSimple=styled(BtnGeneralButton)`
  height: 30px;
  margin: 0;

  min-width: 120px;
  &.avanzar{

  background-color: ${theme.warning};
  color: black;

  &.modoAvanzar{

    background-color:  #a79d9d;
      color: #383e44;
    
  }
  &:focus{
    /* background-color:  #a79d9d; */
    color: #383e44;

  }
    &:hover{
      background-color: white ;
    /* color: ${theme.warning}; */
    }
    &:active{
      background-color:  #0074d9;
      color: white;
    }
  }
  &.resetPrograma{
    width: auto;
    padding: 0 15px;
  }

`;

const InputCelda=styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${theme.azulOscuro1Sbetav3};
  color: ${theme.azul1};
  &.filaSelected{
    background-color: inherit;
  }
  border: none;
  width: 100%;
  display: flex;
  &:focus{
    border: 1px solid ${theme.azul2};

  }
  
`;

const InputEditable=styled(InputCelda)`
  height: 100%;
  width: 100%;
  margin: 0;
  /* border-radius: 5px; */
  font-size: 0.8rem;
  /* border-radius: 0; */
  /* color: inherit; */

`;
const TituloWeek=styled.h2`
  margin-left: 25px;
  color: ${theme.azul1};
  font-size: 1rem;
  border-bottom: 1px solid ${theme.azul1};

`;
const ContainerWeek=styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  @media screen and (max-width:1000px) {
    flex-direction: column;
    gap: 10px;
    justify-content: start;
    align-items: end;
    
  }
  @media screen and (max-width:300px){
    overflow-x: scroll;
    display: block;
    width: 100%;
    background-color: red;
    
  }

  
`;
const WrapSemana=styled.div`
  display: flex;
  align-items: center;
  /* width: 60%; */

`;
const TextoWeek=styled.h2`
  color: ${theme.azul2};
  @media screen and (max-width:400px) {
    font-size: 20px;
    
  }
`;
const CajaWeek=styled.div`
  display: flex;
  justify-content: space-between;
  /* width: 60%; */
  border: 1px solid ${theme.azul1};
  padding: 4px;
`;

const CajaDay=styled.div`
  border: 1px solid ${theme.azul1};
  border-radius: 5px;
  color: ${theme.azul2};
  cursor: pointer;
  &:hover{
    border: 1px solid ${theme.azul2};
  }
  &.selected{
    background-color: white;
    border: 1px solid ${theme.azul2};
  }
  &.disabled{
    background-color: ${theme.fondo};
    color: white;
    cursor: auto;
    border: none;
    &:hover{
      border: none;
    }
  }
  
`;

const TextoDay=styled.h2`
  margin: 10px;
  color: inherit;
  /* font-size: 18px; */

  @media screen and (max-width:400px) {
    font-size: 20px;
    margin: 6px;
    
  }
 
 
`;
const ContenedorStandBy=styled.div`
  &.editable{
    
  }
`;

const CajaDayStandBy=styled.div`
`;
const HR=styled.hr`
`;

const TituloDayStandBy=styled.h2`

  margin-left: 40px;
  &.pasado{
    font-size: 0.9rem;
    color: ${theme.azul1};
    border-bottom: 1px solid black;
    
  }
  &.tituloCabeza{
    display: inline-block;
    margin-left: 20px;
    color: ${theme.azul1};
    background-color: ${theme.azulOscuro1Sbetav};
  }
  &.tituloEditable{
    display: inline-block;
    margin-left: 20px;
    color: ${theme.azul1};

    /* background-color: ${theme.azulOscuro1Sbetav}; */
  }

  color: ${theme.azul2};
`;

const Icono=styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion{
    cursor: pointer;
  }
`;

const Imagen=styled.img`
  &.check{
    width: 25px;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 2px;
    border-radius: 5px;
    &:hover{
      border: 1px solid ${theme.azul2};
    }
  }
`;
const TextroAtrasadoSpan=styled.span`
font-size: 1.2rem;
    color:${theme.danger};
  text-align: center;  

`;

const CajaTextoMasNum=styled.div`
  display: flex;
  justify-content: space-between;
  /* padding: 0 5px; */
  padding-right: 35px;
  border-bottom: 1px solid ${theme.azul1};
`;
const TextoNumFurgon=styled.h2`
  color: aliceblue;
  color: ${theme.azul2};
`;
