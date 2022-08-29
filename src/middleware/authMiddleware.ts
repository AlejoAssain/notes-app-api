import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";


dotenv.config();

export interface CustomRequest extends Request {
  user: IUser
};

export const getRequestUser = (req: Request) => {
  return (req as CustomRequest).user;
}

const getCurrentDateTime = () => new Date();

const jwtSecret : string = process.env.JWT_SECRET || "1234";

const showRequestData = (req : Request) => {
  const method = req.method;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const path = req.route.path;
  const origin = req.headers.origin;
  const from = req.headers.referer;
  const currentDateTime = getCurrentDateTime();

  console.log('\n\x1b[36m%s\x1b[0m', "    NEW REQUEST!", `
    Request from origin ${origin}
    Method: ${method}
    Ip: ${ipAddress}
    To path: ${path}
    From path: ${from}
    DateTime: ${currentDateTime}
    \n
  `);
};

export const protectionMiddleware = async (req : Request, res: Response, next: NextFunction) => {
  showRequestData(req);

  let token;

  if (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, jwtSecret);

      const user = await User.findById(decoded);

      if (!user) throw new Error("User auth failed");

      (req as CustomRequest).user = user;

      next();

    } catch (e) {
      const errorMessage = "Error: " + e;

      console.log(errorMessage);
      res.status(400).json(errorMessage);
    }
  } else {
    res.status(401).json("No token...");
  };
};
