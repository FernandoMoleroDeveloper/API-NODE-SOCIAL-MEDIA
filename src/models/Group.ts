//  Importamos Mongoose
import mongoose, { type ObjectId } from "mongoose";

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;
const rightNow = new Date()

// Interface de Book
export interface IGroup {
  admin: ObjectId;
  members: ObjectId[];
  name: string;
  createDate: Date;
  publication: ObjectId[];
  modificationDate: Date;
}

// Creamos esquema del book:
const groupSchema = new Schema<IGroup>(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    members: { type: [mongoose.Schema.Types.ObjectId], ref: "User", required: false },
    name: { type: String, trim: true, minLength: [3, " Al menos tres letras para el título"], maxLength: [40, "Título demasiado largo, máximo de 20 caracteres"], required: true },
    createDate: { type: Date, required: true, max: [rightNow, "It cannot be later than the current moment"], default: rightNow },
    publication: { type: [mongoose.Schema.Types.ObjectId], ref: "Publication", required: false },
    modificationDate: { type: Date, required: false },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un book valide contra el Schema que hemos creado para ver si es valido.
export const Group = mongoose.model<IGroup>("Group", groupSchema, "groups");
