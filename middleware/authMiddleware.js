import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const protectionMiddleware = async (req, res, next) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(ipAddress);

  let token;

  if (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      req.user = user;

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
