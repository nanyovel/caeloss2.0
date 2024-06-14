import { Header } from '../components/Header';
import { TutorialesParcial } from './TutorialesParcial';

export const Tutoriales = ({
  setDBTutoriales,
  dbTutoriales,
  dbUsuario,
  userMaster,
}) => {
  return (
    <>
      <Header titulo='Tutoriales'/>
      <TutorialesParcial
        setDBTutoriales={setDBTutoriales}
        dbTutoriales={dbTutoriales}
        dbUsuario={dbUsuario}
        userMaster={userMaster}

      />
    </>
  );
};
