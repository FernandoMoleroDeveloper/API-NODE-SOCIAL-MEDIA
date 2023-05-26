import { Friend } from "../models/Friend";

const friendList = [{ title: "To Kill a Mockingbird", pages: 281 }];

//  Función de reseteo de documentos de la colección.
export const resetFriends = async (): Promise<void> => {
  try {
    await Friend.collection.drop(); //  Esperamos a que borre los documentos de la colección friend de la BBDD.
    console.log("Borrados friends");
    const documents = friendList.map((friend) => new Friend(friend));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }
    console.log("Creados friends correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
