import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const filterUserData = user => {
  const { mail: uMail, username:uUsername, name: uName } = user;
  return {
    mail: uMail,
    username: uUsername,
    name: uName
  };
};

const generateToken = id => jwt.sign(
  { id },
  process.env.JWT_SECRET,
  {
    expiresIn: "30d",
  }
);

export const getIdByUsername = async (uName) => {
  const user = await User.findOne( { username: uName } );
  return user._id;
};

export const getUsernameById = async (uId) => {
  const user = await User.findById(uId);
  return user.username;
};

export const getMe = async (req, res) => {
  const filteredUserData = filterUserData(req.user);

  res.json(filteredUserData);
}

export const getAllUsers = async (req, res) => {
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

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne( { username: req.params.username } );
    console.log("Sending:\n", user);

    const filteredUserData = filterUserData(user);

    res.json(filteredUserData);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(500).json(errorMessage);
  };
};

export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    mail: req.body.mail,
    username: req.body.username,
    password: hash,
    name: req.body.name
  });

  try {
    newUser.save();

    const filteredUserData = filterUserData(newUser);

    filteredUserData.token = generateToken(newUser._id);

    res.json(filteredUserData);

    console.log("User added");

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(500).json(errorMessage);
  };
};

export const loginUser = async (req, res) => {
  const { username: uName, password: uPassword } = req.body;

  const errorStatusCode = 401;

  const user = await User.findOne( { username: uName } );

  if (user) {
    const hashedUserPassword = user.password;

    const compareResult = await bcrypt.compare(uPassword, hashedUserPassword);

    if (compareResult) {
      const filteredUserData = filterUserData(user);

      const token = generateToken(user._id);
      filteredUserData.token = token;

      res.json(filteredUserData);

      console.log("\nLogged as " + user.username)

    } else {
      res.status(errorStatusCode).json("Wrong password");
      console.log("Wrong password")
    };

  } else {
    res.status(errorStatusCode).json("Username doesn't exists");
    console.log("Wrong username");
  };
};

export const updateUser = async (req, res) => {
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

export const deleteUser = async (req, res) => {
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
