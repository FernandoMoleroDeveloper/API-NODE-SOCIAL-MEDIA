//  Importamos Mongoose
import mongoose, { type ObjectId } from "mongoose";

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Interface de Book
export interface IGroup {
    admin : ObjectId,
    members: Array<ObjectId>,
    name: string,
    createDate: Date,
    publication: Array<ObjectId>,
    modificationDate: Date
}

// Creamos esquema del book:
const bookSchema = new Schema<IGroup>(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    members: { type: [mongoose.Schema.Types.ObjectId], ref: "User", required: false },
    name: {type: String, trim: true, minLength: [3, " Al menos tres letras para el título"], maxLength: [40, "Título demasiado largo, máximo de 20 caracteres"], required: true },
    createDate: { type: Date, required: true },
    publication: { type: [mongoose.Schema.Types.ObjectId], ref: "User", required: false },
    modificationDate: { type: Date, required: false }
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un book valide contra el Schema que hemos creado para ver si es valido.
export const Group = mongoose.model<IGroup>("Group", bookSchema, "groups");
