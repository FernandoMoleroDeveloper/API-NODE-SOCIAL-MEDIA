// Importamos el modelo
import { Publication } from "../models/Publication";

// Creamos 50 editorial aleatoriamente y los vamos añadiendo al array de editoriales:
const publicationList = [
  {
    creationDate: new Date("2023-05-20T09:30:00"),
    message: "¡Feliz viernes a todos! Espero que tengan un fin de semana increíble. 🎉😊"
  },
  {
    creationDate: new Date("2023-05-22T15:45:00"),
    message: "¡Gran noticia! Nuestro nuevo producto ya está disponible en tiendas. ¡Ven y descubre lo que tenemos para ti! 💥🛍️"
  },
  {
    creationDate: new Date("2023-05-24T12:00:00"),
    message: "¡Felicidades a nuestro equipo por alcanzar un hito importante! Su arduo trabajo y dedicación lo hicieron posible. 👏🥳"
  },
  {
    creationDate: new Date("2023-05-26T10:15:00"),
    message: "¿Estás listo para una aventura emocionante? ¡Únete a nosotros en nuestro próximo evento y descubre nuevas experiencias! 🌟🎉"
  },
  {
    creationDate: new Date("2023-05-28T14:30:00"),
    message: "¡Nuestra promoción especial está en marcha! No te pierdas la oportunidad de obtener grandes descuentos en nuestros productos. ¡Ven y aprovecha esta oferta limitada! 💰✨"
  }
];

//  Función de reseteo de documentos de la colección.
export const resetPublications = async (): Promise<void> => {
  try {
    await Publication.collection.drop(); //  Esperamos a que borre los documentos de la colección publication de la BBDD.
    console.log("Borrados publications");
    const documents = publicationList.map((publication) => new Publication(publication));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }
    console.log("Creados publications correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
