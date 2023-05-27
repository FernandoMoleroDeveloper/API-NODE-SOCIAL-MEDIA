import { Friend } from "../models/Friend";
import { generateRandom } from "../utils/generateRandom";

const friendList = [{ date: Date.now }];

//  Función de reseteo de documentos de la colección.
export const resetFriends = async (): Promise<void> => {
  try {
    await Friend.collection.drop(); //  Esperamos a que borre los documentos de la colección friend de la BBDD.
    console.log("Borrados friends");

    const friends = await Friend.find();
    if (friends.length === 0) {
      console.error("No hay friends en la BBDD.");
      return;
    }
    const documents = friendList.map((friend) => new Friend(friend));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      const randomSender = sender[generateRandom(0, sender.length)];
      const randomReceiver = receiver[generateRandom(0, receiver.length)];

      friends.sender = randomSender as unknown as any;
      friends.receiver = randomReceiver as unknown as any;
      const friend = document;
      await document.save();
    }
    console.log("Creados friends correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
