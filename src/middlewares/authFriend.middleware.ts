import { Friend } from "../models/Friend";
import { verifyToken } from "../utils/token";

import { type Response, type NextFunction } from "express";

export const isAuthForFriends = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    const decodedInfo = verifyToken(token);
    const idFriend = req.params.id;

    const friend = await Friend.findById(idFriend).populate("sender");
    if (!friend) {
      throw new Error("No se ha encontrado el grupo");
    }

    if (decodedInfo?.id !== friend?.sender || req.user.email !== "admin@gmail.com") {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    if (decodedInfo?.id !== friend?.receiver || req.user.email !== "admin@gmail.com") {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.friend = friend;
    next();
  } catch (error) {
    res.status(401).json("No tienes autorización para realizar esta operación");
  }
};
