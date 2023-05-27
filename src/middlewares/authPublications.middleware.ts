import { Publication } from "../models/Publication";
import { verifyToken } from "../utils/token";

import {
  type Response,
  type NextFunction,
} from "express";

export const isAuthForPublications = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    const decodedInfo = verifyToken(token);
    const idPublication = req.params.id;

    const publication = await Publication.findById(idPublication).populate("owner");
    if (!publication) {
      throw new Error("Publicationo no encontrado");
    }

    if (decodedInfo?.id !== publication?.owner && req.user.email !== "admin@gmail.com") {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.publication = publication;
    next();
  } catch (error) {
    res.status(401).json("No tienes autorización para realizar esta operación");
  }
};
