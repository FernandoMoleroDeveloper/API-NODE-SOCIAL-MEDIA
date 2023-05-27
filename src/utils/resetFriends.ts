import { Friend } from "../models/Friend";
import { generateRandom } from "../utils/generateRandom";
import { User } from "../models/User";

const friendList = [{ date: Date.now }];

//  Función de reseteo de documentos de la colección.
export const resetFriends = async (): Promise<void> => {
  try {
    await Friend.collection.drop(); //  Esperamos a que borre los documentos de la colección friend de la BBDD.
    console.log("Borrados friends");

    const users = await User.find();
    if (users.length === 0) {
      console.error("No hay usuarios en la BBDD.");
      return;
    }

    const documents = friendList.map((friend) => new Friend(friend));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      const randomSender = users[generateRandom(0, users.length)];
      const randomReceiver = users[generateRandom(0, users.length)];

      document.sender = randomSender as unknown as any;
      document.receiver = randomReceiver as unknown as any;
      const friend = document;
      await friend.save();
    }
    console.log("Creados friends correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
