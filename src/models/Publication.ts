//  Importamos Mongoose
import mongoose, { type ObjectId } from "mongoose";

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

const rightNow = new Date();

// Interface de Publication
export interface IPublication {
  owner: ObjectId;
  creationDate: Date;
  message: string;
}

// Esquema de Publication
const PublicationSchema = new Schema<IPublication>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    creationDate: {
      type: Date,
      max: [rightNow, "It cannot be later than the current moment"],
      default: rightNow,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      minLength: [3, "At least three characters for the message"],
      maxLength: [100, "Message too long, maximum 100 characters"],
      required: true,
    },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un Publication valide contra el Schema que hemos creado para ver si es valido.
export const Publication = mongoose.model<IPublication>("Publication", PublicationSchema);
