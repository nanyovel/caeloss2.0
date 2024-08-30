import { getFirestore, writeBatch, collection, doc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";

// Cargar un array completo a una colecion de firebase, tomar en cuenta:
// ------1-Firebase no permite subir un array directamente, sino que tienes que subir documento por documento
// ------2-Firebase no permite subir mas de 500 documentos por lote, en el siguiente bloque se sube todo y funciona para un bloque menor de 500
const collectionRef = collection(db, "omarMiguel");
const cargarDatos = async () => {
  const batch = writeBatch(db);

  arrayDataBase.forEach((item, index) => {
    const docRef = doc(collectionRef);
    batch.set(docRef, item);
  });

  try {
    batch.commit().then(() => {
      console.log("lote subido correctamente!");
    });
  } catch (error) {
    console.log(error);
  }
};

// Actualizar un todos los documentos de una coleccion en el mismo lote
const actualizarDatos = async () => {
  const nuevoData = [...dbOmarMiguel];
  const batch = writeBatch(db);

  for (let i = 0; i < nuevoData.length; i++) {
    const itemId = nuevoData[i].id;
    const itemActualizar = doc(db, "omarMiguel", itemId);
    const fotos = [];
    batch.update(itemActualizar, {
      costo: "",
      precio: "",
      fotos: fotos,
    });
  }

  try {
    batch.commit().then(() => {
      console.log("lote actualizado correctamente!");
    });
  } catch (error) {
    console.log(error);
  }
};
