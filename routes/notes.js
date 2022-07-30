import express from "express";
import { protectionMiddleware } from "../middleware/authMiddleware.js";
import {
  assignUser,
  createNote,
  deleteNote,
  getNotesOfProject,
  toggleNoteState,
  updateNote
} from "../controllers/noteController.js";



const router = express.Router();

router.get("/get/:projectName", protectionMiddleware, getNotesOfProject);
router.post("/create", protectionMiddleware, createNote);
router.patch("/assign", protectionMiddleware, assignUser);
router.patch("/update", protectionMiddleware, updateNote);
router.patch("/togglestate", protectionMiddleware, toggleNoteState);
router.delete("/delete", protectionMiddleware, deleteNote);


export const notesRouter = router;
