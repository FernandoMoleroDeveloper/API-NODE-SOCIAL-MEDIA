import { Group } from "../models/Group";
import { verifyToken } from "../utils/token";

import {
  type Response,
  type NextFunction,
} from "express";

export const isAuthForGroups = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    const decodedInfo = verifyToken(token);
    const idGroup = req.params.id;

    const group = await Group.findById(idGroup).populate("owner");
    if (!group) {
      throw new Error("No se ha encontrado el grupo");
    }

    if (decodedInfo?.id !== group?.admin || req.user.email !== "admin@gmail.com") {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.group = group;
    next();
  } catch (error) {
    res.status(401).json("No tienes autorización para realizar esta operación");
  }
};
