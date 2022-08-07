import express from "express";
import {
  getAllUsers,
  getMe,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { protectionMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";


const router = express.Router();

router.get("/", protectionMiddleware, adminOnly, getAllUsers);
router.get("/me", protectionMiddleware, getMe);
router.get("/:username", protectionMiddleware, adminOnly, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/update", protectionMiddleware, updateUser);
router.delete("/delete", protectionMiddleware, deleteUser);

export const usersRouter = router;
