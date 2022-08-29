import { Request, Response, NextFunction } from "express";
import { getRequestUser } from "./authMiddleware";

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = getRequestUser(req);

  if (currentUser.username !== "admin") {
    res.json("Error: Not the admin");
  } else {
    next();
  }
};
