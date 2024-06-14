import React, { useEffect, useState } from 'react'
import theme from '../../theme'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { BtnGeneralButton } from '../components/BtnGeneralButton'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { BotonQuery } from '../components/BotonQuery'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import avatarMale from './../../public/img/avatares/maleAvatar.svg'
import { BtnNormal } from '../components/BtnNormal'
import { Alerta } from '../components/Alerta'
import { Advertencia } from '../components/Advertencia'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import db from '../firebase/firebaseConfig'
import { v4 as uuidv4 } from 'uuid';


export const TutorialesParcial = ({
  dbTutoriales,
  setDBTutoriales,
  dbUsuario,
  userMaster

}) => {
    // Variables varias necesarias
    let location = useLocation();
    const parametro= useParams()
    let docUser = parametro.id


    // Alertas
    const [dispatchAlerta, setDispatchAlerta]=useState(false)
    const [mensajeAlerta, setMensajeAlerta]=useState('')
    const [tipoAlerta, setTipoAlerta]=useState('')
  
    // Advertencias
    const [tipoAdvertencia, setTipoAdvertencia]=useState('')
    const [mensajeAdvertencia, setMensajeAdvertencia]=useState('')
    const [dispatchAdvertencia, setDispatchAdvertencia]=useState(false)
    const [eventFunction,setEventFunction]=useState('')
    const [functAEjecutar, setFunctAEjecutar]=useState('')
  
     // // *************** FUNCION INTERMEDIARIA ADVERTENCIA ****************** //
     const funcionAdvert=(e)=>{
          setTipoAdvertencia('warning')
          setMensajeAdvertencia('¿Seguro que desea eliminar este comentario?')
          setDispatchAdvertencia(true)
          setEventFunction(e)
          setFunctAEjecutar('eliminarDoc')
    }

  const [listaTutoriales, setListaTutoriales]=useState()
  const [listaTutoEditable, setListaTutoEditable]=useState()

  useEffect(()=>{

    let tutorAdd=[]
    if(dbTutoriales.length>0&&dbUsuario.length>0){
      tutorAdd=dbTutoriales?.map((tuto)=>{
        // La fecha de los comentarios llevala a ES6, esto para poder ordenarlo po fecha
        const comentES6=tuto.comentarios.map((coment)=>{
          const annio=coment.fecha.slice(6,10)
          const mes=coment.fecha.slice(3,5)
          const dia=coment.fecha.slice(0,2)
          let hora=coment.fecha.slice(11,13)
          let minutos=coment.fecha.slice(14,16)
          let segundos=coment.fecha.slice(17,19)
          const tipo=coment.fecha.slice(24,27)
    
          if(hora!=12){
            if(tipo=='pm'||tipo=='PM'){
              hora=Number(hora)+12
            }
          }
          if(hora==12){
            if(tipo=='am'||tipo=='AM'){
              hora=0
            }
          }
      
          const fechaES6= new Date(annio,mes-1,dia,hora,minutos,segundos)
      
          return{
            ...coment,
            fecha:fechaES6
          }
        })
          // Ordenar el array de comentarios por fecha 
          function compararFechas(a, b) {
            return a.fecha - b.fecha;
          }
          // Ordenala de fecha mas antigua a mas reciente
          const comentariosOrdenados=comentES6.sort(compararFechas)
          // Convierte todas las fechas en string entendible
          const comentParsed=comentariosOrdenados.map((coment)=>{
            return{
              ...coment,
              fecha:format(coment.fecha,`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es})
            }
          })


          // Coloca Hoy o Ayer
          const comentFinal=(comentParsed.map((coment)=>{
            // --------FECHA RESEÑAS--------
            let fechaComentarioString =coment.fecha;
      
            // Dividir la cadena en partes utilizando "/" y " " como delimitadores
            let partesComent = fechaComentarioString.split(/[\/\s:]+/);
      
            // Obtener los elementos correspondientes del array resultante
            let diaComent = partesComent[0];
            let mesComent = partesComent[1];
            let annioComent = partesComent[2];
      
            let fechaCommentES6=new Date(
              Number(annioComent),
              Number(mesComent)-1,
              Number(diaComent),
            )
      
            // --------FECHA ACTUAL--------
            let fechaActualString=format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es})
            let partesString = fechaActualString.split(/[\/\s:]+/);
      
            let diaActual = partesString[0];
            let mesActual = partesString[1];
            let annioActual = partesString[2];
      
            let fechaActualES6=new Date(
              Number(annioActual),
              Number(mesActual)-1,
              Number(diaActual),
            )
      
      
            let stringMostrar=coment.fecha.slice(0,10)
      
            // Si la fecha es hoy
            if(fechaActualES6.getTime()==fechaCommentES6.getTime()){
              stringMostrar='Hoy'+
              ' '+
              coment.fecha.slice(11,16)
              +
              ' '
              +
              coment.fecha.slice(-2).toLowerCase()
            }
      
            // Si la fecha fue ayer
            let fechaComentMas1Dia=new Date(
              fechaCommentES6.getFullYear(),
              fechaCommentES6.getMonth(),
              fechaCommentES6.getDate()+1,
            )
            if(fechaActualES6.getTime()==fechaComentMas1Dia.getTime()){
              stringMostrar='Ayer'+
              ' '+
              coment.fecha.slice(11,16)
              +
              ' '
              +
              coment.fecha.slice(-2).toLowerCase()
            }
            
            const usuario=dbUsuario.find((usuarioBuscar)=>{
              if(usuarioBuscar.userName==coment.user){
                return usuarioBuscar
              }
            })

            return{
              ...coment,
              fechaMostrar:stringMostrar,

              nombreUsuario:usuario.nombre?usuario.nombre:'',
              apellidoUsuario:usuario.apellido,
              avatar:usuario.urlFotoPerfil,
              editando:false,

             
            }
          }))
        return{
          ...tuto,
          comentarios:comentFinal,

        }
      })
    }
    
    const tutorComentFiltrado=tutorAdd.map((tuto)=>{
      const comentFiltre=tuto.comentarios.filter((tuto)=>{
        if(tuto.estadoDoc==0){
          return tuto
        }
      })

      return{
        ...tuto,
        comentarios:comentFiltre
      }
    })
    
    let tutorParsed=[]
    if(docUser){
      tutorParsed=tutorComentFiltrado.filter((tuto)=>tuto.name==docUser)
    }
    else{
      tutorParsed=tutorComentFiltrado
    }

    setListaTutoriales(tutorParsed)
    setListaTutoEditable(tutorParsed)
    
  },[dbTutoriales,dbUsuario])
  


  const [valorComentario, setValorComentario]=useState('')
  // const [comentEditando, setComentEditando]=useState('')

  const handleInput=(e)=>{
    const id=e.target.dataset.id
    const idComentario=e.target.dataset.idcomentario
    const {value, name}=e.target

    if(name=='valorComentario'){
      setValorComentario(e.target.value)
    }

    if(name=='editando'){
      // setComentEditando(value)
      const tutoSelect=listaTutoriales.find((tuto)=>{
        if(tuto.id==id){
          return tuto
        }
      })

      const comentSelect=tutoSelect.comentarios.find((coment)=>{
        if(coment.idComentario==idComentario){
          return coment
        }
      })

      const comentUp={
        ...comentSelect,
        texto:value
      }

      const listaComentUp=tutoSelect.comentarios.map((coment)=>{
        if(coment.idComentario==comentUp.idComentario){
          return comentUp
        }
        else{
          return coment
        }
      })

      setListaTutoEditable(listaTutoriales.map((tuto)=>{
        return{
          ...tuto,
          comentarios:listaComentUp
        }
      }))
    }
  }

  const agregarComentario=async(e)=>{
    if(userMaster){
      if(valorComentario==''){
        setMensajeAlerta('Aun no escribe un comentario.')
        setTipoAlerta('warning')
        setDispatchAlerta(true)
        setTimeout(() => {
        setDispatchAlerta(false)
      }, 3000);
      }
      if(valorComentario){
        const valorText=valorComentario

        const id=e.target.dataset.id
        const tutorialUp = doc(db, "tutoriales", id);

        const tutorial=dbTutoriales.find((tuto)=>{
          if(tuto.id==id){
            return tuto
          }
        })

        const comentarioUpdated=[
          ...tutorial.comentarios,
          {
            fecha:format(new Date(),`dd/MM/yyyy hh:mm:ss:SSS aa`, {locale:es}),
            texto:valorComentario,
            user:userMaster.userName,
            estadoDoc:0,
            idComentario:uuidv4()
          }
        ]
     
        try{
          setValorComentario('')
          await updateDoc(tutorialUp, {
            comentarios:comentarioUpdated
          })
    
        }
        catch(error){
          setValorComentario(valorText)
          console.log(error)
          setMensajeAlerta('Error con la base de datos')
          setTipoAlerta('error')
          setDispatchAlerta(true)
          setTimeout(() => {
          setDispatchAlerta(false)
        }, 3000);
        }
      }
    }
  }

  
  const eliminarComent=async(e)=>{
    const id=e.target.dataset.id
    const idComentario=e.target.dataset.idcomentario
    const tutorialUp = doc(db, "tutoriales", id);

    const tutorial=dbTutoriales.find((tuto)=>{
      if(tuto.id==id){
        return tuto
      }
    })

    const comentarioUpdated=tutorial.comentarios.map((coment)=>{

      console.log(coment.idComentario )
      console.log(idComentario )
      if(coment.idComentario==idComentario ){
        return{
          ...coment,
          estadoDoc:2,

          apellidoUsuario:null,
          avatar:null,
          editando:false,
          fechaMostrar:null,
          nombreUsuario:null,

        }
      }else{
        return{
          ...coment,
          apellidoUsuario:null,
          avatar:null,
          editando:false,
          fechaMostrar:null,
          nombreUsuario:null,
        }
      }
    })
 
    try{
      setValorComentario('')
      await updateDoc(tutorialUp, {
        comentarios:comentarioUpdated
      })

    }
    catch(error){
      setValorComentario(valorText)
      console.log(error)
      setMensajeAlerta('Error con la base de datos')
      setTipoAlerta('error')
      setDispatchAlerta(true)
      setTimeout(() => {
      setDispatchAlerta(false)
    }, 3000);
    }
  }


  const editarComentario=(e)=>{
    const id=e.target.dataset.id
    const idComentario=e.target.dataset.idcomentario

    const tutoSelect=listaTutoriales.find((tutorial)=>{
      if(tutorial.id==id){
        return tutorial
      }
    })

    const comentSelect=tutoSelect.comentarios.find((coment)=>{
      if(coment.idComentario==idComentario){
        return coment
      }
    })

    const comentUpSelect={
      ...comentSelect,
      editando:true
    }

    const comentListUp=tutoSelect.comentarios.map((coment)=>{
      // console.log()
      if(coment.idComentario==idComentario){
        return comentUpSelect
      }
      else{
        return coment
      }
    })

 

    const alo=(listaTutoriales.map((tuto)=>{
      if(tuto.id==tutoSelect.id){
        return{
          ...tuto,
          comentarios:comentListUp
        }
      }
      else{
        return{
          ...tuto
        }
      }
    }))

    console.log(alo)
    setListaTutoriales(alo)
  }

  const cancelarEdicion=(e)=>{
    const id=e.target.dataset.id
    const idComentario=e.target.dataset.idcomentario

    const tutoSelect=listaTutoriales.find((tutorial)=>{
      if(tutorial.id==id){
        return tutorial
      }
    })

    const comentSelect=tutoSelect.comentarios.find((coment)=>{
      if(coment.idComentario==idComentario){
        return coment
      }
    })

    const comentUpSelect={
      ...comentSelect,
      editando:false
    }

    const comentListUp=tutoSelect.comentarios.map((coment)=>{
      // console.log()
      if(coment.idComentario==idComentario){
        return comentUpSelect
      }
      else{
        return coment
      }
    })

 

    const alo=(listaTutoriales.map((tuto)=>{
      if(tuto.id==tutoSelect.id){
        return{
          ...tuto,
          comentarios:comentListUp
        }
      }
      else{
        return{
          ...tuto
        }
      }
    }))

    setListaTutoriales(alo)
    setListaTutoEditable(listaTutoriales)
  }


  const guardarEdicion=async(e)=>{
    const id=e.target.dataset.id
    const idComentario=e.target.dataset.idcomentario
    

    const tutoSelect=listaTutoEditable.find((tutorial)=>{
      if(tutorial.id==id){
        return tutorial
      }
    })

    const comentSelect=tutoSelect.comentarios.find((coment)=>{
      if(coment.idComentario==idComentario){
        return coment
      }
    })

    const comentListUp=tutoSelect.comentarios.map((coment)=>{
      if(coment.idComentario==idComentario){
        return comentSelect
      }
      else{
        return coment
      }
    })


    const tutorialUp = doc(db, "tutoriales", id);
    try{
      setValorComentario('')
      await updateDoc(tutorialUp, {
        comentarios:comentListUp
      })

    }
    catch(error){
      setValorComentario(valorText)
      console.log(error)
      setMensajeAlerta('Error con la base de datos')
      setTipoAlerta('error')
      setDispatchAlerta(true)
      setTimeout(() => {
      setDispatchAlerta(false)
    }, 3000);
    }
  }

  const darLikeToggle=async(e)=>{
    e.stopPropagation(); // Detener la propagación del evento

    const id=e.currentTarget.dataset.id

    const tutoSelect=listaTutoriales.find((tutorial)=>{
      if(tutorial.id==id){
        return tutorial
      }
    })

    console.log(id)
    console.log(tutoSelect)
    const like=tutoSelect.like

    let likeUp=[]
    if(like.includes(userMaster.userName)){
      likeUp=like.filter((like)=>like!=userMaster.userName)
    }
    else if(!like.includes(userMaster.userName)){
      likeUp=[
        ...like,
        userMaster.userName
      ]
    }



    const tutorialUp = doc(db, "tutoriales", id);
    try{
      await updateDoc(tutorialUp, {
        like:likeUp
      })

    }
    catch(error){
      setValorComentario(valorText)
      console.log(error)
      setMensajeAlerta('Error con la base de datos')
      setTipoAlerta('error')
      setDispatchAlerta(true)
      setTimeout(() => {
      setDispatchAlerta(false)
    }, 3000);
    }
  }

  const [arrayNombreLiked, setArrayNombresLiked]=useState([])

  const mostrarLiked=(e)=>{
    const id=e.currentTarget.dataset.id

    const tutoSelect=listaTutoriales.find((tutorial)=>{
      if(tutorial.id==id){
        return tutorial
      }
    })

    let nuevoArrayNombre=[]
    tutoSelect.like.forEach((like)=>{
        dbUsuario.forEach((persona)=>{
          // console.log(persona.userName)
          console.log(like)
          if(persona.userName==like){
            console.log('asd')
            nuevoArrayNombre=[
              ...nuevoArrayNombre,
              persona.nombre
            ]
          }
          })
    })

    console.log(nuevoArrayNombre)
    setArrayNombresLiked(nuevoArrayNombre)

    const listaUp=listaTutoriales.map((tuto)=>{
      if(tuto.id==id){
        return{
          ...tuto,
          mostrarLikes:true
        }
      }
      else{
        return tuto
      }
    })

    setListaTutoriales(listaUp)

  }

  const hideLiked=(e)=>{
    const id=e.currentTarget.dataset.id

    const tutoSelect=listaTutoriales.find((tutorial)=>{
      if(tutorial.id==id){
        return tutorial
      }
    })

    const listaUp=listaTutoriales.map((tuto)=>{
      if(tuto.id==id){
        return{
          ...tuto,
          mostrarLikes:false
        }
      }
      else{
        return tuto
      }
    })

    setListaTutoriales(listaUp)

  }
  
  return (
    <>
    {/* <BotonQuery
      listaTutoriales={listaTutoriales}
      arrayNombreLiked={arrayNombreLiked}
    /> */}
    <TarjetaDoc>
      {
        listaTutoriales?.map((tutorial,index)=>{
          return(
            <CajaVideo key={index}>
              <Titulos>{tutorial.titulo}</Titulos>

              <CajitaVideo>
                <iframe width="560" height="315" src={tutorial.urlVideo} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
              </CajitaVideo>

              <CajaManoArriba>
                <Icono 
                    bounce={
                      tutorial.like.includes(userMaster.userName)?
                      false
                      :
                      true
                    }
                    icon={faThumbsUp}
                    data-id={tutorial.id}
                    className={
                      tutorial.like.includes(userMaster.userName)?
                      'liked'
                      :
                      ''
                    }
                    onClick={(e)=>darLikeToggle(e)}
                />
                <ContadorLike 
                 data-id={tutorial.id}
                  onMouseEnter={(e)=>mostrarLiked(e)}
                  onMouseLeave={(e)=>hideLiked(e)}
                >
                  {
                  tutorial.like.length + ' Likes'
                  }
                  </ContadorLike>
                  {
                    tutorial.mostrarLikes?
                    <CajaHoverLike>
                    {
                      arrayNombreLiked.map((nombre, index) => (
                        <React.Fragment key={index}>
                          {nombre}
                          <br />
                        </React.Fragment>
                      ))
                    }


                  </CajaHoverLike>
                  :
                  ''
                  }
              </CajaManoArriba> 

            <CajaComentarios>
              {
                tutorial?.comentarios?.map((coment,indexComent)=>{
                  return(
                    <CajaResena 
                    key={indexComent}>
                    <CajaAvatar>
                    <Enlaces 
                        to={'/perfiles/'+coment.user}
                      >
                      <Avatar 
                      className={
                        coment.avatar?
                        ''
                        :
                        'sinFoto'
                      }
                      src={
                        coment.avatar?
                        coment.avatar
                        :

                        avatarMale
                        }/>
                        </Enlaces>
                        
                    </CajaAvatar>
                    <CajaTextoResena>
                      <Enlaces 
                        to={'/perfiles/'+coment.user}
                      >
                        
                      <NombreResena>
                        {
                          coment.nombreUsuario?
                          coment.nombreUsuario+
                          ' '+
                          coment.apellidoUsuario
                          :
                          coment.user
                          }
                      </NombreResena>
                      
                      </Enlaces>
                    
                      {
                        coment.editando?
                        <InputSencillo
                          data-id={tutorial.id}
                          data-idcomentario={coment.idComentario}
                          className='editando'
                          name='editando'
                          value={listaTutoEditable[index].comentarios[indexComent].texto}
                          onChange={(e)=>handleInput(e)}

                        />
                        :
                          <TextoResena>
                            {coment.texto}
                          </TextoResena>
                      }
                      <FechaResennias>
                        {
                         coment.fechaMostrar
                        }
                      </FechaResennias>
                    </CajaTextoResena>
                    {
                      coment.user==userMaster.userName&&
                      <CajaBtn>
                        {
                          coment.editando==false?
                          <>
                          <BtnNormal 
                            data-id={tutorial.id}
                            data-idcomentario={coment.idComentario}
                            onClick={(e)=>funcionAdvert(e)}
                            className='danger'>
                              Eliminar
                            </BtnNormal>
                        <BtnNormal 
                          data-id={tutorial.id}
                          data-idcomentario={coment.idComentario}
                          onClick={(e)=>editarComentario(e)}
                        
                        >Editar</BtnNormal>
                        </>
                        :
                          <>
                          <BtnNormal 
                            data-id={tutorial.id}
                            data-idcomentario={coment.idComentario}
                            onClick={(e)=>cancelarEdicion(e)}
                            className='danger'>
                            Cancelar
                            
                            </BtnNormal>
                        <BtnNormal 
                        data-id={tutorial.id}
                        data-idcomentario={coment.idComentario}
                        onClick={(e)=>guardarEdicion(e)}
                        
                        >Guardar</BtnNormal>
                        </>
                        
                      }
                    </CajaBtn>
                    }
                </CajaResena> 
                  )
                })
              }


            </CajaComentarios>

            <CajaInputComentario>
              <CajaInternaComentario>
                <InputSencillo
                    type='text'
                    name='valorComentario'
                    placeholder='Escriba un comentario.'
                    value={valorComentario}
                    onChange={(e)=>handleInput(e)}
                />
              </CajaInternaComentario>
            </CajaInputComentario>

            <CajaAddFrase>
              <MasFraseBtn
                data-id={tutorial.id}
                onClick={(e)=>agregarComentario(e)}
              >Agregar comentario</MasFraseBtn>
             </CajaAddFrase>

          </CajaVideo>
          )
        })
      }
        
    </TarjetaDoc>
     <Alerta
     estadoAlerta={dispatchAlerta}
     tipo={tipoAlerta}
     mensaje={mensajeAlerta}
     />

     <Advertencia
       tipo={tipoAdvertencia}
       mensaje={mensajeAdvertencia}
       dispatchAdvertencia={dispatchAdvertencia}
       setDispatchAdvertencia={setDispatchAdvertencia}

       notificacionFinal={true}



       // Setting Function
       functAEjecutar={functAEjecutar}
       eventFunction={eventFunction}
       function2={eliminarComent}
   />
   </>
  )
}

const TarjetaDoc=styled.div`
  border: 1px solid black;
  width: 85%;
  margin: auto;
  border-radius: 10px;
  margin-bottom: 35px;
  background-color: ${theme.azulOscuro1Sbetav};
  padding: 20px;

  *, *:before, *:after {
      box-sizing: border-box;
      }
      &::-webkit-scrollbar{
        width: 5px;
        }
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
    
        &::-webkit-scrollbar-thumb{
        background-color: #19b4ef;
        border-radius: 7px;
        } 
  h4{
    color: white;
    text-align: end;
    font-weight: lighter;
    font-size:1.2rem;
}
  &.home{
    height: 500px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  
  @media screen and (max-width:620px) {
    width: 100%;
    
  }
`

const CajaVideo=styled.div`
  margin-bottom: 65px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  background-color: ${theme.azul5Osc};
`
const Titulos=styled.h3`
  font-size: 1.5rem;
  color: ${theme.azul1};
  border-bottom: 1px solid;
  margin-bottom: 10px;
`

const CajaManoArriba = styled.div`
position: relative;
width: 40px;
margin-bottom: 15px;
text-align: center;
    border-radius: 5px;
    display: inline-block;
    margin-top: 15px;
    border: 1px solid transparent;
    &:hover{
    border: 1px solid ${theme.azul2};

  }
`

const Icono = styled(FontAwesomeIcon)`
    font-size: 2rem;
    color: white;
    cursor: pointer;
    &.liked{
        color: ${theme.azul2};
    }
    
`

const ContadorLike =styled.div`
position: relative;
    font-size: 0.7rem;
    width: 100%;
    text-align: center;
    color: white;
    &:hover{
        cursor: pointer;
        text-decoration: underline;
        &.sobre{

        }
    }
`
const CajaHoverLike=styled.div`
display: block;
position: absolute;
left: 20px;
  border: 1px solid red;
  /* width: 100px; */
  /* height: 100px; */
  /* margin-left: 200px; */

background-color: ${theme.azul5Osc};
color: ${theme.azul2};
padding: 10px;
`
const CajaComentarios=styled.div`
  /* border: 1px solid red; */
  width: 100%;
`

const CajaInputComentario = styled.div`
    width: 100%;
    background-color: ${theme.fondo};
    border-radius: 5px;
    /* min-height: 55px; */
`
const CajaInternaComentario = styled.div`
    position: relative;
    width: 100%;
`


const InputSencillo = styled.textarea`
  background-color: transparent;
  color: white;
  padding: 5px;
  resize: none;

  width: 100%;
  height: 30px;
  font-size: 0.9rem;
  
  text-align: start;
  align-items:center;
  outline: none;
  border: none;
  &.editando{
    border: 1px solid ${theme.azul1};
    background-color: ${theme.azulOscuro1Sbetav3};
    border-radius: 5px;
    color: ${theme.azul2};
    &:focus{
    border: 1px solid ${theme.azul2};

  }
  }
`

const CajaAddFrase = styled.div`
    width: 97%;
    display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 20px;
    /* background-color: ${theme.gris2}; */
    border-radius: 5px;
`
const MasFraseBtn = styled( BtnGeneralButton)`
    font-size: 1rem;
    width: auto;
    height: 35px;
    text-align: center;
`

const CajitaVideo=styled.div`
  display: flex;
  /* justify-content: center; */
`


const CajaResena = styled.div`
  /* padding: 10px; */
  display: flex;
  border-radius: 10px 0 10px 0;
  border: 1px solid transparent;
  transition: all ease 0.2s;
  /* border: 1px solid red;s */
  &:hover{
    box-shadow: 2px 2px 8px 0px rgba(255, 184, 5, 0.75);
    -webkit-box-shadow: 2px 2px 8px 0px rgba(255, 184, 5, 0.75);
    -moz-box-shadow: 2px 2px 8px 0px rgba(255, 184, 5, 0.75);
  }

  @media screen and (max-width:780px){
    flex-direction: column;
    align-items: center;
    border: 1px solid ${theme.azul1};
  }

`
const Avatar=styled.img`
  width: 50px;
  height: 50px;
  border: 1px solid ${theme.azulClaro1Svetav};
  border-radius: 50%;
  object-fit: contain;
  &.sinFoto{
    filter: grayscale(100%);
  }
  &:hover{
    cursor: pointer;
  }
  
`

const CajaTextoResena= styled.div`
  display:flex;
  width: 100%;
  padding-left: 10px;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width:780px) {
    padding-left: 0;

    
  }

`


const NombreResena=styled.h2`
  color: #fff;
  color: ${theme.azul2};
  font-size: 1rem;
  margin-bottom: 5px;
  &:hover{
    text-decoration: underline;
    cursor: pointer;

  }
  @media screen and (max-width:780px){
    text-align: center;
    
  }
  
`
const CajaAvatar=styled.div`
  height: 80px;
`

const Enlaces=styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover{
    text-decoration: underline;
  }

`
const TextoResena=styled.p`
  color: #fff;
  color: ${theme.azul1};
  margin-bottom: 8px;
  padding-left: 5px;
`
const FechaResennias=styled.p`
  color:${theme.fondo};
  font-size: 13px;
  padding-left: 5px;
  margin-bottom: 10px;
`
const CajaBtn=styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width:780px){
    flex-direction: row;
    
  }
  @media screen and (max-width:350px){
    flex-direction: column;
    
  }
`