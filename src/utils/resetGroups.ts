import { Group } from "../models/Group";
import { Publication } from "../models/Publication";
import { User } from "../models/User";
import { generateRandom } from "./generateRandom";

const groupList = [
  { name: "Grupo de Fotografía Urbana", createDate: new Date("2023-04-12T09:30:00") },
  { name: "Grupo de Música Pop", createDate: new Date("2023-02-11T09:30:00") }
];
//  Función de reseteo de documentos de la colección.
export const resetGroups = async (): Promise<void> => {
  try {
    const members = []
    const publication = []
    await Group.collection.drop(); //  Esperamos a que borre los documentos de la colección group de la BBDD.
    console.log("Borrados grupos");

    const users = await User.find();
    if (users.length === 0) {
      console.error("No hay usuarios en la BBDD.");
      return;
    }
    const publications = await Publication.find();
    if (publications.length === 0) {
      console.error("No hay publicaciones en la BBDD.");
      return;
    }

    const documents = groupList.map((group) => new Group(group));
    // Para cada libro recogido elegimos un autor y una editorial al azar entre los existentes y se lo asignamos como una propiedad a cada libro.
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      const randomUser = users[generateRandom(0, users.length)];

      members.push(
        users[generateRandom(0, users.length)],
        users[generateRandom(0, users.length)],
        users[generateRandom(0, users.length)])

      publication.push(
        publications[generateRandom(0, publications.length)],
        publications[generateRandom(0, publications.length)],
        publications[generateRandom(0, publications.length)])

      document.admin = randomUser as unknown as any;
      document.members = members as unknown as any
      document.publication = publication as unknown as any;
      const group = document;
      await group.save();
    }
    console.log("Creados gropus correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
