// Importamos el modelo
import { User } from "../models/User";

// Creamos 50 autores aleatoriamente y los vamos añadiendo al array de autores:
const userList = [
  { firstName: "Gabriel", lastName: "Garcia", gender: "male", email: "gabi@gmail.com", password: "A123a123", birthdate: new Date("1900-07-05") },
  { firstName: "Jane", lastName: "Austen", gender: "female", email: "jane@gmail.com", password: "B876b876", birthdate: new Date("1923-05-03") },
  { firstName: "Leo", lastName: "Tolstoy", gender: "other", email: "leot@gmail.com", password: "C111c111", birthdate: new Date("1950-06-23") },
  { firstName: "Virginia", lastName: "Woolf", gender: "female", email: "virg@gmail.com", password: "D222d222", birthdate: new Date("1870-06-13") },
  { firstName: "Ernest", lastName: "Hemingway", gender: "male", email: "ernest@gmail.com", password: "E333e333", birthdate: new Date("1820-04-12") },
  { firstName: "Jorge Luis", lastName: "Borges", gender: "male", email: "jorge@gmail.com", password: "F444f444", birthdate: new Date("1958-02-11") },
  { firstName: "Franz", lastName: "Kafka", gender: "male", email: "frank@gmail.com", password: "G555g555", birthdate: new Date("1712-08-24") },
  { firstName: "Toni", lastName: "Morrison", gender: "male", email: "tonih@gmail.com", password: "H666h666", birthdate: new Date("1930-07-29") },
  { firstName: "Haruki", lastName: "Murakami", gender: "other", email: "haruki@gmail.com", password: "I777i777", birthdate: new Date("1890-01-07") },
  { firstName: "Chinua", lastName: "Achebe", gender: "female", email: "chinua@gmail.com", password: "J888j888", birthdate: new Date("1910-03-18") },
];

//  Función de reseteo de documentos de la colección.
export const resetUsers = async (): Promise<void> => {
  try {
    await User.collection.drop(); //  Esperamos a que borre los documentos de la colección user de la BBDD.
    console.log("Borrados users");
    const documents = userList.map((user) => new User(user));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }
    console.log("Creados users correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
