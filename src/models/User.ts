//  Importamos Mongoose
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { type IPublication } from "./Publication";
import { type IFriend } from "./Friend";

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Enum de países permitidos
enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

// Interface de Autor
interface IUser {
  firstName: string;
  lastName: string;
  birthdate: Date;
  gender: Gender;
  email: string;
  password: string;
  profileImage: string;
  publications?: IPublication[];
  friends?: IFriend[];
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      unique: true, // indica que no puede haber otra entidad con esta propiedad que tenga el mismo valor.
      validate: {
        validator: (text: string) => validator.isEmail, // Validamos haciendo uso de la librería validator y la función isEmail que incorpora.
        message: "Email incorrecto",
      },
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validator.isStrongPassword(value, { minSymbols: 0 }),
        message: "La contraseña debe tener como mínimo 8 caractéres, una mayúscula, una minúscula y un número",
      },
    },
    birthdate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: Gender,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "El nombre debe tener al menos 3 caractéres y máximo 100 caracteres"],
      maxLength: [100, "El nombre debe tener al menos 3 caractéres y máximo 100 caracteres"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "El apellido debe tener al menos 3 caractéres y máximo 100 caracteres"],
      maxLength: [100, "El apellido debe tener al menos 3 caractéres y máximo 100 caracteres"],
    },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Cada vez que se guarde un usuario encriptamos la contraseña
userSchema.pre("save", async function (next) {
  try {
    // Si la password estaba encriptada, no la encriptaremos de nuevo.
    if (this.isModified("password")) {
      // Si el campo password se ha modificado
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds); // Encriptamos la contraseña
      this.password = passwordEncrypted; // guardamos la password en la entidad User
      next();
    }
  } catch (error) {
    next();
  }
});

// Creamos un modelo para que siempre que creamos un user valide contra el Schema que hemos creado para ver si es valido.
export const User = mongoose.model<IUser>("User", userSchema);
