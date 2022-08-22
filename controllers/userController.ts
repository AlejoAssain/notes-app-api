import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../middleware/authMiddleware";
import { User, UserModel } from "../models/user.model";


interface FilteredUser {
  mail: string,
  username: string,
  name: string
};

interface FilteredUserToken extends FilteredUser {
  token: string
};

const filterUserData = (user : UserModel) : FilteredUser => {
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
  return user._id;
};

export const getUsernameById = async (uId: string) => {
  const user = await User.findById(uId);
  return user.username;
};

export const getMe = async (req: CustomRequest, res: Response) => {
  const filteredUserData = filterUserData(req.user);

  res.json(filteredUserData);
}

export const getAllUsers = async (req: CustomRequest, res: Response) => {
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

export const getUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne( { username: req.params.username } );
    console.log("Sending:\n", user);

    const filteredUserData = await filterUserData(user);

    res.json(filteredUserData);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(500).json(errorMessage);
  };
};

export const registerUser = async (req: CustomRequest, res: Response) => {
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

export const loginUser = async (req: CustomRequest, res: Response) => {
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

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

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

export const deleteUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

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
