import { styled } from 'styled-components';
import theme from '../../config/theme.jsx';
import { v4 as uuidv4 } from 'uuid';

export const SalidaDatos = ({
  hab,
  datos,
  totalSumatoria,
  functPrincipal,
  hasDisableItem,
  parametroA,
  setAlertaFaltaPerimetro,
  casiCero,
}) => {
  let depositObjetoSumando={};

  return (
    <>
      <SeccionTabla>
        <TablaResultados>
          <tbody>
            <Fila className='caja-encabezado'>
              <ThNo scope="row" className="no" >
                        N°
              </ThNo>
              <Th key={uuidv4()}>
                    Descripcion
              </Th>
              <Th key={uuidv4()}>
                      Total
              </Th>
              {
                hab.map((habitacion, index)=>{
                  return(<Th key={uuidv4()}>{`D${index+1}`}</Th>);
                })
              }
            </Fila>

            {
              totalSumatoria?.map((item, indexMat)=>{
                if(item.material==true){
                  return(
                    <Fila key={uuidv4()}>
                      {/* Imprime el codigo del producto o un - */}
                      <Ths className={`${hasDisableItem(totalSumatoria[indexMat])} codigo`}>
                        {
                          totalSumatoria[indexMat]?.deshabilitado?
                            '-'
                            :
                            totalSumatoria[indexMat].codigo
                        }
                      </Ths>

                      {/* Imrpime la descripcion del producto o - */}
                      <Ths className={`${hasDisableItem(totalSumatoria[indexMat])} descripcionMaterial`}>
                        {
                          totalSumatoria[indexMat].nombre
                        }
                      </Ths>
                      {/* Imprime colunma total */}
                      {
                        <CeldaTotalA
                          className={`${hasDisableItem(totalSumatoria[indexMat])}`}
                          key={indexMat+'romo'}
                        >
                          {
                            totalSumatoria[indexMat].deshabilitado==true?
                              '-'
                              :
                              totalSumatoria[indexMat].total(datos)==casiCero?0:totalSumatoria[indexMat].total(datos)
                          }

                        </CeldaTotalA>
                      }

                      {
                        datos.map((objet, indexHab)=>{

                          if(item.diferido==true){
                            if(objet.madera==''){

                              return(
                                <Celda
                                  key={indexHab+'roco'}
                                  className={hasDisableItem(totalSumatoria[indexMat])}
                                >
                                  <TextoCelda >{''}</TextoCelda>
                                </Celda>
                              );
                            }
                            else{

                              return(
                                <Celda
                                  key={indexHab+'roco'}
                                  className={hasDisableItem(totalSumatoria[indexMat])}
                                >
                                  <TextoCelda >{0}</TextoCelda>
                                </Celda>
                              );
                            }
                          }

                          depositObjetoSumando=functPrincipal(datos[indexHab]); //----->Objeto calculo completo todos materiales
                          // console.log(depositObjetoSumando)
                          let resultado=(depositObjetoSumando[Object.keys(datos[indexHab])[indexMat]]); //------->cantidad o resultado a imprimir en cada cerlda

                          if(resultado===0){
                            resultado='';
                          }
                          if(resultado==casiCero){
                            resultado=0;
                          }

                          if(totalSumatoria[indexMat].deshabilitado){
                            resultado='-';
                          }
                          return(
                            <Celda
                              key={indexHab+'roco'}
                              className={hasDisableItem(totalSumatoria[indexMat])}
                            >
                              <TextoCelda >{resultado}</TextoCelda>
                            </Celda>
                          );
                        })

                      }

                      {
                        hab.map((objeto)=>{
                          if(setAlertaFaltaPerimetro){

                            if(parametroA==2||parametroA==3){
                              if(objeto.area>0&&objeto.perimetro==''){
                                setAlertaFaltaPerimetro(true);
                                setTimeout(() => {
                                  setAlertaFaltaPerimetro(false);
                                }, 3000);
                              }
                            }
                          }
                        })
                      }
                    </Fila>);
                }
              })
            }

          </tbody>
        </TablaResultados>
      </SeccionTabla>
    </>

  );
};

const TablaResultados=styled.table`
    border: 1px solid ${theme.azulTransparente};
    /* background-color: ${theme.danger}; */
    background-color: ${theme.azulOscuro1Sbetav};
    color: ${theme.azul2};
    border-radius: 10px;
    margin: auto;
    padding: 10px;
    border-collapse: collapse;
    /* background-color: red; */
    border-radius: 10px;
    
    `;
const Th=styled.th`
    width: auto;
    color: ${theme.azul1};
    padding: 5px;
    margin-right: 5px;
    background-color: ${theme.azulOscuro1Sbetav};
    &:nth-last-child(1){
    border-radius: 0 5px 0 0 ;
  }
    
    `;
const ThNo = styled(Th)`
  width: 60px;
  `;

const Fila=styled.tr`

  `;

const Ths = styled.td`
font-weight: 200;
  /* color: ${theme.azul2}; */
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &.desabilitado{
    background-color: ${theme.fondo};
    text-align: center;
  }
  
  &.descripcionMaterial{
    text-align: start;
  }
  &.codigo{
    text-align: center;
  }

`;

const CeldaTotalA=styled.th`
  border: 1px solid #163f50;
  color: ${theme.azul2};
    height: 25px;  
    &.desabilitado{
    background-color: ${theme.fondo};
  }

`;

const Celda=styled.th`
   border: 1px solid #163f50;
    height: 25px; 
    background: none; 
    outline: none;
    color: #000;
    font-size: 1rem;
    &.desabilitado{
    background-color: ${theme.fondo};
  }
`;
const TextoCelda = styled.p`
  color: #686868;
  font-weight: lighter;
 
`;

const SeccionTabla = styled.section`
margin-bottom: 25px;
overflow-x: scroll;
border-radius: 10px;
/* border: 1px solid red; */

&::-webkit-scrollbar{
  width: 3px;
  height: 3px;
}
&::-webkit-scrollbar-thumb{
  background-color: #19b4ef;
  border-radius: 7px;
}
`;