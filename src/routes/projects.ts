import express, { Router } from "express";
import { protectionMiddleware } from "../middleware/authMiddleware"
import {
  // addParticipant,
  createProject,
  deleteProject,
  getMyProjects,
  updateProjectData
} from "../controllers/projectController";


const router : Router = express.Router();

router.get("/myprojects", protectionMiddleware, getMyProjects);
router.post("/create", protectionMiddleware, createProject);
// router.patch("/addparticipant", protectionMiddleware, addParticipant);
router.patch("/update", protectionMiddleware, updateProjectData);
router.delete("/delete/:projectName", protectionMiddleware, deleteProject);

export const projectsRouter = router;
