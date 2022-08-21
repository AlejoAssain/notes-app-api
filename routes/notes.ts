import express, { Router } from "express";
import { protectionMiddleware } from "../middleware/authMiddleware";
import {
  assignUser,
  createNote,
  deleteNote,
  getNotesOfProject,
  toggleNoteState,
  updateNote
} from "../controllers/noteController";



const router : Router = express.Router();

router.get("/get/:ownerUsername/:projectName", protectionMiddleware, getNotesOfProject);
router.post("/create", protectionMiddleware, createNote);
router.patch("/assign", protectionMiddleware, assignUser);
router.patch("/update", protectionMiddleware, updateNote);
router.patch("/togglestate", protectionMiddleware, toggleNoteState);
router.delete("/delete/:projectName/:noteName", protectionMiddleware, deleteNote);


export const notesRouter = router;
