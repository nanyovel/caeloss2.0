import { styled } from "styled-components";
import theme from "../../config/theme.jsx";
import imgAbinader from "../../../public/img/abinader.jpg";
import { useEffect } from "react";

export const DocumentacionParcial = ({ completa }) => {
  useEffect(() => {
    document.title = "Caeloss - Doc";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  return (
    <>
      <CajaDocumentacion>
        {completa && (
          <TarjetaDoc>
            <CajaAbinader>
              <Titulos>Luis Abinader | Sobre transformacion digital</Titulos>

              <CajaTextoAbinader>
                <Img src={imgAbinader} />
                <Textos>
                  En República Dominicana, reconocemos la importancia de la
                  transformación digital para impulsar nuestro desarrollo social
                  y económico. Nos encontramos inmersos en una carrera acelerada
                  hacia lo digital, tanto para aumentar nuestra competitividad
                  en un mercado globalizado como para enfrentar los desafíos
                  económicos derivados de la pandemia del COVID-19.
                  <br />
                  <br />
                  Por eso, hemos establecido el Gabinete de Transformación
                  Digital para trabajar en conjunto con la sociedad civil, el
                  sector privado y la academia en una estrategia nacional a
                  largo plazo. Esta agenda tiene como objetivo mejorar nuestra
                  calidad de vida, acelerar la reactivación económica y elevar
                  nuestra productividad y competitividad mediante el uso de
                  tecnologías digitales.
                  <br />
                  <br />
                  Reconocemos que esta transformación digital requiere la
                  colaboración de todos los sectores y estamos comprometidos a
                  garantizar el acceso a la conectividad como un nuevo derecho
                  fundamental. En resumen, nuestra meta es transformar
                  digitalmente República Dominicana para mejorar la calidad de
                  vida de todos los ciudadanos, impulsar la reactivación
                  económica y lograr un desarrollo sostenible, contando con la
                  participación activa de todos los sectores de la sociedad.
                </Textos>
              </CajaTextoAbinader>
            </CajaAbinader>
          </TarjetaDoc>
        )}

        <TarjetaDoc>
          <Titulos>¿Que es Caeloss?</Titulos>
          <Textos>
            Caeloss es una plataforma moderna y escalable de automatización de
            procesos empresariales basada en apps y sistemas de gestión,
            diseñada para aumentar la productividad de los procesos internos de
            Cielos Acústicos y accelerar su transformacion digital.
            <br />
            <br />
            La versión 1.0 fue publicada en julio 2021 y la versión actual en
            marzo 2024, la cual cuenta con nuevas e innovadoras funcionalidades.
          </Textos>

          <Titulos>Terminología</Titulos>
          <Textos>
            Caeloss proviene del idioma latín `&quot;`cælus`&quot;` que
            significa cielo, los cielos o celestial, en términos simples es el
            equivalente a decir Cielos pero en el idioma latín, Cielos tomando
            como referencia Cielos Acústicos. Aunque la terminología es parecida
            a Caelus o Caelum que para los romanos fue un Dios del cielo,
            Caeloss no guarda ninguna referencia hacia dioses, deidades o
            mitologías.
          </Textos>

          {completa && (
            <>
              <Titulos>¿Cuál es su propósito?</Titulos>
              <Textos>
                Caeloss busca ser un referente de{" "}
                <a
                  href="https://es.wikipedia.org/wiki/Cuarta_Revoluci%C3%B3n_Industrial"
                  target="_blank"
                  rel="noreferrer"
                >
                  la industria 4.0 (cuarta revolución industrial)
                </a>{" "}
                tratando de automatizar todos los procesos internos
                automatizables de Cielos Acústicos, compilando en un solo lugar
                diferentes tareas y operaciones, aumentando la productividad de
                los departamentos y por consiguientes de la empresa. Caeloss
                planea convertirse en el eje central de la transformación
                digital de los procesos internos de Cielos Acústicos.
              </Textos>

              <Titulos>¿Que lo hace especial?</Titulos>
              <Textos>
                A diferencia otros ERP, Caeloss es diseñado a la medida exacta
                del proceso a automatizar, además dado que es receptivo a
                feedback de sus usuarios se mantiene en constante actualización,
                otras de sus ventajas es que Caeloss es la única herramienta
                tecnológica que permite a cualquier usuario que trabaje en la
                empresa registrarse a su voluntad sin la necesidad de intervenir
                el equipo de IT, dado a que el usuario puede acceder desde
                cualquier dispositivo la convierte en la herramienta con mejor
                accesibilidad y mayor alcance de la empresa. Aunque la versión
                2.0 cuenta con 3 sistemas de gestión y 2 apps, existe una
                importante lista de procesos a automatizar, los cuales se irán
                consolidando en Caeloss a través del tiempo.
              </Textos>

              <Tabla>
                <thead>
                  <Filas className="cabeza">
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Caeloss</CeldaHead>
                    <CeldaHead className="ultima">
                      Otros ERP de Cielos
                    </CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  <Filas className="body">
                    <CeldasBody>Accesibilidad moderna</CeldasBody>
                    <CeldasBody>Accede desde cualquier dispositivo</CeldasBody>
                    <CeldasBody>No</CeldasBody>
                  </Filas>
                  <Filas className="body">
                    <CeldasBody>Sin limites de usuarios</CeldasBody>
                    <CeldasBody>
                      Caeloss tiene mas de 100 usuarios al mes y las funciones
                      abiertas al publico la utilizan nuestros clientes.
                    </CeldasBody>
                    <CeldasBody>No</CeldasBody>
                  </Filas>
                  <Filas className="body">
                    <CeldasBody>Velocidad</CeldasBody>
                    <CeldasBody>
                      Se ha demostrado que Caeloss es la herramienta tecnológica
                      de este tipo, más veloz de Cielos Acústicos, pues sus
                      funciones son instantánea.
                    </CeldasBody>
                    <CeldasBody>
                      Funciones no instantaneas, especialmente en las sucursales
                      por su acceso remoto.
                    </CeldasBody>
                  </Filas>
                  <Filas className="body">
                    <CeldasBody>Amigable y moderna</CeldasBody>
                    <CeldasBody>
                      Caeloss cuenta con una interfaz fácil de usar e intuitiva
                      por lo cual se considera una app friendly.
                    </CeldasBody>
                    <CeldasBody>
                      Interfaz con curva de aprendizaje con mayor dificultad.
                    </CeldasBody>
                  </Filas>
                  <Filas className="body">
                    <CeldasBody>Adaptabilidad al proceso</CeldasBody>
                    <CeldasBody>
                      En lugar de adaptar el proceso a Caeloss, Caeloss se
                      adapta y optimiza el proceso.
                    </CeldasBody>
                    <CeldasBody>No</CeldasBody>
                  </Filas>
                  <Filas className="body">
                    <CeldasBody>Receptivo a feedback</CeldasBody>
                    <CeldasBody>
                      Caeloss está abierto a recibir feedback de cualquier
                      usuario, esto resulta una gran de ventaja competitiva.
                    </CeldasBody>
                    <CeldasBody>No</CeldasBody>
                  </Filas>
                </tbody>
              </Tabla>
            </>
          )}
        </TarjetaDoc>
        {completa && (
          <>
            <TarjetaDoc>
              <Titulos>Próximas versiones</Titulos>
              <Textos>
                Existe una interesante lista de apps y sistemas de gestión que
                se estarán creando en Caeloss, así como también se crearán
                versiones cada vez mejor optimizada de la plataforma.
              </Textos>
            </TarjetaDoc>
            <TarjetaDoc>
              <Titulos>Transformacion digital</Titulos>
              <Textos>
                La transformación digital con la llamada{" "}
                <span>Cuarta Revolución Industrial</span>, hace que las
                instituciones se modernicen o queden obsoletas, nuestro país
                tiene diferentes proyectos para modernizar el estado, por
                decreto estamos en proceso de transformarnos digitalmente, esto
                incluye tanto instituciones gubernamentales como empresas
                privadas, por lo cual Cielos Acústicos no será la excepción.
              </Textos>
            </TarjetaDoc>

            <TarjetaDoc></TarjetaDoc>
          </>
        )}
      </CajaDocumentacion>
    </>
  );
};

const CajaDocumentacion = styled.div`
  width: 100%;
  height: auto;
  /* margin: auto; */
  min-height: 200px;
  /* padding-left: 25px; */
  /* border: 1px solid red; */
  margin-bottom: 80px;
`;

const TarjetaDoc = styled.div`
  border: 1px solid black;
  /* height: 600px; */
  width: 85%;
  margin: auto;
  /* margin-left: 15px; */
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: ${theme.azulOscuro1Sbetav};
  /* background-image: radial-gradient(at 0% 0%,hsla(222,100%,11%,1) 0px,transparent 50%),radial-gradient(at 100% 100%,hsla(222,100%,11%,1) 0px,transparent 50%); */
  padding: 20px;

  h4 {
    color: white;
    /* border: 1px solid black; */
    text-align: end;
    font-weight: lighter;
    font-size: 1.2rem;
  }
  @media screen and (max-width: 750px) {
    flex-direction: column;
    width: 100%;
    margin: 0;
    padding: 10px;
  }
`;

const Titulos = styled.h3`
  font-size: 1.4rem;
  color: ${theme.azulClaro1Svetav};
  border-bottom: 1px solid;
  margin-bottom: 10px;
`;

const Textos = styled.p`
  color: #fff;
  color: ${theme.azul1};
  padding-left: 15px;
  margin-bottom: 20px;
  span {
    font-style: italic;
    text-decoration: underline;
  }
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const Filas = styled.tr`
  &.body {
    font-weight: lighter;
    border-bottom: 1px solid #49444457;
    background-color: ${theme.azul5Osc};
  }
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${theme.azulOscuro1Sbetav};
    border: 1px solid red;
  }
  &.cabeza {
    background-color: ${theme.azulOscuro1Sbetav};
  }
  color: ${theme.azul1};
  &:hover {
    background-color: ${theme.azulOscuro1Sbetav};
  }

  &.negativo {
    color: ${theme.danger};
  }
`;

const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;

  font-size: 0.9rem;
  &.qty {
    width: 300px;
  }
  &.descripcion {
    max-width: 30px;
  }
  &.comentarios {
    max-width: 200px;
  }
  .ultima {
    max-width: 10px;
    background-color: red;
  }
`;
const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;

  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;

  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  &.proveedor {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }

  &.status {
    white-space: nowrap;
  }
  &.puerto {
    max-width: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &.naviera {
    max-width: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &.comentarios {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CajaAbinader = styled.div``;

const CajaTextoAbinader = styled.div`
  display: flex;
  position: relative;
  /* height: 200px; */
  @media screen and (max-width: 550px) {
    flex-direction: column;
  }
`;

const Img = styled.img`
  max-width: 200px;
  /* object-fit: ; */
  height: 200px;
  float: none;
  margin: 10px;
  shape-outside: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  margin-right: 10px;
  @media screen and (max-width: 550px) {
    width: 90%;
    height: auto;
    margin: auto;
    margin-bottom: 10px;
    max-width: 550px;
  }
`;
