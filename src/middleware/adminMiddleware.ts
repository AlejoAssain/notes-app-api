import { NextFunction, Response } from "express";
import { CustomRequest } from "./authMiddleware";

export const adminOnly = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user.username !== "admin") {
    res.json("Error: Not the admin");
  } else {
    next();
  }
}
