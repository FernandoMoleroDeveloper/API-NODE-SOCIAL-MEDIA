//  Importamos Mongoose
import mongoose, { type ObjectId } from "mongoose";

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Interface de Book
export interface IFriend {
  sender: ObjectId;
  receiver: ObjectId;
  date: Date;
}

// Creamos esquema del friend:
const friendSchema = new Schema<IFriend>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Identificará el id como una referencia de la entidad User relacionando las dos colecciones de la BBDD.
    date: { type: Date, required: true },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un friend valide contra el Schema que hemos creado para ver si es valido.
export const Friend = mongoose.model<IFriend>("Friend", friendSchema);
