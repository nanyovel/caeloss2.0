import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import funcionConsumible from '../../consumible';
import theme from '../../theme';
import ImgCerrado from '../../public/img/candadoCerrado.png';

export const CardHome = ({
  ImagenCard,
  titulo,
  ruta,
  nuevo,
  title,
  incompleto,
  tipo,
  bloqueado
}) => {

  return (
    <>
      {
        !bloqueado?
          <Card
            title={title}
            className={`${incompleto?'incompleto':''}`}

          >
            <EnlacePrincipal to={`${ruta}`}>
              <CajaImagen className={incompleto?'incompleto':''}>
                <Imagen src={ImagenCard}/>
                <CajaPorcentaje
                  className={`
                                ${incompleto?'incompleto':''}
                                ${tipo}
                                `}>
                </CajaPorcentaje>
                <NumberPor className={incompleto?'incompleto':''}>
                  {100-funcionConsumible(tipo).valorNumber+'%'}
                </NumberPor>
                {
                  nuevo?
                    <CajaNuevo
                      className={nuevo?'nuevo':''}>
                      <NuevoTexto>Nuevo</NuevoTexto>

                    </CajaNuevo>
                    :
                    null
                }
              </CajaImagen>

              <div>
                <TextoCard>{titulo}</TextoCard>
              </div>

            </EnlacePrincipal>
          </Card>
          :
          <Card
            // title={title}
            className={`${incompleto?'incompleto':''}`}

          >
            <EnlacePrincipal to={`${ruta}`}>
              <CajaImagen className={incompleto?'incompleto':''}>
                {
                  bloqueado?
                    <Imagen className='bloqueado' src={ImgCerrado}/>
                    :
                    null
                }
              </CajaImagen>
            </EnlacePrincipal>
          </Card>
      }
    </>
  );
};

const Card = styled.div`
     width: 20%;
    height: 200px;
    border:5px solid  #535353;
    overflow: hidden;
    border-radius: 20px 0 20px 0;
    /* z-index: 100; */
    position: relative;

    box-shadow: 3px 3px 3px -1px rgba(0,0,0,0.43);

    margin: 0 5px;
    /* transition: border 0.4s ease; */
    transition: width ease 0.5s ;
    &:hover{
        border:5px solid  #fff;
        width: 50%;
    }
    &.incompleto{
        /* filter: grayscale(100%); */
        /* background: url('tu-imagen.jpg') center/cover;  */
        /* -webkit-mask-image: linear-gradient(to bottom, transparent 80%, black 80%, black 100%); */
        
    }

    @media screen and (max-width: 750px) {
    width: 100%;
        }
   

`;
const EnlacePrincipal = styled(Link)`
    text-decoration: none;
    /* opacity: 0.5; */
    position: relative;

    &:hover{
        opacity: 1;
    animation: arroz 1s;
    animation-direction: normal;}


    @keyframes arroz{
    0%{
        opacity: 0.6;
    }
    100%{
        opacity: 1;
    }
}
`;

const CajaImagen = styled.div`
    display: block;
    overflow: hidden;
    /* border-bottom: 1px solid black; */
    width: 100%;
    height: 80%;
    background-size: contain;
    background-repeat: no-repeat;
    object-fit: cover;
    background-position: center;
    /* opacity: 0.5; */
    /* margin-bottom: 10px; */

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

   
`;

const TextoCard = styled.h2`
    color:  white;
    text-decoration: none;
    font-size: 1.9rem;
    font-weight: 200;
    text-align: center;
    /* margin: 0px; */
    /* border: 1px solid blue; */
    @media screen and (max-width: 750px) {
    flex-direction: column;
    font-size: 1.9rem;
}
    
    
`;

const Imagen = styled.img`
    width: 100%;
    height: 80%;
    object-fit: contain;
    position: absolute;
    z-index:1;
  
`;
const CajaNuevo=styled.div`
    &.nuevo{
    background-color: #ada5a550;
    width: 100%;
    z-index: 100;
    height: 30px;
    position: relative;
    top: 50%;

    }
`;
const NuevoTexto=styled.h2`
    background-color: red;
    width: 100%;
    text-align: center;
    color: white;

`;

const CajaPorcentaje=styled.div`
    &.incompleto{
        position: absolute;
        width: 100%;
        background-color: #ada5a550;
        top: 0;
        backdrop-filter: blur(10px);
    }
    &.transporte{
        height: ${funcionConsumible('transporte').valorPorcentaja};
        border-radius:15px 0 0 0;
    }
    &.mantenimiento{
        border-radius:15px 0 15px 0;
        height: ${funcionConsumible('mantenimiento').valorPorcentaja};
    }
    z-index:5;
`;

const NumberPor=styled.h2`
    display: none;
    &.incompleto{
        display: block;
        position: absolute;
        color:${theme.azul4Osc};
        color: white;
        background-color: ${theme.azul1};
        width: 100%;
        text-align: center;

        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%); 
        font-size: 2rem;
        z-index:10
    }
`;