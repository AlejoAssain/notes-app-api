import bcrypt from "bcrypt";
import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getRequestUser } from "../middleware/authMiddleware";
import { User, IUser } from "../models/user.model";


dotenv.config();

interface FilteredUser {
  mail: string,
  username: string,
  name: string
};

interface FilteredUserToken extends FilteredUser {
  token: string
};

const filterUserData = (user : IUser) : FilteredUser => {
  const { mail: uMail, username:uUsername, name: uName } = user;
  return {
    mail: uMail,
    username: uUsername,
    name: uName
  };
};

const generateToken = (id: string) => {
  let sign : string;

  if (process.env.JWT_SECRET) {
    sign = jwt.sign(
      { id },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    )
  } else {
    throw new Error("Internal error");
  };

  return sign;
};

export const getIdByUsername = async (uName: string) => {
  const user = await User.findOne( { username: uName } );

  if (!user) throw new Error("User not found");

  return user.id;
};

export const getUsernameById = async (uId: string) => {
  const user = await User.findById(uId);

  if (!user) throw new Error("User not found");

  return user.username;
};

export const getMe = async (req: Request, res: Response) => {
  const currentUser = getRequestUser(req);

  const filteredUserData = filterUserData(currentUser);

  res.json(filteredUserData);
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    console.log(users);

    const filteredUsersData = users.map(user => filterUserData(user));

    res.json(filteredUsersData);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(500).json(errorMessage);
  };
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne( { username: req.params.username } );

    if (!user) throw new Error("User not found");

    console.log("Sending:\n", user);

    const filteredUserData = filterUserData(user);

    res.json(filteredUserData);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(500).json(errorMessage);
  };
};

export const registerUser = async (req: Request, res: Response) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(req.body.password, salt);

  const {
    mail: newUserMail,
    username: newUserUsername,
    name: newUserName
  } = req.body;

  const newUser = new User({
    mail: newUserMail,
    username: newUserUsername,
    password: hash,
    name: newUserName
  });

  try {
    newUser.save();

    const filteredUserData = filterUserData(newUser);

    (filteredUserData as FilteredUserToken).token = generateToken(newUser._id);

    res.json(filteredUserData);

    console.log("New user: " + filteredUserData.username);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(500).json(errorMessage);
  };
};

export const loginUser = async (req: Request, res: Response) => {
  const { username: uName, password: uPassword } = req.body;

  const errorStatusCode = 401;

  const user = await User.findOne( { username: uName } );

  if (user) {
    const hashedUserPassword = user.password;

    const compareResult = await bcrypt.compare(uPassword, hashedUserPassword);

    if (compareResult) {
      const filteredUserData = filterUserData(user);

      const token = generateToken(user._id);
      (filteredUserData as FilteredUserToken).token = token;

      res.json(filteredUserData);

      console.log("\nLogged as " + user.username)

    } else {
      res.status(errorStatusCode).json("Wrong password");
    };

  } else {
    res.status(errorStatusCode).json("Username doesn't exists");
    console.log("Wrong username");
  };
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const currentUser = getRequestUser(req);

    const user = await User.findById(currentUser._id);

    if (!user) throw new Error("User not found")

    Object.assign(user, req.body);

    user.save();

    const filteredUserData = filterUserData(user);

    res.json(filteredUserData);
    console.log("User updated");
  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const currentUser = getRequestUser(req);

    const user = await User.findByIdAndDelete(currentUser._id);

    if (!user) throw new Error("User not found");

    const filteredUserData = filterUserData(user);

    res.json({
      removed: filteredUserData
    });

    console.log("User removed");
  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};
